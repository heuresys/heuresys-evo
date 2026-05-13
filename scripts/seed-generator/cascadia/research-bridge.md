# Research Bridge — Claude Native Primary, OpenAI Fallback

> CASCADIA pipeline research engine. Decisione plan S55+ (autonomous mode): **Claude native (WebFetch/WebSearch + reasoning interno) come primary**, OpenAI gpt-4o-mini come **fallback opzionale** per mass-generation ripetitive.

## Workflow Claude-native

Quando uno stage richiede research o synthesis (es. `indoor/00_research`, `talpipe/23_succession`):

1. **No SDK boundary**: Lo script `.mjs` NON chiama un endpoint LLM remoto. Invece **delega il task a Claude main loop** che esegue:
   - `WebSearch(query)` per market data (Eurostat, EBA, INPS, ABI, OECD)
   - `WebFetch(url, prompt)` per fonti specifiche (ESCO API, sito regolatore, documenti ufficiali)
   - Reasoning interno per sintesi JSON allineata a `lib/zod-schemas.mjs`
   - Write su `db/seeds/realistic/_research_cache/<tenant>_industry_profile.json`

2. **Lo script seed esegue**:
   - Carica profile JSON cached da `_research_cache/`
   - Valida via `IndustryProfileSchema.safeParse`
   - Procede con cascade INSERT su DB (via `lib/rls-tx.mjs` + `dry-run.mjs`)

3. **Niente API key OpenAI necessaria** per il path principale. `OPENAI_API_KEY` resta gestito da `services/app/src/lib/ontology/openai-client.ts` per le route runtime esistenti.

## Quando attivare fallback OpenAI gpt-4o-mini

Solo se uno dei seguenti criteri triggera:

| Trigger                                                      | Mitigation OpenAI mini                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| Anthropic rate-limit prolungato                              | `--engine=openai-mini` flag → uso `lib/openai-wrapper.mjs` live |
| Mass-generation ripetitiva > 1000 rows con template identico | Batch OpenAI mini per cost-optimization ($0.20-$0.50)           |
| Tasso errore output Claude reasoning > 10% post-zod          | Switch engine + retry                                           |

## Pattern stage script

```js
// scripts/seed-generator/<sigla>/NN_name.mjs (esempio)
import { withTenantTx, getTenantIdByCode } from '../lib/rls-tx.mjs';
import {
  IndustryProfileSchema,
  SuccessionCandidateSchema,
  validateBatch,
} from '../lib/zod-schemas.mjs';
import { dryRunBatchInsert, isDryRun } from '../lib/dry-run.mjs';
import { Pool } from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = 'db/seeds/realistic/_research_cache';

export async function runStage({ tenant, dryRun, engine }) {
  // 1. Carica profile cached (gia` prodotto da Claude main loop research)
  const profilePath = path.join(CACHE_DIR, `${tenant}_industry_profile.json`);
  const raw = JSON.parse(await fs.readFile(profilePath, 'utf-8'));
  const profile = IndustryProfileSchema.parse(raw); // throw se invalid

  // 2. Connessione DB + RLS-aware tx
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tenantId = await getTenantIdByCode(pool, tenant);

  // 3. Genera record (Claude reasoning produce array via prompt template specifico al sigla)
  // NOTA: in autonomous mode, Claude main loop scrive il file `*_candidates.json`
  // PRIMA di invocare questo runner. Lo script si limita a leggere + validare + INSERT.
  const candidatesPath = path.join(CACHE_DIR, `${tenant}_succession_candidates_generated.json`);
  const generated = JSON.parse(await fs.readFile(candidatesPath, 'utf-8'));

  // 4. Validate batch
  const { passed, failed } = validateBatch(SuccessionCandidateSchema, generated);
  if (failed.length > 0) {
    console.warn(`[validate] ${failed.length} records failed schema`);
  }

  // 5. INSERT con dry-run support
  await withTenantTx(pool, tenantId, async (client) => {
    const result = await dryRunBatchInsert(client, 'succession_candidates', passed, {
      dryRun,
      onConflict: 'ON CONFLICT (id) DO NOTHING',
    });
    console.log(`[stage] inserted=${result.inserted} skipped=${result.skipped}`);
  });

  await pool.end();
}
```

## Convenzioni audit + idempotency

- Ogni stage script:
  - Backup pre-write obbligatorio (logged a `_research_cache/_backup_<ts>.txt`)
  - INSERT con `ON CONFLICT DO NOTHING` o `ON CONFLICT DO UPDATE`
  - audit_logs row emessa via `lib/audit-emit.mjs`
  - RLS-aware via `lib/rls-tx.mjs`
- Re-run safe: idempotency tramite dedupe key per entity type (es. succession_candidates: `(employee_id, target_position_label)`)

## File generati da Claude main loop (out-of-band)

I file seguenti sono prodotti **dalla sessione Claude main loop** (questa stessa che esegue gli stage):

- `<tenant>_industry_profile.json` — aggiornato/creato da Stage 2a refresh
- `<tenant>_<sigla>_<entity>_generated.json` — output AI-driven per ogni stage downstream

Non sono prodotti automaticamente da node — sono input pre-cooked dal LLM Claude che genera il payload e poi invoca runner script per validazione+INSERT.
