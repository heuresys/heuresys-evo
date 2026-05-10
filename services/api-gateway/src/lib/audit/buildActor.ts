/**
 * Shared `buildActor` helper for routes that wrap mutations in
 * `auditedTransaction()`. Extracted from employees.ts (Wave 8 pattern)
 * during F2 sweep so all api-gateway routes converge on a single
 * canonical actor-construction path.
 *
 * Reads the request session envelope (decoded by api-gateway middleware
 * `auth.ts` — supports NextAuth v4 cookies via jose+HKDF and Auth.js v5
 * fallback) and produces an `AuditActor` ready for `auditedTransaction()`
 * or `auditEvent()`.
 *
 * Hard-fails when `session.user.id` is missing — enforces P4 invariant
 * (no NULL actor in audit_logs).
 */

import type { Request } from 'express';
import type { AuditActor } from './auditedTransaction.js';

interface SessionEnvelope {
  user?: {
    id?: string;
    role?: string;
    tenantId?: string | null;
    employeeId?: string | null;
    email?: string | null;
  };
}

export function readSession(req: Request): SessionEnvelope {
  return (req as Request & { session?: SessionEnvelope | null }).session ?? {};
}

/**
 * Build AuditActor from request session + tenantId. Throws if userId missing
 * (P4 invariant: no NULL actor in audit_logs).
 */
export function buildActor(req: Request, tenantId: string): AuditActor {
  const session = readSession(req);
  const userId = session.user?.id;
  if (!userId) {
    throw new Error('audit actor missing user.id (P4 violation)');
  }
  return {
    tenantId,
    userId,
    userEmail: session.user?.email ?? null,
    userRole: session.user?.role ?? null,
    ipAddress: req.ip ?? null,
    userAgent: req.headers['user-agent'] ?? null,
  };
}
