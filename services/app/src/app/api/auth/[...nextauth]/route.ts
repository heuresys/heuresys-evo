// NextAuth v4 — App Router catch-all handler.
// See src/lib/auth.ts for the configuration.
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
