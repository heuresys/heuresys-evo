/**
 * Express Request augmentations used across middleware and routes.
 * Keep in sync with what each middleware actually sets.
 */
import type { Session } from '@auth/express';

declare global {
  namespace Express {
    interface Request {
      session?: Session | null;
      tenantId?: string;
    }
  }
}

export {};
