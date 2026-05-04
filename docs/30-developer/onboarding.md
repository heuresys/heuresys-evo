# Developer onboarding (B6.12)

Benvenuto nel progetto `heuresys-evo`. Questa guida ti porta da zero a primo commit utile in ~30 minuti.

## 1. Prerequisiti macchina

| Tool                       | Versione minima | Verifica                               |
| -------------------------- | --------------- | -------------------------------------- |
| Node.js                    | 20.0.0          | `node -v`                              |
| npm                        | 10.0.0          | `npm -v`                               |
| PostgreSQL client (`psql`) | 16              | `psql --version`                       |
| git                        | 2.40+           | `git --version`                        |
| jq                         | 1.6+            | `jq --version` (per scripts/hardening) |

PostgreSQL **server** non deve essere installato sulla tua macchina di sviluppo se preferisci usare quello sulla VM o un'istanza Docker temporanea — basta che sia raggiungibile via `DATABASE_URL`.

## 2. Clone e install

```bash
git clone https://github.com/heuresys/heuresys-evo.git
cd heuresys-evo
npm install
```

`npm install` invoca anche `husky install` automaticamente (vedi `package.json#scripts.prepare`), abilitando i pre-commit hooks.

## 3. Environment

Copia gli esempi e compila:

```bash
cp .env.example .env
cp services/app/.env.local.example services/app/.env.local
cp services/api-gateway/.env.example services/api-gateway/.env
```

Variabili critiche (cross-service):

| Var                           | Dove                                | Note                                                 |
| ----------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `DATABASE_URL`                | root + per service                  | postgres://user:pwd@host:port/db                     |
| `AUTH_SECRET`                 | services/app + services/api-gateway | **stesso valore** in entrambi (vedi ADR-0007)        |
| `AUTH_TRUST_HOST`             | services/app                        | `true` solo in dev/preview                           |
| `NEXT_PUBLIC_API_URL`         | services/app                        | URL pubblico api-gateway (es. http://localhost:8200) |
| `DEFAULT_SUPERUSER_TENANT_ID` | services/app                        | UUID tenant del superuser                            |

Genera `AUTH_SECRET` (≥ 32 byte random):

```bash
openssl rand -hex 32
```

## 4. Setup DB

Bare-metal Postgres locale o remoto, vedi [ADR-0001](../decisions/0001-postgresql-bare-metal.md). Una volta raggiungibile via `DATABASE_URL`, applica le migrazioni:

```bash
DATABASE_URL=postgresql://heuresys:heuresys@localhost:5432/heuresys_evo \
  db/scripts/migrate.sh
```

Per il DB **di test** (separato!):

```bash
export DATABASE_URL_TEST=postgresql://heuresys:heuresys@localhost:5432/heuresys_test
npm run db:reset:test
```

## 5. Run dev

```bash
# Opzione A — tutto in parallelo
npm run dev

# Opzione B — un service alla volta (raccomandato in fase debug)
npm run dev -w services/api-gateway
npm run dev -w services/app
```

Apri:

- http://localhost:8200/health (api-gateway, dovrà rispondere 200 OK dopo B5)
- http://localhost:3000 (app — redirige a /login)

## 6. Primo commit di test

Modifica un file qualsiasi e committa:

```bash
echo "# test" >> /tmp/dummy.md  # NON committarlo davvero
# … oppure modifica un file reale
git add <file>
git commit -m "[RTGB][PH<N>-T<M>] <type>: <subject>"
```

Il pre-commit hook esegue:

1. `lint-staged` — prettier su file staged
2. **secret scan inline** — blocca PEM, sk-/gho*/ghp*/AKIA tokens, Slack tokens
3. **prisma-verify** — solo se `prisma/schema.prisma` è staged (richiede `DATABASE_URL`)

Il commit-msg hook accetta:

- Signature RTGB: `[RTGB][PH<N>-T<M>] <type>: <subject>`
- Conventional Commits: `feat: ...`, `fix: ...`, ecc.
- Merge/Revert/fixup commits di default

## 7. Tooling preferito

- **Editor**: VS Code, JetBrains, vim — qualsiasi con TypeScript LSP
- **Recommended VS Code extensions** (vedi `.vscode/extensions.json` quando creato in B11):
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

## 8. Workflow comune

| Task                     | Comando                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| Aggiungere una rotta API | edita `services/api-gateway/src/routes/` + test in `__tests__/`                 |
| Aggiungere una pagina UI | crea `services/app/src/app/<route>/page.tsx`                                    |
| Modificare schema DB     | scrivi migration in `db/migrations/NNN_<name>.sql`, apply, poi `prisma db pull` |
| Aggiungere componente UI | `packages/ui/src/components/<name>/index.tsx` + `<name>.stories.tsx`            |
| Vedere stato hardening   | `./scripts/hardening/status.sh`                                                 |

## 9. Convenzioni di codice

- **Imports ordinati**: built-in → external → `@heuresys/*` → relative
- **Type-only imports** quando possibile: `import type { Foo } from '...'`
- **Server Components default** in `services/app`, Client Components esplicite con `'use client'` solo se richiesto
- **No console.log** in prod paths (warning eslint quando attivato in B4)
- **Strict TS**: `noUncheckedIndexedAccess: true` — gestisci esplicitamente `T | undefined` su array access

## 10. Quando hai dubbi

- **Decisioni architetturali**: leggi `docs/decisions/`
- **Workflow DB**: `docs/guides/prisma-workflow.md`
- **Security**: `docs/guides/security.md` (post-B4)
- **Roadmap hardening**: `/home/ubuntu/heuresys.com.evo/ROAD_TO_GLORY_EVO_HARDENING.md`
- **Stato sessione**: `docs/hardening/session-*-closure.md`

## 11. Quick troubleshooting

| Problema                                             | Soluzione                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| `husky - pre-commit script failed` con "BEGIN" match | Aggiorna husky/pre-commit (P1 deve essere PEM regex completo, non solo "BEGIN") |
| `prisma db pull` mostra drift inaspettato            | Assicurati di usare role `BYPASSRLS` (`heuresys_app_admin`) per la connessione  |
| Login `/dashboard` redirige in loop                  | `AUTH_SECRET` diverso tra app e api-gateway → cookie non decodifica             |
| `npm run typecheck` errori `@types/react-dom`        | Pulisci `node_modules` + reinstalla; possibile drift workspace deps post-pull   |

## 12. Contributing

Vedi `docs/CONTRIBUTING.md` (post-B11) per workflow PR + ADR process. Nel frattempo: working autonomo su `main`, tag con commit signature RTGB se sei in scope hardening, altrimenti conventional commits.

---

**Ultima revisione**: 2026-05-01 (RTGB B6.12).
