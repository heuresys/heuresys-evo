# Handoff — heuresys.com.evo

> Updated: 2026-05-01 (RTG Phase 3 task 3.4 — packages/shared test coverage) · See `PROJECT-STATE.md` for full state · See `PROJECT-LOG.md` for history

## Recent changes

**RTG Phase 4 BLOCK 9 parity audit + STOP-AUTONOMO-1 scope cut** (~25 min, 2026-05-01): `docs/audits/parity-audit-2026-05-01.md`. Enumera gap legacy → evo per 6 domini (routes 132 missing, RLS 303 da portare, RBP 100% gap, dashboards 100% gap, ESCO/NACE schema present data verify pending). **Gap P0+P1 = 237 > 50 threshold** → trigger STOP AUTONOMO 1: scope cut a P0-only applicato. Phase 4 ridotta a 5 task essential (4.8 RBP 5 aree + 4.9 RLS 50 critical + 4.10 5-10 endpoint + 4.11 ESCO+NACE + 4.14 retro), effort residuo 8.75gg vs 14gg full. ADR-0002 promote naturalmente collocato in 4.10 quando arriva primo integration test con testcontainers+pgvector. BLOCK 9 chiuso. Carry-forward BLOCK 10 (4.8 RBP port).

**RTG Phase 3 task 3.13 retro (Phase 3 PARTIAL-DONE)** (~15 min, 2026-05-01): full retrospective in `.handoff/PHASE3-RETRO.md`. Phase 3 chiude **10/13 = 77%** done: 3.4-3.11 done, 3.12 N/A, 3.1-3.3 (TOTP) owner-deferred. Total tests delivered: 123. Effort estimate vs actual: 8-12 dev-days plan → ~3h wall-clock single autonomous session. Lessons captured: refactor-for-testability è cheap (auth.ts authorize → authorizeCredentials), honor-the-ADR over RTG checklist (ADR-0002 promote deferred), pin coverage tools to host version, RTL 16 needs manual afterEach(cleanup) in vitest 2. Phase 3 NON closed (gate "all tasks done"); Phase 4 unblocked anyway (TOTP independent from parity).

**RTG Phase 3 tasks 3.11+3.12 DX cleanup** (~10 min, 2026-05-01): rename `services/app/src/middleware.ts` → `proxy.ts` (Next 16 file convention deprecation, codemod path verified via Next.js docs), aggiornati 3 comment refs (proxy.ts header, auth.config.ts, auth.ts). Default export `auth(...)` invariato. Typecheck silent, 12 test app passing. **3.12 N/A**: `~/.claude/plans/noble-dazzling-gizmo.md` non esiste (20 plan files, nessuno con questo basename) — file probabilmente archiviato/rinominato in sessione precedente, decisione documentata nel doc-commit log. Carry-forward 3.13 (Phase 3 retro = chiusura BLOCK 8).

**RTG Phase 3 tasks 3.9+3.10 services/enrichment scaffold + smoke handler** (~40 min, 2026-05-01): da stub README-only a worker scaffold completo. Deps: BullMQ 5.13, ioredis 5.4, @anthropic-ai/sdk 0.30, Pino 10, Zod. Struttura `src/{queues,handlers,clients,types}/`. Handler smoke `esco-match` con hardcoded map (Phase 4 4.11 lo rimpiazza con pgvector). 7 unit test passing, tsc --noEmit silent. Worker bootstrap con SIGINT/SIGTERM. Carry-forward 3.11 (rename middleware → proxy.ts), 3.12 (plan file update), 3.13 (Phase 3 retro).

**RTG Phase 3 task 3.8 coverage baseline + ADR-0002 promote DEFERRED** (~15 min, 2026-05-01): @vitest/coverage-v8 2.1.9 installato in 4 workspace, allineato a vitest 2.1.9 (peer mismatch fix). Coverage Stmts: shared 86.6, api-gateway 42.85, app 46.53, ui 94.7. Report aggregato: `docs/test-coverage/baseline-2026-05-01.md`. **ADR-0002 NOT promoted**: l'ADR è su testcontainers DB integration, non unit test — promozione richiede primo `*.integration.test.ts` con container Postgres+pgvector. Riposizionato al Phase 4 task 4.10 (endpoint port). BLOCK 7 chiuso 4.5/5 (3.8 ADR parte deferred per honor-the-ADR).

