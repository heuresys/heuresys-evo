-- =============================================================================
-- Migration 222: NextAuth.js v5 (Auth.js) Prisma adapter tables
-- =============================================================================
-- Adds the 3 tables required by @auth/prisma-adapter to the .evo bare-metal DB:
--   - account                 (OAuth provider linked accounts, FK users.id CASCADE)
--   - session                 (active server-side sessions, FK users.id CASCADE)
--   - verification_token      (passwordless / email magic links)
--
-- Decision rationale: docs/decisions/0003-auth-nextauth-v5-prisma.md
-- Adapter spec:       https://authjs.dev/getting-started/adapters/prisma
--
-- Conventions in this file:
--   - Singular table names (account, session, verification_token).
--     Mapped to Prisma model names via @@map in services/api-gateway/prisma/schema.prisma.
--   - camelCase quoted column names ("userId", "sessionToken", "providerAccountId")
--     to match the default Prisma adapter shape (no @map required at column level).
--   - id columns are UUID with uuid_generate_v4() default — coherent with users.id.
--   - userId FK to users(id) ON DELETE CASCADE per Auth.js canonical behavior
--     (deleting a user removes their sessions and linked accounts).
--   - NO RLS policies on these tables: they are cross-tenant by design
--     (authentication precedes tenant context). RLS lives on domain tables only.
--
-- Idempotency: CREATE TABLE IF NOT EXISTS + CREATE INDEX IF NOT EXISTS
-- (also runner-level skip via schema_migrations is in place).
--
-- Out of scope (deferred to migration 223 in S5 / A5):
--   - ALTER TABLE users ADD COLUMN email, emailVerified, name, image
--     (Auth.js User shape additions — required for signIn flow to work).
-- =============================================================================

-- ----------------------------------------------------------------------------
-- account: OAuth/credential provider records linked to a Heuresys user.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS account (
  id                  UUID NOT NULL DEFAULT uuid_generate_v4(),
  "userId"            UUID NOT NULL,
  type                VARCHAR(255) NOT NULL,
  provider            VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          BIGINT,
  token_type          VARCHAR(255),
  scope               TEXT,
  id_token            TEXT,
  session_state       TEXT,
  CONSTRAINT account_pkey       PRIMARY KEY (id),
  CONSTRAINT account_provider_unique UNIQUE (provider, "providerAccountId"),
  CONSTRAINT "account_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES users (id)
      ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_account_userId ON account ("userId");

-- ----------------------------------------------------------------------------
-- session: server-side active session records.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS session (
  id             UUID NOT NULL DEFAULT uuid_generate_v4(),
  "sessionToken" VARCHAR(255) NOT NULL,
  "userId"       UUID NOT NULL,
  expires        TIMESTAMPTZ NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (id),
  CONSTRAINT session_sessionToken_unique UNIQUE ("sessionToken"),
  CONSTRAINT "session_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES users (id)
      ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_userId  ON session ("userId");
CREATE INDEX IF NOT EXISTS idx_session_expires ON session (expires);

-- ----------------------------------------------------------------------------
-- verification_token: short-lived tokens for email verification / magic links.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  CONSTRAINT verification_token_pkey PRIMARY KEY (identifier, token)
);

-- ----------------------------------------------------------------------------
-- Comments for self-documentation
-- ----------------------------------------------------------------------------
COMMENT ON TABLE  account              IS 'NextAuth/Auth.js linked accounts (OAuth providers + credentials). Cross-tenant.';
COMMENT ON TABLE  session              IS 'NextAuth/Auth.js server-side sessions. Cross-tenant. Cleanup: DELETE WHERE expires < now().';
COMMENT ON TABLE  verification_token   IS 'NextAuth/Auth.js single-use email verification / magic-link tokens. Cross-tenant.';
COMMENT ON COLUMN session.expires      IS 'Session absolute expiry (UTC). Indexed for batch cleanup.';
