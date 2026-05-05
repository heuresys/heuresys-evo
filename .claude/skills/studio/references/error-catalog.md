# Error catalog — bloccanti, warning, fatali

Inventario degli errori prodotti dai 7 sub-command `/studio:*`. Tre categorie:

- **Bloccanti** — il sub-command si interrompe senza side-effect (skill restituisce errore, niente file modificato, niente commit)
- **Warning** — il sub-command segnala ma procede (stato sub-ottimale ma azione completata)
- **Fatali** — system-level (filesystem, git, permessi): skill si interrompe e segnala all'utente di intervenire manualmente

## `/studio` (entry)

Nessun errore bloccante (entry è sempre disponibile).

| Codice        | Tipo    | Causa                                    | Azione utente                 |
| ------------- | ------- | ---------------------------------------- | ----------------------------- |
| `STUDIO_E001` | warning | repo dirty (uncommitted changes ovunque) | Procedi ma cautela su clone   |
| `STUDIO_E002` | warning | `.ux-design/10-staging/` non esiste      | Verrà creata al primo clone   |
| `STUDIO_E003` | warning | `.ux-design/.backups/` non esiste        | Verrà creata al primo promote |

## `/studio:clone <route>`

| Codice       | Tipo      | Causa                                                                   | Azione utente                                      |
| ------------ | --------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| `CLONE_E101` | bloccante | `<route>` argomento mancante                                            | Specifica route                                    |
| `CLONE_E102` | bloccante | route inesistente: `services/app/src/app/<route>/page.tsx` non trovato  | Verifica nome route con `ls services/app/src/app/` |
| `CLONE_E103` | bloccante | route ambigua (multiple match con/senza route group)                    | Usa forma esplicita `(group)/<route>`              |
| `CLONE_E104` | bloccante | TS collision irrisolvibile (>10 suffix consecutivi nello stesso minuto) | Aspetta 1 minuto                                   |
| `CLONE_E105` | bloccante | permessi FS insufficienti su `.ux-design/10-staging/`                   | Verifica permessi                                  |
| `CLONE_E106` | warning   | `_components/` non esiste                                               | Procedi (route può non avere componenti privati)   |
| `CLONE_E107` | warning   | file >10MB nella route                                                  | Procedi ma segnala dimensione (asset binari?)      |
| `CLONE_E108` | warning   | esiste già staging recente (\<24h) per stessa route                     | Conferma se procedi o riusi quello esistente       |

## `/studio:diff <route> [<TS>]`

| Codice      | Tipo      | Causa                                                                 | Azione utente                             |
| ----------- | --------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `DIFF_E201` | bloccante | `<route>` argomento mancante                                          | Specifica route                           |
| `DIFF_E202` | bloccante | staging inesistente: `.ux-design/10-staging/<route>/` vuoto o assente | Esegui `/studio:clone <route>` prima      |
| `DIFF_E203` | bloccante | TS specificato non trovato                                            | Usa `/studio:status` per vedere TS validi |
| `DIFF_E204` | warning   | TS ambiguo (multipli match parziali)                                  | Usa TS completo `YYYY-MM-DD-HHMM`         |
| `DIFF_E205` | warning   | diff vuoto (staging identico a produzione)                            | Niente da segnalare, ma utente sappia     |

## `/studio:promote <route> <TS>`

| Codice         | Tipo      | Causa                                                              | Azione utente                                                |
| -------------- | --------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `PROMOTE_E301` | bloccante | argomenti `<route>` o `<TS>` mancanti                              | Specifica entrambi (TS NON ha default per safety)            |
| `PROMOTE_E302` | bloccante | repo dirty su path target `services/app/src/app/<route>/`          | `git stash` o commit modifiche pendenti prima                |
| `PROMOTE_E303` | bloccante | drift detect (F3): file produzione modificati dopo clone           | Esegui nuovo clone, oppure flag esplicito `--accept-drift`   |
| `PROMOTE_E304` | bloccante | gate B fail: `/brand:audit` ha P0 > 0                              | Risolvi P0 in staging, ricicla                               |
| `PROMOTE_E305` | bloccante | gate C fail: `/brand:anti-slop` ha FAIL critico                    | Risolvi anti-pattern in staging, ricicla                     |
| `PROMOTE_E306` | bloccante | gate D fail: verification self-integrity \< 5/5                    | Completa check mancanti                                      |
| `PROMOTE_E307` | bloccante | gate E: utente NON ha confermato dry-run                           | Rilancia con conferma esplicita                              |
| `PROMOTE_E308` | bloccante | husky pre-commit fail (lint-staged/gitleaks)                       | Risolvi violazioni, ricicla. MAI `--no-verify`               |
| `PROMOTE_E309` | bloccante | git commit fail (es. commitlint subject \>70 char)                 | Skill genera commit message conforme — se fail è bug interno |
| `PROMOTE_E310` | warning   | mancanza output `/brand:audit` (gate B saltato esplicitamente)     | Segnala "audit non eseguito" in MANIFEST.json                |
| `PROMOTE_E311` | warning   | dependency esterna a `packages/ui/` o `lib/` modificata in staging | Segnala dependency drift in MANIFEST + chiedi conferma       |
| `PROMOTE_E312` | fatale    | filesystem error durante backup creation                           | Backup non creato → ABORT senza overwrite produzione         |

