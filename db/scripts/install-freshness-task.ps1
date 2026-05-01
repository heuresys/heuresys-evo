# DEPRECATED 2026-04-29 — superseded by db/scripts/db-push.sh + db-pull.sh
# Kept for historical reference until 2026-05-31 (then remove). See db/README.md
# install-freshness-task.ps1
# Registers a Windows Scheduled Task that runs db/scripts/check-freshness.sh
# weekly on Mondays at 08:00 local time via Git Bash.
# Idempotent: replaces existing task if already registered.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File db\scripts\install-freshness-task.ps1
#
# Custom bash path:
#   powershell -ExecutionPolicy Bypass -File db\scripts\install-freshness-task.ps1 -BashExe "D:\Git\bin\bash.exe"
#
# Uninstall:
#   Unregister-ScheduledTask -TaskName "Heuresys-Evo-Freshness" -Confirm:$false

param(
    [string]$TaskName = "Heuresys-Evo-Freshness",
    [string]$BashExe = "",
    [string]$RepoRoot = (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)),
    [string]$LogPath = ""
)

$ErrorActionPreference = "Stop"

# --- Resolve bash.exe ---
if (-not $BashExe) {
    $candidates = @(
        "C:\Git\bin\bash.exe",
        "C:\Program Files\Git\bin\bash.exe",
        "C:\Program Files (x86)\Git\bin\bash.exe",
        "C:\Users\$env:USERNAME\AppData\Local\Programs\Git\bin\bash.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { $BashExe = $c; break }
    }
}
if (-not $BashExe -or -not (Test-Path $BashExe)) {
    Write-Error "bash.exe not found. Pass -BashExe '<path>' explicitly. Tried: $($candidates -join ', ')"
    exit 1
}

# --- Resolve log path + ensure dir exists ---
if (-not $LogPath) {
    $LogPath = Join-Path $RepoRoot "backups\local\freshness.log"
}
$LogDir = Split-Path -Parent $LogPath
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    Write-Host "[install-task] Created log dir: $LogDir"
}

# --- Convert RepoRoot to POSIX path for bash ---
# D:\heuresys.com.evo -> /d/heuresys.com.evo
$RepoRootPosix = "/" + $RepoRoot.Substring(0,1).ToLower() + $RepoRoot.Substring(2).Replace("\","/")
$LogPathPosix = "/" + $LogPath.Substring(0,1).ToLower() + $LogPath.Substring(2).Replace("\","/")

# --- Compose bash command ---
# `set -o pipefail` ensures non-zero exit if check-freshness.sh fails;
# `tee -a` keeps both file and stdout for live debugging if run interactively.
$bashCmd = "set -o pipefail; cd '$RepoRootPosix' && { echo '=== ' \`date -u +%Y-%m-%dT%H:%M:%SZ\` ' ==='; bash db/scripts/check-freshness.sh; } >> '$LogPathPosix' 2>&1"

# --- Action ---
$action = New-ScheduledTaskAction `
    -Execute $BashExe `
    -Argument "-c `"$bashCmd`"" `
    -WorkingDirectory $RepoRoot

# --- Trigger: weekly, Monday 08:00 local time ---
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 8:00am

# --- Settings ---
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries

# --- Principal: run as current user (only when logged on) ---
$user = "$env:USERDOMAIN\$env:USERNAME"

# --- Register (replace if exists) ---
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -User $user `
    -Description "Heuresys.com.evo: weekly multi-DBMS freshness check (Monday 08:00 local)" `
    -Force | Out-Null

Write-Host "[install-task] Registered: $TaskName"
Write-Host "[install-task] Bash: $BashExe"
Write-Host "[install-task] Repo: $RepoRoot"
Write-Host "[install-task] Log:  $LogPath"
Write-Host "[install-task] Trigger: every Monday at 08:00 local time"
Write-Host "[install-task] Run now manually:"
Write-Host "    Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "[install-task] Inspect output:"
Write-Host "    Get-Content '$LogPath' -Tail 30"
Write-Host "[install-task] Uninstall:"
Write-Host "    Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
