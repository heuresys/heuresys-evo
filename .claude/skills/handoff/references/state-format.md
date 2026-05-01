# PROJECT-STATE.md format reference (`.evo` edition)

The `PROJECT-STATE.md` file is **overwritten** at every session close. Authoritative snapshot of "where the project is right now".

Target: 100-450 lines. More structured than HANDOFF.md, less narrative.

## Required sections (in this exact order)

```markdown
# Project state — <project name>

> Snapshot: YYYY-MM-DD HH:MM · Engine version: X.Y · See `HANDOFF.md` for next steps

## Overview

1-2 paragraphs answering:
- What this project is (one sentence)
- Current phase (e.g. "M5 of 7", "spec only", "production")
- Headline metric (LOC, pages, users, tests, …)

## Architecture

Diagram (ASCII / mermaid / table) describing the **current** layout:
- Top-level dirs and what they contain
- External services / dependencies (e.g. "Postgres :5432", "OCI VM oracle-vm-default")
- Data flow if non-obvious
- For multi-environment projects: include both PC and VM/cloud sides

Keep this as a faithful mirror of reality, not aspirations.

## Components

Status taxonomy:
- ✅ **done** — works end-to-end, has tests, ships
- 🚧 **in progress** — partial, working but incomplete
- ⏳ **planned** — designed but not started
- 🧊 **frozen** — paused intentionally (record reason)
- ⚠️ **broken** — was working, now isn't (record symptom + ticket)

```markdown
| Component | Status | Notes |
|---|---|---|
| Repo scaffold | ✅ | All directories + READMEs in place |
| DBMS bare-metal VM | ✅ | Postgres 16.13 + pgvector, baseline restored |
| PC Docker v1 | ✅ | Aligned to VM container v1 (mig 220) |
| App `.evo` (services/app) | ⏳ | Only README, no code yet |
```

## Key files and paths

Bullet list of the **most important** files / directories, with one-line purpose. The "where do I start reading" guide for a new agent.

```markdown
- `CLAUDE.md` (root) — project instructions, bootstrap step 0
- `.handoff/HANDOFF.md` — next session plan
- `db/scripts/` — DBMS lifecycle scripts (setup, restore, backup, freshness)
- `services/app/` — webapp Next.js (placeholder)
```

## Metrics

Quantitative snapshot. Update each session.

```markdown
| Metric | Value | Δ vs last session |
|---|---|---|
| Total commits | 14 | +14 (initial) |
| Files in repo (excluding .git, node_modules, dump) | 88 | +88 |
| Active DBMS instances | 3 | +3 |
| Migrations applied (VM bare-metal) | 202 | +202 |
| Bash scripts in db/scripts/ | 9 | +9 |
| PowerShell scripts in db/scripts/ | 5 | +5 |
| ADRs | 2 | +2 |
| Open todos in HANDOFF | N | ±X |
```

If a metric is hard to compute reliably, omit it rather than estimate.

## Backlog (overflow from HANDOFF priorities)

Categorized list of low-priority items that didn't make HANDOFF.md but should be tracked. Categorize per area:

```markdown
### App `.evo` development

- [ ] npm init in services/marketing, services/app, services/api-gateway, services/enrichment, packages/ui, packages/shared
- [ ] First Next.js skeleton in services/marketing
- [ ] First Next.js skeleton in services/app

### Database / Operational

- [ ] Apply migration 221 (TOTP plain drop, requires backfill first)
- [ ] Configure OCI Object Storage upload in backup-and-rotate.sh
- [ ] Schedule weekly check-freshness.sh (cron VM + Task Scheduler PC)

### Infrastructure / DevOps

- [ ] CI workflows for deploy-marketing.yml.example, deploy-app-api.yml.example, deploy-worker.yml.example
- [ ] Push .evo repo to GitHub
```

Limit ~30 items per category. Anything larger means real work is being deferred — escalate to user.

## Open questions (mirror from HANDOFF)

Same content as HANDOFF.md §Open questions, kept here for full-state continuity.

## Optional sections

- **`## Stack & dependencies`** — table of major libs/tools and pinned versions
- **`## Conventions`** — repo-specific rules ("italian for prose", "tabular-nums for numbers")
- **`## External services`** — DB / cache / API providers with URLs and where keys live
- **`## Roles & access`** — who has access to what (esp. for multi-env projects)

## Rules

- Always overwritten — never append. Previous version lives in `snapshots/HANDOFF-<date>.md`.
- Status emoji from controlled vocabulary above
- Metrics: real numbers, never "approximate" or "TBD"
- Implementation diffs go in PROJECT-LOG.md, not here
- Length cap: 450 lines. If exceeded, move detail to a `references/` doc and link.
```
