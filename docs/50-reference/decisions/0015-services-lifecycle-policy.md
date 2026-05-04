# ADR-0015: Services lifecycle policy

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B9

## Context

Il monorepo `services/*` ha tendenza ad accumulare scaffold-only directory che non hanno mai ricevuto implementazione reale. Esempi al boot evo:

- `services/playground` — solo `package.json` + `README.md`, no codice
- `services/marketing` — solo skeleton Next.js bootstrap (page/layout/globals.css)
- `services/enrichment` — scaffold + README, implementazione deferred

Senza una policy esplicita, la directory `services/` cresce con noise che confonde nuovi developer e rallenta `npm install` (workspace resolution).

## Decision

**Stato esplicito + criterio quantitativo per archiving**:

1. **Stato dichiarato in README.md**: ogni `services/<name>/README.md` deve avere una sezione `**Status**` in alto con uno di:
   - `Active` — il service ha codice runtime e deploy target.
   - `Scaffold` — placeholder cosciente, implementazione pianificata (con riferimento a issue/roadmap).
   - `Archived` — fuori scope corrente, vedi `archive/services-<name>-<date>/`.

2. **Criterio quantitativo per archiving**:
   - `find services/<name>/src -type f | wc -l < 5` AND status non è `Active` → candidate for `archive/services-<name>-YYYY-MM-DD/`.
   - Lo spostamento richiede:
     - `git mv services/<name>/ archive/services-<name>-YYYY-MM-DD/`
     - Aggiunta `archive/services-<name>-YYYY-MM-DD/ARCHIVED.md` con motivazione + restore steps
     - Se necessario, rimozione esplicita da `package.json#workspaces` (non serve se l'archive è fuori da `services/*`)

3. **Restoring**: move-back semplice + `npm install`. L'archive resta in git history come reference.

4. **Eccezioni**: `services/api-gateway` e `services/app` sono Active per definizione del progetto (auth + dashboard core); non possono essere archived senza un nuovo ADR che cambi la baseline architettura.

## Application 2026-05-01 (B9 cleanup)

| Service                | Pre-B9             | Decisione | Path post                                 |
| ---------------------- | ------------------ | --------- | ----------------------------------------- |
| `services/api-gateway` | Active             | retain    | `services/api-gateway/`                   |
| `services/app`         | Active             | retain    | `services/app/`                           |
| `services/enrichment`  | Scaffold           | retain    | `services/enrichment/` (status updated)   |
| `services/marketing`   | Scaffold (3 files) | archive   | `archive/services-marketing-2026-05-01/`  |
| `services/playground`  | Scaffold (2 files) | archive   | `archive/services-playground-2026-05-01/` |

Workspaces glob `services/*` resta invariato (gli archive sono fuori da `services/`).

## Alternatives considered

- **Lascia tutto in `services/`**: rejected — clutter, npm install più lento, confusion per onboarding.
- **Cancella le dir scaffold**: rejected — perdita storia/intento. L'archive con timestamp preserva entrambi.
- **Branch separato per scaffold**: rejected — fa drift e non è discoverable.

## Consequences

Positive:

- `ls services/` mostra solo service Active o con scaffold real (con README chiaro).
- `npm install` non risolve workspace placeholder.
- ADR + ARCHIVED.md preservano contesto per restore futuro.

Negative:

- Restore richiede uno step manuale (move + npm install). Trascurabile.

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §14 Phase B9
