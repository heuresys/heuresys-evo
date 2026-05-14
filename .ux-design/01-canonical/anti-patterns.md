# Anti-Patterns — cycle 2 canonical (banditi cross-route)

> Lista pattern proibiti nel rebuild investor-ready. Grep enforcement nei verification phase + brand:anti-slop pre-flight.

## A. Debug leak in JSX templates

Mai render testi tecnici di sistema in UI prod.

| Pattern bandito                | Esempio                             | Sostituto                                 |
| ------------------------------ | ----------------------------------- | ----------------------------------------- |
| UUID parziale leak             | `tenant 0c54b84a…`                  | omit o `NEXT_PUBLIC_SHOW_DEV_FOOTER` flag |
| Role string visibile           | `· HR_DIRECTOR`                     | omit (visibile in UserMenu, ok)           |
| Build hash                     | `BUILD 5f36d17`                     | omit o flag dev                           |
| ENV label                      | `ENV DEV`                           | omit o flag dev                           |
| Element ID                     | `data-element-id="55ab"` (visibile) | spostare in `data-*` attribute, no text   |
| SOURCE · N widget · tenant XXX | ws-footer                           | rimosso T0.8                              |

Grep enforcement Phase 7:

```bash
grep -rEn '0c54b8|tenant \w{8}…|BUILD [a-f0-9]{7}|SOURCE · \d+ widget|ENV \w+' services/app/src/components services/app/src/app
```

Atteso: 0 match in path JSX prod.

## B. Scaffold / disclaimer / placeholder

Mai render testi che ammettono "lavori in corso" sul prodotto investor-ready.

| Pattern bandito                               | Sostituto                                                            |
| --------------------------------------------- | -------------------------------------------------------------------- |
| "Scaffold base"                               | rimuovere — completare il content                                    |
| "Coming soon"                                 | rimuovere — non shipped, non visibile                                |
| "Sprint 2"                                    | rimuovere — feature backlog non si menziona in UI                    |
| "DECISIONS-LOG L_NN"                          | rimuovere — è interno, non user-facing                               |
| "carry-forward"                               | rimuovere — è planning, non UI                                       |
| "TODO / FIXME / XXX" in commenti JSX visibili | sostituire o rimuovere                                               |
| "Lorem ipsum"                                 | usare dati live                                                      |
| Demo data hardcoded                           | sostituire con query Prisma + `<DataNotAvailable />` se source manca |

Grep enforcement:

```bash
grep -rEn 'Scaffold base|coming soon|Sprint \d|DECISIONS-LOG L\d|carry-forward|Lorem ipsum|TODO[^a-zA-Z]|FIXME' services/app/src/app services/app/src/components
```

Atteso: 0 match.

## C. Mock UX personas (cycle 1 purged S62)

Mai render label di persona inventate (purgate da L6 cycle 2).

| Pattern bandito | Sostituto                                 |
| --------------- | ----------------------------------------- |
| "Maria CHRO"    | `Audience: HR_DIRECTOR`                   |
| "Maria Bianchi" | nome utente reale da `users.display_name` |
| "Davide IT"     | `Audience: IT_ADMIN`                      |
| "Andrea EMP"    | `Audience: EMPLOYEE`                      |
| "Stefania LM"   | `Audience: LINE_MANAGER`                  |
| "Marco Rossi"   | `Audience: TENANT_OWNER`                  |

Pattern canonical: `Audience: <ROLE>` o display name reale dal DB (`employees.first_name + last_name`).

Grep enforcement:

```bash
grep -rEn 'Maria CHRO|Maria Bianchi|Davide IT|Andrea EMP|Stefania LM|Marco Rossi' services/app/src .ux-design
```

Atteso: 0 match.

## D. Layout violation (10 leggi cockpit)

| #   | Anti-pattern                               | Legge violata                                |
| --- | ------------------------------------------ | -------------------------------------------- |
| D1  | 5+ KpiRing in hero                         | F2 (Pareto del dato — 4 max), F10 (coerenza) |
| D2  | Mix KpiRing + StatsCard in hero            | F10 (coerenza)                               |
| D3  | Full-page drilldown navigation             | F3 (hero→body→drill nel contesto)            |
| D4  | Flat list per dati gerarchici              | F7 (strutture ramificate)                    |
| D5  | Tab >3 livelli secondari                   | F3, F6 (cognitive overload)                  |
| D6  | Animation/glow/pulse senza state change    | F8 (motion misurato)                         |
| D7  | Empty state generico ("no data")           | F9, P11 (use `<DataNotAvailable />`)         |
| D8  | DataTable senza pagination >100 rows       | F2 (Pareto), perf                            |
| D9  | Tree senza breadcrumb depth indicator      | F4, F7                                       |
| D10 | KPI hero senza sparkline trend             | F4 (mai dead-end visuale)                    |
| D11 | Header senza one-question h1               | F1 (una domanda)                             |
| D12 | Sidebar collapsed senza active indicator   | F4, accessibility                            |
| D13 | Sticky elements che bloccano interaction   | F8                                           |
| D14 | Modal full-page invece di slide-over       | F3 (perde contesto)                          |
| D15 | Bottom action bar floating senza container | F10                                          |

## E. P11 violation (NO MOCK ovunque)

