# Cost-to-Date Estimate — heuresys-evo

> **Mandato**: ACQ-AUDIT-2026-05 · **Data**: 2026-05-10 · **Fase**: E (Sessione 2)
> **Scope**: stima FTE hours + EUR equivalente per portare la piattaforma allo stato attuale (2026-05-10 S26 close)
> **Methodology**: git log shortlog proxy + sprint-history analysis + filesystem scope (LOC, file count, asset inventory)
> **Caveat metodologico**: out-of-scope `heuresys.com.evo` legacy (repo separato, founder ha contribuito anche lì ma non quantificato qui)
> **Lingua**: italiano

---

## 1. Methodology

### 1.1 Data sources

1. **Git log heuresys-evo** (questo repo): `git log --pretty=format:'%h|%ai|%an|%s' --since='2026-03-01'` → 300 commit (335 inclusi 21 dependabot, 314 firmati Spen-Zosky)
2. **Date range**: primo commit 2026-05-01 02:50 UTC, ultimo commit 2026-05-10 06:56 UTC = **9 giorni 16 ore calendar**
3. **Sprint history** `docs/_meta/sprint-history.md`: Phase 13 → S26 (~26 sprint distinti documentati)
4. **DECISIONS-LOG** `.ux-design/DECISIONS-LOG.md`: L1 → L60 = 60 decisioni archiviate
5. **Filesystem scope**: 91 file ts (api-gateway) + ~130 ts/tsx (services/app) + ~150 ts/tsx (packages/ui) + 17 ts (packages/shared) + 7 ts (services/enrichment) + 568 modelli Prisma + 40 SQL seed + 114+ markdown docs + ~84-95 Storybook stories
6. **Brand workstream**: `.ux-design/` con 12 phase + 32 mockup + Brand Book + asset showcase webapp
7. **Industry benchmark**: B2B SaaS startup developer rate 5-15 commit/giorno tradizionale, 15-30 commit/giorno AI-assisted (OpenAI/Anthropic Claude Code workflow)

### 1.2 Effort estimation framework

Per ogni componente:

- **Hours range** (low - high) basato su file count × avg complexity per file × velocity multiplier
- **Loaded cost EU senior fullstack**: €80-150/h (range tipico Italia/Europa Occidentale 2026 inflation-adjusted)
- **Caveat AI velocity**: founder + Claude Code workflow ≈ 2-4x velocity tradizionale, MA cost-per-hour invariato (founder time è discreto)

### 1.3 Velocity reality check

**Critical metric**: 314 commit Spen-Zosky in 9 giorni 16 ore = ~32 commit/giorno medio.

| Scenario                                     | Commit/giorno typical | Plausibilità                                             |
| -------------------------------------------- | --------------------: | -------------------------------------------------------- |
| Solo developer human-only                    |                   2-5 | ❌ implausibile per 32/giorno                            |
| Mid-senior dev with strong workflow          |                  5-10 | ❌ implausibile                                          |
| Senior dev AI-assisted (Copilot light)       |                 10-20 | ⚠️ possibile burst, non sostenibile 9 giorni consecutivi |
| Senior dev AI-assisted (Claude Code intense) |                 20-40 | ✅ confirmed plausible (questo repo)                     |

**Conclusion**: velocity heuresys-evo è **AI-multiplier dependent**. Senza Claude Code/AI assistance, founder produrrebbe ~5-8 commit/giorno = velocity collapse 75-85% post-AI removal (DA-tech Attack T1 confermato).

---

## 2. Cost-to-date breakdown per componente

### 2.1 Greenfield rewrite heuresys-evo (10 giorni calendar, 2026-05-01 → 2026-05-10)

