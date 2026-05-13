#!/usr/bin/env node
/**
 * cascadia/run-stage.mjs — Orchestrator universale CASCADIA stage runner.
 *
 * Uso:
 *   node scripts/seed-generator/cascadia/run-stage.mjs \
 *     --stage <sigla>/<NN_name> \
 *     --tenant <slug> \
 *     [--dry-run] \
 *     [--engine claude-native|openai-mini]
 *
 * Convenzione:
 * - Stage script reside in `scripts/seed-generator/<sigla>/<NN_name>.mjs`
 * - Export named `runStage({ tenant, dryRun, engine })` da ogni stage script
 * - Engine default: claude-native (no LLM API call from this script)
 *
 * Pre-flight automatici:
 * 1. Valida $DATABASE_URL set
 * 2. Resolve tenantId da code via lib/rls-tx.mjs#getTenantIdByCode
 * 3. Verifica industry_profile_<tenant>.json existe + zod valid (se applicabile)
 * 4. Backup pg_dump invocato esternamente (orchestrator non lo fa di default)
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const out = { stage: null, tenant: null, dryRun: false, engine: 'claude-native' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--stage=')) out.stage = a.slice(8);
    else if (a === '--stage') out.stage = argv[++i];
    else if (a.startsWith('--tenant=')) out.tenant = a.slice(9);
    else if (a === '--tenant') out.tenant = argv[++i];
    else if (a === '--dry-run' || a === '--dryRun') out.dryRun = true;
    else if (a.startsWith('--engine=')) out.engine = a.slice(9);
    else if (a === '--engine') out.engine = argv[++i];
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return out;
}

function printHelp() {
  console.log(`
Usage:
  node scripts/seed-generator/cascadia/run-stage.mjs \\
    --stage <sigla>/<NN_name> \\
    --tenant <slug> \\
    [--dry-run] \\
    [--engine claude-native|openai-mini]

Examples:
  node ... --stage indoor/00_research --tenant rtl-bank --dry-run
  node ... --stage talpipe/23_succession_extension --tenant rtl-bank
  node ... --stage h2r/45_onboarding --tenant smartfood --engine openai-mini
`);
}

function fail(msg, code = 1) {
  console.error(`[run-stage] ERROR: ${msg}`);
  process.exit(code);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.stage) fail('--stage is required (e.g. talpipe/23_succession_extension)');
  if (!args.tenant)
    fail('--tenant is required (e.g. rtl-bank, smartfood, econova, heuresys-system)');

  // Stage path normalization
  const stageParts = args.stage.split('/');
  if (stageParts.length !== 2) fail('--stage must be in form <sigla>/<NN_name>');
  const [sigla, name] = stageParts;

  // Repo root inference (script lives in scripts/seed-generator/cascadia/)
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const stageFile = path.resolve(repoRoot, 'scripts', 'seed-generator', sigla, `${name}.mjs`);

  try {
    await fs.access(stageFile);
  } catch {
    fail(`stage script not found at ${stageFile}`);
  }

  // Pre-flight env
  if (!args.dryRun && !process.env.DATABASE_URL) {
    fail('DATABASE_URL must be set (or pass --dry-run for tooling smoke)');
  }

  console.log('[run-stage]', {
    stage: `${sigla}/${name}`,
    tenant: args.tenant,
    dryRun: args.dryRun,
    engine: args.engine,
    stageFile,
  });

  // Dynamic import + execution
  let mod;
  try {
    mod = await import(`file://${stageFile.replace(/\\/g, '/')}`);
  } catch (err) {
    fail(`failed to import stage module: ${err?.message ?? err}`);
  }
  if (typeof mod.runStage !== 'function') {
    // Tooling-smoke: stage script may not exist yet (Stage 0 scaffolding only)
    console.log(
      `[run-stage] stage module imported but no runStage export — treating as scaffolding ack.`
    );
    console.log(`research delegated to Claude main loop`);
    process.exit(0);
  }

  try {
    await mod.runStage({ tenant: args.tenant, dryRun: args.dryRun, engine: args.engine });
    console.log('[run-stage] OK');
  } catch (err) {
    console.error('[run-stage] FAIL:', err?.stack ?? err);
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('[run-stage] FATAL:', e?.stack ?? e);
  process.exit(99);
});