**RTG Phase 3 task 3.7 packages/ui component tests** (~30 min, 2026-05-01): vitest 2.1.9 + RTL 16.3 + jest-dom 6.9 + jsdom 29 + @vitejs/plugin-react in devDep packages/ui. `vitest.config.ts` jsdom env + setup file `src/__tests__/setup.ts` con cleanup() afterEach + jest-dom matchers. 29 component test in `src/components/__tests__/`: 12 Button (variants × 5, size, asChild Slot, aria-label, disabled), 5 Card composition, 7 Input (type/variants/size/placeholder/disabled/onChange), 5 Toast Radix wrapper. **All 29 passing**. Carry-forward 3.8 (ADR-0002 promote + aggregate coverage report).

**RTG Phase 3 task 3.6 services/app authorize unit tests** (~25 min, 2026-05-01): vitest 2.1.9 setup in services/app, refactor minore `src/lib/auth.ts` authorize callback → estratta come `authorizeCredentials()` in `src/lib/authorize.ts` (pure function: prisma+bcrypt iniettati). 12 unit test in `src/lib/__tests__/authorize.test.ts` — null handling, user-not-found, sentinel password_hash post-mig216, bcrypt mismatch, tenantId via employee, DEFAULT_SUPERUSER_TENANT_ID fallback, orphan employee, role default EMPLOYEE, soft-delete filter is_active+deleted_at. **All 12 passing**, typecheck silent. Middleware redirect logic deferred (jsdom + NextAuth mock complexity > value). Carry-forward 3.7 (packages/ui).

**RTG Phase 3 task 3.5 services/api-gateway contract test /employees** (~25 min, 2026-05-01): vitest 2.1.9 + supertest 7 in devDep, `vitest.config.ts` con coverage v8. 12 contract test in `src/routes/__tests__/employees.test.ts` con mock `withTenant()` (fixture EcoNova 2 employee + RTL Bank 4 employee). Verificato: 401 anonim, 400 tenant_required, RLS isolation via session.tenantId, X-Tenant-Id fallback dev override, session-precedence-over-header (defense-in-depth), validation Zod (limit>100/cursor non-uuid → 400 via errorHandler), pagination nextCursor/total. **All 12 passing**. Carry-forward 3.6 (services/app NextAuth signin), 3.7 (packages/ui jsdom env).

**RTG Phase 3 task 3.4 packages/shared Zod test coverage** (~30 min, 2026-05-01): vitest 2.1.9 scaffolded as `packages/shared` devDep, `vitest.config.ts` created with v8 coverage provider, `package.json` scripts `test`/`test:watch`/`test:coverage` wired. **70 test passing across 4 files** in `src/{schemas,auth}/__tests__/`: 18 employee.zod (parse valid/invalid, defaults, status enum, picked/list response), 15 auth.zod (login credentials, TOTP challenge 6-digit regex, recovery code, JWT payload, discriminated union), 25 tenant-user.zod (subscription/size/status enums, picked/omitted subsets, soft-delete), 12 role.test (hierarchy hasRole, isPlatformAdmin/isTenantAdmin/isHrLead). Doc-commit log emitted on `.com.evo` with signature `[RTG-E][PH3-T4]`. **Effort estimate 0.75gg** vs actual ~30 min — pattern: vitest scaffold light when zod schemas are pure data (no async, no network). Carry-forward 3.5/3.6/3.7 for api-gateway, app, ui workspaces.

## Recap last session(s)

**S6 Bucket-as-DB-git architecture revision** (~6h, 2026-04-29): rivisto modello DBMS per i prossimi mesi. **PC = SoT primario**; OCI bucket `heuresys-evo-backups` = "git del database" (latest.dump = HEAD, dump_<source>_<TS>.dump = storico). 3 DBMS live unificati allo schema `.evo` (203 mig, max_v=222 con NextAuth): PC Docker (5432, SoT), VM Docker (5433, riallineato via drop+restore da bucket), VM bare-metal (5432, era già `.evo`). Container PC v1 (port 5433) **eliminato** (ridondante). WD `~/heuresys-evo` = read-only (riceve pull, non pubblica). Workflow `evo-db {pull|push|status|history}` con soft-lock (version stamp), retention bucket native 30gg. OCI CLI installato sul PC. Cron VM check-freshness rimosso, Task Scheduler PC Heuresys-Evo-Sync rimosso. `backup-and-rotate.sh` demoted a nightly safety snapshot (no latest.dump promotion). Tutto verificato end-to-end. **6 nuovi script** (oci-config + db-{push,pull,status,history} + evo-db wrapper), **6 script deprecated** con banner (rimozione 2026-05-31).

