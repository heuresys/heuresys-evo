# ADR-0003: Strategia auth/2FA — NextAuth v5 (Auth.js) + Prisma Adapter

**Status**: ⚠️ **SUPERSEDED** by ADR-0009 (Stack Version Strategy — NextAuth v4 stable adopted instead of v5 beta)
**Date**: 2026-04-27 (original) · Superseded: vedi ADR-0009 timeline
**Authors**: Enzo Spenuso

> **Nota di supersessione**: la decisione originale di adottare NextAuth v5 (Auth.js beta) è stata superata dalla strategia stack (`docs/decisions/0009-stack-version-strategy.md`) che ha pinnato **NextAuth v4** stable in produzione. Migrazione a v5 deferred fino a release stable v5 (probabilmente Q3-Q4 2026 — vedi HANDOFF carry-forward "next-auth v5 timing").

## Context

Il progetto `heuresys.com.evo` deve esporre un'area applicativa autenticata (`services/app`, SaaS dashboard B2B multi-tenant) e un backend API (`services/api-gateway`, Express 5) che condivide la stessa identity. Il dataset è multi-tenant con RLS PostgreSQL attiva: ogni richiesta deve eseguire `SET LOCAL app.current_tenant_id = '<uuid>'` prima delle query, altrimenti le policy restituiscono zero righe.

La baseline DB v1 (mig 202, 680 tabelle, 270 employees, 4 tenants) ha già una tabella `users` ricca di colonne auth-related:

- `password_hash` (varchar 255) — bcrypt `$2a$/$2b$` (compat `pgcrypto.crypt()`)
- `totp_secret` (varchar 64) — **plaintext, DEPRECATED**, dropped da migration 221 _non ancora applicata_ (1 user blocking)
- `totp_secret_encrypted` (text) — AES-256-GCM envelope (`iv[12]||tag[16]||ciphertext`, base64)
- `totp_enabled` (boolean), `totp_recovery_codes` (text[]), `totp_failed_attempts` (int), `totp_lockout_until` (timestamptz)
- `role` (varchar 50, CHECK constraint con 9 valori: `SUPERUSER`, `TENANT_OWNER`, `SYSADMIN`, `IT_ADMIN`, `HR_DIRECTOR`, `HR_MANAGER`, `DEPT_HEAD`, `LINE_MANAGER`, `EMPLOYEE`)
- `permissions` (text[], default `{}`)
- RLS policy `user_tenant_access` filtra per `employee_id IN (SELECT employees.id WHERE tenant_id = current_tenant_id())`

Lo stack v1 implementava auth in modo custom: JWT access 15m + refresh 7d firmati con `JWT_SECRET`, libreria `otplib` per TOTP, `bcryptjs` per password hashing, helper interno `services/totpCrypto.ts` per cifrare/decifrare il secret TOTP. Il pattern funziona ma ha richiesto codice middleware ad-hoc su ogni servizio Express e gestione manuale di refresh/rotazione/CSRF.

Le forze in gioco per `.evo`:

- **Riuso di un ecosystem maturo** — login flow, CSRF protection, callback session, supporto OAuth providers, gestione cookie sicuri sono problemi risolti da librerie consolidate; reimplementarli aggiunge superficie di bug e manutenzione.
- **Multi-tenancy con RLS** — qualsiasi soluzione deve permettere di iniettare `tenantId` nella session e tradurlo in `SET LOCAL app.current_tenant_id` lato Prisma; non è un pattern out-of-the-box di nessun framework auth.
- **2FA TOTP obbligatorio per ruoli sensibili** — il flow di login non è "username + password → done", ma può richiedere uno step intermedio TOTP challenge dopo verifica password.
- **Coerenza con Next.js 16 App Router** — `services/app` è App Router; serve un framework auth che supporti Server Components, Server Actions, middleware Edge.
- **Provider futuri** — l'identity di alcuni ruoli (`HR_DIRECTOR`, `HR_MANAGER`, `IT_ADMIN`) può legittimamente arrivare da Microsoft 365 / Google Workspace di un cliente; serve un'API multi-provider pluggable.
- **TypeScript-first + ORM standard** — `services/app` e `services/api-gateway` useranno Prisma come DB layer (ORM più diffuso/professionale in ecosystem TS Node, decisione ortogonale presa nella stessa sessione); l'auth library deve avere un adapter Prisma ufficiale e mantenuto.
- **No vendor lock-in** — i dati utenti (270+ records, password hash, TOTP secret cifrati) restano nel nostro DB; soluzioni managed che spostano l'identity esternamente sono incompatibili con la baseline RLS.

