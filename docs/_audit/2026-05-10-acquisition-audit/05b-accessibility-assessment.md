# D4 — Accessibility Assessment (WCAG 2.2 AA/AAA)

**Auditor**: Senior Accessibility Specialist (M&A DD team)
**Data**: 2026-05-10
**Scope**: piattaforma `heuresys-evo` — `services/app` (Next.js 16) + `packages/ui` (~180 component) + a11y tooling CI
**Metodo**: code/config audit + spot-check componenti + reading list 5 file (R20-compliant, no runtime axe live)

---

## TL;DR

Heuresys-evo presenta una postura accessibility **sopra la media del settore HRMS B2B**: ha test automatico WCAG 2.2 AAA (`@axe-core/playwright`) integrato in CI (`a11y.yml` su PR + nightly cron 02:30 UTC), copre 9 viste rappresentative × 2 temi (18 test), include componenti dedicati (`SkipLink`, `LiveRegionProvider`, `AccessibilityPanel` user-facing con font scaling/reduced motion/colorblind sim/high contrast). La design system (ADR-0014) è costruita su Radix UI primitives che bake-in ARIA + keyboard semantics. Tuttavia, il claim "all 8 views passing AAA" (committed 2026-05-08) si basa **esclusivamente su axe-core automated**, che copre ~30-40% delle violazioni WCAG reali — il **manual NVDA/VoiceOver pass non è mai stato eseguito** (checklist scaffolded ma tutti i pallini ⏳ pending). Il claim AAA va riletto come "0 critical/serious axe violations su 9 viste happy-path", non "WCAG 2.2 AAA conformant".

**Severity D4 a11y: medium** (gap manual/AAA reale + touch target sm violation, ma fondamenta solide).

---

## Severity overview

| Categoria                                        | Severity   | Count |
| ------------------------------------------------ | ---------- | ----- |
| Manual screen reader pass mai eseguito           | **high**   | 1     |
| Touch target sm `h-8` (32px) < AAA 24×24 minimum | **medium** | 2     |
| `forgot-link` con `href="#"` + `aria-disabled`   | **medium** | 1     |
| Mancanza `<label>` esplicita su `Input` base     | **medium** | 1     |
| Brand-studio escluso da audit AAA per design     | **low**    | 1     |
| Manca user testing con disabili reali            | **medium** | 1     |
| AAA testing senza enterprise CRUD flows          | **medium** | 1     |

---

## WCAG conformance estimated

| Livello       | Stima conformance | Confidence | Note                                                                                                                                                                                                                 |
| ------------- | ----------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Level A**   | **~92%**          | high       | Skip-link + landmark + form labels + alt text presenti. axe automated copre                                                                                                                                          |
| **Level AA**  | **~80-85%**       | medium     | Color contrast verificato via axe (light+dark), focus-visible ring globale, keyboard nav garantita da Radix. Gap su 1.4.10 reflow + 2.4.11 focus not obscured (manual only)                                          |
| **Level AAA** | **~55-65%**       | low        | Claim "passing AAA" axe-only è statisticamente debole. AAA richiede 7:1 contrast (verificato), no images of text, sign language, contextual help — molti criteria sono **NON automatable** e mancano del manual pass |

