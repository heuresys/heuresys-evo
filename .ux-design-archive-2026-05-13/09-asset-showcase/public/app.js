/**
 * Heuresys Asset Showcase — vanilla JS frontend.
 * State held in module-scope `state`. Re-render funzioni mutano DOM direttamente.
 *
 * Architecture:
 *   - load() → fetch stats + assets → render()
 *   - render() → renderTopbar + renderSidebar + renderCanvas
 *   - selectAsset(id) → fetch detail → renderDetail()
 *   - inline edit → patch via PUT → re-fetch → re-render
 *
 * No framework. No build. Just fetch + DOM.
 */

const state = {
  assets: [],
  selectedId: null,
  selectedDetail: null,
  filter: { promoted: 'all', kind: '', q: '' },
  stats: null,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const STORYBOOK_URL = 'http://localhost:6006';

// ========== API ==========
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function toast(msg, kind = 'ok') {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('error', kind === 'error');
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 2400);
}

// ========== LOAD ==========
async function load() {
  try {
    const [stats, assets] = await Promise.all([api('/api/stats'), fetchAssets()]);
    state.stats = stats;
    state.assets = assets;
    renderTopbar();
    renderSidebar();
    if (state.selectedId) await selectAsset(state.selectedId);
  } catch (e) {
    toast(`Load error: ${e.message}`, 'error');
  }
}

async function fetchAssets() {
  const params = new URLSearchParams();
  if (state.filter.kind) params.set('kind', state.filter.kind);
  if (state.filter.promoted === 'promoted') params.set('promoted', 'true');
  if (state.filter.promoted === 'available') params.set('promoted', 'false');
  if (state.filter.q) params.set('q', state.filter.q);
  const all = await api(`/api/assets?${params.toString()}`);
  // L46: client-side filter for chrome/dashboardCode (server endpoint
  // doesn't yet support these query params natively but data is in payload)
  if (state.filter.promoted === 'chrome') {
    return all.filter((a) => a.chromeStandard === true);
  }
  if (state.filter.promoted === 'org_systems_v2') {
    return all.filter((a) => a.dashboardCode === 'org_systems_v2');
  }
  return all;
}

// ========== RENDER TOPBAR ==========
function renderTopbar() {
  const s = state.stats;
  if (!s) return;
  const summary =
    `<span class="stat-num">${s.total}</span> assets · ` +
    `<span class="stat-num">${s.totalPromoted}</span> promoted · ` +
    `<span class="stat-num">${s.totalAvailable}</span> available · ` +
    `<span class="stat-num">${s.variants}</span> variants`;
  $('#stats-summary').innerHTML = summary;
}

// ========== RENDER SIDEBAR ==========
const KIND_ORDER = ['token', 'css', 'react', 'widget'];
const KIND_LABEL = {
  token: 'Design tokens',
  css: 'CSS classes',
  react: 'React (UI lib)',
  widget: 'Widgets (App)',
};

