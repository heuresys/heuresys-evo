# Heuresys — Handoff dual-channel

**Data**: 2026-05-02
**Status**: ATTIVO — riferimento operativo per sviluppo su entrambi i canali
**Owner**: Enzo Spenuso

> **Questo documento esiste in due copie identiche**: `heuresys.com.evo/HANDOFF.md` e `heuresys-evo/HANDOFF.md`. Se modifichi uno, allinea l'altro.

---

## 1. Realtà operativa attuale

Esistono **due canali di sviluppo paralleli e indipendenti**. Ogni canale è un sistema completo, autonomo, con codebase + DB + deploy separati. Le modifiche su un canale **non si riflettono automaticamente** sull'altro.

| Aspetto                | Canale A — `.com.evo` (legacy)                                                     | Canale B — `heuresys-evo` (greenfield)                                           |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Repo Git**           | `/home/ubuntu/heuresys.com.evo/`                                                   | `/home/ubuntu/heuresys-evo/`                                                     |
| **GitHub mirror**      | `heuresys/heuresys.com.evo`                                                        | `heuresys/heuresys-evo` (privato)                                                |
| **Stack**              | Express 5 + Next.js 16 + monolith                                                  | NestJS + Prisma + Next.js 16 + monorepo                                          |
| **Pagine frontend**    | 231 (production-grade)                                                             | 3 + `/showcase` (MVP)                                                            |
| **Endpoint API**       | 1.481                                                                              | 11                                                                               |
| **Modelli DB attivi**  | ~635 (in uso)                                                                      | 566 (introspect Prisma, 6 attivamente usati nei 3 endpoint MVP)                  |
| **Test totali**        | molti (vitest+jest)                                                                | 130+ (api-gateway 93 + shared 70 + app 12 + ui 29)                               |
| **UI components**      | legacy custom                                                                      | 103 (Cantiere B v2)                                                              |
| **Deploy live URL**    | `http://80.225.82.207:3012` (frontend), `http://80.225.82.207:8012` (api)          | `https://evo.heuresys.com/` (frontend), API in build                             |
| **Container Docker**   | `heuresys_evo_*` (5 container, project-name `heuresys_evo`)                        | (nessuno; Next.js dev `npm run dev` su porta 3200)                               |
| **Database target**    | container `heuresys_evo_platform_db:5433` (utente `heuresys`, password `heuresys`) | bare-metal `localhost:5432` (peer auth `postgres`, user `heuresys` con password) |
| **Stato applicazione** | **PRODUZIONE matura**                                                              | **MVP greenfield**                                                               |
| **Maturity**           | feature-completa, debiti tecnici noti, in pensionamento progressivo                | foundation pulita, architettura moderna, da costruire feature-by-feature         |

**Importante**: i container `heuresys_evo_*` (frontend, api-gateway, ecc.) sono il **legacy**, NON evo greenfield. Il prefix "evo" nei nomi container è una convenzione storica (project-name del compose), non l'identità del codice.

---

## 2. Vision e modello migrazione

Heuresys è una **piattaforma di Capability Governance** che osserva l'organizzazione da 3 prospettive cross-cutting:

- **P** Process — processi, sessioni, workflow, governance
- **E** Enterprise — org & systems, taxonomy, marketplace, struttura
- **T** Talent — risorse umane, competenze, performance, learning

HR è UNA delle 3 lenti, non IL prodotto.

**Modello migrazione**: phased portfolio PET-driven, NON cutover-event. Le 33 aree funzionali (con 47 mappature `rbp_area_perspectives` PRIMARY+SECONDARY) migrano da legacy a evo per priorità Tier 1 → 2 → 3, ognuna in un suo tempo. Legacy resta fonte di verità finché un'area non è portata.

Riferimento: `heuresys-evo/docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md`.

---

## 3. Canale A — sviluppare su legacy `.com.evo`

### Cosa puoi fare

**Qualsiasi attività di sviluppo**: bug fix, feature nuove, refactor, schema DB, test, deploy. Il canale è completo e maturo.

### Vincoli operativi

1. Le modifiche **restano in legacy**: niente sync automatico verso evo
2. Schema DB modificato → applicato solo al container DB legacy (`heuresys_evo_platform_db:5433`)
3. Code modificato → committed solo su repo `heuresys.com.evo` + mirror GitHub
4. Deploy → docker compose ricostruisce solo container legacy

### Comandi essenziali

