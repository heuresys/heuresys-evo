# services/playground

Sandbox sperimentale per pagine WIP, design spike, integrazioni terze parti, esperimenti viz.

## ⚠️ Regole non negoziabili
- **MAI deploy in produzione**. Questa app esiste solo in dev/staging interno.
- **MAI usare DB reali**. Solo mock data, JSON locale, fixture in-memory.
- **MAI autenticazione reale**. Endpoint pubblici dev-only.
- **CI deve fallire** se rileva `services/playground/` nel build target di prod.

## Scope
- Componenti complessi in pagina full (non isolati come Storybook)
- Flussi multi-step UX in WIP
- Esperimenti di data viz (Cytoscape, D3, XY-Flow, Excalidraw, ECharts)
- Integrazioni 3rd-party in isolamento prima di portarle in `services/app`
- Spike throw-away datati (cartella `spikes/`)

## Stack target
- Next.js 16, riusa `packages/ui` e `packages/shared` come `services/app`
- Mock data via JSON file o fixture in-memory

## Convenzioni
- Cartella `spikes/` potata regolarmente: spike >30 giorni vanno promossi a `services/app` oppure cancellati
- Ogni spike ha un README locale che dichiara: data inizio, owner, esito atteso
- Quando un esperimento "funziona", si promuove il codice a `services/app/` e si elimina dal playground
