# S11 Plan — Doc Consolidation (Opt C, ~14h)

> **Created**: 2026-05-04 (S10 close, by audit agent)
> **Target session**: S11 (fresh, dedicated)
> **Estimated effort**: 14h totali (Fase A 3h + B 5h + C 2h + buffer 4h)
> **Risk**: Medio (bulk move + link fix, rischio rotture link interni)
> **Prerequisite**: working tree clean, in sync con `origin/main`, S10 cascade fully merged

## Contesto

Audit S10 (S10 close, 2026-05-04) ha trovato:

- **67 file `.md` su 18 location** in `docs/`
- **3 schemi di naming** convivono (numbered `NN-name`, flat semantic, meta)
- **5 problemi strutturali critici** identificati (vedi sezione sotto)

Problema centrale: doc della stessa classe in subdir diverse (es. `docs/architecture/` + `docs/20-architecture/`, `docs/runbooks/` + `docs/40-operations/`, `docs/guides/` + `docs/30-developer/`) → **caos di placement** che si auto-perpetua.

**Decisione utente (S10)**: niente fix in S10 (sessione già densa con 13 PR). Tutto S11 in scope dedicato.

## Top 5 problemi (riferimento)

| #   | Problema                                                                                                                            | Severity                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| P1  | `docs/architecture/overview.md` flat **vs** `docs/20-architecture/` numbered (8 file)                                               | Critica — doppia SoT                                                           |
| P2  | ~~Collisione ADR-0017 (Cantiere A vs B)~~                                                                                           | ✅ **risolto in S10 PR #16** (rinominato `0020-tenant-ontology-versioning.md`) |
| P3  | Triplicazione `docs/runbooks/` + `docs/40-operations/` + `docs/guides/` (overlapping operational/dev how-to)                        | Alta                                                                           |
| P4  | `docs/cutover/` orphaned (paradigm cutover-event abbandonato post-PET-driven)                                                       | Alta — dead docs                                                               |
| P5  | `docs/strategy/` SCREAMING_SNAKE outlier; `docs/api/` + `docs/glossary/` dir vuote; `docs/glossary.md` + `docs/glossary/` ambiguità | Media — pulizia                                                                |

## Schema target proposto: Diátaxis numbered + meta

```
docs/
├── README.md                      # entry point + decision tree (riscrivere)
├── CONTRIBUTING.md                # workflow + ADR process (mantenere)
│
├── _meta/                         # governance, doc-architecture, glossary
│   ├── governance-evo.md
│   ├── glossary.md                # MOVE da root
│   ├── doc-architecture.md        # NEW — SoT decision tree
│   └── doc-audit-log/             # NEW — snapshot dated
│       └── 2026-05-04-pre-consolidation.md
│
├── 10-strategy/                   # RENAMED da strategy/, kebab-case
│   ├── heuresys-vision.md
│   ├── migration-strategy-pet-driven.md
│   ├── theoretical-foundations.md
│   ├── competitive-landscape.md
│   └── external-frameworks-reference.md
│
├── 20-architecture/               # ATTUALE — autoritativa, expand
│   ├── overview.md                # MOVE da architecture/overview.md (riscritto Express)
│   ├── api-versioning-strategy.md
│   ├── auth-nestjs-pattern.md     # NB: il file dice "nestjs" ma stack reale è Express → rename pattern
│   ├── monorepo-workspace-strategy.md
│   ├── nestjs-module-conventions.md  # idem rename
│   ├── prisma-data-access-pattern.md
│   ├── rls-with-prisma-pattern.md
│   ├── knowledge-graph-esco.md
│   └── cutover-strategy-evo.md
│
├── 30-developer/                  # ATTUALE — how-to + onboarding
│   ├── onboarding.md              # MOVE da guides/onboarding.md
│   ├── dto-validation-with-zod-or-class-validator.md
│   ├── feature-parity-tracking.md
│   ├── nextjs-app-router-conventions.md
│   ├── prisma-migration-workflow.md
│   ├── rbp-data-model.md
│   ├── security-baseline.md       # MERGE guides/security.md + .claude/rules/security.md
│   └── typescript-strict-evo.md
│
├── 40-operations/                 # CONSOLIDATA — operations + runbooks
│   ├── deploy-evo.md
│   ├── db-management-evo.md
│   ├── observability-nestjs.md   # rename → observability-evo.md
│   ├── incident-runbook-evo.md
│   └── runbooks/                  # MOVE intero da docs/runbooks/
│       ├── README.md
│       ├── db-reset.md
│       ├── rollback.md
│       └── storybook-deploy.md   # già aggiunto S10
│
├── 50-reference/                  # NEW — reference material puro
│   ├── api/                       # MOVE da docs/api/ (popolare con OpenAPI)
│   └── decisions/                 # MOVE da docs/decisions/
│       ├── README.md              # AGGIORNARE index 0001-0020
│       ├── 0001-...md ... 0020-tenant-ontology-versioning.md
│
├── 70-planning/                   # ATTUALE — roadmap, parity
│   └── pet-migration-roadmap.md
│
└── 90-archive/                    # NEW — storico read-only
    ├── README.md
    ├── hardening/                 # MOVE intera
    ├── audits/                    # MOVE intera (parity-audit, frontend-strategy-brief)
    ├── test-coverage-baselines/   # MOVE da docs/test-coverage/
    ├── cutover-event-paradigm/    # MOVE intera docs/cutover/ (paradigm dead)
    └── migration-bootstrap/       # MOVE da docs/migration/ (post-bootstrap)
```

