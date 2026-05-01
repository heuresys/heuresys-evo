---
name: handoff
description: Session close + handoff procedure for the .evo project. Captures session state in 4 files inside .handoff/ (HANDOFF, PROJECT-STATE, PROJECT-LOG, CHANGELOG) plus dated snapshot. Project-scoped variant of the global skill — adopts richer patterns from the wiki-factory project (effort estimates, Files+Done when, Carry-forward, severity tagging, Lezione cross-project, auto-handoff hook). Triggered by "handoff", "/handoff", "chiudi sessione", "fine sessione", "salva stato sessione".
---

# handoff — Session close & continuity engine (`.evo` edition)

## Purpose

Capture the state of the current session in 4 files inside `.handoff/`. The next session
reads them to resume **without information loss**. This `.evo`-specific variant adopts
patterns proven in the wiki-factory project (richer structure, effort tagging, hook-based
auto-snapshots).

## Files

| File | Mode | Purpose |
|---|---|---|
| `.handoff/HANDOFF.md` | **overwrite** | Plan + todolist + open questions for the **next** session |
| `.handoff/PROJECT-STATE.md` | **overwrite** | Snapshot of current architecture / components / metrics |
| `.handoff/PROJECT-LOG.md` | **append-only** | Dev-facing journal: one entry per session |
| `.handoff/CHANGELOG.md` | **append-only** | User-facing changelog (Keep-a-Changelog format) |
| `.handoff/snapshots/HANDOFF-YYYY-MM-DD.md` | **immutable** | Frozen copy of HANDOFF.md, kept forever |
| `.handoff/auto/<timestamp>.md` | **automatic** | Breadcrumbs from auto-handoff hook (Stop event) |

## When to activate

Activate without further prompting on any of these triggers (Italian or English):
- "chiudi sessione", "fine sessione", "salva stato sessione", "passa il testimone"
- "close session", "session close", "wrap up", "wrap up session"
- "handoff", "aggiorna handoff", "update handoff"
- "/handoff" (slash command)

Do NOT activate during normal session work — only when the user signals the session is closing.

## Workflow — CLOSE SESSION

Execute the 7 steps in order. Track progress via TaskCreate when there are >5 todos.

### Step 1 — Pre-checks

1. Verify `.handoff/` exists. If missing: scaffold from `templates/` (auto-create dirs, copy templates with placeholders filled).
2. **One-time migration**: if a root file matching `HANDOFF-YYYY-MM-DD.md` exists outside `.handoff/`, move it into `.handoff/snapshots/`.
3. Capture session state:
   - `git status --short` for uncommitted changes
   - `git log --since="<last PROJECT-LOG entry date>" --oneline` for commits made this session
   - `git diff --stat <last-handoff-commit>..HEAD` for file change stats
4. List recent files in `.handoff/auto/` (last 24h) — they're breadcrumbs from the auto-handoff hook that may indicate the session timeline.

### Step 2 — Quick interview (max 3 questions)

Use a concise format. If the user answers tersely or skips, infer from context.

1. **What happened this session that's NOT obvious from the git diff?**
   Free text. Decisions, blockers, pivots, tacit knowledge.

2. **Top priority for next session?** (multiple choice with 3-5 options derived from open todos in current HANDOFF + new items emerged)

3. **Open questions, known risks, or carry-forward items**? (free text, optional)

### Step 3 — Compute delta

Compare current state vs `PROJECT-STATE.md` previous snapshot:
- Files modified / added / removed (`git status` + `git diff --stat`)
- Components advanced (cross-reference todolist in old `HANDOFF.md`):
  - Which todos completed (✅)
  - Which still open (carry-forward)
  - Which new (emerged this session)
- Estimate session duration from git log (first commit timestamp → last commit timestamp)
- Detect notable patterns: dead ends, pivots, escalated blockers

### Step 4 — Update files (in this exact order)

#### 4a. Append to `PROJECT-LOG.md`

Use richer format from `references/log-format.md`. Required subsections:
- **Mandato** (briefing received at session start)
- **Tasks completati** (✅ list)
- **Files changed** (git diff --stat output)
- **Commits** (hash + subject list)
- **Decisions** (decision + rationale, NOT obvious from diff — most valuable section)
- **Blockers / failures** (symptom + what tried + state)
- **Lezione operativa cross-project** (distillable lessons valid beyond this project — keep this generous, future sessions on OTHER projects benefit)
- **References** (links, screenshots, docs)

NEVER overwrite past entries. NEVER modify them either — to correct, add a new entry that supersedes.

#### 4b. Append to `CHANGELOG.md` (only if user-facing changes)

Use Keep-a-Changelog format under `## [Unreleased]`:
- New features → `### Added`
- Behavior changes → `### Changed` (mark `**BREAKING:**` if backwards-incompatible)
- Bug fixes → `### Fixed`
- Removed features → `### Removed`
- Security fixes → `### Security`

If session was pure refactor / docs / scaffolding / debug: **skip this file** — don't add filler.

#### 4c. Overwrite `PROJECT-STATE.md`

Per `references/state-format.md`. Required sections:
- **Overview** — 1-2 paragraphs: what project is, current phase, headline metric
- **Architecture** — diagram (ASCII / table) faithful to current state
- **Components** — table with status emoji (✅ done / 🚧 in progress / ⏳ planned / 🧊 frozen / ⚠️ broken)
- **Key files and paths** — bullet list with one-line purpose
- **Metrics** — table with `Δ vs last session` column
- **Backlog (overflow from HANDOFF priorities)** — categorized (e.g. Webapp / Engine / Operational / Corpus refinement) — items that didn't make HANDOFF top-5 but should be tracked
- **Open questions (mirror from HANDOFF)** — same content as HANDOFF.md §Open questions

