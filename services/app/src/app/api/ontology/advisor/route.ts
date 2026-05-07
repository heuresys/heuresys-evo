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
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getOpenAIClient, isAdvisorEnabled, readAdvisorConfig } from '@/lib/ontology/openai-client';
import { checkCostCap, recordCost } from '@/lib/ontology/cost-tracker';

const BodySchema = z.object({
  occupationId: z.string().uuid(),
  question: z.string().min(3).max(500),
});

const SYSTEM_PROMPT = `You are a senior workforce-planning advisor with deep knowledge of the ESCO occupation taxonomy. Given an ESCO occupation and a question from a hiring/HR practitioner, respond in 2 short paragraphs (max 120 words each). Cite ESCO concepts by name where relevant. Avoid speculation about specific employers or salaries.`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

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

  const userPrompt = `Occupation: ${occupation.preferred_label_en} (ESCO code ${occupation.code}, ISCO ${occupation.isco_code})\nDescription: ${occupation.description_en ?? '(none)'}\n\nQuestion: ${parsed.question}`;

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
