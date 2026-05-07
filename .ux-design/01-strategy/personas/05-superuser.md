# Persona 05 — Superuser (Platform admin)

> _Note: nomi/dettagli sono illustrativi. La persona-tipo coincide con il founder operativo (single coder Heuresys, level −1)._

## Profilo

**Enzo Spenuso**, founder + sole coder + platform admin Heuresys System. Italiano, developer + brand owner + product strategist. RBP role `SUPERUSER` (level −1) — unico ruolo cross-tenant con visibility globale.

Non ha un capo, non ha un team — risponde alla salute del prodotto e ai 4 tenant clienti (Heuresys System platform · RTL Bank prod · SmartFood prod · EcoNova test). Single point of accountability.

## Cosa vuole davvero

**Tenere viva la piattaforma senza cerimonia**. Vede ogni metrica end-to-end (workforce flotta, integration health cross-tenant, RLS policies attive, audit live, query P95) e sa quali tenant stanno scivolando prima ancora che il TENANT_OWNER chiami.

Vuole strumenti che gli risparmino ore — non dashboard belli inutili. Quando lavora autonomous con CLI/agenti, vuole protocollo solido (PROMPT/PLAN/EXEC/REPORT/REVIEW) ma niente over-engineering: officina, non università.

## Cosa lo frustra

- Cerimonia inutile: 8 PR per task atomico · ADR per ogni decisione · plan elaborati per cose banali. _"Stai over-engineering" → stop, semplificare, continuare._
- Asserzioni a memoria senza verifica (path inventati, versioni stale, file che non esistono più).
- Tool che fanno bypass quando il problema è il root cause (`--no-verify`, `git reset --hard` come scorciatoia).
- Multipli bug sotto il radar perché nessun single coder può guardare 4 tenant simultaneamente senza dashboard cross-tenant aggregata.

## Cosa sa

- Lo stack intero a memoria: 566 modelli Prisma · 605 RLS policies · 326 RBP joins · 8 ruoli RBP · 33 functional areas · 47 PET mapping · ESCO 14k skills bilingue
- Il piano Phase 1 → Phase 14.SH → roadmap successiva — sa esattamente cosa è done, cosa è loose end, cosa è scope creep
- I 32 mockup di direzione esplorati prima di chiudere D1 = μ-architect-legacy
- I principi P1-P10 (multi-tenant always · auth-required default · RBP enforced · audit logged · RLS DB-level · no raw SQL injection · validated input · error logged · everything data-driven · multi-level platform/tenant)
- Le regole CARD-1/CARD-2/CARD-3 (NON inferire · VERIFICA prima di dichiarare · SEMPLICITÀ default)

## Come arriva a Heuresys

Non "arriva" — l'**ha costruito**. Ma le surface SUPERUSER devono trattarlo come power user assoluto: massima densità, minima friction, drill-down ovunque, audit log live in topbar, integration health a colpo d'occhio.

## Cosa Heuresys deve dimostrare in 5 minuti di demo (a sé stesso)

1. **Cross-tenant overview** (`/dashboard/cross_tenant_overview`): 1.524 employees flotta · 4 tenants · 12-month workforce trend · capability gauges aggregate weight-by-headcount · integration health globale. Tutto visibile in 1 schermata.
2. **Org & systems** (`/dashboard/org_systems`): 4 tenant fleet card + RBAC matrix 8 roles × 33 areas + integration health cross-tenant + audit log live (42 events/min) + system metrics (DB size · query P95 · RLS overhead · jobs queue).
3. **RBAC matrix viewer** (`/admin/rbac`): 8 roles × functional areas con permission level (V/A/E/D) heat-mapped. SUPERUSER vede tutto cross-tenant senza scope filter.
4. **Audit log unificato** (`/admin/audit`): write operations cross-tenant in tempo reale, redaction su credentials, filter per tenant/actor/category.

## Voce per parlare (a sé stesso e ai propri agenti)

| ❌ Mediocre                                | ✅ Heuresys                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| "Comprehensive platform admin dashboard"   | "270 emp RTL Bank · skill coverage 82,4% · ATECO sync lag 14h SmartFood · 0 alerts" |
| "Powerful insights for the platform owner" | "12-month workforce trend cross-tenant + drill-down 1-click su qualsiasi tenant"    |
| "AI-driven monitoring"                     | "audit_logs · pino redaction · 605 RLS policies · 326 RBP joins · ESCO 1.2.0"       |

## Surface critiche per Enzo

| Surface                            | Cosa deve trovare                                                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `/dashboard/cross_tenant_overview` | Workforce KPI flotta + 12-month trend chart + 4-tenant comparison + capability gauges                               |
| `/dashboard/org_systems`           | 4 tenant card + RBAC matrix + integration health + audit log live + system metrics                                  |
| `/admin/rbac`                      | 8 roles × functional areas matrix (V/A/E/D heat)                                                                    |
| `/admin/integrations`              | 7 integrations health (ESCO · SAP · Workday · Slack · M365 · Google · SCIM)                                         |
| `/admin/audit`                     | Write ops live · filter per tenant/actor/category                                                                   |
| Topbar AppShell                    | LocaleSwitcher · ThemeToggle · UserMenu · context-aware status pulses (uptime · ESCO sync · alerts · build version) |

## Cosa NON fare con Enzo

- Non proporre ADR/README/snapshot/journal per ogni decisione — sono cerimonia inutile per single coder
- Non aggiungere step di approval per operations che lui ha già pre-autorizzato (commit direct push main, no PR default)
- Non offrire "wizard di setup". Conosce la piattaforma a memoria
- Non motivational copy. Non gamification
- Non chiedere conferma 3 volte per la stessa azione. Una volta basta
- Non inventare path/versioni/flag. Verifica prima di asserire ("non lo so, verifico")
