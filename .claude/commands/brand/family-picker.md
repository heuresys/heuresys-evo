---
description: Pick the right aesthetic family before starting visual exploration (Heuresys-aware)
argument-hint: '[optional: brief context override or focus area]'
---

# /brand:family-picker

Esegui il prompt template canonico `family-picker` adattato al contesto Heuresys. Source: `.ux-design/99-samples/rohitg00-prompts/family-picker.md`.

## Contesto Heuresys (default — sovrascrivibile da $ARGUMENTS)

- Prodotto: Organizational Intelligence & Workforce Orchestration B2B
- Audience primaria: HR Director, IT Admin, Dept Head
- UI dominante: dashboard-heavy, KG topology, tabelle dense, KPI sparkline
- Stato brand corrente: D1 chiuso → μ-architect-legacy locked (vedi `DECISIONS-LOG.md` L21)

## Procedura

1. Leggi/internalizza il prompt completo da `.ux-design/99-samples/rohitg00-prompts/family-picker.md`
2. Poni le 3 domande in ordine, **una alla volta**, attendendo ogni risposta. Non raccomandare prima di tutte e 3.
   - Q1: read-heavy o scan-heavy?
   - Q2: utente primario (developer/designer/creator/consumer/prosumer)?
   - Q3: deve sembrare "courageous" o "familiar/trustworthy"?
3. Dopo le 3 risposte produci output nello schema canonico:
   - RECOMMENDED FAMILY
   - WHY (2 frasi)
   - REFERENCE 1 — path in `.ux-design/99-samples/rohitg00-frameworks/<family>/<brand>.md` o `voltagent-design-md/<brand>.DESIGN.md`
   - REFERENCE 2 — secondo path locale
   - ALTERNATIVE FAMILY
   - AVOID (con 1 frase di motivazione)
   - NEXT STEP

## Vincoli Heuresys

- Non re-proporre direzioni scartate (Pairing A/C/B2/B3, Editorial Cinematic dissolto in L11)
- Famiglia storicamente raccomandata: Data-Dense Pro (primaria) + Editorial Minimalism (secondaria) — verifica se le risposte confermano o smentiscono
- Riferimenti canonici locali: `02-aesthetic/heuresys.DESIGN.md` (drop-in spec) e `02-aesthetic/direction-final.md`
- Una sola famiglia: forza la scelta

## Argomenti utente

$ARGUMENTS
