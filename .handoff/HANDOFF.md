# Handoff — heuresys.com.evo (greenfield `heuresys-evo`)

> Updated: 2026-05-04 (Sessione 10 — branch protection + cascade Dependabot + doc audit/alignment + wiki ingest + cross-context CLAUDE.md + S11 plan) · See `PROJECT-STATE.md` for full state · See `PROJECT-LOG.md` for history

## Recap last session

S10 (~3h45min, **13 PR mergeati cleanly via cascade auto-merge**): sessione massiva PR-driven post attivazione branch protection. Operativo: (1) **branch protection attivata su `main`** con 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + linear history + no force push + no deletion (ADR-0019 nuovo), `enforce_admins=false`, `allow_auto_merge=true`, `allow_update_branch=true`; (2) **auto-handoff retention rotation** `--keep-last 50` nel hook `.claude/hooks/auto-handoff.sh` con first rotation 194→50 + backup tarball `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz`; (3) **TXT cleanup Porkbun** verificato (Enzo manuale + my nslookup verify); (4) **Storybook publish CI workflow** su GitHub Pages (URL `https://heuresys.github.io/heuresys-evo/`, `actions/deploy-pages@v4`, build su PR, deploy su main); (5) **8 Dependabot PR mergeati** in cascade auto-merge senza errori CI (incluso Lotto B major: pino-http 10→11, @anthropic-ai/sdk 0.30→0.92, tailwind-merge 2→3); (6) **Doc audit comprehensive S10** (89 file `.md`) + **PR #16 S10 doc alignment** con 16 file fix drift (CLAUDE.md API Gateway NestJS→Express, Prisma 6→5.22, 130+→250 test, ADR-0003/0005 superseded headers, ADR-0017 collision risolta con rename → 0020, ADR-0019 NEW, ADR-0009 npm audit 6→0, ADR-0016 branch protection ENFORCED, README port 3000→3200, Storybook deploy runbook NEW, auto-handoff hook reference aggiornato); (7) **Wiki external ingest selettivo** (PR #17): 6 file foundation imported da `C:\Users\enzospenuso\wiki-space\heuresys-wiki\wiki\` con preservation-focused approach (367 wikilink Obsidian preserved + frontmatter originale + disclaimer + footer source attribution; resolution deferred S11); (8) **Cross-context behavioral layer** `.claude/CLAUDE.md` (PR #18) con 15 regole sanitized del global Enzo per coerenza in tutti i contesti repo (PC/Mac/VM/claude.ai web/Antigravity/cloud); (9) **PR #19 S11 doc consolidation plan** salvato in `.handoff/S11-doc-consolidation-plan.md` (236 righe executable) per pickup automatico inizio S11. CI 3/3 green su tutti i merge. **VM behind di 17 commit**: pull richiesto a fine sessione.

## Priorities for next session (S11)

1. **🆕 Doc consolidation Opt C** (L, ~14h sessione dedicated) — *NEW S10*
   Esecuzione completa del piano in `.handoff/S11-doc-consolidation-plan.md`. Schema target Diátaxis numbered + meta (`_meta`/`10-strategy`/`20-architecture`/`30-developer`/`40-operations`/`50-reference`/`70-planning`/`90-archive`). 13 atomi in 3 fasi (A non-distruttiva 3h, B move bulk 5h, C cleanup link 2h, buffer 4h). Strategia ~6 PR sequenziali in S11.
   Files: tutto `docs/**` + `.claude/rules/doc-placement.md` (NEW) + hook commit-msg + `_meta/doc-architecture.md` (NEW SoT)
   Done when: solo schema canonical respected (`find docs/ -type d -mindepth 1 -maxdepth 1` ritorna esattamente le 8 dir target); zero file `.md` fuori da schema; zero dir vuote; ADR index completo 20 entries; hook commit-msg attivo; ogni dir top-level ha README.md.

