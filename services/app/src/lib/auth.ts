import NextAuth, { type NextAuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './db';
import { authConfig } from './auth.config';
import { authorizeCredentials } from './authorize';

/**
 * Full NextAuth v4 configuration for services/app.
 *
 * Strategy: JWT (no DB-backed sessions). NextAuth signs the JWT with
 * AUTH_SECRET; the same secret is used by services/api-gateway's
 * @auth/express setup (Auth.js v5 family) to validate the cookie
 * cross-service. The cookie name is forced to `authjs.session-token`
 * in auth.config.ts so v4-minted JWTs match the v5 default on the gateway.
 *
 * Provider: Credentials only (DB-backed bcrypt against users.password_hash).
 *
 * Out of scope (deferred to a follow-up):
 *   - TOTP step (users.totp_secret_encrypted decrypt + otplib verify).
 *   - OAuth providers (Google, Microsoft) — would require PrismaAdapter
 *     v1.x for v4, current @auth/prisma-adapter v2.11 is v5-family.
 */
export const authOptions: NextAuthOptions = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const result = await authorizeCredentials(
          prisma as unknown as Parameters<typeof authorizeCredentials>[0],
          { DEFAULT_SUPERUSER_TENANT_ID: process.env.DEFAULT_SUPERUSER_TENANT_ID },
          credentials
        );
        return result ?? null;
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
};

/**
 * Server-side session helper. Replaces v5's `auth()` shorthand.
 * Use in Server Components and Server Actions.
 */
export const auth = () => getServerSession(authOptions);

/**
 * App Router catch-all handler — kept compatible with the route file
 * `app/api/auth/[...nextauth]/route.ts` which imports `handlers`.
 */
const handler = NextAuth(authOptions);
export const handlers = { GET: handler, POST: handler };
