import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard capability_graph view (S41 W4-final).
 * Aggregates KG nodes/edges + ESCO top entities by edge density.
 *
 * Cross-tenant aggregations: kg_nodes / kg_edges / esco_* are platform-wide
 * reference data (no RLS) — direct prisma access is intentional.
 *
 * S45 perf: wrapped with unstable_cache (revalidate=60s).
 */

export interface KgCluster {
  id: string;
  label: string;
  color: string;
  count: number;
}

export interface KgTopEntity {
  id: string;
  entity: string;
  type: 'role' | 'competency' | 'process';
  inDegree: number;
  outDegree: number;
  centrality: number;
}

export interface EscoSyncStats {
  lastSync: { value: string; unit: string; meta: string };
  drift: { value: string; unit: string; meta: string; tone: 'ok' | 'warn' | 'critical' };
  nextSync: { value: string; unit: string; meta: string };
}

export interface CapabilityGraphLiveData {
  totals: {
    nodes: number;
    edges: number;
    density: number;
  };
  clusters: KgCluster[];
  topEntities: KgTopEntity[];
  esco: {
    skillCount: number;
    relationCount: number;
  };
  escoSync: EscoSyncStats | null;
}

const CLUSTER_DEFS = [
  {
    id: 'process',
    label: 'Process',
    color: 'var(--cap-process)',
    nodeTypes: ['process', 'workflow'],
  },
  {
    id: 'structure',
    label: 'Structure',
    color: 'var(--cap-structure)',
    nodeTypes: ['org_unit', 'department', 'team'],
  },
  { id: 'role', label: 'Role', color: 'var(--cap-role)', nodeTypes: ['role', 'job', 'occupation'] },
  {
    id: 'competency',
    label: 'Competency',
    color: 'var(--cap-competence)',
    nodeTypes: ['skill', 'competence', 'competency'],
  },
  {
    id: 'performance',
    label: 'Performance',
    color: 'var(--cap-performance)',
    nodeTypes: ['kpi', 'goal', 'outcome', 'metric'],
  },
];

