import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../prisma/generated/client/index.js';
import { randomUUID } from 'node:crypto';

/**
 * Centralized error handler. Maps known error classes to clean JSON
 * responses; unknown errors get a generic 500 with a request-id that
 * appears in logs for correlation.
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const requestId = randomUUID();

  if (err instanceof ZodError) {
    req.log?.warn({ requestId, issues: err.issues }, 'zod validation failed');
    res.status(400).json({ error: 'validation_failed', issues: err.issues, requestId });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    req.log?.error({ requestId, code: err.code, meta: err.meta }, 'prisma known error');
    res.status(500).json({ error: 'database_error', code: err.code, requestId });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    req.log?.error({ requestId }, 'prisma validation error');
    res.status(500).json({ error: 'database_validation_error', requestId });
    return;
  }

  const message = err instanceof Error ? err.message : 'unknown';
  req.log?.error({ requestId, err }, 'unhandled error');
  res.status(500).json({ error: 'internal', message, requestId });
}
