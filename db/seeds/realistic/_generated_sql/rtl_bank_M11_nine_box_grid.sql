-- S35.3 M11 (TALPIPE — 9-box talent matrix) RTL Bank
--
-- nine_box_grid è una VIEW derivata da performance_reviews.{performance_box, potential_box, status='completed'}.
-- Per popolare la view: UPDATE 157 performance_reviews RTL Bank set performance_box + potential_box.
--
-- Mapping:
-- - performance_box (1-3) from overall_rating: <2.5→1, <4→2, ≥4→3 (or random Bell 25/50/25 if NULL)
-- - potential_box (1-3) Gaussian biased by auth_role:
--   SYSADMIN/TENANT_OWNER μ=2.5, HR_DIRECTOR/IT_ADMIN μ=2.3, mgr μ=2.0, emp μ=1.7

BEGIN;

SELECT setseed(0.77);

WITH
  rtl_tenant AS (SELECT id FROM tenants WHERE code = 'rtl-bank'),
  rtl_reviews AS (
    SELECT
      pr.id AS review_id,
      pr.overall_rating,
      e.auth_role,
      random() AS rand_perf,
      random() AS rand_pot
    FROM performance_reviews pr
    JOIN employees e ON e.id = pr.employee_id
    WHERE pr.tenant_id = (SELECT id FROM rtl_tenant)
      AND pr.performance_box IS NULL
  ),
  scored AS (
    SELECT
      review_id,
      CASE
        WHEN overall_rating IS NULL THEN
          CASE WHEN rand_perf < 0.25 THEN 1 WHEN rand_perf < 0.75 THEN 2 ELSE 3 END
        WHEN overall_rating < 2.5 THEN 1
        WHEN overall_rating < 4.0 THEN 2
        ELSE 3
      END AS perf_box,
      LEAST(GREATEST(
        ROUND(
          CASE auth_role
            WHEN 'SYSADMIN' THEN 2.5 WHEN 'SUPERUSER' THEN 2.5
            WHEN 'TENANT_OWNER' THEN 2.5
            WHEN 'HR_DIRECTOR' THEN 2.3 WHEN 'IT_ADMIN' THEN 2.3
            WHEN 'HR_MANAGER' THEN 2.0 WHEN 'DEPT_HEAD' THEN 2.0 WHEN 'LINE_MANAGER' THEN 2.0
            ELSE 1.7
          END
          + 0.6 * sqrt(-2.0 * ln(GREATEST(rand_pot, 0.0001))) * cos(2.0 * pi() * rand_perf)
        )::int
      , 1), 3) AS pot_box,
      CASE
        WHEN overall_rating IS NULL THEN
          (CASE WHEN rand_perf < 0.25 THEN 'low' WHEN rand_perf < 0.75 THEN 'medium' ELSE 'high' END)::varchar
        WHEN overall_rating < 2.5 THEN 'low'::varchar
        WHEN overall_rating < 4.0 THEN 'medium'::varchar
        ELSE 'high'::varchar
      END AS pot_rating_str
    FROM rtl_reviews
  )
UPDATE performance_reviews pr
SET
  performance_box = s.perf_box,
  potential_box   = s.pot_box,
  potential_rating = s.pot_rating_str,
  updated_at = now()
FROM scored s
WHERE pr.id = s.review_id;

INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M11_talpipe_rtl_bank_nine_box_via_reviews', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification (nine_box_grid view should auto-populate):
-- SELECT nine_box_category, count(*) FROM nine_box_grid WHERE tenant_id=(SELECT id FROM tenants WHERE code='rtl-bank') GROUP BY 1 ORDER BY 1;