function renderSidebar() {
  const groups = new Map(); // kind -> Map(category -> assets)
  for (const a of state.assets) {
    const k = a.kind ?? 'misc';
    if (!groups.has(k)) groups.set(k, new Map());
    const catMap = groups.get(k);
    const c = a.category ?? '—';
    if (!catMap.has(c)) catMap.set(c, []);
    catMap.get(c).push(a);
  }

  const sidebar = $('#sidebar');
  sidebar.innerHTML = '';

  for (const k of KIND_ORDER) {
    if (!groups.has(k)) continue;
    const catMap = groups.get(k);
    const total = Array.from(catMap.values()).reduce((sum, arr) => sum + arr.length, 0);

    const kindEl = document.createElement('div');
    kindEl.className = 'kind-section';
    kindEl.innerHTML = `<span>${KIND_LABEL[k] ?? k}</span><span class="kind-count">${total}</span>`;
    sidebar.appendChild(kindEl);

    const cats = Array.from(catMap.keys()).sort();
    for (const c of cats) {
      const catEl = document.createElement('div');
      catEl.className = 'cat-section';
      catEl.textContent = `${c} (${catMap.get(c).length})`;
      sidebar.appendChild(catEl);

      for (const a of catMap.get(c).sort((x, y) => x.name.localeCompare(y.name))) {
        const row = document.createElement('div');
        row.className = 'asset-link';
        if (state.selectedId === a.id) row.classList.add('selected');
        row.dataset.id = a.id;
        const dot = a.promoted
          ? '<span class="promoted-dot" title="Promoted"></span>'
          : '<span class="available-dot" title="Available"></span>';
        const chromeBadge = a.chromeStandard
          ? '<span title="Universal chrome (cross-role)" style="font-size:9px;color:var(--accent);margin-right:4px">🛡</span>'
          : a.dashboardCode
            ? `<span title="Body of ${a.dashboardCode}" style="font-size:9px;color:var(--ink-muted);margin-right:4px">📐</span>`
            : '';
        const nameClass = a.deprecated ? 'name deprecated' : 'name';
        row.innerHTML = `${dot}${chromeBadge}<span class="${nameClass}">${escapeHtml(a.name)}</span>`;
        row.addEventListener('click', () => selectAsset(a.id));
        sidebar.appendChild(row);
      }
    }
  }
}

// ========== RENDER CANVAS DETAIL ==========
async function selectAsset(id) {
  state.selectedId = id;
  try {
    state.selectedDetail = await api(`/api/assets/${id}`);
    renderDetail();
    $$('.asset-link').forEach((el) => {
      el.classList.toggle('selected', Number(el.dataset.id) === id);
    });
  } catch (e) {
    toast(`Detail load error: ${e.message}`, 'error');
  }
}

