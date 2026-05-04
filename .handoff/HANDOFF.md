# Handoff — heuresys.com.evo (greenfield `heuresys-evo`)

> Updated: 2026-05-04 (Sessione 9 — claude-mem tooling maintenance, no project code touched) · See `PROJECT-STATE.md` for full state · See `PROJECT-LOG.md` for history

## Recap last session

S9 (~50min, **0 commit, 0 file repo modificati**): sessione 100% out-of-band sul sistema memoria claude-mem (Windows-side, fuori repo). Operativo: (1) verificato che il fix `CLAUDE_MEM_HEALTH_TIMEOUT_MS=300000` di S8 governa anche `query_corpus` non solo health check; (2) costruito secondo corpus `heuresys-evo-prehistory` per recuperare le 179 obs siloed sotto vecchio slug `heuresys.com.evo` (era working dir pre-rename `D:\heuresys-com-evo`); (3) **rename atomica SQL** `heuresys.com.evo` → `evo.heuresys.com` su 3 tabelle SQLite (231 righe totali: observations 179, session_summaries 48, sdk_sessions 4) con snapshot pre-op `~/.claude-mem.bak-20260504T0345Z/` (30.59 MB); (4) cancellato corpus stale + rebuild corpus unificato `evo-heuresys` ora a 245 obs / 97k token / range Apr 28 → May 4. Test cross-period query OK. **Repo intoccato**, CI invariato 3/3 green su `ddc31dd`. Tutte le 5 todo S8 restano aperte.

### S9 addendum (post-handoff)

