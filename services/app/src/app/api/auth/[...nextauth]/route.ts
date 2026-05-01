// NextAuth v5 — App Router catch-all handler.
// See src/lib/auth.ts for the configuration.
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
