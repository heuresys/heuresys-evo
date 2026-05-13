/**
 * heuresys-palette-switcher.js
 * ============================================================================
 * Inietta un pannello flottante per switchare palette + theme (light/dark)
 * in realtime su qualsiasi pagina che linka heuresys-palette-framework.css.
 *
 * Activation:
 *   <link rel="stylesheet" href="heuresys-palette-framework.css">
 *   <script src="heuresys-palette-switcher.js" defer></script>
 *
 * Persistence: localStorage keys
 *   heuresys-palette  → palette id (legacy|alpha|...|mu-data-dense)
 *   heuresys-theme    → 'dark' | 'light'
 *
 * Integrazione con theme switcher esistente:
 *   Se la pagina ha già una funzione globale `toggleTheme()` o un bottone
 *   `.theme-toggle`, lo switcher la lascia funzionare e si SINCRONIZZA con
 *   l'attributo data-theme che quella imposta.
 *
 * Disabilitazione su pagina specifica:
 *   <body data-hps-disabled> oppure
 *   window.HPS_DISABLED = true (prima dello script)
 * ============================================================================
 */
(function () {
  'use strict';

  if (window.HPS_DISABLED || document.body?.hasAttribute('data-hps-disabled')) {
    return;
  }

  const PALETTE_KEY = 'heuresys-palette';
  const THEME_KEY = 'heuresys-theme';
  const DEFAULT_PALETTE = 'legacy';
  const DEFAULT_THEME = 'dark';

  // -------- Palette catalog (4 famiglie) --------------------------------------
  const PALETTES = [
    // family: primary directions
    { id: 'legacy', label: 'legacy', family: 'Set 5', swatch: '#a855f7' },
    { id: 'alpha', label: 'α alpha', family: 'Primary', swatch: '#a855f7' },
    { id: 'beta', label: 'β beta', family: 'Primary', swatch: '#c4361b' },
    { id: 'gamma', label: 'γ gamma', family: 'Primary', swatch: '#1a4d7a' },
    { id: 'delta', label: 'δ delta', family: 'Primary', swatch: '#990f3d' },
    { id: 'epsilon', label: 'ε epsilon', family: 'Primary', swatch: '#2d1f6b' },
    { id: 'zeta', label: 'ζ zeta', family: 'Primary', swatch: '#c5612d' },
    { id: 'eta', label: 'η eta', family: 'Primary', swatch: '#DC2626' },
    { id: 'theta', label: 'θ theta', family: 'Primary', swatch: '#5b21b6' },
    // family: tempered/remix
    { id: 'iota', label: 'ι iota', family: 'Tempered', swatch: '#d4a017' },
    { id: 'kappa', label: 'κ kappa', family: 'Tempered', swatch: '#b8395a' },
    { id: 'lambda', label: 'λ lambda', family: 'Tempered', swatch: '#DC2626' },
    // family: mu (architect-grade dark variants)
    { id: 'mu-architect', label: 'μ architect', family: 'Mu', swatch: '#5e69d1' },
    { id: 'mu-art-director', label: 'μ art-dir', family: 'Mu', swatch: '#b370e0' },
    { id: 'mu-pragmatic', label: 'μ pragmatic', family: 'Mu', swatch: '#22c55e' },
    { id: 'mu-synthesis', label: 'μ synthesis', family: 'Mu', swatch: '#7a7fad' },
    { id: 'mu-data-dense', label: 'μ data-dense', family: 'Mu', swatch: '#7a7fad' },
  ];

  const VALID_PALETTES = new Set(PALETTES.map((p) => p.id));
  const VALID_THEMES = new Set(['dark', 'light']);

  // -------- State management --------------------------------------------------
  function getCurrentPalette() {
    const stored = localStorage.getItem(PALETTE_KEY);
    return VALID_PALETTES.has(stored) ? stored : DEFAULT_PALETTE;
  }

  function getCurrentTheme() {
    // Prefer explicit DOM state (already set by host page) over localStorage
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (VALID_THEMES.has(domTheme)) return domTheme;
    const stored = localStorage.getItem(THEME_KEY);
    return VALID_THEMES.has(stored) ? stored : DEFAULT_THEME;
  }

  function applyPalette(paletteId) {
    if (!VALID_PALETTES.has(paletteId)) return;
    document.documentElement.setAttribute('data-palette', paletteId);
    localStorage.setItem(PALETTE_KEY, paletteId);
    refreshUI();
  }

  function applyTheme(theme) {
    if (!VALID_THEMES.has(theme)) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    refreshUI();
  }

  function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
  }

  // Boot: applica stato persistito ASAP (prima del paint se possibile)
  applyPalette(getCurrentPalette());
  applyTheme(getCurrentTheme());

  // -------- UI rendering ------------------------------------------------------
  let rootEl = null;
  let collapsed = false;

  function renderUI() {
    if (rootEl) rootEl.remove();
    rootEl = document.createElement('div');
    rootEl.className = 'hps-switcher';
    if (collapsed) rootEl.classList.add('hps-switcher--collapsed');
    rootEl.innerHTML = collapsed ? renderCollapsed() : renderExpanded();
    document.body.appendChild(rootEl);
    bindEvents();
  }

  function renderCollapsed() {
    const p = getCurrentPalette();
    const t = getCurrentTheme();
    const swatch = PALETTES.find((x) => x.id === p)?.swatch || '#999';
    return `
      <div class="hps-switcher__header" title="Click per espandere">
        <span class="hps-switcher__swatch" style="background:${swatch}"></span>
        <span style="margin-left:6px">${p} · ${t}</span>
      </div>
    `;
  }

  function renderExpanded() {
    const currentPalette = getCurrentPalette();
    const currentTheme = getCurrentTheme();
    const families = ['Set 5', 'Primary', 'Tempered', 'Mu'];

    const familyBlocks = families
      .map((fam) => {
        const chips = PALETTES.filter((p) => p.family === fam)
          .map((p) => {
            const isActive = p.id === currentPalette;
            return `
              <button class="hps-switcher__chip"
                      data-action="palette"
                      data-palette-id="${p.id}"
                      data-active="${isActive}"
                      title="${p.label} (${p.family})">
                <span class="hps-switcher__swatch" style="background:${p.swatch}"></span>
                ${p.label}
              </button>`;
          })
          .join('');
        return `
          <div class="hps-switcher__group">
            <span class="hps-switcher__label">${fam}</span>
            <div class="hps-switcher__chips">${chips}</div>
          </div>`;
      })
      .join('');

    return `
      <div class="hps-switcher__header">
        <span>Heuresys Palette · v1</span>
        <button class="hps-switcher__close" data-action="collapse" title="Minimizza">−</button>
      </div>
      ${familyBlocks}
      <div class="hps-switcher__group">
        <span class="hps-switcher__label">Theme mode</span>
        <button class="hps-switcher__theme-toggle" data-action="theme">
          ${currentTheme === 'dark' ? '◐ Switch to LIGHT' : '◑ Switch to DARK'}
        </button>
      </div>
      <div class="hps-switcher__current">
        data-palette="${currentPalette}" · data-theme="${currentTheme}"
      </div>
    `;
  }

  function bindEvents() {
    if (!rootEl) return;
    rootEl.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (collapsed && !target) {
        collapsed = false;
        renderUI();
        return;
      }
      if (!target) return;
      const action = target.dataset.action;
      if (action === 'palette') {
        applyPalette(target.dataset.paletteId);
      } else if (action === 'theme') {
        toggleTheme();
      } else if (action === 'collapse') {
        e.stopPropagation();
        collapsed = true;
        renderUI();
      }
    });
  }

  function refreshUI() {
    if (rootEl) renderUI();
  }

  // -------- Sync con theme-toggle esistente sulla host page -------------------
  // Se la pagina chiama window.toggleTheme() o cambia data-theme via altro
  // codice, sincronizziamo il pannello.
  const observer = new MutationObserver(() => refreshUI());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'data-palette'],
  });

  // Espone API minimale per host page integration
  window.HeuresysPaletteSwitcher = {
    setPalette: applyPalette,
    setTheme: applyTheme,
    toggle: toggleTheme,
    getState: () => ({
      palette: getCurrentPalette(),
      theme: getCurrentTheme(),
    }),
    palettes: PALETTES.map((p) => ({ id: p.id, label: p.label, family: p.family })),
  };

  // Init dopo DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderUI);
  } else {
    renderUI();
  }
})();
