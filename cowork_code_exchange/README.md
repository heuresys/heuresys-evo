# cowork_code_exchange

Workspace per handoff strutturato tra Cowork (supervisore) e Claude Code CLI (esecutore).

Coerente con regola operativa #13 di Enzo: questo è il canale di scambio per task di sviluppo orchestrati da Cowork.

## Protocollo (5 fasi)

| Fase | File | Owner | Scopo |
|---|---|---|---|
| 1 | `_01_PROMPT_<task>.md` | Cowork | Briefing task, contesto, obiettivi, vincoli |
| 2 | `_02_PLAN_<task>.md` | CLI | Piano dettagliato + rischi + verifiche previste |
| 3 | `_03_EXEC_<task>.md` | Cowork | Autorizzazione esecuzione (può richiedere modifiche al PLAN) |
| 4 | `_04_REPORT_<task>.md` | CLI | Risultati + artefatti + verified-by + problemi |
| 5 | `_05_REVIEW_<task>.md` | Cowork | Chiusura, lessons learned, follow-up |

## Regole
- CLI **mai** inizia esecuzione senza `_03_EXEC_*` ricevuto
- CLI **mai** salta il `_02_PLAN_*` anche se task sembra ovvio
- Commit signature CLI: `[CLI] tipo(scope): descrizione`
- File numerati con prefisso ordine + ruolo + nome task descrittivo
- File chiusi (post REVIEW) si possono archiviare in `cowork_code_exchange/_archived/`
