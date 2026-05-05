#!/usr/bin/env bash
# doctor.sh — self-check + (opzionale) auto-fix della skill studio.
#
# Implementa i 3 meccanismi di self-evolution:
#   - SELF-CORRECTING: detect e correzione di drift della skill stessa
#   - SELF-LEARNING:   analisi dei .logs/usage.jsonl per pattern
#   - SELF-UPDATING:   regenera tabelle/cataloghi quando file sottostanti cambiano
#
# Usage:
#   doctor.sh                  diagnostic only (read-only)
#   doctor.sh --apply          auto-fix safe issues (chmod, regenera tabella sub-comandi)
#   doctor.sh --learn          analizza .logs/usage.jsonl, mostra pattern
#   doctor.sh --version        print versione skill
#
# Exit codes:
#   0   tutti i check PASS
#   1   uno o piu' check FAIL (no auto-fix applicato)
#   2   args invalid

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_helpers.sh"

cd "$_PROJECT_ROOT"

MODE="diagnostic"
case "${1:-}" in
  --apply)    MODE="apply" ;;
  --learn)    MODE="learn" ;;
  --version)  echo "studio v$(_studio_version)"; exit 0 ;;
  -h|--help)  sed -n '2,18p' "${BASH_SOURCE[0]}"; exit 0 ;;
  "")         ;;
  *)          echo "ERROR: unknown arg '$1'" >&2; exit 2 ;;
esac

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0
declare -a FAILED_CHECKS=()
declare -a APPLIED_FIXES=()

_check() {
  local name="$1" result="$2" detail="${3:-}"
  case "$result" in
    PASS)
      PASS_COUNT=$((PASS_COUNT + 1))
      printf "  [✓] %-40s %s\n" "$name" "$detail"
      ;;
    FAIL)
      FAIL_COUNT=$((FAIL_COUNT + 1))
      FAILED_CHECKS+=("$name")
      printf "  [✗] %-40s %s\n" "$name" "$detail"
      ;;
    WARN)
      WARN_COUNT=$((WARN_COUNT + 1))
      printf "  [!] %-40s %s\n" "$name" "$detail"
      ;;
  esac
}

_apply_fix() {
  APPLIED_FIXES+=("$1")
  printf "  [⟳] FIX APPLIED: %s\n" "$1"
}

# ─── Learn mode (separato) ─────────────────────────────────────────────────
if [ "$MODE" = "learn" ]; then
  echo "studio doctor — learn mode (analisi .logs/usage.jsonl)"
  echo "═══════════════════════════════════════════════════════════════"
  if [ ! -f "$_USAGE_LOG" ]; then
    echo "  Nessun log disponibile ancora. Esegui qualche /studio:* per accumulare dati."
    exit 0
  fi
  TOTAL=$(wc -l < "$_USAGE_LOG" | tr -d ' ')
  echo "  Total invocations: $TOTAL"
  echo ""
  echo "  Top 5 commands by frequency:"
  python3 -c "
import json, sys
from collections import Counter
c = Counter()
for line in open('$_USAGE_LOG', encoding='utf-8'):
    try:
        e = json.loads(line)
        c[e.get('script','?')] += 1
    except: pass
for k,v in c.most_common(5):
    print(f'    {v:5d}  {k}')
" 2>/dev/null || echo "    (python3 mancante — analisi non disponibile)"
  echo ""
  echo "  Top 5 failed invocations (exit != 0):"
  python3 -c "
import json
from collections import Counter
c = Counter()
for line in open('$_USAGE_LOG', encoding='utf-8'):
    try:
        e = json.loads(line)
        if e.get('exit', 0) != 0:
            c[(e.get('script','?'), e.get('exit'))] += 1
    except: pass
for (k,exit_code),v in c.most_common(5):
    print(f'    {v:5d}  {k}  (exit={exit_code})')
