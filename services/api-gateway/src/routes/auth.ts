import { Router } from 'express';
import { ExpressAuth } from '@auth/express';
import { authConfig } from '../auth.js';

/**
 * Mounts Auth.js routes (signin/signout/session/csrf/callback/...) under
 * the parent prefix where this router is attached (recommended: /auth).
 *
 * Endpoints exposed:
 *   GET  /auth/signin
 *   POST /auth/signin/credentials
 *   GET  /auth/session
 *   POST /auth/signout
 *   GET  /auth/csrf
 *   POST /auth/callback/credentials
 *   ... and the rest of the Auth.js standard surface.
 */
export const authRouter = Router();

authRouter.use('/', ExpressAuth(authConfig));
