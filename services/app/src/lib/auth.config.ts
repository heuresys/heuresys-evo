import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-runtime-safe NextAuth config. Used by proxy.ts (Next 16 rename of
 * middleware.ts) where Prisma and its Node-only dependencies cannot be loaded.
 *
 * The full config (with Credentials provider + Prisma user lookup) lives
 * in auth.ts and is used by the route handlers + server components.
 *
 * Both configs share secret + session callbacks, so the JWT minted by the
 * full config in auth.ts is correctly decoded by the proxy here.
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  // No providers in this config — sign-in happens through the full config
  // exposed via the /api/auth/[...nextauth] route handler.
  providers: [],
  callbacks: {
    // The session callback runs in middleware too, so we keep it here
    // (must NOT touch Prisma).
    async session({ session, token }) {
      if (session.user) {
        const t = token as Record<string, unknown>;
        if (typeof t.id === 'string') (session.user as { id?: string }).id = t.id;
        if (typeof t.username === 'string')
          (session.user as { username?: string }).username = t.username;
        if (typeof t.role === 'string')
          (session.user as { role?: string }).role = t.role;
        if (typeof t.tenantId === 'string')
          (session.user as { tenantId?: string }).tenantId = t.tenantId;
      }
      return session;
    },
  },
};
