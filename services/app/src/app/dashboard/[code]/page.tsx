import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loadDashboardPreset, resolveElements } from '@/lib/dashboard-engine';
import { DashboardGrid } from '@/lib/dashboard-engine/grid';

/**
 * Phase 13.C — /dashboard/[code] — data-driven dashboard renderer.
 * Server component: reads session (NextAuth v4) → loads preset+elements
 * (Prisma) → applies RBP visibility + perspective filter (resolver) →
 * passes to the client-side DashboardGrid for CSS Grid layout.
 *
 * URL params:
 *   [code]            — dashboard_presets.code (e.g. "hr_director_overview")
 *
 * Search params:
 *   ?observer=...     — perspective filter (PROCESS | ENTERPRISE | TALENT)
 *
 * V1 limitations (per plan):
 *   - Static CSS Grid (no drag-resize)
 *   - Widgets render demo data (no live data binding yet — Phase 14)
 *   - RBP visibility via element.visibility_min_role (no per-field policies yet)
 */

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ observer?: string }>;
}

export default async function DashboardCodePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { observer } = await searchParams;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(`/dashboard/${code}`)}`);
  }

  const user = session.user as {
    role?: string;
    tenantId?: string;
    username?: string;
  };

  const preset = await loadDashboardPreset(code, {
    tenantId: user.tenantId ?? null,
    requirePublished: true,
  });

  if (!preset) notFound();

  const visibleElements = resolveElements(preset.dashboard_elements, {
    role: user.role ?? null,
    perspective: observer ?? null,
  });

  const perspectiveLabel = observer ? observer.toUpperCase() : preset.perspective_code;

  return (
    <main className="mx-auto w-full max-w-[1280px] p-6">
      <header className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">
            {perspectiveLabel} · preset
            {preset.persona_label ? <> · {preset.persona_label}</> : null}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{preset.name_en}</h1>
          {preset.description_en ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-fg">{preset.description_en}</p>
          ) : null}
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-wider text-muted-fg">
          {visibleElements.length} widget{visibleElements.length === 1 ? '' : 's'}
          {user.role ? <div className="mt-0.5">role · {user.role}</div> : null}
          {user.tenantId ? (
            <div className="mt-0.5">tenant · {user.tenantId.slice(0, 8)}…</div>
          ) : null}
        </div>
      </header>

      <DashboardGrid
        elements={visibleElements.map((el) => ({
          ...el,
          // BigInt → string for client-component serialization safety (RSC payload)
          id: typeof el.id === 'bigint' ? el.id.toString() : String(el.id),
          dashboard_preset_id:
            typeof el.dashboard_preset_id === 'bigint'
              ? el.dashboard_preset_id.toString()
              : String(el.dashboard_preset_id),
        }))}
      />
    </main>
  );
}