2. **Pulire residui post-S10** (XS, ~10min)
   - Gestire CLAUDE.md root modifications pre-S10 ancora stashed (decidere se applicare/discardare)
   - Cancellare `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz` dopo grace period (default 2026-05-11)
   - Cancellare `~/.claude-mem.bak-20260504T0345Z/` dopo grace period (default 2026-05-11)
   Files: nessuno repo
   Done when: 2 backup cancellati, working tree clean.

3. **Sync VM/Mac post-S10** (XS, ~5min utente)
   La VM `oracle-vm-default` è behind di 17 commit dal main S10 (ferma a `ddc31dd` S8). Idem Mac se attivo. Pull manuale richiesto.
   Files: nessuno repo
   Done when: `ssh oracle-vm-default 'cd /home/ubuntu/heuresys-evo && git log -1 --oneline'` ritorna l'HEAD S11 baseline.

## Reminder (declassati, non più priority)

- **Prisma 5.22 → 6.19.2 intermediate vs 7 dedicato** (carry-forward S8 #1, declassato S10): decisione esplicita ancora pendente, deprecation warning continua a comparire nei log build ma non blocca nulla. Bump 6.19.2 = 1-2h low risk. Refactor 7 = 6-8h paradigm shift. Vedi `### Prisma deprecation` in Known issues.

- **Phase 6+ NEW Tier 1 area port** (deferred from strategy MIGRATION_STRATEGY_PET_DRIVEN): prima area completa (`employees/` raccomandata) richiede 6-10h. Da pianificare quando consolidation doc S11 done.

- **P1-P10 canonical formulation** (open issue S10): discrepanza tra CLAUDE.md root (P4 = "Audit logged") vs `governance-evo.md` (P4 = "RLS first"). Da consolidare in S11 sezione doc-architecture.

## Open questions

- **License decision repo public** (carry-forward S9): repo public senza LICENSE = "all rights reserved" implicito. Opzioni: (a) lasciare consapevolmente proprietary protected, (b) LICENSE proprietary "Source-Available, viewable only", (c) OSS license (MIT/Apache). Coerente con SaaS B2B = (a) o (b).
- **ADR renumbering (gap 0019/0020)**: lasciare gap o renumber sequenziale 0001-0019? Da decidere come parte di S11 doc consolidation.
- **next-auth v5 timing**: aspettare release stable (probabilmente Q3-Q4 2026)? Oppure pinnare beta in branch staging come early adopter? *(carry-forward S8)*
- **claude-mem backup pulizia** + auto-handoff backup: snapshot `~/.claude-mem.bak-20260504T0345Z/` (30.59 MB) e `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz` (9KB). Default proposto cancellazione 2026-05-11 (7gg).
- **Phase 5 cutover go/no-go decision** (carry-forward S6): tag `rtg/evo/phase5/ready-for-go-no-go` quando emettere?

### Carry-forward (still open, exploratory)

- (S5) **TOTP step in NextAuth** (Phase 3 task 3.1-3.3 deferred owner-side): non urgente finché non si abilita TOTP per tenant clienti
- (S5) **OAuth providers (Google / Microsoft)**: blocked by next-auth v5 stable
- (S5+) **services/enrichment AI handler reali**: smoke `esco-match` ha hardcoded map, versione vera = pgvector + Anthropic SDK (Phase 6+ NEW Tier 1+)
- (S6) **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): vedi PROJECT-STATE backlog
- (S7) **Brand Studio DB-backed evolution**: schema Prisma `BrandKit` + RLS + RBP area `BRAND_MANAGEMENT`. Utente ha esplicitamente preferito tenerlo dev-tool. Riaprire SOLO se richiesto.
- (S10) **4 file ontologici wiki** (`raw/jsonld/*.jsonld`, `raw/yaml/*.ttl/.rdf`): possibili asset preziosi per ESCO KG, da ispezionare separatamente.

## Known issues

### Webapp / app **P3**

- **`Failed to find Server Action 'x'` nei log app post-deploy**: clienti con build cache vecchia inviano action ID mismatch dopo nuovo deploy. Self-resolve con hard refresh utente (Ctrl+Shift+R). Non urgente.

### Engine / api-gateway **P3**

