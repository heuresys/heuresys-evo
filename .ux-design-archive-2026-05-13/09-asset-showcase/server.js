/**
 * Heuresys Asset Showcase — local management server.
 * Express 5 + Prisma 5.22 (SQLite). Localhost-only, no auth.
 *
 * Endpoint:
 *   GET    /api/stats                     — counts (total/promoted/available per kind)
 *   GET    /api/assets?kind=&promoted=&q= — list assets with filters
 *   GET    /api/assets/:id                — single asset (with variants + tags + log)
 *   POST   /api/assets                    — create asset (manual)
 *   PUT    /api/assets/:id                — update asset
 *   DELETE /api/assets/:id                — delete asset
 *   POST   /api/assets/:id/promote        — toggle promoted flag (logged)
 *   POST   /api/assets/:id/deprecate      — toggle deprecated flag (logged)
 *
 *   GET    /api/variants?asset_id=        — list variants
 *   POST   /api/variants                  — create variant
 *   PUT    /api/variants/:id              — update variant
 *   DELETE /api/variants/:id              — delete variant
 *
 *   GET    /api/tags                      — list tags
 *   POST   /api/tags                      — create tag
 *   POST   /api/assets/:id/tags           — add tag to asset (body: {tagId} or {name})
 *   DELETE /api/assets/:id/tags/:tagId    — remove tag from asset
 *
 *   GET    /api/categories                — distinct categories per kind
 *   POST   /api/bootstrap                 — re-run inventory parser
 *
 * Static:
 *   /                    — public/index.html (Storybook-like UI)
 *   /css/brand.css       — proxy services/app/src/styles/dashboard-brand.css
 *   /css/theme.css       — proxy services/app/src/styles/active-theme.css
 */

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { PrismaClient } from './prisma/generated/client/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const PORT = Number(process.env.PORT ?? 5174);

const prisma = new PrismaClient();
const app = express();
app.use(express.json({ limit: '2mb' }));

// ========== STATIC UI ==========
app.use(express.static(path.join(__dirname, 'public')));
app.get('/css/brand.css', (_req, res) =>
  res.sendFile(path.join(PROJECT_ROOT, 'services/app/src/styles/dashboard-brand.css'))
);
app.get('/css/theme.css', (_req, res) =>
  res.sendFile(path.join(PROJECT_ROOT, 'services/app/src/styles/active-theme.css'))
);

// ========== HELPERS ==========
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

async function logAction(assetId, action, notes) {
  await prisma.promotionLog.create({
    data: { assetId, action, notes: notes ?? null },
  });
}

function parseBool(v) {
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return undefined;
}

// ========== STATS ==========
app.get(
  '/api/stats',
  asyncHandler(async (_req, res) => {
    const grouped = await prisma.asset.groupBy({
      by: ['kind', 'promoted'],
      _count: { _all: true },
    });
    const byKind = {};
    let total = 0;
    let totalPromoted = 0;
    for (const row of grouped) {
      byKind[row.kind] ??= { total: 0, promoted: 0, available: 0 };
      byKind[row.kind].total += row._count._all;
      total += row._count._all;
      if (row.promoted) {
        byKind[row.kind].promoted += row._count._all;
        totalPromoted += row._count._all;
      } else {
        byKind[row.kind].available += row._count._all;
      }
    }
    const tags = await prisma.tag.count();
    const variants = await prisma.variant.count();
    res.json({
      total,
      totalPromoted,
      totalAvailable: total - totalPromoted,
      byKind,
      tags,
      variants,
    });
  })
);

// ========== ASSETS ==========
app.get(
  '/api/assets',
  asyncHandler(async (req, res) => {
    const { kind, promoted, deprecated, category, q } = req.query;
    const where = {};
    if (kind) where.kind = String(kind);
    const promotedBool = parseBool(promoted);
    if (promotedBool !== undefined) where.promoted = promotedBool;
    const deprecatedBool = parseBool(deprecated);
    if (deprecatedBool !== undefined) where.deprecated = deprecatedBool;
    if (category) where.category = String(category);
    if (q) {
      const term = String(q);
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
        { sourcePath: { contains: term } },
      ];
    }
    const assets = await prisma.asset.findMany({
      where,
      orderBy: [{ kind: 'asc' }, { category: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { variants: true, tags: true } } },
    });
    res.json(assets);
  })
);

app.get(
  '/api/assets/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { id: 'asc' } },
        tags: { include: { tag: true } },
        promotionLogs: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!asset) return res.status(404).json({ error: 'not found' });
    res.json(asset);
  })
);

app.post(
  '/api/assets',
  asyncHandler(async (req, res) => {
    const data = req.body ?? {};
    if (!data.name || !data.kind) {
      return res.status(400).json({ error: 'name and kind required' });
    }
    const asset = await prisma.asset.create({ data });
    await logAction(asset.id, 'create', `manual: ${asset.name}`);
    res.status(201).json(asset);
  })
);

