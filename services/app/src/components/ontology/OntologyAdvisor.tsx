'use client';

/**
 * Phase 14 Sprint 2.F — OntologyAdvisor client component.
 *
 * Form-driven panel that POSTs to /api/ontology/advisor and renders the
 * answer + usage info inline. When `advisorEnabled` is false (no
 * OPENAI_API_KEY set), it renders a "Setup required" panel instead so the
 * UI degrades gracefully on dev/staging without leaking server config.
 */

import { useState, useTransition } from 'react';

interface OccupationContext {
  id: string;
  code: string | null;
  labelEn: string;
  labelIt: string;
  descriptionEn: string;
  iscoCode: string;
}

interface AdvisorResponse {
  answer: string;
  model: string;
  costUsd: number;
  todayCostUsd: number;
  capUsd: number;
}

export function OntologyAdvisor({
  occupation,
  advisorEnabled,
}: {
  occupation: OccupationContext;
  advisorEnabled: boolean;
}) {
  const [question, setQuestion] = useState('What career paths typically lead into this role?');
  const [response, setResponse] = useState<AdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!advisorEnabled) {
    return (
      <div
        className="rounded-md border border-amber-300 bg-amber-50 p-4"
        data-testid="advisor-disabled"
      >
        <p className="text-sm font-medium text-amber-900">Advisor unavailable — setup required</p>
        <p className="mt-1 text-xs text-amber-800">
          Set <code className="rounded bg-amber-100 px-1">OPENAI_API_KEY</code> in
          <code className="ml-1 rounded bg-amber-100 px-1">services/api-gateway/.env</code> and
          restart Next.js. See <code>docs/setup/openai-advisor.md</code> for the full setup,
          including the daily cost cap (<code>OPENAI_COST_CAP_USD_DAILY</code>).
        </p>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResponse(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/ontology/advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ occupationId: occupation.id, question }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          setError(json.error ?? `HTTP ${res.status}`);
          return;
        }
        setResponse((await res.json()) as AdvisorResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'unknown error');
      }
    });
  }

  return (
    <div className="rounded-md border border-neutral-200 p-4" data-testid="advisor-panel">
      <h3 className="text-sm font-medium">{occupation.labelEn}</h3>
      <p className="mt-1 text-xs text-neutral-500">
        ESCO {occupation.code} · ISCO {occupation.iscoCode}
      </p>

      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
        <textarea
          name="question"
          rows={3}
          maxLength={500}
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg disabled:opacity-60"
          data-testid="advisor-submit"
        >
          {isPending ? 'Asking…' : 'Ask advisor'}
        </button>
      </form>

      {error && (
        <p
          className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          data-testid="advisor-error"
        >
          {error}
        </p>
      )}

      {response && (
        <div className="mt-3 space-y-2" data-testid="advisor-response">
          <p className="whitespace-pre-line text-sm">{response.answer}</p>
          <p className="text-xs text-neutral-500">
            Model {response.model} · ${response.costUsd.toFixed(4)} this call · today $
            {response.todayCostUsd.toFixed(2)} / cap ${response.capUsd.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
