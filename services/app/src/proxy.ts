import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * NextAuth v4 proxy (Next.js 16 file convention; was middleware.ts pre-16) —
 * protects the (protected) route segment by inspecting the JWT cookie
 * directly via `getToken`. Edge-runtime safe (no Prisma, no Node-only deps).
 *
 * Cookie name `authjs.session-token` is forced in auth.config.ts so the
 * gateway (Auth.js v5) can decode the same cookie.
 */
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: 'authjs.session-token',
  });
  const isAuthed = !!token;

  const isProtected = nextUrl.pathname.startsWith('/dashboard');
  const isAuthPage = nextUrl.pathname === '/login';

  if (isProtected && !isAuthed) {
    return NextResponse.redirect(new URL('/login', nextUrl.origin));
  }
  if (isAuthPage && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
