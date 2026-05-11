-- Phase 18l DOWN — NO-OP (cleanup unidirezionale, restore via backup if needed)
BEGIN;
DELETE FROM schema_migrations WHERE version='phase18l_strip_mock_identities';
COMMIT;
