#!/bin/bash
# db-history.sh — list bucket dump objects (storical view).
#
# Usage: bash db/scripts/db-history.sh

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$SCRIPT_DIR/oci-config.sh"

[ -z "$OCI_CLI" ] && { echo "ERROR: OCI CLI not found"; exit 2; }

echo "═══ OCI BUCKET HISTORY (oci://${OCI_NAMESPACE}/${OCI_BUCKET}) ═══"
echo ""
"$OCI_CLI" os object list --namespace-name "$OCI_NAMESPACE" --bucket-name "$OCI_BUCKET" --output json 2>/dev/null \
  | python -c "
import json, sys
try:
    d = json.load(sys.stdin)['data']
except Exception:
    print('  (empty bucket or error)')
    sys.exit(0)

# Sort by time-modified desc
d.sort(key=lambda o: o['time-modified'], reverse=True)

print(f\"  {'name':<55}  {'size':>10}  {'modified':<26}\")
print(f\"  {'-'*55}  {'-'*10}  {'-'*26}\")
for o in d:
    name = o['name']
    size_mb = round(int(o['size']) / 1024 / 1024, 1)
    modified = o['time-modified']
    print(f\"  {name:<55}  {size_mb:>7} MB  {modified}\")
print(f\"\")
print(f\"  total objects: {len(d)}\")
"
