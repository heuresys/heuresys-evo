-- S35.3 M5 (OPOURSKA Layer 6 — KPI framework process-driven) RTL Bank
-- 27 process_kpis BANKING-M già esistenti per BP-001..BP-008 (seedati da prototype_banking_k64.sql).
-- Aggiungo 12 KPI mancanti per i 3 nuovi BP (M6): BP-009 Onboarding, BP-010 Treasury, BP-011 Audit.
--
-- Strategic/People KPI (ROE/CET1/LCR/NSFR/Turnover/Training/Engagement) → carry-forward `org_unit_kpis`
-- (richiede setup org_unit_templates BANKING-M, M5b sessione successiva).

BEGIN;

-- BP-009 Onboarding Cliente (KYC + AML)
INSERT INTO process_kpis (id, process_id, kpi_code, kpi_name, measurement_unit, target_direction, benchmark_value, benchmark_min, benchmark_max, description, created_at, updated_at)
SELECT gen_random_uuid(), bp.id, v.kpi_code, v.kpi_name, v.unit, v.dir, v.bench_val, v.bench_min, v.bench_max, v.desc_text, now(), now()
FROM business_processes bp
JOIN industry_profiles ip ON ip.id = bp.profile_id
JOIN (VALUES
  ('BP-009-KPI-01', 'KYC verification time',     'days',  'lower_better',  3.00,   1.00,   5.00,   'Tempo medio completamento KYC dal docs received al cliente onboarded'),
  ('BP-009-KPI-02', 'AML alert resolution time', 'days',  'lower_better',  5.00,   1.00,  10.00,   'Tempo medio risoluzione alert AML (transazione bloccata → cleared o STR)'),
  ('BP-009-KPI-03', 'Customer activation rate',  '%',     'higher_better',92.00,  80.00, 100.00,   'Quota di nuovi clienti che attivano almeno 1 prodotto entro 30g dall''apertura conto'),
  ('BP-009-KPI-04', 'Onboarding NPS',            'score', 'higher_better',45.00,  30.00,  70.00,   'Net Promoter Score post-onboarding survey (-100..+100 scale)')
) AS v(kpi_code, kpi_name, unit, dir, bench_val, bench_min, bench_max, desc_text) ON true
WHERE bp.process_code = 'BP-009' AND ip.code = 'BANKING-M'
  AND NOT EXISTS (SELECT 1 FROM process_kpis pk WHERE pk.process_id=bp.id AND pk.kpi_code=v.kpi_code);

-- BP-010 Treasury Operations & ALM
INSERT INTO process_kpis (id, process_id, kpi_code, kpi_name, measurement_unit, target_direction, benchmark_value, benchmark_min, benchmark_max, description, created_at, updated_at)
SELECT gen_random_uuid(), bp.id, v.kpi_code, v.kpi_name, v.unit, v.dir, v.bench_val, v.bench_min, v.bench_max, v.desc_text, now(), now()
FROM business_processes bp
JOIN industry_profiles ip ON ip.id = bp.profile_id
JOIN (VALUES
  ('BP-010-KPI-01', 'Liquidity Coverage Ratio (LCR)', '%',      'higher_better', 130.00, 100.00, 200.00, 'LCR Basel III: stock HQLA / net cash outflow 30d (target Basel >=100%, banca prudente >=120%)'),
  ('BP-010-KPI-02', 'Net Stable Funding Ratio (NSFR)','%',      'higher_better', 110.00, 100.00, 150.00, 'NSFR Basel III: available stable funding / required stable funding (target >=100%)'),
  ('BP-010-KPI-03', 'FX trading P&L variance',       'EUR',    'target_range',    0.00, -50000,  50000,  'Daily FX desk P&L deviation vs forecast (zero target, banda +/- 50k EUR)'),
  ('BP-010-KPI-04', 'Liquidity buffer days',         'days',   'higher_better',  60.00,  30.00,  90.00,  'Numero giorni di copertura liquidità con HQLA stock corrente (stress scenario)')
) AS v(kpi_code, kpi_name, unit, dir, bench_val, bench_min, bench_max, desc_text) ON true
WHERE bp.process_code = 'BP-010' AND ip.code = 'BANKING-M'
  AND NOT EXISTS (SELECT 1 FROM process_kpis pk WHERE pk.process_id=bp.id AND pk.kpi_code=v.kpi_code);

-- BP-011 Internal Audit
INSERT INTO process_kpis (id, process_id, kpi_code, kpi_name, measurement_unit, target_direction, benchmark_value, benchmark_min, benchmark_max, description, created_at, updated_at)
SELECT gen_random_uuid(), bp.id, v.kpi_code, v.kpi_name, v.unit, v.dir, v.bench_val, v.bench_min, v.bench_max, v.desc_text, now(), now()
FROM business_processes bp
JOIN industry_profiles ip ON ip.id = bp.profile_id
JOIN (VALUES
  ('BP-011-KPI-01', 'High-severity audit findings',   'count', 'lower_better',   3.00,    0.00,    5.00, 'Findings H per anno (Banca d''Italia rilevanti). Target zero, max tollerato 3/year'),
  ('BP-011-KPI-02', 'Audit plan completion rate',     '%',     'higher_better',95.00,   85.00,  100.00, 'Quota audit pianificati completati nel fiscal year (audit universe coverage)'),
  ('BP-011-KPI-03', 'Findings closure time',          'days',  'lower_better', 90.00,   30.00,  180.00, 'Tempo medio chiusura findings con remediation verificata (target SLA 90gg per H/M)'),
  ('BP-011-KPI-04', 'Repeat findings rate',           '%',     'lower_better',  5.00,    0.00,   15.00, 'Quota findings ripetuti (stessa area, stessa root cause) anno-su-anno. Target <=5%')
) AS v(kpi_code, kpi_name, unit, dir, bench_val, bench_min, bench_max, desc_text) ON true
WHERE bp.process_code = 'BP-011' AND ip.code = 'BANKING-M'
  AND NOT EXISTS (SELECT 1 FROM process_kpis pk WHERE pk.process_id=bp.id AND pk.kpi_code=v.kpi_code);

INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M5_opourska_rtl_bank_process_kpis', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT bp.process_code, count(pk.id) FROM business_processes bp
-- LEFT JOIN process_kpis pk ON pk.process_id=bp.id
-- WHERE bp.profile_id=(SELECT id FROM industry_profiles WHERE code='BANKING-M')
-- GROUP BY bp.process_code ORDER BY bp.process_code;
-- Expected: BP-009/010/011 = 4 each, totale BANKING-M = 39 KPI.
