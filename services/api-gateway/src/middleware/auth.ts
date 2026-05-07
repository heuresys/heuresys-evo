import type { Request, Response, NextFunction } from 'express';
import { getSession, type Session } from '@auth/express';
import { authConfig } from '../auth.js';
import { decodeNextAuthV4Token } from '../lib/jwt-v4-decoder.js';

const COOKIE_NAME = 'authjs.session-token';

/**
 * requireAuth middleware — rejects with 401 if no valid session.
 *
 * Two paths:
 *   1. NextAuth v4 cookie minted by services/app — decoded with custom helper
 *      (HKDF info "NextAuth.js Generated Encryption Key", A256GCM).
 *   2. Auth.js v5 cookie minted locally by the gateway dev signin path —
 *      decoded by getSession() as before.
 *
 * Both paths share AUTH_SECRET; the bifurcation is driven by HKDF info string
 * incompatibility between v4 (NextAuth) and v5 (@auth/core).
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const v4Token = req.cookies?.[COOKIE_NAME];
  const secret = process.env.AUTH_SECRET;
  if (v4Token && secret) {
    const payload = await decodeNextAuthV4Token(v4Token, secret);
    if (payload?.id) {
      req.session = {
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          tenantId: payload.tenantId,
          role: payload.role,
          username: payload.username,
        },
        expires: payload.exp ? new Date(payload.exp * 1000).toISOString() : '',
      } as Session;
      next();
      return;
    }
  }

  const session = await getSession(req, authConfig);
  if (!session?.user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  req.session = session;
  next();
}