## `/studio:restore <route> <backup-TS>`

| Codice         | Tipo      | Causa                                                                       | Azione utente                                    |
| -------------- | --------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| `RESTORE_E401` | bloccante | argomenti mancanti                                                          | Specifica route + backup-TS                      |
| `RESTORE_E402` | bloccante | backup inesistente: `.ux-design/.backups/<route>/<backup-TS>/` non trovato  | `/studio:backup-list <route>` per TS validi      |
| `RESTORE_E403` | bloccante | MANIFEST.json mancante o corrotto (JSON parse fail)                         | Backup compromesso, restore non sicuro           |
| `RESTORE_E404` | bloccante | MANIFEST.json schema invalid (campi obbligatori mancanti)                   | Backup compromesso                               |
| `RESTORE_E405` | bloccante | repo dirty su path target                                                   | `git stash` o commit prima                       |
| `RESTORE_E406` | bloccante | utente NON ha confermato preview                                            | Rilancia con conferma                            |
| `RESTORE_E407` | warning   | drift produzione vs MANIFEST `files[].sha256` (file modificati dopo backup) | Segnala drift, chiedi conferma esplicita restore |

## `/studio:backup-list [<route>]`

| Codice        | Tipo    | Causa                                                     | Azione utente                             |
| ------------- | ------- | --------------------------------------------------------- | ----------------------------------------- |
| `BACKUP_E501` | warning | `.ux-design/.backups/` non esiste                         | Genera tabella vuota                      |
| `BACKUP_E502` | warning | nessun backup per route specificata                       | Tabella vuota filtrata                    |
| `BACKUP_E503` | warning | un MANIFEST.json corrotto (parse fail) in cartella backup | Salta quel backup, mostra altri + warning |

## `/studio:status`

| Codice        | Tipo    | Causa                                           | Azione utente                           |
| ------------- | ------- | ----------------------------------------------- | --------------------------------------- |
| `STATUS_E601` | warning | nessun staging attivo + nessun backup           | Tabella vuota                           |
| `STATUS_E602` | warning | timestamp staging \> 7 giorni (staging stale)   | Segnala in tabella + suggerisci cleanup |
| `STATUS_E603` | warning | drift produzione vs ultimo backup per una route | Segnala in tabella                      |

## Errori fatali system-level (tutti i sub-command)

| Codice     | Causa                                                                                 | Azione                                       |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------- |
| `SYS_E901` | filesystem read-only                                                                  | ABORT, segnala all'utente                    |
| `SYS_E902` | git non disponibile o repo non inizializzato                                          | ABORT                                        |
| `SYS_E903` | path `.ux-design/` o `services/app/src/app/` non esistono (project structure violata) | ABORT, possibile working directory sbagliata |
| `SYS_E904` | bash POSIX non disponibile (Windows senza Git Bash)                                   | ABORT, suggerisci Git Bash o WSL             |

## Convenzione di reporting

Tutti gli errori bloccanti devono restituire:

- Codice `<DOMAIN>_E<NUM>`
- Messaggio chiaro in italiano (max 1 frase)
- Suggerimento di azione utente (max 1 frase)
- Exit code non zero per script bash (`exit 1` o specifico)

I warning vanno stampati ma il sub-command continua con exit code 0.

## Riferimenti

- Skill principale: [`../SKILL.md`](../SKILL.md)
- Route mapping: [`route-mapping.md`](route-mapping.md)
- Promote flow gate: [`promote-flow.md`](promote-flow.md)
