# ADR-0011: Test coverage strategy + targets

**Status**: Accepted
**Date**: 2026-05-01
**Authors**: Cantiere B (autonomous)
**Phase**: RTGB B3

## Context

Pre-B3 il repo aveva: `services/api-gateway` con vitest + 12 test, `services/app` con vitest in node-only (12 test su `authorize`), `packages/ui` con vitest jsdom + 4 test, `packages/shared` con vitest + 70 test schema. Nessun config workspace-level, nessuna coverage threshold enforced, nessun E2E, nessun a11y testing.

Forces:

- **Confidence in refactor**: senza coverage misurabile non possiamo refactorare con sicurezza in fasi successive (B7 design system tocca molti file).
- **Cross-workspace single command**: developer DX richiede `npm test` che lancia tutto, non un loop manuale per workspace.
- **A11y as first-class**: `direttiva Enzo` (interfacce wow) implica test a11y baked-in dal giorno 1, non add-on opzionale.
- **E2E gating critical path**: login flow + protected routes devono avere E2E che blocca regression.
- **CI viability**: i test devono girare in < 5min su GitHub Actions runner standard.

## Decision

### Coverage stack

| Layer             | Tool                                                    | Note                                           |
| ----------------- | ------------------------------------------------------- | ---------------------------------------------- |
| Unit / component  | Vitest 2                                                | un config per workspace, ESM native            |
| jsdom env         | jsdom 29 (services/app + packages/ui)                   | per Server Components mocked + client islands  |
| Component testing | @testing-library/react 16 + @testing-library/user-event | semantic queries, no implementation details    |
| A11y              | jest-axe + axe-core                                     | matcher `toHaveNoViolations` extended in setup |
| E2E               | Playwright 1.x                                          | services/app, chromium primary                 |
| Coverage provider | v8 (Vitest default)                                     | text + json + html reporters                   |

### Workspace orchestration

`vitest.workspace.ts` in root referenzia 4 config:

- `services/api-gateway/vitest.config.ts` (node env)
- `services/app/vitest.config.ts` (jsdom env)
- `packages/ui/vitest.config.ts` (jsdom env)
- `packages/shared/vitest.config.ts` (node env)

Comando unico:

```bash
npx vitest run                  # all
npx vitest run --coverage       # with coverage
npm run test                    # via npm scripts (workspaces fan-out)
```

### Coverage targets

Tier per workspace:

| Workspace              | Lines   | Branches | Functions | Statements |
| ---------------------- | ------- | -------- | --------- | ---------- |
| `services/api-gateway` | 70%     | 60%      | 70%       | 70%        |
| `services/app`         | 50%     | 40%      | 50%       | 50%        |
| `packages/ui`          | 80%     | 70%      | 80%       | 80%        |
| `packages/shared`      | 90%     | 85%      | 90%       | 90%        |
| **Globale aggregate**  | **70%** | **60%**  | —         | —          |

Rationale per i tier diversi:

- `packages/shared` e `packages/ui` sono librerie pure, alta testabilità → target alto.
- `services/api-gateway` ha controller/middleware testabili senza UI → target medio-alto.
- `services/app` ha molte page/layout RSC + Edge middleware difficili da unit testare → target medio (E2E copre il resto).

Threshold enforcement: `vitest.config.ts` per workspace ha `test.coverage.thresholds`. Failure threshold blocca il run.

### Coverage report location

`reportsDirectory: '../../.rtg-state-evo/coverage/<workspace>/'` — gitignored, viewable HTML.

### A11y test pattern

Setup (`src/__tests__/setup.ts`):

```ts
import { toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

Pattern test:

```tsx
import { axe } from 'jest-axe';

it('has no a11y violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Ogni componente pubblico in `packages/ui/src/components/` deve avere ≥ 1 a11y test.

### E2E flow

`services/app/playwright.config.ts`:

- Test dir: `tests/e2e/`
- Output: `.rtg-state-evo/playwright/{results,report}/`
- Web server: `npm run dev` (port 3200), reuseExistingServer non-CI
- Browsers: chromium primary, firefox/webkit aggiunti quando CI matrix lo richiede
- Trace `on-first-retry`, screenshot `only-on-failure`, video `retain-on-failure`

Test critici (B3.10):

- `tests/e2e/auth.spec.ts` — login render, protected redirect, success login (skipped se stack non up), invalid credentials

### Test fixtures shared

`tests/fixtures/` (anticipate B2.6):

- `tenants.ts` — 4 canonical UUIDs
- `employees.ts` — 3 sample
- `index.ts` — public re-exports

## Alternatives considered

- **Jest invece di Vitest**: rejected — Vitest ESM-native, integration con Vite/Next 16 cleaner, syntax compatibility con Jest sufficient.
- **Playwright Component Testing invece di Vitest jsdom**: rejected — overhead browser launch per ogni componente è costoso; jsdom + @testing-library è il path standard.
- **Cypress invece di Playwright per E2E**: rejected — Playwright migliore con Next.js App Router, testing parallelo nativo, traces integrate.
- **Coverage threshold globale singolo (es. 70% ovunque)**: rejected — non riflette difficoltà differenziale tra workspace.
- **A11y testing solo in Storybook**: utile ma non sufficiente; vitest a11y è il primo gate, Storybook a11y addon è il secondo (B8.6).

## Consequences

Positive:

- Single command `npx vitest run` esegue 127 test cross-workspace in ~13s (al boot post-B3).
- A11y violations bloccano i test → impedisce regressioni di accessibilità.
- E2E auth.spec.ts copre i path che unit test non possono toccare.
- Coverage thresholds enforced → impossibile mergeare codice non testato sotto soglia.

Negative:

- Setup duplicato (setup.ts in 2 workspace) — tollerato, costo basso.
- jsdom env è approssimativo per Next.js server components — alcune feature reali richiedono Playwright.
- Coverage threshold troppo alto può rallentare velocity nelle prime fasi B7-B11 → re-tunable se necessario.

## Smoke validation (post-B3)

Pre-B3:

- 12 test (api-gateway employees) + 12 (app authorize) + 4 (ui Button/Input/Card/Toast) + 70 (shared schemas/role) = ~98 test sparsi, no E2E, no a11y.

Post-B3:

- 127 test passanti (api-gateway 12 + app 16 inc. login-form 4 + ui 4 + shared 95)
- 1 a11y test (LoginForm) come baseline
- Playwright config pronta + 4 spec auth.spec.ts (2 attivi smoke + 2 skip-conditional)
- Coverage thresholds enforced per 4 workspace
- `vitest.workspace.ts` orchestratore single-command

## References

- ROAD_TO_GLORY_EVO_HARDENING.md §8 Phase B3
- Vitest workspace docs: https://vitest.dev/guide/workspace
- jest-axe: https://github.com/nickcolley/jest-axe
- Playwright: https://playwright.dev
- ADR-0014 design system architecture (consumer di a11y test pattern)
