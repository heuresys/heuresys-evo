# heuresys-evo — Current State

> Updated: 2026-05-13T21:00Z · S61 cultural reform closed · HEAD `3a2e7a3`

## Debt attivo

Nessuno. Sistema fermo.

## Stack snapshot delta (S60-bis + S61)

- **S60-bis CW-LCP1** (commit `354c549`): split `palette-framework.css` (1808 LOC) → `palette-core.css` (147 LOC `:root` defaults, root layout) + `palette-variants.css` (1670 LOC 17 palette blocks, `(app)/` + `/brand-studio` only). Bundle delta `/login` 6,818→5,701 KB (−1,116 KB / −16.4%) · pre-auth `/`, `/forgot-password`, `/_not-found` 6,818→511 KB (−92.5%) · `(app)/*` invariate.
- **S61 reform** (commit `3a2e7a3`): introdotta distinzione **Debt vs Raccomandazioni** in `docs/_meta/operating-baseline.md` § CARD-5. STATE.md ora usa "Debt attivo" (literal "Nessuno. Sistema fermo." se vuoto). Audit doc NON includono più "Next steps" / "Recommendations" — quelle migrano in `.handoff/BACKLOG.md` opzionale.

## Verification

```bash
# Sistema fermo: nessun debt → policy STATE.md applicata
grep -E "Possibili direzioni|Top priorities" .handoff/STATE.md | grep -v "rimossa" | head
# expected: zero match

# Bundle stats CW-LCP1 reproducible
cd services/app && NODE_OPTIONS='--max-old-space-size=4096' npx next experimental-analyze -o

# Production health
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://evo.heuresys.com/login

# Typecheck pulito
cd services/app && npx tsc --noEmit
```

## References

- `docs/_meta/operating-baseline.md` § CARD-5 "Debt vs Raccomandazioni" — regola canonical
- `.handoff/BACKLOG.md` — menu raccomandazioni opzionali (non-vincolante, 11 entries)
- `docs/_audit/2026-05-13-bundle-perf-cw-lcp1-result.md` — CW-LCP1 ship report
- `~/.claude/plans/francamente-una-situazione-noble-journal.md` — plan S61 reform
