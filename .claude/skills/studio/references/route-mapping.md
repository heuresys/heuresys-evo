# Route mapping — convenzione e edge case

Documenta come la skill `studio` mappa una route Next.js (URL) in cartelle di staging e backup, e come gestisce gli scenari particolari.

## Convenzione base

| Concetto        | Formato                                         | Esempio                                                      |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| Route name      | path Next.js senza prefisso `/`                 | `dashboard`, `login`, `admin/users`                          |
| Timestamp (TS)  | `YYYY-MM-DD-HHMM` (locale OS)                   | `2026-05-05-2030`                                            |
| Path produzione | `services/app/src/app/<route>/`                 | `services/app/src/app/dashboard/`                            |
| Path staging    | `.ux-design/10-staging/<route>/<TS>/`           | `.ux-design/10-staging/dashboard/2026-05-05-2030/`           |
| Path backup     | `.ux-design/.backups/<route>/<TS>-pre-promote/` | `.ux-design/.backups/dashboard/2026-05-05-2030-pre-promote/` |

## File inclusi nel clone

Quando `/studio:clone <route>` copia una route, include:

- `page.tsx` (sempre obbligatorio, se mancante → errore route inesistente)
- `_components/**` (cartella privata co-located, se esiste)
- `loading.tsx`, `error.tsx`, `not-found.tsx`, `layout.tsx` (se co-located in `<route>/`)
- `actions.ts`, `route.ts` (se co-located: server actions, route handlers)
- Qualsiasi altro file `.ts`/`.tsx`/`.css`/`.module.css` direttamente in `<route>/`
- Hook lato client privati alla pagina (es. `_components/use-xxx.ts`)

**File NON inclusi**:

- Asset condivisi in `services/app/src/lib/`
- Componenti riutilizzabili in `packages/ui/`
- Asset pubblici in `services/app/public/`
- File in cartelle parent `<route>/../` (es. `services/app/src/app/layout.tsx` root)

## Edge case (F1-F8)

### F1 — Route con slash multipli (nested)

Esempio: route `/admin/users` con file in `services/app/src/app/admin/users/page.tsx`.

| Aspetto          | Comportamento                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Path staging     | `.ux-design/10-staging/admin/users/<TS>/` (mantiene gerarchia)                             |
| Path backup      | `.ux-design/.backups/admin/users/<TS>-pre-promote/`                                        |
| MANIFEST `route` | `"admin/users"` (slash conservato)                                                         |
| Niente flatten   | Mai trasformare `admin/users` → `admin-users` (creerebbe ambiguità con route flat omonime) |

### F2 — Doppio clone nello stesso minuto

Scenario: `/studio:clone dashboard` eseguito 2 volte alle 20:30 dello stesso giorno.

| Tentativo           | TS risolto          |
| ------------------- | ------------------- |
| Primo               | `2026-05-05-2030`   |
| Secondo (collision) | `2026-05-05-2030-2` |
| Terzo (collision)   | `2026-05-05-2030-3` |

Lo script `clone-route.sh` controlla esistenza dir prima di scrivere e applica suffix. Mai overwrite di staging esistente.

### F3 — Drift produzione fra clone e promote

Scenario: utente fa `/studio:clone dashboard` alle 20:30, modifica file produzione manualmente alle 20:45, poi tenta `/studio:promote` alle 21:00.

| Fase       | Check                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Al clone   | `clone-route.sh` registra `sha256` di ogni file produzione in `staging/<TS>/.source-hashes.json`                              |
| Al promote | `promote.sh` ricalcola `sha256` produzione e confronta con `.source-hashes.json`                                              |
| Mismatch   | Promote ABORT con messaggio "drift rilevato: X file modificati dopo il clone — fai nuovo clone o conferma override esplicito" |

L'utente può forzare l'override con flag esplicito `--accept-drift` (caso raro, sconsigliato).

### F4 — Asset condivisi `services/app/public/brand/`

Scenario: durante manipolazione staging, l'utente tocca un SVG in `public/brand/`.

