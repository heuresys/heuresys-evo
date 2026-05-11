/**
 * lib/audit-emit.mjs — Atomic audit_logs emission for seed writes (P4 enforcement).
 *
 * Mirrors `services/app/src/lib/audit/auditedTransaction.ts` for seed-time use:
 * every write inside a CASCADIA stage produces an audit_logs row pre-commit,
 * inside the same tx via lib/rls-tx.mjs.
 *
 * audit_logs schema (52 FK to tenants/employees/users):
 *   - description TEXT NOT NULL — non-null per P4 contract
 *   - entity_type / entity_id — what was touched
 *   - action — verb (CREATE/UPDATE/DELETE)
 *   - user_id — actor (default: tenant admin sysadmin user for seed events)
 *   - tenant_id — RLS isolation
 */

/**
 * Emit an audit_logs row inside an existing tx.
 * @param {import('pg').PoolClient} client — inside withTenantTx
 * @param {{
 *   tenant_id: string|null,
 *   entity_type: string,
 *   entity_id: string,
 *   action: 'CREATE'|'UPDATE'|'DELETE',
 *   description: string,
 *   user_id?: string|null,
 *   metadata?: object
 * }} event
 */
export async function emitAuditEvent(client, event) {
  const {
    tenant_id,
    entity_type,
    entity_id,
    action,
    description,
    user_id = null,
    metadata = null,
  } = event;

  if (!description || description.trim().length === 0) {
    throw new Error('audit-emit: description is required (P4)');
  }

  await client.query(
    `INSERT INTO audit_logs (
       tenant_id, entity_type, entity_id, action, description, user_id, metadata, created_at
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, now())`,
    [
      tenant_id,
      entity_type,
      entity_id,
      action,
      description,
      user_id,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );
}

/**
 * Emit a batch of audit events (UNNEST batch for performance).
 */
export async function emitAuditBatch(client, events) {
  if (events.length === 0) return;
  // Defensive: validate description on each
  for (const e of events) {
    if (!e.description || e.description.trim().length === 0) {
      throw new Error(`audit-emit batch: missing description for ${e.entity_type}:${e.entity_id}`);
    }
  }
  await client.query(
    `INSERT INTO audit_logs (tenant_id, entity_type, entity_id, action, description, user_id, metadata, created_at)
     SELECT * FROM UNNEST($1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[], $6::uuid[], $7::jsonb[], $8::timestamptz[])`,
    [
      events.map((e) => e.tenant_id),
      events.map((e) => e.entity_type),
      events.map((e) => e.entity_id),
      events.map((e) => e.action),
      events.map((e) => e.description),
      events.map((e) => e.user_id ?? null),
      events.map((e) => (e.metadata ? JSON.stringify(e.metadata) : null)),
      events.map((e) => e.created_at ?? new Date()),
    ]
  );
}
