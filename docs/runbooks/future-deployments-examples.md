# Future deployment workflow templates

> Reference templates for GitHub Actions deployment workflows that are NOT yet
> activated. Previously lived as `.github/workflows/deploy-*.yml.example` stubs;
> consolidated here to keep the active workflow directory clean.
>
> **When to activate**: copy the YAML block into `.github/workflows/<filename>.yml`,
> uncomment the active sections, fill in TODOs, add required secrets, then
> commit + PR through the standard branch protection cycle.

## Deploy App + API Gateway → VM OCI

Ports 3200/8200 on `oracle-vm-default` (see `CLAUDE.md` root §Domini & routing).
Triggers on push-to-main when `services/app`, `services/api-gateway`,
`packages/ui` or `packages/shared` change.

```yaml
# .github/workflows/deploy-app-api.yml

name: Deploy App & API

on:
  push:
    branches: [main]
    paths:
      - 'services/app/**'
      - 'services/api-gateway/**'
      - 'packages/ui/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-app-api.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup-node-prisma
      - run: npm run build -w services/app
      - run: npm run build -w services/api-gateway
      # TODO: SSH deploy su oracle-vm-default
      # - uses: appleboy/ssh-action@v1
      #   with:
      #     host: ${{ secrets.OCI_HOST }}
      #     username: ubuntu
      #     key: ${{ secrets.OCI_SSH_KEY }}
      #     script: |
      #       cd /opt/heuresys
      #       git pull
      #       npm ci --omit=dev
      #       npm run build
      #       sudo systemctl restart heuresys-app heuresys-api
```

Secrets needed: `OCI_HOST`, `OCI_SSH_KEY`. Add via `gh secret set`.

## Deploy Marketing (landing pubblica)

Triggers on push-to-main when `services/marketing`, `packages/ui` or
`packages/shared` change. Two strategy options below.

```yaml
# .github/workflows/deploy-marketing.yml

name: Deploy Marketing

on:
  push:
    branches: [main]
    paths:
      - 'services/marketing/**'
      - 'packages/ui/**'
      - 'packages/shared/**'
      - '.github/workflows/deploy-marketing.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: ./.github/actions/setup-node-prisma
      - run: npm run build -w services/marketing
      # TODO: pick a deploy strategy
      # Option A — Vercel CLI:
      # - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }} services/marketing
      # Option B — upload static artifact for CDN:
      # - uses: actions/upload-artifact@v7
      #   with:
      #     name: marketing-dist
      #     path: services/marketing/.next/
```

Secret needed (for option A): `VERCEL_TOKEN`.

## Activation checklist

Once a deployment is ready to go live:

1. Copy the YAML block into `.github/workflows/<name>.yml`
2. Uncomment all sections including the `name:` header
3. Add required secrets via `gh secret set <NAME>`
4. Open a PR and let it merge through the standard 4 mandatory + 3 optional checks
5. Update `docs/architecture/overview.md` with the new deployment topology
6. Add an ADR entry if the deployment introduces a non-trivial architectural choice