```bash
# Avvio stack legacy (su VM)
cd /home/ubuntu/heuresys.com.evo/infra
docker compose up -d                      # avvia tutti i container

# Quick query DB legacy
PGPASSWORD=heuresys psql -h 127.0.0.1 -p 5433 -U heuresys -d heuresys_platform

# Build + test
cd /home/ubuntu/heuresys.com.evo
npx tsc --noEmit
NODE_OPTIONS='--experimental-vm-modules' npx jest --forceExit
```

### Quando preferire questo canale

- Bug fix urgente che impatta il dominio app live
- Feature richiesta da uso interno/demo immediato (timeline < 1 settimana)
- Manutenzione schema DB legacy che non sarà portata in evo

### Riferimenti

- `heuresys.com.evo/CLAUDE.md` — istruzioni progetto
- `heuresys.com.evo/ROAD_TO_GLORY.md` — Phase 0-5 storico (Phase 6+ supersedes da PET strategy)
- `heuresys.com.evo/docs/` — documentazione completa

---

## 4. Canale B — sviluppare su greenfield `-evo`

### Cosa puoi fare

**Qualsiasi attività di sviluppo**: stesse capacità del canale A. Stack moderno (NestJS + Prisma + monorepo) ma feature da costruire dalle fondamenta.

### Vincoli operativi

1. Le modifiche **restano in evo**: niente sync automatico verso legacy
2. Schema DB modificato → applicato solo al bare-metal `localhost:5432`
3. Code modificato → committed solo su repo `heuresys-evo` + mirror GitHub
4. Deploy → npm dev/build, container separati (TBD), nginx vhost dedicato

### Comandi essenziali

```bash
# Avvio app evo (Next.js dev mode su 3200)
cd /home/ubuntu/heuresys-evo/services/app
DATABASE_URL='postgresql://heuresys:heuresys@127.0.0.1:5432/heuresys_platform?schema=public' \
  npm run dev

# Quick query DB evo (peer auth come postgres)
sudo -nu postgres psql -d heuresys_platform

# Build + test
cd /home/ubuntu/heuresys-evo
npm run build --workspaces
npx vitest run

# Prisma workflow
cd services/app
npx prisma migrate dev --name <feature>   # nuova migration
npx prisma generate                        # rigenera client
npx prisma studio                          # UI esplorativa
```

### Quando preferire questo canale

- Feature strategiche vision-aligned (AI Talent Advisor, ESCO graph, PET dashboards)
- Showcase dimostrativi (DD investitori, demo)
- Architettura moderna richiesta (type-safe end-to-end, Server Components)
- Lavoro che porterà valore di lungo termine

### Riferimenti

- `heuresys-evo/CLAUDE.md` — istruzioni progetto evo (slim, no Cowork)
- `heuresys-evo/docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md` — SoT strategico
- `heuresys-evo/docs/_meta/governance-evo.md` — sintesi P1-P10 + RBP + 47 PET
- `heuresys-evo/docs/_meta/migration-doc-audit.md` — classificazione 107 doc legacy
- `heuresys-evo/docs/migration/dbms-cookbook.md` — query reali pronte all'uso
- `heuresys-evo/docs/migration/dbms-bootstrap-strategy.md` — analisi schema DB
- `heuresys-evo/docs/20-architecture/` — 7 ADR architettura (NestJS, Prisma, RLS, Auth, Cutover, API, Monorepo)
- `heuresys-evo/docs/30-developer/` — 5 guide developer (TS strict, Next.js, Prisma migrate, DTO, parity tracker)
- `heuresys-evo/docs/40-operations/` — 4 runbook ops (deploy, observability, incident, DB management)
- `heuresys-evo/docs/70-planning/pet-migration-roadmap.md` — roadmap Tier 1/2/3

---

## 5. Regola di segregazione

| Aspetto          | Comportamento                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository Git   | 2 repo separati, 0 cross-references                                                                                                                                   |
| Database         | 2 istanze separate (5432 bare-metal evo + 5433 container legacy). Attualmente schema+dati identici (baseline-squash 2026-04-27), ma **modifiche future divergeranno** |
| Schema migration | una migration su un DB NON si applica all'altro automaticamente                                                                                                       |
| Branch policy    | branch `main` di entrambi sono indipendenti, niente merge cross-repo                                                                                                  |
| Deploy pipeline  | 2 pipeline separate, 0 trigger condivisi                                                                                                                              |
| Test suite       | 2 suite separate, 0 fixture condivisi                                                                                                                                 |
| Domain DNS       | `evo.heuresys.com` ora punta a evo (porta 3200 via Nginx); legacy resta su `:3012` diretto                                                                            |

