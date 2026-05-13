---
name: studio2
description: Use for route modifications cycle 2 post-S62 reset (2026-05-13). Disciplined clone → propose → promote → rollback workflow for Next.js routes, with mandatory canonical derivation check (Gate 1) + live data check (Gate 2) + user confirm (Gate 3). 3-gate flow, semplificato vs cycle 1 /studio:* (9 sub-comandi, 6+2 gate). NOT for token CSS changes (use /brand-studio URL page), asset brand changes (use /brand:* commands), or packages/ui isolated components.
---

# studio2 — Cycle 2 promotion skill

> **Cycle 2 protocol post-S62 reset 2026-05-13** — ADR-0032 charter.
> Sostituisce `/studio:*` cycle 1 (frozen DEPRECATED). Vedi `.claude/skills/studio/SKILL.md` per il legacy.

## Quando attivarlo

Trigger esplicito (italiano o inglese):

- "iteriamo sulla pagina /\<route\>" + cycle 2 context
- "lavoriamo sulla dashboard"
- "promote staging"
- "rollback design"
- "studio2"
- Slash command `/studio2`, `/studio2:propose`, `/studio2:promote`, `/studio2:rollback`

## Cosa è cambiato vs cycle 1 (`/studio:*`)

| Aspetto                            | Cycle 1 `/studio:*`                                                                                                                      | Cycle 2 `/studio2:*`                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Sub-comandi                        | 9 (`studio` `clone` `bootstrap` `diff` `promote` `restore` `backup-list` `status` `doctor`)                                              | 4 (`studio2` `propose` `promote` `rollback`)                   |
| Gate flow                          | 6 (A motivazione · B brand audit · C anti-slop · D verification · D.2 NO-FIXTURE · E user confirm) + 2 fail-safe (F git clean · G husky) | 3 (1 canonical derivation · 2 live data · 3 user confirm)      |
| Dependency esterne                 | `/brand:anti-slop` (vago, mai documentato)                                                                                               | Nessuna — tutto inline                                         |
| Staging path                       | `.ux-design/10-staging/<route>/<TS>/`                                                                                                    | `.ux-design/03-mockups/<route>/staging-<TS>/`                  |
| Reference brand SoT                | `.ux-design/06-mockups/` + `08-promotion/v1.0-checklist.md` (frozen cycle 1)                                                             | `.ux-design/01-canonical/` (cycle 2 SoT vincolanti)            |
| Backup before overwrite            | `.ux-design/.backups/<route>/<TS>/` + MANIFEST.json                                                                                      | Stesso pattern (preservato)                                    |
| Audit decisionale per ogni promote | No                                                                                                                                       | Sì — ogni promote DEVE citare L-NN canonical decision derivata |

## Sub-comandi

### `/studio2` — Entry interattivo

Mostra stato cycle 2: canonical SoT attivi (count file in `01-canonical/`), staging pipeline (count subdirectories in `03-mockups/`), ultimi 3 promote (da `.backups/`).

### `/studio2:propose <route>` — Submission proposta

Crea staging directory `.ux-design/03-mockups/<route>/staging-<TS>/`:

- Clone produzione `services/app/src/app/<route>/` come baseline
- Genera `STAGING-README.md` template con sezione "Acceptance criteria" da compilare
- Genera `CANONICAL-REF.md` con campo `derived-from: L-NN` (obbligatorio, vuoto = blocker promote)

L'utente itera nel staging fino a soddisfazione, poi invoca `/studio2:promote`.

### `/studio2:promote <route> <staging-id>` — 3-gate promozione

**Gate 1 — Canonical derivation**:

- Verifica `CANONICAL-REF.md` ha `derived-from: L-NN` non vuoto
- Verifica L-NN esiste in `.ux-design/DECISIONS-LOG-v2.md`
- Verifica L-NN corrisponde a entry in `01-canonical/` (se canonical) o è auto-evidente (es. logo wordmark da L2)
- BLOCKER: gate 1 fail → no promote

**Gate 2 — Live data only (eredita Gate D.2 cycle 1)**:

- Grep pattern in `<staging>/page.tsx` + sub-components:
  - `(value|count|rating|n)=\{[0-9]+` (hardcoded valori numerici inline)
  - `const [A-Z_]+ = \[\{.{200,}` (large literal arrays)
  - `MOCK_|DEMO_|FIXTURE_` (prefix vietati)
  - Fallback senza `<DataNotAvailable />`
- BLOCKER: gate 2 fail → no promote (P11 enforcement)

**Gate 3 — User confirm**:

- Mostra summary diff (file changed, LOC delta, gate 1 + gate 2 PASS)
- Aspetta conferma utente esplicita "yes" / "procedi" / "promuovi"
- BLOCKER: utente NO o ambiguo → no promote

**Post-promote**:

- Backup automatico `<route>` produzione → `.ux-design/.backups/<route>/<TS>/` + entry MANIFEST.json
- Overwrite `services/app/src/app/<route>/`
- Commit con message `feat(<route>): promote staging <TS> [cycle 2 ADR-0032]` + body con gate audit
- NO push automatico (utente decide quando)

### `/studio2:rollback <route>` — Restore istantaneo

- Lista backup disponibili da `.ux-design/.backups/<route>/`
- Utente sceglie TS
- Restore atomico: copia backup files → produzione, NO history rewrite
- Commit nuovo: `revert(<route>): rollback to backup <TS> [cycle 2]`

## Cosa NON fa

- ❌ Modifiche al filesystem dell'archive `.ux-design-archive-2026-05-13/`
- ❌ Token CSS changes (usa `/brand-studio` URL page o edit diretto `tokens-foundation.css`)
- ❌ Asset brand changes (usa skill `/brand:*` namespace)
- ❌ Componenti `packages/ui/` isolati (refactor packages/ui = altro workstream)
- ❌ Cross-route refactor (1 route alla volta)
- ❌ DB schema migration (out-of-scope brand)

## Disambiguazione

- `studio2` (skill filesystem) ≠ `/brand-studio` (route runtime token editor wizard, SUPERUSER only)
- `studio2` ≠ `brand-resume` skill (brand-resume = leggere SoT cycle 2 e ricaricare contesto, studio2 = modificare route)
- `studio2` ≠ `/brand:*` namespace (asset audit/extract/family-picker etc.)

## Riferimenti

- ADR-0032 charter reset: `docs/50-reference/decisions/0032-brand-design-reset-cycle-2.md`
- Cycle 2 SoT: `.ux-design/BRAND-STATE.md` · `.ux-design/DECISIONS-LOG-v2.md` · `.ux-design/01-canonical/`
- Cycle 1 frozen skill: `.claude/skills/studio/SKILL.md` (DEPRECATED)
- Cycle 1 archive: `.ux-design-archive-2026-05-13/_ARCHIVED-IMMUTABLE.md`
- Plan canonical S62: `~/.claude/plans/c-stata-una-continua-indexed-cocke.md`
