import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getCachedTenantName } from '@/lib/dashboard-engine/dashboard-meta-cache';
import { ThemeToggle } from '@/app/(app)/_components/ThemeToggle';
import { LocaleSwitcher } from '@/lib/i18n';
import { SignOutButton } from './_signout-button';

/**
 * /settings — branded 5-tab user surface (S49 Brand v1.0 Stage D closure).
 *
 * Server-rendered, navigated via `?tab=<id>`. Tabs: profile / theme / locale /
 * notifications / sessions. Notifications form is UI-only stub (persistence
 * deferred to v1.1). Sessions tab exposes current JWT-derived session card
 * plus client-side sign-out.
 */

const TABS = [
  { id: 'profile', label: 'Profilo' },
  { id: 'theme', label: 'Tema' },
  { id: 'locale', label: 'Lingua' },
  { id: 'notifications', label: 'Notifiche' },
  { id: 'sessions', label: 'Sessioni' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function parseTab(raw: string | string[] | undefined): TabId {
  const v = Array.isArray(raw) ? raw[0] : raw;
  const found = TABS.find((t) => t.id === v);
  return found ? found.id : 'profile';
}

interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await auth();
  if (!session?.user) redirect('/login?next=/settings');

  const user = session.user as {
    id?: string;
    role?: string;
    tenantId?: string;
    name?: string | null;
    username?: string;
    email?: string;
  };
  const tenantId = user.tenantId ?? null;
  const tenantName = tenantId
    ? ((await getCachedTenantName(tenantId)) ?? 'Heuresys System')
    : 'Heuresys System';

  const sp = await searchParams;
  const current = parseTab(sp.tab);

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
        color: 'var(--ink)',
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1.75rem',
            margin: 0,
          }}
        >
          Impostazioni
        </h1>
        <p
          style={{
            color: 'var(--ink-soft)',
            fontSize: '0.95rem',
            margin: '0.25rem 0 0',
          }}
        >
          Preferenze personali, aspetto, lingua, notifiche e sessione attiva.
        </p>
      </header>

      <TabNav current={current} />

      <section
        className="motion-scroll-reveal is-revealed"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-4, 10px)',
          padding: '1.75rem',
          marginTop: '1rem',
        }}
        aria-live="polite"
      >
        {current === 'profile' && (
          <ProfileTab
            displayName={user.name ?? user.username ?? ''}
            username={user.username ?? ''}
            email={user.email ?? ''}
            role={user.role ?? 'EMPLOYEE'}
            tenantName={tenantName}
          />
        )}
        {current === 'theme' && <ThemeTab />}
        {current === 'locale' && <LocaleTab />}
        {current === 'notifications' && <NotificationsTab />}
        {current === 'sessions' && (
          <SessionsTab
            username={user.username ?? user.email ?? ''}
            role={user.role ?? 'EMPLOYEE'}
            tenantName={tenantName}
          />
        )}
      </section>
    </main>
  );
}

function TabNav({ current }: { current: TabId }) {
  return (
    <nav aria-label="Impostazioni" role="tablist">
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          gap: '0.25rem',
          borderBottom: '1px solid var(--rule)',
          overflowX: 'auto',
        }}
      >
        {TABS.map((t) => {
          const isActive = t.id === current;
          return (
            <li key={t.id} role="presentation">
              <Link
                href={`/settings?tab=${t.id}`}
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '2.5rem',
                  padding: '0 1rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--primary)' : 'var(--ink-soft)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-1px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ProfileTab({
  displayName,
  username,
  email,
  role,
  tenantName,
}: {
  displayName: string;
  username: string;
  email: string;
  role: string;
  tenantName: string;
}) {
  const initials = (displayName || username || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <SectionHead title="Profilo" subtitle="Dati identificativi del tuo account." />
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3, 6px)',
          border: '1px solid var(--rule)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          {initials || 'U'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{displayName || username}</div>
          <div style={{ color: 'var(--ink-soft)', fontSize: '0.875rem' }}>{email || username}</div>
        </div>
      </div>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(120px, max-content) 1fr',
          gap: '0.625rem 1.25rem',
          margin: 0,
          fontSize: '0.9rem',
        }}
      >
        <dt style={{ color: 'var(--ink-tertiary)' }}>Username</dt>
        <dd
          style={{
            margin: 0,
            fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
            fontSize: '0.85rem',
          }}
        >
          {username || '—'}
        </dd>
        <dt style={{ color: 'var(--ink-tertiary)' }}>Email</dt>
        <dd style={{ margin: 0 }}>{email || '—'}</dd>
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
        <dt style={{ color: 'var(--ink-tertiary)' }}>Tenant</dt>
        <dd style={{ margin: 0, fontWeight: 500 }}>{tenantName}</dd>
      </dl>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8125rem', margin: 0 }}>
        Modifiche al profilo richiedono l&apos;intervento di un amministratore. Contatta l&apos;IT
        per aggiornare email o ruolo.
      </p>
    </div>
  );
}

function ThemeTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <SectionHead
        title="Tema"
        subtitle="Modalità chiara o scura. La palette colore è gestita dall'editor brand studio."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3, 6px)',
          border: '1px solid var(--rule)',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Modalità chiaro/scuro</div>
          <div style={{ color: 'var(--ink-tertiary)', fontSize: '0.8125rem' }}>
            La preferenza è memorizzata localmente su questo dispositivo.
          </div>
        </div>
        <ThemeToggle />
      </div>
      <div
        style={{
          padding: '1rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3, 6px)',
          border: '1px solid var(--rule)',
        }}
      >
        <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
          Palette colore
        </div>
        <div
          style={{
            color: 'var(--ink-tertiary)',
            fontSize: '0.8125rem',
            marginBottom: '0.75rem',
          }}
        >
          Apri l&apos;editor brand studio per cambiare palette · 12 famiglie · 24 varianti.
        </div>
        <Link
          href="/brand-studio"
          className="motion-button-press"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: '2.25rem',
            padding: '0 1rem',
            borderRadius: 'var(--radius-3, 6px)',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Apri Brand Studio →
        </Link>
      </div>
    </div>
  );
}

function LocaleTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <SectionHead
        title="Lingua"
        subtitle="Lingua dell'interfaccia. I termini tecnici e i codici restano in inglese."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3, 6px)',
          border: '1px solid var(--rule)',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Locale interfaccia</div>
          <div style={{ color: 'var(--ink-tertiary)', fontSize: '0.8125rem' }}>
            Italiano (default) · English
          </div>
        </div>
        <LocaleSwitcher />
      </div>
    </div>
  );
}

function NotificationsTab() {
  const PREFS = [
    {
      id: 'review-due',
      label: 'Review imminenti',
      desc: 'Email quando un review cycle entra in finestra di completamento.',
    },
    {
      id: 'goal-update',
      label: 'Aggiornamenti obiettivi',
      desc: 'In-app quando un goal collegato a te cambia stato.',
    },
    {
      id: 'skill-gap',
      label: 'Skill gap rilevati',
      desc: 'Digest settimanale dei gap rispetto alle competenze attese.',
    },
    {
      id: 'org-changes',
      label: 'Cambi organizzativi',
      desc: 'Notifica per cambi di line manager o di OrgUnit.',
    },
    {
      id: 'security',
      label: 'Eventi di sicurezza',
      desc: 'Sempre attivi · accessi anomali e cambio password.',
      locked: true,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <SectionHead
        title="Notifiche"
        subtitle="Preferenze di canale per categoria. La persistenza arriva in v1.1."
      />
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {PREFS.map((p) => (
          <li
            key={p.id}
            className="motion-card-lift"
            style={{
              padding: '0.875rem 1rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-3, 6px)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p.label}</div>
              <div style={{ color: 'var(--ink-tertiary)', fontSize: '0.8125rem' }}>{p.desc}</div>
            </div>
            <div
              role="switch"
              aria-checked={!p.locked}
              aria-disabled={p.locked ? true : undefined}
              aria-label={`${p.label} ${p.locked ? '(sempre attivo)' : '(attivo)'}`}
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                background: 'var(--primary)',
                opacity: p.locked ? 0.5 : 1,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 18,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-3, 6px)',
          border: '1px dashed var(--rule-strong, var(--rule))',
          fontSize: '0.8125rem',
          color: 'var(--ink-tertiary)',
        }}
      >
        Le preferenze visualizzate sono indicative. La persistenza nel database utente sarà attivata
        in una release successiva.
      </div>
    </div>
  );
}

function SessionsTab({
  username,
  role,
  tenantName,
}: {
  username: string;
  role: string;
  tenantName: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <SectionHead
        title="Sessioni attive"
        subtitle="Sessione corrente. Heuresys usa JWT stateless: la cronologia multi-dispositivo non è disponibile."
      />
      <div
        style={{
          padding: '1.25rem',
          background: 'var(--surface-2)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-3, 6px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent)',
            }}
          />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Sessione corrente</span>
        </div>
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(100px, max-content) 1fr',
            gap: '0.5rem 1.25rem',
            margin: 0,
            fontSize: '0.875rem',
          }}
        >
          <dt style={{ color: 'var(--ink-tertiary)' }}>Username</dt>
          <dd
            style={{
              margin: 0,
              fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
              fontSize: '0.825rem',
            }}
          >
            {username}
          </dd>
          <dt style={{ color: 'var(--ink-tertiary)' }}>Ruolo</dt>
          <dd
            style={{
              margin: 0,
              fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace',
              fontSize: '0.825rem',
              color: 'var(--accent)',
            }}
          >
            {role}
          </dd>
          <dt style={{ color: 'var(--ink-tertiary)' }}>Tenant</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{tenantName}</dd>
          <dt style={{ color: 'var(--ink-tertiary)' }}>Modalità</dt>
          <dd style={{ margin: 0 }}>NextAuth · JWT stateless · cookie HttpOnly</dd>
        </dl>
        <div style={{ marginTop: '0.5rem' }}>
          <SignOutButton />
        </div>
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8125rem', margin: 0 }}>
        Per terminare ogni sessione attiva su tutti i dispositivi, ruota la password dal pannello
        amministrazione (richiesto: contatto IT).
      </p>
    </div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <h2
        style={{
          fontFamily: 'var(--font-exo2), "Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', margin: 0 }}>{subtitle}</p>
    </div>
  );
}
