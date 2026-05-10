---
name: handoff
description: Session close + handoff procedure for heuresys-evo. Updates the single live file `.handoff/STATE.md`, optionally syncs global project docs (CLAUDE.md status block, DECISIONS-LOG.md L-NN entry, BRAND-STATE.md if brand workstream active), commits, pushes direct to main. No snapshots, no PROJECT-LOG, no CHANGELOG, no interview — by design (post-S11 radical simplification). Triggered by "handoff", "/handoff", "chiudi sessione", "fine sessione", "salva stato sessione".
---

# handoff — Session close (heuresys-evo, post-S11 simplification)

## Purpose

Capture session state in **a single live file** `.handoff/STATE.md` (overwrite, not append). The next session reads it to resume without information loss. Supplemental docs (CLAUDE.md, DECISIONS-LOG.md, BRAND-STATE.md) are synced **only if relevant** to changes shipped this session.

**Design choice**: post-S11 radical simplification killed PROJECT-LOG/CHANGELOG/snapshots/auto-handoff-hook. Git log + STATE.md are the only persistent surfaces. Cerimonia bandita.

## Trigger words

Activate without further prompting on (Italian or English):

- `chiudi sessione`, `fine sessione`, `salva stato sessione`, `passa il testimone`
- `close session`, `session close`, `wrap up`
- `handoff`, `aggiorna handoff`, `update handoff`
- `/handoff` (slash command)

Do NOT activate during normal session work — only when user signals closure.

## Workflow (5 steps)

### Step 1 — Capture state

Run in parallel:

```bash
git status -sb              # uncommitted changes + sync state
git log --oneline -5        # commits this session
```

Note: handoff workflow assumes user already committed code/docs changes during the session. The `/handoff` step itself only updates STATE.md and (optionally) syncs CLAUDE.md status block / DECISIONS-LOG.md / BRAND-STATE.md if not already done.

### Step 2 — Update `.handoff/STATE.md` (overwrite)

Compact format, ~30-50 lines target. Required sections (canonical example: see git log of `.handoff/STATE.md`):

````markdown
# heuresys-evo — Current State

> Updated: <ISO timestamp UTC> · <sprint name> closed · <one-line summary>

## Last session brief (<sprint>)

<3-6 lines: what shipped, key commits, key metrics>

## Top priorities (<next sprint>)

1. **`[severity]` <title>** (~effort) — <1-2 line context + ref files>
2. ...
3. ...
4. ...

## Open questions

- <items needing decision before next session can proceed, or "nessuna">

## Stack snapshot (changed this session)

- DBMS: <key invariants verified>
- Code: <NEW/MOD files high-level>
- Infra: <changes>
- Docs: <key additions>
- Tests: <count + green>

## Verification

```bash
<3-5 commands the next session can run to confirm baseline>
```
````

Riferimenti: <plan file, audit doc, DECISIONS-LOG entry>

````

**Severity tags**: `[HIGH]` `[MEDIUM]` `[LOW]` `[INFRA]` `[ARCH]` `[ARCH-S<N>]`.

### Step 3 — Sync global project docs (only if not already done in-session)

Check if these need updating based on session changes:

| File | When to update |
|---|---|
| `CLAUDE.md` (status block, line ~169) | Sprint name + L-NN bumped, top priorities table changed |
| `.ux-design/DECISIONS-LOG.md` | Decision/architectural choice taken this session → append L-NN entry |
| `.ux-design/BRAND-STATE.md` | Brand workstream active + phase advancement / new asset / decision |
| `.handoff/legacy-import-registry.csv` | Import legacy occurred this session |

Skip if already synced in earlier commits this session.

### Step 4 — Commit

Generate commit signature based on scope:

- Pure handoff (only STATE.md): `chore: handoff <sprint>`
- Handoff + 1-2 docs sync: `docs(handoff): <sprint> close + <doc> sync`
- Handoff + feature/fix shipped: `feat: <feature> + handoff <sprint>` or `fix: <fix> + handoff`

Body 3-5 bullets, distilled from STATE.md "Last session brief" + key metrics + commit hashes referenced.

Show proposed commit. Ask: "Eseguo, oppure preferisci farlo tu?". If user agrees → stage relevant files + commit.

**Hard rules**:
- Never `--no-verify` (gitleaks + commitlint enforced)
- Never `--amend` on pushed commits
- Never `git push --force` on main
- Stage explicit files (no `git add -A` unless user confirms)

### Step 5 — Push direct main + done message

```bash
git push origin main
````

Single paragraph confirmation:

> "Sessione chiusa. STATE.md aggiornato (~timestamp). Commit `<hash>` pushed origin/main. Prossima sessione partirà da: [top 3 priorities]."

## What this skill explicitly does NOT do

- ❌ Append `PROJECT-LOG.md` (file deleted post-S11)
- ❌ Append `CHANGELOG.md` (file deleted post-S11)
- ❌ Save dated snapshot in `.handoff/snapshots/` (directory never existed)
- ❌ Run quick interview with 3 questions (overhead, killed by simplification)
- ❌ Install or use `auto-handoff.sh` Stop hook (never installed in this repo)
- ❌ Touch `.handoff/HANDOFF.md` legacy file (stale since 2026-05-07, sostituito da STATE.md)
- ❌ Auto-create ADR (decisions go in DECISIONS-LOG.md L-NN entry, not separate ADR by default — ADR only for architecturally-binding decisions per S11+)

If a session genuinely needs one of the above (rare), do it OUTSIDE this skill, explicitly.

## Constraints (hard rules)

- The skill writes inside `.handoff/STATE.md` (overwrite). Optional touches: `CLAUDE.md`, `.ux-design/DECISIONS-LOG.md`, `.ux-design/BRAND-STATE.md` (only if Step 3 conditions met).
- Never auto-commit without user confirmation (Step 4).
- Never push without commit succeeded.

## Bootstrap (next session) — read by `CLAUDE.md` root

At session start, agent must:

1. Read `.handoff/STATE.md` — get plan + open questions
2. Run `git status -sb` (clean? in sync `origin/main`?)
3. Greet user: 1-line state recap + top 3 priorities + open questions if relevant
4. Wait for explicit user direction before touching code

This is **not part of this skill** — it lives in project root `CLAUDE.md` § Session start protocol.

## Drift policy

If you observe a sync drift between this skill's workflow and what `CLAUDE.md` root says, **CLAUDE.md is canonical**. This skill must be updated to match. Skill drift was the original tech debt that prompted the 2026-05-10 rewrite (post-S24 L59).

---

_Skill version 2.0 — 2026-05-10 rewrite aligned to post-S11 single-STATE.md workflow. Previous version 1.1 (`.evo` edition with 4-file structure + snapshots + interview + hook) was theoretical drift, never matched repo reality._