## Todo list executable (13 atomi, 3 fasi)

### Fase A (~3h) — non-distruttiva (governance + index + headers)

- [ ] **#1** Verificare ADR-0017 collision già risolta in S10 PR #16 (`0020-tenant-ontology-versioning.md`); rebuild `decisions/README.md` index completo (0001-0020) con superseded headers (atto S10 alignment già fatto in PR #16, ma aggiungere cross-ref tra 0017 e 0020)
- [ ] **#3** Riscrivi `docs/README.md` con: schema numbering, decision tree "dove va una nuova doc?", indice subdir reali (corretto)
- [ ] **#9** Crea `docs/_meta/doc-architecture.md` con schema canonical + decision tree (questo file come seed)
- [ ] **#11** Aggiungi `.claude/rules/doc-placement.md` (decision tree machine-readable per assistant) + hook commit-msg che blocca file `.md` in path non-canonical
- [ ] **#12** Mark `docs/migration/dbms-bootstrap-strategy.md` con header `Status: Historical (2026-05-01 baseline)` o move in `90-archive/`
- [ ] **#13** Verifica tutti i 19+1 ADR con `Supersedes`/`Superseded-by` headers dove mancanti (S10 PR #16 ha aggiunto 0003 + 0005; verificare resto)

### Fase B (~5h) — move bulk (riorganizzazione fisica)

- [ ] **#2** Rimuovi `docs/architecture/`: porta `overview.md` in `20-architecture/overview.md` riscritto **NestJS → Express** (allineato a CLAUDE.md root e ADR-0019)
- [ ] **#4** Move `docs/strategy/*` → `docs/10-strategy/` con rename SCREAMING_SNAKE → kebab-case (5 file: HEURESYS_VISION → heuresys-vision, ecc.)
- [ ] **#5** Move `docs/runbooks/` → `docs/40-operations/runbooks/`; consolidare con `incident-runbook-evo.md`; aggiornare `runbooks/README.md` rimuovendo i 2 file fantasma (`rotate-secrets.md`, `monitoring-bootstrap.md`) o creandoli stub
- [ ] **#6** Move:
  - `docs/guides/onboarding.md` → `docs/30-developer/onboarding.md`
  - Merge `docs/guides/prisma-workflow.md` in `docs/30-developer/prisma-migration-workflow.md` (legacy "db pull" approach come §appendix)
  - Merge `docs/guides/security.md` + `.claude/rules/security.md` → `docs/30-developer/security-baseline.md`
- [ ] **#7** Crea `docs/90-archive/`; sposta intere `hardening/`, `audits/`, `test-coverage/`, `cutover/`, `migration/`; aggiungi `90-archive/README.md` con snapshot date
- [ ] **#8** Rimuovi dir vuote `docs/api/` (o popolare con OpenAPI stub) e `docs/glossary/` (o ridichiarare); move `docs/glossary.md` → `docs/_meta/glossary.md`

### Fase C (~2h) — cleanup link

- [ ] **#10** Aggiorna 100% link interni post-move:
  - `Grep "docs/architecture\|docs/strategy\|docs/runbooks\|docs/guides\|docs/cutover\|docs/migration\|docs/hardening\|docs/audits"` per identificare tutti i file con link obsoleti
  - Bulk fix path con sed/Python script
  - Verificare tutti i link ADR (tipo `docs/decisions/0017-...`) puntino al numero corretto post-renumbering eventuale
  - Update CLAUDE.md root + `.claude/CLAUDE.md` scoped + tutti gli ADR + tutti i runbook

### Buffer (~4h)

