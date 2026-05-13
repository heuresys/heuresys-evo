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

Compact format, ~30-50 lines target. **Template canonical post-S61 reform** (vedi `docs/_meta/operating-baseline.md` § CARD-5):

````markdown
# heuresys-evo — Current State

> Updated: <ISO timestamp UTC> · <sprint name> closed · HEAD `<sha>`

## Debt attivo

<bullet-list di obblighi con acceptance criteria. SE VUOTO: scrivere letteralmente "Nessuno. Sistema fermo.">

## Open questions

<solo domande che bloccano lavoro futuro. SE VUOTO: omettere intera sezione.>

## Stack snapshot delta

<descrittivo: cosa è cambiato in questa sessione/sprint>

## Verification

```bash
<3-5 commands the next session can run to confirm baseline>
```

## References

<plan file · audit doc · DECISIONS-LOG entry · operating-baseline section>
````

**Hard rules sul template (S61 reform)**:

- **Sezione "Debt attivo"** sostituisce "Top priorities" / "Possibili direzioni" / "Next session" / equivalenti. Se vuota → letterale "**Nessuno. Sistema fermo.**" — non riempire con "menu of options" o "next directions".
- **Raccomandazioni opzionali** (quick wins, recommendations, next steps, adjacent improvements) → vanno in `.handoff/BACKLOG.md`, mai dentro STATE.md.
- **Severity tags** solo dentro § "Debt attivo" se la sezione non è vuota: `[HIGH]` `[MEDIUM]` `[LOW]` `[INFRA]` `[ARCH]`.

### Step 3 — Sync global project docs (only if not already done in-session)

Check if these need updating based on session changes:

| File                                                                                                   | When to update                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLAUDE.md` (§ Sistema corrente l. ~169 / § Roadmap successiva l. ~212 / § Carry-forward S25+ l. ~224) | Snapshot operativo cambiato (DB count, test count, app routes, FK state, mat views), oppure priorità roadmap/carry-forward shiftate. Per cronologia sprint shipped (Phase X.Y close, S<N> close) → append a `docs/_meta/sprint-history.md` (archive append-only, ordine cronologico decrescente), NO inline in CLAUDE.md |
| `.ux-design/DECISIONS-LOG.md`                                                                          | Decision/architectural choice taken this session → append L-NN entry                                                                                                                                                                                                                                                     |
| `.ux-design/BRAND-STATE.md`                                                                            | Brand workstream active + phase advancement / new asset / decision                                                                                                                                                                                                                                                       |
| `.handoff/legacy-import-registry.csv`                                                                  | Import legacy occurred this session                                                                                                                                                                                                                                                                                      |

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
```

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

1. Read `.handoff/STATE.md` § "Debt attivo". If "**Nessuno. Sistema fermo.**" → session is OPEN, no inherited pending. **Never auto-open `BACKLOG.md`** (menu opzionale).
2. Run `git status -sb` (clean? in sync `origin/main`?)
3. Greet user: 1-line state recap + Debt status (empty vs items) + open questions if relevant. If Debt empty → "Sistema fermo, dimmi cosa facciamo."
4. Wait for explicit user direction before touching code

This is **not part of this skill** — it lives in project root `CLAUDE.md` § Session start protocol.

## Drift policy

If you observe a sync drift between this skill's workflow and what `CLAUDE.md` root says, **CLAUDE.md is canonical**. This skill must be updated to match. Skill drift was the original tech debt that prompted the 2026-05-10 rewrite (post-S24 L59).

---

_Skill version 2.0 — 2026-05-10 rewrite aligned to post-S11 single-STATE.md workflow. Previous version 1.1 (`.evo` edition with 4-file structure + snapshots + interview + hook) was theoretical drift, never matched repo reality._
