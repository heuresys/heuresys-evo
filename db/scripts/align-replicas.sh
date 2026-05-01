#!/bin/bash
# DEPRECATED 2026-04-29 — superseded by db/scripts/db-push.sh + db-pull.sh
# Kept for historical reference until 2026-05-31 (then remove). See db/README.md
# Align stale replicas to their tribe's leader (DESTRUCTIVE on the replica).
#
# Usage:
#   bash db/scripts/align-replicas.sh                       # dry-run (default, safe — only reports)
#   bash db/scripts/align-replicas.sh --align <replica>     # align one named replica
#   bash db/scripts/align-replicas.sh --align-all           # iterate stale replicas, prompt for each
#   bash db/scripts/align-replicas.sh --align-all --force   # iterate stale, no prompt (DANGEROUS)
#
# Always uses the configured leader of each tribe as source.
# Never modifies leaders.
#
# Strategy (per replica):
#   1. pg_dump from leader (custom format, no-owner, no-privileges)
#   2. drop + recreate the database on the replica (clean state)
#   3. CREATE EXTENSION vector
#   4. pg_restore on the replica
#   5. ALTER OWNER multi-schema -> replica's app role
#   6. Recreate ivfflat vector indices with bumped maintenance_work_mem
#
# Configuration: db/scripts/replicas.config.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
. "$SCRIPT_DIR/replicas.config.sh"

MODE="dry-run"
TARGET=""
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --align)        MODE="align-one"; TARGET="${2:-}"; shift 2 ;;
    --align-all)    MODE="align-all"; shift ;;
    --force)        FORCE=1; shift ;;
    --dry-run)      MODE="dry-run"; shift ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# //'
      exit 0
      ;;
    *)
      echo "ERROR: unknown arg '$1'" >&2
      exit 2
      ;;
  esac
done

# === Pre-flight: run check-freshness.sh and capture exit code ===
echo "Running freshness check..."
if bash "$SCRIPT_DIR/check-freshness.sh"; then
  echo ""
  echo "✅ All replicas already aligned. Nothing to do."
  exit 0
fi
echo ""
echo "──────────────────────────────────────────────────"

if [ "$MODE" = "dry-run" ]; then
  echo "Mode: DRY-RUN (no changes will be made)."
  echo "To actually align, re-run with: --align <name>  OR  --align-all"
  exit 0
fi

# === Confirm destructive action ===
prompt_yes() {
  local msg="$1"
  if [ "$FORCE" -eq 1 ]; then return 0; fi
  read -p "$msg [yes/N] " ans
  [ "$ans" = "yes" ]
}

