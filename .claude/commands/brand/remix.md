---
description: Two-brand remix arbitration — produce a coherent third DESIGN.md from two parents
argument-hint: '<DESIGN_A.md> <DESIGN_B.md> [optional: REMIX_NAME]'
---

# /brand:remix

Combina token da due DESIGN.md in un terzo sistema coerente, con arbitraggio esplicito (non copy-paste). Source: `.ux-design/99-samples/rohitg00-prompts/remix-two-brands.md`.

## Input

DESIGN_A, DESIGN_B (path), REMIX_NAME (opzionale): $ARGUMENTS

(Se i 2 path mancano: chiedi all'utente. Default location parents: `.ux-design/99-samples/voltagent-design-md/<brand>.DESIGN.md` o `.ux-design/99-samples/rohitg00-frameworks/<family>/<brand>.md`.)

## Arbitration rules (vincolanti)

1. **TYPOGRAPHY** — da A o da B, MAI entrambi. Giustifica la scelta in 1 frase.
2. **COLOR** — neutrals da uno, accent dall'altro. MAI mescolare 2 accent. Pick one.
3. **SPACING** — scala più stretta tra le due.
4. **RADII** — quella che si abbina alla typography scelta.
5. **DEPTH** — eredita dal sistema MORE restrained.
6. **COMPONENTS** — per ogni component dichiara quale parent ha contribuito quale token, e perché.
7. **DO'S/DON'TS** — merge delle due liste, rimuovi contraddizioni, segnala tensioni residue come "creative tension — document for team".

## Output target

Path: `.ux-design/99-samples/remix/<brand-a>-x-<brand-b>.md` (crea cartella se non esiste)

Struttura:

- 9 sezioni canoniche DESIGN.md
- Sezione finale: `## Parent-brand DNA: A=XX%, B=YY%` basato su token count effettivo

## Vincolo critico

L'output deve **non** leggere come blend. Deve leggere come terzo brand che potrebbe stare in piedi da solo. Se sembra solo collage → rigenera con scelte più decise.

## Pair con Heuresys

Remix candidato per Heuresys (suggerimento, non vincolante):

- `clickhouse.DESIGN.md` × `linear.DESIGN.md` → "Data-Dense Editorial" (analytics rigor + Swiss restraint)
- `claude.DESIGN.md` × `clickhouse.DESIGN.md` → "Warm Data" (editorial soul + dashboard density)

Riferimento canonico Heuresys: `.ux-design/02-aesthetic/heuresys.DESIGN.md` (post-D1 μ-architect-legacy).
