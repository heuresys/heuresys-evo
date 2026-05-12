import Link from 'next/link';

/**
 * Root not-found surface (S48 Brand v1.0 Stage D).
 *
 * Triggered by Next.js App Router when no route matches the request.
 * Uses brand tokens (--bg, --ink, --accent) + motion wordmark glow
 * from S48 Stage C motion library.
 */
export default function NotFound() {
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
        style={{
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div
          aria-hidden="true"
          className="motion-wordmark-glow"
          style={{
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(4rem, 12vw, 7rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: 'var(--primary)',
          }}
        >
          4<span style={{ color: 'var(--accent)' }}>0</span>4
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            margin: 0,
          }}
        >
          Pagina non <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>trovata</em>
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '0.95rem',
            margin: 0,
            maxWidth: 380,
            marginInline: 'auto',
          }}
        >
          La risorsa richiesta non esiste o è stata spostata. Verifica l&apos;URL o torna alla
          dashboard per riprendere il lavoro.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            marginTop: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/dashboard"
            className="motion-button-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-3, 6px)',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Vai alla dashboard
          </Link>
          <Link
            href="/login"
            className="motion-button-press"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.75rem',
              padding: '0 1.25rem',
              borderRadius: 'var(--radius-3, 6px)',
              border: '1px solid var(--rule-strong)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Accedi
          </Link>
        </div>
      </section>
    </main>
  );
}
