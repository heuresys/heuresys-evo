# packages/shared

Tipi, schemi Zod, utility condivise tra frontend e backend.

## Scope
- Tipi TypeScript condivisi (es. `User`, `Organization`, `Process`, `Role`, `Skill`, ...)
- Schemi Zod usati per validare contratti API (frontend ↔ backend)
- Utility pure (formatters, validators, date helpers)
- Costanti del dominio (enum ruoli, codici NACE/ATECO base, ...)

## Stack target
- TypeScript 5+ puro (zero dipendenze runtime pesanti)
- Zod come unica dipendenza esterna principale

## Convenzioni
- Niente codice DOM-specifico (deve girare in Node + browser)
- Niente import da `services/*` o `packages/ui`
- Schemi Zod definiti una sola volta qui, importati da `api-gateway` e dai frontend
