# heuresys-evo — Current State

> Updated: 2026-05-13T19:00Z · S60 closed + S61 cultural reform · HEAD `354c549`

## Debt attivo

Nessuno. Sistema fermo.

## Stack snapshot delta (S58-S60 + S61 reform)

- **S58-S60**: DBMS 314+ tabelle (2 new: `tenant_revenue_periods`, `equity_grants`) · 370+ RLS policies · `heuresys` user **NOBYPASSRLS** · migration phase18p→v · G6 preset `_v2` 7/7 100% live · 16 commit chain (`e5cd4df` → `ff989d9`) · ADR-0031 (P11 + RLS hardening) accepted-implemented.
- **S60-bis**: `palette-framework.css` split (CW-LCP1, commit `354c549`) — `/login` first-load JS −1,116 KB (−16.4%) · pre-auth `/`, `/forgot-password`, `/_not-found` −6,307 KB (−92.5%).
- **S61 reform**: distinzione **Debt vs Raccomandazioni** introdotta in operating-baseline. Sezione "Possibili direzioni" rimossa da STATE.md → `.handoff/BACKLOG.md` opzionale.

## Verification

```bash
# Sistema fermo: nessun debt → policy STATE.md applicata
grep -E "Possibili direzioni|Top priorities|Next session" .handoff/STATE.md
# expected: zero match

# CW-LCP1 bundle live
ssh oracle-vm-default 'curl -s -o /dev/null -w "HTTP %{http_code}\n" https://evo.heuresys.com/login'

# Typecheck pulito
cd services/app && npx tsc --noEmit

# Production health
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://evo.heuresys.com/login
```

## References

- `docs/_meta/operating-baseline.md` § "Debt vs Raccomandazioni" — regola canonical
- `.handoff/BACKLOG.md` — menu raccomandazioni opzionali (non-vincolante)
- `docs/_audit/2026-05-13-bundle-perf-cw-lcp1-result.md` — CW-LCP1 ship report
- `docs/_meta/sprint-history.md` § S58 → S60 close