function renderDetail() {
  const a = state.selectedDetail;
  if (!a) return;
  const canvas = $('#canvas');

  const promotedBtn = a.promoted
    ? `<button class="promoted-badge" id="btn-promote">✅ PROMOTED · click to unpromote</button>`
    : `<button class="available-badge" id="btn-promote">🆕 AVAILABLE · click to promote</button>`;

  const deprecatedBtn = a.deprecated
    ? `<button class="deprecated-badge" id="btn-deprecate">DEPRECATED · click to undeprecate</button>`
    : `<button class="available-badge" id="btn-deprecate">click to deprecate</button>`;

  // L46: chrome / body badges
  const chromeBadge = a.chromeStandard
    ? `<span class="kind-badge" style="background:rgba(170,181,247,0.18);color:var(--accent)">🛡 CHROME</span>`
    : a.dashboardCode
      ? `<span class="kind-badge" style="background:rgba(95,184,122,0.18);color:var(--semantic-success)">📐 BODY · ${escapeHtml(a.dashboardCode)}</span>`
      : '';

  const mockupSource = a.mockupSource
    ? `<div class="source-path" style="color:var(--ink-tertiary)">↩ from mockup: <code>${escapeHtml(a.mockupSource)}</code></div>`
    : '';

  // Parse JSON metadata once
  const subElements = a.subElementsJson ? JSON.parse(a.subElementsJson) : [];
  const behaviors = a.behaviorsJson ? JSON.parse(a.behaviorsJson) : null;
  const colorTokens = a.colorTokensJson ? JSON.parse(a.colorTokensJson) : [];

  canvas.innerHTML = `
    <div class="detail">
      <header class="detail-head">
        <h1>${escapeHtml(a.name)}</h1>
        <div class="meta-row">
          <span class="kind-badge kind-${a.kind}">${a.kind}</span>
          ${chromeBadge}
          ${promotedBtn}
          ${deprecatedBtn}
          ${a.category ? `<span class="source-path">· ${escapeHtml(a.category)}${a.subcategory ? ' / ' + escapeHtml(a.subcategory) : ''}</span>` : ''}
        </div>
        ${a.sourcePath ? `<div class="source-path">${escapeHtml(a.sourcePath)}${a.sourceLine ? ':' + a.sourceLine : ''}</div>` : ''}
        ${mockupSource}
      </header>

      <nav class="detail-tabs">
        <button class="tab-btn active" data-tab="preview">Preview</button>
        <button class="tab-btn" data-tab="meta">Meta</button>
        <button class="tab-btn" data-tab="variants">Variants (${a.variants.length})</button>
        <button class="tab-btn" data-tab="subelements">Sub-elements (${subElements.length})</button>
        <button class="tab-btn" data-tab="behavior">Behavior</button>
        <button class="tab-btn" data-tab="tokens">Color tokens (${colorTokens.length})</button>
        <button class="tab-btn" data-tab="code">Code</button>
        <button class="tab-btn" data-tab="history">History (${a.promotionLogs.length})</button>
      </nav>

      <div class="tab-panel active" data-panel="preview">${renderPreview(a)}</div>
      <div class="tab-panel" data-panel="meta">${renderMetaForm(a)}</div>
      <div class="tab-panel" data-panel="variants">${renderVariants(a)}</div>
      <div class="tab-panel" data-panel="subelements">${renderSubElements(subElements)}</div>
      <div class="tab-panel" data-panel="behavior">${renderBehavior(behaviors)}</div>
      <div class="tab-panel" data-panel="tokens">${renderTokens(colorTokens)}</div>
      <div class="tab-panel" data-panel="code">${renderCode(a)}</div>
      <div class="tab-panel" data-panel="history">${renderHistory(a)}</div>
    </div>
  `;

  // Wire tabs
  $$('.tab-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      const t = btn.dataset.tab;
      $$('.tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
      $$('.tab-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === t));
    })
  );

  $('#btn-promote').addEventListener('click', () => promoteToggle(a.id));
  $('#btn-deprecate').addEventListener('click', () => deprecateToggle(a.id));

  // Wire meta save
  const form = $('#meta-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      try {
        await api(`/api/assets/${a.id}`, { method: 'PUT', body: JSON.stringify(data) });
        toast('Saved');
        await load();
      } catch (e) {
        toast(`Save error: ${e.message}`, 'error');
      }
    });
  }

  // Wire delete
  const delBtn = $('#btn-delete');
  if (delBtn) {
    delBtn.addEventListener('click', async () => {
      if (!confirm(`Delete ${a.name}?`)) return;
      await api(`/api/assets/${a.id}`, { method: 'DELETE' });
      state.selectedId = null;
      state.selectedDetail = null;
      $('#canvas').innerHTML =
        '<div class="canvas-empty"><div class="empty-icon">⬡</div><h2>Asset eliminato</h2></div>';
      await load();
    });
  }

  // Wire add variant
  const addVariantBtn = $('#btn-add-variant');
  if (addVariantBtn) {
    addVariantBtn.addEventListener('click', () => openVariantModal(a.id));
  }

  // Wire variant deletes
  $$('.variant-delete').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const vid = btn.dataset.id;
      if (!confirm('Delete variant?')) return;
      await api(`/api/variants/${vid}`, { method: 'DELETE' });
      await selectAsset(a.id);
    });
  });
}

