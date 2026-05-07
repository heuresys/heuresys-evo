# HANDOFF — fresh session input

> Updated 2026-05-07T20:05Z · last update: **PHASE 14.SH FULLY CLOSED** (SH-1 + SH-2 + SH-3 done)
> Plan file: `~/.claude/plans/questo-quello-che-glittery-charm.md` (eseguito)
> Stato repository: branch `main` clean post `01c4464` (commit principale SH-3)
>
> ## 🟢 Phase 14.SH done — brand-driven role-based shell live e2e + 17+ routes + composite real + theme toggle + perf baseline
>
> Next session: post-Phase-14.SH carry-forward o nuova phase. Riferimenti:
> - Full WCAG 2.2 AAA audit (axe-core CI + manual NVDA/VoiceOver) — alta priorità
> - Production build perf bench (next build && next start + autocannon)
> - /dashboard/cross_tenant_overview + /dashboard/tenant_owner_overview presets
> - /team/reviews + /team/goals (LINE_MANAGER follow-up)
> - i18n locale switcher per le 9 viste SH-3
> - Storybook stories per le viste SH-2/SH-3
> - API gateway cross-service auth (NextAuth v4 → Auth.js v5) — bypassed con Prisma direct, full fix possibile usando `jose` library JWE decode
>
> Il prossimo update richiesto dipende dalla direzione che daremo (post-Phase-14.SH features vs polish).

## Identità della prossima sessione

**Tipo**: fresh session autonomous (con interventi utente solo su decisioni esplicite)
**Obiettivo**: rendere i mockup brand `mu-architect-legacy` operativi end-to-end con sidebar role-based + ~50-70 viste live alimentate da DBMS SoT + WCAG 2.2 AAA + theme dark default
**Stima totale effort**: 24-34 FTE-day (split in 3 sessioni — vedi sotto)
**Mode operativo**: autonomous con commit + push per ogni step completato

### ⚠️ Split obbligatorio in 3 sessioni

24-34 FTE-day eccede il limite raccomandato per single session Claude Code (~15 FTE-day max prima di context saturation + drift). Split:

| Session | Fasi | Stima FTE-day | Trigger fresh session |
|---|---|---|---|
| **SH-1** (questo handoff) | FASE 1 + FASE 2 + Backup track | 7-9 | `cat .handoff/HANDOFF.md` |
| **SH-2** | FASE 3 (50-70 viste live e2e) | 10-15 | dopo commit `chore(handoff): SH-1 closed → SH-2 ready` |
| **SH-3** | FASE 3.6 + FASE 4 + FASE 5 | 7-10 | dopo commit `chore(handoff): SH-2 closed → SH-3 ready` |

Tra una session e l'altra: pausa utente per review + decisioni residue, poi fresh session legge HANDOFF aggiornato e parte.

**Questa sessione (SH-1) deve eseguire**: FASE 1 (Brand applied) + FASE 2 (Role-based sidebar) + Backup track parallel. Stop quando: brand identity applicata + login `login-aurora.html` operativo + AppShell cablato + sidebar dinamica 8 ruoli verde su Chrome MCP + cron backup attivo + restore drill verificato + STATE.md aggiornato + commit handoff per SH-2.

## Decisioni utente confermate (immutate, NO ri-domandare)

| ID | Decisione | Valore |
|---|---|---|
| D-LOGIN | Login mockup canonical | `login-aurora.html` |
| D-SCOPE | Scope viste secondarie | Coverage completa (~50-70 viste) per 8 ruoli |
| D-THEME | Theme default | Dark (light toggle in pari dignità) |
| D-A11Y | Compliance livello | WCAG 2.2 AAA full |

## Pre-flight checklist (PRIMA AZIONE)

```bash
# 1. Stato services
pwsh D:/evo.heuresys.com/scripts/dev-local/tunnel-vm.ps1 -Status   # tunnel attivo?
curl -sS http://127.0.0.1:3200/login -o /dev/null -w "%{http_code}\n"  # 200 atteso
curl -sS http://127.0.0.1:8200/health -o /dev/null -w "%{http_code}\n"  # 200 atteso

# 2. Stato DBMS SoT integrità
ssh oracle-vm-default 'sudo -u postgres psql -d heuresys_platform -tA -c "SELECT count(*) FROM employees"'  # 270
ssh oracle-vm-default "ls -la /var/backups/heuresys-evo/"  # backup chain visibile

# 3. Repo state
cd D:/evo.heuresys.com
git status -sb                                              # clean
git log --oneline -5                                        # 6a48706 head
npm run typecheck --workspaces --if-present                 # 5/5 verde
npm test --workspace=services/app -- --run                  # ≥ 153/153 verde

# 4. Plan
cat ~/.claude/plans/questo-quello-che-glittery-charm.md | head -20  # plan visibile
```

