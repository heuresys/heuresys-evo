---
name: studio
description: Use when user wants to clone a Next.js production page into the brand identity sandbox, manipulate it safely, or promote a manipulated staging back to production with restorable backup. Triggers on phrases like "iteriamo sulla dashboard", "clona la pagina /<route>", "lavoriamo sulla pagina di login", "promote staging", "rollback design", "studio aperto su /<route>", or any request to modify a production route via the .ux-design/ workstream. NOT for token CSS changes (use /brand-studio URL page) or for asset brand changes (logo/palette/font — use /brand:* commands).
---

# studio — Workflow clone↔promote↔backup di route Next.js attraverso il dominio brand identity

Questa skill garantisce che ogni modifica a una pagina di produzione (`services/app/src/app/<route>/`) passi attraverso il dominio brand identity (`.ux-design/10-staging/`), con backup restorable obbligatorio prima di ogni promozione.

## Quando attivarla

Trigger esplicito (l'utente dice una di queste frasi o equivalenti):

- "iteriamo sulla pagina /\<route\>"
- "clona la pagina di \<nome\>"
- "lavoriamo sulla \<route\>"
- "vorrei rivedere il design della dashboard / login / showcase"
- "promote staging"
- "rollback design / restore pagina"
- "studio aperto su /\<route\>"
- "fammi vedere lo staging attivo"

Trigger implicito:

- L'utente apre/edita un file dentro `.ux-design/10-staging/`
- L'utente apre/edita un file dentro `.ux-design/.backups/`
- L'utente fa riferimento a "staging", "promote", "backup pagina", "drift produzione"
- L'utente vuole modificare una route Next.js senza specificare come

## Quando NON attivarla

| Caso                                                           | Owner corretto                                                                                                 |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Modifica token CSS (palette, typography scale, spacing)        | Pagina URL `/brand-studio` (`services/app/src/app/brand-studio/BrandStudioClient.tsx`) — NON la skill `studio` |
| Modifica asset brand (logo SVG, favicon, font)                 | Comandi `/brand:*` + cartella `.ux-design/03-visual-identity/`                                                 |
| Modifica componente isolato in `packages/ui/`                  | Storybook 9 + workflow manuale                                                                                 |
| Modifica DB/migration/business logic con tenant scope          | Workflow normale dev (P1-P10)                                                                                  |
| Cross-route refactor (es. `layout.tsx` root + 3 route insieme) | Out-of-scope day-1 (eventuale futuro `/studio:multi`)                                                          |
| Modifica `package.json`, `next.config.*`, config root          | Workflow normale dev                                                                                           |

**Disambiguazione critica**: la skill `studio` opera su filesystem (clone file source) ed è distinta dalla pagina URL `/brand-studio` (route runtime con wizard token CSS). I due non si sovrappongono mai.

## Cosa fa la skill

Espone 8 sotto-comandi via namespace slash command `/studio:*`:

| Comando                               | Cosa fa                                                                                          | Side-effect su FS                                | Side-effect su git    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------ | --------------------- |
| `/studio`                             | Entry interattivo: lista staging attivi + ultimi backup + menu next action                       | nessuno                                          | nessuno               |
| `/studio:clone <route>`               | Iterazione su pagina implementata: copia route produzione → staging                              | crea staging dir + copia file                    | nessuno               |
| `/studio:bootstrap <mockup> <route>`  | Prima promozione greenfield: scaffold + mockup HTML come reference + README workflow translation | crea staging dir + copia scaffold + copia mockup | nessuno               |
| `/studio:diff <route> [<TS>]`         | `git diff --no-index --stat` staging vs produzione + per-file diff                               | nessuno                                          | nessuno               |
| `/studio:promote <route> <TS>`        | Dry-run + 5 gate + backup pre-promote in `.ux-design/.backups/` + overwrite produzione + commit  | crea backup + overwrite produzione               | crea commit (NO push) |
| `/studio:restore <route> <backup-TS>` | Preview MANIFEST + conferma + restore da backup → produzione + commit di revert                  | overwrite produzione                             | crea commit (NO push) |
| `/studio:backup-list [<route>]`       | Tabella backup disponibili filtrata per route opzionale                                          | nessuno                                          | nessuno               |
| `/studio:status`                      | Tabella consolidata: route → staging count · ultimo backup · drift produzione                    | nessuno                                          | nessuno               |

**Quando usare `/studio:clone` vs `/studio:bootstrap`**:

- `clone` — la route è **già implementata** (page.tsx ricca, non scaffold). Iterazione visiva su asset finito.
- `bootstrap` — la route è **scaffold** (page.tsx minima) e c'è un mockup HTML in `.ux-design/06-mockups/...` da tradurre. Prima implementazione greenfield.

## Workflow happy path

```
USER: "iteriamo sulla dashboard"
  │
  ▼ skill studio auto-trigger via keyword
/studio:clone dashboard
  ├─ scripts/clone-route.sh (copia atomica)
  └─ Skill superpowers:brainstorming  [GATE A: motivazione + checklist]
  │
  ▼ USER itera in staging — può invocare:
  │  ├─ Skill frontend-design (pattern componenti)
  │  ├─ Skill frontend-design-pro:design (wizard color/typography/moodboard)
  │  └─ Skill figma:figma-implement-design (se origine Figma)
  │
/studio:diff dashboard <TS>
  └─ output diff stat + per-file
/brand:audit http://localhost:3000/dashboard       [GATE B: score ≥ 7, 0 P0]
/brand:anti-slop                                   [GATE C: fingerprint clean]
/studio:promote dashboard <TS>
  ├─ Skill superpowers:verification-before-completion [GATE D: 5/5]
  ├─ dry-run preview MANIFEST                          [GATE E: user confirm]
  └─ scripts/promote.sh (backup + overwrite + commit, NO push)
```

Dettaglio dei 5 gate (A-E) bloccanti: vedi [`references/promote-flow.md`](references/promote-flow.md).
Mappa completa skill orchestrate per fase: vedi [`references/orchestration-map.md`](references/orchestration-map.md).

## Convenzioni e edge case

Convenzione naming + path mapping + 8 edge case (route con slash, collision timestamp, drift detect, route group, ecc.): vedi [`references/route-mapping.md`](references/route-mapping.md).

Errori bloccanti vs warning per ogni sub-command: vedi [`references/error-catalog.md`](references/error-catalog.md).

## Cosa NON fare

| ❌ NON fare                                                                              | ✅ Fare invece                                                                                               |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Modificare direttamente file in `services/app/src/app/<route>/` senza passare da staging | Sempre `/studio:clone` prima, manipolazione in staging, poi `/studio:promote`                                |
| Skippare backup ("lo faccio dopo")                                                       | Backup è obbligatorio dentro `/studio:promote` — gate non bypassabile                                        |
| Bypassare gate B (audit) o gate C (anti-slop) con `--force`                              | I gate sono regole brand non negoziabili. Se serve override, modifica i mockup di riferimento, non il codice |
| Auto-push post-promote                                                                   | Push è SEMPRE opt-in esplicito, mai automatico                                                               |
| Toccare `services/app/public/brand/` o `packages/ui/`                                    | OUT-OF-SCOPE: usa `/brand:*` o workflow Storybook                                                            |
| Modificare `MANIFEST.json` di un backup esistente                                        | Backup è immutabile per design (audit trail)                                                                 |
| Promuovere staging vecchio senza ricontrollo drift                                       | scripts/promote.sh esegue check sha256 — drift → abort                                                       |

## Comando complementare

L'utente può anche digitare `/studio` per attivare lo stesso protocollo via slash command entry. Vedi [`.claude/commands/studio/studio.md`](../../commands/studio/studio.md).

## Auto-memory

Tier-3 fallback (keyword detection automatica): `~/.claude/projects/D--evo-heuresys-com/memory/feedback_studio_workstream.md`.

## Riferimenti

- Workflow brand identity (skill complementare): [`.claude/skills/brand-resume/SKILL.md`](../brand-resume/SKILL.md)
- Slash commands `/brand:*` (gate B + C in promote): `.claude/commands/brand/{audit,anti-slop}.md`
- Project CLAUDE.md: `CLAUDE.md` § Studio workstream (post Phase 5)
- Decisione registrata: `.ux-design/DECISIONS-LOG.md` § L26 (post Phase 5)
- Plan d'origine: `~/.claude/plans/voglio-creare-una-skill-magical-castle.md`
