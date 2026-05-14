# i18n Policy — cycle 2 canonical

> Regole di localizzazione cross-route per il rebuild investor-ready.
> Default locale: `it`. Supported: `it`, `en`. Toggle: `LocaleSwitcher` in BrandShell topbar.

## Principi

1. **Zero hardcoded mix IT/EN nei componenti**. Tutte le stringhe utente passano per `pickBilingual` (bilingual DB columns) o `lib/i18n/constants.ts` (UI constants).
2. **Termini tecnici e codice in inglese**: variabili TS/JS, log, commit messages, naming (`employeeId`, `tenantId`, `RBAC`, `audit_log`). Stringhe utente IT default + EN fallback via switcher.
3. **Sigle canonical** (OPOURSKA, PET, INDOOR, TALPIPE, H2R, SKILGRO, GOKMER, PROGOV, ESKAP, ITLAB, RBP, DGOV, SMERTO, PULSAR, EPRA, CASCADIA) restano invariate cross-locale.
4. **Locale persistence**: cookie `NEXT_LOCALE` (server-readable per RSC), 1y validity. Propagation `LocaleSwitcher` → reload `/` con `?lang=` query → cookie write → redirect senza query.

## Pattern d'uso

### DB content (bilingual columns)

Tabelle con coppia `name_it` / `name_en` (e similar per `description`, `persona_label`, `accent`):

```ts
import { pickBilingual, DEFAULT_LOCALE } from '@/lib/i18n';

const title = pickBilingual(preset, 'name', locale);
// → preset.name_it || preset.name_en || preset.code (fallback chain)
```

Coverage attuale: `dashboard_presets` · `dashboard_elements` (config_overrides JSON) · `widget_catalog` · `esco_occupations` · `esco_skills` · `learning_paths`.

### UI constants (component-side)

Quando una stringa è UI-side (button label, empty state, breadcrumb prefix), definirla in `lib/i18n/constants.ts`:

```ts
export const UI = {
  it: {
    common: { close: 'Chiudi', save: 'Salva', cancel: 'Annulla' },
    nav: { dashboard: 'Dashboard', employees: 'Dipendenti', reviews: 'Valutazioni' },
    actions: { export_pdf: 'Esporta PDF', view_detail: 'Vedi dettaglio' },
  },
  en: {
    common: { close: 'Close', save: 'Save', cancel: 'Cancel' },
    nav: { dashboard: 'Dashboard', employees: 'Employees', reviews: 'Reviews' },
    actions: { export_pdf: 'Export PDF', view_detail: 'View detail' },
  },
} as const;
```

Component usage:

```tsx
import { useLocale, UI } from '@/lib/i18n';
const locale = useLocale();
return <button>{UI[locale].actions.export_pdf}</button>;
```

### Server component (RSC)

`useLocale` non disponibile in RSC. Risolvere locale lato server via `getCurrentLocale()` (cookie-based):

```tsx
import { getCurrentLocale, UI } from '@/lib/i18n';
const locale = await getCurrentLocale();
return <h1>{UI[locale].nav.dashboard}</h1>;
```

### Date / numeri / valuta

Usare `Intl.DateTimeFormat` e `Intl.NumberFormat` con locale esplicito:

```ts
new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
}).format(value);
```

Date in formato locale-friendly:

- IT: `gg/mm/aaaa` (DD/MM/YYYY)
- EN: `mm/dd/yyyy` (MM/DD/YYYY)

### Pluralization

Per ora regola binaria 1/N tramite `Intl.PluralRules` o ternario inline (no library). Esempio:

```ts
const label = count === 1 ? UI[locale].employee : UI[locale].employees;
```

Per casi complessi (zero/one/two/few/many/other), valutare `@formatjs/intl-pluralrules` in sprint successivo.

## Anti-pattern

- ❌ `<p>Stipendio medio: € {avg}</p>` (hardcoded IT)
- ❌ `<p>Average salary: {avg}€</p>` (hardcoded EN)
- ❌ Locale conditional inline: `{locale === 'it' ? 'Salva' : 'Save'}` → spostare a `UI` constants
- ❌ Date formattate con `toLocaleDateString()` senza locale esplicito (browser-default risk)
- ❌ Tenant content hardcoded ("RTL Bank · Q1 2026") → derivare da DB + locale
- ❌ Persona label IT in inglese ("HR Director" quando dovrebbe essere `Direttore Risorse Umane` o `Audience: HR_DIRECTOR`)

## Cascata fallback

`pickBilingual(obj, 'name', locale)`:

1. `obj[`${name}_${locale}`]` se non-null
2. `obj[`${name}_${other_locale}`]` se non-null
3. `obj.code` o stringa vuota

Garantisce: mai render `null` come "null" o "undefined". Mai stringa vuota visibile se evitabile.

## Coverage check (Phase 6)

Grep cross-`services/app/src/components/widgets/brand/` per stringhe IT/EN hardcoded:

```bash
grep -rEn '"(Salva|Save|Chiudi|Close|Esporta|Export|Valutazione|Review)"' services/app/src/components/widgets/brand/
```

Risultati attesi: 0. Tutte le stringhe utente passano per `UI` constants o `pickBilingual`.

## Riferimenti

- `services/app/src/lib/i18n/index.ts` — entry-point
- `services/app/src/lib/i18n/constants.ts` — UI strings dictionary (da consolidare in Phase 6)
- `LocaleSwitcher` component: `services/app/src/lib/i18n/locale-switcher.tsx`
- Plan §0.7 + §6.1-6.2