| Componente                                                            |        File count |       LOC est. |      Hours range | Effort € (EU loaded) |
| --------------------------------------------------------------------- | ----------------: | -------------: | ---------------: | -------------------: |
| **API Gateway** (`services/api-gateway/`)                             |             91 ts |           ~12k |          60-100h |            €4.8k-15k |
| **App Next.js** (`services/app/src/`)                                 |       ~130 ts/tsx |           ~15k |          80-120h |            €6.4k-18k |
| **Enrichment workers scaffold** (`services/enrichment/`)              |              7 ts |          ~1.5k |            8-15h |           €0.6k-2.3k |
| **UI library** (`packages/ui/src/`)                                   |       ~150 ts/tsx |           ~20k |         100-180h |              €8k-27k |
| **Shared utilities** (`packages/shared/`)                             |             17 ts |          ~2.5k |           12-25h |             €1k-3.8k |
| **Test suite construction** (865 verdi)                               |         ~228 file | ~25k test code |          80-150h |          €6.4k-22.5k |
| **DB schema design** (568 modelli Prisma + 8 enum)                    |          1 schema |           ~10k |          60-120h |            €4.8k-18k |
| **DB migrations + seeds** (40 file SQL)                               |           40 .sql |            ~8k |           30-60h |             €2.4k-9k |
| **CI/CD setup** (4 workflow + husky + commitlint)                     |   ~10 file config |            ~1k |            8-15h |           €0.6k-2.3k |
| **Documentation governance** (26 ADR + 60 decisioni + sprint-history) |       ~50 file md |           ~15k |           40-80h |            €3.2k-12k |
| **Forensic audit doc** (`docs/_audit/`)                               | 2 doc + artifacts |            ~2k |           15-25h |           €1.2k-3.8k |
| **TOTAL heuresys-evo greenfield**                                     |                 — |          ~112k | **493-885h FTE** |    **€39.4k-133.7k** |

**Range mid-point**: ~689h FTE / ~€86k.

### 2.2 Brand identity workstream (`.ux-design/`)

| Componente                                                                            | Effort                                               |      Hours range |         Effort € |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------: | ---------------: |
| Strategy + research (Phase 1-3)                                                       | aesthetic exploration, 32 mockup, 8+ direzioni       |           30-60h |         €2.4k-9k |
| Visual identity (Phase 4-5)                                                           | logo, palette OKLCH, typography, color system        |           25-50h |         €2k-7.5k |
| Theme variants (Phase 5-6)                                                            | dark/light/brand themes export                       |           15-30h |       €1.2k-4.5k |
| Mockup library (Phase 6-7)                                                            | 10 dashboard prototypes imported + brand book        |           30-60h |         €2.4k-9k |
| Promotion checklist (Phase 8)                                                         | 8 categorie pre-flight scaffold                      |           10-20h |         €0.8k-3k |
| Asset showcase webapp (`.ux-design/09-asset-showcase/`)                               | Express + Prisma + SQLite + vanilla JS local catalog |           15-30h |       €1.2k-4.5k |
| Studio routing workflow (`.ux-design/10-staging/` + `.claude/skills/studio/`)         | clone/promote/restore Next.js routes via staging     |           20-40h |         €1.6k-6k |
| Brand documentation (Brand Book 15 sezioni + DECISIONS-LOG L1-L60 entries pertinenti) | governance + decisioni archiviate                    |           20-40h |         €1.6k-6k |
| **TOTAL brand workstream**                                                            | —                                                    | **165-330h FTE** | **€13.2k-49.5k** |

**Range mid-point**: ~248h FTE / ~€31k.

### 2.3 Knowledge Graph ESCO (data + integration)

| Componente                                    | Effort                                      |                  Hours range |                    Effort € |
| --------------------------------------------- | ------------------------------------------- | ---------------------------: | --------------------------: |
| ESCO v1.2 import (skills, occupations, links) | 14k+3k+126k records bilingue IT/EN          |                       20-40h |                    €1.6k-6k |
| Bilingue mapping curated IT/EN                | manual quality assurance + domain expertise |                       40-80h |                   €3.2k-12k |
| Embeddings via OpenAI (1536-dim)              | 17k entities × API call + storage           |      10-20h + €2-5k API cost |            €0.8k-3k + €2-5k |
| KG schema design + Prisma models              | relations, indexes, query patterns          |                       25-50h |                    €2k-7.5k |
| Endpoint integration (`/explorer/*`)          | API surface + UI                            |                       20-40h |                    €1.6k-6k |
| **TOTAL ESCO + KG**                           | —                                           | **115-230h FTE + €2-5k API** | **€9.2k-34.5k + €2-5k API** |

