# DECISIONS-LOG-v2 — Cycle 2 (append-only)

> Append-only log decisioni cycle 2 post-S62 reset 2026-05-13. Cycle 1 (L1-L87) archiviato in `../.ux-design-archive-2026-05-13/DECISIONS-LOG.md`, NON ereditato automaticamente.
> Migration scorecard: `04-promotion/decision-migration-audit.md`.
> Format entry: `## L-NN (YYYY-MM-DD) — <titolo>` + body.

---

## L1 (2026-05-13) — Brand & design system reset cycle 2

**Decisione**: avviato cycle 2 del workstream brand identity & design system di heuresys-evo. Cycle 1 (S22→S61, 87 decisioni L1-L87, 1027 file) archiviato come immutabile in `../.ux-design-archive-2026-05-13/`. Production CSS layer consolidato in 1 SoT canonical `services/app/src/styles/tokens.css`. Promotion process v2 (`/studio2:*`) sostituisce v1 (`/studio:*` frozen DEPRECATED).

**Razionale**: stratificazione 10 giorni operativi senza pruning ha generato 4 SoT parallele non sincronizzate (mockup HTML ↔ catalog DB ↔ tokens JSON ↔ CSS attivo) e 57 variabili CSS duplicate. Sistema risultava "fermo" ma con artefatti residui che mascheravano la realtà operativa.

**Charter**: ADR-0032 `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`.

