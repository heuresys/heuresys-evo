# D5 — DevOps, Infrastructure & Deployability Assessment

**Audit date**: 2026-05-10 · **Auditor role**: Senior DevOps & Infra Engineer (M&A DD team)
**Scope**: deployment topology, CI/CD, backup/DR posture, observability, operational maturity
**Verdict preliminary**: **NEGOTIATE** (critical SPOF + DEV-grade ops, ma fondamenta tecniche serie e governance backup formalizzata)

## TL;DR

Heuresys-evo gira oggi su una singola VM Oracle Free Tier ARM64 in Docker Compose (NON modalità (b) systemd descritta come "futura PROD"). Backup chain cron + restore drill mensile attivi e verificati. CI/CD ridotto a 4 workflow PR-only senza CD reale. NO HA, NO multi-region, NO IaC, NO APM, NO on-call backup, NO alerting. Posture appropriata per MVP/founder-led, **incompatibile con SLA enterprise paying customer** senza investimento infra significativo (stimato 80-150k EUR + 3-6 mesi).

## Severity overview

| Severity     | Count | Findings                                    |
| ------------ | :---: | ------------------------------------------- |
| **Critical** |   3   | F5.1, F5.2, F5.3                            |
| **High**     |   4   | F5.4, F5.5, F5.6, F5.7                      |
| **Medium**   |   3   | F5.8, F5.9, F5.10                           |
| **Low**      |   2   | F5.11, F5.12                                |
| **None**     |   —   | (Strengths consolidati in sezione dedicata) |

## Findings

### F5.1 — Single Point of Failure: 1 VM Oracle Free Tier (CRITICAL)

**Evidence**: `docs/40-operations/deploy-evo.md` L3, ADR-0001 §Context, `docs/40-operations/incident-runbook-evo.md` L3 ("VM target: oracle-vm-default 80.225.82.207"). CLAUDE.md root: "Single point of failure: 1 VM Oracle Free Tier (no HA, no multi-region)".

**Detail**: l'intera piattaforma (FE 3200, API 8200, enrichment 8220, Postgres 5432, Redis 6379, nginx, certbot) è co-locata su **una sola istanza** OCI ARM64 Free Tier in region `eu-milan-1`. Nessun load balancer, nessun nodo standby, nessun replica DB. Free Tier OCI ha SLA dichiarato dal provider tipicamente best-effort senza credit policy per istanze Always Free (vs 99.95% paid).

**Risk**: qualunque evento (kernel panic, OCI maintenance unannounced, certificate renewal failure, disk full, kernel upgrade bricking ARM64 boot, OCI reclaim Free Tier instance per inactivity policy) → **RTO ≥ ore o giorni** se la VM è unrecoverable. Per un acquirer che vende SaaS B2B con SLA contrattuali (tipico 99.5-99.9%), questo è **deal-breaking** allo stato attuale.

### F5.2 — DEV mode in produzione: Docker Compose vs systemd plan documentato (CRITICAL)

**Evidence**: `deploy-evo.md` L8-L13: "(a) Docker Compose | DEV attuale (default oggi) | **ATTIVA** | (b) Bare-metal systemd + Nginx | PROD futura | Pianificata". `https://evo.heuresys.com` è servito da container `heuresys_evo_*` su porte 3012/8012/8020.

**Detail**: il dominio task descrive bare-metal systemd come scelta esplicita ADR-0001, ma quella scelta vale **solo per Postgres**. Il resto dello stack applicativo gira in Docker Compose su una directory utente (`/home/ubuntu/heuresys-evo/`), non come servizio systemd-managed. Le porte produzione `3200/8200` documentate in CLAUDE.md non corrispondono al runtime attuale (3012/8012). Discrepanza doc vs realtà = rischio operativo elevato in incident response.

**Risk**: incident responder che segue il runbook può cercare unit systemd inesistenti. Restart/upgrade procedure assumono baseline diversa dal runtime. La modalità (b) richiede effort di conversione non quantificato + downtime cutover.

### F5.3 — NO Disaster Recovery oltre VM-locale: backup off-site non provisionato (CRITICAL)

**Evidence**: `dbms-backup-restore.md` §Off-site L150-155: "**Status**: not yet provisioned. Tracking under SH-2/SH-3 follow-up; until then, all backups are local-only on the VM (40 GB free, sufficient for current chain horizon)". Runbook L104-132 documenta restore da bucket OCI ma il bucket NON ESISTE.

**Detail**: 7 daily + 8 weekly + 12 monthly dump sono tutti su `/var/backups/heuresys-evo/` sulla **stessa VM** del database. Se la VM viene reclaim/corrupted/destroyed, l'intera chain backup è persa con essa. Il restore drill mensile valida la procedura ma non risolve il problema fisico.