## Decision

Adottare **NextAuth v5 (Auth.js)** + **`@auth/prisma-adapter`** come strategia auth unificata per `.evo`.

Implementazione concreta:

1. **Provider primario**: Credentials provider con flusso multi-step:
   - Step 1: validazione `username` + `password` via bcrypt compare (`bcryptjs.compare(input, user.password_hash)`)
   - Step 2: se `user.totp_enabled = true`, challenge TOTP. Decrypt `totp_secret_encrypted` con AES-256-GCM (chiave da env `TOTP_ENCRYPTION_KEY`), validare con `otplib.authenticator.check(token, secret)`.
   - Step 3: incremento `totp_failed_attempts` su miss; lockout via `totp_lockout_until` se >5 attempts in finestra.
   - Step 4: emissione session JWT.

2. **Session strategy**: `jwt` (stateless). NextAuth firma un JWT con `AUTH_SECRET`, contenuto in cookie `__Secure-authjs.session-token` (httpOnly, sameSite=lax, secure in prod). No tabella `sessions` server-side (no persistenza esplicita oltre il cookie).
   _Razionale_: il flusso v1 era già stateless; non vogliamo introdurre persistenza session DB se non per casi specifici (logout-all-devices, audit). Refresh implicito alla scadenza tramite `session.maxAge` (default 30g, configurabile a 7g per parity con v1 refresh).

3. **Adapter Prisma**: `PrismaAdapter(prisma)` da `@auth/prisma-adapter`. L'adapter gestisce le tabelle `Account`, `Session`, `VerificationToken` (schema canonico Auth.js). La nostra tabella `users` esistente viene mappata al modello `User` di Auth.js tramite Prisma schema con `@@map("users")` e field mapping; le colonne extra (`role`, `permissions`, `totp_*`, `tenant_id`, `employee_id`) restano e vengono esposte via callback.

4. **Migration 222**: nuovo file `db/migrations/222_nextauth_tables.sql` crea `Account`, `Session` (anche se non popolata in strategia jwt, alcuni adapter la richiedono per VerificationToken FK), `VerificationToken`. Schema standard da `@auth/prisma-adapter` README.

5. **Session callback** (chiave per RLS): in `services/app/src/lib/auth.ts`:

   ```ts
   callbacks: {
     async jwt({ token, user }) {
       if (user) {
         token.role = user.role;
         token.tenantId = user.tenant_id; // o lookup via employee_id → tenant_id
         token.employeeId = user.employee_id;
         token.permissions = user.permissions;
       }
       return token;
     },
     async session({ session, token }) {
       session.user.role = token.role;
       session.user.tenantId = token.tenantId;
       session.user.employeeId = token.employeeId;
       session.user.permissions = token.permissions;
       return session;
     }
   }
   ```

