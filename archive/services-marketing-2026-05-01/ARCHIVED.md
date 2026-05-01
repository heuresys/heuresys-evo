# services/marketing — ARCHIVED 2026-05-01

Status: archived during RTGB Phase B9 (services placeholder cleanup).

Original location: `services/marketing/`
Archive location: `archive/services-marketing-2026-05-01/`

Reason: per quantitative criterion in roadmap §3 (B9.3): `find services/marketing/src -type f | wc -l = 3 < 5 → ARCHIVE`. The marketing site has only the bootstrap Next.js skeleton (page, layout, globals.css). No real content yet.

When the marketing site needs to be built out, it can be bootstrapped fresh with current Next.js version + Tailwind 4 setup, or this archive can be restored.

To restore: move back to `services/marketing/`, re-add to `workspaces` (already present via `services/*` glob if restored under `services/`), run `npm install`.

See ADR-0015 (services lifecycle policy).
