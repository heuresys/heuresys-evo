# heuresys-evo — Current State

> Updated: 2026-05-14T18:10Z · **S63 CLOSED** · HEAD `33d7e6c` · 16 commits cycle 2 shipped · `origin/main` in sync · **VM deployed** · prod smoke 200
>
> Struttura post-L19 reform (operating-baseline.md § CARD-5): Sessione corrente + Debt + Follow-up + Flussi. Single SoT.

## Sessione corrente (S63 — 2026-05-14 · CLOSED 18:14Z · deployed prod)

Sessione lunga autonomous run + extension manuale che ha eseguito il plan canonical `~/.claude/plans/c-stata-una-continua-indexed-cocke.md` "Investor-Ready UI Rebuild" Phases 0-7 + 3 reform brand cycle 2 (L17/L18/L19/L20) + hotfix S61. **16 commits** su `origin/main` in catena. **VM deployata** (HEAD `33d7e6c`) + 3 systemd services restarted active + prod smoke `/login` HTTP 200 + `/api/health` HTTP 200.

**Output principale**:
- 5/8 Phase rebuild shipped (0-4 full · 5-6 partial · 7 minimal) — 21 file canonical/spec/code/migration + 84 dashboard_elements seeded
- 12 preset `_v2` HR_DIRECTOR browser-verificati live come `valentina.conti@rtl-bank.org` (4 process_*_v2 Phase 1 + 8 nuovi Phase 4)
- Resolver hierarchy fix (`resolveElements` deduplica by `(parent_element_id, position)` tuple, era solo `position` → collassava children)
- 7 hotfix runtime SQL/schema/adapter shape post browser verification (L16): json_agg wrap Histogram/ActivityFeed, hire_date vs hired_at, user_email vs actor_email, rbp_role_permissions vs rbp_role_area_permissions, UUID leak pill `0c54b8`
- L17 pattern de reference research artifact promosso a canonical cycle 2 (`icon-libraries-showcase.html` benchmark vivente)
- L18 hover transition pattern applicato alle 5 classi card widget HR_DIRECTOR (operational dashboard ora 100% pattern-fedele vs 95% pre-modifica)
- L19 reform parziale CARD-5: ripristinato session start protocol "ampio" con sessione corrente + follow-up + flussi (revert parziale S61 over-correction)

**Lezione cardinale registrata** (R5 + CARD-2): typecheck PASS + smoke HTTP 200 + lint exit 0 NON dimostrano feature correctness. Per UI changes serve **browser test obbligatorio via claude-in-chrome MCP**. Aggiunta CARD-2 ("UI changes → testare in browser prima di claim done") già in baseline; rinforzata da L16 fail.

## Deploy S63 — oracle-vm-default (chiusura sessione)

```
2026-05-14T18:10Z — git pull origin main (ff989d9 → 33d7e6c, 16 commits delta)
2026-05-14T18:10Z — npm run build services/app (BUILD_ID 16:10, 149MB standalone, Compiled successfully in 64s + TypeScript 40s + 38/38 static pages)
2026-05-14T18:11Z — sudo systemctl restart heuresys-app heuresys-api-gateway heuresys-enrichment
2026-05-14T18:13Z — heuresys-app startup complete (3.9GB memory peak, normale Next.js)
2026-05-14T18:14Z — Smoke prod: /login HTTP 200 · /api/health HTTP 200 · 3 services active
```

DB già allineato (phase19a/b/c/d/e/f/g applicate via psql direct durante sessione). No Prisma migration step necessario.

## Stato sistema (smoke)

```bash
# Working tree
git status -sb              # ## main...origin/main · clean (1 PNG untracked S62)

# HEAD chain S63 (12 commits)
git log --oneline 0ebf49e^..HEAD
# baaa12d L18 hover transition pattern applied
# 08b2eff L17 research artifact pattern promosso canonical
# d322ed3 7 hotfix browser-verified per 12 preset _v2
# b4d94d0 Phase 7 closure minimal
# babd922 Phase 5+6 i18n widget + route decision
# ff6872b S63 closure v1 (STATE + L13)
# 3707997 Phase 4 — 8 nuovi preset _v2 + 40 elements
# 440769f Phase 3 — 6 widget brand nuovi
# 1d323db Phase 2 — 8 query modules role-aware
# 114d228 Phase 1 — 4 process_*_v2 reseed
# 0ebf49e Phase 0 foundations + canonical

# Smoke prod + dev
curl -sI https://evo.heuresys.com/login | head -1   # HTTP/1.1 200 OK
curl -sI http://localhost:3200/login | head -1      # HTTP/1.1 200 OK

# Count preset _v2 published
ssh oracle-vm-default "sudo -u postgres psql heuresys_platform -c \"SELECT COUNT(*) FROM dashboard_presets WHERE code LIKE '%_v2' AND is_published = true;\""
# expect 19 (11 pre-S63 + 8 nuovi Phase 4)

# Typecheck
cd services/app && npx tsc --noEmit && echo OK

# Role-shaper unit tests
cd services/app && npx vitest run src/lib/data/__tests__/_role-shaper.test.ts   # 42/42 PASS

# Tenant-id lint
npm run lint:tenant-id      # exit 0
```

