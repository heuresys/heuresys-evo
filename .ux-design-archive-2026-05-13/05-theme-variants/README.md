# `05-theme-variants/` — Heuresys Design Tokens

> **Phase 11** · 2026-05-07 · v1.0.0 · format: [W3C Design Tokens Community Group (DTCG)](https://tr.designtokens.org/format/)
>
> Source di verità portabile per i token Heuresys. Bridge tra `services/app/src/styles/active-theme.css` (production) e tool di design-tokens (Tokens Studio Figma · Style Dictionary · Tailwind preset · React Native).

## File

| File                 | Scope                                                                       | Note                                                                                             |
| -------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `tokens-dark.json`   | **SoT** — color · typography · spacing · radius · shadow · gradient · glass | Default theme. Tutti i token static (non-motion).                                                |
| `tokens-light.json`  | Color/shadow/glass override per `[data-theme="light"]`                      | Estende `tokens-dark.json`, sovrascrive solo i token che cambiano.                               |
| `tokens-motion.json` | Easing · duration · 5 pattern canonici · auxiliary · anti-pattern           | Theme-invariant. Pattern presets dettagliati con riferimento ai prototipi `04-motion-language/`. |
| `README.md`          | Questo file — uso + compatibility                                           |                                                                                                  |

## Cosa contengono (categorie)

```
color
├── brand           (blue, blueDeep, purple, purpleDeep)        ← logo L27 inviolabile
├── accent          (default, hover, soft, deep)                ← UI accent μ-architect
├── surface         (bg, 1, 2, 3)                               ← scala superfici
├── ink             (default, soft, muted, tertiary)            ← scala testo
├── rule            (default, strong)                           ← divider
├── logo            (body, tokenLabel)                          ← convenzione L28 wordmark relative
├── semantic        (success, warning, danger, info)            ← stati
└── capability      (process, structure, role, competence, performance)  ← KG dimensions

gradient.aurora                 (linear blue→purple 135deg)
glass.{bg,border,blur}          (auth + modal glassmorphism)
shadow.{card,elevated,overlay,brandGlow}
spacing.{1..8}                  (4-64px scale)
radius.{1..5,pill}
typography.{fontFamily,fontWeight,fontSize,letterSpacing,lineHeight,fontFeatureSettings}
motion.{easing,duration,stagger,pattern,auxiliary,antiPattern,accessibility}
```

## Uso lato consumer

### Tokens Studio (Figma)

1. Plugin "Tokens Studio for Figma" → Tools → Load from JSON
2. Carica `tokens-dark.json` come **base**
3. Carica `tokens-light.json` come **set override** con condizione `theme = light`
4. Carica `tokens-motion.json` come **set globale** (theme-invariant)

### Style Dictionary v4

```js
// style-dictionary.config.js
export default {
  source: ['.ux-design/05-theme-variants/tokens-*.json'],
  platforms: {
    css: { transformGroup: 'css', files: [{ destination: 'tokens.css', format: 'css/variables' }] },
    js: { transformGroup: 'js', files: [{ destination: 'tokens.js', format: 'javascript/es6' }] },
    ios: {
      transformGroup: 'ios',
      files: [{ destination: 'tokens.swift', format: 'ios-swift/class.swift' }],
    },
  },
};
```

### Tailwind 4 preset

I token sono già mirror in `services/app/src/styles/active-theme.css` via `@theme inline`. Per cross-app usage, generare `tailwind.preset.ts` da `tokens-dark.json` con uno script Style Dictionary custom.

### CSS custom properties (browser)

```bash
# Genera CSS variables dal SoT
npx style-dictionary build --config sd.config.js
```

## Reference resolution

I token usano riferimenti DTCG `{path.to.token}`:

```json
"color.logo.body": { "$value": "{color.ink.default}" }
```

Tool DTCG-compliant (Tokens Studio, Style Dictionary v4) risolvono auto. Se serve resolve manuale:

| Token             | Dark resolved | Light resolved |
| ----------------- | ------------- | -------------- |
| `color.logo.body` | `#f5f6fa`     | `#0a0a10`      |

## Convenzioni Heuresys-specific (non DTCG-standard)

- **L25** — Wordmark lowercase, tutte le lettere identiche peso/size/style. `typography.fontWeight.wordmarkBody = 700`, `wordmarkY = 500`. Solo la `y` cambia colore.
- **L27** — Logo originale: 2 colori fissi (`color.brand.blue` body + `color.brand.purple` y). Eccezione plain text: indirizzi, link, domini.
- **L28** — Logo relativo: `color.logo.body` deriva dal tema attivo (`{color.ink.default}`). Per surface tematizzate.
- **Anti-pattern motion** — Vedi `motion.antiPattern.rejected` array.

## Mapping con production (active-theme.css)

| JSON path                      | CSS var           | File                  |
| ------------------------------ | ----------------- | --------------------- |
| `color.brand.blue.$value`      | `--brand-blue`    | `active-theme.css:33` |
| `color.brand.purple.$value`    | `--brand-purple`  | `active-theme.css:34` |
| `color.accent.default.$value`  | `--accent`        | `active-theme.css:27` |
| `color.surface.bg.$value`      | `--bg`            | `active-theme.css:14` |
| `color.ink.default.$value`     | `--ink`           | `active-theme.css:20` |
| `motion.easing.default.$value` | `--ease-default`  | `active-theme.css:69` |
| `motion.duration.fast.$value`  | `--duration-fast` | `active-theme.css:71` |
| `motion.duration.base.$value`  | `--duration-base` | `active-theme.css:72` |
| `motion.duration.slow.$value`  | `--duration-slow` | `active-theme.css:73` |
| `radius.4.$value`              | `--radius-4`      | `active-theme.css:65` |

Manutenzione: ogni modifica a `active-theme.css` DEVE essere riflessa qui (e viceversa). I file JSON sono il SoT portabile per cross-tool, `active-theme.css` è il SoT runtime per il bundle Next.js.

## Versioning

| Version | Date       | Note                                                                        |
| ------- | ---------- | --------------------------------------------------------------------------- |
| 1.0.0   | 2026-05-07 | First release. Phase 11 close. Aligned to active-theme.css L34/Phase 14.SH. |

Bump semver:

- **major**: breaking change su token name o structure
- **minor**: nuovi token aggiunti
- **patch**: valore aggiornato (es. tweak OKLCH)

## Cross-reference

- **Production CSS SoT**: `services/app/src/styles/active-theme.css`
- **Palette spec**: `.ux-design/03-visual-identity/color/palette-final.md`
- **Typography spec**: `.ux-design/03-visual-identity/typography/typography-final.md`
- **Motion spec + prototipi**: `.ux-design/04-motion-language/motion-final.md` + `01-05-*.html`
- **DESIGN.md canonical drop-in**: `.ux-design/02-aesthetic/heuresys.DESIGN.md`
- **Brand book v0**: `.ux-design/07-brand-book/BRAND-BOOK-v0.md` (Phase 12)