**Range mid-point**: ~173h FTE / ~€21k + €3k API = ~€24k.

### 2.4 Compounded total heuresys-evo

| Macro-area                         |       Hours range |  Effort € (mid-point) |
| ---------------------------------- | ----------------: | --------------------: |
| Greenfield rewrite                 |          493-885h |                  €86k |
| Brand workstream                   |          165-330h |                  €31k |
| ESCO + KG                          |          115-230h | €24k (incl. API cost) |
| **TOTAL HEURESYS-EVO STAND-ALONE** | **773-1445h FTE** |  **~€141k mid-point** |

Range full: **€61.8k-217.7k**.

---

## 3. Legacy `heuresys.com.evo` (out-of-scope ma worth noting)

Il founder ha lavorato anche sul repo legacy `heuresys.com.evo` (D:\enzospenuso\Documents\GitHub\heuresys.com.evo). Questo audit NON quantifica quel lavoro perché:

- Repo separato (non in `D:\evo.heuresys.com`)
- Git log non analizzato in questo audit
- Legacy system in production a `www.heuresys.com` (DNS+certbot pending)
- Legacy import registry `.handoff/legacy-import-registry.csv` documenta 124 entry catalogati

**Stima qualitativa proxy** (basata su scope import: 5/231 pages portati = 2.2% feature parity):

- Se evo ha portato 2.2% del legacy in 773-1445h, il legacy è ~35-65k h FTE? **Numero implausibile**.
- Più realistic: legacy ha LOC e complexity simile a evo (15-25k LOC), suggerendo **legacy effort 600-1500h FTE** (similar magnitude a evo greenfield)
- **Combined cost-to-date proxy** evo+legacy: **1400-3000h FTE** = **€112k-450k loaded EU**

Range largo per incertezza significativa. Da quantificare separatamente in due diligence se acquirente acquisisce ENTRAMBI i repo (legacy + evo).

---

## 4. Calendar timeline reality check

**Git log range**: 2026-05-01 → 2026-05-10 = 9 giorni 16 ore calendar.

Questo è il committed work in QUESTO repo. MA:

- Founder ha probabilmente lavorato su materiale outside-git prima del primo commit (planning, ADR drafting, design pre-sprints)
- Sprint history mostra Phase 13 come earliest archived (vs S26 latest), suggerendo lavoro pre-2026-05-01
- DECISIONS-LOG L1 entry data 2026-05-04 (L1 + L11 superseduta riga uplaod)

**Realistic calendar pre-git work**: 1-3 mesi planning/ideation + 9-10 giorni intense execution = ~3-4 mesi calendar total per evo greenfield.

Se acquirente paga €141k mid-point per 3-4 mesi calendar = **€35-47k/mese single founder velocity (AI-assisted)** = 2.5-3.5x typical single dev mese cost (€10-15k/mese loaded).

**Implication**: founder + AI workflow è "compressed time-to-market", non "discount cost-per-hour". Acquirente paga per **velocity asset**, non per **cheap labor**.

---

## 5. AI tooling cost (operational, non capital)

Founder usa Claude Code (Anthropic API tier ~$200-500/mese individual usage tipico per heavy dev) + OpenAI ($5/day cap = ~$150/mese se spent + embeddings ~$50-100 una tantum):

| Tool                                  |             Cost mensile estimate | Note                                      |
| ------------------------------------- | --------------------------------: | ----------------------------------------- |
| Anthropic Claude Code (Opus + Sonnet) |                     $200-500/mese | heavy dev usage                           |
| OpenAI API (advisor + embeddings)     |                      $50-200/mese | cap $5/day in-app + occasional embeddings |
| GitHub (private repo)                 |         $0 (free tier sufficient) | public repo here                          |
| Oracle Cloud Free Tier                |             $0 (Always Free tier) | bare-metal VM ARM64                       |
| **TOTAL operational AI/infra**        | **$250-700/mese** = €230-650/mese | nominal                                   |

