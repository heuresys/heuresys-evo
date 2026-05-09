import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { readActivePalette } from '@/lib/theme-framework/active-palette-store';
import { BrandStudioClient } from './BrandStudioClient';

export const metadata = {
  title: 'Brand Studio — Heuresys',
};

export const dynamic = 'force-dynamic';

const ALLOWED_ROLES = new Set(['SUPERUSER']);

export default async function BrandStudioPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Fbrand-studio');
  }
  const role = (session.user as { role?: string }).role;
  if (!role || !ALLOWED_ROLES.has(role)) {
    notFound();
  }
  const initialPalette = await readActivePalette();
  return (
    <main className="min-h-screen bg-neutral-50">
      <BrandStudioClient initialPalette={initialPalette} />
    </main>
  );
}
