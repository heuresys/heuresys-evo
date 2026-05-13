# SESSION-RESUME — Cycle 2 protocol

> Protocol 4-step cycle 2 post-S62 reset 2026-05-13. Cycle 1 archive in `../.ux-design-archive-2026-05-13/` (read-only).

## Step 1 — Lettura SoT cycle 2

```
Read .ux-design/BRAND-STATE.md
Read .ux-design/DECISIONS-LOG-v2.md   (ultime 5 entry sufficienti)
Read .ux-design/README.md             (policy segregazione)
```

## Step 2 — Verifica `01-canonical/`

```
Glob: .ux-design/01-canonical/**/*
```

- Vuoto → cycle 2 Phase 1 assessment iniziale (nessuna canonical decision firmata)
- File presenti → leggi come SoT vincolanti per la sessione

## Step 3 — Saluta con stato chiaro

Format (max 5 righe):

```
Workstream brand identity (cycle 2) ripreso.

Phase: <da BRAND-STATE.md>
Canonical SoT: <count file in 01-canonical/>
Decisioni cycle 2: <count L-NN in DECISIONS-LOG-v2.md>

Da dove riprendiamo?
```

## Step 4 — Aspetta direzione esplicita

Eccezione: utente apre con comando self-contained → procedi.

## Cosa NON fare automaticamente

- ❌ Leggere `.ux-design-archive-2026-05-13/` (richiesta esplicita utente solo)
- ❌ Avviare http server local
- ❌ Caricare skill brainstorming / frontend-design
- ❌ Caricare tools via ToolSearch
- ❌ Proporre direzioni cycle 1 come opzioni attive
