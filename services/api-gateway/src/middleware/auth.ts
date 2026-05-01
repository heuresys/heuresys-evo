import type { Request, Response, NextFunction } from 'express';
import { getSession } from '@auth/express';
import { authConfig } from '../auth.js';

/**
 * requireAuth middleware — rejects with 401 if no valid Auth.js session.
 *
 * Reads the session via `getSession(req, authConfig)`, which under the hood
 * decodes the session JWT cookie using AUTH_SECRET. The same secret is
 * shared with services/app (Next.js) so that sessions are interoperable.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const session = await getSession(req, authConfig);
  if (!session?.user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  // Attach the resolved session to the request for downstream handlers.
  req.session = session;
  next();
}
