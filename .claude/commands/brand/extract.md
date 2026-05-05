---
description: Extract a working DESIGN.md (9 canonical sections) from a live URL or screenshots
argument-hint: '<url-or-paths> [optional: target output filename]'
---

# /brand:extract

Estrai un `DESIGN.md` operativo da un sito live o da screenshot, conforme alle 9 sezioni canoniche. Source: `.ux-design/99-samples/rohitg00-prompts/brand-to-design-md.md`.

## Input

URL o path screenshot: $ARGUMENTS

(Se vuoto: chiedi se l'input è URL via WebFetch o screenshot via path, e quale.)

## Procedura

1. Inspect (in ordine):
   - Computed CSS di `body`, `h1`, primary button, primary link
   - Hero section tokens (color, type, spacing)
   - Font stack + licensing notes
   - Distinctive visual signature (radii, shadow, motion, grid)
2. Per URL: usa WebFetch per HTML+CSS rendered. Per screenshot: usa Read sui file immagine + sampling colori.
3. Produci output nelle 9 sezioni canoniche, ognuna < 150 parole:
   - **Visual Theme & Atmosphere**
   - **Color Palette & Roles** (CSS variables — hex, role names, NO brand names)
   - **Typography Rules** (scale + stack + fallback)
   - **Component Stylings** (button, card, input, nav)
   - **Layout Principles** (grid, max-width, spacing scale)
   - **Depth & Elevation**
   - **Do's and Don'ts**
   - **Responsive Behavior**
   - **Agent Prompt Guide** (con clausola di rejection finale)

## Regole

- **Solo ciò che puoi verificare** dall'output renderizzato. Mai allucinare.
- Typography non identificabile → marca "unknown" (non inventare).
- Color values come hex (NO `rgb()`, NO nomi).
- Quality checks finali:
  - [ ] 9 sezioni presenti
  - [ ] Hex (no `rgb()`/nomi)
  - [ ] Font stack con fallback
  - [ ] No purple-gradient default
  - [ ] No emoji nel DESIGN.md stesso
  - [ ] Spacing scale numerico (no "small/medium/large")
  - [ ] Agent Prompt Guide chiude con rejection clause

## Output target

- Default location: `.ux-design/99-samples/extracted/<brand>.DESIGN.md` (crea cartella se non esiste)
- Override: secondo argomento di $ARGUMENTS

## Pair con altri command

- Dopo extract → `/brand:audit <url>` per benchmark contro la baseline appena estratta
- Dopo extract → `/brand:remix <extracted> <heuresys.DESIGN.md>` per ibridare
