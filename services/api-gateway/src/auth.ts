import type { ExpressAuthConfig } from '@auth/express';
import Credentials from '@auth/core/providers/credentials';

/**
 * Auth.js configuration for the api-gateway.
 *
 * In A3 the Credentials provider authorizes a single development principal
 * (username=admin, password=admin) — this exists only to validate the auth
 * pipeline end-to-end (signin → session cookie → protected route).
 *
 * In A5 this provider will be replaced by the real flow:
 *   - DB-backed user lookup via Prisma (users table)
 *   - bcrypt password verification against users.password_hash
 *   - TOTP step (users.totp_enabled → returns "pending_totp" until verified)
 *
 * The shared AUTH_SECRET ensures that session JWTs minted here can be
 * validated by services/app (Next.js NextAuth v5) and vice-versa.
 */
export const authConfig: ExpressAuthConfig = {
  secret: process.env.AUTH_SECRET ?? '',
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // STUB FOR A3 — see file header comment above.
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== 'string' || typeof password !== 'string') {
          return null;
        }
        if (username === 'admin' && password === 'admin') {
          return {
            id: 'dev-admin-uuid-00000000-0000-0000-0000-000000000000',
            name: 'Dev Admin',
            email: 'admin@local',
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Local signin path (admin/admin via the Credentials provider above):
      // the gateway issues its own dev token with no tenant/role.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // This callback runs for BOTH locally-issued tokens (dev) AND tokens
      // minted by services/app (cross-service interop). We surface the
      // additional claims (tenantId, role, username) on session.user so
      // resolveTenant middleware and downstream handlers can read them.
      if (session.user) {
        const t = token as Record<string, unknown>;
        if (typeof t.id === 'string') {
          (session.user as { id?: string }).id = t.id;
        }
        if (typeof t.tenantId === 'string') {
          (session.user as { tenantId?: string }).tenantId = t.tenantId;
        }
        if (typeof t.role === 'string') {
          (session.user as { role?: string }).role = t.role;
        }
        if (typeof t.username === 'string') {
          (session.user as { username?: string }).username = t.username;
        }
      }
      return session;
    },
  },
};
