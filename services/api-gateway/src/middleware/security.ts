import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

/**
 * Security middleware bundle (B4.1, B4.3, B4.4, B4.8).
 *
 * - hardenedHelmet — CSP + HSTS + frameguard + xssFilter + noSniff + permissionsPolicy
 * - rateLimitGeneral — 100 req/15min/ip default; tunable via env
 * - rateLimitAuth — 10 req/5min/ip on /auth/* to slow brute-force
 * - csrfHmac — HMAC-bound CSRF (HttpOnly cookie + signed token via /csrf endpoint)
 *
 * Helmet for headers, express-rate-limit for throttling are battle-tested.
 * The CSRF design here is HMAC-bound rather than the legacy double-submit
 * pattern (which requires a JS-readable cookie and is weaker against XSS).
 */

export const hardenedHelmet: RequestHandler = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"], // Tailwind injects inline runtime styles
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'"],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'upgrade-insecure-requests': [],
    },
    // CSP report-only first; flip to enforce after monitoring (B4.8).
    reportOnly: process.env.CSP_ENFORCE !== '1',
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false, // API only; no embedding HTML
  crossOriginResourcePolicy: { policy: 'same-site' },
});

export const rateLimitGeneral = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  limit: Number(process.env.RATE_LIMIT_MAX ?? 100),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'rate_limit_exceeded' },
});

export const rateLimitAuth = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_AUTH_MAX ?? 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'auth_rate_limit_exceeded' },
});

const CSRF_COOKIE = 'csrf-binding';
const CSRF_HEADER = 'x-csrf-token';

function csrfSecret(): string {
  const s = process.env.CSRF_SECRET ?? process.env.AUTH_SECRET;
  if (!s) {
    throw new Error('CSRF_SECRET or AUTH_SECRET must be set for CSRF middleware');
  }
  return s;
}

function deriveToken(binding: string): string {
  return crypto.createHmac('sha256', csrfSecret()).update(binding).digest('base64url');
}

/**
 * GET /csrf — returns the current CSRF token (and lazily issues a binding
 * cookie if absent). Client stores the token in memory and sends it as
 * X-CSRF-Token header on unsafe requests.
 */
export function csrfTokenHandler(req: Request, res: Response): void {
  let binding = req.cookies?.[CSRF_COOKIE];
  if (!binding || typeof binding !== 'string') {
    binding = crypto.randomBytes(24).toString('base64url');
    res.cookie(CSRF_COOKIE, binding, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 12 * 60 * 60 * 1000, // 12h
    });
  }
  res.json({ token: deriveToken(binding) });
}

/**
 * Middleware enforcing CSRF on unsafe methods (POST/PUT/PATCH/DELETE).
 * Skips Auth.js routes (it manages its own CSRF) and read-only health/metrics.
 */
export function csrfHmac(req: Request, res: Response, next: NextFunction): void {
  const skipPaths = ['/auth/', '/health', '/metrics', '/ready', '/csrf'];
  if (skipPaths.some((p) => req.path === p || req.path.startsWith(p))) {
    next();
    return;
  }

  const isSafe = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (isSafe) {
    next();
    return;
  }

  const binding = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];
  if (!binding || typeof binding !== 'string' || !headerToken || typeof headerToken !== 'string') {
    res.status(403).json({ error: 'csrf_token_missing' });
    return;
  }

  const expected = Buffer.from(deriveToken(binding));
  const provided = Buffer.from(headerToken);
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    res.status(403).json({ error: 'csrf_token_mismatch' });
    return;
  }
  next();
}