- _(nessun issue noto attivo)_

### Operational **P3**

- ✅ **Auto-handoff breadcrumbs accumulati** (S10 close): rotation `--keep-last 50` attiva nel hook + first rotation 194→50 eseguita; backup tarball pre-rotation in `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz`.
- ✅ **2 TXT `_acme-challenge.heuresys.com` residui** su Porkbun (S10 close): rimossi manualmente da Enzo, verificato con `nslookup`.
- **claude-mem backup `~/.claude-mem.bak-20260504T0345Z/`** (30.59 MB) da cancellare dopo grace period. Vedi open questions.

### Repository visibility & branch protection **P3 carry-forward S9-S10**

- **Repo è PUBLIC** (`https://github.com/heuresys/heuresys-evo`). Cambio motivato da CI billing exhausted in S9. History pulita verificata con gitleaks (75 commit, 0 leak). Conseguenze:
  - ✅ **Branch protection ATTIVA** (S10): 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + linear history + no force push + no deletion. `enforce_admins=false` (override emergenza). Auto-merge + allow_update_branch enabled.
  - **License assente** (default "all rights reserved"). Vedi open questions.
  - **GitHub Actions illimitate** ora — nessun rischio futuro di billing block.

### Documentation health **P2 NEW S11**

- **Doc audit (S10) ha rivelato caos strutturale** in `docs/`: 67 file su 18 location, 3 schemi naming in conflitto, 5 problemi critici (architecture/ flat vs 20-architecture/ numbered, runbooks/ vs 40-operations/, guides/ vs 30-developer/, cutover/ orphaned post-PET-driven, strategy/ SCREAMING_SNAKE outlier). Plan completo in `.handoff/S11-doc-consolidation-plan.md`. Vedi priority #1 S11.

### Supply chain **P3**

- _(nessun issue noto attivo — 0 vulns confermato anche post Lotto B major: pino-http 11, Anthropic 0.92, tailwind-merge 3)_

### Prisma deprecation **P3 carry-forward**

- **Notice ricorrente nei log build**: prisma 5.22 vs deprecation. Vedi sezione Reminder (declassato S10).

### Phase 5 carry-forward **P1**

- **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): vedi PROJECT-STATE backlog.

## Verification commands

### Local sanity

```bash
git status -sb
# → expected: ## main...origin/main (no further lines)

npm audit
# → expected: found 0 vulnerabilities

NODE_OPTIONS=--max-old-space-size=4096 npx vitest run
# → expected: Test Files  28 passed (28), Tests  250 passed (250)

NODE_OPTIONS=--max-old-space-size=4096 npm run typecheck
# → expected: exit 0, no errors
```

### Login + auth (greenfield, prod live)

```bash
curl -sf https://evo.heuresys.com/api/auth/csrf | head
curl -s https://evo.heuresys.com/api/auth/providers
curl -s -o /dev/null -w "%{http_code}\n" https://evo.heuresys.com/brand-studio
# → expected: 307 (redirect to /login?callbackUrl=...) per anonymous
```

### Domains HTTPS

```bash
for d in evo.heuresys.com www.heuresys.com heuresys.com; do
  echo -n "$d: "; curl -sI -m 5 https://$d/ | head -1
done
# → expected: tutti HTTP/1.1 200 OK
```

### CI status

```bash
gh run list --branch main --limit 3 --json status,conclusion,name
# → expected: 3 entries, all status=completed conclusion=success
```

### Branch protection sanity (S10 NEW)

```bash
gh api repos/heuresys/heuresys-evo/branches/main/protection --jq '{
  strict: .required_status_checks.strict,
  contexts: .required_status_checks.contexts,
  enforce_admins: .enforce_admins.enabled,
  linear_history: .required_linear_history.enabled,
  force_push_blocked: (.allow_force_pushes.enabled | not),
  deletion_blocked: (.allow_deletions.enabled | not)
}'
# → expected: strict=true, 7 contexts, enforce_admins=false,
#             linear_history=true, force_push_blocked=true, deletion_blocked=true
```