Vedi CLAUDE.md root §REGOLA NON NEGOZIABILE + `.claude/CLAUDE.md` CARD-4.

| Pattern bandito                           | Sostituto                                                 |
| ----------------------------------------- | --------------------------------------------------------- |
| Hardcoded number nel JSX                  | query Prisma in `lib/data/*-queries.ts`                   |
| `value: 0` quando data missing            | `unavailable: true` adapter prop + `<DataNotAvailable />` |
| Random / faker / placeholder              | `null` → `<DataNotAvailable />`                           |
| "Demo data" comment + literal             | seed via CASCADIA pipeline o `<DataNotAvailable />`       |
| "Sample employee Mario Rossi"             | dati reali da DB                                          |
| Sparkline con array literal `[1,2,3,4,5]` | query SQL trend reale o `null`                            |

Eccezione **esplicita**: CASCADIA seeding tools (`scripts/seed-generator/*`) — quelli scrivono dati live in DBMS, post-INSERT i record sono dato reale.

## F. i18n violation

| Pattern bandito                               | Sostituto                                                         |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `<p>Stipendio medio: € {avg}</p>`             | `<p>{UI[locale].compensation.avg}: {fmtEUR(avg)}</p>`             |
| `{locale === 'it' ? 'Salva' : 'Save'}` inline | `{UI[locale].common.save}`                                        |
| `toLocaleDateString()` senza locale arg       | `new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-US')...` |
| Hardcoded tenant name "RTL Bank"              | derivare da DB                                                    |
| Persona label English "HR Director"           | usare `Audience: HR_DIRECTOR` o IT/EN bilingual                   |
| Currency assumption € only                    | usare `tenant.currency` se variabile                              |

## G. Performance violation

| Anti-pattern                                         | Mitigazione                                            |
| ---------------------------------------------------- | ------------------------------------------------------ |
| RSC con N+1 query loop                               | Prisma `Promise.all` parallelizzato                    |
| Client-side fetching senza loading skeleton          | `<Skeleton variant="..." />` da packages/ui            |
| Heavy chart (ECharts/Cytoscape) eager-loaded in hero | dynamic import + Suspense                              |
| Image senza `next/image` + width/height              | sempre `next/image` per LCP                            |
| Font preload mancante per Inter/Exo 2/JetBrains      | `<link rel="preload">` in layout                       |
| Cookie auth lookup ad ogni request senza caching     | `getCachedTenantName` / `getCachedPresetMeta` 300s TTL |

## H. Security violation (P1-P11)

| Anti-pattern                                                   | Risk                                       |
| -------------------------------------------------------------- | ------------------------------------------ |
| Query Prisma senza `tenant_id` filter su tabella tenant-scoped | P1 multi-tenant break                      |
| `requireRole('HR_DIRECTOR')` hardcoded                         | P3 (use `requirePermission(area, action)`) |
| `$queryRawUnsafe` con interpolazione non parametrizzata        | P6 SQL injection                           |
| Plain text password nel log                                    | P10 secret hygiene                         |
| Hardcoded API key / token                                      | P6 (use `.env`)                            |
| Console.log in prod path                                       | P8 (use pino)                              |

## I. Brand identity violation

| Anti-pattern                                            | Pattern canonical                                         |
| ------------------------------------------------------- | --------------------------------------------------------- |
| Wordmark "Heuresys" maiuscolo                           | `heures<span class="y">y</span>s` (h minuscola, y accent) |
| Wordmark italic                                         | regola permanente: MAI italic                             |
| Logo Exo 2 weight !=700                                 | sempre 700                                                |
| Brand blue applicato a "y"                              | "y" sempre accent (purple)                                |
| Body lettera in colore !=`--brand-blue` o `--logo-body` | use solo i 2 valori canonical                             |

## J. Accessibility (WCAG 2.2 AA target)

| Anti-pattern                              | Fix                           |
| ----------------------------------------- | ----------------------------- |
| Button without `aria-label` per icon-only | aggiungere `aria-label`       |
| Color-only state indication               | aggiungere icon o text        |
| Contrast text/background <4.5:1 (AA)      | use semantic tokens canonical |
| Click target <44×44px (mobile)            | size up                       |
| Form without `<label>` association        | `for=` o wrapping             |
| Modal senza focus trap                    | implement focus management    |
| Skip-to-content link mancante             | add in BrandShell             |
| Tabindex >0 (custom order)                | use natural order             |

## Enforcement

- **Phase 0 T0.13**: brand:audit baseline (pre-rebuild) per quantificare situazione corrente
- **Phase 1-4 T\*.3**: brand:anti-slop pre-flight check per ogni preset prima del seed
- **Phase 1-4 T*.7 / T*.5**: brand:audit post-implementation (target ≥ 7)
- **Phase 7 T7.8**: brand:audit cross-route final coherence (target avg ≥ 8)

## Riferimenti

- CLAUDE.md root §REGOLA NON NEGOZIABILE (P11)
- `.claude/CLAUDE.md` CARD-4 (NO MOCK ovunque)
- `docs/_meta/operating-baseline.md` §Anti-pattern
- `services/app/src/components/data/DataNotAvailable.tsx` (P11 component)
- `packages/ui/src/components/wordmark.tsx` (brand identity)
- Plan §0.9 + §10