Se uno qualunque di questi check fallisce:
- Tunnel down → `pwsh tunnel-vm.ps1` (auto-restart)
- Services down → `npx next dev -H 0.0.0.0 -p 3200` + `npm run dev --workspace=services/api-gateway`
- DBMS unreachable → ssh check + verify postgres systemd
- Git diverso da `6a48706` → `git pull --rebase origin main`

## Sequenza operativa (5 fasi + parallel backup track, split SH-1/SH-2/SH-3)

Lista completa task in `~/.claude/plans/questo-quello-che-glittery-charm.md`. Sintesi:

### 🟢 SH-1 (fasi questa sessione)

#### FASE 1 — Brand identity applied (12 task, ~4-5 FTE-day)

1. Pre-flight services
2. Estrai CSS tokens da `mu-architect-legacy.html` → `services/app/src/styles/active-theme.css`
3. Verifica HMR pickup (Chrome MCP screenshot)
4. Crea `<HeuresysWordmark>` in `packages/ui/src/components/wordmark.tsx`
5. Verifica wordmark render
6. Apri `login-aurora.html` con utente via Chrome MCP per conferma visiva (D-LOGIN già scelto)
7. Implementa `services/app/src/app/login/page.tsx` allineato a `login-aurora.html`
8. Crea route group `services/app/src/app/(app)/layout.tsx` con `<AppShell>` cablato (placeholder nav statico)
9. Sposta `/dashboard`, `/ontology`, `/explorer/*` sotto `(app)/`
10. Smoke browser: login + dashboard render con AppShell
11. Vitest + typecheck verdi
12. Commit + push: `feat(brand): apply mu-architect-legacy tokens + AppShell + login-aurora`

#### FASE 2 — Role-based dynamic sidebar (8 task, ~2-3 FTE-day)

13. Import legacy `services/frontend/src/lib/hooks/use-sidebar-nav.ts` + `lib/navigation.ts` + adapt NextAuth v4
14. Definisci `SIDEBAR_MAP` in `services/app/src/lib/navigation/role-nav-map.ts` per 8 ruoli
15. Implementa `getNavForUser(session)` server-side
16. Cabla AppShell con nav dinamico
17. Active state via `usePathname` + sezioni collapsibili
18. Test vitest role-nav per 8 ruoli
19. Smoke Chrome MCP login per 8 ruoli + verifica sidebar diversa
20. Commit + push: `feat(nav): role-based dynamic sidebar 8 roles`

### 🟡 SH-2 (fase prossima sessione)

#### FASE 3 — Sidebar views live data e2e (~30-50 task, ~10-15 FTE-day)

21. Crea schema `docs/20-architecture/role-views-matrix.md` (già scaffolded — da popolare)
22. Inventory: 8 ruoli × voci sidebar → matrix completa (utente conferma scope dettaglio)
23. Estrai shared RBP module: `packages/shared/src/rbp/`
24. Importa 10-15 API routes legacy (priority: users, employees, analytics-workforce, compensation, learning, audit-logs)
25. Importa 5-15 frontend pages legacy (priority: dashboard main, talent registry, skill gap)
26-N. Per ogni view: import OR build → page + query + RBP gate + smoke + commit
N+1. Smoke matrix completa: Chrome MCP login per 8 ruoli × ogni voce
N+2. Commit batch + push: `feat(views): N role-based views with live data e2e`

### 🟠 SH-3 (fasi terza sessione)

#### FASE 3.6 — Composite real aggregations (5 task, ~2-3 FTE-day)

N+3. Scrivere `db/migrations/phase14e_composite_real_aggregations.sql` (5 widget query reali)
N+4. Apply migration on bare-metal
N+5. Smoke browser: 5 dashboard preset con widget composite real
N+6. Vitest update se cambia adapter contract
N+7. Commit + push: `feat(dashboard): composite widgets real aggregations`

#### FASE 4 — UX polish + WCAG 2.2 AAA (5 task, ~4-5 FTE-day)

N+8. Theme toggle dark/light + persist localStorage (default dark D-THEME)
N+9. a11y audit WCAG 2.2 AAA (axe-core + Lighthouse + manual NVDA/VoiceOver)
   - Contrast 7:1 forced via OKLCH revisione
   - Target size ≥ 24×24px
   - Drag alternatives su Sprint 3.C editor (keyboard arrow keys)
   - `prefers-reduced-motion` rispettato
   - Focus order esplicito + aria-flowto
   - Live regions su loading/error
   - Inline help context-sensitive widget composite
N+10. Empty/loading/error states revisione completa (no demo fallback)
N+11. Mobile responsive (sidebar drawer, target size mantenuto)
N+12. Commit + push: `feat(ux): theme toggle + WCAG 2.2 AAA + responsive polish`

#### FASE 5 — Production perf + handoff finale (5 task, ~1-2 FTE-day)

N+13. `next build && next start` su 0.0.0.0:3200
N+14. autocannon su tutte route (login + 8 ruoli × viste)
N+15. Restart dev mode
N+16. Update STATE.md + BRAND-STATE.md finale
N+17. Commit + push: `feat(brand,nav,views): Phase 14.SH closure + perf baseline`