# === Align one replica from its tribe leader ===
align_replica() {
  local replica_name="$1"
  if ! lookup_dbms "$replica_name"; then
    echo "ERROR: unknown replica '$replica_name'" >&2
    return 1
  fi
  local replica_tribe="$REPLY_TRIBE"
  local replica_role="$REPLY_ROLE"
  local replica_user="$REPLY_USER"
  local replica_db="$REPLY_DB"
  local replica_conn_type="$REPLY_CONN_TYPE"
  local replica_conn_args="$REPLY_CONN_ARGS"

  if [ "$replica_role" != "replica" ]; then
    echo "ERROR: '$replica_name' is a $replica_role, not a replica. Aborting." >&2
    return 1
  fi

  # Find leader of this tribe
  local leader_name
  leader_name=$(list_leaders_in_tribe "$replica_tribe" | head -1)
  if [ -z "$leader_name" ]; then
    echo "ERROR: no leader for tribe '$replica_tribe'" >&2
    return 1
  fi

  echo ""
  echo "──────────────────────────────────────────────────"
  echo "Align: $replica_name  ←  $leader_name"
  echo "Tribe: $replica_tribe"
  echo "Action: drop+restore $replica_db on $replica_name, sourced from $leader_name"
  echo "──────────────────────────────────────────────────"

  if ! prompt_yes "Proceed with this alignment?"; then
    echo "  Skipped (user declined)."
    return 0
  fi

  # === Step 1: pg_dump from leader to a transit file ===
  # The transit file lives where the leader can write it.
  # Strategy: dump to /tmp inside the leader's environment, then move it to where the replica needs.
  local timestamp
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  local dumpfile_name="align_${replica_tribe}_${timestamp}.dump"

  echo "  [1/5] pg_dump from leader $leader_name..."
  lookup_dbms "$leader_name"
  local leader_user="$REPLY_USER"
  local leader_db="$REPLY_DB"
  local leader_conn_type="$REPLY_CONN_TYPE"
  local leader_conn_args="$REPLY_CONN_ARGS"
  local leader_pwd="$DEFAULT_PGPASSWORD"

  case "$leader_conn_type" in
    docker-via-ssh)
      local lh lc
      lh=$(echo "$leader_conn_args" | cut -d' ' -f1)
      lc=$(echo "$leader_conn_args" | cut -d' ' -f2)
      ssh -i "$SSH_KEY" "$SSH_USER@$lh" "docker exec -e PGPASSWORD=$leader_pwd $lc pg_dump -U $leader_user -d $leader_db --format=custom --compress=9 --no-owner --no-privileges -f /tmp/$dumpfile_name && docker cp $lc:/tmp/$dumpfile_name /home/ubuntu/$dumpfile_name"
      ;;
    docker-local)
      local lc="$leader_conn_args"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$leader_pwd" "$lc" \
        pg_dump -U "$leader_user" -d "$leader_db" --format=custom --compress=9 --no-owner --no-privileges -f "/tmp/$dumpfile_name"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" cp "$lc:/tmp/$dumpfile_name" "/tmp/$dumpfile_name"
      ;;
    postgres-via-ssh)
      local lh lp
      lh=$(echo "$leader_conn_args" | cut -d' ' -f1)
      lp=$(echo "$leader_conn_args" | cut -d' ' -f2)
      ssh -i "$SSH_KEY" "$SSH_USER@$lh" "PGPASSWORD=$leader_pwd pg_dump -h localhost -p $lp -U $leader_user -d $leader_db --format=custom --compress=9 --no-owner --no-privileges -f /home/ubuntu/$dumpfile_name"
      ;;
  esac

  # === Step 2: drop + recreate DB on replica ===
  echo "  [2/5] drop + recreate DB on $replica_name..."
  case "$replica_conn_type" in
    docker-via-ssh)
      local rh rc
      rh=$(echo "$replica_conn_args" | cut -d' ' -f1)
      rc=$(echo "$replica_conn_args" | cut -d' ' -f2)
      ssh -i "$SSH_KEY" "$SSH_USER@$rh" "
        docker exec -e PGPASSWORD=$DEFAULT_PGPASSWORD $rc psql -U $replica_user -d postgres -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$replica_db' AND pid <> pg_backend_pid();\" >/dev/null
        docker exec -e PGPASSWORD=$DEFAULT_PGPASSWORD $rc psql -U $replica_user -d postgres -c \"DROP DATABASE IF EXISTS $replica_db;\"
        docker exec -e PGPASSWORD=$DEFAULT_PGPASSWORD $rc psql -U $replica_user -d postgres -c \"CREATE DATABASE $replica_db OWNER $replica_user;\"
        docker exec -e PGPASSWORD=$DEFAULT_PGPASSWORD $rc psql -U $replica_user -d $replica_db -c \"CREATE EXTENSION IF NOT EXISTS vector;\"
      "
      ;;
    docker-local)
      local rc="$replica_conn_args"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$DEFAULT_PGPASSWORD" "$rc" \
        psql -U "$replica_user" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$replica_db' AND pid <> pg_backend_pid();" >/dev/null
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$DEFAULT_PGPASSWORD" "$rc" \
        psql -U "$replica_user" -d postgres -c "DROP DATABASE IF EXISTS $replica_db;"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$DEFAULT_PGPASSWORD" "$rc" \
        psql -U "$replica_user" -d postgres -c "CREATE DATABASE $replica_db OWNER $replica_user;"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$DEFAULT_PGPASSWORD" "$rc" \
        psql -U "$replica_user" -d "$replica_db" -c "CREATE EXTENSION IF NOT EXISTS vector;"
      # Copy the dump file into the local container
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" cp "/tmp/$dumpfile_name" "$rc:/tmp/$dumpfile_name"
      ;;
    postgres-via-ssh)
      local rh
      rh=$(echo "$replica_conn_args" | cut -d' ' -f1)
      ssh -i "$SSH_KEY" "$SSH_USER@$rh" "
        sudo -u postgres psql -c \"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$replica_db' AND pid <> pg_backend_pid();\" >/dev/null
        sudo -u postgres dropdb --if-exists $replica_db
        sudo -u postgres createdb -O $replica_user $replica_db
        sudo -u postgres psql -d $replica_db -c \"CREATE EXTENSION IF NOT EXISTS vector;\"
      "
      ;;
  esac

  # === Step 3: pg_restore on replica ===
  echo "  [3/5] pg_restore on $replica_name..."
  case "$replica_conn_type" in
    docker-via-ssh)
      local rh rc
      rh=$(echo "$replica_conn_args" | cut -d' ' -f1)
      rc=$(echo "$replica_conn_args" | cut -d' ' -f2)
      ssh -i "$SSH_KEY" "$SSH_USER@$rh" "docker cp /home/ubuntu/$dumpfile_name $rc:/tmp/$dumpfile_name && docker exec -e PGPASSWORD=$DEFAULT_PGPASSWORD $rc pg_restore -U $replica_user -d $replica_db --no-owner --no-privileges --jobs=4 /tmp/$dumpfile_name 2>&1 | grep -E 'error|warning' | head -10 || true"
      ;;
    docker-local)
      local rc="$replica_conn_args"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$DEFAULT_PGPASSWORD" "$rc" \
        pg_restore -U "$replica_user" -d "$replica_db" --no-owner --no-privileges --jobs=4 "/tmp/$dumpfile_name" 2>&1 | grep -E "error|warning" | head -10 || true
      ;;
    postgres-via-ssh)
      local rh
      rh=$(echo "$replica_conn_args" | cut -d' ' -f1)
      # Same dance as restore-baseline.sh: copy to /tmp + chown postgres + restore as postgres super
      ssh -i "$SSH_KEY" "$SSH_USER@$rh" "
        sudo cp /home/ubuntu/$dumpfile_name /tmp/$dumpfile_name
        sudo chown postgres:postgres /tmp/$dumpfile_name
        sudo -u postgres bash -c 'PGOPTIONS=\"-c maintenance_work_mem=256MB\" pg_restore --dbname=$replica_db --no-owner --no-privileges --jobs=4 /tmp/$dumpfile_name 2>&1 | grep -E \"error|warning\" | head -10 || true'
        sudo rm -f /tmp/$dumpfile_name
      "
      ;;
  esac

  # === Step 4: ALTER OWNER multi-schema ===
  echo "  [4/5] ALTER OWNER multi-schema on $replica_name..."
  if [ "$replica_conn_type" = "postgres-via-ssh" ]; then
    local rh
    rh=$(echo "$replica_conn_args" | cut -d' ' -f1)
    ssh -i "$SSH_KEY" "$SSH_USER@$rh" "
      sudo -u postgres psql -d $replica_db <<'SQL'
