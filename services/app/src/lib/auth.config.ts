import type { NextAuthOptions } from 'next-auth';

/**
 * Edge-runtime-safe NextAuth v4 base config. Used by proxy.ts (Next.js 16
 * rename of middleware.ts) where Prisma and its Node-only dependencies
 * cannot be loaded.
 *
 * The full config (with Credentials provider + Prisma user lookup) lives
 * in auth.ts and is used by the App Router catch-all route handler + server
 * components.
 *
 * Cross-service JWT compatibility with services/api-gateway (@auth/express
 * v0.12.x): both ends share AUTH_SECRET and the cookie name is forced to
 * `authjs.session-token` here so v4-minted JWTs are recognised by the
 * Auth.js v5 family on the gateway side.
 */
export const authConfig: Omit<NextAuthOptions, 'providers'> = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  cookies: {
    sessionToken: {
      name: 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const t = token as Record<string, unknown>;
        if (typeof t.id === 'string') (session.user as { id?: string }).id = t.id;
        if (typeof t.username === 'string')
          (session.user as { username?: string }).username = t.username;
        if (typeof t.role === 'string') (session.user as { role?: string }).role = t.role;
        if (typeof t.tenantId === 'string')
          (session.user as { tenantId?: string }).tenantId = t.tenantId;
      }
      return session;
    },
  },
};