function relativeAgo(ts: Date): string {
  const ms = Date.now() - ts.getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'now';
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ${min % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function relativeIn(ts: Date): string {
  const ms = ts.getTime() - Date.now();
  if (ms <= 0) return 'overdue';
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ${min % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

const FREQ_TO_HOURS: Record<string, number> = {
  hourly: 1,
  daily: 24,
  weekly: 168,
  monthly: 720,
  realtime: 0.0167,
};

async function fetchCapabilityGraphDataUncached(): Promise<CapabilityGraphLiveData> {
  try {
    const [nodeCount, edgeCount, escoSkillCount, escoRelCount, nodesByType, syncStats] =
      await Promise.all([
        prisma.kg_nodes.count(),
        prisma.kg_edges.count(),
        prisma.esco_skills.count(),
        prisma.esco_skill_relations.count(),
        prisma.kg_nodes.groupBy({ by: ['node_type'], _count: { id: true } }),
        fetchEscoSyncStats(),
      ]);

    const clusters: KgCluster[] = CLUSTER_DEFS.map((def) => {
      const count = nodesByType
        .filter((n) => def.nodeTypes.some((t) => n.node_type?.toLowerCase().includes(t)))
        .reduce((acc, n) => acc + (n._count?.id ?? 0), 0);
      return { id: def.id, label: def.label, color: def.color, count };
    });

    // Top entities by edge density. kg_edges has source_id / target_id (uuid).
    const topRaw = await prisma.$queryRaw<
      { id: string; label: string | null; node_type: string; in_deg: bigint; out_deg: bigint }[]
    >`
      WITH deg AS (
        SELECT n.id, n.label, n.node_type,
               COUNT(DISTINCT e_in.id) AS in_deg,
               COUNT(DISTINCT e_out.id) AS out_deg
        FROM kg_nodes n
        LEFT JOIN kg_edges e_in ON e_in.target_node_id = n.id AND e_in.is_active = true
        LEFT JOIN kg_edges e_out ON e_out.source_node_id = n.id AND e_out.is_active = true
        WHERE n.is_active = true
        GROUP BY n.id, n.label, n.node_type
      )
      SELECT id, label, node_type, in_deg, out_deg
      FROM deg
      ORDER BY (in_deg + out_deg) DESC
      LIMIT 7
    `;
    const maxDeg = topRaw.reduce((m, r) => {
      const total = Number(r.in_deg) + Number(r.out_deg);
      return total > m ? total : m;
    }, 1);
    const topEntities: KgTopEntity[] = topRaw.map((r) => {
      const total = Number(r.in_deg) + Number(r.out_deg);
      const lower = (r.node_type ?? '').toLowerCase();
      const type: KgTopEntity['type'] =
        lower.includes('role') || lower.includes('job') || lower.includes('occupation')
          ? 'role'
          : lower.includes('process') || lower.includes('workflow')
            ? 'process'
            : 'competency';
      return {
        id: r.id.slice(0, 16),
        entity: r.label ?? r.node_type,
        type,
        inDegree: Number(r.in_deg),
        outDegree: Number(r.out_deg),
        centrality: Math.round((total / maxDeg) * 100),
      };
    });

    const density = nodeCount > 0 ? +(edgeCount / nodeCount).toFixed(1) : 0;

    return {
      totals: { nodes: nodeCount, edges: edgeCount, density },
      clusters,
      topEntities,
      esco: { skillCount: escoSkillCount, relationCount: escoRelCount },
      escoSync: syncStats,
    };
  } catch {
    return {
      totals: { nodes: 0, edges: 0, density: 0 },
      clusters: [],
      topEntities: [],
      esco: { skillCount: 0, relationCount: 0 },
      escoSync: null,
    };
  }
}

/**
 * ESCO sync stats derived from integration_sync_logs. Since no integration
 * is currently named "ESCO", we surface the most recent successful sync of
 * any integration as a proxy for ontology-feed health.
 */
async function fetchEscoSyncStats(): Promise<EscoSyncStats | null> {
  try {
    // SAFE: SUPERUSER cross-tenant aggregation (sync log surfacing for platform view)
    const lastLog = await prisma.integration_sync_logs.findFirst({
      where: { completed_at: { not: null } },
      orderBy: { completed_at: 'desc' },
      select: {
        completed_at: true,
        status: true,
        records_created: true,
        records_updated: true,
        records_failed: true,
        integration_id: true,
      },
    });
    if (!lastLog || !lastLog.completed_at) return null;

    const integration = await prisma.integrations.findUnique({
      where: { id: lastLog.integration_id },
      select: { provider: true, sync_frequency: true, last_sync_at: true },
    });

    const last = lastLog.completed_at;
    const created = lastLog.records_created ?? 0;
    const updated = lastLog.records_updated ?? 0;
    const failed = lastLog.records_failed ?? 0;

    // 24h drift = sum of records_failed across all sync logs in last 24h
    const driftRow = await prisma.$queryRaw<{ failed: bigint }[]>`
      SELECT COALESCE(SUM(records_failed), 0)::bigint AS failed
      FROM integration_sync_logs
      WHERE created_at >= now() - interval '24 hours'
    `;
    const drift24h = Number(driftRow[0]?.failed ?? 0n);
    const driftTone: EscoSyncStats['drift']['tone'] =
      drift24h === 0 ? 'ok' : drift24h < 10 ? 'warn' : 'critical';

    const freq = integration?.sync_frequency ?? 'daily';
    const freqHours = FREQ_TO_HOURS[freq] ?? 24;
    const nextSyncDate = new Date(last.getTime() + freqHours * 3600 * 1000);

    const lastSyncRelative = relativeAgo(last);
    const lastSyncMain = lastSyncRelative.includes('h')
      ? lastSyncRelative.split(' ')[0]!
      : lastSyncRelative;
    const lastSyncRest = lastSyncRelative.includes(' ')
      ? lastSyncRelative.split(' ').slice(1).join(' ')
      : '';

    const nextRelative = relativeIn(nextSyncDate);
    const nextMain = nextRelative.includes(' ') ? nextRelative.split(' ')[0]! : nextRelative;
    const nextRest = nextRelative.includes(' ') ? nextRelative.split(' ').slice(1).join(' ') : '';

    return {
      lastSync: {
        value: lastSyncMain,
        unit: lastSyncRest ? `${lastSyncRest} ago` : 'ago',
        meta: `${created} created · ${updated} mod`,
      },
      drift: {
        value: String(drift24h),
        unit: 'drift',
        meta:
          drift24h === 0
            ? 'in sync · last 24h'
            : `${drift24h} failed in last 24h · ${failed} this run`,
        tone: driftTone,
      },
      nextSync: {
        value: nextMain,
        unit: nextRest || '',
        meta: `cron · ${freq}`,
      },
    };
  } catch {
    return null;
  }
}

export const fetchCapabilityGraphData = unstable_cache(
  fetchCapabilityGraphDataUncached,
  ['dashboard:capability-graph:v1'],
  { revalidate: 60, tags: ['dashboard:capability-graph'] }
);