> Stima basata su [W3C/Deque studio 2024](https://www.deque.com/blog/automated-testing-cant-do-it-all/): axe-core automated cattura ~30-57% delle issues WCAG su pagine reali. Il restante 43-70% richiede manual + assistive tech testing.

---

## Findings per principio WCAG

### 1. Perceivable

**Strengths**:

- `LiveRegionProvider` ([packages/ui/src/components/a11y/live-region.tsx:14-39](../../../packages/ui/src/components/a11y/live-region.tsx)) implementa coordinated `aria-live="polite"` + `aria-assertive` con `aria-atomic="true"` e `sr-only` class — pattern canonical
- 109 occorrenze `aria-label` in 53 file componenti (`packages/ui/src/components/`) — buona copertura icone-only buttons (es. `accessibility-panel.tsx:72,89` close + open)
- Color tokens OKLCH (perceptual uniformity) in design system ADR-0014 → contrast prevedibile cross-theme
- Light + Dark theme entrambi sotto audit AAA ([wcag-aaa.spec.ts:88-110](../../../services/app/tests/e2e/a11y/wcag-aaa.spec.ts))

**Gaps**:

- `Input` component ([packages/ui/src/components/Input.tsx](../../../packages/ui/src/components/Input.tsx)) **non ha label associata built-in** — caller deve manualmente fornire `<label htmlFor>`. Il login form lo fa correttamente ([login-form.tsx:41-52](../../../services/app/src/app/login/login-form.tsx)) ma component-level non garantisce — possibile failure in altri call site
- 3 component dashboard hanno `aria-label` count 1-2 vs presenza di `role` → asimmetria sospetta su componenti chart (`succession-card.tsx`, `kpi-ring.tsx`, `rbac-matrix.tsx`)

### 2. Operable

**Strengths**:

- `SkipLink` ([packages/ui/src/components/a11y/skip-link.tsx:8-29](../../../packages/ui/src/components/a11y/skip-link.tsx)) `sr-only` → `focus:not-sr-only` pattern corretto, target `#main-content`
- `Button` base ([Button.tsx:7](../../../packages/ui/src/components/Button.tsx)) include `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` globale → focus indicator visibile su ogni button
- Radix UI primitives ([ADR-0014:40-56](../../../docs/50-reference/decisions/0014-design-system-architecture.md)) garantiscono keyboard semantics native (Esc su modal, arrow keys su menu, Enter/Space su button) — non manualmente implementati ma forniti dalla lib
- 6 occorrenze `tabIndex/onKeyDown/onKeyUp` solo su 4 file (otp-input, chatbot, skill-heatmap, rbac-matrix) → buon segno: keyboard custom delegato a Radix, no reinvent-the-wheel

**Gaps — CRITICAL per AAA**:

- **2.5.8 Target Size (Min) violation**: `Button.tsx:19` definisce `size: sm: 'h-8 px-3'` (32px height). WCAG 2.2 AA richiede **24×24 CSS px** (PASS), ma AAA `2.5.5 Target Size (Enhanced)` richiede **44×44** (FAIL). Per "AAA touch enterprise" del brief: blocker per `sm` size su mobile/tablet. Anche `md: h-9` (36px) sotto soglia AAA 44×44
- **2.5.7 Dragging Movements** non verificato: dashboard editor presenta drag (BlueprintCanvas, kanban-board), checklist manuale richiede "alternativa keyboard via arrow keys" — non confermato dal codice
- `forgot-link` su login ([login-form.tsx:75-77](../../../services/app/src/app/login/login-form.tsx)) ha `href="#"` + `aria-disabled="true"` ma è ancora focusabile e cliccabile → pattern errato (dovrebbe essere `<button disabled>` o assente)

### 3. Understandable

**Strengths**:

- Form login con `autoComplete="username"` + `current-password` ([login-form.tsx:48,63](../../../services/app/src/app/login/login-form.tsx)) → 1.3.5 Identify Input Purpose AA
- Errori form con `role="alert"` ([login-form.tsx:85](../../../services/app/src/app/login/login-form.tsx)) → 3.3.1 Error Identification
- Italian language consistency (label "Email aziendale", "Password", "Accedi") + `noValidate` per gestire validazione custom invece di browser default

**Gaps**:

- 3.3.7 Redundant Entry / 3.3.8 Accessible Authentication (WCAG 2.2 nuovi) non verificati
- `placeholder` usato senza label visibile su pattern dashboard sospetti (da verificare)

### 4. Robust

**Strengths**:

- React 19 + Radix → output HTML semantic + role assignment automatico
- `forwardRef` su Button + Input → garantisce composability + AT detection
- 57 occorrenze `role=` esplicito + 109 `aria-label` distribuiti su 53+41 file → semantic enrichment pervasivo

**Gaps**:

- ~180 component in `packages/ui` ma **0 jest-axe / @axe-core unit test** in `packages/ui/__tests__/` → robustness verificata SOLO end-to-end su 9 viste, non a livello component isolato (Storybook a11y addon non confermato)

---

## Tooling vs Manual Gap Analysis

| Dimensione                     | Status        | Note                                                                           |
| ------------------------------ | ------------- | ------------------------------------------------------------------------------ |
| axe-core automated CI          | **PRESENT**   | `a11y.yml` su PR + nightly cron, `wcag-aaa.spec.ts` 9 viste × 2 temi           |
| Storybook a11y addon           | **UNKNOWN**   | Storybook 9 + 84 stories in repo, addon a11y non confermato dalla reading list |
| jest-axe / @axe-core component | **ABSENT**    | Glob su `packages/ui` non trova jest-axe import                                |
| Manual NVDA pass               | **NEVER RUN** | Checklist `a11y-manual-checklist.md` con tutti `⏳ pending`                    |
| Manual VoiceOver pass          | **NEVER RUN** | Idem                                                                           |
| User testing con disabili      | **NEVER RUN** | Nessun PEC/UAT con utenti reali screen reader                                  |
| Lighthouse a11y CI             | **MENTIONED** | Doc menziona DevTools manuale, no CI step                                      |
| pa11y / a11y-checker           | **ABSENT**    | Solo axe-core stack                                                            |

**Conclusione gap**: tooling CI è **best-in-class per axe-only**, ma il claim "WCAG 2.2 AAA passing" richiede manual pass NVDA + VoiceOver + user testing — al momento **0%** eseguito.

---

## Critical flows assessment

| Flusso                | Keyboard nav | Screen reader (axe) | Touch AAA 44×44 | Manual NVDA | Verdict                                                                            |
| --------------------- | ------------ | ------------------- | --------------- | ----------- | ---------------------------------------------------------------------------------- |
| **Login**             | OK           | OK (verified)       | NO (`btn h-9`)  | NO          | AA likely / AAA fail                                                               |
| **Dashboard**         | OK (Radix)   | OK (verified)       | NO              | NO          | AA likely / AAA fail                                                               |
| **Employee CRUD**     | UNKNOWN      | UNKNOWN             | NO              | NO          | **out-of-scope test suite** — `/employees` solo lista, no CRUD form pages auditate |
| **Onboarding wizard** | UNKNOWN      | UNKNOWN             | NO              | NO          | non in 9 viste audit                                                               |

**Issue critico**: il test suite copre 9 viste **read-heavy/dashboard** ma **NESSUN flusso CRUD form-heavy** (create/edit/delete employee, role assignment). Per HRMS enterprise, i flussi CRUD sono il 60-70% dell'usage admin/HR — coverage gap rilevante.

---

## Compliance implications

| Normativa                                       | Requisito                       | Status heuresys-evo           | Risk                                                                                 |
| ----------------------------------------------- | ------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| **EU Web Accessibility Directive 2016/2102**    | EN 301 549 = WCAG 2.1 AA        | likely PASS con remediation   | Public sector procurement: blocker se vendor pubblico EU → richiede VPAT/ACR firmato |
| **EAA — European Accessibility Act 2025-06-28** | WCAG 2.1 AA per private B2C/B2B | likely PASS con remediation   | Da giugno 2025 esteso a B2B HR tools sopra soglia. **HRMS = obbligatorio**           |
| **EN 301 549 v3.2.1** (EU procurement)          | WCAG 2.1 AA + functional perf   | gap su functional performance | Manual pass mandatory per certification                                              |
| **ADA US (Section 508 refresh)**                | WCAG 2.0 AA (federal contracts) | likely PASS                   | Lawsuit risk basso ma reale per private B2B (Domino's vs Robles 2019 precedent)      |
| **AODA Ontario / AccessiBC Canada**             | WCAG 2.0 AA                     | likely PASS                   | Mercato CA accessibile                                                               |
| **DDA Australia**                               | WCAG 2.0 AA equivalente         | likely PASS                   | OK                                                                                   |

**EU Public Sector market access**: **GO con condizioni**. Tre azioni mandatory pre-procurement: (1) manual NVDA/VoiceOver pass full, (2) firma VPAT 2.4 Rev 508 / ACR equivalente da auditor esterno certificato (Deque, Level Access, TPGi), (3) remediation touch target AAA per tablet/mobile.

---

## Acquirer perspective

**Pro**:

- Foundation a11y eccellente per stadio early-product (Radix + axe + skip-link + live-region + a11y panel utente custom è raro vedere in HRMS startup)
- ADR-0014 esplicita "A11y first" come force architetturale → cultura accessibility incorporata
- CI gating su a11y workflow → no regression possibile su 9 viste audited
- Skip-link, focus-visible globale, italian semantics corretti

**Contro**:

- **Claim AAA è marketing-grade, non audit-grade**: serve disclosure honest "axe-only AAA pass su 9 viste", non "WCAG 2.2 AAA conformant"
- Manual pass = **0%** → effort 40-60h FTE specialist per copertura completa 8 ruoli × 12 viste = ~4-6k EUR external auditor
- CRUD flows non auditati → unknown risk significativo
- Nessun jest-axe a livello component → regression su nuovi component non catturata fino a integration test
- VPAT/ACR mancante → no procurement EU public sector immediato

**Effort remediation pre-acquisition**:

- Manual NVDA/VoiceOver pass full: **40-60h FTE** (~4-6k EUR external)
- Touch target AAA fix Button `sm/md`: **2-4h** (additive Tailwind size adjustment)
- jest-axe component coverage `packages/ui`: **20-30h** (180 component × 10min)
- VPAT/ACR formal audit: **8-15k EUR** (Deque/Level Access)
- **Totale**: **20-30k EUR + 80-100h FTE** per WCAG 2.2 AA certified + AAA partial

---

## Verdict D4 a11y: **NEGOTIATE**

Severity **medium** complessiva. NON pass — c'è gap reale tra claim ("passing AAA") e realtà ("axe automated only su read-flows"). NON critical — fondamenta solide, remediation path chiaro, no architectural rewrite richiesto. Negotiate su (i) escrow per manual audit + VPAT firmato post-closing, (ii) commitment a touch target AAA fix + CRUD flow coverage entro 6 mesi, (iii) discount price su market access EU public sector blocker se rilevante per buyer thesis.