**Plan**: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`.

**Safety**: git tag `pre-reset-s62` + branch `backup/pre-reset-s62` per rollback completo se necessario.

**Phase corrente cycle 2**: 1 (assessment iniziale, nessuna canonical decision ancora firmata).

---

## L2 (2026-05-13) — Logo wordmark "heuresys" — regole permanenti (consolidamento MIGRATE)

**Decisione**: 8 lettere identiche "h-e-u-r-e-s-y-s" tutte lowercase (`h` minuscola obbligatoria). Font Exo 2 weight 700. La lettera "y" usa colore accent `var(--accent)`. Body lettera usa `var(--brand-blue)` ("logo originale") o `var(--logo-body, var(--ink))` ("logo relativo" per surface tematizzate). NON italic mai (regola visiva specifica per sans-serif). Embed obbligatorio in tutte le ricorrenze "heuresys" header/footer/modal. **Eccezione plain text**: indirizzi · link · domini possono usare "heuresys" testuale lowercase senza wrapping.

**Componente**: `packages/ui/src/components/wordmark.tsx` (cycle 1, invariato post-reset). 3 varianti: `default` (var(--ink)), `brand` (var(--brand-blue)), `relative` (var(--logo-body, --ink)).

**Migrata da archive**: L16 (y-accent standard) + L18 (no italic per sans-serif) + L25 (regole permanenti) + L27 (logo originale 2 colori) + L28 (logo relativo convenzione `.wordmark-relative`).

## L3 (2026-05-13) — Baseline palette μ-architect-legacy preservata in `tokens.css`

**Decisione**: la palette `μ-architect-legacy` (Set 5 cycle 1, L19 archive) viene preservata come baseline canonical cycle 2 in `services/app/src/styles/tokens.css` (consolidato Phase 5 S62). Caratteristiche: dark navy primary + brand blue + purple accent + gradient blue→purple. È la palette currently live in produzione e non viene cambiata dal reset.

**NON migrate**: le altre 16 palette runtime switchable cycle 1 (α-θ + ι-λ + μ-architect / art-director / pragmatic / synthesis / data-dense). Eliminata `palette-variants.css`. Reintroduzione palette switching futura sarà decisione esplicita firmata in `01-canonical/`.

**Migrata da archive**: L19 (μ-architect-legacy applicata) + parziale L20 (Set 5 baseline overlay).

## L4 (2026-05-13) — Motion language preserved in `motion.css`

**Decisione**: il motion language cycle 1 (`services/app/src/styles/motion.css`, 127 LOC) viene preservato invariato. Include 4 ease curves + 6 duration tokens + 7 utility classes. Allineato ai 5 prototipi animati archive `04-motion-language/` (wordmark-glow, gradient-transitions, kg-topology-hover, sparkline-animate, scroll-reveals) consultabili come reference.

**Migrata da archive**: L24 (Phase 8 motion language complete + motion-final.md SoT).

## L5 (2026-05-13) — Tokens format canonical W3C DTCG

**Decisione**: il formato canonical per design tokens cycle 2 è **W3C DTCG (Design Token Community Group)** specification. File SoT: `.ux-design/02-tokens/tokens.json` (popolato Phase 5 S62 con baseline μ-architect-legacy). Il file `services/app/src/styles/tokens.css` (production) è la materializzazione CSS dei tokens DTCG.

**Sync rule**: token cambia in `tokens.json` → re-genera (manualmente o via build script futuro) `tokens.css`. Per ora la sync è manuale (sprint future può aggiungere build step).

**Migrata da archive**: L36 (Phase 11 — Theme variants JSON W3C DTCG format) — formato preservato, il contenuto specifico (tokens-dark.json + tokens-light.json + tokens-motion.json) archived.

---

## L6 (2026-05-14) — Mock UX personas cycle 1 purged (DDL/seed cleanup)

**Decisione**: completata pulizia mock UX persona labels da cycle 1 (`Maria CHRO`, `Maria Bianchi`, `Davide IT`, `Andrea EMP`, `Stefania LM`, `Marco Rossi`) da 5 file LIVE + 13 file archive + 7 row dashboard*presets DBMS legacy. Allineamento al pattern canonical `Audience: <ROLE>` già applicato in `phase18g` per i preset `_v2` e `process*\*`.

**Commit DDL**: `24bb5c4`.

**Migration files touched** (header comment / seed string only, no schema change):

- `db/migrations/phase18g_audience_persona_label.sql` — header comment storico riformulato (rimossi nomi mock dall'esempio storico)
- `db/seeds/phase13_dashboard_presets.sql` — 5 `persona_label` literal sostituiti con `Audience: <ROLE>` pattern

**DBMS UPDATE applicato direttamente** (no formal migration file): idempotent UPDATE su 7 row `dashboard_presets` legacy non-`_v2` (cross_tenant_overview · tenant_owner_overview · employee_journey · hr_director_overview · capability_graph · skills_heatmap · org_systems). Re-seed via `phase13` sopravvive perché `ON CONFLICT (code) DO UPDATE` aggiorna `persona_label` con nuovo valore canonical.

**Verification**: 0 mock residue cross-filesystem + cross-DBMS (dashboard_presets · dashboard_elements · audit_logs · recruiting_candidates).

**Cross-check coerenza DBMS**: users (265) ↔ employees (264) ↔ tenants (4) ↔ rbp_roles (8) 100% coerente. Username pattern `<first>.<last>@<tenant.domain>` (post L50 archive strip-space-apostrophe lowercase): 100% match per 264 employee-linked users + 1 SUPERUSER `sysadmin` platform.

**Memoria globale**: nuovo file `~/.claude/projects/D--evo-heuresys-com/memory/feedback_canonical_user_format.md` codifica regola format username + password unica (`Heuresys2026!`) come SoT `tests/.test-env`. Bias da disinnescare: MAI inventare format `<role>.<tenant>@` o password alternative.

**Trigger**: utente Enzo ha richiesto purga totale "Maria CHRO definitivamente dal progetto, dalla memoria, da qualunque oggetto" + check correttezza users/employees/altri riferimenti attivi.

---

## L7 (2026-05-14) — phase18u RLS null-safe rewrite (315 policies hotfix)

**Decisione**: applicata migration `phase18u_rls_null_safe_policies` che riscrive **289 policies RLS** da cast unsafe `(current_setting('app.current_tenant_id'::text[, true]))::uuid` a function call `current_tenant_id()` null-safe.

**Causa del bug** (latente da S60 commit `0985a1a` 2026-05-13):

- S60 hardening rese `heuresys` Postgres role `NOBYPASSRLS` (revocando BYPASSRLS).
- Prima di S60, le 291 policies RLS unsafe NON venivano valutate (BYPASSRLS).
- Dopo S60, ogni query Prisma le valuta. Il pattern unsafe fa cast diretto `::uuid` su `current_setting(name, true)`:
  - GUC mai toccata in session → ritorna NULL → cast NULL::uuid → NULL → policy FALSE silently (no error, ma 0 rows)
  - GUC toccata poi RESET, o residuo connection pool empty → ritorna `""` → cast `''::uuid` → **ERROR 22P02 "invalid input syntax for type uuid"**

**Trigger riproduzione**: HR_DIRECTOR (Valentina Conti, RTL Bank) navigando `/dashboard` in dev locale Windows post-S62. Il dev Next.js dev pool ricicla connection con GUC residua dopo precedenti query SUPERUSER. Prima volta osservata 2026-05-14 01:55 GMT+2 nella sessione S62 di pulizia mock UX personas. In prod l'errore era latente: nessuno aveva navigato come HR_DIRECTOR end-to-end con un fresh connection pool entry.

**Migration applicata**:

- Backup pre-migration: `/var/backups/heuresys-evo/heuresys_platform-pre-phase18u-20260514T001959Z.dump` (409 MB)
- File: `db/migrations/phase18u_rls_null_safe_policies.sql`
- Risultato: 289 policies riscritte · 0 residue unsafe (verification post-migration PASS)
- Pattern preservato per policies con NULLIF wrapping (già null-safe, ~26 policies in `enrichment_*`, ecc.)

**Verifica end-to-end post-fix**: `/dashboard` HR_DIRECTOR carica regolarmente (Talent & capability view, 4 KPI ring, RBAC matrix, succession spotlight). Codice `services/app/src/app/(app)/dashboard/page.tsx` invariato (zero patch app-side richiesto). Fix è puramente DBMS-side dove appartiene.

**Reference**:

- DDL commit: `<TBD post-commit>`
- Backup chain: `/var/backups/heuresys-evo/heuresys_platform-pre-phase18u-20260514T001959Z.dump`
- S60 hardening reference: archive `DECISIONS-LOG.md` L87 + commit `0985a1a`
- `current_tenant_id()` function definition: `db/migrations/*` (pre-S35, stable null-safe via `NULLIF(...) ::UUID + EXCEPTION WHEN OTHERS → NULL`)

---

<!-- Entry successive L8-LN: append qui. Decisioni MIGRATE da cycle 1 archive devono citare predecessore archive L-XX in body. -->