DO \$\$
DECLARE s record; r record;
BEGIN
  FOR s IN SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname NOT IN ('information_schema') LOOP
    IF s.nspname <> 'public' THEN
      BEGIN EXECUTE 'ALTER SCHEMA ' || quote_ident(s.nspname) || ' OWNER TO $replica_user'; EXCEPTION WHEN OTHERS THEN NULL; END;
    END IF;
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = s.nspname LOOP
      EXECUTE 'ALTER TABLE ' || quote_ident(s.nspname) || '.' || quote_ident(r.tablename) || ' OWNER TO $replica_user';
    END LOOP;
    FOR r IN SELECT sequence_name AS name FROM information_schema.sequences WHERE sequence_schema = s.nspname LOOP
      EXECUTE 'ALTER SEQUENCE ' || quote_ident(s.nspname) || '.' || quote_ident(r.name) || ' OWNER TO $replica_user';
    END LOOP;
  END LOOP;
END \$\$;
SQL
"
  fi
  # docker-* targets: heuresys is already superuser+bypassrls, ALTER OWNER not needed

  # === Step 5: recreate vector indices (defensive) ===
  echo "  [5/5] verify/recreate vector indices on $replica_name..."
  run_query "$replica_name" "SET maintenance_work_mem = '256MB'; CREATE INDEX IF NOT EXISTS idx_esco_skills_embedding_en ON public.esco_skills USING ivfflat (embedding_en vector_cosine_ops) WITH (lists=118) WHERE (embedding_en IS NOT NULL); CREATE INDEX IF NOT EXISTS idx_esco_skills_embedding_it ON public.esco_skills USING ivfflat (embedding_it vector_cosine_ops) WITH (lists=118) WHERE (embedding_it IS NOT NULL);" >/dev/null 2>&1 || true

  # === Cleanup transit dump on the dump source side ===
  case "$leader_conn_type" in
    docker-via-ssh|postgres-via-ssh)
      local lh
      lh=$(echo "$leader_conn_args" | cut -d' ' -f1)
      ssh -i "$SSH_KEY" "$SSH_USER@$lh" "rm -f /home/ubuntu/$dumpfile_name" || true
      ;;
    docker-local)
      rm -f "/tmp/$dumpfile_name" || true
      ;;
  esac

  echo "  ✅ $replica_name aligned."
}

# === Dispatch ===
case "$MODE" in
  align-one)
    if [ -z "$TARGET" ]; then echo "ERROR: --align requires a replica name" >&2; exit 2; fi
    align_replica "$TARGET"
    ;;
  align-all)
    while IFS= read -r tribe; do
      while IFS= read -r replica_name; do
        # Re-check this specific replica vs leader and skip if aligned
        # (Simple approach: align all replicas listed; user can interrupt.)
        align_replica "$replica_name"
      done < <(list_replicas_in_tribe "$tribe")
    done < <(list_tribes)
    ;;
esac

echo ""
echo "Re-running freshness check to confirm alignment..."
bash "$SCRIPT_DIR/check-freshness.sh"
