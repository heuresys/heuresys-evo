import { prisma } from '@/lib/db';

/**
 * Server-side fetchers for /dashboard org_systems view.
 * Pragmatic data binding: live where DB has the data, demo where not yet seeded.
 */

export interface TenantFleetRow {
  id: string;
  code: string;
  name: string;
  status: string;
  industry: string | null;
  employees: number;
  isPlatform: boolean;
  shortId: string;
}

export interface AuditEvent {
  ts: string;
  ago: string;
  action: string;
  category: string;
  description: string;
  actor: string;
  highlight?: string | null;
}

export interface RbacMeta {
  roles: number;
  areas: number;
  joins: number;
  policies: number;
}

export interface OrgSystemsLiveData {
  tenants: TenantFleetRow[];
  audit: AuditEvent[];
  rbac: RbacMeta;
  totalEmployees: number;
}

function relativeAgo(ts: Date): string {
  const ms = Date.now() - ts.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ${min % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

export async function fetchOrgSystemsData(): Promise<OrgSystemsLiveData> {
  const [tenantsRaw, auditRaw, rolesCount, areasCount, joinsCount, policiesCount, totalEmp] =
    await Promise.all([
      prisma.tenants.findMany({
        select: {
          id: true,
          code: true,
          name: true,
          status: true,
          industry_type: true,
        },
        orderBy: { created_at: 'asc' },
      }),
      prisma.audit_logs.findMany({
        select: {
          created_at: true,
          action: true,
          category: true,
          description: true,
          user_role: true,
          user_email: true,
          resource_type: true,
        },
        orderBy: { created_at: 'desc' },
        take: 6,
      }),
      prisma.rbp_roles.count(),
      prisma.rbp_functional_areas.count(),
      prisma.rbp_role_permissions.count(),
      prisma.$queryRaw<
        { c: bigint }[]
      >`SELECT count(*) as c FROM pg_policies WHERE schemaname = 'public'`,
      prisma.employees.count({ where: { is_active: true } }),
    ]);

  // Fetch live employee counts per tenant
  const empCounts = await prisma.employees.groupBy({
    by: ['tenant_id'],
    where: { is_active: true },
    _count: { id: true },
  });
  const empByTenant = new Map<string, number>();
  for (const c of empCounts) {
    if (c.tenant_id) empByTenant.set(c.tenant_id, c._count.id);
  }

  const tenants: TenantFleetRow[] = tenantsRaw.map((t) => ({
    id: t.id,
    code: t.code,
    name: t.name,
    status: t.status ?? 'active',
    industry: t.industry_type ?? null,
    employees: empByTenant.get(t.id) ?? 0,
    isPlatform: t.code === 'heuresys' || t.name.toLowerCase().includes('heuresys system'),
    shortId: t.id.slice(0, 8),
  }));

  const audit: AuditEvent[] = auditRaw.map((a) => {
    const created = a.created_at ?? new Date();
    return {
      ts: created.toISOString(),
      ago: relativeAgo(created),
      action: a.action,
      category: a.category,
      description: a.description,
      actor: a.user_email ?? a.user_role ?? 'system',
      highlight: a.resource_type,
    };
  });

  return {
    tenants,
    audit,
    rbac: {
      roles: rolesCount,
      areas: areasCount,
      joins: joinsCount,
      policies: Number(policiesCount[0]?.c ?? 0),
    },
    totalEmployees: totalEmp,
  };
}
