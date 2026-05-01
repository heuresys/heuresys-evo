# scripts

Automation e script one-off.

## Convenzioni
- Ogni script auto-documenta lo scopo nelle prime righe (commento header)
- Script idempotenti dove possibile (safe da rilanciare)
- Script stampano cosa fanno prima di farlo (no silent operations)
- Bash standard POSIX per cross-platform (Linux VM + Mac + Git Bash su Windows)
- Script di migrazione DB documentano explicit dry-run mode