## Debt attivo

**Nessuno**. Sistema funzionante end-to-end. Tutti i preset _v2 browser-verificati, console errors 0 cross-route, P11 compliance rispettata, brand identity allineata al pattern canonical L17.

## Follow-up tracciabili

Non bloccanti, opzionali. Pronto a essere ripreso quando l'utente lo richiede.

| # | Item | Effort | Priority | Note |
|---|---|---:|:-:|---|
| 1 | **Cycle 2 directory `05-research/`** | ~30min | M | Creare folder per ospitare nuovi artefatti research cycle 2. Oggi `01-canonical/`, `02-tokens/`, `03-mockups/`, `04-promotion/` sono le 4 sub-dirs esistenti. Categoria mancante per artefatti research-pattern (L17). |
| 2 | **Skill `/research-artifact-new <topic>`** | ~2-3h | M | Scaffold automatizzato che crea nuovo HTML cycle 2 dal pattern + apre placeholder content. Riduce drift da manual copy-paste. Reference: `.ux-design/01-canonical/research-artifact-pattern.md`. |
| 3 | **Phase 5 sidebar refactor opzione A** | ~4-6h | L | Promote sidebar PrimaryNav link a `/dashboard/<preset_v2>` (cockpit-first navigation). Plan decision: `.ux-design/04-promotion/phase5-route-migration-decision.md` Opzione C status quo shipped; Opzione A è futuro upgrade. |
| 4 | **Phase 6.2 i18n sweep widget legacy** | ~3-5h | L | Refactor 21 widget brand pre-S63 (BrandKpiCard, BrandSuccessionCard, ecc.) per usare `pickWidgetString` o constants invece di hardcoded IT/EN. |
| 5 | **Phase 7 investor demo Chrome MCP** | ~6-10h | M | Chrome MCP loop 4 ruoli × 14 voci sidebar = ~56 screenshot in `.handoff/investor-demo/`. Lighthouse audit 5 preset principali. brand:audit cross-route final score (target avg ≥ 8). |
| 6 | **Storybook stories 6 widget brand nuovi** | ~4-6h | M | BrandEmployeeDirectoryGrid · BrandOkrCascadeTree · BrandReviewKanbanBoard · BrandWorkforceTrendLine · BrandCalibrationCard · BrandBonusPlanCard. TDD-first per audit pre-promotion. |
| 7 | **Phase 3.2 widget brand residui** | ~3-5h | L | `LearningProgress` widget + `CertificationBadgeGrid` (mappati a coverage da widget esistenti ma scaffold dedicato può alzare audit score). |
| 8 | **`role_default_dashboards` mapping** | ~1-2h | L | Aggiungere row per gli 8 nuovi preset `_v2` se servono come dashboard default per ruoli specifici. Oggi `/dashboard` HR_DIRECTOR → `tenant_owner_overview_v2` ancora; lasciato invariato. |
| 9 | **Promozione altri esempi vincenti** | ~1-2h | L | Audit dell'archive `.ux-design-archive-2026-05-13/02-aesthetic/*.html` per identificare altri mockup di qualità analoga a icon-libraries-showcase, candidati a benchmark vivente. |
| 10 | **Catalog DB `09-asset-showcase/` reactivation** | ~3-5h | L | SQLite tool localhost catalogazione asset brand identity. Archiviato cycle 1 post-S62 reset. Reattivazione su richiesta esplicita se serve workflow promotion asset. |

## Flussi di attività suggeriti

Direzioni multi-step plausibili per next session. Selezione human-curated, ciascuna richiede ≥3 task atomici.