function renderPreview(a) {
  let preview = '';
  if (a.kind === 'token') {
    const isColor = (a.value ?? '').match(/^#|rgb|hsl|var\(/);
    const swatch = isColor
      ? `<div class="token-color" style="background: ${escapeHtml(a.value ?? 'transparent')}"></div>`
      : `<div class="token-color" style="background: var(--surface-2); display: grid; place-items: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--ink-muted)">value</div>`;
    preview = `
      <div class="preview-frame">
        <div class="token-swatch">
          ${swatch}
          <div class="token-info">
            <code>${escapeHtml(a.name)}</code>
            <div class="value">${escapeHtml(a.value ?? '—')}</div>
            <div class="value" style="margin-top: 8px;">Computed: <span style="color: ${escapeHtml(a.value ?? 'inherit')}">${escapeHtml(a.value ?? '')}</span></div>
          </div>
        </div>
      </div>
    `;
  } else if (a.kind === 'css') {
    if (a.previewHtml) {
      preview = `<div class="preview-frame">${a.previewHtml}</div>`;
    } else {
      const cls = a.name.replace(/^\./, '');
      preview = `
        <div class="preview-frame">
          <div class="${cls}" style="padding: 8px;">${escapeHtml(a.name)} sample content</div>
        </div>
        <p style="font-size: 11px; color: var(--ink-muted); margin-top: 8px;">
          ⚠ Nessun template handcrafted in <code>templates.mjs</code>. Render fallback minimo.
          Considera aggiungere un Variant con preview HTML personalizzato o estendere templates.mjs.
        </p>
      `;
    }
  } else if (a.kind === 'react' || a.kind === 'widget') {
    const sbUrl = `${STORYBOOK_URL}/?path=/story/${encodeURIComponent(a.name.toLowerCase())}`;
    preview = `
      <div class="preview-frame" style="min-height: 240px;">
        <div style="text-align: center; padding: 40px 20px; color: var(--ink-muted)">
          <div style="font-size: 48px; color: var(--accent); margin-bottom: 16px">⬡</div>
          <h3 style="font-size: 14px; margin: 0 0 8px;">${escapeHtml(a.name)}</h3>
          <p style="font-size: 11px; margin: 4px 0;">React component — apri in Storybook per anteprima interattiva</p>
          <a href="${sbUrl}" target="_blank" class="btn btn-primary" style="margin-top: 12px; display: inline-block; text-decoration: none">Apri in Storybook ↗</a>
          <p style="font-size: 10px; color: var(--ink-tertiary); margin-top: 16px; font-family: 'JetBrains Mono', monospace">
            Storybook: ${STORYBOOK_URL} (cd packages/ui && npm run storybook)
          </p>
        </div>
      </div>
    `;
  }
  return preview;
}

function renderMetaForm(a) {
  return `
    <form id="meta-form">
      <div class="field-grid">
        <div class="label">Name</div>
        <div class="value"><input name="name" value="${escapeAttr(a.name)}" /></div>
        <div class="label">Description</div>
        <div class="value"><textarea name="description" rows="3">${escapeHtml(a.description ?? '')}</textarea></div>
        <div class="label">Category</div>
        <div class="value"><input name="category" value="${escapeAttr(a.category ?? '')}" /></div>
        <div class="label">Subcategory</div>
        <div class="value"><input name="subcategory" value="${escapeAttr(a.subcategory ?? '')}" /></div>
        <div class="label">Source path</div>
        <div class="value"><input name="sourcePath" value="${escapeAttr(a.sourcePath ?? '')}" /></div>
        <div class="label">Source line</div>
        <div class="value"><input name="sourceLine" type="number" value="${a.sourceLine ?? ''}" /></div>
        <div class="label">Import path</div>
        <div class="value"><input name="importPath" value="${escapeAttr(a.importPath ?? '')}" /></div>
        <div class="label">Value</div>
        <div class="value"><input name="value" value="${escapeAttr(a.value ?? '')}" /></div>
        <div class="label">Notes</div>
        <div class="value"><textarea name="notes" rows="3">${escapeHtml(a.notes ?? '')}</textarea></div>
      </div>
      <div class="action-bar">
        <button type="submit" class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-ghost" id="btn-delete">🗑 Delete asset</button>
      </div>
    </form>
  `;
}

function renderVariants(a) {
  const list = a.variants
    .map(
      (v) => `
      <div class="variant-row">
        <div style="min-width: 0">
          <span class="name">${escapeHtml(v.name)}</span>
          ${v.modifier ? `<span class="modifier">${escapeHtml(v.modifier)}</span>` : ''}
          ${v.notes ? `<div style="font-size: 11px; color: var(--ink-muted); margin-top: 4px;">${escapeHtml(v.notes)}</div>` : ''}
          ${v.previewHtml ? `<div style="margin-top: 10px; padding: 12px; background: var(--surface-2); border: 1px dashed var(--rule); border-radius: 4px; font-size: 12px;">${v.previewHtml}</div>` : ''}
        </div>
        <button class="delete-btn variant-delete" data-id="${v.id}">Del</button>
      </div>`
    )
    .join('');
  return `
    <div class="variant-list">${list || '<p style="color: var(--ink-muted); font-size: 12px;">Nessuna variante. Aggiungine una per varianti CSS modifier o stati React.</p>'}</div>
    <div class="action-bar">
      <button class="btn btn-primary" id="btn-add-variant">+ Add variant</button>
    </div>
  `;
}

function renderCode(a) {
  let snippets = '';
  if (a.kind === 'token') {
    snippets = `<div class="code-block">/* CSS variable */\n${a.name}: ${a.value ?? '/* value */'};\n\n/* Usage */\ncolor: var(${a.name});</div>`;
  } else if (a.kind === 'css') {
    const cls = a.name.replace(/^\./, '');
    snippets = `<div class="code-block">&lt;div class="${cls}"&gt;…&lt;/div&gt;</div>`;
  } else if (a.kind === 'react') {
    snippets = `<div class="code-block">import { ${a.name} } from '${a.importPath ?? '@heuresys/ui'}';\n\n&lt;${a.name} /&gt;</div>`;
  } else {
    snippets = `<div class="code-block">import ${a.name} from '${a.importPath ?? '@/components'}';\n\n&lt;${a.name} /&gt;</div>`;
  }
  return snippets;
}

function renderSubElements(subs) {
  if (!subs || !subs.length) {
    return `<p style="color: var(--ink-muted); font-size: 12px;">Nessun sub-element documentato. Sub-elements sono selettori CSS nested che vivono solo all'interno del wrapper parent (es. <code>.tenant-card .row .lbl</code>) e NON sono asset autonomi del catalogo.</p>`;
  }
  const rows = subs
    .map(
      (s) => `
      <div class="variant-row">
        <div>
          <code style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent)">${escapeHtml(s)}</code>
          <div style="font-size: 11px; color: var(--ink-muted); margin-top: 4px;">Nested selector — non è asset autonomo. Vive sotto il wrapper.</div>
        </div>
      </div>`
    )
    .join('');
  return `<div class="variant-list">${rows}</div>
    <p style="color: var(--ink-tertiary); font-size: 11px; margin-top: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 0.5px">↩ ${subs.length} nested selectors. Modificali nella canonical CSS per cambiare il comportamento del wrapper.</p>`;
}

function renderBehavior(b) {
  if (!b) {
    return `<p style="color: var(--ink-muted); font-size: 12px;">Nessun comportamento dichiarato per questo asset (no hover/active/animation/transition specificato nel catalog).</p>`;
  }
  const fields = [
    ['hover', 'Hover state'],
    ['active', 'Active/selected state'],
    ['focus', 'Focus state (a11y)'],
    ['transitions', 'CSS transitions'],
    ['animations', '@keyframes animations'],
    ['media', 'Responsive breakpoint'],
    ['notes', 'Notes'],
  ];
  const out = fields
    .map(([key, label]) => {
      const val = b[key];
      if (!val) return '';
      const display = Array.isArray(val) ? val.join(' · ') : String(val);
      return `<div class="field-grid"><div class="label">${label}</div><div class="value" style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ink-soft)">${escapeHtml(display)}</div></div>`;
    })
    .filter(Boolean)
    .join('');
  return out || `<p style="color: var(--ink-muted); font-size: 12px;">Behavior payload vuoto.</p>`;
}

function renderTokens(tokens) {
  if (!tokens || !tokens.length) {
    return `<p style="color: var(--ink-muted); font-size: 12px;">Nessun design token documentato per questo asset.</p>`;
  }
  const rows = tokens
    .map(
      (t) => `
      <div class="variant-row">
        <div>
          <code style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent)">${escapeHtml(t)}</code>
          <span class="token-color" style="display:inline-block;width:14px;height:14px;border-radius:3px;margin-left:8px;background:var(${escapeAttr(t)});vertical-align:middle;border:1px solid var(--rule)"></span>
          <span style="font-size: 11px; color: var(--ink-muted); margin-left: 6px;font-family:'JetBrains Mono',monospace">var(${escapeHtml(t)})</span>
        </div>
      </div>`
    )
    .join('');
  return `<div class="variant-list">${rows}</div>
    <p style="color: var(--ink-tertiary); font-size: 11px; margin-top: 12px; font-family: 'JetBrains Mono', monospace">↩ ${tokens.length} CSS variables. Cambia in <code>active-theme.css</code> per re-themare l'asset.</p>`;
}

function renderHistory(a) {
  if (!a.promotionLogs.length) {
    return '<p style="color: var(--ink-muted); font-size: 12px;">Nessun audit log.</p>';
  }
  const rows = a.promotionLogs
    .map(
      (l) => `
      <div class="log-row">
        <span class="ts">${new Date(l.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</span>
        <span class="action">${escapeHtml(l.action)}</span>
        <span>${escapeHtml(l.notes ?? '')}</span>
      </div>`
    )
    .join('');
  return `<div class="log-list">${rows}</div>`;
}

// ========== ACTIONS ==========
async function promoteToggle(id) {
  try {
    await api(`/api/assets/${id}/promote`, { method: 'POST', body: JSON.stringify({}) });
    toast('Promotion toggled');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deprecateToggle(id) {
  try {
    await api(`/api/assets/${id}/deprecate`, { method: 'POST', body: JSON.stringify({}) });
    toast('Deprecation toggled');
    await load();
  } catch (e) {
    toast(e.message, 'error');
  }
}

function openVariantModal(assetId) {
  const dlg = $('#variant-modal');
  $('#variant-form').reset();
  $('#variant-form [name=assetId]').value = assetId;
  dlg.showModal();
}

// ========== EVENTS ==========
$('#search').addEventListener(
  'input',
  debounce(async (e) => {
    state.filter.q = e.target.value;
    state.assets = await fetchAssets();
    renderSidebar();
  }, 200)
);

$('#kind-filter').addEventListener('change', async (e) => {
  state.filter.kind = e.target.value;
  state.assets = await fetchAssets();
  renderSidebar();
});

$$('.filter-pills .filter-pill').forEach((btn) => {
  btn.addEventListener('click', async () => {
    $$('.filter-pills .filter-pill').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.filter.promoted = btn.dataset.filter;
    state.assets = await fetchAssets();
    renderSidebar();
  });
});

$('#btn-new').addEventListener('click', () => $('#new-modal').showModal());
$('#new-cancel').addEventListener('click', () => $('#new-modal').close());
$('#variant-cancel').addEventListener('click', () => $('#variant-modal').close());

$('#new-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  for (const k of Object.keys(data)) {
    if (data[k] === '') data[k] = null;
  }
  try {
    const created = await api('/api/assets', { method: 'POST', body: JSON.stringify(data) });
    $('#new-modal').close();
    toast(`Created: ${created.name}`);
    e.target.reset();
    await load();
    await selectAsset(created.id);
  } catch (e) {
    toast(`Create error: ${e.message}`, 'error');
  }
});

$('#variant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  data.assetId = Number(data.assetId);
  for (const k of Object.keys(data)) {
    if (data[k] === '') data[k] = null;
  }
  data.assetId = data.assetId ?? Number(fd.get('assetId'));
  try {
    await api('/api/variants', { method: 'POST', body: JSON.stringify(data) });
    $('#variant-modal').close();
    toast('Variant created');
    if (state.selectedId) await selectAsset(state.selectedId);
  } catch (e) {
    toast(`Variant error: ${e.message}`, 'error');
  }
});

$('#btn-bootstrap').addEventListener('click', async () => {
  if (!confirm('Re-importa tutti gli asset dai sorgenti? (preserva flag manuali esistenti)'))
    return;
  try {
    toast('Re-importing…');
    const r = await api('/api/bootstrap', { method: 'POST', body: '{}' });
    toast('Bootstrap done');
    console.log(r.output);
    await load();
  } catch (e) {
    toast(`Bootstrap error: ${e.message}`, 'error');
  }
});

$('#btn-theme').addEventListener('click', () => {
  const cur = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = cur === 'dark' ? 'light' : 'dark';
});

// ========== UTILS ==========
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

// ========== START ==========
load();
