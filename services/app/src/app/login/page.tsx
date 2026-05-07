import { HeuresysWordmark } from '@heuresys/ui';
import { LoginForm } from './login-form';
import './login-aurora.css';

/**
 * /login — credentials sign-in (NextAuth v4 + Aurora brand surface).
 *
 * Visual ref: .ux-design/06-mockups/auth/login-aurora.html (D-LOGIN canonical).
 * - Animated aurora mesh background (CSS only, prefers-reduced-motion respected)
 * - Glass card with gradient border (backdrop-filter blur)
 * - Hero brand wordmark (Exo 2 700, brand-blue + accent y)
 * - Form is a client island; the rest of the page is server-rendered
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  return (
    <div className="auth-shell">
      <div className="aurora" aria-hidden="true" />
      <div className="dots" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="top-bar">
        <a href="/" className="top-back">
          ← heuresys.com
        </a>
      </header>

      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-heading">
          <h1 id="auth-heading" className="auth-hero">
            <HeuresysWordmark variant="brand" size="hero" as="span" />
          </h1>
          <p className="auth-tagline">Accedi al tuo workspace</p>

          <LoginForm initialError={sp.error} />

          <div className="auth-footnote">
            Non hai un account?{' '}
            <a href="#" aria-disabled="true">
              Contatta il tuo IT_ADMIN
            </a>
          </div>
        </section>
      </main>

      <footer className="auth-footer">
        <div className="copy">© 2026 heuresys.com — Organizational Intelligence platform</div>
        <div className="links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
          <a href="#">Status</a>
        </div>
      </footer>
    </div>
  );
}
