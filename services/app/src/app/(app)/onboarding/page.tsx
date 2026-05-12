import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { withTenant } from '@/lib/db';
import { getCachedTenantName } from '@/lib/dashboard-engine/dashboard-meta-cache';

async function fetchFirstName(tenantId: string, userId: string): Promise<string | null> {
  try {
    return await withTenant(tenantId, async (tx) => {
      const u = await tx.users.findUnique({
        where: { id: userId },
        select: { employee_id: true },
      });
      if (!u?.employee_id) return null;
      const emp = await tx.employees.findUnique({
        where: { id: u.employee_id },
        select: { first_name: true },
      });
      return emp?.first_name ?? null;
    });
  } catch {
    return null;
  }
}

/**
 * /onboarding — branded 4-step welcome surface (S48 Brand v1.0 Stage D).
 *
 * Server-rendered stepper navigated via `?step=N` query param. Each step
 * is a static panel + Link to the next. No client state: choices in step 3
 * route directly to the relevant primary surface.
 *
 * Sequence: welcome -> tenant -> perspective -> done.
 */

const STEPS = ['welcome', 'tenant', 'perspective', 'done'] as const;
type Step = (typeof STEPS)[number];

function parseStep(raw: string | string[] | undefined): Step {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  const idx = Number.isFinite(n) ? Math.min(Math.max(Math.floor(n - 1), 0), STEPS.length - 1) : 0;
  return STEPS[idx]!;
}

interface OnboardingPageProps {
  searchParams: Promise<{ step?: string }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/onboarding');

  const user = session.user as {
    id?: string;
    role?: string;
    tenantId?: string;
    name?: string | null;
    username?: string;
  };
  const role = user.role ?? 'EMPLOYEE';
  const tenantId = user.tenantId ?? null;
  const firstNameLive = tenantId && user.id ? await fetchFirstName(tenantId, user.id) : null;
  // Priority: employees.first_name (canonical) > session name > username prefix (no email).
  const fallbackFromUsername = (user.username ?? '').split('@')[0]?.split('.')[0] ?? '';
  const fallbackTitleCase = fallbackFromUsername
    ? fallbackFromUsername.charAt(0).toUpperCase() + fallbackFromUsername.slice(1).toLowerCase()
    : '';
  const displayName = firstNameLive ?? user.name ?? fallbackTitleCase;
  const tenantName = tenantId
    ? ((await getCachedTenantName(tenantId)) ?? 'Heuresys System')
    : 'Heuresys System';

  const sp = await searchParams;
  const current = parseStep(sp.step);
  const currentIdx = STEPS.indexOf(current);
  const nextStepHref =
    currentIdx < STEPS.length - 1 ? `/onboarding?step=${currentIdx + 2}` : '/dashboard';

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg)',
        color: 'var(--ink)',
        padding: '2rem',
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
      }}
    >
      <section
        className="motion-scroll-reveal is-revealed"
        style={{
          maxWidth: 560,
          width: '100%',
          background: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-4, 10px)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Stepper currentIdx={currentIdx} />
        {current === 'welcome' && <StepWelcome displayName={displayName} />}
        {current === 'tenant' && <StepTenant tenantName={tenantName} role={role} />}
        {current === 'perspective' && <StepPerspective />}
        {current === 'done' && <StepDone displayName={displayName} />}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--rule)',
          }}
        >
          {currentIdx > 0 ? (
            <Link
              href={`/onboarding?step=${currentIdx}`}
              style={{
                color: 'var(--ink-soft)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              ← Indietro
            </Link>
          ) : (
            <span />
          )}
          <Link
            href={nextStepHref}
            className="motion-button-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.5rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-3, 6px)',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {current === 'done' ? 'Vai alla dashboard' : 'Avanti →'}
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stepper({ currentIdx }: { currentIdx: number }) {
  return (
    <ol
      aria-label="Onboarding progress"
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        gap: '0.5rem',
      }}
    >
      {STEPS.map((label, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          <li
            key={label}
            aria-current={isActive ? 'step' : undefined}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: isDone
                ? 'var(--accent)'
                : isActive
                  ? 'var(--primary)'
                  : 'var(--rule-strong)',
              opacity: isActive || isDone ? 1 : 0.6,
            }}
          />
        );
      })}
    </ol>
  );
}

function StepWelcome({ displayName }: { displayName: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h1
        style={{
          fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.75rem',
          margin: 0,
        }}
      >
        Benvenut<em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>o</em> su Heuresys
        {displayName ? `, ${displayName.split(' ')[0]}` : ''}
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', margin: 0 }}>
        Tre passi rapidi per orientarti: contesto del tuo tenant, prospettiva di lavoro, e accesso
        alla dashboard di partenza.
      </p>
    </div>
  );
}

function StepTenant({ tenantName, role }: { tenantName: string; role: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h2
        style={{
          fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.35rem',
          margin: 0,
        }}
      >
        Il tuo contesto
      </h2>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0.5rem 1rem',
          margin: 0,
          fontSize: '0.9rem',
        }}
      >
        <dt style={{ color: 'var(--ink-tertiary)' }}>Tenant</dt>
        <dd style={{ margin: 0, fontWeight: 500 }}>{tenantName}</dd>
        <dt style={{ color: 'var(--ink-tertiary)' }}>Ruolo</dt>
        <dd
          style={{
            margin: 0,
            fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
            fontSize: '0.85rem',
            color: 'var(--accent)',
          }}
        >
          {role}
        </dd>
      </dl>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', margin: 0 }}>
        Tutti i dati che vedrai appartengono al tuo tenant. Cambia organizzazione contattando
        l&apos;amministratore.
      </p>
    </div>
  );
}

function StepPerspective() {
  const PERSPECTIVES = [
    { label: 'Process', desc: 'Workflow, governance, audit' },
    { label: 'Enterprise', desc: 'Struttura, ruoli, capability' },
    { label: 'Talent', desc: 'Persone, skill, performance' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h2
        style={{
          fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.35rem',
          margin: 0,
        }}
      >
        Le tre prospettive
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
        {PERSPECTIVES.map((p) => (
          <li
            key={p.label}
            className="motion-card-lift"
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-3, 6px)',
              background: 'var(--surface-2)',
            }}
          >
            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{p.label}</div>
            <div style={{ color: 'var(--ink-tertiary)', fontSize: '0.825rem' }}>{p.desc}</div>
          </li>
        ))}
      </ul>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', margin: 0 }}>
        La dashboard del tuo ruolo seleziona automaticamente la prospettiva più rilevante.
      </p>
    </div>
  );
}

function StepDone({ displayName }: { displayName: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div
        aria-hidden="true"
        className="motion-wordmark-glow"
        style={{
          fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          color: 'var(--primary)',
          lineHeight: 1,
        }}
      >
        Tutto pronto<span style={{ color: 'var(--accent)' }}>.</span>
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', margin: 0 }}>
        {displayName ? `${displayName.split(' ')[0]}, ` : ''}la tua dashboard è configurata e
        pronta. Buon lavoro.
      </p>
    </div>
  );
}
