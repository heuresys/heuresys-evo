/**
 * S37 W2 — GET /api/explorer/kg/edges?employeeId=<uuid>&edgeType=<type>&limit=<n>
 *
 * Knowledge Graph edges for a given employee node (post-CASCADIA ESKAP).
 * Returns 1-hop edges (HAS_OCCUPATION, OWNS_SKILL, HAS_ROLE) + target node label.
 * Estende il pattern di /api/explorer/kg/expand (centred on occupation) verso employee.
 *
 * RBP gate: EXPLORER (tutti i ruoli RBP).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requirePermissionApi } from '@/lib/authorize-api';

const ALLOWED_EDGE_TYPES = new Set([
  'HAS_OCCUPATION',
  'OWNS_SKILL',
  'HAS_ROLE',
  'BELONGS_TO_ORG_UNIT',
  'REPORTS_TO',
  'EXECUTES_PROCESS',
]);

export async function GET(req: Request) {
  const guard = await requirePermissionApi('EXPLORER', 'READ');
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const employeeId = url.searchParams.get('employeeId');
  const edgeType = url.searchParams.get('edgeType');
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 200);

  if (!employeeId) {
    return NextResponse.json({ error: 'missing_employeeId' }, { status: 400 });
  }
  if (edgeType && !ALLOWED_EDGE_TYPES.has(edgeType)) {
    return NextResponse.json(
      { error: 'invalid_edgeType', allowed: Array.from(ALLOWED_EDGE_TYPES) },
      { status: 400 }
    );
  }

  // Resolve employee node id (kg_nodes type='EMPLOYEE', source_id=employee.uuid)
  const employeeNode = await prisma.kg_nodes.findFirst({
    where: { node_type: 'EMPLOYEE', source_id: employeeId },
    select: { id: true, label: true, tenant_id: true, metadata: true },
  });
  if (!employeeNode) {
    return NextResponse.json({ error: 'employee_node_not_found' }, { status: 404 });
  }

  const edges = await prisma.kg_edges.findMany({
    where: {
      source_node_id: employeeNode.id,
      ...(edgeType ? { edge_type: edgeType } : {}),
    },
    take: limit,
    orderBy: [{ edge_type: 'asc' }, { weight: 'desc' }],
  });

  const targetIds = edges.map((e) => e.target_node_id);
  const targets = targetIds.length
    ? await prisma.kg_nodes.findMany({
        where: { id: { in: targetIds } },
        select: { id: true, node_type: true, node_code: true, label: true, label_en: true },
      })
    : [];
  const targetById = new Map(targets.map((t) => [t.id, t]));

  return NextResponse.json({
    centre: {
      id: employeeNode.id,
      label: employeeNode.label,
      tenant_id: employeeNode.tenant_id,
      metadata: employeeNode.metadata,
    },
    edges: edges.map((e) => ({
      id: e.id,
      edge_type: e.edge_type,
      weight: e.weight,
      target: targetById.get(e.target_node_id) ?? null,
      metadata: e.metadata,
    })),
  });
}