- [ ] **Buffer-1** Review consolidation post-Fase B per consistency
- [ ] **Buffer-2** Iterazioni su decision tree machine-readable (atomo #11)
- [ ] **Buffer-3** Eventuali fix link non catturati da grep (es. link con relative path complessi)
- [ ] **Buffer-4** Aggiornare CLAUDE.md root project con reference allo schema canonical + cita `_meta/doc-architecture.md`

## Strategia PR

Per minimizzare conflitti e preservare branch protection (7 required checks per ogni PR):

| PR # in S11 | Scope                                    | Files affected                                                                                                                                                 | Effort |
| ----------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **#A**      | Fase A non-distruttiva                   | `docs/README.md`, `docs/_meta/doc-architecture.md` (NEW), `.claude/rules/doc-placement.md` (NEW), `decisions/README.md`, `migration/*.md` headers, ADR headers | ~3h    |
| **#B1**     | Move strategy + glossary                 | 5 file move + glossary.md move                                                                                                                                 | ~1h    |
| **#B2**     | Move architecture (riscrittura overview) | `architecture/overview.md` → `20-architecture/` + content rewrite Express                                                                                      | ~2h    |
| **#B3**     | Move runbooks + guides + merge security  | runbooks/ → 40-operations/runbooks/; guides/onboarding → 30-developer/; security merge                                                                         | ~2h    |
| **#B4**     | Crea 90-archive + bulk move historical   | 90-archive/ NEW + move hardening/audits/test-coverage/cutover/migration                                                                                        | ~1h    |
| **#C**      | Bulk link fix                            | grep+sed all .md files post-move                                                                                                                               | ~2h    |

Totale ~6 PR sequenziali in S11. Ognuno passa cascade auto-merge.

## Verification post-consolidation

Done when (criteri sessione S11):

```bash
# 1. Solo schema canonical respected
find docs/ -type d -mindepth 1 -maxdepth 1 | sort
# → expected: _meta, 10-strategy, 20-architecture, 30-developer,
#             40-operations, 50-reference, 70-planning, 90-archive

# 2. Zero file .md fuori da schema
find docs/ -name "*.md" | grep -v -E "docs/(README|CONTRIBUTING)\.md$|docs/(_meta|10-strategy|20-architecture|30-developer|40-operations|50-reference|70-planning|90-archive)/"
# → expected: vuoto

# 3. Zero dir vuote
find docs/ -type d -empty
# → expected: vuoto (escluso _meta/doc-audit-log/ se sub-dir designate)

# 4. ADR index completo
grep -c "^| \[" docs/50-reference/decisions/README.md
# → expected: 20 (tutti gli ADR indicizzati)

# 5. Hook commit-msg attivo
test -x .husky/commit-msg && grep -q "doc-placement" .husky/commit-msg
# → expected: 0

# 6. Self-documenting README per ogni dir
for d in docs/*/; do test -f "$d/README.md" || echo "MISSING: $d"; done
# → expected: nessun output (ognuno ha README)
```

## Riferimenti audit

- Audit agent S10 close (2026-05-04 ~16:30 UTC): 67 file, 18 location, 3 schemi naming
- File:line key trovati nell'audit (vedi sezione "Riferimenti file:line key" del report originale):
  - `docs/_meta/migration-doc-audit.md:188` — già flagga drift `docs/architecture/`
  - `docs/decisions/0017-tenant-ontology-versioning.md:6` — auto-confessa collisione (RISOLTO S10 PR #16, ora `0020-`)
  - `docs/decisions/README.md:50-55` — index stale (FIXATO S10 PR #16)
  - `docs/runbooks/README.md:10-11` — referenzia file inesistenti
  - `docs/architecture/overview.md:26-36` — Express stack (NestJS in CLAUDE.md root → contradiction risolta in S10 PR #16, root ora dichiara Express; questo file resta corretto)
  - `docs/cutover/pre-cutover-checklist.md` — paradigm conflict
  - `docs/_meta/governance-evo.md:123` — riferimento doc fantasma `dev-credentials.md`

## Decision tree per nuove doc (Anteprima — sarà finalizzato in `_meta/doc-architecture.md`)

**Q1**: La doc descrive una **decisione** architetturale con alternatives + consequences? → `50-reference/decisions/NNNN-slug.md`

**Q2**: La doc descrive **come funziona** (pattern, topology, schema)? → `20-architecture/<topic>.md`

**Q3**: La doc è **how-to** per chi sviluppa? → `30-developer/<task>.md`

**Q4**: La doc è **operational playbook**? → `40-operations/<area>.md` o `40-operations/runbooks/<scenario>.md`

**Q5**: La doc è **strategia/visione/business**? → `10-strategy/<topic>.md`

**Q6**: La doc è **roadmap forward-looking**? → `70-planning/<plan>.md`

**Q7**: La doc è **glossary/api spec/data dict**? → `50-reference/<type>/`

**Q8**: La doc è **storica** (snapshot, audit, closure)? → `90-archive/<dir>/<file>.md`

**Q9**: La doc è **meta-doc** (governance, doc-architecture)? → `_meta/`

**Naming**: `kebab-case.md` sempre (no SCREAMING, no PascalCase, no snake_case). ADR = `NNNN-kebab-slug.md`.

## How to start S11

```bash
# 1. Pull main aggiornato
git pull origin main

# 2. Verificare working tree clean
git status -sb

# 3. Read this plan + audit report originale
cat .handoff/S11-doc-consolidation-plan.md
# (audit report originale conservato in claude-mem observation S10 4:11p)

# 4. Iniziare con Fase A PR #A (non-distruttiva, lowest risk)
git checkout -b docs/s11-fase-a-governance

# 5. Procedere atomi #1, #3, #9, #11, #12, #13 (vedi todo sopra)
```