6. **Helper `withTenant(tenantId, fn)` per RLS** (definito in `services/api-gateway/src/db/pool.ts` e replicato/condiviso in `services/app/src/lib/db.ts`):

   ```ts
   async function withTenant<T>(tenantId: string, fn: (tx: PrismaTx) => Promise<T>): Promise<T> {
     return prisma.$transaction(async (tx) => {
       await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${escapeUuid(tenantId)}'`);
       return fn(tx);
     });
   }
   ```

   Ogni handler API wrappa le query in `withTenant(req.session.user.tenantId, async (tx) => { ... })`. UUID escape rigoroso (parametrizzato con regex `^[0-9a-f-]{36}$` prima dell'interpolazione, perché `SET LOCAL` non accetta bind parameters).

7. **Provider OAuth futuri**: `MicrosoftEntraId` e `Google` aggiungibili via `providers: [Credentials, MicrosoftEntraID, Google]`. Il mapping `OAuth identity → users.id` avviene via `Account` table dell'adapter Prisma (chiave `provider + providerAccountId`). Out-of-scope per S3, ma l'architettura lo permette senza rework.

8. **Versione pinned**: `next-auth ^5.0.0` (release stabile finale, non beta). Verificare la GA al momento di `npm install`; se ancora in `5.0.0-beta.x`, valutare il rischio. Fallback gestito con il pattern di pin esatto della versione testata, e ADR review se vincoli operativi cambiano.

## Alternatives considered

### Custom JWT v1-parity (familiare, scartato)

Continuare il pattern v1: middleware Express custom + libreria `jsonwebtoken` + helper TOTP/bcrypt scritti a mano. Il codice esisteva già ed era funzionante.

- **Pro**: zero dipendenze nuove; pattern noto a chi ha lavorato sul v1; controllo totale.
- **Contro**: re-implementazione completa di CSRF/cookie/callback in `services/app` (Next.js); nessun vantaggio dall'ecosystem Auth.js; provider OAuth pluggable richiederebbe codice custom; manutenzione long-term inferiore a una libreria attivamente sviluppata; adoption hiring inferiore.
- **Rejected**: il vantaggio di avere "il proprio codice" non compensa il deficit di feature out-of-the-box e l'oneroso re-build del flusso login Next.js 16 App Router.

### Lucia (DB-backed sessions)

Lucia v3 / v4 — libreria TS-first lightweight, sessione persistita in tabella DB.

- **Pro**: DX TypeScript eccellente, codice piccolo e leggibile, no magic; control totale sul session lifecycle.
- **Contro**: cambio paradigma rispetto a v1 (DB sessions vs JWT); richiede tabella `user_sessions` aggiuntiva e gestione esplicita del refresh; ecosystem più piccolo (meno provider OAuth, meno adapter); Lucia v3 ha avuto un'evoluzione travagliata della API in 2024-2025, lasciando dubbi sulla stabilità long-term; integrazione Next.js App Router meno documentata di Auth.js.
- **Rejected**: il salto di paradigma + minore community + integrazione Next.js più artigianale non giustificano il vantaggio in DX. Da riconsiderare se Auth.js mostrerà problemi di copertura RLS o bug bloccanti.

### Clerk (managed)

Identity managed esterna (SaaS), zero codice auth, UI components prebuilt.

- **Pro**: time-to-market rapido, UI/flow di alta qualità, MFA/SSO/passwordless out-of-the-box.
- **Contro**: i dati utenti vivono fuori dal nostro DB (incompatibile con la baseline esistente di 270+ records con `password_hash` + `totp_secret_encrypted`); il mapping tra Clerk userId e `users.employee_id` per RLS richiederebbe sincronizzazione bidirezionale fragile; costi mensili ricorrenti che crescono col numero di utenti; dipendenza esterna che non possiamo backuppare con gli stessi strumenti del DB; difficile da rimuovere se in futuro si vuole tornare in-house.
- **Rejected**: incompatibilità strutturale con la baseline + lock-in vendor + costi che scalano linearmente con la user base.

### Passkey-only (FIDO2/WebAuthn)

Saltare TOTP, andare direttamente a passkey come 2FA primario.

- **Pro**: UX moderna, sicurezza superiore (phishing-resistant), no shared secret.
- **Contro**: la baseline ha 270 utenti già provisionati con TOTP; rollout passkey richiede device support (alcuni clienti enterprise hanno device legacy/locked-down); non risolve il problema architetturale "auth library", lo sposta soltanto.
- **Rejected** come strategia primaria; **promosso a follow-up** futuro: NextAuth v5 supporta WebAuthn provider, quindi possiamo aggiungere passkey come opzione TOTP alternativa senza rework dell'architettura. Roadmap per dopo il go-live di `services/app`.

## Consequences

### Positive

- **Riuso ecosystem maturo**: CSRF, cookie sicuri, session callback, OAuth providers tutti out-of-the-box. Tempo di sviluppo per il login flow stimato in giorni invece di settimane.
- **Provider OAuth pluggable**: aggiungere Microsoft/Google in futuro è una changeset ridotta (provider config + mapping account).
- **Type safety**: Auth.js v5 ha tipi TS first-class; la session è tipata via module augmentation di `next-auth` (`declare module 'next-auth' { interface Session { user: { tenantId: string; role: Role; ... } } }`).
- **Adapter Prisma ufficiale**: zero codice di adapter custom da scrivere e mantenere; gli aggiornamenti seguono il release ciclo Prisma + Auth.js.
- **Adoption industry standard**: hiring pool TS che conosce Auth.js è ampio; documentazione abbondante; pattern noti per problemi comuni.
- **Compatibilità Next.js 16 App Router**: integrazione first-class con Server Components, Server Actions, middleware Edge.

### Negative

- **RLS multi-tenant non è un pattern documentato out-of-the-box**: il session callback custom + helper `withTenant()` sono codice nostro. Servirà documentazione interna chiara (`docs/runbooks/auth-rls.md`) e test integration espliciti per evitare regressioni dove una query sfugge al wrapping.
- **TOTP custom in Credentials provider**: Auth.js v5 supporta i Credentials providers ma il flow multi-step (password → TOTP challenge → finalize) richiede pattern specifici (multi-step credentials, oppure due provider chained, oppure custom server action che chiama `signIn` solo dopo TOTP verified). Da validare la pattern esatta al momento dell'implementazione (S5) consultando la doc Auth.js v5 corrente.
- **Mapping users esistente**: la tabella `users` ha shape diverso da quello standard Auth.js. Il Prisma schema deve usare `@@map("users")` + field mapping puntuale (es. `passwordHash @map("password_hash")`); il Credentials provider non passa per Account/Session table standard.
- **Migration 222 richiesta**: nuove tabelle `Account`, `Session`, `VerificationToken` da creare. Anche con session strategy `jwt`, alcune funzionalità future (verifica email, reset password) richiedono `VerificationToken`. Schema standard ma occupa spazio.
- **Beta/canary risk**: NextAuth v5 era in beta a inizio 2025; verificare GA al momento di `npm install`. Se ancora beta, accettare il rischio o pinnare versione testata.
- **Lock-in moderato**: cambiare da Auth.js in futuro implica riscrittura del callback session, middleware, login UI. Mitigato dal fatto che la logica di dominio (TOTP verify, role check, withTenant) è isolata in helper riusabili.

### Follow-ups

- [ ] **Migration 222** (`db/migrations/222_nextauth_tables.sql`): CREATE TABLE Account, Session, VerificationToken con schema canonico `@auth/prisma-adapter`. Da scrivere in S3.
- [ ] **Migration 221 (TOTP plain drop)**: applicare backfill per l'1 user con `totp_secret IS NOT NULL` (decrypt + re-encrypt + update + verify), poi applicare la migration. Pre-requisito al go-live di `services/app` se vogliamo rimuovere il debt. Schedulato in S3 post-ADR.
- [ ] **Module augmentation TS** in `packages/shared`: estendere il type `Session` di Auth.js con i campi custom (`tenantId`, `role`, `employeeId`, `permissions`).
- [ ] **Helper `withTenant(tenantId, fn)`**: implementazione iniziale in `services/api-gateway/src/db/pool.ts`; se replicato in `services/app/src/lib/db.ts` senza divergenze, estrarre in `packages/shared/src/db/with-tenant.ts` (refactor S5).
- [ ] **Test integration login flow**: scenario completo `username+password → TOTP → session attiva → query con RLS → logout`. Usa testcontainers (ADR-0002).
- [ ] **Runbook auth-RLS** (`docs/runbooks/auth-rls.md`): documentare il pattern, errori comuni (query fuori da `withTenant` → zero rows misterioso), troubleshooting.
- [ ] **WebAuthn/passkey** come 2FA alternativo a TOTP: roadmap post-launch, NextAuth v5 supporta `Passkey` provider.
- [ ] **Audit log** delle login attempts (success/fail/lockout): tabella `auth_audit` (out-of-scope ADR-0003, separato).
- [ ] **OAuth providers** Microsoft Entra ID + Google Workspace: roadmap quando il primo cliente lo richiede; nessun rework architetturale richiesto.
- [ ] **Decision review** dopo 6 mesi di go-live: se i vincoli RLS si rivelano più dolorosi del previsto, riconsiderare Lucia o pattern v1 custom; se Auth.js v5 introduce breaking changes destabilizzanti, valutare lock di versione + maintenance plan.
