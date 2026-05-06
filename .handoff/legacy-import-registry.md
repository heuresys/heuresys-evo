# Legacy import registry — heuresys-evo

> **Single Source of Truth** del cataloghi cross-repo legacy → evo. Aggiornare questo file (e il CSV companion `legacy-import-registry.csv`) ad ogni commit di import.
>
> **Regola cross-progetto**: vedi memoria globale `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`.

## Workflow stages

```
Test Stage  →  PreOp Stage  →  Promoted   (acceptance utente esplicita)
                            \→ Rejected   (estirpazione clean)
```

| Stage | Significato | Trigger transizione |
|---|---|---|
| **Test Stage** | Vitest + typecheck verdi · NO validazione live · NO acceptance | (default initial appena committato) |
| **PreOp Stage** | Validato live (curl/integration con DB live) · in osservazione | Dopo smoke test live + acceptance Enzo informale |
| **Promoted** | Accettato definitivamente · stabile nel codebase | Acceptance Enzo esplicita ("promosso" / "OK definitivo") |
| **Rejected** | Scartato · da estirpare dal repo | Acceptance Enzo esplicita ("rejected" / "rimuovi") |

**Solo Enzo può promuovere** uno stage da `Test Stage` a `PreOp/Promoted/Rejected`. Claude registra movements ma non promuove autonomamente.

## Estirpazione clean — vincolo architetturale

Ogni oggetto in `Test Stage` o `PreOp Stage` DEVE essere **rimovibile dal repo evo SENZA conseguenze** su stack o oggetti già presenti pre-import.

**Categorie removability**:

| Categoria | Significato | Rimozione |
|---|---|---|
| `no-impact` | File isolato (router, helper, utils) · 1 mount line index.ts | Delete file + remove mount line · zero side effects |
| `not-yet-used (safe to revert)` | Esempio: model allowlist additions per future scope | Revert allowlist line · prisma:refresh |
| `embedded-in-existing-file` | Modifica additiva a file esistente (es. `/employees` extend) | Ripristino state pre-commit · `git revert <sha>` o cherry-revert delle linee aggiunte |
| `depends-on-X` | Estirpazione di X richiede anche estirpazione di Y dipendente | Sequence rimozione: dipendente prima · dipendenza dopo |
| `depends-on-DB-seed` | Routing OK in mock test, runtime bloccato finché DB non seedato | Nessun rollback codice · solo flag stage `Rejected` se non si proseguirà |

**File registry-source = `legacy-import-registry.csv`** (parseable Excel/Pandas/jq via csvjson).

## Schema CSV

| Field | Type | Notes |
|---|---|---|
| `name` | string | Identificativo univoco |
| `type` | enum | `endpoint \| endpoint-skipped \| helper \| helper-skipped \| middleware \| constant \| model-allowlist \| model-data \| dependency \| env-config \| helper-greenfield-deferred` |
| `legacy_stack` | string | Descrittore stack origine |
| `legacy_path` | string | Path assoluto file origine |
| `evo_stack` | string | Descrittore stack target |
| `evo_path` | string | Path assoluto file destinazione (`N/A` se skipped) |
| `import_type` | enum | `clone-as-is \| adapted \| new-greenfield \| skipped` |
| `import_outcome` | enum | `imported \| partial \| skipped \| embedded-in-existing` |
| `skip_reason` | string | Motivazione skip/partial |
| `adapt_notes` | string | Sintesi modifiche |
| `commit_sha` | string | Commit shipping (`LOCAL-ONLY` per env-config gitignored · `N/A` per skipped) |
| `test_count` | string | Numero test contract o riferimento (`covered-via-X`) |
| `removability` | enum/string | Vedi categorie sopra |
| `stage` | enum | `Test Stage \| PreOp Stage \| Promoted \| Rejected` |

## Snapshot Pack 1 (HR core) — 2026-05-06

**Endpoint imported (6)**: tutti `Test Stage`
- `/roles` clone-as-is · 7 test
- `/tenants` adapted partial (skip `/stats`) · 26 test
- `/users` adapted · 24 test
- `/employees extend` adapted partial (7/18 handler · 11 skipped) · 19 test
- `/org-units` adapted partial (skip `/path` `/move`) · 21 test
- `/workforce-planning` adapted partial MVP CRUD (9/17 handler · 8 skipped) · 15 test