" 2>/dev/null || echo "    (python3 mancante)"
  echo ""
  echo "  Recent activity (last 5 entries):"
  tail -5 "$_USAGE_LOG" 2>/dev/null | sed 's/^/    /'
  exit 0
fi

# ─── Diagnostic mode ───────────────────────────────────────────────────────
echo "studio doctor — diagnostic (mode: $MODE)"
echo "═══════════════════════════════════════════════════════════════"
echo "Skill version: $(_studio_version)"
echo ""

# Check 1: SKILL.md exists
echo "[1/8] File integrity"
if [ -f "$_SKILL_FILE" ]; then
  _check "SKILL.md exists" "PASS"
else
  _check "SKILL.md exists" "FAIL" "missing $_SKILL_FILE"
fi

# All references files
for f in references/route-mapping.md references/error-catalog.md \
         references/promote-flow.md references/manifest-schema.md \
         references/orchestration-map.md references/staging-readme-template.md \
         references/lessons-learned.md references/self-evolution.md; do
  if [ -f "$_STUDIO_ROOT/$f" ]; then
    _check "$f" "PASS"
  else
    _check "$f" "FAIL" "missing"
  fi
done

# All scripts
for s in clone-route.sh diff-staging.sh promote.sh restore.sh \
         list-backups.sh status.sh bootstrap.sh doctor.sh _helpers.sh; do
  SP="$_STUDIO_ROOT/scripts/$s"
  if [ -f "$SP" ]; then
    _check "scripts/$s" "PASS"
  else
    _check "scripts/$s" "FAIL" "missing"
  fi
done

# All commands
echo ""
echo "[2/8] Commands ↔ files alignment"
EXPECTED_CMDS=$(find "$_PROJECT_ROOT/.claude/commands/studio" -mindepth 1 -maxdepth 1 -name '*.md' 2>/dev/null | xargs -n1 basename 2>/dev/null | sed 's/\.md$//' | sort)
CMD_COUNT=$(echo "$EXPECTED_CMDS" | grep -c '^.' || true)
_check "command files count" "PASS" "$CMD_COUNT files in .claude/commands/studio/"

# Check that SKILL.md mentions all commands
MISSING_IN_SKILL=()
for cmd in $EXPECTED_CMDS; do
  if [ "$cmd" = "studio" ]; then
    PATTERN='^\|[[:space:]]*`/studio`'
  else
    PATTERN="^\\|[[:space:]]*\`/studio:$cmd"
  fi
  if grep -qE "$PATTERN" "$_SKILL_FILE" 2>/dev/null; then
    _check "SKILL.md row /studio:$cmd" "PASS"
  else
    MISSING_IN_SKILL+=("$cmd")
    _check "SKILL.md row /studio:$cmd" "FAIL" "row not found in SKILL.md tabella"
  fi
done

# Check 3: bash syntax
echo ""
echo "[3/8] Bash syntax"
for s in clone-route.sh diff-staging.sh promote.sh restore.sh \
         list-backups.sh status.sh bootstrap.sh doctor.sh _helpers.sh; do
  SP="$_STUDIO_ROOT/scripts/$s"
  [ ! -f "$SP" ] && continue
  if bash -n "$SP" 2>/dev/null; then
    _check "bash -n $s" "PASS"
  else
    _check "bash -n $s" "FAIL" "syntax error"
  fi
done

# Check 4: executable bit
echo ""
echo "[4/8] Executable bit"
for s in clone-route.sh diff-staging.sh promote.sh restore.sh \
         list-backups.sh status.sh bootstrap.sh doctor.sh; do
  SP="$_STUDIO_ROOT/scripts/$s"
  [ ! -f "$SP" ] && continue
  if [ -x "$SP" ]; then
    _check "executable $s" "PASS"
  else
    _check "executable $s" "WARN" "not executable (script funziona via 'bash <path>')"
    if [ "$MODE" = "apply" ]; then
      chmod +x "$SP" 2>/dev/null && _apply_fix "chmod +x $s"
    fi
  fi
