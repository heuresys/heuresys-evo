#!/usr/bin/env node
/**
 * Generate raster icon assets for production from `.ux-design/03-visual-identity/logo/final/*.svg`:
 *   - services/app/public/favicon.ico         (16/32/48/64, PNG-encoded ICO)
 *   - services/app/public/apple-touch-icon.png (180x180 on bg #0a0a10)
 *   - services/app/public/og-image.png         (1200x630, fit cover)
 *
 * Reproducible: re-run after editing source SVGs in `.ux-design/`.
 * Pure JS ICO encoder inline — no `to-ico` (drags 13 vulnerable transitive deps).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const SRC_DIR = resolve(ROOT, '.ux-design/03-visual-identity/logo/final');
const PUBLIC_DIR = resolve(ROOT, 'services/app/public');

const FAVICON_SIZES = [16, 32, 48, 64];
const APPLE_SIZE = 180;
const APPLE_BG = { r: 0x0a, g: 0x0a, b: 0x10, alpha: 1 };
const OG_W = 1200;
const OG_H = 630;

async function svgToPng(svgPath, width, height, bg) {
  const svg = await readFile(svgPath);
  let pipe = sharp(svg, { density: 384 }).resize(width, height, {
    fit: 'contain',
    background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (bg) pipe = pipe.flatten({ background: bg });
  return await pipe.png().toBuffer();
}

function encodeIco(pngs) {
  const HEADER = 6;
  const ENTRY = 16;
  const dirSize = HEADER + ENTRY * pngs.length;
  let offset = dirSize;
  const buffers = [];

  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  buffers.push(header);

  for (const { size, data } of pngs) {
    const e = Buffer.alloc(ENTRY);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    buffers.push(e);
  }
  for (const { data } of pngs) buffers.push(data);
  return Buffer.concat(buffers);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });
  console.log('[brand:icons] sources =', SRC_DIR);
  console.log('[brand:icons] target  =', PUBLIC_DIR);

  console.log(`[brand:icons] favicon.ico (${FAVICON_SIZES.join('/')})`);
  const faviconSvg = resolve(SRC_DIR, 'favicon.svg');
  const pngs = await Promise.all(
    FAVICON_SIZES.map(async (s) => ({ size: s, data: await svgToPng(faviconSvg, s, s) }))
  );
  await writeFile(resolve(PUBLIC_DIR, 'favicon.ico'), encodeIco(pngs));

  console.log(`[brand:icons] apple-touch-icon.png (${APPLE_SIZE}x${APPLE_SIZE})`);
  const apple = await svgToPng(
    resolve(SRC_DIR, 'heuresys-mark.svg'),
    APPLE_SIZE,
    APPLE_SIZE,
    APPLE_BG
  );
  await writeFile(resolve(PUBLIC_DIR, 'apple-touch-icon.png'), apple);

  console.log(`[brand:icons] og-image.png (${OG_W}x${OG_H})`);
  const og = await sharp(await readFile(resolve(SRC_DIR, 'og-image-template.svg')), {
    density: 192,
  })
    .resize(OG_W, OG_H, { fit: 'cover' })
    .png()
    .toBuffer();
  await writeFile(resolve(PUBLIC_DIR, 'og-image.png'), og);

  console.log('[brand:icons] done.');
}

main().catch((err) => {
  console.error('[brand:icons] failed:', err);
  process.exit(1);
});
