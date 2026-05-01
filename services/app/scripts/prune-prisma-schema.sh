#!/bin/bash
# prune-prisma-schema.sh — same logic as services/api-gateway, with a
# different allowlist file path (relative to this package).
# See services/api-gateway/scripts/prune-prisma-schema.sh for design notes.

set -euo pipefail

SCHEMA="prisma/schema.prisma"
ALLOWLIST="prisma/allowlist.txt"

if [ ! -f "$SCHEMA" ] || [ ! -f "$ALLOWLIST" ]; then
  echo "[prune] ERROR: missing $SCHEMA or $ALLOWLIST" >&2
  exit 1
fi

ALLOWED=$(grep -v '^\s*#' "$ALLOWLIST" | grep -v '^\s*$' | tr -d '\r' | paste -sd, -)
if [ -z "$ALLOWED" ]; then
  echo "[prune] ERROR: allowlist is empty." >&2
  exit 1
fi
echo "[prune] Allowlist: $ALLOWED"

TMP1="${SCHEMA}.phase1.tmp"

awk -v allowed="$ALLOWED" '
  BEGIN {
    n = split(allowed, arr, ",")
    for (i = 1; i <= n; i++) keep[arr[i]] = 1
    in_block = 0; block_kind = ""; block_name = ""; buf = ""; depth = 0
  }
  function flush_block() {
    if (block_kind == "model" || block_kind == "view") {
      if (keep[block_name]) printf "%s", buf
    } else { printf "%s", buf }
    buf = ""; block_kind = ""; block_name = ""; in_block = 0; depth = 0
  }
  /^(model|view|enum|generator|datasource|type)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]*\{/ {
    if (in_block) flush_block()
    in_block = 1; block_kind = $1; block_name = $2; buf = $0 "\n"; depth = 1
    next
  }
  in_block {
    buf = buf $0 "\n"
    open_count = gsub(/\{/, "{", $0); close_count = gsub(/\}/, "}", $0)
    depth += open_count - close_count
    if (depth <= 0) flush_block()
    next
  }
  { print }
  END { if (in_block) flush_block() }
' "$SCHEMA" > "$TMP1"

KEPT_MODELS=$(grep -cE '^model[[:space:]]+' "$TMP1" || true)
TOTAL_BEFORE=$(grep -cE '^model[[:space:]]+' "$SCHEMA" || true)
echo "[prune] Phase 1 — Models: $TOTAL_BEFORE → $KEPT_MODELS"

TMP2="${SCHEMA}.phase2.tmp"

EXTRA=$(grep -E '^(enum|type)[[:space:]]+' "$TMP1" | awk '{print $2}' | paste -sd, - || true)
ALL_TYPES_OK="$ALLOWED"
if [ -n "$EXTRA" ]; then ALL_TYPES_OK="$ALL_TYPES_OK,$EXTRA"; fi
echo "[prune] Phase 2 — allowed referent types: $ALL_TYPES_OK"

awk -v allowed="$ALL_TYPES_OK" '
  BEGIN {
    n = split(allowed, arr, ",")
    for (i = 1; i <= n; i++) keep[arr[i]] = 1
    scalars["String"] = 1; scalars["Boolean"] = 1; scalars["Int"] = 1
    scalars["BigInt"] = 1; scalars["Float"] = 1; scalars["Decimal"] = 1
    scalars["DateTime"] = 1; scalars["Json"] = 1; scalars["Bytes"] = 1
    scalars["Unsupported"] = 1
    in_model = 0; stripped = 0
  }
  /^(model|view)[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]*\{/ { in_model = 1; print; next }
  /^\}/ && in_model { in_model = 0; print; next }
  in_model {
    if (match($0, /^[[:space:]]+[A-Za-z_][A-Za-z0-9_]*[[:space:]]+([A-Za-z_][A-Za-z0-9_]*)(\[\])?(\??)/, m)) {
      typ = m[1]
      if (typ in scalars) { print; next }
      if (keep[typ]) { print; next }
      stripped++
      next
    }
    print; next
  }
  { print }
  END { print "[prune] Phase 2 stripped " stripped " dangling relation field(s)." > "/dev/stderr" }
' "$TMP1" > "$TMP2"

mv "$TMP2" "$SCHEMA"
rm -f "$TMP1"

KEPT_FINAL=$(grep -cE '^model[[:space:]]+' "$SCHEMA" || true)
echo "[prune] Done. Final models: $KEPT_FINAL."
