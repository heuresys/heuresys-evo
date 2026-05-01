#!/bin/bash
# DEPRECATED 2026-04-29 — superseded by db/scripts/db-push.sh + db-pull.sh
# Kept for historical reference until 2026-05-31 (then remove). See db/README.md
# Ephemeral Docker orchestrator for weekly multi-DBMS sync. Designed to run
# autonomously from Task Scheduler / cron with minimum resource footprint:
# starts Docker only for the duration of the sync, then shuts it down to free
# RAM/CPU on resource-constrained hosts.
#
# Pipeline:
#   1. Detect platform (windows-gitbash | linux | macos)
#   2. Ensure Docker daemon is up (start if needed, wait until reachable)
#   3. Ensure required containers are running (heuresys_evo_db on PC, plus
#      legacy heuresys_evo_platform_db v1 — they share Docker on the same host)
#   4. Run align-replicas.sh --align-all --force (sync all stale replicas)
#   5. Run check-freshness.sh (smoke verification of all DBMS in registry)
#   6. Cleanup: stop containers (always) + quit Docker Desktop on Win/macOS
#
# Container data persists in named volumes, so stop/start is non-destructive.
# Cleanup runs on exit via trap, even on error or interrupt.
#
# Usage:
#   bash db/scripts/sync-replicas-ephemeral.sh                       # full pipeline
#   SHUTDOWN_DOCKER_DESKTOP=0 bash db/scripts/sync-replicas-ephemeral.sh   # leave Docker running after
#   SKIP_LEGACY_V1=1 bash db/scripts/sync-replicas-ephemeral.sh      # only handle .evo container
#
# Exit codes:
#   0   = success
#   2   = Docker Desktop not installed
#   3   = Docker daemon failed to start within timeout
#   4   = required container does not exist (run bootstrap-pc-docker-evo.sh first)
#   5   = pg_isready timeout on container
#   6   = align-replicas.sh failed
#   7   = check-freshness.sh failed (replicas misaligned post-sync)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

EVO_CONTAINER="${EVO_CONTAINER:-heuresys_evo_db}"
V1_CONTAINER="${V1_CONTAINER:-heuresys_evo_platform_db}"
WAIT_DAEMON_SECONDS="${WAIT_DAEMON_SECONDS:-180}"
WAIT_PG_SECONDS="${WAIT_PG_SECONDS:-60}"
SHUTDOWN_DOCKER_DESKTOP="${SHUTDOWN_DOCKER_DESKTOP:-1}"
SKIP_LEGACY_V1="${SKIP_LEGACY_V1:-0}"
DOCKER_CONTEXT="${DOCKER_CONTEXT:-desktop-linux}"

# Detect platform
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)  PLATFORM="windows" ;;
  Linux)                 PLATFORM="linux" ;;
  Darwin)                PLATFORM="macos" ;;
  *) echo "ERROR: unsupported platform: $(uname -s)" >&2; exit 1 ;;
esac

# On Linux, Docker is typically a system service: don't quit anything globally
[ "$PLATFORM" = "linux" ] && SHUTDOWN_DOCKER_DESKTOP=0

DOCKER="docker --context $DOCKER_CONTEXT"
[ "$PLATFORM" = "linux" ] && DOCKER="docker"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] [$PLATFORM] $*"; }

# === Cleanup trap ===
# Stops all containers we touched. On Win/macOS, also quits Docker Desktop to
# free RAM/CPU. Idempotent: skips anything already stopped/missing.
WE_STARTED_DAEMON=0
WE_STARTED_EVO=0
WE_STARTED_V1=0

stop_container_if_we_started_it() {
  local name="$1" we_started="$2"
  [ "$we_started" != "1" ] && return 0
  if $DOCKER inspect "$name" >/dev/null 2>&1; then
    if [ "$($DOCKER inspect -f '{{.State.Running}}' "$name" 2>/dev/null)" = "true" ]; then
      log "  stopping container $name (was started by this run)"
      $DOCKER stop -t 30 "$name" >/dev/null 2>&1 || log "  WARN: stop failed for $name"
    fi
  fi
}

