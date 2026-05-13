# Heuresys Asset Showcase — local catalog management webapp

Strumento locale per gestire il catalogo brand identity in modo CRUD-friendly e visivo, alternativa attiva al doc statico `docs/30-developer/brand-dashboard-catalog.md`.

## Caratteristiche

- **Inventory automatico** alla prima esecuzione: parsing di `dashboard-brand.css` (~103 classi) + `active-theme.css` (~117 token) + `packages/ui/src/components/*.tsx` (~96 React) + `services/app/src/components/**/*.tsx` (~24 widget) + cross-reference con `brand-dashboard-catalog.md` per flag `promoted`.
- **Catalogo persistente**: SQLite locale (`data.db`), 5 tabelle (`asset`, `variant`, `tag`, `asset_tag`, `promotion_log`).
- **CRUD via UI**: aggiungere · editare · promuovere · taggare asset · gestire varianti.
- **Audit trail** append-only su ogni operazione di promote/edit.
- **Storybook-like**: sidebar gerarchica · canvas live preview per CSS · code snippet · link a Storybook esistente per React.

## Stack

- **Backend**: Express 5 + Prisma 5.22 (versioni allineate al main project)
- **DB**: SQLite locale
- **Frontend**: HTML + vanilla JS + Tailwind 4 CDN (zero build step)
- **Auth**: nessuna (localhost-only)

Zero duplicazione librerie già installate nel monorepo: `dashboard-brand.css` e `active-theme.css` sono proxati dal `services/app/src/styles/`, lo Storybook esistente in `packages/ui` è linkato per anteprime React interattive.

## Avvio (prima volta)

```bash
cd .ux-design/09-asset-showcase
npm install
npm run db:push       # crea schema SQLite
npm run db:generate   # genera Prisma client
npm run bootstrap     # popola DB parsing sorgenti progetto
npm run dev           # avvia server su http://localhost:5174
```

## Uso quotidiano

```bash
cd .ux-design/09-asset-showcase
npm run dev
```

Apri `http://localhost:5174` nel browser.

## Comandi utili

```bash
npm run db:studio     # Prisma Studio per ispezione DB
npm run reset         # cancella data.db e re-bootstrap (perde modifiche manuali)
npm run bootstrap     # re-import sorgenti (preserva flag manuali se asset già esiste)
```

## Note

- **Gitignored interamente** (vedi `.gitignore` root): solo `_legacy/` è committabile come archivio storico.
- Per riavviare da zero: `rm -rf data.db node_modules generated && npm install && npm run db:push && npm run bootstrap`.
- Modifiche manuali UI vengono preservate dal re-bootstrap (merge by `name`, non override).

## Estensioni possibili

- Export catalog → markdown rigenera `brand-dashboard-catalog.md` automaticamente
- Diff vs catalog SoT
- Tag-based filter / search avanzato
- Screenshot artifact per ogni asset (Playwright headless)