### 🟢 SH-1 (backup track parallel)

#### Backup track (parallel, ~1 FTE-day)

P+1. Crontab postgres daily backup
P+2. Restore drill script
P+3. Doc `docs/40-operations/dbms-backup-restore.md` (già scaffolded)
P+4. Commit + push: `chore(ops): governed backup/restore policy`

## Decision rules autonomous mode

| Trigger | Action |
|---|---|
| typecheck rosso | Fix nello stesso step, max 3 retry, escalate |
| vitest pre-esistente flaky non collegato | `.skip` + log + advance |
| Playwright e2e flaky con 1 retry verde | Pass |
| Tunnel SSH down | `tunnel-vm.ps1 -Start` + retry |
| Servizio crash unexpected | Restart entro 30s + log |
| Migration fail | Rollback transaction + escalate |
| Asset legacy mancante per view | Build from scratch + nota in role-views-matrix.md |
| Composite query lenta (>500ms) | Add cache TTL + fallback static-via-SELECT |
| Brand token conflict mockup vs operativo | Mockup wins (è SoT design) |
| User interrupt manuale | Save state in STATE.md + commit WIP + dump progress |

**Rule globale**: ogni fase è 1 commit + push. Rotture vs fase precedente → rollback locale + escalate.

## Service runtime policy (cross-fase)

- Browser dell'utente sempre disponibile (eccetto stop ≤ 60s in FASE 5 build prod)
- Stop graceful con log timestamp, restart immediato post-task
- Health check 3200 + 8200 verde prima di ogni commit

## Open questions residue (utente decide in flight)

1. **i18n coverage per 50-70 viste secondarie** — default proposto: SÌ, riusa `pickBilingual()`
2. **Audience positioning D2** (β Enterprise raccomandato) — default operativo: β Enterprise; riconsiderare in Phase 10/11

## File chiave da consultare

| Doc | Path | Contesto |
|---|---|---|
| Plan canonical | `~/.claude/plans/questo-quello-che-glittery-charm.md` | Sequenza task completa |
| STATE | `.handoff/STATE.md` | Stato corrente + last session brief |
| Operating baseline | `docs/_meta/operating-baseline.md` | Regole operative |
| Brand state | `.ux-design/BRAND-STATE.md` | Phase brand corrente + decisioni |
| Decisions log | `.ux-design/DECISIONS-LOG.md` | Cronologia decisioni brand |
| Role-views matrix | `docs/20-architecture/role-views-matrix.md` | Da popolare in FASE 3.1 |
| Backup policy | `docs/40-operations/dbms-backup-restore.md` | Parallel track |
| ADR-0023 | `docs/50-reference/decisions/0023-promote-baremetal-as-sot.md` | DBMS SoT promotion |
| ADR-0024 | `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md` | Phase 14.SH plan |

## Stop condition per ogni fresh session (split SH-1/SH-2/SH-3)

### SH-1 termina quando:
- FASE 1 done: tokens CSS in `active-theme.css` + `<HeuresysWordmark>` + `<AppShell>` cablato in `(app)/` route group + login `login-aurora.html` + routes spostate sotto `(app)/`
- FASE 2 done: `SIDEBAR_MAP` 8 ruoli + `getNavForUser(session)` + active state sync + sidebar diversa per ognuno degli 8 ruoli verificato Chrome MCP
- Backup track done: cron daily/weekly attivo + restore drill verificato 1× con count match
- Vitest 153+/153+ verde
- Commit: `chore(handoff): SH-1 closed → SH-2 ready`
- STATE.md + HANDOFF.md aggiornati per SH-2 input

### SH-2 termina quando:
- FASE 3 done: 50-70 viste live data e2e con dati real DBMS SoT
- Ogni voce sidebar per ogni 8 ruoli → page renderizzata con dati real (no demo placeholder)
- RBP gates su ogni view secondaria (estratti in `packages/shared/src/rbp/`)
- `role-views-matrix.md` popolato a coverage completa
- Chrome MCP screenshot per 8 ruoli × ogni voce
- Vitest invariato + nuovi test view-specifici verde
- Commit: `chore(handoff): SH-2 closed → SH-3 ready`
- STATE.md + HANDOFF.md aggiornati per SH-3 input

### SH-3 termina (= Phase 14.SH closure) quando:
- FASE 3.6 done: 30/30 widget composite real (`phase14e_composite_real_aggregations.sql`)
- FASE 4 done: WCAG 2.2 AAA full pass (axe-core + manual NVDA/VoiceOver)
- FASE 5 done: prod perf P95 ≤ 500ms (target) o ≤ 600ms (acceptable + follow-up)
- Verifica e2e finale: 8 ruoli × ogni voce sidebar → screenshot OK
- Vitest 153+/153+ verde · Playwright matrix invariata 100/100 + role-nav suite verde
- Documentazione completa aggiornata (STATE, BRAND-STATE, DECISIONS-LOG L35+)
- Commit final: `feat(brand,nav,views): Phase 14.SH closure + perf baseline`