**Risk**: scenario realistico OCI Free Tier reclaim → DB + backup distrutti contemporaneamente = **data loss totale**. Per acquirer enterprise questo viola praticamente ogni framework compliance (SOC 2 CC7.4, ISO 27001 A.12.3, GDPR Art. 32). Mitigazione richiesta entro 30 giorni post-acquisition (effort: ~8h provision bucket + script + IAM + encryption-at-rest).

### F5.4 — NO observability stack: Sentry deferred, no APM, no metrics dashboard (HIGH)

**Evidence**: CLAUDE.md "Observability: Sentry deferred, pino logging baseline, no APM". Runbook L80 menziona `/metrics` Prometheus endpoint ma non c'è scraper/Grafana documentato. Health endpoint solo `/api/health` + `/api/health/ready`.

**Detail**: visibilità operativa = `docker logs` + `journalctl` + tail manuale di nginx access log. Nessun aggregatore (Loki/CloudWatch/Datadog), nessuna metrica time-series persistita, nessuna dashboard P95 latency, nessun error rate alerting. Pino redaction è configurata (good) ma i log non lasciano la VM.

**Risk**: MTTD (mean time to detect) = tempo umano di accorgersi del problema. Incident severity matrix definisce SLA <15min P1 ma **nessun meccanismo automatico** segnala P1 — Enzo deve guardare manualmente o ricevere segnalazione utente.

### F5.5 — NO alerting / on-call protocol incompleto (HIGH)

**Evidence**: `incident-runbook-evo.md` §On-call escalation L152-157: "Primary: Enzo (founder) — Slack DM + telefono. Backup: TBD (placeholder, da definire al primo hire infra)".

**Detail**: zero rotation, zero pager (PagerDuty/Opsgenie/Grafana OnCall), zero escalation policy. SLA P1 <15min è **dichiarativo** non operativo. Nessuna integrazione healthcheck → notifica. Founder = single point of human failure.

**Risk**: bus factor 1 sull'intera ops. Notte/weekend/vacanza founder = SLA contrattuali violati per design. Acquirer deve onboardare ops team L1/L2 prima di poter sottoscrivere SLA enterprise.

### F5.6 — NO Infrastructure as Code: VM stato non riproducibile (HIGH)

**Evidence**: zero file Terraform/Pulumi/Ansible nel repo. `infra/systemd/`, `infra/nginx/` contengono template ma non c'è playbook di provisioning end-to-end. Setup VM = istruzioni manuali documentate parzialmente in `deploy-evo.md`.

**Detail**: ricreare la VM da zero richiede esecuzione manuale: install Postgres 16 + extensions (vector, ltree, pg_trgm, pgcrypto, uuid-ossp), Node 20, Docker, nginx, certbot, cron jobs, systemd units, scripts `/usr/local/bin/heuresys-backup.sh`. Drift tra istruzioni doc e stato runtime non è verificabile automaticamente.

**Risk**: DR procedure documentata `dbms-backup-restore.md` §Disaster recovery assume VM esistente — se la VM è persa, c'è una fase undocumented "ricostruisci la VM" prima di poter restore. RTO 30min dichiarato è valido SOLO con VM intatta.

### F5.7 — NO CD pipeline reale: deploy via SSH manuale (HIGH)

**Evidence**: `deploy-evo.md` L84 "File `.github/workflows/deploy.yml` (target produrre dopo che modalità (b) sarà attiva — oggi vedi `deploy-app-api.yml.example`)". `.github/workflows/` contiene solo `quality.yml`, `security.yml`, `storybook.yml`, `a11y.yml` — **zero deploy workflow attivi**.

**Detail**: deploy = `ssh ubuntu@VM` + `git pull && docker compose up -d`. Nessun smoke automatico post-deploy, nessun rollback strategy automatica (rollback manuale via `git checkout SHA`), nessun blue-green/canary. Il template `deploy.yml` mostrato in doc non è committed.

**Risk**: ogni deploy è human-in-the-loop con rischio errore. No deploy frequency metrics, no DORA metrics tracking. Inadeguato per cadenza release enterprise (multiple/week).

### F5.8 — Branch protection rimossa, CI solo PR-driven (MEDIUM)

**Evidence**: CLAUDE.md L120 "Branch protection main: RIMOSSA. CI gira solo su PR + nightly cron security". ADR-0016 §Branch protection descrive policy attiva storica ma è stata revocata in S11.

**Detail**: workflow flow attuale = "1 sessione = 1 commit = direct push main". Quality/security/a11y workflow girano SOLO su PR — un push diretto in main bypassa lint, typecheck, test, build, gitleaks, semgrep, axe-aaa. Solo cron security daily 03:17 UTC + a11y nightly 02:30 UTC catturano regression dopo merge.

**Risk**: in un team founder-only può funzionare (Enzo è disciplined, mantiene 865 test green). Per team multi-coder post-acquisition è **inaccettabile** — acquirer deve ripristinare branch protection + status checks come precondizione onboarding.

