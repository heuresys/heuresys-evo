import pinoHttp from 'pino-http';
import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Structured Pino HTTP logger with secret redaction + request-id correlation.
 * (RTGB B5.1, B5.2, B5.6)
 *
 * - Request id: pulled from inbound `x-request-id` header (idempotent retry
 *   safe) or generated server-side. Echoed in response header.
 * - Redaction: covers Authorization, Cookie, Set-Cookie, X-CSRF-Token,
 *   AUTH_SECRET-shaped strings, and well-known credential headers.
 * - Custom log level: 5xx -> error, 4xx -> warn, else info.
 * - Pretty print only in dev (LOG_PRETTY=1 or NODE_ENV=development).
 */
const isDev = process.env.NODE_ENV !== 'production';
const usePretty = process.env.LOG_PRETTY === '1' || isDev;

export const logger = pinoHttp({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  genReqId: (req: IncomingMessage, res: ServerResponse) => {
    const inbound = req.headers['x-request-id'];
    const id =
      typeof inbound === 'string' && inbound.length > 0 && inbound.length <= 200
        ? inbound
        : crypto.randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-csrf-token"]',
      'req.headers["x-api-key"]',
      'req.headers["proxy-authorization"]',
      'req.headers["set-cookie"]',
      'res.headers["set-cookie"]',
      '*.password',
      '*.password_hash',
      '*.token',
      '*.access_token',
      '*.refresh_token',
      '*.api_key',
      '*.secret',
    ],
    censor: '[REDACTED]',
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} ${res.statusCode}: ${err.message}`,
  base: {
    service: 'api-gateway',
    pid: process.pid,
    hostname: process.env.HOSTNAME ?? 'unknown',
    env: process.env.NODE_ENV ?? 'development',
  },
  transport: usePretty
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname,service',
        },
      }
    : undefined,
});
