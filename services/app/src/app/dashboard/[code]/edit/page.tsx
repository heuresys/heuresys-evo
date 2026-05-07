/**
 * Phase 14 Sprint 3.C — Dashboard editor page (RSC).
 *
 * RBP gate: only TENANT_OWNER, HR_DIRECTOR, SUPERUSER can edit. Other roles
 * are redirected to the read-only dashboard. The page loads the preset +
 * elements without server-side data prefetch (the editor manipulates
 * layout, not data); the client `DashboardEditor` handles drag/resize
 * and PUT to /api/dashboard/[code]/elements.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { loadDashboardPreset } from '@/lib/dashboard-engine';
import { DashboardEditor } from '@/components/dashboard/DashboardEditor';

const EDITOR_ROLES = new Set(['SUPERUSER', 'TENANT_OWNER', 'HR_DIRECTOR']);

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function DashboardEditPage({ params }: PageProps) {
  const { code } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent(`/dashboard/${code}/edit`)}`);
  }

  const user = session.user as { role?: string; tenantId?: string; id?: string };

  if (!user.role || !EDITOR_ROLES.has(user.role)) {
    // Forbidden — redirect to read-only view rather than 403 (preserves UX).
    redirect(`/dashboard/${code}?error=editor_forbidden`);
  }

  const preset = await loadDashboardPreset(code, {
    tenantId: user.tenantId ?? null,
    requirePublished: false, // editor must be able to load drafts
  });

  if (!preset) {
    redirect(`/dashboard?error=preset_not_found`);
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] p-6">
      <header className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-fg">
            EDIT MODE · {preset.perspective_code}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{preset.name_en ?? preset.code}</h1>
          <p className="mt-1 text-sm text-muted-fg">
            Drag widgets to reposition. Resize from the bottom-right corner. Changes auto-save and
            are recorded in audit_logs.
          </p>
        </div>
        <a
          href={`/dashboard/${code}`}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          Done
        </a>
      </header>

      <DashboardEditor
        presetCode={preset.code}
        elements={preset.dashboard_elements.map((el) => ({
          id: typeof el.id === 'bigint' ? el.id.toString() : String(el.id),
          widgetCode: el.widget_code,
          gridColStart: el.grid_col_start,
          gridColSpan: el.grid_col_span,
          gridRowStart: el.grid_row_start,
          gridRowSpan: el.grid_row_span,
          position: el.position,
        }))}
      />
    </main>
  );
}
