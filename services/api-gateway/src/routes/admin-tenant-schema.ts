import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { withTenant } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';
import { getRBPCache } from '../services/rbp-cache.js';
import { auditedTransaction } from '../lib/audit/auditedTransaction.js';
import { buildActor } from '../lib/audit/buildActor.js';

/**
 * Tenant schema version admin route — RTG Phase 4 task 4.12 (ADR-0017).
 *
 *   GET  /admin/tenant-schema-version   — read current version + recent history
 *   POST /admin/tenant-schema-version/bump — admin-only, inserts new row at MAX+1
 *
 * RBP area: TENANT_ADMIN. Both endpoints scope-locked to caller's tenant via
 * withTenant + RLS policy `tenant_isolation_tenant_schema_version`.
 */

const BumpBodySchema = z.object({
  notes: z.string().min(1).max(1000),
});

interface SessionEnvelope {
  user?: { id?: string; role?: string };
}

export const adminTenantSchemaRouter = Router();

adminTenantSchemaRouter.get(
  '/',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const role = (req as Request & { session?: SessionEnvelope }).session?.user?.role ?? '';
      if (!cache.isAllowed(role, 'TENANT_ADMIN', 'view')) {
        res.status(403).json({ error: 'forbidden', area: 'TENANT_ADMIN', action: 'view' });
        return;
      }

      const data = await withTenant(req.tenantId!, async (tx) => {
        const rows = (await tx.$queryRawUnsafe(
          `SELECT id, tenant_id, version, applied_at, applied_by, notes
           FROM tenant_schema_version
           ORDER BY version DESC
           LIMIT 20`
        )) as Array<{ version: number }>;
        return rows;
      });

      const current = data[0]?.version ?? 0;
      res.json({ data: { current, history: data } });
    } catch (err) {
      next(err);
    }
  }
);

adminTenantSchemaRouter.post(
  '/bump',
  requireAuth,
  resolveTenant,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cache = getRBPCache();
      await cache.ensureLoaded();
      const session = (req as Request & { session?: SessionEnvelope }).session;
      const role = session?.user?.role ?? '';
      if (!cache.isAllowed(role, 'TENANT_ADMIN', 'edit')) {
        res.status(403).json({ error: 'forbidden', area: 'TENANT_ADMIN', action: 'edit' });
        return;
      }
      const { notes } = BumpBodySchema.parse(req.body);
      const callerId = session?.user?.id ?? null;

      const actor = buildActor(req, req.tenantId!);
      const { result: inserted } = await auditedTransaction(
        actor,
        {
          action: 'CREATE',
          category: 'CONFIG',
          resourceType: 'tenant_schema_version',
          resourceId: 'pending',
          resourceName: `tenant-schema-bump:${req.tenantId}`,
          newValue: { notes, applied_by: callerId },
          metadata: { source: 'api-gateway:admin-tenant-schema.POST_bump' },
        },
        async (tx) => {
          const rows = (await tx.$queryRawUnsafe(
            `INSERT INTO tenant_schema_version (tenant_id, version, applied_by, notes)
             SELECT $1::uuid,
                    COALESCE(MAX(version), 0) + 1,
                    $2::uuid,
                    $3
             FROM tenant_schema_version
             WHERE tenant_id = $1::uuid
             RETURNING id, version, applied_at, notes`,
            req.tenantId,
            callerId,
            notes
          )) as Array<{ version: number }>;
          return rows[0];
        }
      );

      res.status(201).json({ data: inserted });
    } catch (err) {
      next(err);
    }
  }
);
