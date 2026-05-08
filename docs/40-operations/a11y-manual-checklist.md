# Accessibility · Manual Checklist (NVDA · VoiceOver · Keyboard-only)

> Companion al test automatico `tests/e2e/a11y/wcag-aaa.spec.ts` (axe-core, 8 viste).
> Manual passes coprono dimensioni che axe non può verificare: voce screen reader,
> qualità landmark navigation, focus indicators, ordine logico, gesture mobile.

## 0 · Quando eseguire

- ✅ **Round-1 manual pass**: prima della v1.0 promotion gate (ref: `.ux-design/08-promotion/v1.0-checklist.md` § 6)
- ✅ **Round-2 spot-check**: ad ogni cambio architetturale UI (nuovo AppShell layout, nuovo dashboard widget, nuova route)
- 🟡 **Quarterly audit**: ogni 3 mesi su tutto il matrix 8 ruoli × N viste (ref: `docs/20-architecture/role-views-matrix.md`)

## 1 · Setup tooling

| Tool                           | Where          | Free        | Notes                                  |
| ------------------------------ | -------------- | ----------- | -------------------------------------- |
| **NVDA**                       | Windows        | ✅          | https://www.nvaccess.org/download/     |
| **VoiceOver**                  | macOS          | ✅ built-in | `Cmd+F5` to toggle                     |
| **Chrome DevTools Lighthouse** | cross-platform | ✅          | `F12` → Lighthouse tab → A11y category |
| **axe DevTools extension**     | Chrome/Firefox | ✅          | https://www.deque.com/axe/devtools/    |
| **WAVE extension**             | Chrome/Firefox | ✅          | https://wave.webaim.org/extension/     |

## 2 · 8 viste rappresentative (allineate al test automatico)

| #   | Route                              | Ruolo test   | User canonico                 |
| --- | ---------------------------------- | ------------ | ----------------------------- |
| 1   | `/login`                           | (public)     | —                             |
| 2   | `/dashboard/cross_tenant_overview` | SUPERUSER    | `sysadmin`                    |
| 3   | `/dashboard/tenant_owner_overview` | TENANT_OWNER | `rtl-bank.federica.marchetti` |
| 4   | `/dashboard/hr_director_overview`  | HR_DIRECTOR  | `rtl-bank.valentina.conti`    |
| 5   | `/employees`                       | HR_MANAGER   | `rtl-bank.maria.colombo`      |
| 6   | `/me/skills`                       | EMPLOYEE     | `rtl-bank.francesca.gallo`    |
| 7   | `/admin/users`                     | TENANT_OWNER | `rtl-bank.federica.marchetti` |
| 8   | `/ontology`                        | HR_DIRECTOR  | `rtl-bank.valentina.conti`    |

Pwd: `Heuresys2026!` per tutti.

## 3 · Checklist per vista

Per ognuna delle 8 viste, eseguire i 5 blocchi seguenti.

### 3.A · Keyboard-only navigation (no mouse, no touch)

- [ ] `Tab` percorre tutti gli interactive in ordine logico (top→bottom, left→right)
- [ ] Focus ring visibile su ogni elemento (no outline:0 senza alternativa)
- [ ] `Shift+Tab` cammina indietro coerente
- [ ] `Enter`/`Space` attivano button/link
- [ ] `Esc` chiude modal/dropdown se presenti
- [ ] No focus trap inavvertito (sidebar non blocca tab)
- [ ] Skip-link funziona (Tab dalla URL bar → "Salta al contenuto principale")

### 3.B · NVDA reading (Windows)

Avvia NVDA (`Ctrl+Alt+N`), ricarica pagina (`F5`):

