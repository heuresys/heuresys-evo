# ADR-0019: Repository visibility flip (private → public) + branch protection enforcement

**Status**: Superseded
**Date**: 2026-05-04 (S9-S10)
**Authors**: Enzo Spenuso
**Supersedes**: ADR-0005 (GitHub mirror privato come backup, non workflow)
**Superseded by**: ADR-0021 (branch protection rebalanced 4+3 invece di 7 mandatory)
**Phase**: post-S9 hardening + S10 PR-driven workflow enablement

> **Note S11**: la sezione "Step 2 — Branch protection attiva" di questo ADR descrive la
> configurazione iniziale STRICT 7-check. Quella sub-decisione è stata sostituita da
> ADR-0021 dopo forense S10 che ha mostrato over-engineering relativo (frizione
> sproporzionata al rischio reale per solo coder + auto-merge + nightly cron). Il resto
> dell'ADR (visibility flip, allow_auto_merge, allow_update_branch, workflow PR-driven)
> resta in vigore.

## Context

Il repo `heuresys/heuresys-evo` era privato fino a 2026-05-04 secondo ADR-0005 (S6). Durante Sessione 9 (2026-05-04 04:00 UTC), il push del commit handoff (`3bf0aa8`) ha trovato CI bloccata dal messaggio:

> _"recent account payments have failed or your spending limit needs to be increased"_

I 3 workflow (CI/Build/Security) sono stati killati in 2 secondi senza eseguire alcun job. Investigazione: GitHub Actions billing exhausted per account (free private GHA quota saturata).

Opzioni considerate:

1. **Risolvere billing**: pay-per-use abilitato sull'account → costo continuativo per single-developer side project
2. **Flippare repo a public**: GHA illimitate per repo public, niente costo → unblocco immediato CI

Pre-flip: gitleaks scan completo della history (75 commit) → **0 leak** rilevati. Working tree pulito a parte node_modules false positives. Sicurezza confermata per esposizione pubblica.

Conseguenze del flip che vanno gestite:

- **License**: repo pubblico senza LICENSE file = "all rights reserved" per default. Decisione esplicita migliore.
- **Branch protection**: era Pro-only feature in private (non disponibile sul piano gratuito), diventa **gratis** su public.
- **Workflow PR-driven**: l'ADR-0005 originale prescriveva `git push origin main` direct (bypass review). Con repo pubblico + branch protection attiva, il workflow naturale diventa PR-based.

## Decision

### Step 1 — Repo flippato a PUBLIC (S9, 2026-05-04 04:30 UTC)

`https://github.com/heuresys/heuresys-evo` ora **public**. GHA illimitate, no rischio futuro di billing block. Pre-flip security verificato (gitleaks 75 commit history clean).

### Step 2 — Branch protection attiva su `main` (S10, 2026-05-04 13:30 UTC)

Configurazione applicata via `gh api PUT /repos/heuresys/heuresys-evo/branches/main/protection`:

| Setting                           | Valore                                                                    | Razionale                                                 |
| --------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------- |
| `required_status_checks.strict`   | `true`                                                                    | PR branch deve essere up-to-date con main prima del merge |
| `required_status_checks.contexts` | `[lint, typecheck, test, build-workspaces, gitleaks, semgrep, npm-audit]` | 7 job da workflow CI/Build/Security — copertura completa  |
| `required_linear_history`         | `true`                                                                    | No merge commits, solo squash o rebase                    |
| `allow_force_pushes`              | `false`                                                                   | Blocca `git push --force` su main                         |
| `allow_deletions`                 | `false`                                                                   | Blocca `git branch -D main` o equivalent                  |
| `enforce_admins`                  | `false`                                                                   | Override emergenza disponibile (single contributor)       |
| `required_pull_request_reviews`   | `null`                                                                    | Single contributor → review obbligatoria sarebbe overkill |

### Step 3 — Auto-merge + auto-update branch enabled (S10)

Repo settings PATCH:

- `allow_auto_merge: true` — `gh pr merge --auto --squash --delete-branch` mette PR in cascade automatica
- `allow_update_branch: true` — GitHub aggiorna automaticamente i branch BEHIND main (compatibilmente con strict checks)

Effetto combinato: cascade di merge multipli (es. 10 PR Dependabot S10) procede senza intervento manuale dopo trigger iniziale `--auto`.

### Step 4 — Workflow PR-driven (sostituisce ADR-0005 push direct)

Da S10 in poi:

