# ADR-0025 — Brand identity cycle sealed (Phase 1→12) + v1.0 promotion plan

> **Status**: ACCEPTED · 2026-05-08
> **Supersedes**: nothing
> **Superseded by**: nothing
> **Related**: ADR-0024 (Phase 14.SH plan)

## Context

Il workstream brand identity Heuresys è iniziato 2026-05-04 (L1) come dominio segregato in `.ux-design/`. L'obiettivo era costruire la brand identity completa (foundations, voice, personas, aesthetic direction, palette, typography, logo, motion, dashboard mockup, theme variants, brand book) in modalità lab — fuori dal codice production — fino a una promozione esplicita a v1.0 disciplinata.

Tra 2026-05-04 e 2026-05-07, sono state portate a termine 12 phase canoniche (Phase 1 Setup → Phase 12 Brand Book), più Phase 13 (dashboard data-driven engine) e Phase 14 (V2 + AI + Tier 2 + 14.SH brand-driven shell). Phase 10 (altre surface) è stata assorbita ed eseguita interamente in Phase 14.SH (8 commit shipped + carry-forward 2026-05-07/08).

A 2026-05-07 23:00 (post-L37 commit `5ebdc45`), su richiesta esplicita di Enzo è stato eseguito un audit pre-promozione per verificare loose ends. L'audit ha rivelato 5 gap reali (più 3 minori rinviabili a v1.0 promotion). Tutti chiusi 2026-05-08 in commit `34f9ac8`.

## Decision

### 1. Brand identity cycle Phase 1→12 SEALED

Il ciclo di creazione brand identity Heuresys è ufficialmente **chiuso** a 2026-05-08T01:00Z. Le 12 phase sono tutte in stato ✅ Done con asset concreti committati e zero loose ends documentali.

Status finale per phase:

| Phase                             | Status | Riferimento decisionale | Asset principali                                                                                                     |
| --------------------------------- | ------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1 — Setup                         | ✅     | L1                      | Struttura `.ux-design/` + README                                                                                     |
| 2 — Brand foundations             | ✅     | L1-L4                   | foundations + voice + 4+4 personas + audience + dashboard architecture                                               |
| 3 — Aesthetic capture sito legacy | ✅     | L7                      | 8 screenshot www.heuresys.com + moodboard + heuresys-com-current-style                                               |
| 4 — Aesthetic direction           | ✅     | L19/L21                 | 32 direzioni esplorate · D1 = `mu-architect-legacy`                                                                  |
| 5 — Color palette                 | ✅     | L21                     | `palette-final.md` v2 OKLCH · `heuresys.DESIGN.md` 9 sezioni canoniche                                               |
| 6 — Typography pairing            | ✅     | L21                     | Stack Exo 2 + Inter + JetBrains Mono · `typography-final.md`                                                         |
| 7 — Logo derivati                 | ✅     | L21/L25/L27/L28         | 6 SVG canonical post-L25/L27/L28 + `logo-standard.md`                                                                |
| 8 — Motion language               | ✅     | L24                     | 5 prototipi + `motion-final.md` SoT + index hub                                                                      |
| 9 — Dashboard mockup              | ✅     | L22                     | 5 dashboard surface (HR Director · Capability Graph · Skills Heatmap · Employee Journey · Org & Systems) + index hub |
| 10 — Altre surface                | ✅     | L35                     | Login aurora promosso + AppShell role-based 8 ruoli + 17+ viste live data e2e + 2 mockup overview                    |
| 11 — Theme variants JSON          | ✅     | L36                     | 4 file in `05-theme-variants/`: tokens-dark · tokens-light · tokens-motion · README (W3C DTCG)                       |
| 12 — Brand book v0                | ✅     | L37                     | `07-brand-book/BRAND-BOOK-v0.md` 15 sezioni canoniche · single entry point unificato                                 |

Decisioni storiche bloccanti tutte risolte (D1/D2/D3/D4 — vedi `.ux-design/BRAND-STATE.md` § Decisioni risolte).

### 2. 5 pre-promotion gap chiusi (2026-05-08)

L'audit ha identificato 5 gap reali (più 3 minori rimandabili a v1.0 promotion). Tutti chiusi nello stesso commit di sigillo (`34f9ac8`):

| Gap | Deliverable                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #1  | D1-D4 pending in `BRAND-STATE.md` sostituite con tabella "Decisioni risolte (storico)"                                                                                             |
| #2  | `08-promotion/v1.0-checklist.md` scritto (referenziato 2 volte ma mancante)                                                                                                        |
| #3  | 4 personas mancanti create per coverage 1:1 con 8 ruoli RBP (`05-superuser` · `06-tenant-owner` · `07-hr-manager` · `08-dept-head`)                                                |
| #4  | `promotion-candidates.md` updated: login-aurora 🚀 Promoted (Phase 14.SH FASE 1) · 4 altri login ❌ Rejected archive · 2 mockup overview registrati come 🚀 Promoted carry-forward |
| #5  | Brand book v0 § 3 personas expanded da 4 a 8 con tabella coverage 1:1 RBP roles + cross-ref                                                                                        |

