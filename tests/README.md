# tests

Test cross-service end-to-end e fixture condivise.

## Cosa va qui
- `e2e/` — test Playwright che attraversano marketing → app → api-gateway
- `e2e/fixtures/` — pagine artificiali consumate solo dai test E2E (non browse-abili manualmente)
- `performance/` — test di carico cross-service (k6, autocannon, ...)
- `contracts/` — contract testing tra services (Pact o custom)

## Cosa NON va qui
- Unit test → dentro `services/<name>/tests/unit/`
- Integration test (single-service) → dentro `services/<name>/tests/integration/`
- Storybook test → dentro `packages/ui/`

## Convenzioni
- E2E sempre headless in CI, headed disponibile in dev
- Fixture pages chiaramente marcate (es. prefisso `__fixture_` nel path)
- Test deterministici: niente sleep arbitrari, sempre wait condizionali
- Reset stato DB tra test suite (transazioni o cleanup esplicito)
