-- Migration 223: tenant_schema_version table (ADR-0017)
-- =============================================================================
-- Tenant ontology versioning per ADR-0017. One row per (tenant, version) bump,
-- append-only. Current version = MAX(version) per tenant_id.
--
-- See docs/decisions/0017-tenant-ontology-versioning.md for full rationale.

CREATE TABLE IF NOT EXISTS public.tenant_schema_version (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    version     integer NOT NULL CHECK (version >= 1),
    applied_at  timestamptz NOT NULL DEFAULT now(),
    applied_by  uuid REFERENCES public.users(id),
    notes       text,
    UNIQUE (tenant_id, version)
);

CREATE INDEX IF NOT EXISTS idx_tenant_schema_version_tenant
    ON public.tenant_schema_version (tenant_id, version DESC);

-- RLS: tenant isolation. Same pattern as legacy tenant_isolation_* policies.
ALTER TABLE public.tenant_schema_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_schema_version FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_tenant_schema_version ON public.tenant_schema_version;
CREATE POLICY tenant_isolation_tenant_schema_version
    ON public.tenant_schema_version
    USING (tenant_id = public.current_tenant_id())
    WITH CHECK (tenant_id = public.current_tenant_id());

-- Backfill: every existing tenant gets version=1 row.
INSERT INTO public.tenant_schema_version (tenant_id, version, notes)
SELECT id, 1, 'baseline v1 — auto-backfill via mig 223'
FROM public.tenants
ON CONFLICT (tenant_id, version) DO NOTHING;

COMMENT ON TABLE public.tenant_schema_version IS
'Per ADR-0017: tracks tenant ontology version (append-only, history preserved). Current version = MAX(version) per tenant.';
