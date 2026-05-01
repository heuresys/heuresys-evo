import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

/**
 * Auth.js v5 proxy (Next.js 16 file convention; was middleware.ts pre-16) —
 * protects (protected) route segment.
 *
 * Uses the Edge-safe authConfig (no Prisma) since this file runs in the
 * Next.js Edge runtime. The full Credentials + DB lookup lives in auth.ts,
 * which is only loaded by the API route handler.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthed = !!session?.user;

  const isProtected = nextUrl.pathname.startsWith('/dashboard');
  const isAuthPage = nextUrl.pathname === '/login';

  if (isProtected && !isAuthed) {
    return NextResponse.redirect(new URL('/login', nextUrl.origin));
  }
  if (isAuthPage && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
