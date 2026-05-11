-- Phase 18j DOWN — rollback EcoNova job_templates dedupe
-- ATTENZIONE: rollback NON ripristina automaticamente le 393 row eliminate.
-- Per rollback completo: restore da backup heuresys_platform-pre-S36-cleanup-econova-jt-20260511T195758Z.dump
-- sha256: 87a99222f55f497035d064b623de7a5b934219769e4bd0eb2996cfa9e21d583a

BEGIN;
DELETE FROM schema_migrations WHERE version='phase18j_econova_jt_dedupe';
COMMIT;