### F5.9 — Secret management ad-hoc, nessun vault attivo (MEDIUM)

**Evidence**: `deploy-evo.md` L116-119: ".env files locali nel repo (gitignored)... PROD target: `.env.production` iniettato da OCI Vault tramite `oci secrets secret-bundle get` in `ExecStartPre=` del systemd unit, oppure da GitHub Secrets". OCI Vault integration è **target**, non attiva.

**Detail**: secrets reali risiedono in `.env` files sulla VM (filesystem perms-protected) + GitHub repo secrets per CI. Rotation manuale, no audit trail rotation, no centralizzazione cross-env.

**Risk**: compliance gap (SOC 2 CC6.1, ISO 27001 A.9.4.5). Gitleaks pre-commit + CI scan mitigano leak in repo (good) ma il vault-pattern dichiarato in doc non è implementato.

### F5.10 — Production runtime depends on legacy data container (MEDIUM)

**Evidence**: `deploy-evo.md` L26-29: "platform_db: { container_name: heuresys_evo_platform_db, ports: ['5433:5432'] } # legacy data". DB applicativo evo greenfield = bare-metal 5432, **popolato via baseline-squash da heuresys_evo_platform_db:5433**.

**Detail**: il bare-metal Postgres è SoT (ADR-0023, S22 promotion) ma il container legacy è ancora alive sulla stessa VM, consumando RAM/disk e creando ambiguità. Restart cycle del container legacy ha potenziale di lock-contention con il bare-metal stesso o di confusione operatore (porte 5432 vs 5433).

**Risk**: technical debt di transizione. Cleanup safe (decommissioning container post-promotion) non documentato come pianificato.

### F5.11 — pgvector ivfflat reindex post-restore richiede tuning manuale (LOW)

**Evidence**: `dbms-backup-restore.md` L69: "pgvector ivfflat indexes on `esco_skills.embedding*` cannot be rebuilt with the default `maintenance_work_mem=64MB` (drill log shows 4 ignored errors). Production restore must temporarily bump `maintenance_work_mem` to ≥128MB before `pg_restore`".

**Detail**: restore drill MENSILE PASSA ma con 4 ignored errors documentati. Procedura DR L86-88 include lo step manuale di ALTER SYSTEM. Open follow-up "bump maintenance_work_mem permanently to 256 MB on the VM" non chiuso.

**Risk**: in scenario DR sotto stress, l'operatore può dimenticare lo step e ottenere restore funzionalmente incompleto (vector search broken). Mitigation = 30min di tuning permanente.

### F5.12 — Backup non encrypted-at-rest (LOW)

**Evidence**: `dbms-backup-restore.md` L163 open follow-up: "Encrypt at-rest (LUKS volume or pgBackRest with `--cipher-pass`) — currently dumps are plain (only volume FS perms protect)".

**Detail**: dump pg_dump custom format compressed ma non cifrati. Esposizione = chi ha shell access alla VM ha anche dati in chiaro.

**Risk**: GDPR/PII concern medio (employees PII è in DB). Mitigation low-effort: LUKS o pgBackRest `--cipher-pass` (~4h).

## Strengths

- **ADR-0001 PostgreSQL bare-metal**: scelta deliberata, motivata, coerente con workload (vector search 17K entities, 1536-dim embedding, RLS, 367 policies). Performance prevedibile, tuning standard, no container I/O overhead. **Decisione architetturalmente solida**.
- **Backup governance formalizzata**: cron chain (daily/weekly/monthly) + retention policy + sha256 integrity + restore drill mensile **eseguito e PASS-verified** (2026-05-07T15:54Z). RPO 24h / RTO 30min target dichiarati con evidenza misurata. Above-average per startup MVP-stage.
- **Cost efficiency**: OCI Free Tier ARM64 = costo infra runtime ≈ 0 EUR/mese. Excellent cash-burn metric per pre-revenue, ma esplicitamente non scalabile a paying customer.
- **CI quality posture**: 4 workflow (quality, security, storybook, a11y) con job atomici, handoff-only-detect ottimizzazione (docs-only PR <60s green), composite action setup-node-prisma DRY, gitleaks self-hosted (no licence cost), semgrep OWASP+TS+JS+secrets ruleset, dependabot weekly grouped. **Test 865 green su 5 workspace = quality bar serio**.
- **Documentazione operativa**: deploy-evo.md, incident-runbook-evo.md, dbms-backup-restore.md sono **executable runbook**, non vapor doc. Severity matrix P1/P2/P3, postmortem template 5-section, comandi diagnostic stack-specific completi e copy-paste-ready.
- **Husky pre-commit + commitlint**: lint-staged + gitleaks-lite + commitlint enforced. Disciplina commit storia leggibile post-S11 simplification.

