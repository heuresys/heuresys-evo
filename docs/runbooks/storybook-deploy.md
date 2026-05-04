# Runbook — Storybook Deploy to GitHub Pages

> **Scope**: ops procedure per il deploy del Storybook di `packages/ui` su GitHub Pages.
> **Setup**: S10 (2026-05-04). Vedi ADR-0019 + ADR-0016.

## Architettura

- **Sorgente**: `packages/ui/` (~180 component, 84 stories Storybook 9 + Vite 7.3.2)
- **Build**: `npm run build-storybook --workspace=packages/ui` → output `packages/ui/storybook-static/`
- **Deploy target**: GitHub Pages, URL `https://heuresys.github.io/heuresys-evo/`
- **Workflow file**: `.github/workflows/storybook.yml`

## Trigger del workflow

Path-filtered su:

- `packages/ui/**` (qualsiasi cambio in UI library)
- `.github/workflows/storybook.yml` (cambio del workflow stesso)

Eventi:

- `push` a `main` → build + deploy
- `pull_request` a `main` → solo build (no deploy, evita preview spurious)
- `workflow_dispatch` → trigger manuale via GitHub UI o `gh workflow run "Storybook Deploy"`

## Trigger manuale

```bash
# Trigger via gh CLI
gh workflow run "Storybook Deploy" --ref main

# Verifica run
gh run list --workflow "Storybook Deploy" --limit 3

# Log run specifico
gh run view <run-id> --log
```

## Verifica deploy

```bash
# Health check URL
curl -sI https://heuresys.github.io/heuresys-evo/ | head -1
# → expected: HTTP/2 200

# Verifica index.html serve la build corretta
curl -s https://heuresys.github.io/heuresys-evo/ | grep -E "<title>|storybook"

# Verifica artifact size
gh run view <run-id> --json jobs --jq '.jobs[] | select(.name == "build") | .conclusion'
```

## Permission richieste sul workflow

```yaml
permissions:
  contents: read # checkout
  pages: write # deploy artifact
  id-token: write # OIDC token per actions/deploy-pages@v4
```

Senza queste permission, `actions/deploy-pages@v4` fallisce con `403 Forbidden`.

## Concurrency

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

`cancel-in-progress: false` consente al deploy in corso di finire prima del prossimo (evita stato inconsistente Pages durante deploy parziale).

## Setup iniziale (già fatto S10, riferimento storico)

1. **Enable GitHub Pages con source = workflow** (necessario per `actions/deploy-pages@v4`):
   ```bash
   gh api -X POST repos/heuresys/heuresys-evo/pages -f build_type=workflow
   ```
2. **Verifica abilitazione**:
   ```bash
   gh api repos/heuresys/heuresys-evo/pages
   # → expected: build_type="workflow", html_url="https://heuresys.github.io/heuresys-evo/"
   ```

Se `build_type=branch`, il workflow `actions/deploy-pages@v4` **fallisce** — bisogna ri-eseguire il `POST` con `build_type=workflow`.

## Troubleshooting

### `npm ci` fallisce con "Missing: <pkg> from lock file"

Il lockfile è generato con npm@11. Setup-node@v4 default installa npm@10.x → semantic mismatch. Fix nel workflow:

```yaml
- name: Pin npm to project-required version
  run: npm install -g npm@11
- name: Install dependencies
  run: npm ci --no-audit --no-fund
```

Pattern coerente con `.github/workflows/{ci,build}.yml`.

### Deploy job skipping su PR

Atteso. Il workflow ha `if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'` sul deploy job → PR triggerano solo build (validation), non deploy. Vedi sezione "Deploy preview per PR" sotto se serve in futuro.

### 404 sulla URL Pages dopo deploy success

- Aspetta 1-3 minuti per propagation CDN GitHub
- Verifica `Settings → Pages` nel repo: deve mostrare "Your site is live at https://heuresys.github.io/heuresys-evo/"
- Se persistente: re-trigger workflow_dispatch

### Build OOM su workflow runner

Il workflow ha `NODE_OPTIONS: --max-old-space-size=4096`. Se necessario aumentare a 6144 per crescita futura del bundle Storybook.

## Estensioni future (non implementate ad oggi)

### Deploy preview per ogni PR

Attualmente PR fanno solo build (no deploy). Per abilitare preview URL per ogni PR:

- Opzione A: deploy su sotto-path `/pr-<number>/` (richiede multi-deploy GitHub Pages — limitato)
- Opzione B: migrare a Vercel preview (per-PR URL automatica)
- Opzione C: Chromatic (visual regression + preview integrato)

### Visual regression

GitHub Pages serve solo statici, no visual diff. Per visual regression considerare Chromatic (free tier 5k snapshot/mese).

### Required check su PR

Il job `build` Storybook NON è incluso nei 7 required status check di branch protection (vedi ADR-0019). È intenzionale: deploy preview, non gating. Per renderlo gating: `gh api PUT /repos/heuresys/heuresys-evo/branches/main/protection` aggiungendo `"build"` ai contexts.

## References

- ADR-0019 — Repository visibility flip + branch protection enforcement
- ADR-0016 — CI/CD strategy (B10 — sezione Branch protection ENFORCED)
- `.github/workflows/storybook.yml` — workflow source
- `packages/ui/.storybook/` — Storybook config
- `packages/ui/package.json` script `build-storybook`
