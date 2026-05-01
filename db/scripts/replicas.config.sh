#!/bin/bash
# DEPRECATED 2026-04-29 — superseded by db/scripts/db-push.sh + db-pull.sh
# Kept for historical reference until 2026-05-31 (then remove). See db/README.md
# Configuration for multi-DBMS freshness check + alignment scripts.
# Sourced by db/scripts/check-freshness.sh and db/scripts/align-replicas.sh.
#
# Concept:
#   "Tribe" = set of DBMS instances expected to contain the same data.
#   Each tribe has exactly ONE leader (source of truth, receives writes).
#   Replicas mirror the leader and are eligible for refresh from leader.
#
# Tribes currently defined:
#   v1     = the live v1 platform (running, receives writes)
#            leader:  VM Docker container heuresys_evo_platform_db
#            replica: PC Docker container heuresys_evo_platform_db (dev mirror)
#
#   evo    = the .evo rebuild
#            leader:  VM bare-metal Postgres on port 5432
#            replica: PC Docker container heuresys_evo_db (port 5432, ephemeral)
#
# DBMS_LIST entry format (pipe-separated):
#   name|tribe|role|conn_type|conn_args|user|db
#
# conn_type values:
#   docker-via-ssh    conn_args = "<ssh_host> <container_name>"
#   docker-local      conn_args = "<container_name>"           # PC: uses DOCKER_CONTEXT_LOCAL
#   docker-local-noctx conn_args = "<container_name>"          # VM: plain docker, no context
#   postgres-via-ssh  conn_args = "<ssh_host> <port>"
#   postgres-local    conn_args = "<port>"                     # localhost direct psql
#
# Profile detection:
#   REPLICAS_CONFIG_PROFILE=pc  -> PC perspective (default; sees PC docker + VM via SSH)
#   REPLICAS_CONFIG_PROFILE=vm  -> VM perspective (self-check only; local docker + local psql)
#   REPLICAS_CONFIG_PROFILE=auto (default) -> autodetect via /etc/postgresql/* (Debian/Ubuntu Postgres pkg)

if [ "${REPLICAS_CONFIG_PROFILE:-auto}" = "auto" ]; then
  if compgen -G '/etc/postgresql/*' > /dev/null 2>&1; then
    REPLICAS_CONFIG_PROFILE="vm"
  else
    REPLICAS_CONFIG_PROFILE="pc"
  fi
fi

case "$REPLICAS_CONFIG_PROFILE" in
  pc)
    DBMS_LIST=(
      "vm-docker-v1|v1|leader|docker-via-ssh|80.225.82.207 heuresys_evo_platform_db|heuresys|heuresys_platform"
      "pc-docker-v1|v1|replica|docker-local|heuresys_evo_platform_db|heuresys|heuresys_platform"
      "vm-baremetal-evo|evo|leader|postgres-via-ssh|80.225.82.207 5432|heuresys_backup|heuresys_platform"
      "pc-docker-evo|evo|replica|docker-local|heuresys_evo_db|heuresys|heuresys_platform"
    )
    ;;
  vm)
    # VM self-check: only DBMS reachable without SSH (PC dev replica is invisible from here)
    DBMS_LIST=(
      "vm-docker-v1|v1|leader|docker-local-noctx|heuresys_evo_platform_db|heuresys|heuresys_platform"
      "vm-baremetal-evo|evo|leader|postgres-local|5432|heuresys_backup|heuresys_platform"
    )
    ;;
  *)
    echo "ERROR: unknown REPLICAS_CONFIG_PROFILE='$REPLICAS_CONFIG_PROFILE' (expected: pc|vm|auto)" >&2
    return 1 2>/dev/null || exit 1
    ;;
esac

# Default credentials and SSH key (override via env)
DEFAULT_PGPASSWORD="${PGPASSWORD:-heuresys}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/oci_recovery_ed25519}"
SSH_USER="${SSH_USER:-ubuntu}"
DOCKER_CONTEXT_LOCAL="${DOCKER_CONTEXT_LOCAL:-desktop-linux}"

