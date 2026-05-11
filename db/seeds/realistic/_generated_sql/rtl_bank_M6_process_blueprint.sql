-- S35.3 M6 (OPOURSKA Layer 2-3 — Process blueprint) RTL Bank
-- BANKING-M industry_profile ha già 8 BP. Aggiungo 3 mancanti dal JSON profile:
-- Onboarding Cliente, Treasury Ops & ALM, Internal Audit.
-- Target: ≥10 BP coverage. Risultato finale: 11 BP.

BEGIN;

INSERT INTO business_processes (id, process_code, process_name, process_category, value_chain_position, description, profile_id, created_at, updated_at)
SELECT gen_random_uuid(), v.code, v.pname, v.cat, v.pos, v.descr, ip.id, now(), now()
FROM industry_profiles ip
JOIN (VALUES
  (
    'BP-009',
    'Onboarding Cliente (KYC + AML Screening)',
    'primary',
    1,
    'Processo di apertura conto e screening cliente: account opening, verifica documentale, KYC profiling, AML screening (UIF watchlist + sanctions check), attivazione prodotti. Coinvolge Retail + Compliance + Operations.'
  ),
  (
    'BP-010',
    'Treasury Operations & ALM',
    'primary',
    2,
    'Gestione liquidità banca: forecast liquidità, esecuzione funding (interbank + repo + emissioni obbligazionarie), FX hedging operativo, ALM reporting (LCR/NSFR/IRRBB). Output: posizione liquidità giornaliera + stress test mensile.'
  ),
  (
    'BP-011',
    'Internal Audit (Banca d''Italia Circ. 285/295)',
    'support',
    9,
    'Internal audit framework per banche: planning annuale (audit universe), fieldwork (test of controls + sostantivo), reporting (findings prioritizzati H/M/L), follow-up remediation. Riporta a Comitato Controlli Interni + CdA. Frequency: quarterly risk-based + ad-hoc su finding ispettivo BdI.'
  )
) AS v(code, pname, cat, pos, descr) ON true
WHERE ip.code = 'BANKING-M'
  AND NOT EXISTS (
    SELECT 1 FROM business_processes bp
    WHERE bp.profile_id = ip.id AND bp.process_code = v.code
  );

INSERT INTO schema_migrations (version, applied_at)
VALUES ('S35.3_M6_opourska_rtl_bank_process_blueprint', now())
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Verification:
-- SELECT count(*) FROM business_processes WHERE profile_id=(SELECT id FROM industry_profiles WHERE code='BANKING-M');
-- Expected: 11 (8 pre-existing + 3 new)
