-- Phase 18s DOWN — Drop composite index on employee_skill_assessments

BEGIN;

DROP INDEX IF EXISTS idx_emp_skills_emp_skillname;

DELETE FROM schema_migrations
WHERE version = 'phase18s_idx_skill_assessments_composite';

COMMIT;
