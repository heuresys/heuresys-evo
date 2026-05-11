/**
 * Phase 14 Sprint 2.F — POST /api/ontology/advisor
 *
 * Returns an LLM-generated career-path advisory for an ESCO occupation.
 *
 * Body: { occupationId: string (UUID), question: string (≤500 char) }
 *
 * Status codes:
 *   200 - { answer, occupation, model, costUsd, todayCostUsd }
 *   400 - invalid body
 *   401 - unauthenticated
 *   403 - missing ESCO_KG read permission (handled upstream by NextAuth + RBP)
 *   404 - occupation not found
 *   429 - daily cost cap reached
 *   503 - { error: 'advisor_unavailable', reason: 'missing_key' }
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getOpenAIClient, isAdvisorEnabled, readAdvisorConfig } from '@/lib/ontology/openai-client';
import { checkCostCap, recordCost } from '@/lib/ontology/cost-tracker';
import { requirePermissionApi } from '@/lib/authorize-api';

const BodySchema = z.object({
  occupationId: z.string().uuid(),
  question: z.string().min(3).max(500),
});

const SYSTEM_PROMPT = `You are a senior workforce-planning advisor with deep knowledge of the ESCO occupation taxonomy. Given an ESCO occupation and a question from a hiring/HR practitioner, respond in 2 short paragraphs (max 120 words each). Cite ESCO concepts by name where relevant. Avoid speculation about specific employers or salaries.`;

export async function POST(req: Request) {
  const guard = await requirePermissionApi('ONTOLOGY', 'UPDATE');
  if (!guard.ok) return guard.response;

  const cfg = readAdvisorConfig();
  if (!isAdvisorEnabled(cfg)) {
    return NextResponse.json(
      { error: 'advisor_unavailable', reason: 'missing_key' },
      { status: 503 }
    );
  }

  let parsed: z.infer<typeof BodySchema>;
  try {
    const json = await req.json();
    parsed = BodySchema.parse(json);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'invalid_body',
        detail: err instanceof Error ? err.message : 'parse error',
      },
      { status: 400 }
    );
  }

  const occupation = await prisma.esco_occupations.findUnique({
    where: { id: parsed.occupationId },
    select: {
      id: true,
      code: true,
      preferred_label_en: true,
      preferred_label_it: true,
      description_en: true,
      isco_code: true,
    },
  });
  if (!occupation) {
    return NextResponse.json({ error: 'occupation_not_found' }, { status: 404 });
  }

  // S38 W6.2 — KG-grounded prompt enrichment: pull top 10 related skills via kg_edges
  let relatedSkillsBlock = '';
  try {
    const occupationNode = await prisma.kg_nodes.findFirst({
      where: { node_type: 'OCCUPATION', source_id: occupation.id, tenant_id: null },
      select: { id: true },
    });
    if (occupationNode) {
      const edges = await prisma.kg_edges.findMany({
        where: {
          source_node_id: occupationNode.id,
          edge_type: { in: ['REQUIRES_SKILL', 'ADJACENT_SKILL'] },
          tenant_id: null,
        },
        take: 10,
        orderBy: [{ edge_type: 'asc' }, { weight: 'desc' }],
      });
      const targetIds = edges.map((e) => e.target_node_id);
      const skillNodes = targetIds.length
        ? await prisma.kg_nodes.findMany({
            where: { id: { in: targetIds }, node_type: 'SKILL' },
            select: { id: true, label: true },
          })
        : [];
      const labelById = new Map(skillNodes.map((s) => [s.id, s.label ?? '']));
      const skillLines = edges
        .map((e) => {
          const label = labelById.get(e.target_node_id);
          if (!label) return null;
          const tag = e.edge_type === 'REQUIRES_SKILL' ? '[required]' : '[adjacent]';
          return `- ${tag} ${label}`;
        })
        .filter((s): s is string => s !== null);
      if (skillLines.length > 0) {
        relatedSkillsBlock = `\n\nESCO-grounded related skills (top ${skillLines.length}):\n${skillLines.join('\n')}`;
      }
    }
  } catch {
    // KG enrichment is best-effort; failure does not block advisor call
  }

  const cap = checkCostCap(cfg.costCapUsdDaily);
  if (!cap.allowed) {
    return NextResponse.json(
      {
        error: 'cost_cap_reached',
        todayUsd: cap.todayUsd,
        capUsd: cap.capUsd,
      },
      { status: 429 }
    );
  }

  const userPrompt = `Occupation: ${occupation.preferred_label_en} (ESCO code ${occupation.code}, ISCO ${occupation.isco_code})\nDescription: ${occupation.description_en ?? '(none)'}${relatedSkillsBlock}\n\nQuestion: ${parsed.question}`;

  try {
    const client = getOpenAIClient(cfg);
    const completion = await client.chat.completions.create({
      model: cfg.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });

    const answer = completion.choices[0]?.message?.content ?? '';
    const usage = completion.usage ?? { prompt_tokens: 0, completion_tokens: 0 };
    const costUsd = recordCost(cfg.model, usage.prompt_tokens, usage.completion_tokens);
    const updatedCap = checkCostCap(cfg.costCapUsdDaily);

    return NextResponse.json({
      answer,
      occupation: {
        id: occupation.id,
        code: occupation.code,
        labelEn: occupation.preferred_label_en,
        labelIt: occupation.preferred_label_it,
        iscoCode: occupation.isco_code,
      },
      model: cfg.model,
      costUsd,
      todayCostUsd: updatedCap.todayUsd,
      capUsd: updatedCap.capUsd,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'openai_error',
        detail: err instanceof Error ? err.message : 'unknown',
      },
      { status: 502 }
    );
  }
}
