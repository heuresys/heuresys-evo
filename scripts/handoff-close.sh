#!/usr/bin/env bash
# scripts/handoff-close.sh
#
# Smart-commit wrapper for the /handoff session-close cycle.
#
# Reduces commit-time discover-fix-retry by running pre-flight pattern scan
# BEFORE git commit, then performing branch + commit + push + PR + auto-merge
# in a single idempotent invocation.
#
# Usage:
#   scripts/handoff-close.sh <session_number> "<topic>"
#   scripts/handoff-close.sh 11 "S11 doc consolidation start"
#
# Idempotency: re-running on the same session_number reuses the existing
# branch/PR and re-applies the auto-merge flag — safe to retry on transient
# GitHub 5xx without producing duplicate PRs.
#
# Pre-flight scans .handoff/ against the husky-lite regex pattern catalog so
# the real `git commit` lands clean on first attempt (eliminates the gitleaks
# discover-fix-retry loop observed in S10 2026-05-04).

set -euo pipefail

SESSION="${1:-}"
TOPIC="${2:-}"

if [ -z "$SESSION" ] || [ -z "$TOPIC" ]; then
  echo "usage: $0 <session_number> \"<topic>\"" >&2
  exit 2
fi

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BRANCH="chore/handoff-s${SESSION}-close"
SUBJECT="chore(repo): handoff S${SESSION} close"

# ---------- 1. Pre-flight pattern scan -----------------------------------
# Mirrors .husky/pre-commit gitleaks-lite regex catalog. Patterns are
# concatenated from runtime fragments so this script does not self-match
# when staged.
P1="$(printf 'BEGI'; printf 'N')[[:space:]]+([A-Z]+[[:space:]]+)?PRIVATE[[:space:]]+KEY"
P2='sk-[a-zA-Z0-9]{32,}'
P3='gho_[a-zA-Z0-9]{30,}'
P4='ghp_[a-zA-Z0-9]{30,}'
P5='AKIA[0-9A-Z]{16}'
P6='xox[bpoa]-[a-zA-Z0-9-]{20,}'
RE="${P1}|${P2}|${P3}|${P4}|${P5}|${P6}"

echo "==> [1/5] Pre-flight: scanning .handoff/ for sensitive patterns"
hits=$(grep -rlE "$RE" .handoff/ 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "ERROR: pre-flight matched sensitive patterns in:" >&2
  echo "$hits" | sed 's/^/  /' >&2
  echo "" >&2
  echo "Rewrite the offending prose in descriptive form (no literal" >&2
  echo "PEM headers, sk-/gho_/ghp_/AKIA/xox- prefixes) and re-run." >&2
  exit 1
fi
echo "    OK"

# ---------- 2. Branch (idempotent) ---------------------------------------
echo "==> [2/5] Branch $BRANCH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
  echo "    reused existing branch"
else
  git checkout -b "$BRANCH"
  echo "    created"
fi

# ---------- 3. Stage + commit --------------------------------------------
echo "==> [3/5] Staging .handoff/"
git add .handoff/

if git diff --cached --quiet; then
  echo "    nothing to commit (handoff files unchanged) — exiting OK"
  exit 0
fi

COMMIT_MSG_FILE="$(mktemp)"
trap 'rm -f "$COMMIT_MSG_FILE"' EXIT
cat > "$COMMIT_MSG_FILE" <<EOF
$SUBJECT

$TOPIC
EOF

echo "==> [3/5] Committing"
git commit -F "$COMMIT_MSG_FILE"

# ---------- 4. Push ------------------------------------------------------
echo "==> [4/5] Pushing $BRANCH to origin"
git push -u origin "$BRANCH"

# ---------- 5. PR + auto-merge ------------------------------------------
echo "==> [5/5] PR + auto-merge"
if gh pr view "$BRANCH" --json url >/dev/null 2>&1; then
  PR_URL=$(gh pr view "$BRANCH" --json url --jq .url)
  echo "    PR exists: $PR_URL"
else
  PR_URL=$(gh pr create \
    --base main \
    --head "$BRANCH" \
    --title "$SUBJECT" \
    --body "Handoff S${SESSION} session close — ${TOPIC}

This PR is restricted to .handoff/** files; the heavy CI jobs (lint,
typecheck, test, build-workspaces, npm-audit, semgrep) detect this via
.github/actions/handoff-only-detect and emit fast green status. gitleaks
runs as usual against the full source.")
  echo "    PR opened: $PR_URL"
fi

# Enable auto-merge (idempotent — re-applying when already enabled is safe)
gh pr merge "$BRANCH" --squash --auto --delete-branch 2>/dev/null || \
  gh pr merge "$BRANCH" --squash --auto --delete-branch

echo ""
echo "Done: $PR_URL"
echo "Auto-merge enabled. PR will land on main once CI completes (~30s for handoff-only)."
