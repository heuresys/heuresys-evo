import Link from 'next/link';

/**
 * Branded "Forbidden" surface for role-locked pages.
 *
 * Used by route pages that previously called `redirect('/dashboard')` silently
 * or `notFound()` when the caller lacked the required RBP role. Replaces both
 * with a clear, branded "non autorizzato" panel so users understand WHY they
 * can't see the page (vs. thinking the route doesn't exist or the click was
 * lost).
 *
 * Server component. Accepts optional explanatory hint.
 */
export function RoleForbidden({
  required,
  currentRole,
  hint,
}: {
  /** Minimum role required, e.g. 'IT_ADMIN' or 'SUPERUSER'. */
  required: string;
  /** Current user role, for explanation. */
  currentRole?: string;
  /** Optional extra hint about why this surface is role-locked. */
  hint?: string;
}) {
  return (
    <main
      role="alert"
      aria-live="polite"
      style={{
        minHeight: 'calc(100vh - 4rem)',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
        color: 'var(--ink)',
      }}
    >
      <section
        className="motion-scroll-reveal is-revealed"
        style={{
          maxWidth: 520,
          width: '100%',
          background: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-4, 10px)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <header style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
            }}
          >
            403 · accesso negato
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
              fontWeight: 600,
              fontSize: '1.5rem',
              margin: 0,
            }}
          >
            Permessi insufficienti
          </h1>
        </header>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.95rem', margin: 0 }}>
          Questa sezione richiede il ruolo <strong>{required}</strong>
          {currentRole ? (
            <>
              {' '}
              o superiore. Il tuo ruolo è <strong>{currentRole}</strong>.
            </>
          ) : (
            <>.</>
          )}
        </p>
        {hint ? (
          <p
            style={{
              color: 'var(--ink-tertiary)',
              fontSize: '0.8125rem',
              margin: 0,
              padding: '0.75rem 1rem',
              background: 'var(--surface-2)',
              border: '1px dashed var(--rule)',
              borderRadius: 'var(--radius-3, 6px)',
            }}
          >
            {hint}
          </p>
        ) : null}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Link
            href="/dashboard"
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
            Torna alla dashboard
          </Link>
          <Link
            href="/me"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.5rem',
              padding: '0 1rem',
              color: 'var(--ink-soft)',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Il mio profilo
          </Link>
        </div>
      </section>
    </main>
  );
}