## Weaknesses critiche (sintesi acquirer-facing)

| Weakness                       | Implication enterprise                                                           |
| ------------------------------ | -------------------------------------------------------------------------------- |
| 1 VM SPOF (F5.1)               | Incompatibile SLA ≥99.5% per design                                              |
| Backup VM-locale (F5.3)        | Compliance fail SOC 2 / ISO 27001 / GDPR Art. 32                                 |
| NO IaC (F5.6)                  | DR end-to-end non riproducibile, vendor lock-in implicito a OCI manual setup     |
| NO CD pipeline (F5.7)          | Release frequency limitata, errore umano per deploy, DORA metrics non misurabili |
| NO APM/alerting (F5.4 + F5.5)  | MTTD = humano, on-call founder-only, no observability per scaling team           |
| Docker vs systemd drift (F5.2) | Doc-runtime drift = incident response degradata                                  |

## Operational maturity scoring

| Dimensione                | Score (1-5) | Note                                                                      |
| ------------------------- | :---------: | ------------------------------------------------------------------------- |
| Runbook esistono          |      4      | Diagnostic + restore + rollback documentati executable                    |
| Incident response process |      2      | SLA dichiarata, no automation, no on-call rotation                        |
| Backup/DR                 |      3      | Cron + drill PASS, ma off-site MISSING + DR end-to-end non riproducibile  |
| Observability             |      1      | Solo logs + health endpoint, no APM, no metrics persistence, no alerting  |
| CI/CD maturity            |      3      | CI strong (4 workflow, 865 test green), CD assente (manual SSH deploy)    |
| IaC / reproducibility     |      1      | Zero Terraform/Ansible, setup VM manuale                                  |
| Security baseline ops     |      3      | Gitleaks + semgrep + npm-audit + RLS DB-level OK, vault target non attivo |
| **Media ponderata**       |   **2.4**   | **DEV-grade ops, NOT production-enterprise grade**                        |

## Acquirer perspective

**SPOF singolo VM Oracle Free Tier per acquirer enterprise**: significa che ogni cliente paying con SLA contrattuale ≥99.5% è esposto a violazione contrattuale strutturale. Free Tier OCI può essere reclaim per inactivity, OCI region eu-milan-1 può subire maintenance windows non negoziabili, ARM64 ha ecosistema più piccolo per emergency patching. Un singolo evento hardware o policy = downtime potenzialmente di ore/giorni con data loss totale (data + backup co-locati).

**Compatibilità SLA commerciale**: NON COMPATIBILE con qualsiasi SLA paid enterprise senza re-architecture. Compatible solo con: (a) free/freemium tier "best-effort no SLA", (b) pilot/POC con disclaimer esplicito.

**Cosa serve per production-ready scaling commerciale paying B2B**:

1. **HA**: minimo Postgres primary+replica streaming + app tier 2-node behind load balancer (~15-30k EUR/anno OCI paid + 40h setup)
2. **Multi-region DR**: cold standby in region OCI secondaria + WAL archiving cross-region per RPO ≤5min (~20k EUR/anno + 60h)
3. **IaC**: Terraform per VM + network + storage + IAM, Ansible per config management, idempotent end-to-end provision (~80-120h one-shot)
4. **CD pipeline**: workflow GitHub Actions deploy.yml con gates (smoke, canary, rollback automatico), blue-green strategy (~40h)
5. **APM + alerting**: Sentry o Datadog (~3-12k EUR/anno) + PagerDuty on-call rotation + Grafana dashboard P95 latency / error rate / DB connection pool (~30h setup + 2 ops hire)
6. **Compliance baseline**: SOC 2 Type 1 readiness (~6 mesi + 30-50k EUR audit), encryption-at-rest end-to-end, vault production-grade (OCI Vault integration completata)
7. **Backup off-site enforced**: bucket cross-region + encryption + restore drill cross-region monthly (~16h + 200 EUR/anno storage)

**Effort totale** ~80-150k EUR + 3-6 mesi calendar + 2 ops hire (L2 SRE + L1 on-call) prima di poter sottoscrivere SLA enterprise commerciale.

## Verdict D5: NEGOTIATE

Fondamenta tecniche serie (ADR-0001 motivata, backup chain verificata, CI quality bar alto, documentazione runbook executable) che dimostrano **founder competente in DevOps** ma posture **strettamente DEV/MVP**. Non è "broken", è "non scalato". Acquirer deve negoziare:

- Riduzione price tag riflettente CAPEX infra hardening (~80-150k EUR + 3-6 mesi opportunity cost)
- Roadmap milestone post-close vincolata (HA entro M+3, off-site backup entro M+1, IaC entro M+6)
- Earnout con clawback se SLA enterprise non raggiungibile entro M+12
- Onboarding immediato L2 SRE per de-risk founder bus factor
