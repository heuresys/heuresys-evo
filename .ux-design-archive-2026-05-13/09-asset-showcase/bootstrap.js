/**
 * Bootstrap inventory parser — popola SQLite con tutti gli asset disponibili nel monorepo.
 * Idempotente: re-run preserva flag manuali (promoted, deprecated, notes, description user-edited).
 *
 * Sorgenti:
 *   1. services/app/src/styles/active-theme.css      → kind=token (~117)
 *   2. services/app/src/styles/dashboard-brand.css   → kind=css   (~103)
 *   3. packages/ui/src/components/**.tsx             → kind=react (~96)
 *   4. services/app/src/components/**.tsx            → kind=widget (~24)
 *   5. docs/30-developer/brand-dashboard-catalog.md  → flag promoted=true
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from './prisma/generated/client/index.js';
import { previewFor, variantsFor, mockupVariantsFor } from './templates.mjs';

// ========== MOCKUP-DRIVEN PROMOTION SETS (L46) ==========
// Universal chrome cross-role: header/footer/sidebar shell standardizzato per
// TUTTE le dashboard di ruolo. Diventa lo scheletro stabile.
const CHROME_UNIVERSAL_NAMES = new Set([
  '.nav-bar',
  '.wordmark',
  '.wordmark-sm',
  '.wordmark-foot',
  '.wordmark-original',
  '.theme-toggle-btn',
  '.sidebar',
  '.sidebar-top',
  '.sidebar-toggle',
  '.tenant-mini',
  '.sidebar-section',
  '.sidebar-link',
  '.user-card',
  '.app-footer',
  '.workspace',
  '.ws-header',
  '.scope-pill',
  '.label-pill',
]);

// L47: Body asset map per dashboardCode — sostituisce ORG_SYSTEMS_BODY semplice
// set. Ogni dashboard ha il suo set di body wrapper assets canonici.
const BODY_BY_DASHBOARD = {
  org_systems_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.section-head',
    '.tenant-grid',
    '.tenant-card',
    '.tag',
    '.double-split',
    '.panel',
    '.panel-head',
    '.matrix-wrap',
    '.int-row',
    '.metrics-grid',
    '.metric-card',
    '.audit-list',
    '.audit-row',
    '.ws-footer',
    '.tenant-pill',
    '.bar-track',
  ]),
  cross_tenant_overview_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.section-head',
    '.tenant-grid',
    '.tenant-card',
    '.tag',
    '.panel',
    '.panel-head',
    '.double-split',
    '.gauge-grid',
    '.gauge-card',
    '.int-row',
    '.ws-footer',
    // L47 NEW
    '.chart-wrap',
    '.chart-legend',
  ]),
  tenant_owner_overview_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.section-head',
    '.panel',
    '.panel-head',
    '.double-split',
    '.comp-grid',
    '.comp-card',
    '.bar-track',
    '.bar-fill',
    // L47 NEW
    'table.dept',
    '.gauge-wrap',
    '.gauge-ring',
    '.succession-row',
  ]),
  hr_director_overview_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.main-split',
    '.skill-gap',
    '.filter-pill',
    '.pill',
    'table.dense',
    '.gap-bar',
    '.activity',
    '.section-head',
    '.succession-grid',
    '.succession-card',
  ]),
  skills_heatmap_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.filter-bar',
    '.filter-pill',
    '.heatmap-wrap',
    '.heatmap-grid',
    '.heatmap-cell',
    '.heatmap-row-label',
    '.heatmap-col-header',
    '.bottom-split',
    '.panel',
    '.panel-head',
    '.histogram',
    '.histo-bar',
    '.crit-row',
  ]),
  capability_graph_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.filter-pill',
    '.pill',
    // L47 NEW
    '.kg-split',
    '.kg-canvas',
    '.kg-legend',
    '.ontology-list',
    '.ont-row',
    '.top-entities',
    '.density-bar',
    '.esco-sync',
    '.sync-grid',
    '.sync-stat',
  ]),
  employee_journey_v2: new Set([
    '.panel',
    '.panel-head',
    // L47 NEW
    '.profile-hero',
    '.pbadge',
    '.arc',
    '.arc-line',
    '.arc-grid',
    '.arc-event',
    '.split-panels',
    '.skill-chart-svg',
    '.legend-row',
    '.radar-table',
    '.bridge-grid',
    '.bridge-card',
    '.score-bar',
  ]),
  process_recruiting_funnel_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.panel',
    '.panel-head',
    '.ws-footer',
    // L47 NEW
    '.funnel',
    '.funnel-stage',
    '.bottleneck',
  ]),
  process_onboarding_flow_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.panel',
    '.panel-head',
    '.ws-footer',
    // L47 NEW
    '.kanban',
    '.kanban-col',
    '.kanban-card',
    '.milestone-grid',
    '.milestone',
  ]),
  process_performance_cycle_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.panel',
    '.panel-head',
    '.ws-footer',
    // L47 NEW
    '.okr-row',
    '.review-grid',
    '.review-card',
    '.review-stat',
  ]),
  process_learning_paths_v2: new Set([
    '.kpi-ring',
    '.kpi-card',
    '.panel',
    '.panel-head',
    '.ws-footer',
    // L47 NEW
    '.path-row',
    '.bridge',
  ]),
};

// Reverse lookup: asset name → first dashboardCode che lo contiene (priorità: org-systems → cross-tenant → tenant-owner → hr-director → skills-heatmap → capability-graph → employee-journey → 4 process)
function dashboardCodeFor(name) {
  for (const [code, set] of Object.entries(BODY_BY_DASHBOARD)) {
    if (set.has(name)) return code;
  }
  return null;
}

const ORG_SYSTEMS_MOCKUP_PATH_L46 = '.ux-design/06-mockups/dashboards/org-systems.html';
const MOCKUP_SOURCE_BY_DASHBOARD = {
  org_systems_v2: '.ux-design/06-mockups/dashboards/org-systems.html',
  cross_tenant_overview_v2: '.ux-design/06-mockups/dashboards/cross-tenant-overview.html',
  tenant_owner_overview_v2: '.ux-design/06-mockups/dashboards/tenant-owner-overview.html',
  hr_director_overview_v2: '.ux-design/06-mockups/dashboards/hr-director-overview.html',
  skills_heatmap_v2: '.ux-design/06-mockups/dashboards/skills-heatmap.html',
  capability_graph_v2: '.ux-design/06-mockups/dashboards/capability-graph.html',
  employee_journey_v2: '.ux-design/06-mockups/dashboards/employee-journey.html',
  process_recruiting_funnel_v2: '.ux-design/06-mockups/dashboards/process-recruiting-funnel.html',
  process_onboarding_flow_v2: '.ux-design/06-mockups/dashboards/process-onboarding-flow.html',
  process_performance_cycle_v2: '.ux-design/06-mockups/dashboards/process-performance-cycle.html',
  process_learning_paths_v2: '.ux-design/06-mockups/dashboards/process-learning-paths.html',
};

// Behaviors per asset wrapper (hover/active/animation/transition/focus).
const BEHAVIORS = {
  '.nav-bar': {
    transitions: ['border-color 0.15s'],
    notes: '2px accent line bottom (0.5 opacity)',
  },
  '.theme-toggle-btn': {
    hover: 'invert bg/color',
    transitions: ['background 0.15s', 'color 0.15s'],
  },
  '.sidebar-toggle': {
    hover: 'border-color → accent',
    transitions: ['transform 0.2s'],
    notes: 'rotate icon on collapse',
  },
  '.sidebar-link': {
    hover: 'bg → surface-2',
    active: 'bg → surface-3, border-left brand-blue 2px',
    transitions: ['background 0.1s'],
  },
  '.sidebar-section': { animations: ['chevron rotate 0.2s ease on collapse'] },
  '.tenant-card': {
    transitions: ['border-color 0.15s'],
    notes: 'platform variant has accent border',
  },
  '.btn': {
    hover: 'opacity / brightness change',
    transitions: ['all 0.15s'],
    focus: 'outline accent',
  },
  '.btn-primary': { hover: 'accent-hover bg', focus: 'outline accent 2px' },
  '.btn-ghost': { hover: 'border + bg → surface-2' },
  '.filter-pill': { hover: 'border → accent', active: 'bg accent-soft + color accent' },
  '.scope-pill': { notes: 'static, no hover. Has glow on .dot' },
  '.app-footer': {
    notes: '2px accent top line (::before, 0.3 opacity)',
    media: '@media (max-width: 800px) hide ctx-item',
  },
  '.activity .live': { animations: ['pulse 2s ease-in-out infinite'] },
  '.scope-pill .dot': { animations: ['glow accent box-shadow 8px 0.6 opacity'] },
  '.tenant-card .health .dot': { animations: ['glow box-shadow 8px'] },
  '.audit-list': { notes: 'overflow-y auto, max-height 380px, custom scrollbar' },
  '.heatmap-cell': { transitions: ['background 0.2s'] },
  // L47 additions
  '.chart-wrap': { notes: 'SVG container, height 220px, padding 20px' },
  '.chart-legend': { notes: 'flex layout, 4 swatches gap 18px' },
  '.gauge-wrap': { notes: 'centered single-gauge container, padding 20px' },
  '.gauge-ring': {
    transitions: ['stroke-dashoffset 0.5s'],
    notes: 'SVG circle 160×160 with absolute .gauge-num overlay',
  },
  'table.dept': { notes: 'department breakdown grid, hover row bg surface-2' },
  '.succession-row': {
    transitions: ['border-color 0.15s'],
    notes: 'row-based variant of .succession-card (3-col grid 36/1fr/80)',
  },
  '.kg-canvas': { notes: 'SVG topology container, position relative for .kg-legend overlay' },
  '.ont-row': {
    hover: 'bg surface-2',
    transitions: ['background 0.1s'],
    notes: 'capability ontology row, click cursor pointer',
  },
  '.esco-sync': { notes: 'ESCO sync status panel, 3-col stat grid' },
  '.profile-hero': { notes: '3-col grid (96px / 1fr / auto), accent glow ::before pseudo' },
  '.arc': { notes: 'career timeline 5-stage horizontal' },
  '.arc-line': { notes: 'progress bar 65% accent fill via ::after' },
  '.arc-event': {
    animations: ['box-shadow glow on .done/.current dot'],
    notes: '5-stage milestone events past/current/future',
  },
  '.bridge-card': {
    hover: 'border-color → accent',
    transitions: ['border-color 0.15s'],
    notes: 'career bridge candidate card with readiness ring',
  },
  '.funnel-stage': {
    transitions: ['width 0.5s ease on .bar-fill'],
    notes: 'recruiting stage row 4-col grid',
  },
  '.bottleneck': { notes: 'warn-tinted callout box, border-left 3px semantic-warning' },
  '.kanban-card': {
    transitions: ['border-color 0.15s'],
    notes: 'kanban draggable card (no JS in mockup)',
  },
  '.milestone': {
    notes: 'border-left 3px color-coded by state (.done success / .due warn / default brand-blue)',
  },
  '.okr-row': { transitions: ['width 0.5s on bar-fill'], notes: 'OKR progress row 3-col grid' },
  '.path-row': {
    transitions: ['width 0.5s on bar-fill'],
    notes: 'learning path enrollment row 4-col grid',
  },
};

// Color tokens per asset (CSS variables referenziate dal selector).
const COLOR_TOKENS = {
  '.nav-bar': ['--surface-1', '--rule', '--accent'],
  '.wordmark': ['--ink', '--accent'],
  '.wordmark-sm': ['--ink', '--accent', '--brand-blue'],
  '.wordmark-foot': ['--brand-blue', '--accent'],
  '.wordmark-original': ['--brand-blue', '--accent'],
  '.theme-toggle-btn': ['--ink', '--bg'],
  '.sidebar': ['--surface-1', '--rule', '--rule-strong'],
  '.sidebar-top': ['--rule'],
  '.sidebar-toggle': ['--rule-strong', '--ink-soft', '--accent'],
  '.tenant-mini': ['--surface-2', '--rule', '--accent', '--bg', '--brand-blue'],
  '.sidebar-section': ['--ink-tertiary', '--ink-soft'],
  '.sidebar-link': ['--ink-soft', '--ink', '--surface-2', '--surface-3', '--brand-blue'],
  '.user-card': ['--surface-2', '--rule', '--accent', '--bg', '--brand-blue'],
  '.app-footer': [
    '--surface-1',
    '--rule',
    '--accent',
    '--ink-muted',
    '--ink-soft',
    '--semantic-success',
    '--semantic-info',
    '--semantic-warning',
  ],
  '.workspace': [],
  '.ws-header': ['--rule', '--ink-muted', '--ink', '--accent'],
  '.scope-pill': ['--surface-2', '--rule-strong', '--accent'],
  '.label-pill': ['--surface-2', '--ink-soft'],
  '.kpi-ring': [],
  '.kpi-card': ['--surface-1', '--rule', '--ink-muted', '--ink', '--accent'],
  '.section-head': ['--ink', '--accent', '--ink-muted'],
  '.tenant-grid': [],
  '.tenant-card': [
    '--surface-1',
    '--rule',
    '--accent',
    '--accent-soft',
    '--ink',
    '--ink-muted',
    '--semantic-success',
    '--semantic-warning',
  ],
  '.tag': ['--accent', '--surface-2', '--rule-strong'],
  '.double-split': [],
  '.panel': ['--surface-1', '--rule'],
  '.panel-head': ['--rule', '--ink', '--accent', '--ink-muted'],
  '.matrix-wrap': ['--surface-1', '--rule'],
  '.int-row': ['--surface-2', '--rule', '--ink', '--ink-muted'],
  '.metrics-grid': [],
  '.metric-card': ['--surface-1', '--rule', '--ink-muted', '--ink'],
  '.audit-list': [],
  '.audit-row': ['--ink-muted', '--ink', '--accent', '--ink-soft'],
  '.ws-footer': ['--rule', '--ink-muted'],
  '.tenant-pill': ['--surface-2', '--rule-strong', '--accent'],
  '.bar-track': ['--surface-3', '--rule'],
  '.btn': ['--accent', '--ink-soft', '--rule-strong'],
  '.pill': ['--surface-2', '--ink-soft', '--rule-strong'],
  // L47 additions
  '.chart-wrap': ['--rule', '--ink-muted'],
  '.chart-legend': ['--ink-soft', '--rule'],
  '.gauge-wrap': ['--ink', '--ink-muted', '--ink-soft', '--accent'],
  '.gauge-ring': ['--rule', '--accent', '--ink'],
  'table.dept': [
    '--surface-2',
    '--rule',
    '--ink',
    '--ink-muted',
    '--accent',
    '--semantic-success',
    '--semantic-warning',
  ],
  '.succession-row': ['--surface-2', '--rule', '--accent', '--ink', '--ink-muted', '#ffffff'],
  '.kg-split': [],
  '.kg-canvas': ['--surface-1', '--rule', '--ink', '--accent', '--ink-muted'],
  '.kg-legend': ['--surface-1', '--rule', '--ink-soft'],
  '.ontology-list': ['--surface-1', '--rule', '--ink', '--ink-muted'],
  '.ont-row': ['--rule', '--surface-2', '--ink', '--ink-muted', '--accent'],
  '.top-entities': ['--surface-1', '--rule'],
  '.density-bar': ['--surface-3', '--accent'],
  '.esco-sync': ['--surface-1', '--rule', '--ink', '--accent'],
  '.sync-grid': [],
  '.sync-stat': ['--surface-2', '--rule', '--ink-muted', '--ink', '--semantic-success'],
  '.pill-process': ['--cap-process'],
  '.pill-structure': ['--cap-structure'],
  '.pill-role': ['--accent-soft', '--accent'],
  '.pill-competence': ['--cap-competence'],
  '.pill-performance': ['--cap-performance'],
  '.profile-hero': ['--surface-1', '--rule', '--accent', '--ink', '--ink-muted'],
  '.pbadge': ['--accent-soft', '--accent', '--surface-2', '--rule-strong', '--semantic-success'],
  '.arc': [],
  '.arc-line': ['--rule-strong', '--accent'],
  '.arc-grid': [],
  '.arc-event': ['--surface-1', '--rule-strong', '--accent', '--ink', '--ink-muted'],
  '.split-panels': [],
  '.skill-chart-svg': [],
  '.legend-row': ['--rule', '--ink-soft'],
  '.radar-table': ['--ink', '--ink-muted'],
  '.bridge-grid': [],
  '.bridge-card': [
    '--surface-2',
    '--rule',
    '--accent',
    '--ink',
    '--ink-muted',
    '--surface-3',
    '--semantic-warning',
  ],
  '.score-bar': ['--surface-3', '--accent'],
  '.funnel': [],
  '.funnel-stage': ['--rule', '--surface-2', '--accent', '--ink', '--ink-muted'],
  '.bottleneck': ['--semantic-warning', '--ink-soft'],
  '.kanban': [],
  '.kanban-col': ['--surface-2', '--rule', '--ink-muted', '--accent'],
  '.kanban-card': ['--surface-1', '--rule', '--accent', '--ink', '--ink-muted'],
  '.milestone-grid': [],
  '.milestone': [
    '--surface-2',
    '--brand-blue',
    '--semantic-success',
    '--semantic-warning',
    '--accent',
    '--ink',
    '--ink-muted',
  ],
  '.okr-row': ['--rule', '--surface-2', '--accent', '--ink', '--ink-muted'],
  '.review-grid': [],
  '.review-card': ['--surface-2', '--ink', '--ink-muted'],
  '.review-stat': ['--ink', '--ink-muted'],
  '.path-row': ['--rule', '--surface-2', '--accent', '--ink', '--ink-muted', '--semantic-success'],
  '.bridge': [],
};

// Sub-elements documentation (nested selectors NOT promoted as autonomous assets).
const SUB_ELEMENTS = {
  '.nav-bar': ['.nav-left', '.nav-right', '::after'],
  '.wordmark': ['.y'],
  '.wordmark-sm': ['.y'],
  '.wordmark-foot': ['.y'],
  '.wordmark-original': ['.y'],
  '.sidebar': ['.sidebar-top', '.sidebar-section', '.user-card', '::-webkit-scrollbar'],
  '.sidebar-top': ['.sidebar-toggle', '.tenant-mini'],
  '.tenant-mini': ['.t-avatar', '.t-avatar.bordered', '.t-info', '.t-name', '.t-meta'],
  '.sidebar-section': ['h4', '.chev', '.sidebar-link'],
  '.sidebar-link': ['.glyph', '.num', '.active state'],
  '.user-card': ['.avatar', '.avatar.bordered-inverse', '.info', '.name', '.role'],
  '.app-footer': [
    '.ft-static',
    '.copyright',
    '.socials',
    '.social-link',
    '.ft-dynamic',
    '.ctx-item',
    '.ft-dot',
    '::before',
  ],
  '.ws-header': ['.title-block', '.breadcrumb', 'h1', '.actions', '.scope-pill'],
  '.scope-pill': ['.dot'],
  '.kpi-card': ['.kpi-label', '.kpi-num', '.kpi-sub', '.kpi-foot', '.kpi-icon', '.delta'],
  '.section-head': ['h2', 'em', '.meta'],
  '.tenant-card': [
    '.tag',
    'h3',
    '.tid',
    '.row',
    '.row .lbl',
    '.row .val',
    '.row .val.success',
    '.health',
    '.health .dot',
    '.health .dot.warn',
  ],
  '.panel': ['.panel-head'],
  '.panel-head': ['h2', '.meta'],
  '.matrix-wrap': ['table.rbac'],
  '.int-row': ['.icon', '.icon svg', '.info', '.info .name', '.info .meta', '.pill (status)'],
  '.metric-card': ['.lbl', '.val', '.val .unit', '.sparkline'],
  '.audit-list': ['.audit-row'],
  '.audit-row': ['.ts', '.what', '.what strong', '.what .accent', '.actor'],
  // L47 additions
  '.chart-wrap': ['svg'],
  '.chart-legend': ['.lg', '.lg .swatch'],
  '.gauge-wrap': ['.gauge-label', '.gauge-sub', '.gauge-ring'],
  '.gauge-ring': ['svg', '.gauge-num'],
  'table.dept': [
    'th',
    'th:first-child',
    'td',
    'td:first-child',
    '.bar-cell',
    '.bar-track',
    '.bar-fill',
    '.bar-fill.fill-ok',
    '.bar-fill.fill-warn',
  ],
  '.succession-row': [
    '.pic',
    '.who',
    '.who .name',
    '.who .meta',
    '.rating',
    '.rating .num',
    '.rating .lbl',
  ],
  '.kg-canvas': ['.kg-canvas-head', 'h2', 'h2 em', '.scope'],
  '.kg-legend': ['.lg-row', '.dot'],
  '.ontology-list': ['.head', '.head h2', '.head .count', '.ont-row'],
  '.ont-row': [
    '.glyph-box',
    '.glyph-box svg',
    '.info',
    '.info .name',
    '.info .desc',
    '.stat',
    '.stat .pct',
  ],
  '.density-bar': ['.bar', '.bar-fill'],
  '.esco-sync': ['h2', 'h2 em', '.sync-grid'],
  '.sync-stat': ['.lbl', '.val', '.sub', '.sub strong'],
  '.profile-hero': [
    '.pic',
    '.meta',
    '.meta h2',
    '.meta .sub',
    '.badges',
    '.stats',
    '.stats .stat',
    '.stats .stat .lbl',
    '.stats .stat .val',
    '::before',
  ],
  '.pbadge': ['.role', '.dept', '.tenure'],
  '.arc': ['.arc-line', '.arc-grid', '.arc-event'],
  '.arc-line': ['::after'],
  '.arc-event': ['.when', '.dot', '.dot::after', '.role-name', '.role-meta', '.done', '.current'],
  '.bridge-card': [
    '.role-name',
    '.esco-id',
    '.readiness',
    '.readiness .pct',
    '.readiness .ring',
    '.readiness .ring-fill',
    '.gap-list',
    '.gap-list li',
    '.gap-list li .what',
    '.gap-list li .miss',
    '.meta-row',
  ],
  '.score-bar': ['.bar', '.bar-fill'],
  '.funnel-stage': ['.label', '.label .meta', '.bar-bg', '.bar-fill', '.count', '.ageing'],
  '.bottleneck': ['strong', 'p'],
  '.kanban-col': ['h3', 'h3 .count'],
  '.kanban-card': ['.name', '.meta', '.progress', '.progress-fill'],
  '.milestone': ['h4', '.day', 'p', '.done', '.due'],
  '.okr-row': ['.obj', '.obj .meta', '.bar-bg', '.bar-fill', '.pct'],
  '.review-card': ['h4', '.meta', '.review-stat'],
  '.review-stat': ['.lbl', '.v'],
  '.path-row': ['.name', '.name .meta', '.bar-bg', '.bar-fill', '.count', '.uplift'],
  '.bridge': ['.bridge-card'],
};

const ORG_SYSTEMS_MOCKUP_PATH = '.ux-design/06-mockups/dashboards/org-systems.html';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const prisma = new PrismaClient();

function readSrc(rel) {
  return fs.readFileSync(path.join(PROJECT_ROOT, rel), 'utf-8');
}

function relFrom(absPath) {
  return path.relative(PROJECT_ROOT, absPath).replace(/\\/g, '/');
}

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(p, cb);
    else cb(p);
  }
}

function firstJsDoc(content) {
  const m = content.match(/\/\*\*([\s\S]+?)\*\//);
  if (!m) return '';
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')
    .slice(0, 280);
}

// ========== TOKEN PARSER (active-theme.css) ==========
function detectTokenCategory(name) {
  if (name === 'bg' || name.startsWith('surface')) return 'Surface';
  if (name.startsWith('ink')) return 'Ink';
  if (name.startsWith('accent')) return 'Accent';
  if (name.startsWith('rule')) return 'Rule';
  if (name.startsWith('brand-')) return 'Brand';
  if (name.startsWith('semantic-')) return 'Semantic';
  if (name.startsWith('cap-')) return 'Capability palette';
  if (name.startsWith('role-')) return 'Role badge';
  if (name.startsWith('sp-')) return 'Spacing';
  if (name.startsWith('radius')) return 'Radius';
  if (name.startsWith('logo') || name.includes('wordmark')) return 'Logo';
  if (name.includes('glass') || name.includes('aurora') || name === 'glow') return 'Effects';
  if (name === 'token-label') return 'Misc';
  return 'Misc';
}

function parseTokens() {
  const content = readSrc('services/app/src/styles/active-theme.css');
  const seen = new Map();
  const lines = content.split('\n');
  const tokenRegex = /^\s*--([a-z][a-z0-9-]*)\s*:\s*([^;]+);/i;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(tokenRegex);
    if (!m) continue;
    const name = `--${m[1]}`;
    if (seen.has(name)) continue;
    seen.set(name, {
      name,
      kind: 'token',
      category: detectTokenCategory(m[1]),
      value: m[2].trim(),
      sourcePath: 'services/app/src/styles/active-theme.css',
      sourceLine: i + 1,
      description: `Design token CSS variable.`,
    });
  }
  return Array.from(seen.values());
}

// ========== CSS PARSER (dashboard-brand.css) ==========
function detectCssCategory(name) {
  if (name === 'pill' || name.startsWith('pill-')) return 'Pills';
  if (name.endsWith('-pill')) return 'Pills';
  if (name === 'btn' || name.startsWith('btn-')) return 'Buttons';
  if (name === 'theme-toggle-btn') return 'Buttons';
  if (name === 'app' || name === 'workspace' || name === 'dashboard-shell') return 'Layout';
  if (name.includes('-split')) return 'Layout';
  if (name.includes('grid') && (name.includes('split') || name === 'grid')) return 'Layout';
  if (name === 'panel' || name === 'matrix-wrap' || name === 'skill-gap') return 'Cards';
  if (name.endsWith('-card') || name.includes('-card')) return 'Cards';
  if (name === 'profile-hero' || name.startsWith('profile-')) return 'Cards';
  if (name === 'nav-bar' || name.startsWith('nav-')) return 'Navigation';
  if (name.startsWith('sidebar')) return 'Navigation';
  if (name === 'app-footer' || name.includes('footer')) return 'Navigation';
  if (name.startsWith('ws-') || name === 'section-head' || name === 'widget-head')
    return 'Navigation';
  if (name.startsWith('table') || name === 'rbac' || name.includes('rbac')) return 'Tables';
  if (name === 'audit-list' || name.startsWith('audit-')) return 'Tables';
  if (name === 'activity' || name.startsWith('activity-')) return 'Tables';
  if (name === 'int-row' || name === 'crit-row' || name.endsWith('-row')) return 'Tables';
  if (name.includes('graph') || name.includes('radar') || name.includes('arc')) return 'Charts';
  if (name.startsWith('heat-') || name.includes('heatmap')) return 'Charts';
  if (name.startsWith('histo')) return 'Charts';
  if (name.startsWith('bar') || name.startsWith('gauge') || name.startsWith('fill-')) return 'Bars';
  if (name === 'gap-bar' || name.startsWith('gap-')) return 'Bars';
  if (name.startsWith('filter')) return 'Filters';
  if (name.startsWith('wordmark') || name.startsWith('logo')) return 'Typography';
  if (name.startsWith('lvl-')) return 'Modifiers';
  if (name.startsWith('tag-') || name === 'tag') return 'Pills';
  if (name === 'pbadge' || name.startsWith('pbadge-')) return 'Pills';
  if (name === 'live' || name.includes('dot')) return 'Atoms';
  if (name.includes('career')) return 'Charts';
  if (name === 'meta-pair' || name.startsWith('meta-')) return 'Atoms';
  if (name === 'kpi-card' || name === 'gauge-card') return 'Cards';
  if (name === 'tenant-card' || name === 'tenant-grid' || name.startsWith('tenant-'))
    return 'Cards';
  if (name === 'metric-card' || name.startsWith('metric-')) return 'Cards';
  if (name.includes('comp-')) return 'Cards';
  if (name.includes('bridge-')) return 'Cards';
  if (name.includes('succession')) return 'Cards';
  if (name.includes('ont-')) return 'Tables';
  if (name === 'sparkline') return 'Charts';
  return 'Misc';
}

function parseCss() {
  const content = readSrc('services/app/src/styles/dashboard-brand.css');
  const seen = new Map();
  const lines = content.split('\n');
  const selRegex = /^\s*\.([a-z][a-z0-9_-]*)/i;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(selRegex);
    if (!m) continue;
    const name = '.' + m[1];
    if (seen.has(name)) continue;
    seen.set(name, {
      name,
      kind: 'css',
      category: detectCssCategory(m[1]),
      sourcePath: 'services/app/src/styles/dashboard-brand.css',
      sourceLine: i + 1,
      description: `Canonical CSS class. Used by brand widgets and dashboard renderer.`,
    });
  }
  return Array.from(seen.values());
}

// ========== REACT UI PARSER (packages/ui) ==========
function detectReactSubcategory(filePath) {
  const parts = filePath.split(/[\\/]/);
  const idx = parts.indexOf('components');
  if (idx >= 0 && parts.length > idx + 2) return parts[idx + 1];
  return 'core';
}

function parseReactUi() {
  const dir = path.join(PROJECT_ROOT, 'packages/ui/src/components');
  const out = [];
  walkDir(dir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;
    if (filePath.endsWith('.test.tsx') || filePath.endsWith('.stories.tsx')) return;
    const baseName = path.basename(filePath, '.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const description = firstJsDoc(content);
    out.push({
      name: baseName,
      kind: 'react',
      category: 'UI library',
      subcategory: detectReactSubcategory(filePath),
      sourcePath: relFrom(filePath),
      importPath: `@heuresys/ui`,
      description: description || `React component from packages/ui`,
    });
  });
  return out;
}

// Parse stories.tsx to extract variants
function parseReactVariants(assetMap) {
  const dir = path.join(PROJECT_ROOT, 'packages/ui/src/components');
  const variants = [];
  walkDir(dir, (filePath) => {
    if (!filePath.endsWith('.stories.tsx')) return;
    const baseName = path.basename(filePath, '.stories.tsx');
    const asset = assetMap.get(baseName);
    if (!asset) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    // Extract `export const StoryName = ...`
    const storyRegex = /^export\s+const\s+([A-Z][A-Za-z0-9_]+)\s*[:=]/gm;
    let m;
    while ((m = storyRegex.exec(content)) !== null) {
      const storyName = m[1];
      if (storyName === 'default') continue;
      variants.push({
        assetName: baseName,
        name: storyName,
        notes: `Storybook story from ${path.basename(filePath)}`,
      });
    }
  });
  return variants;
}

// ========== APP COMPONENTS PARSER ==========
function parseAppComponents() {
  const dir = path.join(PROJECT_ROOT, 'services/app/src/components');
  const out = [];
  walkDir(dir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;
    if (filePath.endsWith('.test.tsx')) return;
    const baseName = path.basename(filePath, '.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    const description = firstJsDoc(content);
    let subcategory = 'core';
    if (filePath.includes('widgets/brand')) subcategory = 'BrandWidget';
    else if (filePath.includes('widgets')) subcategory = 'Widget';
    else if (filePath.includes('app')) subcategory = 'AppShell';
    out.push({
      name: baseName,
      kind: 'widget',
      category: 'Dashboard',
      subcategory,
      sourcePath: relFrom(filePath),
      importPath: `@/components/${path
        .relative(path.join(PROJECT_ROOT, 'services/app/src/components'), filePath)
        .replace(/\\/g, '/')
        .replace(/\.tsx$/, '')}`,
      description: description || `Dashboard React component`,
    });
  });
  return out;
}

// ========== SoT CATALOG PARSER ==========
function parseSoTCatalog() {
  const content = readSrc('docs/30-developer/brand-dashboard-catalog.md');
  const promoted = new Set();
  // CSS selectors in <code>.foo</code> or `.foo`
  const cssRegex = /<code>(\.[a-z][a-z0-9_-]*)<\/code>|`(\.[a-z][a-z0-9_-]*)`/g;
  let m;
  while ((m = cssRegex.exec(content)) !== null) {
    promoted.add(m[1] || m[2]);
  }
  // CSS selectors in <code>table.foo</code> or `table.foo`
  const tableRegex = /<code>table\.([a-z][a-z0-9_-]*)<\/code>|`table\.([a-z][a-z0-9_-]*)`/g;
  while ((m = tableRegex.exec(content)) !== null) {
    promoted.add('.' + (m[1] || m[2]));
  }
  // React: BrandX names mentioned in code blocks
  const reactRegex = /<code>(Brand[A-Z][A-Za-z]*)<\/code>|`(Brand[A-Z][A-Za-z]*)`/g;
  while ((m = reactRegex.exec(content)) !== null) {
    promoted.add(m[1] || m[2]);
  }
  // Tokens: --foo references
  const tokenRegex = /<code>(--[a-z][a-z0-9-]*)<\/code>|`(--[a-z][a-z0-9-]*)`/g;
  while ((m = tokenRegex.exec(content)) !== null) {
    promoted.add(m[1] || m[2]);
  }
  return promoted;
}

// ========== UPSERT ==========
async function upsertAsset(spec, promotedNames) {
  const isInSoT = promotedNames.has(spec.name);
  // L46+L47: chrome universal + body per dashboardCode sono promoted SEMPRE (governance shift)
  const isMockupChrome = CHROME_UNIVERSAL_NAMES.has(spec.name);
  const dashboardCodeForBody = dashboardCodeFor(spec.name);
  const isMockupBody = dashboardCodeForBody !== null;
  const shouldPromote = isInSoT || isMockupChrome || isMockupBody;

  // Generate previewHtml for CSS asset using templates.mjs (idempotent)
  let previewHtml = null;
  if (spec.kind === 'css') {
    previewHtml = previewFor(spec.name);
  }

  // Mockup-driven metadata
  const chromeStandard = isMockupChrome;
  const dashboardCode = dashboardCodeForBody;
  const mockupSource = isMockupChrome
    ? ORG_SYSTEMS_MOCKUP_PATH
    : isMockupBody
      ? (MOCKUP_SOURCE_BY_DASHBOARD[dashboardCodeForBody] ?? null)
      : null;
  const behaviors = BEHAVIORS[spec.name] ? JSON.stringify(BEHAVIORS[spec.name]) : null;
  const colorTokens = COLOR_TOKENS[spec.name] ? JSON.stringify(COLOR_TOKENS[spec.name]) : null;
  const subElements = SUB_ELEMENTS[spec.name] ? JSON.stringify(SUB_ELEMENTS[spec.name]) : null;

  const existing = await prisma.asset.findUnique({ where: { name: spec.name } });
  if (existing) {
    // Re-run: aggiorna SOLO campi source-derived, preserva flag manuali utente
    await prisma.asset.update({
      where: { id: existing.id },
      data: {
        kind: spec.kind,
        category: spec.category,
        subcategory: spec.subcategory ?? existing.subcategory,
        sourcePath: spec.sourcePath,
        sourceLine: spec.sourceLine ?? existing.sourceLine,
        value: spec.value ?? existing.value,
        importPath: spec.importPath ?? existing.importPath,
        previewHtml: previewHtml ?? existing.previewHtml,
        // L46: forza promoted=true per chrome+body, preserva manual elsewhere
        promoted: shouldPromote ? true : existing.promoted,
        // chromeStandard / dashboardCode / mockupSource: deterministic da set
        chromeStandard,
        dashboardCode: dashboardCode ?? existing.dashboardCode,
        mockupSource: mockupSource ?? existing.mockupSource,
        // JSON metadata: refresh deterministico
        behaviorsJson: behaviors ?? existing.behaviorsJson,
        colorTokensJson: colorTokens ?? existing.colorTokensJson,
        subElementsJson: subElements ?? existing.subElementsJson,
        description: existing.description ?? spec.description,
      },
    });
    return { created: false, updated: true };
  } else {
    await prisma.asset.create({
      data: {
        ...spec,
        promoted: shouldPromote,
        previewHtml,
        chromeStandard,
        dashboardCode,
        mockupSource,
        behaviorsJson: behaviors,
        colorTokensJson: colorTokens,
        subElementsJson: subElements,
      },
    });
    return { created: true, updated: false };
  }
}

async function upsertCssVariants(asset) {
  // Combine generic VARIANTS (templates.mjs) + MOCKUP_DRIVEN_VARIANTS (L46)
  const variants = [...variantsFor(asset.name), ...mockupVariantsFor(asset.name)];
  let added = 0;
  for (const v of variants) {
    const existing = await prisma.variant.findFirst({
      where: { assetId: asset.id, name: v.name },
    });
    if (existing) {
      await prisma.variant.update({
        where: { id: existing.id },
        data: {
          previewHtml: v.html,
          modifier: v.modifier ?? null,
          notes: v.notes ?? existing.notes,
        },
      });
    } else {
      await prisma.variant.create({
        data: {
          assetId: asset.id,
          name: v.name,
          previewHtml: v.html,
          modifier: v.modifier ?? null,
          notes: v.notes ?? null,
        },
      });
      added++;
    }
  }
  return added;
}

async function upsertVariant(v, assetByName) {
  const asset = assetByName.get(v.assetName);
  if (!asset) return null;
  const existing = await prisma.variant.findFirst({
    where: { assetId: asset.id, name: v.name },
  });
  if (existing) return null;
  await prisma.variant.create({
    data: { assetId: asset.id, name: v.name, notes: v.notes ?? null },
  });
  return asset.id;
}

// ========== MAIN ==========
async function main() {
  console.log('[bootstrap] starting…');
  const t0 = Date.now();

  const tokens = parseTokens();
  const css = parseCss();
  const ui = parseReactUi();
  const widgets = parseAppComponents();
  const promoted = parseSoTCatalog();

  console.log(
    `[bootstrap] parsed: ${tokens.length} tokens · ${css.length} css · ${ui.length} react · ${widgets.length} widgets · ${promoted.size} SoT promoted markers`
  );

  let created = 0,
    updated = 0;
  for (const spec of [...tokens, ...css, ...ui, ...widgets]) {
    const r = await upsertAsset(spec, promoted);
    if (r.created) created++;
    if (r.updated) updated++;
  }

  // Re-fetch all assets for variant linking
  const all = await prisma.asset.findMany({ select: { id: true, name: true, kind: true } });
  const byName = new Map(all.map((a) => [a.name, a]));

  // Variants from .stories.tsx (React)
  const reactVariants = parseReactVariants(byName);
  let varCreated = 0;
  for (const v of reactVariants) {
    const r = await upsertVariant(v, byName);
    if (r) varCreated++;
  }

  // CSS variants from templates.mjs
  for (const a of all) {
    if (a.kind !== 'css') continue;
    varCreated += await upsertCssVariants(a);
  }

  // Default tags
  for (const name of ['promoted-sot', 'deprecated', 'experimental', 'post-L41', 'post-L42']) {
    await prisma.tag.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }

  const total = await prisma.asset.count();
  const promotedCount = await prisma.asset.count({ where: { promoted: true } });
  const variantCount = await prisma.variant.count();
  const dt = Math.round((Date.now() - t0) / 100) / 10;
  console.log(
    `[bootstrap] done in ${dt}s: ${created} created · ${updated} updated · ${varCreated} variants · TOTAL ${total} assets (${promotedCount} promoted) · ${variantCount} variants total`
  );

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('[bootstrap] error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