This file is the single source of truth on current state.

#### 4d. Overwrite `HANDOFF.md`

Per `references/handoff-format.md`. Required sections:
- **Recap last session** — 1 paragraph (3-6 sentences)
- **Priorities for next session** — 3-5 items, each with:
  - Subject + effort estimate `(S, ~15min)` / `(M, ~3h)` / `(L, ~6h)`
  - 1-2 sentences of context
  - **Files:** absolute paths
  - **Done when:** verifiable acceptance criterion
- **Open questions** — items needing decision (alternative phrasing if known)
- **Carry-forward (still open, exploratory)** — older items still pending, separated from new open questions for clarity
- **Known issues** — categorized (Webapp / Engine / Operational / etc.) + severity tag (`**P0**` `**P1**` `**P2**` `**P3**` `**P3 NEW S<N>**`)
- **Verification commands** — divided per area, each with **expected output** explicit
- **How to start the next session** — bootstrap step-by-step (where to read first, what to verify before any work)

This file is the read target for next session bootstrap.

#### 4e. Save dated snapshot

Copy `HANDOFF.md` to `.handoff/snapshots/HANDOFF-YYYY-MM-DD.md` (today's date).
If a snapshot for today already exists, append `-2`, `-3`, … (never overwrite).

### Step 5 — Suggest git commit

1. Generate commit message:
   - Regular session: `chore(handoff): YYYY-MM-DD — Sessione N <topic>`
   - If session shipped feature: `feat: <feature> + handoff`
   - If session shipped fix: `fix: <fix> + handoff`
   - Body: 3-5 bullets distilled from PROJECT-LOG.md entry
2. Show proposed commit. Ask: "Eseguo, oppure preferisci farlo tu?"
3. If user agrees: stage `.handoff/` + commit. If user has other unstaged changes >5 files: ask whether to also stage those.
4. **Never force**, never `--no-verify`, never amend pushed commits.

### Step 6 — Optional milestone tag

If the session reached a notable milestone (e.g. "v1.0 baseline live"):
- Suggest `git tag` (annotated, with same body as commit)
- Wait for explicit user approval before executing

### Step 7 — Done message

Single paragraph confirming closure. Example:
> "Sessione chiusa. PROJECT-LOG aggiornato (entry #N), HANDOFF riscritto. Snapshot salvato a `.handoff/snapshots/HANDOFF-YYYY-MM-DD.md`. Prossima sessione partirà da: [top 3 todos]."

## Auto-handoff hook (background safety net)

The companion `.claude/hooks/auto-handoff.sh` runs on Stop events (when Claude Code CLI exits a session) and writes a breadcrumb to `.handoff/auto/<UTC-timestamp>.md` with:
- Timestamp UTC
- Current branch
- Last commit (hash + subject)
- `git status --short` output

**Purpose**: if the session closes abruptly (crash, ctrl+C, terminal timeout) before the user can run `/handoff`, the next session can read the last breadcrumb and recover state.

**Promotion**: at the start of each session, the agent (instructed by root `CLAUDE.md`) reads `.handoff/HANDOFF.md` AND scans `.handoff/auto/` for breadcrumbs newer than the last HANDOFF.md update. If found, mention them to the user and ask whether to incorporate into a fresh HANDOFF before starting work.

The hook is configured in `.claude/settings.json` under `hooks.Stop` (auto-installed by this skill on first run if missing).

## Constraints (hard rules)

- **NEVER delete** `PROJECT-LOG.md`, `CHANGELOG.md`, or anything in `snapshots/` — append-only / immutable
- **NEVER modify past entries** in `PROJECT-LOG.md` or past snapshots — only append/add new ones
- **NEVER auto-commit** without user confirmation
- **NEVER use `git push --force`** or `--no-verify`
- The skill **only writes** inside `.handoff/`. Exceptions:
  - One-time creation of `.claude/hooks/auto-handoff.sh` if missing
  - One-time edit of `.claude/settings.json` to register the Stop hook
- If templates / references missing in this skill's directory: **fail loudly** — do not improvise

## References (load on demand)

| File | When to load |
|---|---|
| `references/handoff-format.md` | Step 4d — writing HANDOFF.md |
| `references/state-format.md` | Step 4c — writing PROJECT-STATE.md |
| `references/log-format.md` | Step 4a — appending to PROJECT-LOG.md |
| `references/changelog-format.md` | Step 4b — appending to CHANGELOG.md |
| `references/auto-handoff-hook.md` | One-time setup of Stop hook |

## Bootstrap (next session) — read by `CLAUDE.md` root

The companion side: at session start, the agent must:
1. Read `.handoff/HANDOFF.md` — get plan + todolist + open questions
2. Read `.handoff/PROJECT-STATE.md` — get current state
3. Scan `.handoff/auto/` for breadcrumbs newer than HANDOFF.md mtime — surface them
4. Present to user: 1-line state recap + top 3-5 todos + open questions + any post-handoff breadcrumbs
5. Ask: "Continuiamo dalla todo #1, scegli un'altra priorità, o qualcosa di nuovo?"
6. Wait for user direction before doing anything else

This is **not part of this skill** — it lives in the project's `CLAUDE.md`.

---

*Skill version: 1.1 (`.evo` edition) — based on global handoff v1.0, enriched with wiki-factory patterns + auto-handoff hook.*