Push del commit S9 (`3bf0aa8`) ha trovato CI bloccata da **GitHub Actions billing exhausted** (job killed in 2s con messaggio "recent account payments have failed or your spending limit needs to be increased"). Risolto rendendo **repo pubblico** dopo pre-check sicurezza (gitleaks scan completo: 75 commit, 0 leak nella history, working tree pulito a parte node_modules false positives). Repo ora `https://github.com/heuresys/heuresys-evo` PUBLIC, GHA illimitate. 3 workflow re-run su `3bf0aa8` → tutti **success**. Conseguenze da gestire prossima sessione: license decision + branch protection setup (vedi priority #2 e open questions).

## Priorities for next session

1. **Pulire 2 record TXT `_acme-challenge.heuresys.com`** residui su Porkbun (XS, ~5min) — *carry-forward S8 #3*
   Innocui ma sporchi (vecchio DNS-01 challenge da cert ECDSA). Rimuoverli da Porkbun dashboard.
   Files: nessuno (azione DNS console-side)
   Done when: `dig TXT _acme-challenge.heuresys.com +short` restituisce vuoto.

2. **Review + merge Dependabot PRs** (S, ~30min) — *carry-forward S8 #4*
   4-5 PR aperti su Storybook / Anthropic SDK / pino-http. Verificare CHANGELOG, test pass, merge.
   Files: dipende dai PR aperti
   Done when: backlog Dependabot a 0 o motivata chiusura WONTFIX.

3. **Storybook publish CI** (M, ~2h) — *carry-forward S8 #5*
   84 stories pronte ma nessun deploy preview. Aggiungere job GitHub Actions che builda `storybook-static/` e pubblica su Chromatic OR su gh-pages OR Vercel preview URL.
   Files: nuovo `.github/workflows/storybook.yml`, eventualmente `packages/ui/package.json` script
   Done when: PR con storybook job verde, preview URL accessibile (anche dietro auth se serve).

## Reminder (declassati, non più priority)

- **Prisma 5.22 → 6.19.2 intermediate vs 7 dedicato** (carry-forward S8 #1, declassato S10): decisione esplicita ancora pendente, deprecation warning continua a comparire nei log build ma non blocca nulla. Bump 6.19.2 = 1-2h low risk (drop Node 16, schema/generator invariati). Refactor 7 = 6-8h paradigm shift (`prisma.config.ts` + `@prisma/adapter-pg` + refactor singleton). Vedi `### Prisma deprecation` in Known issues + Open questions per dettagli completi.

## Open questions

- **Prisma: 6.19.2 intermediate o aspettare 7 dedicata?** Bump 6 è low risk 1-2h, 7 è 6-8h refactor. Compromesso o aggressive? *(carry-forward S8)*
- **next-auth v5 timing**: aspettare release stable (probabilmente Q3-Q4 2026)? Oppure pinnare un beta release specifico in branch staging come early adopter? *(carry-forward S8)*
- **Auto-handoff backup grace period**: snapshot pre-rotation `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz` (9KB, 192 file storici) — analogo claude-mem.bak, default proposto cancellazione 2026-05-11 (7gg).
- **Phase 5 cutover go/no-go decision** (carry-forward S6): tag `rtg/evo/phase5/ready-for-go-no-go` quando emettere?
- **claude-mem backup pulizia**: il snapshot `~/.claude-mem.bak-20260504T0345Z/` (30.59 MB) può essere cancellato dopo X giorni di uso senza problemi. Quando? Default proposto: 7 giorni → cancellazione 2026-05-11.
- **🆕 License decision** (S9 addendum): repo ora public senza LICENSE → "all rights reserved" by default (codice visibile ma non legalmente riusabile). Decisione esplicita migliore di default. Opzioni: (a) lasciare consapevolmente (proprietary protected), (b) aggiungere LICENSE proprietary tipo "Source-Available, viewable only", (c) open source license (MIT/Apache) se vuoi contribuzioni esterne. Coerente con SaaS B2B = (a) o (b).

### Carry-forward (still open, exploratory)

- (S5) **TOTP step in NextAuth** (Phase 3 task 3.1-3.3 deferred owner-side): non urgente finché non si abilita TOTP per tenant clienti
- (S5) **OAuth providers (Google / Microsoft)**: blocked by next-auth v5 stable
- (S5+) **services/enrichment AI handler reali**: smoke `esco-match` ha hardcoded map, versione vera = pgvector + Anthropic SDK (Phase 6)
- (S6) **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): vedi PROJECT-STATE backlog
- (S7) **Brand Studio DB-backed evolution**: schema Prisma `BrandKit` + RLS + RBP area `BRAND_MANAGEMENT`. Utente ha esplicitamente preferito tenerlo dev-tool. Riaprire SOLO se richiesto.

## Known issues

### Webapp / app **P3**

- **`Failed to find Server Action 'x'` nei log app post-deploy**: clienti con build cache vecchia inviano action ID mismatch dopo nuovo deploy. Self-resolve con hard refresh utente (Ctrl+Shift+R). Non urgente.

### Engine / api-gateway **P3**

- _(nessun issue noto attivo)_

### Operational **P3**

- ✅ **Auto-handoff breadcrumbs accumulati** (S10 close): rotation `--keep-last 50` attiva nel hook + first rotation 194→50 eseguita; backup tarball pre-rotation in `~/.handoff-archive/heuresys-evo/auto-S10-20260504T132402Z.tar.gz`.
- **2 TXT `_acme-challenge.heuresys.com` residui** su Porkbun. Vedi priority #1.
- **claude-mem backup `~/.claude-mem.bak-20260504T0345Z/`** (30.59 MB) da cancellare dopo grace period. Vedi open questions.

### Repository visibility **P3 carry-forward S9**

- **Repo è ora PUBLIC** (`https://github.com/heuresys/heuresys-evo`). Cambio motivato da CI billing exhausted in S9. History pulita verificata con gitleaks (75 commit, 0 leak), nessuna esposizione di secret. Conseguenze:
  - ✅ **Branch protection attiva** (S10 close): 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + linear history + no force push + no deletion. `enforce_admins=false` (override emergenza disponibile). Verificabile con `gh api repos/heuresys/heuresys-evo/branches/main/protection`.
  - **License assente** (default "all rights reserved"). Vedi open questions.
  - **GitHub Actions illimitate** ora — nessun rischio futuro di billing block.

### Supply chain **P3**

- _(nessun issue noto attivo — 0 vulns)_

### Prisma deprecation **P3 carry-forward**

- **Notice ricorrente nei log build**: prisma 5.22 vs deprecation. Vedi sezione Reminder (declassato S10).

### Phase 5 carry-forward **P1**

- **STOP-AUTONOMO-FINAL pre-5.12 go/no-go decision** (BLOCK 14 cutover-prep): vedi PROJECT-STATE backlog. Sblocca cutover legacy → greenfield real-traffic.

## Verification commands

### Local sanity

```bash
# clean working tree, in sync con origin
git status -sb
# → expected: ## main...origin/main (no further lines, eccetto eventuale M CLAUDE.md non committato)

# 0 vulns
npm audit
# → expected: found 0 vulnerabilities

# 250 test green via root vitest (S8 fix)
NODE_OPTIONS=--max-old-space-size=4096 npx vitest run
# → expected: Test Files  28 passed (28)
#             Tests  250 passed (250)

# typecheck CI command
NODE_OPTIONS=--max-old-space-size=4096 npm run typecheck
# → expected: exit 0, no errors
```

### Login + auth (greenfield, prod live)

```bash
curl -sf https://evo.heuresys.com/api/auth/csrf | head
# → expected: JSON with csrfToken (use GET, not -I/HEAD which returns 400)

curl -s https://evo.heuresys.com/api/auth/providers
# → expected: JSON con credentials provider

curl -s -o /dev/null -w "%{http_code}\n" https://evo.heuresys.com/brand-studio
# → expected: 307 (redirect to /login?callbackUrl=...) per anonymous
```

### Dev hint S8 verification

```bash
# Anonymous /login should NOT show "Dev seed: evo.dev / admin123" (running prod build)
curl -s https://evo.heuresys.com/login | grep -c "evo.dev"
# → expected: 0 (verified S8 — d034a81 deployato e attivo su VM)
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

### Prisma drift

```bash
cd services/app && npx prisma migrate status
# → expected: "The current database is not managed by Prisma Migrate."
#             (baseline-only setup, intentional, see ADR-0001)
```

### claude-mem sanity (S9 maintenance verification)

```powershell
# Env var must be inherited (Option B fix)
echo $env:CLAUDE_MEM_HEALTH_TIMEOUT_MS
# → expected: 300000

# Single unified slug — no residue from rename
python -c "import sqlite3; c=sqlite3.connect(r'C:\Users\enzospenuso\.claude-mem\claude-mem.db'); print(c.execute(\"SELECT project, COUNT(*) FROM observations WHERE project LIKE '%heuresys%' OR project LIKE '%evo%' GROUP BY project\").fetchall())"
# → expected: [('evo.heuresys.com', 245+)]  (single tuple, count growing)
```

## How to start the next session

1. **Read this file** (`.handoff/HANDOFF.md`) — get plan + open questions
2. **Read `.handoff/PROJECT-STATE.md`** — get current architecture/components/metrics
3. **Scan `.handoff/auto/`** for breadcrumbs newer than this HANDOFF mtime — surface any post-handoff state
4. **Verify CI status**: `gh run list --branch main --limit 3` — confirm all green
5. **Verify local sanity**: `git status -sb` (should be clean, in sync con origin/main)
6. **Surface to user**: 1-line state recap + top 3 todos + any open questions
7. **Ask**: "Continuiamo dalla todo #1 (TXT cleanup Porkbun, XS), scegli un'altra priorità, o qualcosa di nuovo?"
8. **Wait for user direction** before doing anything else

### Quick context for fresh agents

- Repo: `/home/ubuntu/heuresys-evo` (greenfield, NON `/home/ubuntu/heuresys.com.evo` legacy Docker)
- VM: `oracle-vm-default` (80.225.82.207), Ubuntu 24.04 ARM64, systemd-managed
- Domini in produzione: `https://evo.heuresys.com` (greenfield), `https://www.heuresys.com` + `https://heuresys.com` (legacy)
- DB: PostgreSQL 16 bare-metal su `:5432` (NON containerizzato, ADR-0001)
- Tools dev: vitest 4, npm 11, Node 20, Prisma 5.22 (pending bump 6 or 7)
- Login dev: `evo.dev / admin123` (hint NON visibile in prod by default, opt-in con `NEXT_PUBLIC_SHOW_DEV_HINT=1`)
- Auth model: NextAuth v4 (v5 deferred, ancora beta), JWT cross-service, cookie `authjs.session-token`
- CI: 3 workflow (CI/Build/Security), tutti verdi su `main` (ultimo: `3bf0aa8` da S9 post-flip-public re-run)
- Repo visibility: **PUBLIC** (flippato 2026-05-04 in S9). Branch protection **attiva** su `main` da S10: 7 required checks (`lint`, `typecheck`, `test`, `build-workspaces`, `gitleaks`, `semgrep`, `npm-audit`) + linear history + no force push + no deletion.
- Brand Studio: `/brand-studio` accessibile a `SUPERUSER` autenticati, scrive `services/app/src/styles/active-theme.css`
- npm overrides attivi (S8 final): `postcss^8.5.10`, `uuid^14`, `exceljs.uuid^14`, `next-auth.cookie^0.7`, `@auth/core.cookie^0.7`
- Audit: **0 vulnerabilities**
- claude-mem: corpus unificato `evo-heuresys` (245 obs, slug `evo.heuresys.com`); fix timeout `CLAUDE_MEM_HEALTH_TIMEOUT_MS=300000` attivo. Vedi `~/.claude/projects/D--evo-heuresys-com/memory/reference_claude_mem_timeout_fix.md`.
