import { prisma } from '@/lib/db';

/**
 * Server-side fetcher for /dashboard capability_graph view (S41 W4-final).
 * Aggregates KG nodes/edges + ESCO top entities by edge density.
 *
 * Cross-tenant aggregations: kg_nodes / kg_edges / esco_* are platform-wide
 * reference data (no RLS) — direct prisma access is intentional.
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

export async function fetchCapabilityGraphData(): Promise<CapabilityGraphLiveData> {
  try {
    const [nodeCount, edgeCount, escoSkillCount, escoRelCount, nodesByType] = await Promise.all([
      prisma.kg_nodes.count(),
      prisma.kg_edges.count(),
      prisma.esco_skills.count(),
      prisma.esco_skill_relations.count(),
      prisma.kg_nodes.groupBy({ by: ['node_type'], _count: { id: true } }),
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
    };
  } catch {
    return {
      totals: { nodes: 0, edges: 0, density: 0 },
      clusters: [],
      topEntities: [],
      esco: { skillCount: 0, relationCount: 0 },
    };
  }
}