**Helpers imported (8)**: tutti `Test Stage`
- `escapeILIKE`, `safeParseInt`, `isUUID+UUID_REGEX`, `buildMeta` (utils/sql-safety.ts + utils/pagination.ts)
- `validatePassword`, `generateSecurePassword` (utils/password-policy.ts)
- `requirePermission` lazy wrapper (middleware/require-permission.ts)
- `ROLES`, `ROLE_DESCRIPTIONS`, `LEGACY_ALIAS_MAP`, `buildRoleHierarchy` (middleware/roles.ts)

**Prisma allowlist additions (7)**: tutte `Test Stage`
- `workforce_plans`, `workforce_plan_actions`, `workforce_plan_scenarios` (used by /workforce)
- `locations`, `goals`, `performance_reviews`, `cost_centers` (pre-prep, not-yet-used)

**Dependencies (2)**: tutte `Test Stage`
- `bcryptjs ^3.0.3`, `@types/bcryptjs ^3.0.0`

**Env-config (1)**: `Test Stage` (gitignored, local-only)
- `AUTH_TRUST_HOST=true` in `services/api-gateway/.env`

**Skipped/Rejected (12+)**: stage `Rejected`
- 9 endpoint /employees + /tenants + /org-units + /workforce heavy
- 3 helper (applyFieldPolicy, WorkforcePlanningService, cachedForTenant)
- 2 RBP DB seed (SECURITY area, PLATFORM area) → `depends-on-DB-seed` flag

## Promotion checklist (per portare da Test Stage → PreOp Stage)

Per ogni entry attualmente `Test Stage`, prima di promuovere a `PreOp Stage`:

1. **Smoke test live** con DB evo via tunnel SSH (`oracle-vm-default:5432`):
   - `curl http://127.0.0.1:8200/<endpoint>` con session JWT issued via `/auth/signin`
   - Verifica response shape + status code attesi
   - Verifica RBP enforcement runtime (richiede seed `SECURITY`/`PLATFORM` area in DB evo)
2. **Integration test** vs DB evo (vitest con prisma reale, no mock):
   - Optional: scrivere test integration in `services/api-gateway/test/legacy-import/` (cartella TBD)
3. **Performance baseline**:
   - P95 latency ≤500ms per endpoint
   - Bundle size impact su Storybook irrilevante (api-gateway non bundla)
4. **Cross-repo data parity**:
   - Curl legacy + curl evo con same input
   - Confronto output semantico (anche se shape può differire)
5. **Audit log** (P4): aggiungere via `auditedTransaction()` quando il helper greenfield è scritto

Per portare da `PreOp Stage` → `Promoted`: acceptance Enzo esplicita.

## Estirpazione protocol (per un entry `Rejected`)

Se Enzo decide di rejecting un entry:

1. **Read entry CSV** → identificare `removability` category
2. **`no-impact`**: delete file + remove mount line (router) o revert linea singola (allowlist) · run typecheck workspaces verde
3. **`embedded-in-existing-file`**: `git revert <commit_sha>` (o cherry-revert linee specifiche)
4. **`depends-on-X`**: estirpare prima dipendenti, poi dipendenza
5. **`depends-on-DB-seed`**: nessun rollback codice · solo update CSV stage = `Rejected` · documentazione del fatto che endpoint runtime non funzionerà
6. **Update CSV stage = `Rejected` + note in `adapt_notes`**
7. **Commit con message** `revert(import): estirpa <name> Stage Rejected · <commit_sha originale>`

## Riferimenti

- **Memoria globale regola** (cross-progetto): `~/.claude/projects/D--evo-heuresys-com/memory/feedback_legacy_import_registry.md`
- **Mining log Phase 13.0**: [`legacy-mining-log.md`](legacy-mining-log.md)
- **STATE sessione**: [`STATE.md`](STATE.md)
- **Plan Phase 13**: `~/.claude/plans/credo-che-se-tu-jazzy-key.md`
- **CSV registry**: [`legacy-import-registry.csv`](legacy-import-registry.csv)
