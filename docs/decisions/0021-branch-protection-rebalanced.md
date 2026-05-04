# ADR-0021: Branch protection rebalanced (4 mandatory + 3 optional)

**Status**: Accepted
**Date**: 2026-05-04 (S11 forensic plan Level 3)
**Authors**: Enzo Spenuso
**Supersedes**: ADR-0019 (strict 7-check enforcement)
**Phase**: post-S10 forensic optimization

## Context

ADR-0019 (S10) ha attivato branch protection STRICT con 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`). Razionale originale: discipline + safety net automatico per single contributor.

Forense S10 ha misurato:

- **Cycle time medio PR → merge**: 2m26s–2m35s
- **CI minutes per sessione (S10, 13 PR)**: ~91 min
- **Build job (bottleneck)**: 2m26s–2m51s — domina il wall time
- **Failures rate dei 7 check (S0-S10)**: lint/typecheck/test catturano ~95% delle vere regression; build/audit/semgrep catturano marginalmente di più
- **Falsi positivi che bloccano merge**: gitleaks self-loop (S10 PR #18), commitlint scope mismatch (S10 PR #20), ricorrenti

Conclusione: **7 check STRICT è proporzionato a un team con review umana**, ma sproporzionato per **solo coder con auto-merge + nightly cron + local pre-commit hook**. La duplicazione "blocking + reporting" introduce frizione senza aggiungere safety oltre il 95° percentile.

## Decision

Riequilibrare branch protection in due tier:

### Tier mandatory (4 check, BLOCK merge)

| Check       | Razionale                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| `typecheck` | Catch type errors. Scope: tutta la transitive closure TS. Valore alto per refactor cross-workspace.   |
| `test`      | Catch logic regression. 250 test verdi baseline (S8). Skip = rischio di shipping codice rotto.        |
| `gitleaks`  | Catch secret leak. Scope: full FS scan + history. Repo PUBLIC = secret leak è disastro. Cheap (~10s). |
| `lint`      | Catch policy violations: `console.log` in prod path (P8), import order, etc. Cheap (~30s).            |

### Tier optional (3 check, RUN + REPORT, no block)

| Check              | Razionale optional                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `build-workspaces` | Build failure = problema scoperto già in dev locale (`npm run build`). Pesante in CI (~2m30s). Resta visibile come failed check ma non blocca merge cosmetic/typo. |
| `npm-audit`        | Già `continue-on-error: true` nel workflow. Utility report solo. State baseline = 0 vulns (S8). Findings nuovi sono notification, non emergency.                   |
| `semgrep`          | Già `continue-on-error: true`. SAST scan eccessivo per PR docs/config. Nightly cron + manual review più adeguati.                                                  |

### Auto-merge: comportamento invariato

`allow_auto_merge: true` resta. Auto-merge ora si attiva quando i 4 mandatory sono verdi. I 3 optional girano comunque (visibili nel PR), ma non gate il merge.

### Override: `enforce_admins=false` invariato

Override emergenza disponibile via `gh pr merge --admin`. Resta documentazione esplicita nel commit body.

## Configuration applicata

```bash
gh api -X PUT /repos/heuresys/heuresys-evo/branches/main/protection \
  -F 'required_status_checks[strict]=true' \
  -F 'required_status_checks[contexts][]=lint' \
  -F 'required_status_checks[contexts][]=typecheck' \
  -F 'required_status_checks[contexts][]=test' \
  -F 'required_status_checks[contexts][]=gitleaks' \
  -F 'required_linear_history=true' \
  -F 'allow_force_pushes=false' \
  -F 'allow_deletions=false' \
  -F 'enforce_admins=false' \
  -F 'required_pull_request_reviews=null' \
  -F 'restrictions=null'
