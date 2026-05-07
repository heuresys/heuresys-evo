# ADR-0024 — Phase 14.SH Brand-driven role-based shell live e2e

- Status: accepted (plan approved 2026-05-07T16:35Z, awaiting fresh session execution)
- Date: 2026-05-07
- Supersedes: —
- Phase: 14.SH (Shell + Sidebar + Views + Polish)

## Context

Post-promozione DBMS bare-metal a SoT (ADR-0023), il database contiene tutti i dati reali necessari (477k+ righe, 506 tabelle popolate, employees per 4 tenant, ESCO 3,040 occupations + 14k skills + 126k relations, SAP infotype tables, performance_reviews, goals, course_enrollments). Ma l'UI services/app è ancora scaffold minimo:

- `services/app/src/styles/active-theme.css` VUOTO → app gira su Tailwind generico, zero brand identity applicata
- Nessun `<AppShell>` cablato → niente sidebar, topbar, footer, user menu, theme toggle
- Login `services/app/src/app/login/page.tsx` non allineato a mockup brand
- 9 dashboard preset rendono ma senza navigation tra di loro
- Nessuna logica role-based: la sidebar dovrebbe cambiare per ognuno degli 8 ruoli (SUPERUSER..EMPLOYEE)
- "Viste specifiche" sidebar (Talent registry, Skill gap, Career bridging, Audit log, Settings) sono link morti
- 7 widget composite usano SQL "static-via-SELECT" invece di real aggregations su employee_skills × department, esco_skill_relations, performance_reviews

L'utente ha richiesto: "rendere live e funzionali i modelli brand già definiti come promuovibili. Dashboard complete di tutti gli oggetti e funzionanti, dinamicamente assemblate in funzione del ruolo, sidebar voci alimentate da API/routes/pipelines reali. Importare da `/home/ubuntu/heuresys.com.evo` quando possibile."

## Decision

**Avviare Phase 14.SH (Brand-driven Shell): 5 fasi sequenziali + parallel backup track, fresh session autonomous.**

Approccio import-first: survey legacy `/home/ubuntu/heuresys.com.evo` (~68% riutilizzabilità accertata: AppShell 90%, Sidebar 95%, role-based nav hook 95%, RBAC middleware 100%, 25+ API routes 70-80%, 5-15 frontend pages 50-65%). Build from scratch solo per gap.

### Decisioni utente confermate

| ID      | Decisione              | Valore                                       |
| ------- | ---------------------- | -------------------------------------------- |
| D-LOGIN | Login mockup canonical | `login-aurora.html` (background animato)     |
| D-SCOPE | Scope viste secondarie | Coverage completa (~50-70 viste) per 8 ruoli |
| D-THEME | Theme default          | Dark (light toggle pari dignità)             |
| D-A11Y  | Compliance livello     | WCAG 2.2 AAA full                            |

### Fasi

1. **FASE 1 — Brand identity applied** (~4-5 FTE-day): tokens CSS da `mu-architect-legacy.html`, `<HeuresysWordmark>` React, `<AppShell>` cablato in `(app)/` route group, login allineato a `login-aurora.html`, sposta routes sotto `(app)/`.
2. **FASE 2 — Role-based dynamic sidebar** (~2-3 FTE-day): import legacy `use-sidebar-nav.ts` + `navigation.ts`, definisci `SIDEBAR_MAP: Record<UserRole, NavConfig>` per 8 ruoli, `getNavForUser(session)`, active state via `usePathname()`.
3. **FASE 3 — Sidebar views live data e2e** (~10-15 FTE-day): inventory matrix 8 ruoli × ~50-70 viste, import-first 10-15 API routes legacy + 5-15 frontend pages legacy, build from scratch per gap, RBP gates estratti in `packages/shared/src/rbp/`.
4. **FASE 3.6 — Composite real aggregations** (~2-3 FTE-day): `phase14e_composite_real_aggregations.sql` replace 5 static-via-SELECT con real aggregations su employee_skills × department + esco_skill_relations + performance_reviews + employee_skill_assessments.
5. **FASE 4 — UX polish + WCAG 2.2 AAA** (~4-5 FTE-day): theme toggle + a11y AAA full audit (axe-core + manual screen reader, contrast 7:1, target size 24×24, drag alternatives, prefers-reduced-motion, live regions, focus order, inline help).
6. **FASE 5 — Production perf + handoff finale** (~1-2 FTE-day): next build && start, autocannon, P95 ≤ 500ms target, restart dev, screenshot final 8 ruoli × N viste.
7. **Backup track parallel** (~1 FTE-day): cron daily/weekly/monthly, off-site Oracle bucket, restore drill mensile.

**Stima totale**: 24-34 FTE-day (sprint corposo, multi-fase).

### Split obbligatorio in 3 fresh session

24-34 FTE-day eccede il limite raccomandato per single session Claude Code (~15 FTE-day prima di context saturation + drift cognitivo + cumulative error rate elevato). Split:

