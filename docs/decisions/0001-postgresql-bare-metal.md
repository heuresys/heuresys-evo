# ADR-0001: PostgreSQL bare-metal (no container) per il database principale

**Status**: Accepted
**Date**: 2026-04-27
**Authors**: Enzo Spenuso

## Context

Il progetto `heuresys.com.evo` è un SaaS B2B multi-tenant con un dataset operativo significativo: ~17.000 entità nel knowledge graph (14.011 skill ESCO, 3.040 occupazioni, ~126K relazioni Occ↔Skill, 3.276 codici NACE/ATECO), embeddings bilingue 1.536-dim (`text-embedding-3-small`) e RLS attivo su tabelle multi-tenant. Il deploy target principale è una VM OCI ARM64 Ubuntu 24.04 (oracle-vm-default, 80.225.82.207).

Le forze in gioco:
- **Performance**: query con vector search (pgvector), join su grafo ESCO e RLS richiedono accesso disco diretto e tuning di `shared_buffers`/`work_mem` coerente con la RAM della VM
- **Persistenza dati**: la base ESCO + dati cliente è asset critico; restart container o volumi mal gestiti comportano rischio data loss
- **Gestione operativa**: backup, replica, vacuum, role management sono procedure DBA standard, ma cambiano radicalmente se il DBMS è containerizzato
- **Resource isolation**: PostgreSQL trae beneficio da accesso diretto a RAM/disk/CPU, senza overhead del container runtime
- **Esperienza pregressa**: nel repo originale `heuresys.com.evo` (v1) il PostgreSQL era già bare-metal — la decisione conferma un pattern collaudato, non introduce un cambio

## Decision

PostgreSQL gira **bare-metal** su VM OCI (e su host locale durante lo sviluppo), **mai** in container Docker.

Implicazioni concrete:
- `infra/docker-compose*.yml` non contiene un servizio Postgres
- Le applicazioni si connettono via env `DATABASE_URL=postgresql://user:pass@host:port/db`
- Backup, restore, role management gestiti via script bash in `db/scripts/` (non via `docker exec`)
- Migrations applicate via `psql` o tool nativo (es. `node-pg-migrate`), non via container ephemeral
- Estensioni (pgvector, eventuali altre) installate sull'host con `apt`/`pgxn`

## Alternatives considered

- **PostgreSQL containerizzato in Docker Compose** — semplifica setup dev (un solo `docker compose up`), ma:
  - Overhead I/O (anche con bind mount) misurabile su query vector/join pesanti
  - Tuning DBMS dipende da limiti container (memory, cgroup) — meno predicibile
  - Backup/restore richiedono `docker exec` o volume copy, più macchinosi
  - **Rejected**.

- **Managed Postgres (Supabase, Neon, AWS RDS, Azure Database)** — outsource gestione operativa, scaling automatico, alta disponibilità built-in, ma:
  - Costo ricorrente significativo per dataset 17K entità + embedding
  - pgvector + estensioni custom (RLS policy complesse, funzioni stored) non sempre supportate al 100%
  - Lock-in vendor; data egress costoso
  - Latenza app→DB cresce se il managed sta in region diversa dalla VM OCI eu-milan-1
  - **Rejected** (rimane opzione futura per scaling >>10x se la base utenti cresce).

- **PostgreSQL su VM OCI dedicata (separata da app)** — bare-metal ma fisicamente separato, scaling indipendente, ma:
  - Costo doppio (2 VM) sul Free Tier OCI
  - Latenza network app↔DB cresce vs co-locazione
  - Complessità infra superiore al beneficio attuale
  - **Rejected** per ora; promosso a evaluation se le dimensioni richiedono dedicated DB host.

## Consequences

### Positive
- Performance prevedibile, tuning standard PostgreSQL applicabile
- Backup/restore/replica con strumenti nativi (`pg_basebackup`, `pg_dump`, streaming replication)
- Estensioni (pgvector, postgis se mai serve, custom functions) installabili senza vincoli container
- Coerenza con il deploy target reale dell'app v1 (heuresys.com.evo originale)
- Costo operativo minimo (single VM, già pagata)

### Negative
- Setup dev locale richiede installazione Postgres sull'host (Mac/Linux/WSL); non basta `docker compose up`
- Sviluppatori devono gestire upgrade del DBMS manualmente
- Disaster recovery richiede pianificazione esplicita (snapshot VM, backup off-site su Object Storage OCI)
- Test CI richiedono: o un Postgres reale di test esposto via secret `DATABASE_URL_TEST`, oppure provisioning on-demand con `testcontainers-node` (decisione rimandata a un ADR successivo)

### Follow-ups
- Documentare procedura di setup Postgres locale in `db/scripts/setup-local.sh`
- Definire policy di backup automatizzato (cron + Object Storage OCI) in `db/scripts/backup.sh`
- Decidere strategia test CI per database (ADR futuro)
- Documentare strategia di upgrade DBMS in `docs/runbooks/postgres-upgrade.md`