app.put(
  '/api/assets/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { id: _omit, createdAt, updatedAt, ...data } = req.body ?? {};
    const asset = await prisma.asset.update({ where: { id }, data });
    await logAction(asset.id, 'edit', `fields: ${Object.keys(data).join(',')}`);
    res.json(asset);
  })
);

app.delete(
  '/api/assets/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await prisma.asset.delete({ where: { id } });
    res.status(204).end();
  })
);

app.post(
  '/api/assets/:id/promote',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const current = await prisma.asset.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'not found' });
    const next = !current.promoted;
    const asset = await prisma.asset.update({ where: { id }, data: { promoted: next } });
    await logAction(id, next ? 'promote' : 'unpromote', req.body?.notes ?? null);
    res.json(asset);
  })
);

app.post(
  '/api/assets/:id/deprecate',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const current = await prisma.asset.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'not found' });
    const next = !current.deprecated;
    const asset = await prisma.asset.update({ where: { id }, data: { deprecated: next } });
    await logAction(id, next ? 'deprecate' : 'undeprecate', req.body?.notes ?? null);
    res.json(asset);
  })
);

// ========== VARIANTS ==========
app.get(
  '/api/variants',
  asyncHandler(async (req, res) => {
    const assetId = req.query.asset_id ? Number(req.query.asset_id) : undefined;
    const variants = await prisma.variant.findMany({
      where: assetId ? { assetId } : {},
      orderBy: { id: 'asc' },
    });
    res.json(variants);
  })
);

app.post(
  '/api/variants',
  asyncHandler(async (req, res) => {
    const data = req.body ?? {};
    if (!data.assetId || !data.name)
      return res.status(400).json({ error: 'assetId + name required' });
    const variant = await prisma.variant.create({ data });
    await logAction(data.assetId, 'edit', `variant added: ${variant.name}`);
    res.status(201).json(variant);
  })
);

app.put(
  '/api/variants/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { id: _omit, ...data } = req.body ?? {};
    const variant = await prisma.variant.update({ where: { id }, data });
    res.json(variant);
  })
);

app.delete(
  '/api/variants/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const variant = await prisma.variant.findUnique({ where: { id } });
    if (variant) await logAction(variant.assetId, 'edit', `variant removed: ${variant.name}`);
    await prisma.variant.delete({ where: { id } });
    res.status(204).end();
  })
);

// ========== TAGS ==========
app.get(
  '/api/tags',
  asyncHandler(async (_req, res) => {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { assets: true } } },
    });
    res.json(tags);
  })
);

app.post(
  '/api/tags',
  asyncHandler(async (req, res) => {
    const { name, color } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'name required' });
    const tag = await prisma.tag.create({ data: { name, color: color ?? null } });
    res.status(201).json(tag);
  })
);

app.post(
  '/api/assets/:id/tags',
  asyncHandler(async (req, res) => {
    const assetId = Number(req.params.id);
    let tagId = req.body?.tagId ? Number(req.body.tagId) : undefined;
    if (!tagId && req.body?.name) {
      const existing = await prisma.tag.findUnique({ where: { name: req.body.name } });
      const tag = existing ?? (await prisma.tag.create({ data: { name: req.body.name } }));
      tagId = tag.id;
    }
    if (!tagId) return res.status(400).json({ error: 'tagId or name required' });
    await prisma.assetTag.upsert({
      where: { assetId_tagId: { assetId, tagId } },
      create: { assetId, tagId },
      update: {},
    });
    await logAction(assetId, 'tag-add', `tagId=${tagId}`);
    res.status(201).end();
  })
);

app.delete(
  '/api/assets/:id/tags/:tagId',
  asyncHandler(async (req, res) => {
    const assetId = Number(req.params.id);
    const tagId = Number(req.params.tagId);
    await prisma.assetTag.delete({ where: { assetId_tagId: { assetId, tagId } } });
    await logAction(assetId, 'tag-remove', `tagId=${tagId}`);
    res.status(204).end();
  })
);

// ========== CATEGORIES ==========
app.get(
  '/api/categories',
  asyncHandler(async (_req, res) => {
    const rows = await prisma.asset.groupBy({
      by: ['kind', 'category'],
      _count: { _all: true },
    });
    res.json(rows);
  })
);

// ========== BOOTSTRAP ==========
app.post(
  '/api/bootstrap',
  asyncHandler(async (_req, res) => {
    try {
      const out = execSync('node bootstrap.js', { cwd: __dirname, encoding: 'utf-8' });
      res.json({ ok: true, output: out });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message, stderr: e.stderr?.toString() });
    }
  })
);

// ========== ERROR HANDLER ==========
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[err]', err);
  res.status(500).json({ error: err.message ?? 'internal' });
});

app.listen(PORT, () => {
  console.log(`✅ Heuresys Asset Showcase running at http://localhost:${PORT}`);
});
