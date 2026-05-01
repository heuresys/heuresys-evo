--
-- PostgreSQL database dump
--

\restrict bzQ4KL42MxyBJqw6cE2IYVggHp3YOkam42ng3vnzVoeJJzUgPOjb3Ey2zuX9O4w

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg12+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: rbp_functional_areas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rbp_functional_areas (id, code, name, description, category, sort_order, is_active, created_at, updated_at, name_it, name_en, description_it, description_en) FROM stdin;
1	PLATFORM	Platform Management	Gestione piattaforma: tenant, licenze, system health	SYSTEM	1	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Gestione Piattaforma	Platform Management	Gestione piattaforma: tenant, licenze, stato del sistema	Platform management: tenants, licenses, system health
2	SECURITY	Security & Access	Utenti, ruoli, SSO, API keys, audit log, tenant config	SYSTEM	2	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Sicurezza e Accessi	Security & Access	Utenti, ruoli, SSO, chiavi API, log di audit, configurazione tenant	Users, roles, SSO, API keys, audit log, tenant configuration
3	CORE_HR	Core HR	Anagrafiche, contratti, onboarding, documenti, sedi, centri costo	HR	3	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Risorse Umane Base	Core HR	Anagrafiche, contratti, onboarding, documenti, sedi, centri costo	Employee records, contracts, onboarding, documents, locations, cost centers
4	TALENT	Talent & Skills	Skills, ESCO explorer, skill profiles, gap analysis, career paths, succession	HR	4	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Talento e Competenze	Talent & Skills	Competenze, ESCO explorer, profili skill, gap analysis, career path, successione	Skills, ESCO explorer, skill profiles, gap analysis, career paths, succession
5	PERFORMANCE	Performance Management	Review cycles, goals, OKR, check-in, feedback, calibration	HR	5	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Gestione Performance	Performance Management	Cicli di valutazione, obiettivi, OKR, check-in, feedback, calibrazione	Review cycles, goals, OKR, check-ins, feedback, calibration
6	COMPENSATION	Compensation & Benefits	Stipendi, salary bands, bonus plans, merit cycles, equity, benefits	HR	6	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Retribuzione e Benefit	Compensation & Benefits	Stipendi, fasce salariali, piani bonus, cicli merito, equity, benefit	Salaries, salary bands, bonus plans, merit cycles, equity, benefits
7	TIME_ATTENDANCE	Time & Attendance	Presenze, ferie, straordinari, turni	HR	7	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Presenze e Assenze	Time & Attendance	Presenze, ferie, straordinari, turni	Attendance, time off, overtime, shifts
8	LEARNING	Learning & Development	Formazione, corsi, certificazioni, percorsi formativi, knowledge base	HR	8	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Formazione e Sviluppo	Learning & Development	Formazione, corsi, certificazioni, percorsi formativi, base di conoscenza	Training, courses, certifications, learning paths, knowledge base
9	RECRUITMENT	Recruitment	Requisizioni, job posting, candidati, pipeline selezione	HR	9	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Selezione del Personale	Recruitment	Requisizioni, annunci di lavoro, candidati, pipeline selezione	Requisitions, job postings, candidates, selection pipeline
10	CAREER	Career Management	Obiettivi carriera, competenze, percorsi, mentoring, career coach AI	HR	10	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Gestione Carriere	Career Management	Obiettivi carriera, competenze, percorsi, mentoring, career coach AI	Career goals, skills, paths, mentoring, AI career coach
11	ANALYTICS	Analytics & Reporting	Workforce analytics, compensation analytics, HR intelligence, predictions, export	BUSINESS	11	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Analytics e Report	Analytics & Reporting	Workforce analytics, compensation analytics, HR intelligence, previsioni, esportazione	Workforce analytics, compensation analytics, HR intelligence, predictions, export
15	TEAMS	Teams	Team trasversali, composizione, obiettivi team	BUSINESS	15	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Team	Teams	Team trasversali, composizione, obiettivi di team	Cross-functional teams, composition, team goals
12	COMPANY_ANALYTICS	Company PET Analytics	Hub analitico organizzativo: struttura, costi, workforce, demographics, scenari	BUSINESS	12	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Analytics Aziendale PET	Company PET Analytics	Hub analitico organizzativo: struttura, costi, workforce, demographics, scenari	Organizational analytics hub: structure, costs, workforce, demographics, scenarios
13	WORKFORCE_INTELLIGENCE	Workforce Intelligence	Career simulator, skill galaxy, what-if scenarios, org dashboard	BUSINESS	13	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Workforce Intelligence	Workforce Intelligence	Simulatore carriera, mappa competenze, scenari what-if, dashboard organizzativa	Career simulator, skill galaxy, what-if scenarios, org dashboard
14	ORGANIZATION	Organization	Dipartimenti, posizioni, unità organizzative, organigramma	BUSINESS	14	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Organizzazione	Organization	Dipartimenti, posizioni, unita organizzative, organigramma	Departments, positions, organizational units, org chart
16	ENGAGEMENT	Engagement	Wellbeing, social recognition, mentorship, survey, pulse	HR	16	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Engagement	Engagement	Benessere, riconoscimenti social, mentoring, sondaggi, pulse	Wellbeing, social recognition, mentorship, survey, pulse
17	COMPLIANCE	Compliance	Audit trail, policy violations, whistleblowing	HR	17	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Compliance	Compliance	Audit trail, violazioni policy, whistleblowing	Audit trail, policy violations, whistleblowing
18	AI_SERVICES	AI Services	Chat AI, analisi documenti, sessioni AI	SYSTEM	18	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Servizi AI	AI Services	Chat AI, analisi documenti, sessioni AI	AI chat, document analysis, AI sessions
19	MARKETPLACE	Marketplace	Plugin, integrazioni, developer tools, API keys, webhooks	SYSTEM	19	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Marketplace	Marketplace	Plugin, integrazioni, strumenti sviluppatore, chiavi API, webhook	Plugins, integrations, developer tools, API keys, webhooks
20	SELF_SERVICE	Self-Service	Profilo, obiettivi, formazione, documenti, buste paga, ferie	PORTAL	20	t	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Self-Service	Self-Service	Profilo, obiettivi, formazione, documenti, buste paga, ferie	Profile, goals, training, documents, payslips, time off
22	PROCESS_MANAGEMENT	Process Management	Blueprint, process layer, workflow engine, tenant onboarding automatizzato	BUSINESS	21	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Gestione Processi	Process Management	Blueprint, layer processi, motore workflow, onboarding tenant automatizzato	Blueprint, process layer, workflow engine, automated tenant onboarding
23	KNOWLEDGE_GRAPH	Knowledge Graph	NACE/ATECO taxonomy, ESCO ontology, industry classifications, entity relations	SYSTEM	22	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Knowledge Graph	Knowledge Graph	Tassonomia NACE/ATECO, ontologia ESCO, classificazioni industriali, relazioni tra entita	NACE/ATECO taxonomy, ESCO ontology, industry classifications, entity relations
24	SEMANTIC_SEARCH	Semantic Search	Ricerca semantica cross-entity, embeddings, similarity search	SYSTEM	23	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Ricerca Semantica	Semantic Search	Ricerca semantica cross-entity, embeddings, similarity search	Cross-entity semantic search, embeddings, similarity search
25	DATA_INTEGRATION	Data Integration	SAP migration, import engine, staging, data pipeline, delta sync	SYSTEM	24	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Integrazione Dati	Data Integration	Migrazione SAP, motore di importazione, staging, data pipeline, sincronizzazione delta	SAP migration, import engine, staging, data pipeline, delta sync
26	NOTIFICATIONS	Notifications & News	Notifiche push, news feed, comunicazioni interne	PORTAL	25	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Notifiche e News	Notifications & News	Notifiche push, news feed, comunicazioni interne	Push notifications, news feed, internal communications
27	SYSTEM_OPS	System Operations	Health monitoring, metrics, error analytics, service config	SYSTEM	26	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Operazioni di Sistema	System Operations	Monitoraggio salute sistema, metriche, analisi errori, configurazione servizi	Health monitoring, metrics, error analytics, service configuration
28	PUBLIC_API	Public API	API esterna per integrazioni third-party, rate limiting, documentazione	SYSTEM	27	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	API Pubblica	Public API	API esterna per integrazioni third-party, rate limiting, documentazione	External API for third-party integrations, rate limiting, documentation
29	BENCHMARKING	Benchmarking	Confronti retributivi, benchmark di mercato, report comparativi	HR	28	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Benchmarking	Benchmarking	Confronti retributivi, benchmark di mercato, report comparativi	Compensation benchmarks, market comparisons, comparative reports
30	AI_QUALITY	AI Quality & Review	Inference review, skill extraction QA, validation suggerimenti AI	SYSTEM	29	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Qualita AI e Revisione	AI Quality & Review	Revisione inferenze, QA estrazione skill, validazione suggerimenti AI	Inference review, skill extraction QA, AI suggestion validation
31	DESIGN_TOOLS	Design Tools	Prototypes, design editor, wireframe builder	SYSTEM	30	t	2026-04-06 14:37:20.213853+00	2026-04-13 04:14:40.579201+00	Strumenti di Design	Design Tools	Prototipi, editor di design, costruttore wireframe	Prototypes, design editor, wireframe builder
32	PLATFORM_NAVIGATOR	Platform Navigator	Dynamic navigation and dashboard aggregation engine. Manages role-based routing, menu structure, page visibility and tenant-level customizations.	SYSTEM	0	t	2026-04-06 14:55:25.862458+00	2026-04-13 04:14:40.579201+00	Navigatore Piattaforma	Platform Navigator	Motore dinamico di navigazione e aggregazione dashboard. Gestisce routing per ruolo, struttura menu, visibilita pagine e personalizzazioni a livello tenant.	Dynamic navigation and dashboard aggregation engine. Manages role-based routing, menu structure, page visibility and tenant-level customizations.
33	PERSPECTIVES	PET Perspectives	Three observation lenses on the platform: Process, Enterprise/Organization and Systems, Talent/HR. Provides panoramic views and cross-area filtering per perspective.	BUSINESS	0	t	2026-04-06 15:13:00.925241+00	2026-04-13 04:14:40.579201+00	Prospettive PET	PET Perspectives	Tre lenti di osservazione sulla piattaforma: Processo, Impresa/Organizzazione e Sistemi, Talento/HR. Offre viste panoramiche e filtri cross-area per prospettiva.	Three observation lenses on the platform: Process, Enterprise/Organization and Systems, Talent/HR. Provides panoramic views and cross-area filtering per perspective.
34	WORKSPACE	Personal Workspace	Customizable personal dashboard (Scrivania). Users compose widget-based views from available data sources filtered by their RBP permissions. Supports templates and from-scratch creation.	PORTAL	0	t	2026-04-06 15:15:31.021438+00	2026-04-13 04:14:40.579201+00	Scrivania Personale	Personal Workspace	Dashboard personale personalizzabile (Scrivania). Gli utenti compongono viste basate su widget dalle fonti dati disponibili filtrate dai permessi RBP. Supporta template e creazione da zero.	Customizable personal dashboard (Scrivania). Users compose widget-based views from available data sources filtered by their RBP permissions. Supports templates and from-scratch creation.
35	ENRICHMENT	Semantic Enrichment	Automated extraction and merge of structured facts from external sources into platform entities. Gates POST /api/v1/enrichment/* proxy routes.	SYSTEM	50	t	2026-04-12 01:15:29.395405+00	2026-04-13 04:14:40.579201+00	Arricchimento Semantico	Semantic Enrichment	Estrazione automatica e merge di dati strutturati da fonti esterne nelle entita della piattaforma. Gestisce le route proxy POST /api/v1/enrichment/*.	Automated extraction and merge of structured facts from external sources into platform entities. Gates POST /api/v1/enrichment/* proxy routes.
\.


--
-- Data for Name: admin_component_registry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_component_registry (id, tenant_id, code, name, description, frontend_path, export_name, export_kind, prop_shape, functional_area_code, scope_level, read_only, reuse_contexts, api_endpoints, verified_with_data, verified_at, created_at, updated_at, name_it, name_en, description_it, description_en) FROM stdin;
203a003e-b5fd-4150-b45c-50461e5df9a1	\N	tab-goals	Obiettivi Dipendente	Cards con progress bar, categoria, scadenza per ogni obiettivo.	services/frontend/src/app/admin/employees/[id]/_components/tab-goals.tsx	TabGoals	named	{"employeeId": "string"}	PERFORMANCE	employee	t	{admin,portal}	{/api/v1/goals?employee_id=:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Obiettivi Dipendente	Employee Goals	Cards con progress bar, categoria, scadenza per ogni obiettivo.	Cards with progress bar, category, deadline for each goal.
bd74c54f-facb-427b-a9c9-50436ed595b5	\N	tab-overview	Dati Anagrafici Dipendente	Identità, documenti, indirizzi, contatti, emergenza, famiglia, istruzione, bancari. Nessuna chiamata API: riceve employee object completo.	services/frontend/src/app/admin/employees/[id]/_components/tab-overview.tsx	default	default	{"employee": "object"}	CORE_HR	employee	t	{admin,portal}	{}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Dati Anagrafici Dipendente	Employee Overview	Identità, documenti, indirizzi, contatti, emergenza, famiglia, istruzione, bancari. Nessuna chiamata API: riceve employee object completo.	Identity, documents, addresses, contacts, emergency, family, education, banking. No API calls: receives complete employee object.
bd6ace2d-4bcd-4339-a399-8e89ec1ed7ae	\N	tab-organization	Organizzazione Dipendente	Ruolo, posizione, dipartimento, ciclo di vita contrattuale, retribuzione, SAP, autenticazione. Riceve employee object completo.	services/frontend/src/app/admin/employees/[id]/_components/tab-organization.tsx	default	default	{"employee": "object"}	ORGANIZATION	employee	t	{admin,portal}	{}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Organizzazione Dipendente	Employee Organization	Ruolo, posizione, dipartimento, ciclo di vita contrattuale, retribuzione, SAP, autenticazione. Riceve employee object completo.	Role, position, department, contract lifecycle, compensation, SAP, authentication. Receives complete employee object.
53ae2452-bb48-4507-b9a3-5521d078ae0b	\N	tab-contracts	Contratti Dipendente	Tabella contratti con tipo, CCNL, date, RAL, FTE, stato. Gestisce scadenza naturale per pensionamento.	services/frontend/src/app/admin/employees/[id]/_components/tab-contracts.tsx	TabContracts	named	{"employeeId": "string"}	CORE_HR	employee	t	{admin,portal}	{/api/v1/contracts/employee/:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Contratti Dipendente	Employee Contracts	Tabella contratti con tipo, CCNL, date, RAL, FTE, stato. Gestisce scadenza naturale per pensionamento.	Contracts table with type, collective agreement, dates, salary, FTE, status. Handles natural expiration for retirement.
f34e0956-50ef-44dc-968a-875f874b4561	\N	tab-skills	Competenze e Certificazioni	Skill list con composite score e gruppo, certificazioni con scadenza.	services/frontend/src/app/admin/employees/[id]/_components/tab-skills.tsx	TabSkills	named	{"employeeId": "string"}	TALENT	employee	t	{admin,portal}	{/api/v1/employee-skill-profiles/:employeeId,/api/v1/certifications/employee/:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Competenze e Certificazioni	Skills & Certifications	Skill list con composite score e gruppo, certificazioni con scadenza.	Skill list with composite score and group, certifications with expiration.
c69ab39c-73be-48d6-9a53-ebe84cf3fe7a	\N	tab-training	Formazione e Corsi	Enrollments con progress, stato, date iscrizione e completamento.	services/frontend/src/app/admin/employees/[id]/_components/tab-training.tsx	TabTraining	named	{"employeeId": "string"}	LEARNING	employee	t	{admin,portal}	{/api/v1/enrollments?employee_id=:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Formazione e Corsi	Training & Courses	Enrollments con progress, stato, date iscrizione e completamento.	Enrollments with progress, status, enrollment and completion dates.
683f917b-1134-44e7-997d-383244be99ed	\N	tab-performance	Performance: Review, Check-in, Feedback	Valutazioni con star rating, check-in con mood, feedback (continuous + 360).	services/frontend/src/app/admin/employees/[id]/_components/tab-performance.tsx	TabPerformance	named	{"employeeId": "string"}	PERFORMANCE	employee	t	{admin,portal}	{/api/v1/performance-reviews?employee_id=:employeeId,/api/v1/check-ins?employee_id=:employeeId,/api/v1/feedback?employee_id=:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Performance: Review, Check-in, Feedback	Performance: Reviews, Check-ins, Feedback	Valutazioni con star rating, check-in con mood, feedback (continuous + 360).	Reviews with star rating, check-ins with mood, feedback (continuous + 360).
759f1cc6-6555-43bc-9227-edef6b5f0c1e	\N	tab-attendance	Presenze e Richieste	Tabelle presenze, richieste ferie/permessi (self-service), straordinari.	services/frontend/src/app/admin/employees/[id]/_components/tab-attendance.tsx	TabAttendance	named	{"employeeId": "string"}	TIME_ATTENDANCE	employee	t	{admin,portal}	{/api/v1/attendance?employee_id=:employeeId,/api/v1/time-off/my/requests,/api/v1/overtime?employee_id=:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Presenze e Richieste	Attendance & Requests	Tabelle presenze, richieste ferie/permessi (self-service), straordinari.	Attendance tables, time off requests (self-service), overtime.
881da444-85cc-4062-ae30-46152dc7cdc4	\N	tab-documents	Documenti Dipendente	Tabella documenti con tipo, stato, file, scadenza. Badge riservato per documenti con visibility=confidential.	services/frontend/src/app/admin/employees/[id]/_components/tab-documents.tsx	TabDocuments	named	{"employeeId": "string"}	CORE_HR	employee	t	{admin,portal}	{/api/v1/employee-documents?employee_id=:employeeId}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Documenti Dipendente	Employee Documents	Tabella documenti con tipo, stato, file, scadenza. Badge riservato per documenti con visibility=confidential.	Documents table with type, status, file, expiration. Confidential badge for documents with visibility=confidential.
c11ce76d-32e6-4cab-97a0-b197d83f5efe	\N	tab-career-risk	Carriera e Rischio	Profilo carriera (recommendations), piani successione (candidate filter), benessere (aggregato da check-in), rischio turnover.	services/frontend/src/app/admin/employees/[id]/_components/tab-career-risk.tsx	TabCareerRisk	named	{"employeeId": "string"}	CAREER	employee	t	{admin,portal}	{/api/v1/career-paths/recommendations/:employeeId,/api/v1/succession/candidates,/api/v1/wellbeing/employee/:employeeId,/api/v1/predictions/turnover/high-risk}	t	2026-04-10 00:00:00+00	2026-04-10 17:11:09.896806+00	2026-04-10 17:11:09.896806+00	Carriera e Rischio	Career & Risk	Profilo carriera (recommendations), piani successione (candidate filter), benessere (aggregato da check-in), rischio turnover.	Career profile (recommendations), succession plans (candidate filter), wellbeing (aggregated from check-ins), turnover risk.
da0c6c58-8de6-4c2d-9fd2-800e2b91470d	\N	tab-career-landing	Career Landing (candidato extraction)	Dashboard carriera personale: profilo professionale, tracks attivi, kpi. 552 LOC pagina admin /admin/career. Candidato extraction verso /portal/career (TASK-C1).	services/frontend/src/app/admin/career/_components/career-dashboard-view.tsx	CareerDashboardView	named	{"readOnly": "boolean", "linkPrefix": "string", "headerActions": "ReactNode"}	CAREER	employee	f	{admin,portal}	{/api/v1/career/me,/api/v1/career/tracks}	t	2026-04-12 20:13:20.939198+00	2026-04-11 20:01:10.792143+00	2026-04-12 20:13:20.939198+00	Career Landing (candidato extraction)	Career Landing	Dashboard carriera personale: profilo professionale, tracks attivi, kpi. 552 LOC pagina admin /admin/career. Candidato extraction verso /portal/career (TASK-C1).	Personal career dashboard: professional profile, active tracks, KPIs. 552 LOC admin page /admin/career. Candidate extraction to /portal/career (TASK-C1).
f6736c30-349d-4be6-a064-70de7fffc036	\N	tab-learning-catalog	Learning Catalog + Enrollments (candidato extraction)	Catalogo corsi + iscrizioni personali: 566 LOC pagina admin /admin/career/learning. Candidato extraction verso /portal/learning (TASK-C2).	services/frontend/src/app/admin/career/learning/_components/learning-catalog-view.tsx	LearningCatalogView	named	{"readOnly": "boolean", "linkPrefix": "string", "headerActions": "ReactNode"}	LEARNING	employee	f	{admin,portal}	{/api/v1/learning/courses,/api/v1/learning/enrollments}	t	2026-04-12 20:13:20.939198+00	2026-04-11 20:01:10.792143+00	2026-04-12 20:13:20.939198+00	Learning Catalog + Enrollments (candidato extraction)	Learning Catalog & Enrollments	Catalogo corsi + iscrizioni personali: 566 LOC pagina admin /admin/career/learning. Candidato extraction verso /portal/learning (TASK-C2).	Course catalog + personal enrollments: 566 LOC admin page /admin/career/learning. Candidate extraction to /portal/learning (TASK-C2).
dc31ed5f-0461-4b75-a95d-516d04396bb0	\N	tab-skill-self-assessment	Skill Self-Assessment (candidato extraction)	Self-assessment skill con gap analysis: 546 LOC pagina admin /admin/career/skills. Candidato extraction verso tab-skill-self-assessment in /portal/profile (TASK-C3).	services/frontend/src/app/admin/career/skills/_components/skill-assessment-view.tsx	SkillAssessmentView	named	{"readOnly": "boolean", "linkPrefix": "string", "headerActions": "ReactNode"}	TALENT	employee	f	{admin,portal}	{/api/v1/skills/self-assessment,/api/v1/career/gap-analysis}	t	2026-04-12 20:13:20.939198+00	2026-04-11 20:01:10.792143+00	2026-04-12 20:13:20.939198+00	Skill Self-Assessment (candidato extraction)	Skill Self-Assessment	Self-assessment skill con gap analysis: 546 LOC pagina admin /admin/career/skills. Candidato extraction verso tab-skill-self-assessment in /portal/profile (TASK-C3).	Skill self-assessment with gap analysis: 546 LOC admin page /admin/career/skills. Candidate extraction to tab-skill-self-assessment in /portal/profile (TASK-C3).
812462ee-61fe-42b5-bb32-71a040ddece2	\N	tab-workforce-kpis	Workforce KPIs Dashboard (candidato extraction)	Workforce analytics: headcount, turnover, org chart mini, team absences. 515 LOC pagina admin /admin/analytics/workforce. Candidato extraction verso widget set workspace (TASK-C4).	services/frontend/src/app/admin/analytics/workforce/_components/workforce-kpis-view.tsx	WorkforceKpisView	named	{"readOnly": "boolean", "headerActions": "ReactNode"}	ANALYTICS	tenant	f	{admin,portal}	{/api/v1/analytics/workforce,/api/v1/employees/analytics-stats}	t	2026-04-12 20:13:20.939198+00	2026-04-11 20:01:10.792143+00	2026-04-12 20:13:20.939198+00	Workforce KPIs Dashboard (candidato extraction)	Workforce KPIs Dashboard	Workforce analytics: headcount, turnover, org chart mini, team absences. 515 LOC pagina admin /admin/analytics/workforce. Candidato extraction verso widget set workspace (TASK-C4).	Workforce analytics: headcount, turnover, org chart mini, team absences. 515 LOC admin page /admin/analytics/workforce. Candidate extraction to workspace widget set (TASK-C4).
0cf5589a-097b-43a7-aefc-2b9a86ae8f6a	\N	tab-org-structure	Org Structure Explorer (candidato extraction)	Drill-down completo struttura organizzativa con org-units, manager, team. 483 LOC pagina admin /admin/org-units. Candidato extraction verso /portal/org-chart full (TASK-C5).	services/frontend/src/app/admin/org-units/_components/org-units-view.tsx	OrgUnitsView	named	{"readOnly": "boolean", "headerActions": "ReactNode", "renderRowActions": "function"}	ORGANIZATION	tenant	f	{admin,portal}	{/api/v1/org-units,/api/v1/employees}	t	2026-04-12 20:13:20.939198+00	2026-04-11 20:01:10.792143+00	2026-04-12 20:13:20.939198+00	Org Structure Explorer (candidato extraction)	Org Structure Explorer	Drill-down completo struttura organizzativa con org-units, manager, team. 483 LOC pagina admin /admin/org-units. Candidato extraction verso /portal/org-chart full (TASK-C5).	Complete drill-down of organizational structure with org-units, managers, teams. 483 LOC admin page /admin/org-units. Candidate extraction to /portal/org-chart full (TASK-C5).
\.


--
-- Data for Name: rbp_dashboards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rbp_dashboards (id, code, name, description, layout_path, icon, sort_order, is_active, theme_config, created_at, updated_at, name_it, name_en, description_it, description_en) FROM stdin;
1	platform_console	Platform Console	Tenant management, system health, billing	/platform	server	1	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Console Piattaforma	Platform Console	Tenant management, system health, billing	Tenant management, system health, billing
2	tech_admin	Tech Administration	Configurazione, SSO, integrazioni, log, utenti, marketplace	/admin	settings	2	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Amministrazione Tecnica	Tech Administration	Configurazione, SSO, integrazioni, log, utenti, marketplace	Configuration, SSO, integrations, logs, users, marketplace
3	hr_strategic	HR Strategic	Succession, calibration, compensation modeling, analytics	/admin	briefcase	3	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	HR Strategico	HR Strategic	Succession, calibration, compensation modeling, analytics	Succession, calibration, compensation modeling, analytics
4	hr_operations	HR Operations	Recruiting, formazione, performance, presenze	/admin	users	4	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Operazioni HR	HR Operations	Recruiting, formazione, performance, presenze	Recruiting, training, performance, attendance
5	department_console	Department Console	HR-like scoped al dipartimento: team, performance, budget	/admin	building	5	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Console Dipartimento	Department Console	HR-like scoped al dipartimento: team, performance, budget	HR-like scoped to department: team, performance, budget
6	company_pet	Company PET Analytics	Hub analitico organizzativo: struttura, costi, workforce	/company-pet	bar-chart-2	6	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Analytics Aziendale PET	Company PET Analytics	Hub analitico organizzativo: struttura, costi, workforce	Organizational analytics hub: structure, costs, workforce
7	workforce_intelligence	Workforce Intelligence	Career simulator, skill galaxy, what-if, org dashboard	/admin	brain	7	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Workforce Intelligence	Workforce Intelligence	Career simulator, skill galaxy, what-if, org dashboard	Career simulator, skill galaxy, what-if, org dashboard
8	dashboards_hub	Dashboards Hub	Taxonomy explorer (ESCO/NACE), dashboard prototyping	/dashboards	layout-grid	8	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Hub Dashboard	Dashboards Hub	Taxonomy explorer (ESCO/NACE), dashboard prototyping	Taxonomy explorer (ESCO/NACE), dashboard prototyping
9	manager_hub	Manager Hub	Portal arricchito: catena gerarchica, approvazioni, valutazioni	/portal	user-check	9	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Hub Manager	Manager Hub	Portal arricchito: catena gerarchica, approvazioni, valutazioni	Enriched portal: hierarchy chain, approvals, reviews
10	employee_portal	Employee Self-Service	Self-service: profilo, obiettivi, formazione, ferie, documenti	/portal	user	10	t	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	Portale Dipendente	Employee Self-Service	Self-service: profilo, obiettivi, formazione, ferie, documenti	Self-service: profile, goals, training, time off, documents
11	executive_overview	Executive Overview	Vista strategica per CEO/DG — read-only su tutti i dati del tenant	/admin	BarChart3	1	t	{}	2026-04-06 13:58:51.57302+00	2026-04-13 04:14:40.579201+00	Vista Direzionale	Executive Overview	Vista strategica per CEO/DG — read-only su tutti i dati del tenant	Strategic view for CEO/GM — read-only on all tenant data
\.


--
-- Data for Name: rbp_perspectives; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rbp_perspectives (code, name, description, icon, color, sort_order, created_at, name_it, name_en, description_it, description_en) FROM stdin;
PROCESS	Process	Business process design, workflow management, compliance and operational governance	GitBranch	#3B82F6	1	2026-04-06 15:12:24.311728+00	Processi	Process	Progettazione processi aziendali, gestione workflow, compliance e governance operativa	Business process design, workflow management, compliance and operational governance
ENTERPRISE	Organization & Systems	Organizational structure, IT systems, platform infrastructure and integrations	Building2	#8B5CF6	2	2026-04-06 15:12:24.311728+00	Organizzazione e Sistemi	Organization & Systems	Struttura organizzativa, sistemi IT, infrastruttura piattaforma e integrazioni	Organizational structure, IT systems, platform infrastructure and integrations
TALENT	Human Resources	People management, talent development, performance, compensation and employee lifecycle	Users	#10B981	3	2026-04-06 15:12:24.311728+00	Risorse Umane	Human Resources	Gestione delle persone, sviluppo del talento, performance, retribuzioni e ciclo di vita del dipendente	People management, talent development, performance, compensation and employee lifecycle
\.


--
-- Data for Name: rbp_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rbp_roles (id, code, name, description, hierarchy_level, is_system_role, is_assignable, inherits_from, metadata, created_at, updated_at, default_dashboard_code, description_it, description_en) FROM stdin;
1	SUPERUSER	Platform Owner	Proprietario della piattaforma. Solo aggregati cross-tenant, mai dati personali. Accesso emergenza via break-glass.	-1	t	f	\N	{"max_sessions": 3, "mfa_required": true}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	platform_console	Proprietario della piattaforma. Solo aggregati cross-tenant, mai dati personali. Accesso emergenza via break-glass.	Platform owner. Cross-tenant aggregates only, never personal data. Emergency access via break-glass.
4	HR_DIRECTOR	HR Director	HR strategico: succession, calibration, compensation, workforce analytics. Scope: intero tenant.	2	t	t	EMPLOYEE	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	hr_strategic	HR strategico: succession, calibration, compensation, workforce analytics. Scope: intero tenant.	Strategic HR: succession, calibration, compensation, workforce analytics. Scope: entire tenant.
5	HR_MANAGER	HR Manager	HR operativo: recruiting, formazione, performance, presenze. Scope: intero tenant.	3	t	t	EMPLOYEE	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	hr_operations	HR operativo: recruiting, formazione, performance, presenze. Scope: intero tenant.	Operational HR: recruiting, training, performance, attendance. Scope: entire tenant.
6	DEPT_HEAD	Department Head	Full HR view scoped al proprio dipartimento. Vede budget, analytics, performance del dipartimento.	4	t	t	LINE_MANAGER	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	department_console	Full HR view scoped al proprio dipartimento. Vede budget, analytics, performance del dipartimento.	Full HR view scoped to own department. Sees budget, analytics, department performance.
7	LINE_MANAGER	Line Manager	Gestione linea gerarchica: approvazioni, valutazioni, obiettivi. Scope: catena ricorsiva.	5	t	t	EMPLOYEE	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	manager_hub	Gestione linea gerarchica: approvazioni, valutazioni, obiettivi. Scope: catena ricorsiva.	Line hierarchy management: approvals, reviews, goals. Scope: recursive chain.
8	EMPLOYEE	Employee	Self-service: profilo, obiettivi, formazione, ferie. Vede solo se stesso + organigramma read-only.	6	t	t	\N	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	employee_portal	Self-service: profilo, obiettivi, formazione, ferie. Vede solo se stesso + organigramma read-only.	Self-service: profile, goals, training, time off. Sees only self + read-only org chart.
3	IT_ADMIN	IT Administrator	Gestione IT del tenant: sicurezza, integrazioni, log tecnici. Nessun accesso a dati HR.	1	t	t	EMPLOYEE	{}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	tech_admin	Gestione IT del tenant: sicurezza, integrazioni, log tecnici. Nessun accesso a dati HR.	Tenant IT management: security, integrations, technical logs. No access to HR data.
2	TENANT_OWNER	Tenant Owner	CEO / Direttore Generale — Massima visibilità read-only su tutti i dati del tenant	0	t	t	EMPLOYEE	{"mfa_required": true}	2026-03-29 23:41:51.972227+00	2026-04-13 04:14:40.579201+00	executive_overview	CEO / Direttore Generale — Massima visibilità read-only su tutti i dati del tenant	CEO / General Manager — Maximum read-only visibility on all tenant data
\.


--
-- Data for Name: rbp_role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rbp_role_permissions (id, role_id, functional_area_id, can_view, can_create, can_edit, can_delete, can_approve, can_export, scope_type, conditions, created_at, updated_at) FROM stdin;
1	1	1	t	t	t	t	t	t	PLATFORM	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
2	3	2	t	f	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
4	1	2	t	t	t	f	t	t	PLATFORM	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
6	5	3	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
7	4	3	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
9	7	4	t	f	f	f	f	f	HIERARCHY	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
11	5	4	t	t	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
12	4	4	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
16	5	5	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
17	4	5	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
19	6	6	t	f	f	f	f	f	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
20	5	6	t	f	f	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
21	4	6	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
25	5	7	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
26	4	7	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
28	5	8	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
29	4	8	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
30	5	9	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
31	4	9	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
33	7	10	t	f	f	f	f	f	HIERARCHY	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
35	5	10	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
36	4	10	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
37	6	11	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
38	5	11	t	f	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
39	4	11	t	t	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
40	6	12	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
41	5	12	t	f	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
42	4	12	t	t	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
43	4	13	t	t	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
45	7	14	t	f	f	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
46	6	14	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
47	5	14	t	f	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
48	4	14	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
51	7	15	t	f	f	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
53	5	15	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
54	4	15	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
56	7	16	t	f	f	f	f	f	HIERARCHY	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
57	6	16	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
58	5	16	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
59	4	16	t	t	t	t	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
60	6	17	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
61	5	17	t	t	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
62	4	17	t	t	t	f	t	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
65	5	18	t	t	f	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
67	3	18	t	f	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
69	1	18	t	f	f	f	f	t	PLATFORM	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
70	3	19	t	t	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
72	1	19	t	t	t	t	t	t	PLATFORM	{}	2026-03-29 23:41:51.972227+00	2026-03-29 23:41:51.972227+00
32	8	10	t	f	f	f	f	f	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 13:38:42.031549+00
44	8	14	t	f	f	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 13:38:42.031549+00
50	8	15	t	f	f	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 13:38:42.031549+00
55	8	16	t	f	f	f	f	f	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 13:38:42.031549+00
64	8	18	t	f	f	f	f	f	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 13:38:42.031549+00
14	7	5	t	f	f	f	f	f	HIERARCHY	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
78	2	2	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
79	2	3	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
80	2	4	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
81	2	5	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
82	2	6	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
83	2	7	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
84	2	8	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
85	2	9	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
86	2	10	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
87	2	11	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
88	2	12	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
89	2	13	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
90	2	14	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
91	2	15	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
92	2	16	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
93	2	17	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
94	2	18	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
95	2	19	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 13:58:29.549075+00
77	4	20	t	f	t	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 18:49:32.056253+00
97	8	7	t	t	f	f	f	f	SELF	{}	2026-04-06 14:23:27.304656+00	2026-04-06 14:23:27.304656+00
73	8	20	t	t	f	f	f	t	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:27.304656+00
5	6	3	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
10	6	4	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
15	6	5	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
76	5	20	t	f	t	f	f	f	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 18:49:32.056253+00
27	6	8	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
34	6	10	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
52	6	15	t	f	f	f	f	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
75	6	20	t	f	f	f	f	f	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
74	7	20	t	f	f	f	f	t	SELF	{}	2026-03-29 23:41:51.972227+00	2026-04-06 14:23:43.786398+00
98	1	22	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:20.102463+00	2026-04-06 14:38:20.102463+00
99	2	22	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
100	3	22	t	t	t	t	f	t	TENANT	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
101	4	22	t	t	t	f	t	t	TENANT	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
102	5	22	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
103	6	22	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
104	7	22	t	f	f	f	f	f	HIERARCHY	{}	2026-04-06 14:38:41.584146+00	2026-04-06 14:38:41.584146+00
105	1	23	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:41.689268+00	2026-04-06 14:38:41.689268+00
106	2	23	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.689268+00	2026-04-06 14:38:41.689268+00
107	3	23	t	t	t	t	f	t	TENANT	{}	2026-04-06 14:38:41.689268+00	2026-04-06 14:38:41.689268+00
108	4	23	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.689268+00	2026-04-06 14:38:41.689268+00
109	5	23	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.689268+00	2026-04-06 14:38:41.689268+00
110	1	24	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
111	2	24	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
112	3	24	t	f	t	f	f	t	TENANT	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
113	4	24	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
114	5	24	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
115	6	24	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
116	7	24	t	f	f	f	f	f	HIERARCHY	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
117	8	24	t	f	f	f	f	f	SELF	{}	2026-04-06 14:38:41.773805+00	2026-04-06 14:38:41.773805+00
118	1	25	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:41.85702+00	2026-04-06 14:38:41.85702+00
119	2	25	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:41.85702+00	2026-04-06 14:38:41.85702+00
120	3	25	t	t	t	t	t	t	TENANT	{}	2026-04-06 14:38:41.85702+00	2026-04-06 14:38:41.85702+00
121	4	25	t	t	t	f	t	t	TENANT	{}	2026-04-06 14:38:41.85702+00	2026-04-06 14:38:41.85702+00
122	1	26	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
123	2	26	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
124	3	26	t	t	t	t	f	f	TENANT	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
125	4	26	t	t	t	f	f	f	TENANT	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
126	5	26	t	t	t	f	f	f	TENANT	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
127	6	26	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
128	7	26	t	f	f	f	f	f	HIERARCHY	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
129	8	26	t	f	f	f	f	f	SELF	{}	2026-04-06 14:38:41.938182+00	2026-04-06 14:38:41.938182+00
130	1	27	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:42.021154+00	2026-04-06 14:38:42.021154+00
131	2	27	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:42.021154+00	2026-04-06 14:38:42.021154+00
132	3	27	t	t	t	f	f	t	TENANT	{}	2026-04-06 14:38:42.021154+00	2026-04-06 14:38:42.021154+00
133	1	28	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:42.099862+00	2026-04-06 14:38:42.099862+00
134	2	28	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:42.099862+00	2026-04-06 14:38:42.099862+00
135	3	28	t	t	t	t	f	t	TENANT	{}	2026-04-06 14:38:42.099862+00	2026-04-06 14:38:42.099862+00
136	1	29	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
137	2	29	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
138	3	29	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
139	4	29	t	t	t	f	t	t	TENANT	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
140	5	29	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
141	6	29	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 14:38:42.182144+00	2026-04-06 14:38:42.182144+00
142	1	30	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:42.262432+00	2026-04-06 14:38:42.262432+00
143	2	30	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:38:42.262432+00	2026-04-06 14:38:42.262432+00
144	3	30	t	t	t	f	t	t	TENANT	{}	2026-04-06 14:38:42.262432+00	2026-04-06 14:38:42.262432+00
145	4	30	t	t	t	f	t	t	TENANT	{}	2026-04-06 14:38:42.262432+00	2026-04-06 14:38:42.262432+00
146	5	30	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:38:42.262432+00	2026-04-06 14:38:42.262432+00
147	1	31	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:38:42.344775+00	2026-04-06 14:38:42.344775+00
148	3	31	t	t	t	t	f	t	TENANT	{}	2026-04-06 14:38:42.344775+00	2026-04-06 14:38:42.344775+00
149	1	32	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 14:55:39.411179+00	2026-04-06 14:55:39.411179+00
150	2	32	t	f	f	f	f	t	TENANT	{}	2026-04-06 14:55:40.780841+00	2026-04-06 14:55:40.780841+00
151	3	32	t	t	t	f	f	f	TENANT	{}	2026-04-06 14:55:42.580603+00	2026-04-06 14:55:42.580603+00
152	4	32	t	f	f	f	f	f	TENANT	{}	2026-04-06 14:55:44.175751+00	2026-04-06 14:55:44.175751+00
153	1	33	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
154	2	33	t	f	f	f	f	t	TENANT	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
155	3	33	t	t	t	f	f	f	TENANT	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
156	4	33	t	f	f	f	f	t	TENANT	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
157	5	33	t	f	f	f	f	f	TENANT	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
158	6	33	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
159	7	33	t	f	f	f	f	f	TEAM	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
160	8	33	t	f	f	f	f	f	SELF	{}	2026-04-06 15:13:27.809477+00	2026-04-06 15:13:27.809477+00
161	1	34	t	t	t	t	t	t	PLATFORM	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
162	2	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
163	3	34	t	t	t	t	f	f	TENANT	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
164	4	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
165	5	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
166	6	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
167	7	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
168	8	34	t	t	t	f	f	f	SELF	{}	2026-04-06 15:15:43.542331+00	2026-04-06 15:15:43.542331+00
169	3	3	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 18:47:26.180364+00	2026-04-06 18:47:26.180364+00
170	3	7	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 18:47:26.180364+00	2026-04-06 18:47:26.180364+00
171	3	11	t	f	f	f	f	f	DEPARTMENT	{}	2026-04-06 18:47:26.180364+00	2026-04-06 18:47:26.180364+00
172	3	17	t	f	f	f	f	f	TENANT	{}	2026-04-06 18:47:26.180364+00	2026-04-06 18:47:26.180364+00
23	7	7	t	f	f	f	t	f	HIERARCHY	{}	2026-03-29 23:41:51.972227+00	2026-04-06 18:47:26.180364+00
24	6	7	t	f	f	f	t	t	DEPARTMENT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 18:47:26.180364+00
96	2	20	t	f	f	f	f	t	TENANT	{}	2026-04-06 13:58:29.549075+00	2026-04-06 18:47:26.180364+00
173	4	2	t	f	f	f	f	f	TENANT	{}	2026-04-06 18:47:26.180364+00	2026-04-06 18:47:26.180364+00
66	4	18	t	t	t	f	f	t	TENANT	{}	2026-03-29 23:41:51.972227+00	2026-04-06 18:47:26.180364+00
174	8	3	t	f	f	f	f	f	SELF	{}	2026-04-06 18:48:13.955062+00	2026-04-06 18:48:13.955062+00
175	7	3	t	f	f	f	f	f	HIERARCHY	{}	2026-04-06 18:48:13.955062+00	2026-04-06 18:48:13.955062+00
176	7	11	t	f	f	f	f	f	HIERARCHY	{}	2026-04-06 18:48:13.955062+00	2026-04-06 18:48:13.955062+00
177	1	35	t	t	t	t	t	f	PLATFORM	{}	2026-04-12 01:15:29.397598+00	2026-04-12 01:15:29.397598+00
178	4	35	t	t	f	f	f	f	TENANT	{}	2026-04-12 01:15:29.397598+00	2026-04-12 01:15:29.397598+00
179	3	35	t	f	f	f	f	f	TENANT	{}	2026-04-12 01:15:29.397598+00	2026-04-12 01:15:29.397598+00
180	2	35	t	t	t	t	t	f	TENANT	{}	2026-04-12 01:15:29.397598+00	2026-04-12 01:15:29.397598+00
181	8	5	t	f	f	f	f	f	SELF	{}	2026-04-13 23:09:32.337358+00	2026-04-13 23:09:32.337358+00
182	3	5	t	f	f	f	f	f	TEAM	{}	2026-04-14 17:54:36.499885+00	2026-04-14 17:54:36.499885+00
183	3	6	t	f	f	f	f	f	SELF	{}	2026-04-14 17:54:36.499885+00	2026-04-14 17:54:36.499885+00
184	7	6	t	f	f	f	f	f	SELF	{}	2026-04-14 17:54:36.499885+00	2026-04-14 17:54:36.499885+00
185	8	11	t	f	f	f	f	f	SELF	{}	2026-04-14 17:54:36.499885+00	2026-04-14 17:54:36.499885+00
186	8	6	t	f	f	f	f	f	SELF	{}	2026-04-14 17:54:36.499885+00	2026-04-14 17:54:36.499885+00
187	8	4	t	f	f	f	f	f	SELF	{}	2026-04-16 23:08:34.658314+00	2026-04-16 23:08:34.658314+00
188	8	8	t	f	f	f	f	f	SELF	{}	2026-04-16 23:08:34.658314+00	2026-04-16 23:08:34.658314+00
\.


--
-- Data for Name: widget_catalog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.widget_catalog (id, code, name, description, widget_type, data_source_type, data_source_config, default_size, min_size, max_size, icon, functional_area_code, perspective_code, is_active, requires_min_role, metadata, created_at, updated_at, frontend_module, cache_ttl_seconds, swr_seconds, name_it, name_en, description_it, description_en) FROM stdin;
29	ai_insights	AI Insights	AI-powered talent analysis and career recommendations	CUSTOM	API	{}	{"h": 5, "w": 4}	{"h": 4, "w": 3}	{"h": 8, "w": 6}	Sparkles	SELF_SERVICE	\N	t	8	{}	2026-04-16 04:12:11.206414+00	2026-04-16 04:12:11.206414+00	custom-ai-insights	300	30	AI Insights	AI Insights	Analisi talento e raccomandazioni carriera basate su AI	AI-powered talent analysis and career recommendations
25	my_card	My Card	Personal employee card with profile summary and key info	CUSTOM	SQL	{}	{"h": 4, "w": 6}	{"h": 3, "w": 3}	{"h": 6, "w": 12}	CreditCard	SELF_SERVICE	\N	t	8	{}	2026-04-08 03:38:52.196626+00	2026-04-08 03:38:52.196626+00	custom-my-card	0	0	La Mia Scheda	My Card	Scheda personale con riepilogo profilo e informazioni chiave	Personal employee card with profile summary and key info
2	turnover_kpi	Turnover Rate	Monthly/annual turnover rate	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	TrendingDown	CORE_HR	TALENT	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Tasso di Turnover	Turnover Rate	Tasso di turnover mensile/annuale	Monthly/annual turnover rate
7	skill_gaps_chart	Skill Gap Analysis	Top skill gaps across the organization	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Target	TALENT	TALENT	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Analisi Gap Competenze	Skill Gap Analysis	Principali gap di competenze nell'organizzazione	Top skill gaps across the organization
8	compensation_bands	Salary Band Distribution	Compensation distribution by band	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	DollarSign	COMPENSATION	TALENT	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Distribuzione Fasce Salariali	Salary Band Distribution	Distribuzione retributiva per fascia salariale	Compensation distribution by band
12	compliance_status	Compliance Status	Compliance check results overview	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Shield	COMPLIANCE	PROCESS	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Stato Compliance	Compliance Status	Panoramica risultati verifiche di compliance	Compliance check results overview
19	notifications_feed	Notifications	Latest platform notifications	FEED	API	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Bell	NOTIFICATIONS	\N	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	feed-widget	0	0	Notifiche	Notifications	Ultime notifiche della piattaforma	Latest platform notifications
22	my_tasks	My Tasks	Personal task list and deadlines	LIST	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	CheckSquare	SELF_SERVICE	\N	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	list-widget	0	0	Le Mie Attivita	My Tasks	Lista attivita personali e scadenze	Personal task list and deadlines
26	my_documents	My Documents	Personal documents list with upload and download access	LIST	SQL	{}	{"h": 3, "w": 6}	{"h": 2, "w": 3}	{"h": 6, "w": 12}	FileText	SELF_SERVICE	\N	t	8	{}	2026-04-08 03:38:52.196626+00	2026-04-08 03:38:52.196626+00	list-widget	0	0	I Miei Documenti	My Documents	Lista documenti personali con caricamento e scaricamento	Personal documents list with upload and download access
24	career_path	Career Path	Personal career trajectory and next steps	CUSTOM	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Route	CAREER	TALENT	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	custom-career-path	0	0	Percorso di Carriera	Career Path	Traiettoria di carriera personale e prossimi passi	Personal career trajectory and next steps
20	quick_links	Quick Links	Customizable shortcut buttons	SHORTCUT	STATIC	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Link	\N	\N	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	shortcut-widget	0	0	Link Rapidi	Quick Links	Pulsanti scorciatoia personalizzabili	Customizable shortcut buttons
5	team_absences	Team Absences	Today and upcoming team absences	LIST	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	CalendarOff	TIME_ATTENDANCE	TALENT	t	6	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	0	0	Assenze del Team	Team Absences	Assenze del team odierne e in programma	Today and upcoming team absences
21	ai_assistant	AI Assistant	Quick AI query widget	CUSTOM	API	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Bot	AI_SERVICES	\N	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	0	0	Assistente AI	AI Assistant	Widget per query rapide all'assistente AI	Quick AI query widget
23	calendar_view	Calendar	Personal and team calendar events	CALENDAR	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	CalendarDays	TIME_ATTENDANCE	\N	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	0	0	Calendario	Calendar	Calendario personale e di team	Personal and team calendar events
9	learning_progress	Learning Progress	Personal or team learning completion rate	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	GraduationCap	LEARNING	TALENT	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	kpi-ring-widget	300	30	Avanzamento Formazione	Learning Progress	Tasso di completamento formazione personale o di team	Personal or team learning completion rate
13	time_tracking	Time Tracking	Personal time entries this week/month	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Clock	TIME_ATTENDANCE	PROCESS	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Tracciamento Ore	Time Tracking	Registrazioni ore personali di questa settimana/mese	Personal time entries this week/month
11	pending_approvals	Pending Approvals	Items awaiting your approval	LIST	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	ClipboardCheck	PROCESS_MANAGEMENT	PROCESS	t	5	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	pending-approvals-card	0	0	Approvazioni in Attesa	Pending Approvals	Elementi in attesa della tua approvazione	Items awaiting your approval
14	process_health	Process Health	Active workflows and bottleneck indicators	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Activity	PROCESS_MANAGEMENT	PROCESS	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Salute Processi	Process Health	Workflow attivi e indicatori di collo di bottiglia	Active workflows and bottleneck indicators
15	org_chart_mini	Organization Summary	Departments and reporting structure overview	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Network	ORGANIZATION	ENTERPRISE	t	6	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Riepilogo Organizzazione	Organization Summary	Riepilogo dipartimenti e struttura gerarchica	Departments and reporting structure overview
16	system_health	System Health	Platform uptime and performance metrics	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Server	SYSTEM_OPS	ENTERPRISE	t	3	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Salute del Sistema	System Health	Uptime e metriche di performance della piattaforma	Platform uptime and performance metrics
17	active_users_kpi	Active Users	Currently active platform users	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	UserCheck	SECURITY	ENTERPRISE	t	3	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Utenti Attivi	Active Users	Utenti attualmente attivi sulla piattaforma	Currently active platform users
18	api_usage	API Usage	API call volume and error rates	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Zap	PUBLIC_API	ENTERPRISE	t	3	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	generic-placeholder	300	30	Utilizzo API	API Usage	Volume chiamate API e tassi di errore	API call volume and error rates
1	headcount_kpi	Headcount	Total active employees count with trend	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Users	CORE_HR	TALENT	t	6	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	kpi-number-card	300	30	Organico	Headcount	Conteggio dipendenti attivi con trend	Total active employees count with trend
3	open_positions_kpi	Open Positions	Active job openings count	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Briefcase	RECRUITMENT	TALENT	t	5	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	kpi-number-card	300	30	Posizioni Aperte	Open Positions	Conteggio posizioni aperte attive	Active job openings count
6	performance_scores	Performance Overview	Performance score distribution chart	CHART	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	BarChart3	PERFORMANCE	TALENT	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	kpi-number-card	300	30	Panoramica Performance	Performance Overview	Grafico distribuzione punteggi performance	Performance score distribution chart
10	engagement_score	Engagement Score	Latest engagement survey results	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Heart	ENGAGEMENT	TALENT	t	4	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	kpi-number-card	300	30	Score Engagement	Engagement Score	Risultati dell'ultimo sondaggio engagement	Latest engagement survey results
4	leave_balance	Leave Balance	Personal leave balance and upcoming leaves	KPI_CARD	SQL	{}	{"h": 3, "w": 4}	{"h": 2, "w": 2}	{"h": 8, "w": 12}	Calendar	TIME_ATTENDANCE	TALENT	t	8	{}	2026-04-06 15:15:14.448391+00	2026-04-06 15:15:14.448391+00	leave-balance-card	300	30	Saldo Ferie	Leave Balance	Saldo ferie personale e prossime assenze	Personal leave balance and upcoming leaves
\.


--
-- Name: rbp_dashboards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rbp_dashboards_id_seq', 11, true);


--
-- Name: rbp_functional_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rbp_functional_areas_id_seq', 35, true);


--
-- Name: rbp_role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rbp_role_permissions_id_seq', 188, true);


--
-- Name: rbp_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rbp_roles_id_seq', 8, true);


--
-- Name: widget_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.widget_catalog_id_seq', 29, true);


--
-- PostgreSQL database dump complete
--

\unrestrict bzQ4KL42MxyBJqw6cE2IYVggHp3YOkam42ng3vnzVoeJJzUgPOjb3Ey2zuX9O4w

