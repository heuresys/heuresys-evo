#!/bin/bash
# db-status.sh — read-only status: local DBMS vs OCI bucket latest.dump
#
# Usage: bash db/scripts/db-status.sh

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
. "$SCRIPT_DIR/oci-config.sh"

TARGET="$(detect_local_dbms)"
log "status — target=$TARGET"

# === Local DBMS ===
echo ""
echo "═══ LOCAL DBMS ($TARGET) ═══"
LOCAL_MIG=$(psql_target "$TARGET" "SELECT COUNT(*)||'/'||MAX(version) FROM schema_migrations;" 2>/dev/null | tr -d '[:space:]\r')
LOCAL_TENANTS=$(psql_target "$TARGET" "SELECT COUNT(*) FROM tenants;" 2>/dev/null | tr -d '[:space:]\r')
LOCAL_EMPLOYEES=$(psql_target "$TARGET" "SELECT COUNT(*) FROM employees;" 2>/dev/null | tr -d '[:space:]\r')
LOCAL_USERS=$(psql_target "$TARGET" "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d '[:space:]\r')
LOCAL_AUDIT_MAX=$(psql_target "$TARGET" "SELECT COALESCE(MAX(created_at)::text, 'none') FROM audit_logs;" 2>/dev/null | tr -d '[:space:]\r')
echo "  schema_migrations  : $LOCAL_MIG"
echo "  tenants            : $LOCAL_TENANTS"
echo "  employees          : $LOCAL_EMPLOYEES"
echo "  users              : $LOCAL_USERS"
echo "  audit_logs MAX(ts) : $LOCAL_AUDIT_MAX"

# === Bucket latest.dump ===
echo ""
echo "═══ OCI BUCKET (latest.dump) ═══"
if [ -z "$OCI_CLI" ]; then
  echo "  ⚠️  OCI CLI not installed locally"
else
  BUCKET_MOD=$(oci_object_modified latest.dump)
  if [ -z "$BUCKET_MOD" ]; then
    echo "  ⚠️  latest.dump not present in bucket"
  else
    BUCKET_INFO=$("$OCI_CLI" os object head --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" --name latest.dump 2>/dev/null | python -c "
import json, sys
d = json.load(sys.stdin)
size_mb = round(int(d.get('content-length', 0)) / 1024 / 1024, 1)
print(f\"  size               : {size_mb} MB\")
print(f\"  last-modified      : {d.get('last-modified', '')}\")
print(f\"  etag               : {d.get('etag', '')[:12]}...\")
" 2>/dev/null)
    echo "$BUCKET_INFO"
  fi
fi

# === Stamp ===
echo ""
echo "═══ LOCAL .last-pull-stamp ═══"
STAMP_FILE="$REPO_ROOT/db/.last-pull-stamp"
if [ -f "$STAMP_FILE" ]; then
  echo "  $(cat "$STAMP_FILE")"
else
  echo "  (not set — never pulled, or fresh repo)"
fi

# === Suggestion ===
echo ""
echo "═══ SUGGESTION ═══"
if [ -n "${BUCKET_MOD:-}" ] && [ -f "$STAMP_FILE" ]; then
  LOCAL_STAMP="$(cat "$STAMP_FILE")"
  if [ "$BUCKET_MOD" \> "$LOCAL_STAMP" ]; then
    echo "  ⚠️  bucket is NEWER than your last pull → run 'evo-db pull' to refresh local DBMS"
    echo "       (a future 'evo-db push' would be soft-locked)"
  else
    echo "  ✅ local stamp matches or exceeds bucket — push allowed"
  fi
elif [ -z "${BUCKET_MOD:-}" ]; then
  echo "  bucket has no latest.dump yet — first 'evo-db push' will create it"
elif [ ! -f "$STAMP_FILE" ]; then
  echo "  no local stamp — first run? 'evo-db pull' to align, then proceed."
fi

echo ""
