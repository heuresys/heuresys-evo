import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './db';
import { authConfig } from './auth.config';
import { authorizeCredentials } from './authorize';

/**
 * Full NextAuth v5 configuration for services/app.
 *
 * Strategy: JWT (no DB-backed sessions). NextAuth signs the JWT with
 * AUTH_SECRET; the same secret is used by services/api-gateway's
 * @auth/express setup to validate the cookie cross-service. The cookie
 * name `authjs.session-token` is the default for both.
 *
 * Provider: Credentials only (DB-backed bcrypt against users.password_hash).
 *
 * This config IS NOT loaded by proxy.ts (Next 16 rename of middleware.ts) —
 * proxy uses the lean Edge-safe variant in auth.config.ts (no Prisma).
 *
 * Out of scope (deferred to a follow-up):
 *   - TOTP step (users.totp_secret_encrypted decrypt + otplib verify).
 *     Requires AES-256-GCM key in env that pairs with the encryption used
 *     by the v1 stack. The seed user `evo.dev` has totp_enabled=false so
 *     this can be skipped today.
 *   - OAuth providers (Google, Microsoft) — requires PrismaAdapter wiring,
 *     which is why migrations 222 and the schema_migrations entry are
 *     already in place.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        return authorizeCredentials(
          prisma as unknown as Parameters<typeof authorizeCredentials>[0],
          { DEFAULT_SUPERUSER_TENANT_ID: process.env.DEFAULT_SUPERUSER_TENANT_ID },
          credentials,
        );
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id?: string;
          username?: string;
          role?: string;
          tenantId?: string;
        };
        if (u.id) token.id = u.id;
        if (u.username) token.username = u.username;
        if (u.role) token.role = u.role;
        if (u.tenantId) token.tenantId = u.tenantId;
      }
      return token;
    },
  },
});
