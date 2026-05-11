-- Phase 18f DOWN — rollback ESKAP knowledge graph
BEGIN;
DROP TABLE IF EXISTS kg_edges CASCADE;
DROP TABLE IF EXISTS kg_nodes CASCADE;
DELETE FROM schema_migrations WHERE version = 'phase18f_eskap_knowledge_graph';
COMMIT;
