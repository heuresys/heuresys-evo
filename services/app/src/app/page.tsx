import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-12">
      <h1 className="text-5xl font-bold tracking-tight">Heuresys</h1>
      <p className="text-lg text-neutral-600">
        Organizational Intelligence &amp; Workforce Orchestration
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-fg hover:bg-primary/90"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md border border-neutral-300 px-6 text-sm font-medium hover:bg-neutral-100"
        >
          Dashboard
        </Link>
      </div>
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        services/app · phase 1
      </p>
    </main>
  );
}
