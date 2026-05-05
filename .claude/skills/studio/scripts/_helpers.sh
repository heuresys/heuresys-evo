#!/usr/bin/env bash
# _helpers.sh — funzioni shared per la skill studio.
# Source da ogni script principale per logging + lesson capture + version info.
#
# Usage (in altri script):
#   SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
#   source "$SCRIPT_DIR/_helpers.sh"
#   trap '_log_invocation "$0" "$@" $?' EXIT
#
# Funzioni esportate:
#   _log_invocation <script> <args...> <exit_code>   append jsonl entry a .logs/usage.jsonl
#   _capture_lesson <pattern> <description>           append a references/lessons-learned.md
#   _studio_version                                    print versione skill da SKILL.md frontmatter

# Resolve project root (4 levels up from scripts/)
_HELPERS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_STUDIO_ROOT="$(cd "$_HELPERS_DIR/.." && pwd)"
_PROJECT_ROOT="$(cd "$_STUDIO_ROOT/../../.." && pwd)"

_LOGS_DIR="$_STUDIO_ROOT/.logs"
_USAGE_LOG="$_LOGS_DIR/usage.jsonl"
_LESSONS_FILE="$_STUDIO_ROOT/references/lessons-learned.md"
_SKILL_FILE="$_STUDIO_ROOT/SKILL.md"

# ─── Logging ───────────────────────────────────────────────────────────────
_log_invocation() {
  # $1 = script path, $@ = args + last is exit_code
  local script_path="${1:-unknown}"
  shift || true
  local args=("$@")
  local exit_code="${args[${#args[@]}-1]:-?}"
  unset 'args[${#args[@]}-1]'

  mkdir -p "$_LOGS_DIR" 2>/dev/null || return 0

  local script_name
  script_name=$(basename "$script_path" .sh)
  local iso_ts
  iso_ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  local args_joined
  args_joined=$(printf '"%s"' "${args[@]:-}" | sed 's/""/", "/g')
  [ -z "${args[*]:-}" ] && args_joined=""

  # Append jsonl line (best-effort, never fails the calling script)
  printf '{"ts":"%s","script":"%s","args":[%s],"exit":%s,"cwd":"%s"}\n' \
    "$iso_ts" "$script_name" "$args_joined" "$exit_code" "$(pwd)" \
    >> "$_USAGE_LOG" 2>/dev/null || true
}

# ─── Lesson capture ────────────────────────────────────────────────────────
_capture_lesson() {
  # $1 = pattern (short identifier), $2 = description
  local pattern="${1:-?}"
  local description="${2:-?}"
  local iso_ts
  iso_ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  if [ ! -f "$_LESSONS_FILE" ]; then
    return 0
  fi

  # Append a section if pattern not already present
  if ! grep -qE "^### \\[$pattern\\]" "$_LESSONS_FILE" 2>/dev/null; then
    {
      echo ""
      echo "### [$pattern] — $iso_ts"
      echo ""
      echo "$description"
      echo ""
    } >> "$_LESSONS_FILE"
  fi
}

# ─── Version helper ────────────────────────────────────────────────────────
_studio_version() {
  if [ -f "$_SKILL_FILE" ]; then
    grep -E '^version:' "$_SKILL_FILE" 2>/dev/null | head -1 | sed -E 's/^version:\s*//' | tr -d '"'
  else
    echo "unknown"
  fi
}

# Esporta le funzioni per script che fanno source
export -f _log_invocation _capture_lesson _studio_version 2>/dev/null || true