**S4-bis tooling micro-session** (~45 min, post-S4): installato e attivato due tool memory complementari. **claude-mem v12.4.7** plugin (`thedotmack/claude-mem`) — memory compression cross-session via SQLite + Chroma vector DB, worker su `http://localhost:37777` (UI web), slash `/mem-search` in Claude Code. Bun 1.3.13 installato come dipendenza runtime del worker. **claude-hud activity lines** integrate nello `statusline-command.sh` esistente (preservando le 4 righe metrics-centric custom + appendendo 1-3 righe condizionali tools/agents/todos). CLAUDE.md esteso con Bootstrap step 0 (acknowledge claude-mem auto-injection) + sezione "Memory & tooling". Backups in place. Commit `f6591da`. Memory systems coesistono pulito: `.handoff/` curated SoT, claude-mem auto-compressed backdrop.



Sessione 4 ha **chiuso 4 priority del HANDOFF S3** in single session: A6 mig 222 NextAuth tables (90 righe SQL, applied su VM, smoke `\d` green), A4 packages/ui design system + Storybook 9 Vite-framework con 4 componenti (Button/Card/Input/Toast con cva, Storybook build 7.87s, smoke import in marketing OK), A3 services/api-gateway Express 5 + Prisma 5 + @auth/express con `/health` + `/employees` paginated RLS-aware (E2E green: EcoNova=26 / RTL Bank=158 — RLS isolation working), A5 services/app + NextAuth v5 + dashboard cross-service (login DB-bcrypt → JWT → cookie shared con api-gateway → /dashboard fetcha employees con tenant isolation). 6 commit puliti, 17K+ insertions, working tree clean. 4 ADR (3 Accepted). **Cross-service authenticated session funzionante end-to-end** — pattern non documentato out-of-the-box ma replicabile (shared AUTH_SECRET + default cookie name + complementary session callbacks). Mid-session Enzo ha codificato un autonomous-execution mandate in CLAUDE.md (no `Approvi?` checkpoints, no scope cuts, gate-driven verify-fix cycles up to 3-5 retries) + framework Workflow Orchestration; mirrored in memory `feedback_autonomous_execution.md`. 2 verify-fix cycles non banali risolti in A5: Prisma client overwrite cross-workspace (output isolato per service) + Edge-runtime fail su middleware (split `auth.config.ts` Edge-safe + `auth.ts` full).

## Priorities for next session

1. **TOTP step in `services/app` Credentials.authorize** (M, ~2-3h)
   Estende il flow auth con passo 2FA: decrypt `users.totp_secret_encrypted` (AES-256-GCM) + verify con `otplib.authenticator.check(token, secret)`. Pattern Auth.js v5 multi-step credentials: l'authorize ritorna user solo se entrambi password + TOTP token validi. **Prerequisito**: chiave AES (vedi Open questions). Toccare `src/lib/auth.ts` (extend Credentials), `prisma/schema.prisma` (verifica colonne totp_*), eventualmente nuovo step UI in `/login`.
   **Done when**: signin con `evo.dev` (no TOTP) continua a passare; signin con un user con `totp_enabled=true` richiede TOTP token; integration test lo verifica in entrambi i path.

2. **Test coverage base** (L, ~4-6h)
   Vitest scaffold è pronto in tutti i workspace ma 0 test scritti. Priority order:
   - `packages/shared` — unit Zod schemas (parse + roundtrip + invalid cases)
   - `services/api-gateway` — contract test `/employees` (200 with valid auth, 401 anon, 400 no tenant, RLS isolation EcoNova vs RTL Bank), `/health`
   - `services/app` — server action signin con mock Prisma, middleware redirect logic
   - `packages/ui` — component render + variant smoke tests (Vitest + @testing-library/react)
   **Done when**: `npm run test` ritorna 0 da root con almeno 30 test passing (10 per workspace × 3 workspace +); coverage report disponibile (vitest --coverage); ADR-0002 promosso da Proposed a Accepted.