**Eccezione storica unica**: lo schema DB di evo bare-metal è clone del legacy (~566 tabelle identiche dal baseline-squash 2026-04-27). Da oggi in poi le due istanze divergeranno appena uno dei due canali modificherà schema o dati.

---

## 6. Sincronizzazione: SOLO manuale, SOLO via porting

L'unico modo per "trasferire" un'area da legacy a evo è **porting esplicito**: scrivere in evo (NestJS + Prisma + Next.js) le pagine + endpoint + schema dell'area, eventualmente importando logica/test dal legacy. Non c'è automazione.

Ordine raccomandato (vedi `pet-migration-roadmap.md`):

- Tier 1: aree cross-cutting + abilitatori vision (~30-40 pagine)
- Tier 2: data sources delle 3 lenti (~80-120 pagine)
- Tier 3: tooling/admin granulare (~50-80 pagine)

Quando un'area è "evo-complete + cutover-ready" (vedi `feature-parity-tracking.md`):

1. Verifica equivalenza endpoint (test integration su entrambi i DB)
2. Sposta traffico utente di quell'area dal legacy a evo (a livello applicativo o nginx)
3. Mantieni endpoint legacy per N giorni come safety net
4. Deprecate + rimuovi endpoint legacy dell'area

---

## 7. Snapshot dati 2026-05-02 (entrambi i DB sincronizzati)

| Categoria                                                    | Count (identico evo+legacy)                |
| ------------------------------------------------------------ | ------------------------------------------ |
| Tenants                                                      | 4 (heuresys, rtl-bank, smartfood, econova) |
| Users                                                        | 274 (di cui 8 canonical demo)              |
| Employees                                                    | 270                                        |
| ESCO skills / occupations / occupation-skills                | 14.011 / 3.040 / 126.051                   |
| Industry classifications NACE/ATECO                          | 3.276                                      |
| RBP role permissions / functional areas / pages / dashboards | 179 / 34 / 170 / 11                        |
| PET perspectives / area_perspectives mapping                 | 3 / 47 (25 PRIMARY + 22 SECONDARY)         |
| Performance reviews / Goals / Courses                        | 292 / 1.068 / 127                          |
| Audit logs                                                   | 334                                        |
| Leave requests / balances                                    | 0 (workflow non popolato)                  |

**Verifica futura sync**: `bash heuresys-evo/scripts/migration/parity-test-20-queries.sh`. Quando il count diverge per un'area, sai che lì è iniziata divergenza.

---

## 8. Quick start nuove sessioni

### Per lavorare sul canale A (legacy)

```bash
cd /home/ubuntu/heuresys.com.evo
git pull origin main
docker ps --format 'table {{.Names}}\t{{.Status}}'   # verifica container
# leggi CLAUDE.md per istruzioni progetto
```

### Per lavorare sul canale B (evo)

```bash
cd /home/ubuntu/heuresys-evo
git pull origin main
sudo -nu postgres psql -d heuresys_platform -c "SELECT count(*) FROM tenants"   # verifica DB
# se app evo non gira: cd services/app && npm run dev
# leggi CLAUDE.md per istruzioni progetto
# leggi docs/strategy/MIGRATION_STRATEGY_PET_DRIVEN.md per la rotta
```

### Verifica sincronizzazione DB

```bash
bash /home/ubuntu/heuresys-evo/scripts/migration/parity-test-20-queries.sh
# atteso: 20/20 ✓ match — qualsiasi diff indica divergenza in atto
```

---

## 9. Cosa NON fare

- ❌ Modificare lo schema DB di un canale aspettando che si propaghi all'altro
- ❌ Copiare codice dal legacy a evo come-is (lo stack è diverso, va riscritto secondo i pattern in `docs/20-architecture/`)
- ❌ Considerare evo "in produzione" per uso operativo reale (è MVP, manca 99% delle aree)
- ❌ Spegnere container legacy pensando "tanto evo è il futuro" (legacy è la sola produzione completa al momento)
- ❌ Sviluppare la stessa feature in parallelo su entrambi i canali (waste; scegli un canale per feature)

---

## 10. Changelog handoff

- **2026-05-02 v1.0** — initial handoff, dual-channel formalizzato post deploy parallelo + Prisma introspect 566 modelli + 19 doc nuovi + showcase live.