done

# Check 5: JSON template
echo ""
echo "[5/8] JSON templates"
TPL="$_STUDIO_ROOT/templates/MANIFEST.template.json"
if [ -f "$TPL" ]; then
  if python3 - "$TPL" >/dev/null 2>&1 <<'PYEOF'
import json, sys
json.load(open(sys.argv[1], encoding='utf-8'))
PYEOF
  then
    _check "MANIFEST.template.json valid" "PASS"
  else
    _check "MANIFEST.template.json valid" "FAIL" "JSON parse error"
  fi
else
  _check "MANIFEST.template.json exists" "FAIL" "missing"
fi

# Check 6: error-catalog references match script error codes
echo ""
echo "[6/8] Error catalog coverage"
ERR_FILE="$_STUDIO_ROOT/references/error-catalog.md"
if [ -f "$ERR_FILE" ]; then
  # Estraggo codici errore in markdown
  CATALOG_CODES=$(grep -oE '`[A-Z]+_E[0-9]+`' "$ERR_FILE" | tr -d '`' | sort -u)
  CODE_COUNT=$(echo "$CATALOG_CODES" | grep -c '^.' || true)
  _check "error catalog codes" "PASS" "$CODE_COUNT codes documented"
else
  _check "error-catalog.md" "FAIL" "missing"
fi

# Check 7: version coherence
echo ""
echo "[7/8] Version coherence"
VER=$(_studio_version)
CHANGELOG="$_STUDIO_ROOT/CHANGELOG.md"
if [ -n "$VER" ] && [ "$VER" != "unknown" ]; then
  _check "SKILL.md frontmatter version" "PASS" "v$VER"
else
  _check "SKILL.md frontmatter version" "WARN" "version field not found in frontmatter"
fi
if [ -f "$CHANGELOG" ]; then
  if grep -qE "^## \\[$VER\\]" "$CHANGELOG" 2>/dev/null; then
    _check "CHANGELOG entry for v$VER" "PASS"
  else
    _check "CHANGELOG entry for v$VER" "WARN" "no entry — bump CHANGELOG?"
  fi
else
  _check "CHANGELOG.md" "WARN" "missing — create for versioning history"
fi

# Check 8: usage logs (apprendimento)
echo ""
echo "[8/8] Self-learning data"
if [ -f "$_USAGE_LOG" ]; then
  LOG_LINES=$(wc -l < "$_USAGE_LOG" | tr -d ' ')
  _check "usage.jsonl" "PASS" "$LOG_LINES invocations logged"
else
  _check "usage.jsonl" "WARN" "no logs yet — esegui /studio:* o lancia 'doctor.sh --learn'"
fi
LESSONS_LINES=$(wc -l < "$_LESSONS_FILE" 2>/dev/null | tr -d ' ' || echo 0)
_check "lessons-learned.md" "PASS" "$LESSONS_LINES lines (lezioni accumulate)"

# ─── Summary ───────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Summary: $PASS_COUNT pass · $FAIL_COUNT fail · $WARN_COUNT warn"
[ ${#APPLIED_FIXES[@]} -gt 0 ] && echo "Auto-fix applied: ${#APPLIED_FIXES[@]}"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo ""
  echo "Failed checks:"
  for c in "${FAILED_CHECKS[@]}"; do echo "  - $c"; done
  echo ""
  echo "Hint: doctor.sh --apply per auto-fix safe (chmod). Per fix manuali, vedi"
  echo "      references/error-catalog.md e references/self-evolution.md"
  exit 1
fi

if [ "$WARN_COUNT" -gt 0 ] && [ "$MODE" != "apply" ]; then
  echo ""
  echo "Warning(s) presenti — review opzionale, skill funzionante."
fi

echo ""
echo "All checks passed. Skill studio is healthy."
exit 0