3 gap minori posposti (tracked in `v1.0-checklist.md`):

- favicon.ico multi-size + apple-touch-icon.png
- 4 surface utility (404 · empty · onboarding · settings)
- Brand book v1 visivo (typesetting curato, opzionale)

### 3. v1.0 promotion plan (incremental cadence)

La promozione tecnica degli asset brand identity da `.ux-design/` (lab) a `services/`/`packages/` (production) seguirà la checklist operativa `08-promotion/v1.0-checklist.md`. Cadence raccomandata: incremental (non bulk), 16-25h totali eseguibili in 2-3 sessioni autonomous.

Sequence raccomandata:

1. **Quick wins (1-2h)** — design tokens JSON copy in `packages/ui/design-tokens/` + logo SVG copy in `services/app/public/brand/` + favicon multi-size + apple-touch-icon + og-image
2. **next/font integration (1-2h)** — refactor `services/app/src/app/layout.tsx` con `next/font/google` per Exo 2 + Inter + JetBrains Mono · zero CLS + Lighthouse pass
3. **Motion library (2-3h)** — estrazione 5 pattern presets da `tokens-motion.json` come utility CSS/Framer Motion variants
4. **4 surface utility (4-6h)** — 4 mockup HTML in `.ux-design/06-mockups/{public,application}/` + 4 promotion via `/studio:bootstrap`
5. **Brand book v1 visivo (8-12h, opzionale)** — typesetting + cover art + asset embed alta risoluzione

Sign-off final v1.0 quando tutti i gate in `v1.0-checklist.md` § 6 sono ✅.

## Consequences

### Positive

- **Single entry point unificato** per chiunque debba capire il brand Heuresys: `.ux-design/07-brand-book/BRAND-BOOK-v0.md` con cross-reference a 15 SoT individuali
- **Zero loose ends**: nessun dangling reference, nessuna decisione pending obsoleta, nessuna inconsistenza interna documentata
- **8 personas = 1:1 coverage RBP roles**: ogni futura feature può assumere persona mapping completo (-1 SUPERUSER → 6 EMPLOYEE)
- **Promotion plan operativo**: `v1.0-checklist.md` fornisce gate rigoroso per la prossima fase senza ambiguità
- **Audit trail complet**: DECISIONS-LOG L1→L38 documenta ogni decisione storica con context + conseguenze + riferimenti

### Negative

- **`v1.0-checklist.md` è un nuovo deliverable da mantenere**: ogni promotion incrementale deve aggiornare lo status
- **Brand book v0 è textual**: la v1 visiva (typesetting curato + cover art) richiede un design tool e tempo (~8-12h opzionali)
- **4 surface utility (404 · empty · onboarding · settings) sono ancora ⏳**: la coverage UX completa non è raggiunta finché non vengono prodotti

### Neutral

- **Documenti `.ux-design/` segregati da production code**: nessun import diretto. Mirror controllato via `/studio:bootstrap` skill o copia asset statici. Mantiene la separazione lab vs prod che è progettata fin dal day-1 (L1 Scope B).

## Implementation

Eseguito in 3 commit consecutivi su `main`:

1. **`5ebdc45`** (2026-05-07) — `feat(ux-design): close brand identity cycle — Phase 10/11/12 done` (7 file, +1604/-37). L37.
2. **`34f9ac8`** (2026-05-08) — `feat(ux-design): close 5 pre-promotion gaps — brand identity cycle sealed` (9 file, +690/-41). L38.
3. **(questo ADR)** — `docs(adr): ADR-0025 brand identity cycle sealed + v1.0 promotion plan` + sync CLAUDE.md/STATE.md.

Verification:

- `git log --oneline | head -5` mostra catena commit recente
- `cat .ux-design/BRAND-STATE.md | head -10` mostra "L38 Pre-promotion audit · 5 gap reali chiusi · ciclo brand identity SEALED"
- `ls .ux-design/01-strategy/personas/` mostra 8 file (`01-hr-director.md` … `08-dept-head.md`)
- `cat .ux-design/08-promotion/v1.0-checklist.md | wc -l` mostra ~250+ righe operative

## References

- DECISIONS-LOG: `.ux-design/DECISIONS-LOG.md` L1→L38
- Brand state: `.ux-design/BRAND-STATE.md`
- Brand book v0: `.ux-design/07-brand-book/BRAND-BOOK-v0.md`
- v1.0 promotion checklist: `.ux-design/08-promotion/v1.0-checklist.md`
- 8 personas: `.ux-design/01-strategy/personas/`
- Theme variants JSON: `.ux-design/05-theme-variants/`
- ADR-0024 (Phase 14.SH plan): `docs/50-reference/decisions/0024-phase14sh-brand-driven-shell.md`
- ADR-0023 (DBMS bare-metal SoT): `docs/50-reference/decisions/0023-promote-baremetal-as-sot.md`
- Active theme runtime: `services/app/src/styles/active-theme.css`
- AppShell production: `services/app/src/app/(app)/_components/AppShellClient.tsx`
- Studio skill (workflow promotion): `.claude/skills/studio/SKILL.md`
