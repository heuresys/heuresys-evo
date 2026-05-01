#!/bin/bash
# db-push.sh — bucket-as-DB-git: pg_dump local DBMS + upload to OCI bucket + promote latest.dump
#
# Usage:
#   bash db/scripts/db-push.sh                    # full push (dump + upload + promote)
#   bash db/scripts/db-push.sh --no-promote       # upload timestamped only, don't update latest.dump
#   bash db/scripts/db-push.sh --source-tag NAME  # override autodetect source tag
#   bash db/scripts/db-push.sh --dry-run          # dump locally, don't upload
#   bash db/scripts/db-push.sh --force            # bypass soft-lock collision check
#
# Soft-lock collision check (default behavior): compares time-modified of bucket
# `latest.dump` with the local `.last-pull-stamp`. If bucket is newer than the
# last pull stamp, refuses push (suggests `evo-db pull` first or `--force`).
#
# Read-only enforcement: refuses execution from /home/ubuntu/heuresys-evo (WD #4).

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
. "$SCRIPT_DIR/oci-config.sh"

NO_PROMOTE=0
SOURCE_TAG=""
DRY_RUN=0
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --no-promote)   NO_PROMOTE=1; shift ;;
    --source-tag)   SOURCE_TAG="$2"; shift 2 ;;
    --dry-run)      DRY_RUN=1; shift ;;
    --force)        FORCE=1; shift ;;
    -h|--help)
      sed -n '2,15p' "$0" | sed 's/^# //'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

# === Read-only WD enforcement ===
if is_readonly_wd; then
  fail "WD is read-only per design ($(pwd -P)). Pull is allowed, push is not. See db/README.md"
fi

# === Detect target ===
TARGET="$(detect_local_dbms)"
[ "$TARGET" = "unknown" ] && fail "could not detect local DBMS target"
[ -z "$SOURCE_TAG" ] && SOURCE_TAG="$TARGET"
log "push START — target=$TARGET source_tag=$SOURCE_TAG"

# === Pre-flight: OCI CLI ===
[ -z "$OCI_CLI" ] && fail "OCI CLI not found. Install via 'pip install --user oci-cli' on this machine."

# === Soft-lock check ===
STAMP_FILE="$REPO_ROOT/db/.last-pull-stamp"
if [ "$FORCE" != "1" ] && [ "$DRY_RUN" != "1" ]; then
  BUCKET_MODIFIED="$(oci_object_modified latest.dump)"
  if [ -z "$BUCKET_MODIFIED" ]; then
    log "  bucket has no latest.dump yet → first push, proceed"
  elif [ -f "$STAMP_FILE" ]; then
    LOCAL_STAMP="$(cat "$STAMP_FILE")"
    # Compare ISO8601 strings lexicographically (works for same timezone format)
    if [ "$BUCKET_MODIFIED" \> "$LOCAL_STAMP" ]; then
      log "  ❌ SOFT-LOCK: bucket latest.dump is newer than your last pull"
      log "    bucket: $BUCKET_MODIFIED"
      log "    local : $LOCAL_STAMP"
      log "    Suggestion: 'evo-db pull' first to get latest, then re-attempt push."
      log "    Or use --force to overwrite the bucket with your local state."
      exit 3
    fi
  else
    log "  ⚠️  no .last-pull-stamp found — no collision protection on first push, proceed"
  fi
fi

# === Local dump ===
TS="$(date -u +%Y%m%dT%H%M%SZ)"
LOCAL_DUMP="$REPO_ROOT/backups/local/heuresys_platform_${TS}.dump"
mkdir -p "$REPO_ROOT/backups/local"

log "  pg_dump → $LOCAL_DUMP"
pg_dump_target "$TARGET" --format=custom --compress=9 --no-owner --no-privileges > "$LOCAL_DUMP" \
  || fail "pg_dump failed"

DUMP_SIZE=$(du -h "$LOCAL_DUMP" | cut -f1)
DUMP_BYTES=$(stat -c%s "$LOCAL_DUMP" 2>/dev/null || stat -f%z "$LOCAL_DUMP" 2>/dev/null)
log "  dump size: $DUMP_SIZE ($DUMP_BYTES bytes)"

# Smoke check: file > 50MB, custom format header
if [ "$DUMP_BYTES" -lt 52428800 ]; then
  fail "dump too small ($DUMP_SIZE) — likely corrupted"
fi
HEAD_MAGIC=$(head -c 5 "$LOCAL_DUMP")
if [ "$HEAD_MAGIC" != "PGDMP" ]; then
  fail "dump file does not start with PGDMP magic (found '$HEAD_MAGIC')"
fi

# === Dry-run exit ===
if [ "$DRY_RUN" = "1" ]; then
  log "  --dry-run: skip upload"
  log "DONE (dry-run)"
  exit 0
fi

# === Upload timestamped ===
OBJECT_NAME="dump_${SOURCE_TAG}_${TS}.dump"
log "  upload → oci://${OCI_NAMESPACE}/${OCI_BUCKET}/${OBJECT_NAME}"
oci_upload "$LOCAL_DUMP" "$OBJECT_NAME" >/dev/null 2>&1 || fail "OCI upload failed"
log "  upload OK"

# === Promote latest.dump ===
if [ "$NO_PROMOTE" != "1" ]; then
  log "  promote → latest.dump"
  oci_promote_latest "$OBJECT_NAME" "$LOCAL_DUMP" || fail "promote latest.dump failed"
  # Update stamp
  NEW_STAMP="$(oci_object_modified latest.dump)"
  echo "$NEW_STAMP" > "$STAMP_FILE"
  log "  .last-pull-stamp updated to $NEW_STAMP"
fi

# === Local retention: keep last 7 ===
KEEP=7
TOTAL=$(find "$REPO_ROOT/backups/local" -maxdepth 1 -name "heuresys_platform_*.dump" -type f | wc -l)
if [ "$TOTAL" -gt "$KEEP" ]; then
  TO_DELETE=$(find "$REPO_ROOT/backups/local" -maxdepth 1 -name "heuresys_platform_*.dump" -type f -printf "%T@ %p\n" | sort -n | head -n -"$KEEP" | cut -d' ' -f2-)
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    log "  retention: rm $(basename "$f")"
    rm -f "$f"
  done <<< "$TO_DELETE"
fi

log "push DONE"