| Session  | Fasi incluse                                                                 | Stima FTE-day | Stop condition                                                                              |
| -------- | ---------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------- |
| **SH-1** | FASE 1 (Brand applied) + FASE 2 (Role-based sidebar) + Backup track parallel | 7-9           | Brand identity applicata · sidebar dinamica 8 ruoli · cron backup attivo + drill verificato |
| **SH-2** | FASE 3 (50-70 viste live e2e)                                                | 10-15         | viste e2e con dati real DBMS · RBP gates · `role-views-matrix.md` popolato                  |
| **SH-3** | FASE 3.6 + FASE 4 + FASE 5                                                   | 7-10          | composite real · WCAG 2.2 AAA pass · perf prod · Phase 14.SH closure                        |

Tra le sessioni: handoff via STATE.md + HANDOFF.md update + commit dedicato `chore(handoff): SH-N closed → SH-(N+1) ready`. DBMS SoT immutato. Servizi UP cross-session.

## Rationale

Tre opzioni considerate:

| Opzione                                               | Pro                                                                                                  | Con                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **A** Build from scratch tutto evo (no legacy import) | Codebase 100% pulito, no debt                                                                        | 35% velocity penalty (auth, nav, RBAC, API CRUD), tempo ~50-70 FTE-day vs 24-34 |
| **B** Import-first da legacy (this ADR)               | 68% riutilizzo accertato, velocity gain ~35%, risk minimo (codebase compatibile Next.js 16/Prisma 5) | Manutenzione: gestire import + adapt + drift legacy futuro                      |
| **C** Iterative quick win (subset 20 viste)           | Rapido demo V1                                                                                       | Non soddisfa D-SCOPE confermato dall'utente (coverage completa)                 |

**Opzione B scelta** — l'utente ha esplicitamente richiesto verifica importabilità prima di build from scratch. Coverage completa (~50-70 viste) richiesta. Risparmio velocity ~35% vs from-scratch.

## Consequences

### Positive

- Brand identity `mu-architect-legacy` finalmente operativa (mockup → pixel)
- 50-70 viste live e2e con dati real DBMS SoT
- WCAG 2.2 AAA full compliance (massimo livello procurement enterprise)
- Sidebar dinamica role-based (8 ruoli) con active state sync
- Composite widgets real aggregations (replace static-via-SELECT)
- Import legacy = velocity gain + battle-tested patterns

### Negative / debt

- **Sprint corposo** (24-34 FTE-day) → potenziale split in 2 sub-sprint se troppo grosso per una sessione single
- **Drift legacy**: l'import crea dipendenza concettuale da legacy code; manutenzione futura richiede reconciliation se legacy evolve. Mitigation: legacy è frozen historic post-greenfield, no further evolution
- **WCAG AAA refactoring**: contrast 7:1 forced richiede revisione tokens OKLCH `mu-architect-legacy`, target size 24×24 può impattare layout density density
- **Drag alternatives** Sprint 3.C editor (already shipped) → keyboard alternative da retrofit
- **Backup chain automation parallel**: aggiunge effort, ma fondamentale per SoT governance

### Constraints AAA da rispettare

- Contrast 7:1 testo normale, 4.5:1 large/UI (vs AA 4.5/3)
- Target size minimo 24×24px per ogni interactive
- Drag alternatives (keyboard arrow keys + space, button-based reposition)
- No timing-out forms (NextAuth refresh trasparente)
- Focus order esplicito + aria-flowto
- `prefers-reduced-motion` rispetta animazioni
- Live regions `aria-live` su loading/error
- Inline help context-sensitive widget composite

## Verification

Stato finale atteso post fresh session:

- [ ] 1 commit per fase + N per FASE 3 view-by-view (~30-50 commit totali) tutti su main
- [ ] DBMS SoT immutato (forensic count check passa)
- [ ] Login brandizzato `login-aurora.html` operativo
- [ ] AppShell cablato con sidebar dinamica per 8 ruoli
- [ ] 50-70 viste live e2e (sidebar voci → page con dati real DBMS, NO mock)
- [ ] 30/30 dashboard widget bound (post phase14e composite real)
- [ ] vitest 153+/153+ verde
- [ ] Playwright matrix invariata 100/100 + nuovo suite role-nav 8 ruoli
- [ ] Production perf P95 ≤ 500ms (target) o ≤ 600ms (acceptable + follow-up)
- [ ] Backup chain (daily/weekly + restore drill verificato)
- [ ] WCAG 2.2 AAA full pass (axe-core + manual screen reader)
- [ ] Theme dark default + light toggle pari dignità + `prefers-reduced-motion` rispettato

## References

- Plan canonical: `~/.claude/plans/questo-quello-che-glittery-charm.md` (approvato dall'utente 2026-05-07T16:35Z)
- Handoff input fresh session: `.handoff/HANDOFF.md`
- Role-views matrix: `docs/20-architecture/role-views-matrix.md`
- Brand state: `.ux-design/BRAND-STATE.md` Phase 10
- Mockup brand: `.ux-design/06-mockups/auth/login-aurora.html` + `.ux-design/06-mockups/dashboards/*.html`
- Aesthetic source: `.ux-design/02-aesthetic/direction-explorations/mu-architect-legacy.html`
- ADR-0023 DBMS SoT promotion (foundation per questo ADR)
- ADR-0022 OpenAI advisor (related, già shipped Sprint 2.F)
- Decisions log: `.ux-design/DECISIONS-LOG.md` L34