cleanup() {
  local rc=$?
  log "==== cleanup (final exit_code=$rc) ===="
  stop_container_if_we_started_it "$EVO_CONTAINER" "$WE_STARTED_EVO"
  [ "$SKIP_LEGACY_V1" != "1" ] && stop_container_if_we_started_it "$V1_CONTAINER" "$WE_STARTED_V1"

  if [ "$SHUTDOWN_DOCKER_DESKTOP" = "1" ] && [ "$WE_STARTED_DAEMON" = "1" ]; then
    case "$PLATFORM" in
      windows)
        # Docker Desktop on Windows is multi-process: a GUI (Electron, 4+ procs),
        # a backend (com.docker.backend, runs the WSL2 dockerd), a sandbox, a
        # Windows service (com.docker.service, requires admin to stop).
        # `--quit` only signals the main GUI window; backend can survive in some
        # states, so we follow up with a targeted Stop-Process on the heavy
        # processes (GUI + backend + build + sandbox). The Windows service stays
        # but it's a thin listener and uses negligible resources.
        DD_EXE="/c/Program Files/Docker/Docker/Docker Desktop.exe"
        if [ -x "$DD_EXE" ]; then
          log "  quitting Docker Desktop (graceful)"
          "$DD_EXE" --quit >/dev/null 2>&1 || true
          # Give it 15s to settle, then force-kill anything still up
          for i in $(seq 1 15); do
            if ! docker info >/dev/null 2>&1; then break; fi
            sleep 1
          done
          if docker info >/dev/null 2>&1; then
            log "  --quit didn't fully shut down; force-killing residual processes"
            powershell.exe -NoProfile -Command "Stop-Process -Name 'Docker Desktop','com.docker.backend','com.docker.build','docker-sandbox' -Force -ErrorAction SilentlyContinue" >/dev/null 2>&1 || true
            sleep 3
          fi
          if docker info >/dev/null 2>&1; then
            log "  WARN: daemon STILL up after force-kill (com.docker.service may need admin to stop)"
          else
            log "  Docker daemon DOWN ✓ (com.docker.service Win service stays as thin listener)"
          fi
        fi
        ;;
      macos)
        log "  quitting Docker.app"
        osascript -e 'quit app "Docker"' 2>/dev/null || log "  WARN: osascript quit failed"
        ;;
    esac
  fi
  log "==== cleanup done ===="
  exit $rc
}
trap 'cleanup' EXIT INT TERM

# === Step 1: ensure Docker daemon is up ===
log "step 1/5: ensure Docker daemon"
if $DOCKER info >/dev/null 2>&1; then
  log "  daemon already up (we will NOT shut it down on cleanup)"
else
  WE_STARTED_DAEMON=1
  log "  daemon not reachable — starting Docker"
  case "$PLATFORM" in
    windows)
      DD_EXE="/c/Program Files/Docker/Docker/Docker Desktop.exe"
      [ ! -x "$DD_EXE" ] && { log "ERROR: Docker Desktop not found at $DD_EXE"; exit 2; }
      "$DD_EXE" >/dev/null 2>&1 &
      ;;
    macos)
      open -a Docker || { log "ERROR: failed to open Docker.app"; exit 2; }
      ;;
    linux)
      if ! sudo systemctl start docker 2>/dev/null; then
        log "ERROR: failed to start docker via systemctl. Try: sudo systemctl start docker"
        exit 2
      fi
      ;;
  esac

  log "  waiting for daemon to accept connections (timeout ${WAIT_DAEMON_SECONDS}s)"
  for i in $(seq 1 "$WAIT_DAEMON_SECONDS"); do
    if $DOCKER info >/dev/null 2>&1; then
      log "  daemon ready in ${i}s"
      break
    fi
    [ $((i % 15)) -eq 0 ] && log "    ${i}s elapsed ..."
    sleep 1
  done

  if ! $DOCKER info >/dev/null 2>&1; then
    log "ERROR: daemon did not respond within ${WAIT_DAEMON_SECONDS}s"
    exit 3
  fi
fi

# === Step 2: ensure containers running ===
ensure_container_running() {
  local name="$1" required="$2" started_var="$3"
  if ! $DOCKER inspect "$name" >/dev/null 2>&1; then
    if [ "$required" = "1" ]; then
      log "ERROR: required container '$name' does not exist (run bootstrap-pc-docker-evo.sh first)"
      exit 4
    else
      log "  container $name not present — skipping"
      return 0
    fi
  fi

  if [ "$($DOCKER inspect -f '{{.State.Running}}' "$name")" = "true" ]; then
    log "  container $name already running"
  else
    log "  starting container $name"
    $DOCKER start "$name" >/dev/null
    eval "$started_var=1"
  fi

  log "  waiting pg_isready on $name (timeout ${WAIT_PG_SECONDS}s)"
  for i in $(seq 1 "$WAIT_PG_SECONDS"); do
    if $DOCKER exec "$name" pg_isready -U heuresys >/dev/null 2>&1; then
      log "  $name ready in ${i}s"
      return 0
    fi
    sleep 1
  done
  log "ERROR: pg_isready timeout on $name"
  exit 5
}

log "step 2/5: ensure containers running"
ensure_container_running "$EVO_CONTAINER" 1 WE_STARTED_EVO
[ "$SKIP_LEGACY_V1" != "1" ] && ensure_container_running "$V1_CONTAINER" 0 WE_STARTED_V1

# === Step 3: align replicas ===
log "step 3/5: align all replicas (align-replicas.sh --align-all --force)"
bash "$SCRIPT_DIR/align-replicas.sh" --align-all --force
ALIGN_RC=$?
[ "$ALIGN_RC" -ne 0 ] && { log "ERROR: align-replicas exit $ALIGN_RC"; exit 6; }

# === Step 4: smoke verification ===
log "step 4/5: smoke check (check-freshness.sh)"
bash "$SCRIPT_DIR/check-freshness.sh"
FRESH_RC=$?
[ "$FRESH_RC" -ne 0 ] && { log "ERROR: post-sync freshness check exit $FRESH_RC (replicas still drift)"; exit 7; }

# === Step 5: success — trap will clean up ===
log "step 5/5: SUCCESS — sync pipeline complete (cleanup via trap)"
exit 0