| # | Flusso | Effort | Dipendenze | Outcome atteso |
|---|---|---:|---|---|
| **A** | **Drilldown slide-over pattern su preset cycle 2** | ~6-10h | nessuna | Implementare slide-over panel destra per drill: KPI click → trend → record list → record detail (Linear-style). Pattern previsto in `moodboard.md`. Da introdurre come Brand* widget nuovo + integrare nei 12 preset _v2. |
| **B** | **AI insight card su `/dashboard` HR_DIRECTOR** | ~4-6h | OpenAI env var attivo | Card narrative AI-generated che traduce KPI in 1 frase decisionale italiana sotto hero strip. Pattern moodboard cycle 2. P11: insight basata SOLO su dati live DB. |
| **C** | **Sparkline accanto a KpiRing** | ~3-5h | data-fetcher trend support | KpiRing widget esteso con mini-sparkline 12pt (trend 12-week). Pattern moodboard "Calm Cockpit". Richiede SQL trend query (es. headcount per settimana). |
| **D** | **Comparative research artifact #2 cycle 2** | ~4-6h | follow-up #1+#2 | Primo artefatto research cycle 2 che applica L17 pattern: `typography-stacks-showcase.html` o `color-palette-options.html`. Dogfooding pratico del pattern de reference. |
| **E** | **Cross-tenant SUPERUSER cockpit polish** | ~5-8h | nessuna | Browser-verify `cross_tenant_overview_v2` come `sysadmin` + sweep di drift dal pattern (es. UUID leak, scope-pill, hover transitions). Estende coverage da HR_DIRECTOR a SUPERUSER. |

## Open questions

Nessuna bloccante.

## References

### Documentazione canonical cycle 2
- **Plan canonical S63+**: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
- **Plan S62 reset**: `~/.claude/plans/in-questa-fase-io-spicy-galaxy.md`
- **Plan L17 promotion**: `~/.claude/plans/io-non-so-come-deep-sketch.md` (questa sessione)
- **Canonical cycle 2** (10 file): `.ux-design/01-canonical/*.md`
- **Specs Phase 1**: `.ux-design/04-promotion/specs/*.md` (6 file)

### Code shipped S63
- **Role-shaper**: `services/app/src/lib/data/_role-shaper.ts` + `__tests__/_role-shaper.test.ts` (42 PASS)
- **Query modules Phase 2**: `services/app/src/lib/data/*-queries.ts` (8 nuovi)
- **Brand widget nuovi Phase 3**: `services/app/src/components/widgets/brand/Brand{EmployeeDirectoryGrid,OkrCascadeTree,ReviewKanbanBoard,WorkforceTrendLine,CalibrationCard,BonusPlanCard}.tsx`
- **i18n widget strings**: `services/app/src/lib/i18n/widget-strings.ts`
- **Base adapter framework**: `services/app/src/lib/dashboard-engine/adapters/_base-adapter.ts`
- **Resolver hierarchy fix**: `services/app/src/lib/dashboard-engine/resolver.ts` (dedup by `(parent_element_id, position)`)
- **CSS hover pattern L18**: `services/app/src/styles/dashboard-brand.css` L3179+ (10 LOC append)

### Migrations DB applicate
- `db/seeds/phase19a_four_process_v2_reseed.sql` (4 process_*_v2 reseed, 44 elements)
- `db/seeds/phase19b_eight_new_presets_seed.sql` (8 nuovi preset, 40 elements)
- `db/seeds/phase19c_fix_histogram_activityfeed_shape.sql` (superseded by 19d)
- `db/seeds/phase19d_fix_adapter_shapes.sql` (17 UPDATE shape json_build_object)
- `db/seeds/phase19e_fix_hired_at_to_hire_date.sql` (3 UPDATE schema)
- `db/seeds/phase19f_fix_audit_actor_email.sql` (2 UPDATE schema)
- `db/seeds/phase19g_fix_rbac_table_name.sql` (2 UPDATE rbp_role_permissions)

### DECISIONS-LOG-v2 cycle 2 entries S63
- L8 Phase 0 charter + foundations
- L9 Phase 1 (4 process_*_v2 reseed)
- L10 Phase 2 (8 query modules)
- L11 Phase 3 (6 widget brand)
- L12 Phase 4 (8 nuovi preset)
- L13 S63 closure v1
- L14 Phase 5+6 i18n + route decision
- L15 Phase 7 minimal
- L16 7 hotfix browser-verified (R5 lesson learned)
- L17 research artifact pattern promosso a canonical
- L18 hover transition pattern applied
- L19 reform parziale CARD-5 (revert S61 over-correction, **THIS**)

### Memoria operativa
- **Plan execution mode S63**: autonomous fino @ 80% del context window 1M (~800k token), come da direttiva utente per la sessione lunga
- **Browser MCP**: claude-in-chrome MCP usato live per verification, session persistente HR_DIRECTOR. Lezione registrata in CARD-2 ("UI changes → testare in browser prima di claim done")
