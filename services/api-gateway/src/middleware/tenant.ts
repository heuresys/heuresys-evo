import type { Request, Response, NextFunction } from 'express';

/**
 * resolveTenant middleware — stamps `req.tenantId` from session/header.
 *
 * Resolution order:
 *   1. session.user.tenantId (set by Auth.js callback in A5)
 *   2. X-Tenant-Id request header (dev override, never trust in prod)
 *   3. Reject with 400 if neither is present.
 *
 * Must run AFTER `requireAuth`.
 */
export function resolveTenant(req: Request, res: Response, next: NextFunction): void {
  const sessionTenantId: string | undefined = (req.session?.user as { tenantId?: string } | undefined)?.tenantId;
  const headerTenantId =
    typeof req.headers['x-tenant-id'] === 'string' ? req.headers['x-tenant-id'] : undefined;

  const tenantId = sessionTenantId ?? headerTenantId;

  if (!tenantId) {
    res.status(400).json({ error: 'tenant_required', message: 'No tenantId resolved from session or X-Tenant-Id header' });
    return;
  }

  req.tenantId = tenantId;
  next();
}