| Comportamento        | Azione                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| OUT-OF-SCOPE day-1   | Skill non clona/manipola/promuove asset in `public/`                                             |
| Workflow alternativo | Usare `/brand:extract` o modifica diretta in `.ux-design/03-visual-identity/` poi commit manuale |
| Segnala in promote   | `promote.sh` ignora qualsiasi modifica al di fuori di `services/app/src/app/<route>/`            |

### F5 — Server actions / route handlers / hook privati

Scenario: `<route>/` contiene `actions.ts` (server action) e `_components/use-data.ts` (custom hook).

| File path                                                       | Incluso?                      |
| --------------------------------------------------------------- | ----------------------------- |
| `services/app/src/app/dashboard/actions.ts`                     | SÌ (co-located al route)      |
| `services/app/src/app/dashboard/_components/use-data.ts`        | SÌ (sotto route)              |
| `services/app/src/app/dashboard/route.ts`                       | SÌ (route handler)            |
| `services/app/src/lib/auth.ts` (importato da actions.ts)        | NO (path shared, fuori route) |
| `packages/ui/src/components/Button.tsx` (importato da page.tsx) | NO (package esterno)          |

Se la modifica della pagina richiede aggiornare un file shared, è OUT-OF-SCOPE: workflow normale dev. La skill segnala dependency esterne in `staging/<TS>/README.md`.

### F6 — Co-located `loading.tsx` / `error.tsx` / `layout.tsx`

| File                                     | Incluso nel clone?                              |
| ---------------------------------------- | ----------------------------------------------- |
| `<route>/loading.tsx`                    | SÌ                                              |
| `<route>/error.tsx`                      | SÌ                                              |
| `<route>/not-found.tsx`                  | SÌ                                              |
| `<route>/layout.tsx`                     | SÌ (segmento layout, non root layout)           |
| `services/app/src/app/layout.tsx` (root) | NO (root layout = config globale, OUT-OF-SCOPE) |

### F7 — Route group `(group)/<route>`

Esempio: route `/dashboard` definita in `services/app/src/app/(authenticated)/dashboard/page.tsx`.

| Aspetto                                                                           | Comportamento                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `<route>` accetta forma `(authenticated)/dashboard` o `dashboard` (con discovery) | clone-route.sh prova entrambe le risoluzioni                                   |
| Path staging                                                                      | `.ux-design/10-staging/(authenticated)/dashboard/<TS>/` (parentesi conservate) |
| MANIFEST `route`                                                                  | `"(authenticated)/dashboard"`                                                  |
| URL effettivo                                                                     | sempre `/dashboard` (route group nascosto in URL — convention Next.js)         |

### F8 — Conflitto naming con pagina URL `/brand-studio`

| Aspetto                                                               | Pagina URL `/brand-studio`               | Skill `studio` + `/studio:*`                                                      |
| --------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| Cosa è                                                                | Route Next.js runtime (wizard token CSS) | Skill filesystem (clone/promote pagine)                                           |
| Path file                                                             | `services/app/src/app/brand-studio/`     | `.claude/skills/studio/`                                                          |
| Naming command                                                        | nessun `/brand-studio:*` esiste          | `/studio:*` (6 sub-command)                                                       |
| Sovrapposizione                                                       | Zero                                     | Zero                                                                              |
| Cliente cli può clonare la pagina `/brand-studio` come route Next.js? | n/a                                      | SÌ — `/studio:clone brand-studio` è valido (clona la pagina come qualsiasi altra) |

La pagina `/brand-studio` resta una route Next.js come le altre, e può essere oggetto di clone con la skill `studio`.

## Risoluzione route ambigua

Se l'utente dice "clone dashboard" e esistono entrambi:

- `services/app/src/app/dashboard/page.tsx`
- `services/app/src/app/(authenticated)/dashboard/page.tsx`

Lo script `clone-route.sh`:

1. Cerca prima la forma esatta (`dashboard`)
2. Poi cerca con route group (`*/dashboard`)
3. Se trova multipli match → segnala ambiguità all'utente, NON sceglie

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Errori catalog: [`error-catalog.md`](error-catalog.md)
- Promote flow gate: [`promote-flow.md`](promote-flow.md)
