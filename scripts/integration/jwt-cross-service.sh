#!/usr/bin/env bash
# Cross-service JWT decode E2E verification.
#
# Empirically verifies that a NextAuth v4 cookie minted by services/app
# is accepted by services/api-gateway via the custom decoder
# (services/api-gateway/src/lib/jwt-v4-decoder.ts) — the bridge for the
# HKDF info-string mismatch between NextAuth v4 and @auth/core v5.
#
# Pre-req:
#   - services/app dev or prod running on :3200 (NextAuth v4 cookie issuer)
#   - services/api-gateway running on :8200 (must share AUTH_SECRET)
#   - tunnel SSH up (tunnel-vm.ps1) so services/app can reach DB
#
# Usage:
#   bash scripts/integration/jwt-cross-service.sh
#
# Exit code: 0 on PASS, non-zero on any failure.
set -euo pipefail

APP_URL="${APP_URL:-http://127.0.0.1:3200}"
GW_URL="${GW_URL:-http://127.0.0.1:8200}"
USER="${TEST_USER:-sysadmin}"
PASS="${TEST_PASS:-Heuresys2026!}"
ENDPOINT="${TEST_ENDPOINT:-/employees/meta/employment-statuses}"
COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

echo "[e2e-jwt] app=$APP_URL gateway=$GW_URL user=$USER endpoint=$ENDPOINT"

echo "[e2e-jwt] step 1/4: gateway responds 401 on unauthenticated request"
UNAUTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$GW_URL$ENDPOINT")
if [ "$UNAUTH_CODE" != "401" ]; then
  echo "[e2e-jwt] FAIL — expected 401, got $UNAUTH_CODE"
  exit 1
fi

echo "[e2e-jwt] step 2/4: get CSRF token from app"
CSRF_RES=$(curl -sc "$COOKIE_JAR" "$APP_URL/api/auth/csrf")
TOKEN=$(echo "$CSRF_RES" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).csrfToken)")

echo "[e2e-jwt] step 3/4: NextAuth Credentials login (mints v4 cookie)"
curl -sb "$COOKIE_JAR" -c "$COOKIE_JAR" -X POST \
  -H "content-type: application/x-www-form-urlencoded" \
  --data-urlencode "username=$USER" \
  --data-urlencode "password=$PASS" \
  --data-urlencode "csrfToken=$TOKEN" \
  --data-urlencode "json=true" \
  "$APP_URL/api/auth/callback/credentials" > /dev/null

COOKIE=$(awk -F'\t' '/session-token/ && !/csrf/ && !/callback/ {print $6"="$7; exit}' "$COOKIE_JAR")
if [ -z "$COOKIE" ]; then
  echo "[e2e-jwt] FAIL — no session cookie minted"
  exit 1
fi
echo "[e2e-jwt]   cookie len: ${#COOKIE} chars (JWE A256GCM expected)"

echo "[e2e-jwt] step 4/4: gateway accepts v4 cookie via custom decoder"
RES=$(curl -s -w "\n%{http_code}" -H "cookie: $COOKIE" "$GW_URL$ENDPOINT")
BODY=$(echo "$RES" | sed '$d')
CODE=$(echo "$RES" | tail -n 1)

if [ "$CODE" != "200" ]; then
  echo "[e2e-jwt] FAIL — expected 200, got $CODE"
  echo "[e2e-jwt] body: $BODY"
  exit 1
fi

if ! echo "$BODY" | grep -q '"success":true'; then
  echo "[e2e-jwt] FAIL — body did not include success=true"
  echo "[e2e-jwt] body: $BODY"
  exit 1
fi

echo "[e2e-jwt] PASS — cross-service JWT decode works end-to-end"
echo "[e2e-jwt]   200 + payload: ${BODY:0:80}..."