### Storybook deploy preview (S10 NEW)

```bash
curl -sI https://heuresys.github.io/heuresys-evo/ | head -1
# → expected: HTTP/2 200
```

### claude-mem sanity

```powershell
echo $env:CLAUDE_MEM_HEALTH_TIMEOUT_MS
# → expected: 300000
```

## How to start the next session

1. **Read this file** (`.handoff/HANDOFF.md`) — get plan + open questions
2. **Read `.handoff/PROJECT-STATE.md`** — get current architecture/components/metrics
3. **Read `.handoff/S11-doc-consolidation-plan.md`** — Priority #1 S11 ha plan executable già pronto (13 atomi, 3 fasi, decision tree, verification commands)
4. **Scan `.handoff/auto/`** for breadcrumbs newer than this HANDOFF mtime
5. **Verify CI status**: `gh run list --branch main --limit 3` — confirm all green
6. **Verify local sanity**: `git status -sb` (should be clean, in sync con origin/main)
7. **Surface to user**: 1-line state recap + top 3 todos + any open questions
8. **Ask**: "Continuiamo dalla todo #1 (Doc consolidation Opt C dal `S11-doc-consolidation-plan.md`), scegli un'altra priorità, o qualcosa di nuovo?"
9. **Wait for user direction** before doing anything else

### Quick context for fresh agents

- Repo: `/home/ubuntu/heuresys-evo` (greenfield, NON `/home/ubuntu/heuresys.com.evo` legacy Docker)
- VM: `oracle-vm-default` (80.225.82.207). **VM behind di 17 commit dopo S10 — pull richiesto a fine sessione**
- Domini in produzione: `https://evo.heuresys.com` (greenfield), `https://www.heuresys.com` + `https://heuresys.com` (legacy)
- DB: PostgreSQL 16 bare-metal su `:5432` (NON containerizzato, ADR-0001)
- Tools dev: vitest 4, npm 11, Node 20, Prisma 5.22 (pending bump 6 or 7)
- **Stack S10**: Next.js 16 + React 19 + Tailwind 4 + **Express 5** + Prisma 5.22 + NextAuth v4. **NESSUN NestJS** (CLAUDE.md root corretto in S10)
- Login dev: `evo.dev / admin123` (hint NON visibile in prod by default, opt-in con `NEXT_PUBLIC_SHOW_DEV_HINT=1`)
- Auth model: NextAuth v4 (v5 deferred), JWT cross-service, cookie `authjs.session-token`
- CI: 3 workflow (CI/Build/Security) + Storybook Deploy (S10 NEW), tutti verdi su `main`
- Repo visibility: **PUBLIC** (flippato S9). Branch protection **attiva** su `main` da S10: 7 required checks + linear history + no force push + no deletion + auto-merge enabled
- GitHub Pages attivo (S10): `https://heuresys.github.io/heuresys-evo/` per Storybook
- npm overrides attivi (S8 final): `postcss^8.5.10`, `uuid^14`, `exceljs.uuid^14`, `next-auth.cookie^0.7`, `@auth/core.cookie^0.7`
- Audit: **0 vulnerabilities** (confermato anche post Lotto B major bumps S10)
- claude-mem: corpus unificato `evo-heuresys`, fix timeout `CLAUDE_MEM_HEALTH_TIMEOUT_MS=300000` attivo
- ADR: 19 attivi + 0020 (renumbered da 0017 collision); ADR-0019 NEW (visibility flip + branch protection); ADR-0003/0005 superseded
- **Doc cross-context**: `.claude/CLAUDE.md` (S10 NEW) embedda 15 behavioral rules sanitized del global per supporto multi-context (PC/Mac/VM/claude.ai web/Antigravity/cloud)
- **Wiki external imported S10**: 6 file foundation in `docs/10-strategy/` + `docs/20-architecture/` + `docs/30-developer/` (367 wikilink preserved, resolution deferred S11)
- **Doc consolidation pending S11**: piano executable in `.handoff/S11-doc-consolidation-plan.md` (~14h, 6 PR sequenziali)