# Helper: lookup a DBMS row by name; sets globals: REPLY_NAME REPLY_TRIBE REPLY_ROLE REPLY_CONN_TYPE REPLY_CONN_ARGS REPLY_USER REPLY_DB
lookup_dbms() {
  local target="$1"
  local entry
  for entry in "${DBMS_LIST[@]}"; do
    if [[ "$entry" == "$target|"* ]]; then
      IFS='|' read -r REPLY_NAME REPLY_TRIBE REPLY_ROLE REPLY_CONN_TYPE REPLY_CONN_ARGS REPLY_USER REPLY_DB <<< "$entry"
      return 0
    fi
  done
  return 1
}

# Helper: list all DBMS names
list_all_names() {
  local entry
  for entry in "${DBMS_LIST[@]}"; do
    IFS='|' read -r name _ <<< "$entry"
    echo "$name"
  done
}

# Helper: list leader name(s) for a given tribe
list_leaders_in_tribe() {
  local tribe="$1"
  local entry
  for entry in "${DBMS_LIST[@]}"; do
    IFS='|' read -r name t role _ <<< "$entry"
    if [ "$t" = "$tribe" ] && [ "$role" = "leader" ]; then
      echo "$name"
    fi
  done
}

# Helper: list replica name(s) for a given tribe
list_replicas_in_tribe() {
  local tribe="$1"
  local entry
  for entry in "${DBMS_LIST[@]}"; do
    IFS='|' read -r name t role _ <<< "$entry"
    if [ "$t" = "$tribe" ] && [ "$role" = "replica" ]; then
      echo "$name"
    fi
  done
}

# Helper: list all tribes (deduped)
list_tribes() {
  local entry tribes=()
  for entry in "${DBMS_LIST[@]}"; do
    IFS='|' read -r _ tribe _ <<< "$entry"
    tribes+=("$tribe")
  done
  printf "%s\n" "${tribes[@]}" | sort -u
}

# Helper: run a SQL query on a named DBMS, return tab-separated stdout
# Args: name sql
run_query() {
  local name="$1"
  local sql="$2"

  if ! lookup_dbms "$name"; then
    echo "ERROR: unknown DBMS '$name'" >&2
    return 1
  fi

  local pwd_var="DEFAULT_PGPASSWORD"
  local pgpwd="${!pwd_var}"

  case "$REPLY_CONN_TYPE" in
    docker-via-ssh)
      local ssh_host container
      ssh_host=$(echo "$REPLY_CONN_ARGS" | cut -d' ' -f1)
      container=$(echo "$REPLY_CONN_ARGS" | cut -d' ' -f2)
      ssh -n -i "$SSH_KEY" -o ConnectTimeout=15 -o BatchMode=yes "$SSH_USER@$ssh_host" \
        "docker exec -e PGPASSWORD=$pgpwd $container psql -U $REPLY_USER -d $REPLY_DB -tAc \"$sql\""
      ;;
    docker-local)
      local container="$REPLY_CONN_ARGS"
      MSYS_NO_PATHCONV=1 docker --context "$DOCKER_CONTEXT_LOCAL" exec -e "PGPASSWORD=$pgpwd" \
        "$container" psql -U "$REPLY_USER" -d "$REPLY_DB" -tAc "$sql"
      ;;
    docker-local-noctx)
      local container="$REPLY_CONN_ARGS"
      docker exec -e "PGPASSWORD=$pgpwd" \
        "$container" psql -U "$REPLY_USER" -d "$REPLY_DB" -tAc "$sql"
      ;;
    postgres-local)
      local port="$REPLY_CONN_ARGS"
      PGPASSWORD="$pgpwd" psql -h localhost -p "$port" -U "$REPLY_USER" -d "$REPLY_DB" -tAc "$sql"
      ;;
    postgres-via-ssh)
      local ssh_host port
      ssh_host=$(echo "$REPLY_CONN_ARGS" | cut -d' ' -f1)
      port=$(echo "$REPLY_CONN_ARGS" | cut -d' ' -f2)
      ssh -n -i "$SSH_KEY" -o ConnectTimeout=15 -o BatchMode=yes "$SSH_USER@$ssh_host" \
        "PGPASSWORD=$pgpwd psql -h localhost -p $port -U $REPLY_USER -d $REPLY_DB -tAc \"$sql\""
      ;;
    *)
      echo "ERROR: unknown conn_type '$REPLY_CONN_TYPE' for '$name'" >&2
      return 1
      ;;
  esac
}
