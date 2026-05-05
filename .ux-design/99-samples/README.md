# `.ux-design/99-samples/` — Brand identity reference library

> **Scopo**: collezione curata di esempi e framework esterni per arricchire il workstream brand identity Heuresys. Tutti i file sono **read-only references** — niente import in production code (rispetta scope vincolante `.ux-design/` definito in [`README.md`](../README.md)).
>
> **Last fetched**: 2026-05-05

## Origine sources

| Source                                                                                                               | Tipo                  | License        |
| -------------------------------------------------------------------------------------------------------------------- | --------------------- | -------------- |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)                                        | DESIGN.md spec (YAML) | MIT (presunta) |
| [rohitg00/awesome-claude-design](https://github.com/rohitg00/awesome-claude-design)                                  | Frameworks + prompts  | MIT            |
| [getdesign.md](https://getdesign.md/)                                                                                | Web gallery           | -              |
| [Department of Product — Claude Design](https://departmentofproduct.substack.com/p/claude-design-is-here-everything) | Article               | -              |

## Inventario (27 file)

### `voltagent-design-md/` — 12 spec YAML token-ready

Format: YAML frontmatter (version/name/description) + colors/typography/spacing tokens + agent_prompt_guide. Densità alta, drop-in per AI coding agent.

| File                   | Brand            | Famiglia stilistica          |
| ---------------------- | ---------------- | ---------------------------- |
| `linear.DESIGN.md`     | Linear           | Editorial minimalism         |
| `stripe.DESIGN.md`     | Stripe           | Editorial + gradient pop     |
| `vercel.DESIGN.md`     | Vercel           | Editorial / Geist precision  |
| `clickhouse.DESIGN.md` | ClickHouse       | Data-dense pro               |
| `posthog.DESIGN.md`    | PostHog          | Data-dense pro               |
| `hashicorp.DESIGN.md`  | HashiCorp        | Enterprise B/W               |
| `notion.DESIGN.md`     | Notion           | Warm editorial               |
| `sentry.DESIGN.md`     | Sentry           | Dark dashboard               |
| `supabase.DESIGN.md`   | Supabase         | Dark emerald technical       |
| `apple.DESIGN.md`      | Apple            | Glass / soft-futurism        |
| `claude.DESIGN.md`     | Anthropic Claude | Warm editorial (terracotta)  |
| `wired.DESIGN.md`      | WIRED            | Editorial broadsheet density |

### `rohitg00-frameworks/` — 8 framework prosa narrativi

Format: prosa con 9 sezioni canoniche + CSS vars in code block. Più leggibile per humans + insegnativo.

| Path                          | Famiglia              | Use per Heuresys                                            |
| ----------------------------- | --------------------- | ----------------------------------------------------------- |
| `editorial/linear.md`         | Editorial Minimalism  | dashboard density discipline                                |
| `editorial/vercel.md`         | Editorial / Geist     | typography precision reference                              |
| `data-dense/clickhouse.md` ⭐ | Data-Dense Pro        | **best match Heuresys** (charts/tables hero, mono numerals) |
| `data-dense/posthog.md` ⭐    | Data-Dense Pro        | dashboard navigation + drill-down                           |
| `warm/claude.md`              | Warm Editorial        | ζ Architectural Warm reference                              |
| `glass/apple.md`              | Glass / soft-futurism | premium aspirational reference                              |
| `cinematic/runway.md`         | Cinematic Dark        | α Editorial Cinematic reference                             |
| `terminal/ollama.md`          | Terminal-core         | mono-first surface reference                                |

### `rohitg00-prompts/` — 6 workflow prompt templates

Format: prompt + example run + variations + quality checks. Riutilizzabili come skill body.

| File                            | Workflow                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `brand-to-design-md.md`         | URL → DESIGN.md completo (9 sezioni) — extraction da brand live                                 |
| `audit-live-site.md`            | URL → design audit con punch list scoring (Hierarchy/Spacing/Color/A11y/AI-slop/Motion/Copy)    |
| `3-designer-debate.md`          | 3 personas (Architect/Art Director/Pragmatic PM) debate critique + synthesis                    |
| `remix-two-brands.md`           | 2 DESIGN.md → coherent third system con token arbitration rules                                 |
| `family-picker.md` ⭐           | 3 domande → famiglia stilistica raccomandata + 2 reference                                      |
| `break-default-aesthetic.md` ⭐ | System prompt anti-slop (no teal, no purple-pink gradient, no container-soup, no Inter default) |

### `rohitg00-recipes/`

| File                            | Recipe                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `token-budget-claude-design.md` | 5-fasi sequence per Claude Design (scaffold/4-screens/comments/branch/single-bundle handoff) |

## Mapping 8 direzioni Heuresys ↔ famiglie standard

| Heuresys                 | Famiglia 99-samples         | Reference DESIGN.md primari                  |
| ------------------------ | --------------------------- | -------------------------------------------- |
| α Editorial Cinematic    | Cinematic Dark              | `cinematic/runway.md`, `sentry.DESIGN.md`    |
| β Brutalist Paper        | Brutalist (no asset locale) | (n/a — `wired.DESIGN.md` parziale)           |
| γ Industrial Blueprint   | Data-Dense Pro              | `clickhouse.DESIGN.md`, `posthog.DESIGN.md`  |
| δ Quantitative FT        | Data-Dense Pro              | `clickhouse.md`, `posthog.md`                |
| ε Sculptural Variable    | Editorial + variable type   | `vercel.DESIGN.md`, `linear.DESIGN.md`       |
| ζ Architectural Warm     | Warm Editorial              | `warm/claude.md`, `notion.DESIGN.md`         |
| η Swiss Computational    | Editorial Minimalism        | `editorial/linear.md`, `editorial/vercel.md` |
| θ Algorithmic Generative | Indie/cult                  | (n/a — recipe `remix-two-brands.md` utile)   |

## Use cases per workstream Heuresys

1. **Decisione D1 strutturata** — usare `family-picker.md` per scegliere famiglia primaria; poi `3-designer-debate.md` per critique sulle 8 direzioni concorrenti
2. **Generazione DESIGN.md finale Heuresys** — adottare `brand-to-design-md.md` come template per produrre `02-aesthetic/heuresys.DESIGN.md` (9 sezioni canoniche) post-D1
3. **Anti-slop guardrails** — applicare `break-default-aesthetic.md` come prefix sui mockup futuri (Phase 9 dashboard)
4. **Audit legacy + evo** — eseguire `audit-live-site.md` su `www.heuresys.com` (baseline) e su `evo.heuresys.com` quando online (gate pre-launch)
5. **Token budget** — quando Enzo userà Claude Design cloud (claude.ai/design), la recipe `token-budget-claude-design.md` salva quota Pro

## License notes

I file sono fetched da repo pubblici GitHub (MIT presunta) e usati esclusivamente come reference interno per Heuresys. Niente redistribuzione. Niente import in production. Per attribuzione vedi commits di provenienza.

## Update protocol

Per aggiornare il pool:

```bash
# Re-fetch un singolo file
curl -fsSL https://raw.githubusercontent.com/<repo>/<path> -o <local-path>

# Aggiungere brand non in inventory: aggiornare questa tabella + commit
```