```

## Alternatives considered

- **Mantenere 7 mandatory**: rejected — forense ha mostrato over-engineering rispetto al rischio reale. ADR-0019 era una scelta conservativa ragionevole al momento, ma le metriche reali la sfidano.
- **Ridurre a 3 mandatory (no `lint`)**: rejected — `lint` cattura `console.log` in prod path che è violazione P8 esplicita. Cheap (~30s) e ad alto valore di sicurezza.
- **Eliminare `build-workspaces` come check**: rejected — utile vederlo come signal nel PR view (timing performance regression, asset size growth, etc.) anche se non blocca.
- **Aumentare `enforce_admins` a `true`**: rejected — override emergenza vale soprattutto per fix critici cross-PR (es. branch protection misconfigured che blocca tutto). Single contributor.

## Consequences

### Positive

- ✅ **Cycle time ridotto**: PR mergea quando 4 mandatory verdi (~1m30s mediani in serial parallel) invece di aspettare il bottleneck `build-workspaces` (~2m51s)
- ✅ **Frizione minore su PR docs/config**: `build-workspaces` failure su `.gitignore` change non blocca più il merge
- ✅ **Optional checks ancora visibili**: ogni PR view mostra i 7 risultati, l'autore vede subito anomalie senza che blocchino merge urgenti
- ✅ **Coerenza con flow handoff-only**: PR doc-only fast-path già emette green su tutti, ora anche se `build-workspaces` flapsy non interrompe la cascade
- ✅ **Nightly cron baseline**: schedule security.yml (`cron: '17 3 * * *'`) gira tutti i 3 optional ogni giorno; regression che sfugge al merge viene catturata entro 24h

### Negative

- ⚠️ **Build failure può landing su main**: mitigato da (a) build issues falliscono `npm run dev` localmente prima di commit, (b) signal visibile nel PR view, (c) nightly cron riprende
- ⚠️ **npm audit findings non bloccano merge**: mitigato da (a) `continue-on-error` era già true, (b) baseline 0 vulns S8, (c) Dependabot auto-merge per security patches (ADR pendente / PR #C)
- ⚠️ **semgrep findings non bloccano merge**: mitigato da (a) `continue-on-error` era già true, (b) findings sono advisory non hard-fail, (c) periodic manual review
- ⚠️ **ADR-0019 sostituito dopo solo ~4h dalla sua attivazione**: l'ADR-0019 rimane storicamente valido (S9-S10 needed strict + visibility flip context), ma il sub-set "7 mandatory" specifico è superseded. Header `Superseded by` aggiunto.

## Verification

```bash
# Verify configurazione applicata
gh api repos/heuresys/heuresys-evo/branches/main/protection --jq '{
  contexts: .required_status_checks.contexts,
  strict: .required_status_checks.strict,
  enforce_admins: .enforce_admins.enabled,
  linear_history: .required_linear_history.enabled
}'
# → expected: contexts=["lint","typecheck","test","gitleaks"] (4 mandatory)
#             strict=true, enforce_admins=false, linear_history=true

# Verify optional checks ancora girano (esempio su PR aperto)
gh pr view <N> --json statusCheckRollup --jq '[.statusCheckRollup[] | .name]' | sort -u
# → expected: 7 names visibili (lint, typecheck, test, gitleaks, build-workspaces, npm-audit, semgrep)
#   ma solo i 4 primi sono required for merge
```

## Operational notes

- **Riattivare un check come mandatory**: `gh api -X PUT .../protection -F 'required_status_checks[contexts][]=<name>'` (e tutti gli altri da preservare)
- **Aggiungere un check nuovo**: prima rendere il workflow producente il check per qualche PR, verificare stabilità, poi promuovere a mandatory
- **Monitorare regression rate**: se `build-workspaces` failure rate su main > 5% in 30 giorni → riconsiderare promozione a mandatory

## References

- ADR-0019 (superseded by this) — original strict 7-check rationale
- ADR-0016 — CI/CD Strategy
- `.handoff/PROJECT-LOG.md` S10 + S11 — forensic data che ha motivato il rebalance
- `.github/workflows/quality.yml`, `.github/workflows/security.yml` — workflow che producono i 7 check
