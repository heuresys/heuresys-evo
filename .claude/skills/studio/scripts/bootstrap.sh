#!/usr/bin/env bash
# bootstrap.sh — clone produzione + copia mockup HTML come reference + popola README
# per il caso "prima promozione" (greenfield translation HTML mockup → React page).
#
# Wrapper su clone-route.sh: esegue clone normale, poi aggiunge mockup come
# `source-mockup.html` nello staging e popola la sezione Motivazione del README.
#
# Usage: bootstrap.sh <mockup-path> <route>
#   <mockup-path>  path a un file HTML, tipicamente in .ux-design/06-mockups/
#   <route>        route Next.js target (deve gia' esistere come scaffold)
#
# Exit codes:
#   0   ok
#   1   args invalid (BOOTSTRAP_E001)
#   2   mockup inesistente / non .html (BOOTSTRAP_E002)
#   *   propagato da clone-route.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$PROJECT_ROOT"

if [ $# -lt 2 ]; then
  echo "ERROR BOOTSTRAP_E001: usage: $0 <mockup-path> <route>" >&2
  echo "Hint: $0 .ux-design/06-mockups/dashboards/hr-director-overview.html dashboard" >&2
  exit 1
fi

MOCKUP_PATH="$1"
ROUTE="$2"

# ─── Validate mockup ───────────────────────────────────────────────────────
if [ ! -f "$MOCKUP_PATH" ]; then
  echo "ERROR BOOTSTRAP_E002: mockup not found: $MOCKUP_PATH" >&2
  exit 2
fi
case "$MOCKUP_PATH" in
  *.html|*.htm) ;;
  *)
    echo "ERROR BOOTSTRAP_E002: mockup must be .html or .htm, got: $MOCKUP_PATH" >&2
    exit 2 ;;
esac

MOCKUP_NAME=$(basename "$MOCKUP_PATH")
MOCKUP_REL="$MOCKUP_PATH"

echo "Bootstrap: $MOCKUP_REL → route '$ROUTE'"
echo ""

# ─── Step 1: invoke clone-route.sh ─────────────────────────────────────────
# Catturiamo l'output per estrarre il path staging creato
CLONE_OUT=$(bash "$SCRIPT_DIR/clone-route.sh" "$ROUTE" 2>&1) || {
  echo "$CLONE_OUT" >&2
  echo "ERROR: clone-route.sh failed, abort bootstrap" >&2
  exit 90
}

echo "$CLONE_OUT"

# Estrai path staging dall'output (linea "  To:  <path>")
STAGING_PATH=$(echo "$CLONE_OUT" | grep -E '^\s+To:\s+' | head -1 | sed -E 's/^\s+To:\s+//' | tr -d '[:space:]')
TS=$(echo "$CLONE_OUT" | grep -E '^\s+TS:\s+' | head -1 | sed -E 's/^\s+TS:\s+//' | tr -d '[:space:]')

if [ -z "$STAGING_PATH" ] || [ ! -d "$STAGING_PATH" ]; then
  echo "ERROR: cannot resolve staging path from clone-route.sh output" >&2
  exit 90
fi

# ─── Step 2: copy mockup as source-mockup.html ─────────────────────────────
cp "$MOCKUP_PATH" "$STAGING_PATH/source-mockup.html"

# ─── Step 3: enrich .source-hashes.json with bootstrap_source ──────────────
HASHES_FILE="$STAGING_PATH/.source-hashes.json"
if [ -f "$HASHES_FILE" ] && command -v python3 >/dev/null 2>&1; then
  python3 -c "
import json
h = json.load(open('$HASHES_FILE'))
h['bootstrap_source'] = '$MOCKUP_REL'
h['operation_intent'] = 'first_promote'
json.dump(h, open('$HASHES_FILE','w'), indent=2)
" 2>/dev/null || true
fi

# ─── Step 4: rewrite README § Motivazione with bootstrap context ───────────
README="$STAGING_PATH/README.md"
if [ -f "$README" ]; then
  # Build motivazione text
  MOTIV_TEXT="**Tipo**: prima promozione (bootstrap / greenfield translation).

**Source mockup HTML**: \`$MOCKUP_REL\` (copiato come \`source-mockup.html\` per riferimento durante la traduzione).

**Target route Next.js**: \`services/app/src/app/$ROUTE/\` (scaffold corrente sarà sostituito).

**Obiettivo**: tradurre il mockup HTML in componenti React Server Components conformi al brand identity (μ-architect-legacy + token tokens.css packages/ui).

**Workflow consigliato per la traduzione**:

1. Aprire \`source-mockup.html\` e \`page.tsx\` corrente lato a lato
2. Invocare \`Skill frontend-design:frontend-design\` per pattern componenti
3. Eventualmente \`Skill frontend-design-pro:design\` per wizard color/typography
4. Iterare: spostare sezioni HTML → JSX, mantenere struttura semantica
5. Estrarre componenti riutilizzabili in \`_components/\` quando sensato
6. Verificare con \`/studio:diff\` prima del promote
7. Eseguire \`/brand:audit\` su \`http://localhost:3200/$ROUTE\` (gate B)
8. Eseguire \`/brand:anti-slop\` (gate C)
9. \`/studio:promote $ROUTE <TS>\` quando pronto

**Criterio di successo**: la pagina React resa nel browser è visivamente coerente col mockup HTML (entro tolleranza brand) e passa gate B (score ≥ 7, P0 = 0) e gate C (anti-slop clean)."

  # Replace placeholder section
  python3 -c "
import re
with open('$README','r',encoding='utf-8') as f:
    c = f.read()
new_motiv = '''$MOTIV_TEXT'''
c = re.sub(r'## Motivazione\n\n.*?(?=\n## )', f'## Motivazione\n\n{new_motiv}\n\n', c, count=1, flags=re.DOTALL)
with open('$README','w',encoding='utf-8') as f:
    f.write(c)
" 2>/dev/null || echo "(WARNING: README § Motivazione non aggiornato — python3 mancante)"
fi

echo ""
echo "✓ Bootstrap complete"
echo "  Mockup source:  $MOCKUP_REL → $STAGING_PATH/source-mockup.html"
echo "  Staging:        $STAGING_PATH"
echo "  README:         $README (sezione Motivazione popolata)"
echo "  Hashes:         $HASHES_FILE (con bootstrap_source + operation_intent: first_promote)"
echo ""
echo "Next steps:"
echo "  1. Apri $STAGING_PATH/source-mockup.html nel browser come reference"
echo "  2. Itera su $STAGING_PATH/page.tsx (translate HTML → React)"
echo "  3. Skill frontend-design / figma:figma-implement-design per traduzione"
echo "  4. /studio:diff $ROUTE $TS quando vuoi review"
echo "  5. /studio:promote $ROUTE $TS quando pronto (gate B+C+D+E)"