3. **services/enrichment scaffold** (XL, multi-session — start in S5, complete in S6)
   Worker BullMQ + Anthropic SDK + MCP client. Structure: `src/index.ts` worker bootstrap, `src/queues/{enrichment,validation}.ts`, `src/handlers/{esco-match, llm-validate, merge-commit}.ts`, `src/clients/{anthropic, mcp}.ts`, `prisma/schema.prisma` (allowlist enrichment_jobs/matches/merges). Mantiene il pattern `prune-prisma-schema.sh` + isolated client. Consuma `@heuresys/shared` per types.
   **Done when in S5**: package.json + scaffold strutturale + 1 handler smoke che processa 1 job enrichment fittizio dalla queue → scrive risultato in DB → log via Pino. Full implementation E2E continua in S6.

4. **DX cleanup batch** (S, ~30 min totale)
   Rename `services/app/src/middleware.ts` → `proxy.ts` (Next 16 deprecation). Update plan file `~/.claude/plans/noble-dazzling-gizmo.md` markando A1-A6 chiusi. Promote ADR-0002 → Accepted dopo primo integration test (depends on priority #2).

> Effort scale: S (≤30 min) · M (~1-3h) · L (~3-6h) · XL (>6h, multi-session)

## Open questions

- **Sorgente chiave AES per TOTP decrypt** (BLOCCANTE priority #1): la baseline ha `users.totp_secret_encrypted` cifrata AES-256-GCM con chiave del v1. Strategy possibili:
  - (a) Recuperare chiave AES dal v1 stack (env var, vault, source code) e iniettarla in `services/app/.env.local` come `TOTP_ENCRYPTION_KEY`
  - (b) Re-encrypt: backfill SQL che decifra con chiave v1 e ri-cifra con nuova chiave generata. Richiede possedere ancora la chiave v1 + 1 user con totp_enabled
  - (c) Skip TOTP per ora, accettare auth bcrypt-only fino a quando l'utente non chiede esplicitamente
  Decisione operativa all'inizio S5 dopo input utente sulla disponibilità della chiave v1.
- **Brand definition per design tokens** in `packages/ui` (`globals.css` `@theme`): tokens placeholder (oklch generici). Prima di pushare `services/app` in produzione, serve palette + typography + spacing definitivi. Non bloccante per dev, bloccante per "release-ready".
- **NextAuth v5 GA**: pinned a `5.0.0-beta.31`. Monitorare quando GA esce; allora `npm view next-auth versions --json | tail -3` e repin. Se GA ha breaking, valutare se restare su beta-31 o migrare.
- **`services/app/src/middleware.ts` rename a `proxy.ts`** (Next 16 deprecation): cosmetic, ma rumore in dev log. Schedulare in DX cleanup priority #4.
- **Bun PATH propagation cross-shell**: l'installer ha aggiornato la User env var Windows. La shell bash di Claude Code potrebbe non vederlo immediatamente; se il worker claude-mem non parte al next bootstrap, fare `setx PATH "%PATH%;C:\Users\enzospenuso\.bun\bin"` da PowerShell + restart Claude Code. Persistente.
- **claude-mem cross-machine sync** (carry-forward, exploratory): `~/.claude-mem/` è per-machine. Lavoro PC + Mac avrebbe memorie separate. Workaround `rsync` rischia DB lock. Decisione differita finché non diventa friction reale.

### Carry-forward (still open, exploratory)


### Frozen / reminders only

- 🧊 **GitHub repo creation** (frozen 2026-04-27) — `.evo` resta solo locale + sync VM via rsync. NON proporre push/repo creation. Reminder solo se utente chiede esplicitamente.

## Known issues

### Application / DevX

- **P3 NEW S4** Next 16 deprecation warning per `services/app/src/middleware.ts` (rename a `proxy.ts`). Functionality unchanged, scheduled in DX cleanup priority #4.
- **P3 NEW S4-bis** claude-mem comprime tutto il transcript in SQLite locale `~/.claude-mem/`, include eventuali secret/`.env` content emersi durante lavoro. Localhost-only ma se mai si fa backup a shared storage, contiene material sensibile. NOT to be committed (lives outside repo). NOT to be backed up to cloud / Git LFS / shared drives.
- **P3 NEW S4-bis** claude-mem 6 lifecycle hooks (tipico ~50-200ms cad. via worker locale) potrebbero rallentare leggermente sessioni tool-heavy (~40 tool calls/min). Da monitorare. Mitigation: disable plugin temporaneamente se necessario via `~/.claude/settings.json` `claude-mem@thedotmack: false`.
- **P3 OPEN S2** 2 transitive postcss vulnerabilities moderate. Non-fixable senza downgrade Next 16, monitoring only.
- **P3 OPEN S3** `npm install` failure intermittente (Bash tool no-output error). Workaround: retry con `--workspace=<name>`. Non riproducibile.

### Auth / Security

- **P3 NEW S4** `services/api-gateway` Credentials provider stub (admin/admin in `src/auth.ts`) — destinato a essere superseded dal flow di services/app via shared cookie. Lasciato attivo per dev-only direct gateway test. Document risk: chiunque può bypassare auth se gateway è esposto pubblicamente. Mitigation: in production, disabilitare il provider stub o restringere a localhost.
- **P3 NEW S1** Migration 221 non applicata, 1 user con plain TOTP secret. Backfill richiesto.

### Database / Operational

- **P2 OPEN S1** Off-VM backup ora via OCI bucket. Lifecycle policy 30-day pending IAM.
- **P3 NEW S2** OCI lifecycle policy 30-day blocked by `InsufficientServicePermissions` for `objectstorage-eu-milan-1` service principal. Mitigation: rotation manuale via `oci os object delete` se serve.
- **P3 NEW S1** Container `heuresys_evo_enrichment` (VM v1) status `Up 8 days (unhealthy)` — preesistente, ereditato dal v1.

### Repo / Filesystem

- **P3 NEW S1** Cancellato per errore il repo v1 su VM con `rm -rf` durante setup `.evo`, recuperato via `git clone` da GitHub. Lezione documentata in memory.
- **P3 NEW S1** Tar pipe da Git Bash su Windows con `cd` ha bug intermittente. Workaround: `tar -C <abs-path>` esplicito.
- **P3 NEW S2** Bash tool (Claude Code CLI) `cd` è persistente cross-call nello stesso shell session. Workaround: usa path assoluti.
- **P3 NEW S4** rsync non disponibile in Git Bash su Windows. Workaround: scp per single-file sync, alternativa winrsync per bulk.

### Documentation

- **P3** ADR-0002 status `Proposed` — diventerà `Accepted` quando il primo test integration sarà scritto (priority #2).
- **P3 OPEN S3** Runbook `docs/runbooks/auth-rls.md` (mancante) — da scrivere post-A5 quando il pattern `withTenant()` è validato in produzione (priority #2 follow-up).

> Severity scale: P0 blocker · P1 high (next session) · P2 medium · P3 low (later)

## Verification commands

### Repo state

```bash
cd D:/heuresys.com.evo
git log --oneline | head -10
# → expected: <handoff S4-bis>, f6591da (claude-mem awareness), 7de4386 (handoff S4),
#             dc55547 (app), 97070c3 (claude workflow), 34ddbc8 (claude autonomy),
#             d22dcb6 (api-gateway), d619147 (ui), 78329b2 (mig 222), ...
git status --short
# → expected: clean
```

### claude-mem worker + UI

```bash
# Bun must be on PATH; if not, prepend:
export PATH="/c/Users/enzospenuso/.bun/bin:$PATH"

npx claude-mem status
# → expected: "Worker is running, PID: <n>, Port: 37777"

curl -s -o /dev/null -w "http=%{http_code}\n" http://localhost:37777
# → expected: http=200
# Open browser http://localhost:37777 to inspect memories
```

### Workspaces typecheck

```bash
cd D:/heuresys.com.evo
npm run typecheck --workspaces --if-present
# → expected: shared/api-gateway/app silent (exit 0)
```

### DBMS bucket workflow (post 2026-04-29 — Bucket-as-DB-git)

```bash
# Stato locale + bucket (read-only)
bash db/scripts/evo-db status
# → expected: target=pc-docker, schema_migrations=203/222_nextauth_tables, bucket latest.dump time-modified

# Storico bucket
bash db/scripts/evo-db history
# → expected: tabella oggetti sorted by date

# Inizio sessione (se bucket più recente del local stamp)
bash db/scripts/evo-db pull
# → expected: download latest.dump + restore + smoke checks 9/9 green

# Fine sessione (con scritture)
bash db/scripts/evo-db push
# → expected: pg_dump + upload + promote latest.dump + .last-pull-stamp aggiornato
```

### Cross-service auth flow (E2E)

```bash
# 1. Start both servers in separate terminals
cd D:/heuresys.com.evo
npm run dev --workspace=@heuresys/api-gateway   # → :8200
npm run dev --workspace=@heuresys/app           # → :3200

# 2. Login + dashboard end-to-end
rm -f /tmp/jar.txt
curl -s -c /tmp/jar.txt http://localhost:3200/api/auth/csrf > /dev/null
CSRF=$(curl -s -b /tmp/jar.txt -c /tmp/jar.txt http://localhost:3200/api/auth/csrf | grep -oE '"csrfToken":"[^"]+"' | cut -d'"' -f4)
curl -s -b /tmp/jar.txt -c /tmp/jar.txt -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "csrfToken=$CSRF" \
  --data-urlencode "username=evo.dev" \
  --data-urlencode "password=admin123" \
  -o /dev/null -w "callback=%{http_code}\n" \
  http://localhost:3200/api/auth/callback/credentials
# → expected: callback=302 (login successful, sets authjs.session-token cookie)

curl -s -b /tmp/jar.txt http://localhost:3200/api/auth/session
# → expected: { user: { id, username: 'evo.dev', role: 'SUPERUSER', tenantId: '<EcoNova uuid>' } }

curl -s -b /tmp/jar.txt -L -o /tmp/dash.html http://localhost:3200/dashboard
grep -oE 'class="font-medium">[^<]+' /tmp/dash.html | head -3
# → expected: 3 employee names from EcoNova rendered
```

### Storybook (packages/ui)

```bash
cd D:/heuresys.com.evo
npm run storybook --workspace=@heuresys/ui   # → :6006 with 4 components
# Or static build:
npm run build-storybook --workspace=@heuresys/ui   # → 7-8s, 4 components compiled
```

### Marketing service (no regression)

```bash
cd services/marketing && npm run build
# → expected: "Compiled successfully", 3 static pages
```

### Scheduled tasks (PC)

```powershell
Get-ScheduledTask | Where-Object { $_.TaskName -match "Heuresys" } `
  | Select-Object TaskName, State, @{N='LastResult';E={(Get-ScheduledTaskInfo $_).LastTaskResult}}
# → expected: solo HeuresysForensicAudit (audit v1 legacy, fuori scope .evo)
# → Heuresys-Evo-Sync rimosso 2026-04-29 (workflow ora via 'evo-db pull/push' manuale)
```

### Cron entries (VM)

```bash
ssh oracle-vm-default 'crontab -l | grep heuresys-evo'
# → expected: 2 lines (backup + freshness)
```

### ADR registry

```bash
ls D:/heuresys.com.evo/docs/decisions/
# → expected: 0001, 0002, 0003 + README.md
grep "ADR-" D:/heuresys.com.evo/docs/decisions/README.md
# → expected: 3 rows in index table (0001 Accepted, 0002 Proposed, 0003 Accepted)
```

## How to start the next session

1. Read this file (`.handoff/HANDOFF.md`).
2. Read `.handoff/PROJECT-STATE.md` for full architecture / components state.
3. Scan `.handoff/auto/` for breadcrumbs newer than this file's mtime — if any, surface them to the user.
4. Run the verification commands above (Repo, typecheck, Cross-service auth flow, Cron VM).
5. Confirm reading of relevant memory files (`feedback_autonomous_execution`, `feedback_no_rm_rf_without_inspection`, `multi_dbms_freshness_sync`, `project_no_github_repo_decision`, `scheduled_followup_backup_cron_verification`).
6. Check existence of plan file `~/.claude/plans/noble-dazzling-gizmo.md` (S3-S5 plan, A1-A6 tutti chiusi a S4) — if useful, propose to user a fresh plan file for S5.
7. Apply the autonomous-execution mandate (per memory): present 1-line state recap + top 3-5 todos, then proceed without asking confirmation interruption-style. Make decisions based on best practices + recommendations + verification gates.
8. Ask user: "Continuiamo dalla priority #1 (TOTP step) — serve la chiave AES dal v1, ce l'hai disponibile? Oppure scegli un'altra priority."
9. Wait for direction (especially the AES key availability — that is the only blocker that requires user input).
