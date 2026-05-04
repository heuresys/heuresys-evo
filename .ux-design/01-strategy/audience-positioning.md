# Audience & Positioning

## Tensione attiva (da risolvere)

Dal vision doc (`docs/10-strategy/heuresys-vision.md` riga 171):

> **Target PMI 50-250 vs Enterprise 1000+** — repositioning interno ancora da consolidare.

**Decisione strategica pendente.** Influenza:

- Pricing (ARR 5-30k vs 100-500k)
- Sales motion (self-serve vs enterprise sales)
- Onboarding (template-driven vs implementation 3-6 mesi)
- Brand voice (diretta/snella vs autoritativa/istituzionale)
- Visual density (Linear-style minimal vs SAP-style enterprise dashboards)

## Tre opzioni di posizionamento

### Opzione α — PMI 50-250 dipendenti (focus)

**Cliente tipo**: aziende italiane mid-market, settore finanza/manufacturing/servizi professionali. Esempi tenant esistenti: SmartFood, EcoNova.

**Buyer**: HR Director o COO che si appoggia a HR. Decisione 30-90 giorni. Approva il CdA.

**Promessa brand**: "Da consulenza una-tantum a governance ricorrente. Senza un team da 20 HR business partner."

**Implicazioni visive**:

- Densità informativa media (non sovraccaricare)
- Onboarding visibile e self-serve
- "Setup in 2 settimane, valore in 1 trimestre"
- Mockup landing: pricing chiaro, comparison table, demo gratuita

### Opzione β — Enterprise 1000+ (focus)

**Cliente tipo**: corporate italiane/europee, settore banking/insurance/utilities/PA. Esempio tenant esistente: RTL Bank.

**Buyer**: CHRO + CIO. Decisione 6-12 mesi. RfP con 3-5 vendor in shortlist.

**Promessa brand**: "Layer ontologico tra ERP, HR e BI. Strumentato, auditabile, RLS-native, multi-tenant. Per chi ha già SAP/Workday e vuole governance, non un altro silos."

**Implicazioni visive**:

- Densità informativa alta (power user, dashboard tableau-grade)
- Compliance prominent (RLS, audit logs, ESCO conformità)
- Case study istituzionali (logo wall di banche/utilities)
- Mockup landing: nessun pricing pubblico, "Talk to sales"

### Opzione γ — Dual-track con priorità

**Setup**: prodotto unico, ma posizionamento e go-to-market biforcato.

**Brand**: voce e visual coerente, ma marketing surface diverse:

- `heuresys.com` → Enterprise (autorevole, case study, compliance)
- `heuresys.com/sme` (o sub-brand) → PMI (più snello, pricing)

**Vantaggio**: copre l'ambiguità senza rinunciare. **Costo**: doppio go-to-market, brand più complesso.

## Raccomandazione brand-driven (non strategic-driven)

Per **costruire la brand identity ora** (Phase 1), suggerisco di **lavorare su Opzione β (Enterprise) come default**, perché:

1. La doctrine Heuresys (7 pilastri, ontologia, ESCO, RLS coverage 605 policy) è di natura enterprise-grade. Forzarla in messaging PMI = svilirla.
2. Il claim "layer ontologico" risuona con CIO/CHRO che già hanno SAP/Workday. Per PMI è astratto.
3. Le dashboard ricercate (focus Phase 9) richiedono utenti power. Enterprise li ha; PMI di rado.
4. Brand Enterprise può **scendere** verso PMI con landing dedicata. Brand PMI fatica a salire verso Enterprise.

**Ma la decisione è di Enzo.** Questo file resta come **doc di scelta in attesa**. Quando deciso, integro in `brand-foundations.md` come positioning ufficiale.

## Settore + geografia

Indipendente dalla scelta α/β/γ:

- **Geografia primaria**: Italia (italiano lingua primaria, conformità CCNL/PA, ESCO bilingue IT/EN)
- **Geografia secondaria**: EU (ESCO è EU-wide, RGPD-native)
- **Geografia futura**: UK / DACH / Nordics (mercato skills-based più maturo)

- **Settori naturali**: finance, insurance, utilities, manufacturing, PA, professional services
- **Settori difficili**: retail high-turnover (capability framework instabile), startup early stage (modello prematuro)

## Tenant attuali noti (campione)

| Tenant          | Tipo            | Settore               | Note brand                              |
| --------------- | --------------- | --------------------- | --------------------------------------- |
| Heuresys System | Platform owner  | —                     | Tenant `-1`, non audience               |
| RTL Bank        | Test enterprise | Banking               | Persona buyer: CHRO + CIO; decisore CdA |
| SmartFood       | Tenant cliente  | Manufacturing food    | PMI mid-market, decisione HR Director   |
| EcoNova         | Tenant cliente  | Cleantech / utilities | PMI in scale-up, decisione COO+HR       |

Mix attuale dei tenant è **dual-track** (1 enterprise + 2 PMI). Questo conferma che il prodotto può servire entrambi, ma il **brand visual** deve scegliere a quale parlare con voce primaria nelle surface marketing.

## Come questo influenza Phase 4 (aesthetic direction)

| Direzione estetica               | Allineamento α PMI  | Allineamento β Enterprise | Allineamento γ Dual |
| -------------------------------- | ------------------- | ------------------------- | ------------------- |
| A — Minimal-tech (Linear-like)   | ✅ Forte            | △ Possibile               | ✅                  |
| B — Editorial-distinct           | △ Possibile         | ✅ Forte                  | ✅                  |
| C — Cinematic-wow                | ⚠ Rischio "frivolo" | △ Possibile in marketing  | ✅                  |
| D — Modern-fintech (Stripe-like) | ✅                  | ✅ Forte                  | ✅                  |

Se Enzo sceglie α/β prima di Phase 4, restringo le opzioni. Se resta γ o decisione differita, espongo tutte e 4 e lui sceglie a vista.
