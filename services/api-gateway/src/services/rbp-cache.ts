/**
 * RBP Cache Service — Data-Driven Permission Loading (P0 scope-cut port)
 *
 * Loads role permissions from the DBMS (rbp_roles, rbp_functional_areas,
 * rbp_role_permissions) at boot, refreshes via TTL. Replaces static role/permission
 * tables with DB-driven data per Heuresys principle P9 (Everything data-driven).
 *
 * **Scope (Phase 4 task 4.8 P0)**:
 * - 5 functional areas: EMPLOYEES, LEAVES, PERFORMANCE_REVIEWS, AUDIT, TENANT_ADMIN
 * - 8 roles + SYSADMIN alias (legacy hierarchy preserved)
 * - 6 actions: view, create, edit, delete, approve, export
 * - 6 scope types: PLATFORM, TENANT, DEPARTMENT, HIERARCHY, TEAM, SELF
 *
 * Pattern derived from legacy `services/api-gateway/src/services/rbp-cache.ts`
 * (commit `26a8fe3`) but trimmed to the P0 surface — full hierarchy resolution
 * (rbp_get_user_effective_permissions SQL function) deferred to Phase 5+ when
 * inheritance edge cases matter.
 */
import type { PrismaClient } from '../../prisma/generated/client/index.js';

// ---------------------------------------------------------------------------
// Types (kept narrow — no @heuresys/shared coupling)
// ---------------------------------------------------------------------------

export type ScopeType = 'PLATFORM' | 'TENANT' | 'DEPARTMENT' | 'HIERARCHY' | 'TEAM' | 'SELF';
export type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export interface RBPPermissionSet {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
  scopeType: ScopeType;
}

export interface RBPRole {
  code: string;
  hierarchyLevel: number;
  inheritsFrom: string | null;
}

interface CacheState {
  rolesByCode: Map<string, RBPRole>;
  permissions: Map<string, RBPPermissionSet>; // key = `${roleCode}::${areaCode}`
  loadedAt: number;
}

// ---------------------------------------------------------------------------
// RBPCacheService
// ---------------------------------------------------------------------------

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const PERM_KEY = (roleCode: string, areaCode: string) => `${roleCode}::${areaCode}`;

export class RBPCacheService {
  private state: CacheState | null = null;
  private loadingPromise: Promise<void> | null = null;
  private readonly ttlMs: number;

  constructor(
    private readonly prisma: Pick<PrismaClient, '$queryRawUnsafe'>,
    options: { ttlMs?: number } = {}
  ) {
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  }

  /**
   * Lazy load + memoize. Concurrent callers share the same in-flight promise.
   */
  async ensureLoaded(): Promise<void> {
    const fresh = this.state && Date.now() - this.state.loadedAt < this.ttlMs;
    if (fresh) return;
    if (!this.loadingPromise) {
      this.loadingPromise = this.load().finally(() => {
        this.loadingPromise = null;
      });
    }
    return this.loadingPromise;
  }

  /**
   * Force reload (ignore TTL).
   */
  async refresh(): Promise<void> {
    this.loadingPromise = this.load().finally(() => {
      this.loadingPromise = null;
    });
    return this.loadingPromise;
  }

  /**
   * Get permission set for a role + area. Returns null if absent (deny by default).
   * Caller must ensureLoaded() first.
   */
  getPermission(roleCode: string, areaCode: string): RBPPermissionSet | null {
    return this.state?.permissions.get(PERM_KEY(roleCode, areaCode)) ?? null;
  }

  /**
   * Get role metadata (hierarchy level + inheritance). Returns null if unknown role.
   */
  getRole(roleCode: string): RBPRole | null {
    return this.state?.rolesByCode.get(roleCode) ?? null;
  }

  /**
   * Quick check — does role+area+action allow operation? Reads from cache.
   */
  isAllowed(roleCode: string, areaCode: string, action: Action): boolean {
    const perm = this.getPermission(roleCode, areaCode);
    if (!perm) return false;
    switch (action) {
      case 'view':
        return perm.canView;
      case 'create':
        return perm.canCreate;
      case 'edit':
        return perm.canEdit;
      case 'delete':
        return perm.canDelete;
      case 'approve':
        return perm.canApprove;
      case 'export':
        return perm.canExport;
    }
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  private async load(): Promise<void> {
    const roles = (await this.prisma.$queryRawUnsafe(
      `SELECT code, hierarchy_level, inherits_from FROM rbp_roles WHERE is_active = true`
    )) as Array<{ code: string; hierarchy_level: number; inherits_from: string | null }>;

    const permissions = (await this.prisma.$queryRawUnsafe(
      `SELECT r.code AS role_code,
              fa.code AS area_code,
              p.can_view, p.can_create, p.can_edit, p.can_delete,
              p.can_approve, p.can_export, p.scope_type
       FROM rbp_role_permissions p
       JOIN rbp_roles r ON r.id = p.role_id
       JOIN rbp_functional_areas fa ON fa.id = p.functional_area_id
       WHERE r.is_active = true AND fa.is_active = true`
    )) as Array<{
      role_code: string;
      area_code: string;
      can_view: boolean;
      can_create: boolean;
      can_edit: boolean;
      can_delete: boolean;
      can_approve: boolean;
      can_export: boolean;
      scope_type: ScopeType;
    }>;

    const rolesByCode = new Map<string, RBPRole>();
    for (const r of roles) {
      rolesByCode.set(r.code, {
        code: r.code,
        hierarchyLevel: r.hierarchy_level,
        inheritsFrom: r.inherits_from,
      });
    }

    const permMap = new Map<string, RBPPermissionSet>();
    for (const p of permissions) {
      permMap.set(PERM_KEY(p.role_code, p.area_code), {
        canView: p.can_view,
        canCreate: p.can_create,
        canEdit: p.can_edit,
        canDelete: p.can_delete,
        canApprove: p.can_approve,
        canExport: p.can_export,
        scopeType: p.scope_type,
      });
    }

    this.state = { rolesByCode, permissions: permMap, loadedAt: Date.now() };
  }
}

/**
 * Module-level singleton, lazily initialized via setRBPCache(). Tests should
 * reset via setRBPCache(null) in beforeEach.
 */
let _instance: RBPCacheService | null = null;

export function getRBPCache(): RBPCacheService {
  if (!_instance) {
    throw new Error('RBPCacheService not initialized. Call setRBPCache() at boot.');
  }
  return _instance;
}

export function setRBPCache(instance: RBPCacheService | null): void {
  _instance = instance;
}
