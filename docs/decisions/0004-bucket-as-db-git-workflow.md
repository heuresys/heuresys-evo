# ADR-0004: Bucket-as-DB-git workflow + schema unification

**Status**: Accepted
**Date**: 2026-04-29
**Authors**: Enzo Spenuso

## Context

Il progetto `heuresys.com.evo` è in fase di rebuild (`.evo`) — la nuova piattaforma sta venendo costruita in parallelo al v1 LIVE legacy, con l'intenzione di farla convergere a SoT unico al cutover production tra settimane / mesi. Lo scenario operativo:

- **1 dev (Enzo), single-machine workflow**: lavoro principale dal PC Windows (`D:\heuresys.com.evo\` = workspace `.evo`); VM OCI come deploy target futuro e ambiente di consultazione.
- **4 working directory di codice** (2 repo logici × 2 macchine):
  1. `D:\enzospenuso\Documents\GitHub\heuresys.com.evo\` (PC, legacy clone)
  2. `D:\heuresys.com.evo\` (PC, `.evo` rebuild — workspace primario)
  3. `/home/ubuntu/heuresys.com.evo/` (VM, legacy clone)
  4. `/home/ubuntu/heuresys-evo/` (VM, `.evo` mirror)
- **Schema convergente**: lo schema `.evo` (203 mig, max_v=222 con NextAuth) è derivato dal v1 legacy (max_v=220) tramite squash+restore + mig 222 NextAuth tables. È quindi un **superset** del legacy — il merge è già fatto.
- **Verifica empirica**: il container Docker VM 5433 (`heuresys_evo_platform_db`, ex-LIVE v1) ha avuto **zero scritture nei 7 giorni precedenti** la decisione (last_audit congelato al 2026-04-21, stesso timestamp del baseline che ha generato il `.evo`). È de facto un dev mirror, non production.
- **Vincolo strutturale**: la VM bare-metal `.evo` è raggiungibile dal PC solo via tunnel SSH (rimosso 2026-04-28 per scelta architetturale, ADR implicito) o via SCP — il dev locale richiede DBMS locale persistente con dati realistici.
- **Rischio di perdita dati**: persino un giorno di lavoro perso è dolorosissimo per Enzo.

Le forze in gioco:

- **Persistenza**: i dati dev devono sopravvivere fra sessioni (Docker Desktop spento, riavvii PC, ecc.).
- **Multi-machine flessibile**: la VM resta utilizzabile per consultazione/test (read-only sul SoT) e per backup ridondato.
- **Ridondanza off-site**: in caso di disastro PC, deve esistere una copia recente fuori dal PC.
- **Semplicità mentale**: 1 dev sequenziale non vuole pagare il costo di replica logica/streaming bidirezionale; "git mental model" (pull → lavoro → push) è familiare.
- **Costi operativi minimi**: nessuna nuova infra, nessun servizio cloud aggiuntivo oltre OCI Object Storage già esistente.

## Decision

Adottiamo un workflow **bucket-as-DB-git** in cui l'OCI Object Storage bucket `heuresys-evo-backups` (eu-milan-1, namespace `axlkznzapaek`) funge da "git remoto" del database.

### Principi

1. **PC Docker `heuresys_evo_db` è il SoT primario** per tutta la fase pre-cutover (settimane / mesi). Tutte le scritture significative atterrano lì.
2. **Schema unificato `.evo`** per i 3 DBMS live: PC Docker (5432), VM Docker (5433, riallineato), VM bare-metal (5432). Il legacy v1 schema è abbandonato come standard.
3. **OCI bucket = git del database**:
   - `latest.dump` (oggetto mutabile) = HEAD
   - `dump_<source>_<UTC-timestamp>.dump` = commit storici
   - `dump_vm_baremetal_cron_<UTC-timestamp>.dump` = safety snapshot notturno (NON aggiorna `latest.dump`)
4. **Workflow `evo-db {pull|push|status|history}`**:
   - `evo-db pull` a inizio sessione (allinea local DBMS al bucket)
   - `evo-db push` a fine sessione (pubblica local DBMS al bucket)
   - `evo-db status` per consultare locale vs bucket on-demand
5. **Last-write-wins** (single-dev sequenziale) con **soft-lock** di sicurezza: `db-push.sh` rifiuta push se il bucket è più recente del `.last-pull-stamp` locale. Override via `--force`.
6. **Working dir read-only**: `/home/ubuntu/heuresys-evo/` (WD #4, `.evo` mirror VM) può solo `pull`, mai `push`. Le scritture dell'app deployata sulla VM bare-metal sono throwaway (sovrascritte al prossimo pull).
7. **Retention bucket**: lifecycle native 30 giorni (IAM policy `heuresys-evo-backups-lifecycle` attiva, ADR implicito 2026-04-28).
8. **Backup safety net indipendente**: cron VM 03:00 UTC `backup-and-rotate.sh` continua a girare e fa upload come `dump_vm_baremetal_cron_*.dump` (NON tocca `latest.dump`). Off-site backup automatico, indipendente dal workflow PC.
9. **DR rehearsal weekly**: cron VM Mon 04:00 UTC `test-restore.sh` valida che i dump del bucket siano effettivamente restorable (9 smoke check: schema_migrations, tenants, employees, esco_skills, pgvector, vector indices, RLS policies, NextAuth tables).

### Mappa working dir → DBMS → permessi bucket

| # | Working dir | DBMS | Bucket |
|---|---|---|---|
| 1 | `D:\enzospenuso\Documents\GitHub\heuresys.com.evo\` (PC) | `pc-docker-evo` (Docker, 5432, condiviso con #2) | read+write |
| 2 | `D:\heuresys.com.evo\` (PC, workspace primario) | stesso DBMS di #1 | read+write |
| 3 | `/home/ubuntu/heuresys.com.evo/` (VM) | `vm-docker-v1` (Docker, 5433, schema `.evo` post-2026-04-29) | read+write |
| 4 | `/home/ubuntu/heuresys-evo/` (VM) | `vm-baremetal-evo` (bare-metal, 5432) | **read-only** |

## Alternatives considered

- **Tunnel SSH PC→VM Postgres always-on** (modello iniziale, eliminato 2026-04-28) — il PC scriveva direttamente al bare-metal VM. Richiedeva `Heuresys-Evo-PgTunnel` Task Scheduler always-on (RAM/CPU sempre attivi) e dipendenza dalla connettività SSH; rejected: troppa friction operativa sul PC.

- **Modello leader-replica con `align-replicas.sh` settimanale** (S5, 2026-04-28) — bare-metal VM = leader, repliche allineate via drop+restore weekly cron. Rejected dopo l'esperienza S5: (a) le scritture dal PC venivano cancellate ogni lunedì (replica overwritten); (b) richiedeva il container PC v1 sempre acceso per il sync; (c) workflow non sequenziale "dev pulls workspace → dev edits → dev hopes Monday doesn't wipe his work".

- **Streaming replication / logical replication PostgreSQL** — sync continuo bidirezionale o leader→replica, nativo Postgres. Rejected: complessità setup (publication, subscription, WAL config, network), richiede connettività affidabile PC↔VM 24/7 (PC dietro NAT residenziale), overkill per 1 dev sequenziale.

- **Managed Postgres (Supabase, Neon, RDS) come SoT cloud** — rejected per costi (>USD 20-50/mese), data egress costs, e ADR-0001 (PG bare-metal) ancora attivo per il deploy target VM.

- **DBMS locale-only senza alcuna replica off-site** — semplicissimo ma fa cadere il requisito "ridondanza off-site"; rejected per il vincolo Enzo "perdere anche un giorno di lavoro = dolorosissimo".

- **PC Postgres bare-metal Windows** (proposto inizialmente come opzione "C") — rejected dopo discovery: pgvector su Windows è non triviale (binari community, non ufficiali EnterpriseDB), restore-baseline.sh non funziona out-of-the-box su Windows. Container Docker `pgvector/pgvector:pg16` vince su semplicità.

## Consequences

### Positive

- **Persistenza locale garantita**: i dati nel volume Docker `heuresys_evo_data` sopravvivono a Docker Desktop off, riavvii PC, etc. Solo `docker volume rm` o `db-pull.sh` (esplicito) li sostituiscono.
- **Mental model semplice**: pull/push, come git. 1 dev sequenziale → zero conflitti reali.
- **Off-site backup automatico**: ogni `evo-db push` + cron VM 03:00 UTC (safety snapshot) producono dump indipendenti su OCI. Tre copie indipendenti del dato (PC + bucket + VM) — perdere tutto richiederebbe 3 disastri simultanei.
- **DR verificato**: il cron weekly DR rehearsal (Mon 04:00 UTC) prova ogni settimana che il bucket contiene dump restorable. Mai sorprese al disastro.
- **Schema unificato**: end della distinzione "tribù v1 vs `.evo`" sui 3 DBMS live. Una sola codebase, un solo schema, un solo workflow.
- **Workflow VM read-only**: l'app deployata sulla VM bare-metal può girare per test/audit senza compromettere la SoT (le sue scritture sono throwaway).
- **Costo zero**: usa OCI Object Storage Free Tier (10GB/mese gratis; 30gg retention × 370MB/push ≈ 11GB/mese, prossimo al limite ma manageable).
- **Path al production cutover**: quando si arriverà al deploy live, basta fare 1 dump from PC + 1 restore on VM bare-metal + cambiare DATABASE_URL nelle app. Operazione una-tantum, ~10 min.

### Negative

- **Last-write-wins richiede disciplina**: il soft-lock con version stamp aiuta, ma se Enzo per sbaglio fa push da una macchina avendo dimenticato un push da un'altra, il `--force` overide è possibile e silenzioso. Mitigato dalla single-dev nature del setup, ma non strutturalmente impossibile.
- **Sync non in tempo reale**: la VM bare-metal e VM Docker non riflettono le modifiche del PC fino al prossimo `evo-db pull`. Per dev locale è OK, per "guardare i dati live aggiornati dalla VM" Enzo deve esplicitamente pullare.
- **Bucket retention 30gg è hard limit**: dump più vecchi di 30 giorni sono cancellati dal lifecycle native OCI. Per archivi storici più lunghi (>30gg) servirebbe una strategia di promozione (es. archiviazione mensile su altro storage tier), non in scope di questo ADR.
- **OCI CLI dipendency**: ogni macchina che deve fare pull/push richiede OCI CLI installato + `~/.oci/config` con key file. Setup una-tantum ma nuova prerequisite.
- **Single-dev workflow**: se in futuro arrivassero altri dev (o sistemi automatici che scrivono al DBMS), il last-write-wins diventa fragile. Migrazione necessaria a streaming replication o managed Postgres prima di scalare il team.
- **Dimensione push**: ogni push è ~370MB di traffico (full dump). Su rete domestica residenziale può prendere ~3-5 minuti. Mitigato perché push avviene a fine sessione, non in mezzo al lavoro.

### Follow-ups

- Operativi (immediati):
  - Aggiornare `db/README.md` con la sezione "Workflow OCI bucket-as-DB-git" ✓ (fatto in S6)
  - Disabilitare/rimuovere cron VM `check-freshness.sh` weekly ✓ (fatto in S6)
  - Disabilitare/rimuovere PC Task Scheduler `Heuresys-Evo-Sync` ✓ (fatto in S6)
  - Banner DEPRECATED su `align-replicas.sh`, `check-freshness.sh`, `replicas.config.sh`, `sync-replicas-ephemeral.sh`, `install-freshness-task.ps1` ✓ (fatto in S6)
  - Rimozione fisica file deprecati ⏳ pianificata 2026-05-31

- Mid-term (settimane):
  - Verificare 1° run automatico del cron VM Mon 04:00 UTC (DR rehearsal) — primo lunedì 2026-05-04
  - Verificare 1° run automatico del cron VM 03:00 UTC con il nuovo naming `dump_vm_baremetal_cron_*` (notte 2026-04-30 vs 2026-05-01)
  - Considerare: dimensione bucket vs Free Tier OCI 10GB; se serve, ridurre retention a 14gg

- Long-term (cutover production):
  - Pre-cutover: validare che lo schema `.evo` è production-ready (TOTP, brand, eventi, ecc.)
  - Cutover: stop scritture PC → final `evo-db push` → stop app on PC → `evo-db pull` su VM bare-metal → cambia DATABASE_URL app per puntare al bare-metal VM → start app on VM
  - Post-cutover: `evo-db push` dal PC viene disabilitato (PC diventa read-only o dev-only)
  - Promuovere ADR-0004 a "Superseded by ADR-NNNN" quando il modello cambia post-production

- Repo `.evo` su GitHub:
  - Quando si farà (decisione 2026-04-29 di reverse del freeze 2026-04-27), dovrà ospitare anche tutto il workflow bucket-as-DB-git come parte del contract (`db/scripts/db-*.sh`, `oci-config.sh`, `evo-db` wrapper, `db/README.md` workflow section)

## References

- `db/README.md` — sezione "Workflow OCI bucket-as-DB-git"
- `db/scripts/{db-push,db-pull,db-status,db-history,evo-db,oci-config}.sh` — implementazione
- `~/.claude/projects/D--heuresys-com-evo/memory/project_db_bucket_workflow.md` — quick reference
- ADR-0001 (PostgreSQL bare-metal) — vincolo per il deploy target VM
- ADR-0003 (NextAuth v5 + Prisma) — origine della migration 222 che ha differenziato `.evo` da v1 schema
- Commit `24d11e7` — implementazione completa S6