- [ ] Heading hierarchy letta correttamente: H → muove tra h1/h2/h3 in ordine
- [ ] Landmark navigation: D → muove tra `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- [ ] Form fields hanno label associata: NVDA legge label + tipo (textbox, button, etc)
- [ ] Errori form sono announced via `role="alert"` o `aria-live`
- [ ] Decorative images hanno `alt=""` (non lette) · informative hanno alt descrittivo
- [ ] Link descrittivi (no "click here", "leggi tutto" senza contesto)

### 3.C · VoiceOver reading (macOS)

Toggle VoiceOver (`Cmd+F5`), ricarica pagina:

- [ ] Web Rotor (`VO+U`) mostra: Headings · Links · Form Controls · Landmarks
- [ ] Heading list completa e gerarchica (no salti h1→h3)
- [ ] Landmarks corretti (1 main, header/footer presenti)
- [ ] `VO+→` legge sequenzialmente, ordine logico
- [ ] No "elemento non identificato" su widget custom (chart, sparkline, KPI ring)
- [ ] Tabelle hanno `<th>` con `scope="col"` o `scope="row"` (NVDA/VO annunciano "colonna 2 di 5")

### 3.D · Color & contrast (manual visual)

- [ ] DevTools "Emulate vision deficiencies" (Rendering tab) → Achromatopsia: leggibile
- [ ] Same → Tritanopia + Deuteranopia: nessuna info trasmessa SOLO da colore (status icons usano testo+icona, non solo colore)
- [ ] Zoom 200% (`Ctrl++` x4): no overflow orizzontale, contenuto reflowa
- [ ] Zoom 400%: contenuto resta consultabile (può richiedere scroll)
- [ ] Dark mode (`data-theme="dark"`) e light mode (`data-theme="light"`) entrambi audit-passing

### 3.E · WCAG 2.2 specifiche (nuove vs 2.1)

- [ ] **2.4.11 Focus Not Obscured (Min)**: focus mai nascosto da sticky header/footer
- [ ] **2.4.13 Focus Appearance** (AAA): focus indicator ≥ 2px solid + 3:1 contrast
- [ ] **2.5.7 Dragging Movements**: ogni drag (es. dashboard editor) ha alternativa keyboard (es. arrow keys)
- [ ] **2.5.8 Target Size (Min)**: target click area ≥ 24×24 CSS px (tab/button)
- [ ] **3.2.6 Consistent Help**: contact/help link nella stessa posizione su tutte le pagine
- [ ] **3.3.7 Redundant Entry**: form non chiede info già fornita in step precedente
- [ ] **3.3.8/3.3.9 Accessible Authentication**: login non richiede cognitive function test (no captcha senza alternativa)

## 4 · Reporting template

Per ogni vista, riempire una riga della matrix:

| Vista                            | NVDA | VoiceOver | Keyboard | Color | WCAG2.2 | Notes |
| -------------------------------- | ---- | --------- | -------- | ----- | ------- | ----- |
| /login                           | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /dashboard/cross_tenant_overview | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /dashboard/tenant_owner_overview | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /dashboard/hr_director_overview  | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /employees                       | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /me/skills                       | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /admin/users                     | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |
| /ontology                        | ⏳   | ⏳        | ⏳       | ⏳    | ⏳      |       |

Legenda: ✅ pass · 🟡 minor issues fixable in round-2 · ❌ blocker.

## 5 · Issue triage

Per ogni ❌ trovato:

1. Crea issue in `docs/_meta/a11y-issues-log.md` (futuro file) con: vista · severity · ricetta fix · WCAG criterion violated
2. Severity: **critical** (rende inutilizzabile per disabili) / **serious** (richiede workaround) / **minor** (cosmetic)
3. Severity critical/serious blocca v1.0 promotion. Minor può differire a v1.1.

## 6 · CI integration (automated companion)

Test automatico in `tests/e2e/a11y/wcag-aaa.spec.ts` esegue axe-core con tag set:
`wcag2a, wcag2aa, wcag2aaa, wcag21a, wcag21aa, wcag22aa, best-practice`.

Run locale:

```bash
cd services/app && npx playwright test tests/e2e/a11y/wcag-aaa.spec.ts
```

Run CI: workflow `.github/workflows/a11y.yml` (gated on PR + nightly cron).

Manual pass NON è automatizzabile (screen reader voice quality, gesture mobile, cognitive load) — quindi è la dimensione umana di questo audit. Esecuzione raccomandata: 1× per release v1.0 + spot-check su nuove viste.

## 7 · Cross-reference

- Test automatico: `services/app/tests/e2e/a11y/wcag-aaa.spec.ts`
- Helper: `services/app/tests/e2e/a11y/a11y-runner.ts`
- Operating baseline a11y: `docs/_meta/operating-baseline.md` §a11y
- Roadmap fix tracking: STATE.md (top priorities)
- WCAG 2.2 spec: https://www.w3.org/TR/WCAG22/
