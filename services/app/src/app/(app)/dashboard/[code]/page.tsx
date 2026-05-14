import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loadDashboardPreset, prefetchElements, resolveElements } from '@/lib/dashboard-engine';
import { getCachedTenantName } from '@/lib/dashboard-engine/dashboard-meta-cache';
import { DashboardRenderer, type DashboardRendererSlot } from '@/components/DashboardRenderer';
import { DEFAULT_LOCALE, isLocale, pickBilingual, type Locale } from '@/lib/i18n';

/**
 * /dashboard/[code] — explicit preset access (override route).
 *
 * Phase 15.A — same brand-fedele chrome as /dashboard canonical.
 * Used for admin preview, super-user simulation, or direct linking to a
 * non-default preset.
 */

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ observer?: string; lang?: string }>;
}

export default async function DashboardCodePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { observer, lang } = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(`/dashboard/${code}`)}`);
  }

  const user = session.user as {
    role?: string;
    tenantId?: string;
    username?: string;
  };
  const role = user.role ?? null;
  const tenantId = user.tenantId ?? null;

  // P2 (L61 carry-forward): se l'URL punta a un preset v1 ma esiste la versione
  // v2 (G6 adoption, 10-12 elements brand-fedeli), redirect alla v2 preservando
  // i query params. Evita l'esperienza "0 widget" quando il preset legacy v1 ha
  // solo 3-4 elements seedati (vs ~11 nei v2).
  if (!code.endsWith('_v2')) {
    const v2Preset = await loadDashboardPreset(`${code}_v2`, {
      tenantId,
      requirePublished: true,
    });
    if (v2Preset) {
      const qs = new URLSearchParams();
      if (observer) qs.set('observer', observer);
      if (lang) qs.set('lang', lang);
      const suffix = qs.toString();
      redirect(`/dashboard/${code}_v2${suffix ? `?${suffix}` : ''}`);
    }
  }

  const preset = await loadDashboardPreset(code, {
    tenantId,
    requirePublished: true,
  });

  if (!preset) notFound();

  const visibleElements = resolveElements(preset.dashboard_elements, {
    role,
    perspective: observer ?? null,
  });

  const prefetched = await prefetchElements(visibleElements, {
    tenantId,
    role,
  });

  const tenantNameRaw = tenantId ? await getCachedTenantName(tenantId) : null;
  const tenantName = tenantNameRaw ?? 'Heuresys System';

  const presetName = pickBilingual(preset, 'name', locale);
  const presetDescription = pickBilingual(preset, 'description', locale);
  const personaLabel = preset.persona_label ?? null;
  const perspectiveLabel = observer ? observer.toUpperCase() : preset.perspective_code;

  // Multi-word accent support (cycle 2 Phase 0 T0.7): if presetName contains
  // `||`, split into [plain, accent] preserving multi-word accent phrases
  // ("Talent & capability||al colpo d'occhio" → "Talent & capability" / "al colpo d'occhio").
  // Fallback to legacy split-last-word for presets without delimiter.
  let titlePlain: string;
  let titleAccent: string;
  if (presetName.includes('||')) {
    const [plain, accent] = presetName.split('||');
    titlePlain = (plain ?? '').trim();
    titleAccent = (accent ?? '').trim();
  } else {
    const titleParts = presetName.trim().split(/\s+/);
    titleAccent = titleParts.length > 1 ? (titleParts.pop() ?? '') : '';
    titlePlain = titleParts.join(' ') || presetName;
  }

  const breadcrumb = personaLabel
    ? `DASHBOARD · ${perspectiveLabel} · ${personaLabel}`
    : role
      ? `DASHBOARD · ${perspectiveLabel} · ${role}`
      : `DASHBOARD · ${perspectiveLabel}`;

  return (
    <>
      <header className="ws-header">
        <div className="title-block">
          <div className="breadcrumb">{breadcrumb}</div>
          <h1>
            {titlePlain}
            {titleAccent ? (
              <>
                {' '}
                <em>{titleAccent}</em>
              </>
            ) : null}
          </h1>
        </div>
        {role ? (
          <div className="actions">
            <span className="scope-pill">
              <span className="dot" />
              <span>
                scope · {tenantName.toLowerCase()} · {role.toLowerCase()}
              </span>
            </span>
          </div>
        ) : null}
      </header>

      {presetDescription ? (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--ink-soft)',
            marginBottom: '20px',
            maxWidth: '800px',
            lineHeight: 1.6,
          }}
        >
          {presetDescription}
        </p>
      ) : null}

      <DashboardRenderer
        elements={visibleElements.map<DashboardRendererSlot>((el) => ({
          id: typeof el.id === 'bigint' ? el.id.toString() : String(el.id),
          parent_element_id:
            el.parent_element_id == null
              ? null
              : typeof el.parent_element_id === 'bigint'
                ? el.parent_element_id.toString()
                : String(el.parent_element_id),
          position: el.position,
          widget_code: el.widget_code,
          variant: el.variant,
          grid_col_start: el.grid_col_start,
          grid_col_span: el.grid_col_span,
        }))}
        data={Object.fromEntries(
          visibleElements.map((el) => {
            const id = typeof el.id === 'bigint' ? el.id.toString() : String(el.id);
            return [id, prefetched[id]?.data ?? null];
          })
        )}
      />

      {/* Cycle 2 Phase 0 T0.8: ws-footer SOURCE/TENANT/ROLE debug row removed.
          Gated behind NEXT_PUBLIC_SHOW_DEV_FOOTER flag (default false in prod). */}
      {process.env.NEXT_PUBLIC_SHOW_DEV_FOOTER === '1' ? (
        <footer className="ws-footer">
          <span>
            SOURCE · {visibleElements.length} widget
            {visibleElements.length === 1 ? '' : 's'}
            {tenantId ? ` · tenant ${tenantId.slice(0, 8)}…` : ''}
          </span>
          <span>
            {preset.code}
            {role ? ` · ${role}` : ''}
          </span>
        </footer>
      ) : null}
    </>
  );
}