**Annual operational cost**: €2.7k-7.8k (founder's burn rate per AI tooling). Non material per acquirer.

**Post-acquisition risk**: se acquirer ritira Anthropic API access del founder o impone corporate IT restrictions su AI tools, founder velocity collassa (DA-tech T1 + DA-business B4 entrambi accepted in rebuttal).

---

## 6. Comparison with industry benchmarks

| Benchmark                                | Cost-to-MVP B2B SaaS |                                    heuresys-evo |
| ---------------------------------------- | -------------------: | ----------------------------------------------: |
| Solo founder no-AI (12 mesi)             |     €100-180k loaded |                                               — |
| Solo founder AI-assisted (3-4 mesi)      |      €50-100k loaded | **€61.8k-217.7k** (range largo per uncertainty) |
| Small team (2-3 devs, 6 mesi)            |     €180-350k loaded |                                               — |
| Outsource overseas (12 mesi)             |             €60-120k |                                               — |
| Industry "average HR Tech MVP" 2025-2026 |            €150-400k |                                               — |

heuresys-evo cost-to-date stimato è **competitive** con industry benchmark per scope (multi-tenant + KG + design system + brand identity). Founder + AI workflow appare **cost-effective**.

---

## 7. Acquirer ROI calculation framework

Per acquirente che valuta deal, calcolo "value vs cost-to-date":

| Item                                                       |                                            Value to acquirer | Cost-to-date (this repo only) |
| ---------------------------------------------------------- | -----------------------------------------------------------: | ----------------------------: |
| Replacement cost (build-from-scratch with team)            |               **€450-900k** (12-18 mesi @ team €30-60k/mese) |                             — |
| Opportunity cost (time-to-market evitato)                  | **€600k-1.8M** (12-18 mesi @ €50-100k/mese acquirer revenue) |                             — |
| Cost-to-date stand-alone proxy                             |                                                            — |             **€61.8k-217.7k** |
| Implied acquirer multiple (replacement / cost-to-date mid) |                                                        ~3-6x |                             — |
| Implied acquirer multiple (opportunity / cost-to-date mid) |                                                       ~4-13x |                             — |

**Conclusion**: anche pricing deal a 4-5x cost-to-date (€280-700k) è **profittevole per acquirer mature** che valorizza time-to-market. Coerente con sweet spot rebuttal €500-600k all-in.

---

## 8. Caveats critici

1. **NON include legacy `heuresys.com.evo`**: range potrebbe raddoppiare se acquirer acquisisce both repos
2. **AI velocity NON replicabile post-acquisition** (T1+B4 accepted): productivity collapse 70-83% se founder + AI tooling rimossi → ulteriori h FTE per finire roadmap = +30-50% per ogni epic
3. **Quality discount applicabile** per debt findings (16 high + 8 critical): -10% to -25% sul valore intrinseco asset (vedi rebuttal)
4. **Customer validation discount**: 0 paying customer = 100% speculative product-market fit = pre-revenue valuation paradigm (asset purchase, non SaaS multiple)
5. **Domain expertise non quantificata**: founder ESCO + HR domain knowledge ha valore aggiuntivo non in h FTE ma in "specialized hiring time saved" (€80-150k stimato in PRD)

---

## 9. Bottom line

| Metric                                   | Value                                                           |
| ---------------------------------------- | --------------------------------------------------------------- |
| **Greenfield heuresys-evo cost-to-date** | **€61.8k-217.7k** (range full) · **€141k mid-point**            |
| **Combined evo+legacy proxy**            | **€112k-450k** (largo range, da quantificare separatamente)     |
| **Calendar time invested**               | 3-4 mesi total (1-3 mesi pre-git + 10 giorni intense execution) |
| **Velocity multiplier**                  | 2.5-3.5x typical single dev (AI-assisted)                       |
| **Operational AI/infra cost (mensile)**  | €230-650                                                        |
| **Replacement cost build-from-scratch**  | €450-900k (12-18 mesi @ team €30-60k/mese)                      |
| **Implied ROI for acquirer**             | 3-13x cost-to-date (depending on opportunity cost weight)       |

**Reasonable acquirer pricing window**: **€280-700k all-in** (per evo stand-alone), centrato a ~€500-600k per acquirer mature che valorizza time-to-market. Consistent with rebuttal `15-rebuttal-and-synthesis.md` sweet spot.
