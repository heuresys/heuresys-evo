#!/usr/bin/env bash
# lint-mock-identities.sh — CI lint script
#
# Blocked canonical mock identities (forensic audit 2026-05-11 obs 5528 + S35.6 sweep).
# Grep pattern across UI/widget code; exit 1 if any hit (excluding test fixtures + storybook + migration history).
#
# Allowed exceptions (whitelisted paths):
#   - **/__tests__/**          (legit test fixtures)
#   - **/*.test.ts(x)          (vitest tests)
#   - **/*.stories.tsx         (storybook)
#   - db/migrations/phase14*   (historical seeds, immutable; cleanup via phase18l)
#   - db/migrations/phase18l*  (this cleanup file references the pattern itself)
#
# Usage: npm run lint:mock-identities

set -euo pipefail

PATTERN='Maria Rossi|Luca Bianchi|Stefania Bianchi|Gabriele Amato'
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

cd "$ROOT_DIR"

# Grep with exclusions
HITS=$(grep -rn -E "$PATTERN" \
  --include="*.ts" --include="*.tsx" --include="*.sql" --include="*.json" \
  services/ packages/ db/ 2>/dev/null \
  | grep -v "__tests__" \
  | grep -v "\.test\.ts" \
  | grep -v "\.stories\.tsx" \
  | grep -v "db/migrations/phase14" \
  | grep -v "db/migrations/phase18l" \
  | grep -v "db/seeds/phase14" \
  || true)

if [ -n "$HITS" ]; then
  echo "✗ lint:mock-identities FAIL — blocked names found in production code:"
  echo ""
  echo "$HITS"
  echo ""
  echo "Replace with neutral placeholders (e.g. 'Senior analyst', 'Manager', '—')."
  echo "Test fixtures / storybook / phase14/18l migrations are whitelisted."
  exit 1
fi

echo "✓ lint:mock-identities PASS"
exit 0