- Niente `git push origin main` direct (blocked da `allow_force_pushes=false` + linear history)
- Ogni cambio passa via feature branch + PR + 7 check verdi + auto-merge
- Branch naming dal CLAUDE.md: `<type>/<short-desc>` (es. `chore/s10-retention-rotation`, `docs/s10-alignment-critical`)
- Conventional commits enforced via commitlint (vedi CLAUDE.md "Convenzioni commit")

## Alternatives considered

- **Mantenere repo privato + pagare GHA**: rejected — costo ricorrente per side project single-dev sproporzionato. Inoltre branch protection sarebbe rimasta Pro-only.
- **Self-hosted GitHub runner**: rejected — overhead operativo (provisioning, manutenzione, security) per beneficio marginale.
- **Migrare a GitLab/Codeberg**: rejected — frizione di migration + perdita ecosystem GitHub Actions/Dependabot/Pages.
- **Public + LICENSE OSS (MIT/Apache)**: deferred — decisione esplicita licenza B2B SaaS pendente (vedi HANDOFF open question "License decision").

## Consequences

### Positive

- ✅ GHA illimitate (no rischio futuro billing block)
- ✅ Branch protection abilitata gratis (era Pro-only in private)
- ✅ Workflow PR-driven con safety net (7 required checks + linear history + no force push)
- ✅ Auto-merge + auto-update consentono cascade Dependabot fluida (verificato S10: 10 PR mergeati senza intervento manuale)
- ✅ Trasparenza pubblica del codebase (utile per recruiting/partnership futuri)
- ✅ GitHub Pages abilitato (S10) per pubblicazione Storybook (`https://heuresys.github.io/heuresys-evo/`)
- ✅ Coerenza con strategia "everything PR-driven" → audit trail completo via PR description + reviewer comments

### Negative

- ⚠️ License decision proprietary pendente (apparente "all rights reserved" è ambiguo legalmente)
- ⚠️ Workflow PR-driven introduce overhead piccolo per ogni change (rebase + CI wait + merge), ma mitigato da auto-merge
- ⚠️ Vincolo strict mode: PR multipli in cascade richiedono rebase sequenziali (mitigato da `allow_update_branch=true`)
- ⚠️ ADR-0005 (mirror privato) ora obsoleto e va navigato tramite supersession header

## Verification

```bash
# Verifica visibility
gh repo view heuresys/heuresys-evo --json visibility --jq .visibility
# → expected: "public"

# Verifica branch protection
gh api repos/heuresys/heuresys-evo/branches/main/protection --jq '{
  strict: .required_status_checks.strict,
  contexts: .required_status_checks.contexts,
  enforce_admins: .enforce_admins.enabled,
  linear_history: .required_linear_history.enabled,
  force_push_blocked: (.allow_force_pushes.enabled | not),
  deletion_blocked: (.allow_deletions.enabled | not)
}'
# → expected: strict=true, 7 contexts, enforce_admins=false,
#             linear_history=true, force_push_blocked=true, deletion_blocked=true

# Verifica auto-merge & auto-update
gh api repos/heuresys/heuresys-evo --jq '{allow_auto_merge, allow_update_branch}'
# → expected: {"allow_auto_merge": true, "allow_update_branch": true}
```

## Operational notes (post-S10)

- **Quando branch protection blocca push a main**: significa che il workflow funziona — switch a feature branch + PR.
- **Quando una cascade auto-merge stalla**: usa `gh pr update-branch <PR>` per forzare l'auto-update.
- **Quando un PR Dependabot resta BEHIND**: `gh pr comment <PR> --body "@dependabot rebase"` triggera rebase Dependabot side.
- **Override emergenza** (admin bypass): `gh pr merge <PR> --admin` (sconsigliato; documentare motivo nel commit message).
- **Aggiungere nuovo required check**: aggiornare `required_status_checks.contexts` array via `gh api PUT`.

## References

- ADR-0005 (superseded) — original rationale per repo privato
- ADR-0009 — Stack Version Strategy (npm audit state ora 0 vulns)
- ADR-0016 — CI/CD Strategy (branch protection era flagged "deferred post-MVP", ora attivata)
- `.handoff/HANDOFF.md` S9 addendum — narrativa flip + S10 priorities
- `.handoff/snapshots/HANDOFF-2026-05-04*.md` — snapshot dated della transizione
- S9 commits: `3bf0aa8` (handoff), `022d9f6` (post-flip handoff addendum)
- S10 PR cascade: #1, #2, #3, #6, #7, #8, #10, #13, #14, #15 (10 mergeati in ~50min)
