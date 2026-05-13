/**
 * Heuresys Asset Showcase — preview HTML templates.
 *
 * Per ogni asset name (CSS class) ritorna un esempio visivo che usa la classe
 * con la struttura DOM corretta (tag + nested children + sample content).
 * Porting dal v0 static showcase 44 entries + estensioni per i 59 sub-selectors
 * non-SoT ma comunque visualizzabili.
 *
 * Per asset che richiedono varianti, esporta anche `variantsFor(name)` che
 * ritorna un array di { name, previewHtml, modifier }.
 *
 * Per React/widget: nessun render inline (link a Storybook gestito frontend).
 */

// ========== CSS TEMPLATES ==========

const CSS_TEMPLATES = {
  // ---------- §3 Layout primitives ----------
  '.dashboard-shell': () =>
    `<div style="border:2px solid var(--accent);border-radius:6px;padding:24px;display:grid;place-items:center;color:var(--ink-muted);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px">.dashboard-shell — viewport-fill wrapper</div>`,
  '.app': () =>
    `<div style="display:grid;grid-template-columns:80px 1fr;gap:8px"><div style="background:var(--surface-2);border:1px solid var(--rule);padding:14px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-soft)">sidebar 240px</div><div style="background:var(--surface-2);border:1px solid var(--rule);padding:14px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-soft)">workspace 1fr</div></div>`,
  '.workspace': () =>
    `<div style="display:grid;grid-template-rows:auto 1fr auto;gap:6px;min-height:140px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-soft)"><div style="background:var(--surface-2);border:1px solid var(--rule);padding:8px;border-radius:4px">ws-header</div><div style="background:var(--surface-2);border:1px solid var(--rule);padding:8px;border-radius:4px">view content</div><div style="background:var(--surface-2);border:1px solid var(--rule);padding:8px;border-radius:4px">ws-footer</div></div>`,
  '.main-split': () =>
    `<div class="main-split" style="margin:0"><div class="panel"><div class="widget-head">main · 2fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">contenuto principale</div></div><div class="panel"><div class="widget-head">side · 1fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">side-panel</div></div></div>`,
  '.double-split': () =>
    `<div class="double-split" style="margin:0"><div class="panel"><div class="widget-head">left · 1.4fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">primary</div></div><div class="panel"><div class="widget-head">right · 1fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">secondary</div></div></div>`,

  // ---------- §4 Navigation & chrome ----------
  '.nav-bar': () =>
    `<nav class="nav-bar" style="position:relative"><div class="nav-left"><span class="wordmark-sm">heuresys</span><span class="label-pill">DASHBOARD</span></div><div class="nav-right"><button class="theme-toggle-btn" aria-label="theme">◐</button></div></nav>`,
  '.sidebar': () =>
    `<aside class="sidebar" style="position:relative;max-height:300px;width:240px;border-right:1px solid var(--rule)"><div class="tenant-mini"><div class="ti">RB</div><div class="tn">RTL Bank</div><div class="tc">rtl-bank · active</div></div><div class="sidebar-section"><h4>Workspace</h4><a href="#" class="sidebar-link active">Dashboard</a><a href="#" class="sidebar-link">Employees</a></div><div class="user-card"><div class="ui">VC</div><div class="un">valentina.conti</div><div class="ur">HR_DIRECTOR</div></div></aside>`,
  '.sidebar-section': () =>
    `<div class="sidebar-section" style="background:var(--surface-1);border-radius:4px"><h4>WORKSPACE</h4><a href="#" class="sidebar-link active">Dashboard</a><a href="#" class="sidebar-link">Employees</a></div>`,
  '.sidebar-link': () =>
    `<div style="padding:0;background:var(--surface-1);border-radius:4px;width:200px"><a href="#" class="sidebar-link">Dashboard</a><a href="#" class="sidebar-link active">Active link</a><a href="#" class="sidebar-link">Settings</a></div>`,
  '.tenant-mini': () =>
    `<div class="tenant-mini" style="background:var(--surface-1);border-radius:6px"><div class="ti">RB</div><div class="tn">RTL Bank</div><div class="tc">rtl-bank · active</div></div>`,
  '.user-card': () =>
    `<div class="user-card" style="background:var(--surface-1);border-radius:6px"><div class="ui">VC</div><div class="un">valentina.conti</div><div class="ur">HR_DIRECTOR</div></div>`,
  '.app-footer': () =>
    `<footer class="app-footer"><div class="footer-left">© 2026 <span class="wordmark-foot">heuresys</span>.com</div><div class="footer-right"><span class="meta-pair"><span class="lbl">ENV</span> <span class="val">DEV</span></span><span class="meta-pair"><span class="lbl">ROLE</span> <span class="val">HR_DIRECTOR</span></span></div></footer>`,
  '.ws-header': () =>
    `<header class="ws-header"><div class="title-block"><div class="breadcrumb">DASHBOARD · HR_DIRECTOR</div><h1>Brand-fedele <em>dashboard</em> · DB-driven (G6)</h1></div><div class="actions"><div class="scope-pill"><span class="dot"></span><span>scope · rtl-bank</span></div></div></header>`,
  '.ws-footer': () =>
    `<footer class="ws-footer"><span>SOURCE · live · TTL 60s</span><span>view · hr_director_overview_v2</span></footer>`,
  '.section-head': () =>
    `<header class="section-head"><h2>Skill <em>matrix</em></h2><span class="meta">FUNCTIONS × SKILLS</span></header>`,
  '.widget-head': () =>
    `<div class="panel" style="max-width:360px"><div class="widget-head"><span>RBAC matrix</span><span class="label-pill">ROLE × AREA</span></div><div style="padding:14px 18px;font-size:12px;color:var(--ink-muted)">contenuto widget</div></div>`,

  // ---------- §5 Card patterns ----------
  '.kpi-card': () =>
    `<div style="display:flex;gap:12px;flex-wrap:wrap"><div class="kpi-card"><div class="lbl">HEADCOUNT</div><div class="val">270</div><div class="sub">active employees</div></div><div class="kpi-card"><div class="lbl">CAPABILITY</div><div class="val">73<span class="unit"> %</span></div><div class="sub">company-wide · Q4</div></div></div>`,
  '.panel': () =>
    `<div class="panel" style="max-width:360px"><div class="widget-head"><span>Panel container</span><span class="label-pill">META</span></div><div style="padding:16px;font-size:12px;color:var(--ink-soft)">Slot interno — qualsiasi widget può consumare il <code>.panel</code> come chrome.</div></div>`,
  '.matrix-wrap': () =>
    `<div class="matrix-wrap"><div class="widget-head"><span>RBAC matrix</span><span class="label-pill">4 roles × 3 areas</span></div><table class="rbac"><thead><tr><th>AREA / ROLE</th><th>SUPER<br><span class="lvl-num">L-1</span></th><th>HR_DIR<br><span class="lvl-num">L2</span></th><th>EMP<br><span class="lvl-num">L6</span></th></tr></thead><tbody><tr><th>EMPLOYEES</th><td class="lvl-100">OWNER</td><td class="lvl-80">ADMIN</td><td class="lvl-40">READ</td></tr><tr><th>AUDIT</th><td class="lvl-100">OWNER</td><td class="lvl-5">—</td><td class="lvl-5">—</td></tr></tbody></table></div>`,
  '.skill-gap': () =>
    `<div class="skill-gap"><div class="widget-head"><span>Skill gap <em>analysis</em></span><span class="label-pill">CRITICAL · 3</span></div><div style="padding:12px 16px"><div class="gap-bar"><span class="bar-lbl">Python advanced</span><span class="bar"><span class="bar-fill fill-critical" style="width:82%"></span></span><span class="bar-num">82%</span></div><div class="gap-bar"><span class="bar-lbl">Stakeholder mgmt</span><span class="bar"><span class="bar-fill fill-warn" style="width:64%"></span></span><span class="bar-num">64%</span></div></div></div>`,
  '.tenant-card': () =>
    `<div class="tenant-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:580px"><article class="tenant-card platform"><span class="tag tag-platform">PLATFORM</span><h3>Heuresys System</h3><div class="tid">platform · landlord</div><div class="row"><span class="lbl">PLAN</span><span class="val">N/A</span></div><div class="row"><span class="lbl">STATUS</span><span class="val success">active</span></div><div class="health"><span class="dot"></span><span class="lbl"><strong>OK</strong> all systems healthy</span></div></article><article class="tenant-card"><span class="tag tag-tenant">TENANT</span><h3>RTL Bank</h3><div class="tid">rtl-bank · 270 employees</div><div class="row"><span class="lbl">INDUSTRY</span><span class="val">Banking</span></div><div class="row"><span class="lbl">PLAN</span><span class="val">Enterprise</span></div><div class="health"><span class="dot warn"></span><span class="lbl"><strong>WARN</strong> 1 integration degraded</span></div></article></div>`,
  '.tenant-grid': () =>
    `<div class="tenant-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><article class="tenant-card"><span class="tag tag-tenant">TENANT</span><h3>RTL Bank</h3></article><article class="tenant-card"><span class="tag tag-tenant">TENANT</span><h3>EcoNova</h3></article></div>`,
  '.metric-card': () =>
    `<div class="metrics-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:720px"><div class="metric-card"><div class="lbl">DB SIZE</div><div class="val">24.6<span class="unit">GB</span></div><svg class="sparkline" viewBox="0 0 90 30" preserveAspectRatio="none"><polyline fill="none" stroke="var(--accent)" stroke-width="1.5" points="0,22 10,18 20,15 30,12 40,11 50,9 60,8 70,7 80,5 90,4"/></svg></div><div class="metric-card"><div class="lbl">CPU</div><div class="val">42<span class="unit">%</span></div><svg class="sparkline" viewBox="0 0 90 30" preserveAspectRatio="none"><polyline fill="none" stroke="var(--semantic-warning)" stroke-width="1.5" points="0,18 10,16 20,20 30,14 40,11 50,15 60,9 70,12 80,7 90,10"/></svg></div><div class="metric-card"><div class="lbl">MEMORY</div><div class="val">7.4<span class="unit">GB</span></div></div><div class="metric-card"><div class="lbl">QUEUE</div><div class="val">12<span class="unit">/100</span></div></div></div>`,
  '.metrics-grid': () => CSS_TEMPLATES['.metric-card'](),
  '.succession-card': () =>
    `<div class="succession-card" style="max-width:380px"><div class="role"><div class="lbl">TARGET</div><h3>Director Risk &amp; Analytics</h3><div class="sub">Head Credit Risk → 2026 Q3</div></div><div class="candidates"><div class="candidate"><div class="ci">SB</div><div class="cn">Stefania Bianchi</div><span class="pill pill-ok">READY NOW</span></div><div class="candidate"><div class="ci">GA</div><div class="cn">Gabriele Amato</div><span class="pill pill-warn">1-2y</span></div></div><div class="readiness"><span class="lbl">READINESS</span><span class="val">88%</span><span class="pill pill-ok">LOW RISK</span></div></div>`,
  '.gauge-card': () =>
    `<div class="gauge-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:480px"><div class="gauge-card"><div class="lbl">PROCESS</div><div class="gauge-val gauge-accent">82%</div><div class="gauge-bar"><span class="bar-fill fill-info" style="width:82%"></span></div></div><div class="gauge-card"><div class="lbl">COMPETENCE</div><div class="gauge-val gauge-success">94%</div><div class="gauge-bar"><span class="bar-fill fill-ok" style="width:94%"></span></div></div><div class="gauge-card"><div class="lbl">PERFORMANCE</div><div class="gauge-val gauge-warn">68%</div><div class="gauge-bar"><span class="bar-fill fill-warn" style="width:68%"></span></div></div><div class="gauge-card"><div class="lbl">STRUCTURE</div><div class="gauge-val gauge-warn">42%</div><div class="gauge-bar"><span class="bar-fill fill-critical" style="width:42%"></span></div></div></div>`,
  '.gauge-grid': () => CSS_TEMPLATES['.gauge-card'](),
  '.comp-card': () =>
    `<div class="comp-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:560px"><div class="comp-card"><div class="lbl">BASE SALARY</div><div class="val">86<span class="unit">k €</span></div></div><div class="comp-card"><div class="lbl">BONUS Q4</div><div class="val">12<span class="unit">k €</span></div></div><div class="comp-card"><div class="lbl">EQUITY</div><div class="val">24<span class="unit">k €</span></div></div><div class="comp-card"><div class="lbl">TOTAL TC</div><div class="val">122<span class="unit">k €</span></div></div></div>`,
  '.comp-grid': () => CSS_TEMPLATES['.comp-card'](),
  '.bridge-card': () =>
    `<div class="bridge-card" style="max-width:360px"><div class="bridge-head"><h3>Senior Risk Analyst</h3><span class="pill pill-warn">1-2y</span></div><div class="bridge-readiness"><span class="lbl">READINESS</span><span class="val">72%</span></div><div class="bridge-gaps"><span class="gap-chip">Python · advanced</span><span class="gap-chip">Stakeholder mgmt</span></div></div>`,
  '.profile-hero': () =>
    `<div class="profile-hero"><div class="profile-avatar">GA</div><div class="profile-meta"><div class="profile-name">Gabriele Amato</div><div class="profile-sub">Risk Analyst · Credit Risk · 4.2 yr tenure</div><div class="profile-badges"><span class="pbadge pbadge-role">Analyst</span><span class="pbadge pbadge-dept">Credit Risk</span><span class="pbadge pbadge-tenure">4y 2m</span></div></div><div class="profile-stats"><div class="profile-stat"><span class="lbl">CAPABILITY</span><span class="val">78%</span></div><div class="profile-stat"><span class="lbl">GOALS Q4</span><span class="val">4/5</span></div><div class="profile-stat"><span class="lbl">NEXT REVIEW</span><span class="val">12d</span></div></div></div>`,

  // ---------- §6 Tables & data ----------
  '.activity': () =>
    `<section class="activity"><header class="activity-head"><h2>Activity <em>feed</em></h2><span class="live">live</span></header><div class="activity-list"><div class="activity-item"><div class="when">2 min ago</div><div class="what">New review cycle started</div><div class="who">HR Director</div></div><div class="activity-item"><div class="when">12 min ago</div><div class="what">Skill assessment imported</div><div class="who">system</div></div></div></section>`,
  '.activity-list': () => CSS_TEMPLATES['.activity'](),
  '.activity-item': () => CSS_TEMPLATES['.activity'](),
  '.audit-list': () =>
    `<div class="audit-list"><div class="audit-row"><span class="ts">14:32:08</span><span class="what"><strong>UPDATE</strong> <span class="accent">user.role</span></span><span class="actor">sysadmin</span></div><div class="audit-row"><span class="ts">14:30:42</span><span class="what"><strong>INSERT</strong> <span class="accent">audit_logs</span></span><span class="actor">system</span></div><div class="audit-row"><span class="ts">14:28:11</span><span class="what"><strong>LOGIN</strong> <span class="accent">valentina.conti</span></span><span class="actor">credentials</span></div></div>`,
  '.audit-row': () => CSS_TEMPLATES['.audit-list'](),
  '.int-row': () =>
    `<div><div class="int-row"><div class="icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8V4M11 8V4M3 8h10v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8Z"/></svg></div><div class="info"><div class="name">SAP HCM</div><div class="meta">last sync · 2 min ago · workforce master</div></div><span class="pill pill-ok">OK</span></div><div class="int-row"><div class="icon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg></div><div class="info"><div class="name">Workday</div><div class="meta">last sync · 14 min ago</div></div><span class="pill pill-warn">DEGRADED</span></div></div>`,
  '.crit-row': () =>
    `<div><div class="crit-row"><span class="rank">1</span><span class="name">SQL · expert</span><span class="dept">Engineering</span><span class="pill pill-critical">−42</span></div><div class="crit-row"><span class="rank">2</span><span class="name">Python · advanced</span><span class="dept">Risk</span><span class="pill pill-warn">−28</span></div></div>`,
  '.ont-row': () =>
    `<div><div class="ont-row"><span class="ont-cluster">Domain</span><span class="ont-count">28 nodes</span><span class="ont-pct">42%</span></div><div class="ont-row"><span class="ont-cluster">Tech</span><span class="ont-count">19 nodes</span><span class="ont-pct">28%</span></div><div class="ont-row"><span class="ont-cluster">Soft</span><span class="ont-count">14 nodes</span><span class="ont-pct">21%</span></div></div>`,
  '.heatmap-cell': () =>
    `<div class="heatmap-wrap"><div class="heatmap-grid" style="grid-template-columns:90px repeat(4,1fr);gap:4px"><div></div><div class="heatmap-col-header">SQL</div><div class="heatmap-col-header">PYTHON</div><div class="heatmap-col-header">LEAD</div><div class="heatmap-col-header">COMMS</div><div class="heatmap-row-label">FINANCE</div><div class="heatmap-cell heat-3">50</div><div class="heatmap-cell heat-5">82</div><div class="heatmap-cell heat-6">99</div><div class="heatmap-cell heat-5">91</div><div class="heatmap-row-label">RISK</div><div class="heatmap-cell heat-4">71</div><div class="heatmap-cell heat-6">95</div><div class="heatmap-cell heat-6">97</div><div class="heatmap-cell heat-4">76</div></div></div>`,
  '.heatmap-grid': () => CSS_TEMPLATES['.heatmap-cell'](),
  '.heatmap-wrap': () => CSS_TEMPLATES['.heatmap-cell'](),

  // ---------- §7 Charts & graphs ----------
  '.kg-graph': () =>
    `<div class="kg-graph"><svg viewBox="0 0 300 200" style="width:100%;height:200px;max-width:480px"><line x1="60" y1="60" x2="160" y2="100" stroke="var(--rule-strong)" stroke-width="1.5"/><line x1="160" y1="100" x2="240" y2="60" stroke="var(--rule-strong)" stroke-width="1.5"/><line x1="160" y1="100" x2="100" y2="160" stroke="var(--rule-strong)" stroke-width="1.5"/><line x1="160" y1="100" x2="220" y2="160" stroke="var(--rule-strong)" stroke-width="1.5"/><circle cx="60" cy="60" r="22" fill="var(--cap-process)"/><circle cx="160" cy="100" r="26" fill="var(--cap-role)"/><circle cx="240" cy="60" r="22" fill="var(--cap-process)"/><circle cx="100" cy="160" r="20" fill="var(--cap-competence)"/><circle cx="220" cy="160" r="20" fill="var(--cap-competence)"/><text x="60" y="64" text-anchor="middle" font-size="10" fill="#fff" font-family="JetBrains Mono">FIN</text><text x="160" y="104" text-anchor="middle" font-size="10" fill="#fff" font-family="JetBrains Mono">RISK</text><text x="240" y="64" text-anchor="middle" font-size="10" fill="#fff" font-family="JetBrains Mono">ENG</text><text x="100" y="164" text-anchor="middle" font-size="9" fill="#fff" font-family="JetBrains Mono">SQL</text><text x="220" y="164" text-anchor="middle" font-size="9" fill="#fff" font-family="JetBrains Mono">PY</text></svg><div class="kg-legend"><span><span class="legend-dot" style="background:var(--cap-process)"></span>Domain</span><span><span class="legend-dot" style="background:var(--cap-role)"></span>Hub</span><span><span class="legend-dot" style="background:var(--cap-competence)"></span>Skill</span></div></div>`,
  '.kg-legend': () => CSS_TEMPLATES['.kg-graph'](),
  '.capability-radar': () =>
    `<div class="capability-radar" style="max-width:360px;margin:0 auto"><svg class="radar-svg" viewBox="-110 -110 220 220" style="width:100%;height:280px"><polygon class="radar-grid" points="0,-100 95,-31 59,81 -59,81 -95,-31" fill="none" stroke="var(--rule)" stroke-width="1"/><polygon class="radar-grid" points="0,-75 71,-23 44,61 -44,61 -71,-23" fill="none" stroke="var(--rule)" stroke-width="1"/><polygon class="radar-grid" points="0,-50 48,-15 30,40 -30,40 -48,-15" fill="none" stroke="var(--rule)" stroke-width="1"/><line class="radar-axis" x1="0" y1="0" x2="0" y2="-100" stroke="var(--rule)"/><line class="radar-axis" x1="0" y1="0" x2="95" y2="-31" stroke="var(--rule)"/><line class="radar-axis" x1="0" y1="0" x2="59" y2="81" stroke="var(--rule)"/><line class="radar-axis" x1="0" y1="0" x2="-59" y2="81" stroke="var(--rule)"/><line class="radar-axis" x1="0" y1="0" x2="-95" y2="-31" stroke="var(--rule)"/><polygon class="radar-target" points="0,-85 65,-21 47,65 -47,65 -71,-23" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/><polygon class="radar-current" points="0,-78 71,-23 35,48 -41,56 -52,-17" fill="rgba(168,85,247,0.18)" stroke="var(--brand-purple)" stroke-width="2"/><text x="0" y="-108" text-anchor="middle" font-size="9" fill="var(--ink-muted)" font-family="JetBrains Mono">PROCESS</text><text x="106" y="-30" text-anchor="middle" font-size="9" fill="var(--ink-muted)" font-family="JetBrains Mono">ROLE</text><text x="65" y="93" text-anchor="middle" font-size="9" fill="var(--ink-muted)" font-family="JetBrains Mono">COMPETENCE</text><text x="-65" y="93" text-anchor="middle" font-size="9" fill="var(--ink-muted)" font-family="JetBrains Mono">PERFORMANCE</text><text x="-104" y="-30" text-anchor="middle" font-size="9" fill="var(--ink-muted)" font-family="JetBrains Mono">STRUCTURE</text></svg></div>`,
  '.career-arc': () =>
    `<div class="career-arc" style="max-width:600px"><div class="career-stage past"><div class="dot">1</div><div class="label">Junior</div><div class="year">2018</div></div><div class="career-stage past"><div class="dot">2</div><div class="label">Analyst</div><div class="year">2020</div></div><div class="career-stage current"><div class="dot">3</div><div class="label">Senior</div><div class="year">2023</div></div><div class="career-stage future"><div class="dot">4</div><div class="label">Lead</div><div class="year">2026 →</div></div><div class="career-stage future"><div class="dot">5</div><div class="label">Head</div><div class="year">2029+</div></div></div>`,
  '.career-stage': () => CSS_TEMPLATES['.career-arc'](),
  '.histogram': () =>
    `<div class="histogram" style="max-width:480px"><div class="histo-bar"><span class="histo-lbl">90-100</span><span class="histo-track"><span class="histo-fill fill-ok" style="width:18%"></span></span><span class="histo-num">18</span></div><div class="histo-bar"><span class="histo-lbl">70-89</span><span class="histo-track"><span class="histo-fill fill-info" style="width:42%"></span></span><span class="histo-num">42</span></div><div class="histo-bar"><span class="histo-lbl">50-69</span><span class="histo-track"><span class="histo-fill fill-warn" style="width:31%"></span></span><span class="histo-num">31</span></div><div class="histo-bar"><span class="histo-lbl">0-49</span><span class="histo-track"><span class="histo-fill fill-critical" style="width:9%"></span></span><span class="histo-num">9</span></div></div>`,
  '.histo-bar': () => CSS_TEMPLATES['.histogram'](),

  // ---------- §8 Pills, badges & status ----------
  '.pill': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="pill">DEFAULT</span><span class="pill pill-ok">OK</span><span class="pill pill-warn">WARN</span><span class="pill pill-critical">CRITICAL</span><span class="pill pill-info">INFO</span><span class="pill pill-meets">MEETS</span><span class="pill pill-exceeds">EXCEEDS</span><span class="pill pill-grow">GROW</span></div>`,
  '.pill-ok': () => `<span class="pill pill-ok">OK</span>`,
  '.pill-warn': () => `<span class="pill pill-warn">WARN</span>`,
  '.pill-critical': () => `<span class="pill pill-critical">CRITICAL</span>`,
  '.pill-info': () => `<span class="pill pill-info">INFO</span>`,
  '.pill-meets': () => `<span class="pill pill-meets">MEETS</span>`,
  '.pill-exceeds': () => `<span class="pill pill-exceeds">EXCEEDS</span>`,
  '.pill-grow': () => `<span class="pill pill-grow">GROW</span>`,
  '.scope-pill': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><div class="scope-pill"><span class="dot"></span><span>scope · rtl-bank · hr_director</span></div><div class="scope-pill"><span class="dot"></span><span>scope · platform · superuser</span></div></div>`,
  '.label-pill': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="label-pill">DASHBOARD</span><span class="label-pill">EMPLOYEES</span><span class="label-pill">AUDIT</span><span class="label-pill">v2.0</span></div>`,
  '.pbadge': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="pbadge pbadge-role">Analyst</span><span class="pbadge pbadge-dept">Credit Risk</span><span class="pbadge pbadge-tenure">4y 2m</span></div>`,
  '.pbadge-role': () => `<span class="pbadge pbadge-role">Analyst</span>`,
  '.pbadge-dept': () => `<span class="pbadge pbadge-dept">Credit Risk</span>`,
  '.pbadge-tenure': () => `<span class="pbadge pbadge-tenure">4y 2m</span>`,
  '.tag-platform': () => `<span class="tag tag-platform">PLATFORM</span>`,
  '.tag-tenant': () => `<span class="tag tag-tenant">TENANT</span>`,

  // ---------- §9 Bars & gauges ----------
  '.bar-fill': () =>
    `<div style="display:grid;gap:10px;max-width:360px"><div style="background:var(--surface-3);border-radius:4px;height:8px;overflow:hidden"><span class="bar-fill fill-info" style="display:block;height:100%;width:60%"></span></div><div style="background:var(--surface-3);border-radius:4px;height:8px;overflow:hidden"><span class="bar-fill fill-ok" style="display:block;height:100%;width:88%"></span></div><div style="background:var(--surface-3);border-radius:4px;height:8px;overflow:hidden"><span class="bar-fill fill-warn" style="display:block;height:100%;width:42%"></span></div><div style="background:var(--surface-3);border-radius:4px;height:8px;overflow:hidden"><span class="bar-fill fill-critical" style="display:block;height:100%;width:22%"></span></div></div>`,
  '.gap-bar': () =>
    `<div><div class="gap-bar"><span class="bar-lbl">Python advanced</span><span class="bar"><span class="bar-fill fill-critical" style="width:82%"></span></span><span class="bar-num">82%</span></div><div class="gap-bar"><span class="bar-lbl">SQL expert</span><span class="bar"><span class="bar-fill fill-ok" style="width:28%"></span></span><span class="bar-num">28%</span></div></div>`,

  // ---------- §10 Buttons & filters ----------
  '.btn': () =>
    `<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center"><button class="btn btn-primary">Save changes</button><button class="btn btn-ghost">Cancel</button><button class="btn btn-primary" disabled>Disabled</button></div>`,
  '.btn-primary': () => `<button class="btn btn-primary">Save changes</button>`,
  '.btn-ghost': () => `<button class="btn btn-ghost">Cancel</button>`,
  '.theme-toggle-btn': () => `<button class="theme-toggle-btn" aria-label="theme">◐</button>`,
  '.filter-pill': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="filter-pill active">All <span class="ct">270</span></span><span class="filter-pill">Critical <span class="ct">12</span></span><span class="filter-pill">Warn <span class="ct">42</span></span><span class="filter-pill">OK <span class="ct">216</span></span></div>`,
  '.filter-bar': () =>
    `<div class="filter-bar"><div class="filter-group"><span class="filter-label">DEPT</span><span class="filter-pill active">All</span><span class="filter-pill">Risk</span><span class="filter-pill">Eng</span><span class="filter-pill">HR</span></div><div class="filter-group"><span class="filter-label">LEVEL</span><span class="filter-pill active">All</span><span class="filter-pill">L0-2</span><span class="filter-pill">L3-4</span></div></div>`,
  '.filter-group': () => CSS_TEMPLATES['.filter-bar'](),
  '.filter-label': () => CSS_TEMPLATES['.filter-bar'](),

  // ---------- §11 Typography ----------
  '.wordmark': () =>
    `<div style="display:flex;flex-direction:column;gap:16px"><div><span class="wordmark">heuresys</span><span style="margin-left:12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-muted)">.wordmark · 22px hero</span></div><div><span class="wordmark-sm">heuresys</span><span style="margin-left:12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-muted)">.wordmark-sm · 18px nav-bar</span></div><div><span class="wordmark-foot">heuresys</span><span style="margin-left:12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-muted)">.wordmark-foot · footer</span></div><div><span class="wordmark-sm legacy">heuresys</span><span style="margin-left:12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ink-muted)">.wordmark-sm.legacy · brand-blue body (L27)</span></div></div>`,
  '.wordmark-sm': () => `<span class="wordmark-sm">heuresys</span>`,
  '.wordmark-foot': () => `<span class="wordmark-foot">heuresys</span>`,

  // ---------- Modifiers (heat-grade lvl-* heat-*) ----------
  '.lvl-100': () => `<table class="rbac"><tr><td class="lvl-100">OWNER</td></tr></table>`,
  '.lvl-80': () => `<table class="rbac"><tr><td class="lvl-80">ADMIN</td></tr></table>`,
  '.lvl-60': () => `<table class="rbac"><tr><td class="lvl-60">WRITE</td></tr></table>`,
  '.lvl-40': () => `<table class="rbac"><tr><td class="lvl-40">READ</td></tr></table>`,
  '.lvl-20': () => `<table class="rbac"><tr><td class="lvl-20">limited</td></tr></table>`,
  '.lvl-5': () => `<table class="rbac"><tr><td class="lvl-5">—</td></tr></table>`,
  '.heat-0': () =>
    `<div class="heatmap-cell heat-0" style="width:80px;height:40px;display:grid;place-items:center">10</div>`,
  '.heat-1': () =>
    `<div class="heatmap-cell heat-1" style="width:80px;height:40px;display:grid;place-items:center">25</div>`,
  '.heat-2': () =>
    `<div class="heatmap-cell heat-2" style="width:80px;height:40px;display:grid;place-items:center">40</div>`,
  '.heat-3': () =>
    `<div class="heatmap-cell heat-3" style="width:80px;height:40px;display:grid;place-items:center">55</div>`,
  '.heat-4': () =>
    `<div class="heatmap-cell heat-4" style="width:80px;height:40px;display:grid;place-items:center">70</div>`,
  '.heat-5': () =>
    `<div class="heatmap-cell heat-5" style="width:80px;height:40px;display:grid;place-items:center">85</div>`,
  '.heat-6': () =>
    `<div class="heatmap-cell heat-6" style="width:80px;height:40px;display:grid;place-items:center">99</div>`,

  // ========== L47 — Charts (cross-tenant-overview) ==========
  '.chart-wrap': () =>
    `<div class="chart-wrap" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:540px"><svg viewBox="0 0 720 220" style="width:100%;height:220px"><polyline fill="none" stroke="var(--accent)" stroke-width="2" points="0,180 60,160 120,140 180,150 240,120 300,100 360,90 420,70 480,80 540,60 600,50 660,40 720,30"/><polyline fill="none" stroke="var(--brand-blue)" stroke-width="2" stroke-dasharray="4,3" points="0,200 60,180 120,170 180,160 240,150 300,140 360,130 420,120 480,110 540,100 600,90 660,80 720,70"/></svg></div>`,
  '.chart-legend': () =>
    `<div class="chart-legend"><span class="lg"><span class="swatch" style="background:var(--accent)"></span>Headcount</span><span class="lg"><span class="swatch" style="background:var(--brand-blue)"></span>Capability</span><span class="lg"><span class="swatch" style="background:var(--semantic-success)"></span>Engagement</span></div>`,

  // ========== L47 — Single gauge pattern (tenant-owner) ==========
  '.gauge-wrap': () =>
    `<div class="gauge-wrap" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:240px"><div class="gauge-label">SUCCESSION READY</div><div class="gauge-ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68" fill="none" stroke="var(--rule)" stroke-width="8"/><circle cx="80" cy="80" r="68" fill="none" stroke="var(--accent)" stroke-width="8" stroke-dasharray="427" stroke-dashoffset="125" transform="rotate(-90 80 80)"/></svg><div class="gauge-num">29.2%</div></div><div class="gauge-sub">12 successors ready · 4 critical roles</div></div>`,
  '.gauge-ring': () =>
    `<div class="gauge-ring" style="margin:0 auto"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68" fill="none" stroke="var(--rule)" stroke-width="8"/><circle cx="80" cy="80" r="68" fill="none" stroke="var(--accent)" stroke-width="8" stroke-dasharray="427" stroke-dashoffset="125" transform="rotate(-90 80 80)"/></svg><div class="gauge-num">73%</div></div>`,

  // ========== L47 — Department table (tenant-owner) ==========
  'table.dept': () =>
    `<table class="dept" style="max-width:640px"><thead><tr><th>DEPT</th><th>HEAD</th><th>FTE</th><th>COVERAGE</th></tr></thead><tbody><tr><td>Engineering</td><td>L. Bianchi</td><td>42</td><td><div class="bar-cell"><div class="bar-track"><div class="bar-fill fill-ok" style="width:88%"></div></div></div></td></tr><tr><td>Risk</td><td>S. Bianchi</td><td>28</td><td><div class="bar-cell"><div class="bar-track"><div class="bar-fill" style="width:72%"></div></div></div></td></tr><tr><td>Finance</td><td>M. Rossi</td><td>18</td><td><div class="bar-cell"><div class="bar-track"><div class="bar-fill fill-warn" style="width:52%"></div></div></div></td></tr></tbody></table>`,

  // ========== L47 — Succession row (tenant-owner) ==========
  '.succession-row': () =>
    `<div style="display:grid;gap:8px;max-width:380px"><div class="succession-row"><div class="pic">SB</div><div class="who"><div class="name">Stefania Bianchi</div><div class="meta">Head Credit Risk · ready 2026 Q3</div></div><div class="rating"><div class="num">88</div><div class="lbl">readiness</div></div></div><div class="succession-row"><div class="pic">GA</div><div class="who"><div class="name">Gabriele Amato</div><div class="meta">Risk Analyst · 1-2y</div></div><div class="rating"><div class="num">72</div><div class="lbl">readiness</div></div></div></div>`,

  // ========== L47 — Knowledge graph + ontology (capability-graph) ==========
  '.kg-canvas': () =>
    `<div class="kg-canvas" style="max-width:560px"><div class="kg-canvas-head"><h2>Capability <em>graph</em></h2><span class="scope">RTL BANK · 248 NODES</span></div><div style="padding:18px;position:relative"><svg viewBox="0 0 400 220" style="width:100%;height:220px"><line x1="80" y1="60" x2="200" y2="110" stroke="var(--rule-strong)"/><line x1="200" y1="110" x2="320" y2="60" stroke="var(--rule-strong)"/><line x1="200" y1="110" x2="120" y2="170" stroke="var(--rule-strong)"/><line x1="200" y1="110" x2="280" y2="170" stroke="var(--rule-strong)"/><circle cx="80" cy="60" r="22" fill="var(--cap-process)"/><circle cx="200" cy="110" r="26" fill="var(--cap-role)"/><circle cx="320" cy="60" r="22" fill="var(--cap-process)"/><circle cx="120" cy="170" r="20" fill="var(--cap-competence)"/><circle cx="280" cy="170" r="20" fill="var(--cap-competence)"/></svg><div class="kg-legend"><div class="lg-row"><span class="dot" style="background:var(--cap-process)"></span>Domain</div><div class="lg-row"><span class="dot" style="background:var(--cap-role)"></span>Hub</div><div class="lg-row"><span class="dot" style="background:var(--cap-competence)"></span>Skill</div></div></div></div>`,
  '.kg-split': () =>
    `<div class="kg-split" style="margin:0;max-width:720px"><div class="kg-canvas" style="min-height:200px;display:grid;place-items:center;color:var(--ink-muted);font-family:'JetBrains Mono',monospace;font-size:11px">2fr · KG canvas</div><div class="ontology-list" style="min-height:200px;display:grid;place-items:center;color:var(--ink-muted);font-family:'JetBrains Mono',monospace;font-size:11px">1fr · ontology</div></div>`,
  '.kg-legend': () =>
    `<div class="kg-canvas" style="position:relative;padding:60px 20px;max-width:380px"><div class="kg-legend"><div class="lg-row"><span class="dot" style="background:var(--cap-process)"></span>Domain</div><div class="lg-row"><span class="dot" style="background:var(--cap-role)"></span>Hub</div><div class="lg-row"><span class="dot" style="background:var(--cap-competence)"></span>Skill</div></div></div>`,
  '.ontology-list': () =>
    `<div class="ontology-list" style="max-width:420px"><div class="head"><h2>Ontology <em>distribution</em></h2><span class="count">5 CLUSTERS</span></div><div class="ont-row"><div class="glyph-box"><svg viewBox="0 0 16 16" stroke="currentColor" fill="none" stroke-width="1.5"><circle cx="8" cy="8" r="6"/></svg></div><div class="info"><div class="name">Process</div><div class="desc">Workflow + delivery</div></div><div class="stat">28 nodes<span class="pct">42%</span></div></div><div class="ont-row"><div class="glyph-box"><svg viewBox="0 0 16 16" stroke="currentColor" fill="none" stroke-width="1.5"><rect x="3" y="3" width="10" height="10"/></svg></div><div class="info"><div class="name">Structure</div><div class="desc">Org hierarchy</div></div><div class="stat">19 nodes<span class="pct">28%</span></div></div></div>`,
  '.ont-row': () =>
    `<div class="ontology-list" style="max-width:420px"><div class="ont-row"><div class="glyph-box"><svg viewBox="0 0 16 16" stroke="currentColor" fill="none" stroke-width="1.5"><circle cx="8" cy="8" r="6"/></svg></div><div class="info"><div class="name">Process</div><div class="desc">Workflow + delivery</div></div><div class="stat">28 nodes<span class="pct">42%</span></div></div></div>`,
  '.top-entities': () =>
    `<div class="top-entities" style="max-width:560px;padding:14px 18px;display:grid;gap:8px;font-family:'JetBrains Mono',monospace;font-size:11px"><div style="display:flex;justify-content:space-between"><span style="color:var(--ink)">SQL · expert</span><span class="density-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:88%"></span></span>88</span></div><div style="display:flex;justify-content:space-between"><span style="color:var(--ink)">Python · advanced</span><span class="density-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:72%"></span></span>72</span></div></div>`,
  '.density-bar': () =>
    `<div style="display:flex;flex-direction:column;gap:4px;max-width:160px"><span class="density-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:88%"></span></span>88</span><span class="density-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:62%"></span></span>62</span></div>`,
  '.esco-sync': () =>
    `<div class="esco-sync" style="max-width:560px"><h2>ESCO <em>sync</em></h2><div class="sync-grid"><div class="sync-stat"><div class="lbl">SKILLS</div><div class="val">3.2k</div><div class="sub"><strong>+128</strong> last sync</div></div><div class="sync-stat"><div class="lbl">OCCUPATIONS</div><div class="val">428</div><div class="sub">cross-mapped</div></div><div class="sync-stat"><div class="lbl">UPDATED</div><div class="val">14m</div><div class="sub">ago</div></div></div></div>`,
  '.sync-grid': () => CSS_TEMPLATES['.esco-sync'](),
  '.sync-stat': () =>
    `<div class="sync-stat" style="max-width:160px"><div class="lbl">SKILLS</div><div class="val">3.2k</div><div class="sub"><strong>+128</strong> last sync</div></div>`,

  // L47 — Pill capability variants
  '.pill-process': () => `<span class="pill pill-process">PROCESS</span>`,
  '.pill-structure': () => `<span class="pill pill-structure">STRUCTURE</span>`,
  '.pill-role': () => `<span class="pill pill-role">ROLE</span>`,
  '.pill-competence': () => `<span class="pill pill-competence">COMPETENCE</span>`,
  '.pill-performance': () => `<span class="pill pill-performance">PERFORMANCE</span>`,

  // ========== L47 — Profile hero + career arc + bridge cards (employee-journey) ==========
  '.profile-hero': () =>
    `<div class="profile-hero" style="max-width:640px"><div class="pic">GA</div><div class="meta"><h2>Gabriele Amato</h2><div class="sub">Risk Analyst · Credit Risk · 4.2 yr tenure</div><div class="badges"><span class="pbadge role">Analyst</span><span class="pbadge dept">Credit Risk</span><span class="pbadge tenure">4y 2m</span></div></div><div class="stats"><div class="stat"><div class="lbl">CAPABILITY</div><div class="val">78%</div></div><div class="stat"><div class="lbl">GOALS Q4</div><div class="val">4/5</div></div></div></div>`,
  '.pbadge': () =>
    `<div style="display:flex;gap:8px;flex-wrap:wrap"><span class="pbadge role">Analyst</span><span class="pbadge dept">Credit Risk</span><span class="pbadge tenure">4y 2m</span></div>`,
  '.arc': () =>
    `<div class="arc" style="max-width:640px"><div class="arc-line"></div><div class="arc-grid"><div class="arc-event done"><div class="when">2018</div><div class="dot"></div><div class="role-name">Junior</div><div class="role-meta">L1 · entry</div></div><div class="arc-event done"><div class="when">2020</div><div class="dot"></div><div class="role-name">Analyst</div><div class="role-meta">L2</div></div><div class="arc-event current"><div class="when">2023</div><div class="dot"></div><div class="role-name">Senior</div><div class="role-meta">L3 · current</div></div><div class="arc-event"><div class="when">2026</div><div class="dot"></div><div class="role-name">Lead</div><div class="role-meta">L4</div></div><div class="arc-event"><div class="when">2029+</div><div class="dot"></div><div class="role-name">Head</div><div class="role-meta">L5</div></div></div></div>`,
  '.arc-line': () => CSS_TEMPLATES['.arc'](),
  '.arc-grid': () => CSS_TEMPLATES['.arc'](),
  '.arc-event': () =>
    `<div class="arc-grid" style="max-width:480px"><div class="arc-event done"><div class="when">2018</div><div class="dot"></div><div class="role-name">Junior</div></div><div class="arc-event current"><div class="when">2023</div><div class="dot"></div><div class="role-name">Senior</div></div><div class="arc-event"><div class="when">2026</div><div class="dot"></div><div class="role-name">Lead</div></div></div>`,
  '.split-panels': () =>
    `<div class="split-panels" style="margin:0;max-width:720px"><div class="panel"><div class="widget-head">left · 1.4fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">capability radar</div></div><div class="panel"><div class="widget-head">right · 1fr</div><div style="padding:14px 18px;font-size:12px;color:var(--ink-soft)">delta breakdown</div></div></div>`,
  '.skill-chart-svg': () =>
    `<div class="panel" style="max-width:480px"><div class="widget-head">Skill chart</div><svg class="skill-chart-svg" viewBox="0 0 480 280"><polyline fill="none" stroke="var(--accent)" stroke-width="2" points="20,200 80,180 140,160 200,140 260,120 320,100 380,80 440,60"/></svg></div>`,
  '.legend-row': () =>
    `<div class="panel" style="max-width:480px"><div class="legend-row"><div class="item"><span class="swatch" style="background:var(--accent)"></span>Current</div><div class="item"><span class="swatch" style="background:var(--brand-blue)"></span>Target</div></div></div>`,
  '.radar-table': () =>
    `<div class="radar-table" style="max-width:480px"><div class="cell"><div class="lbl">PROCESS</div><div class="val">82</div></div><div class="cell"><div class="lbl">STRUCTURE</div><div class="val">68</div></div><div class="cell"><div class="lbl">ROLE</div><div class="val">75</div></div><div class="cell"><div class="lbl">COMPETENCE</div><div class="val">88</div></div><div class="cell"><div class="lbl">PERFORMANCE</div><div class="val">72</div></div></div>`,
  '.bridge-grid': () =>
    `<div class="bridge-grid" style="max-width:720px"><div class="bridge-card"><div class="role-name">Senior Risk Analyst</div><div class="esco-id">ESCO 2421.4</div><div class="readiness"><span class="pct">72%</span><span class="ring"><span class="ring-fill" style="display:block;height:100%;width:72%"></span></span></div></div><div class="bridge-card"><div class="role-name">Lead Risk</div><div class="esco-id">ESCO 1346.2</div><div class="readiness"><span class="pct">48%</span><span class="ring"><span class="ring-fill" style="display:block;height:100%;width:48%"></span></span></div></div></div>`,
  '.bridge-card': () =>
    `<div class="bridge-card" style="max-width:280px"><div class="role-name">Senior Risk Analyst</div><div class="esco-id">ESCO 2421.4</div><div class="readiness"><span class="pct">72%</span><span class="ring"><span class="ring-fill" style="display:block;height:100%;width:72%"></span></span></div><ul class="gap-list"><li><span class="what">Python · advanced</span><span class="miss">−18</span></li><li><span class="what">Stakeholder mgmt</span><span class="miss">−12</span></li></ul></div>`,
  '.score-bar': () =>
    `<div style="display:flex;flex-direction:column;gap:6px;max-width:180px"><span class="score-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:88%"></span></span>88</span><span class="score-bar"><span class="bar"><span class="bar-fill" style="display:block;height:100%;width:62%"></span></span>62</span></div>`,

  // ========== L47 — Process viz ==========
  '.funnel': () =>
    `<div class="funnel" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="funnel-stage"><div class="label">Application<div class="meta">stage 1 / 4</div></div><div class="bar-bg"><div class="bar-fill" style="width:100%"></div></div><div class="count">1,420</div><div class="ageing">avg 0.5d</div></div><div class="funnel-stage"><div class="label">Screen<div class="meta">stage 2 / 4</div></div><div class="bar-bg"><div class="bar-fill" style="width:65%"></div></div><div class="count">920</div><div class="ageing">avg 1.2d</div></div></div>`,
  '.funnel-stage': () => CSS_TEMPLATES['.funnel'](),
  '.bottleneck': () =>
    `<div class="bottleneck" style="max-width:480px"><strong>BOTTLENECK</strong><p>Screen → Interview drop-off 38% (industry avg 22%). Action: review screening criteria.</p></div>`,
  '.kanban': () =>
    `<div class="kanban" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="kanban-col"><h3>Day 1<span class="count">3</span></h3><div class="kanban-card"><div class="name">Setup laptop</div><div class="meta">IT</div><div class="progress"><div class="progress-fill" style="background:var(--accent);width:100%;height:100%"></div></div></div></div><div class="kanban-col"><h3>Week 1<span class="count">5</span></h3><div class="kanban-card"><div class="name">Team intro</div><div class="meta">HR</div></div></div><div class="kanban-col"><h3>Month 1<span class="count">8</span></h3></div><div class="kanban-col"><h3>Month 3<span class="count">4</span></h3></div></div>`,
  '.kanban-col': () => CSS_TEMPLATES['.kanban'](),
  '.kanban-card': () =>
    `<div class="kanban-card" style="max-width:200px"><div class="name">Team intro</div><div class="meta">HR · day 2</div><div class="progress"><div class="progress-fill" style="background:var(--accent);width:60%;height:100%"></div></div></div>`,
  '.milestone-grid': () =>
    `<div class="milestone-grid" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="milestone done"><h4>Setup complete</h4><div class="day">DAY 1</div><p>IT + HR onboarding</p></div><div class="milestone"><h4>First review</h4><div class="day">WEEK 4</div><p>Manager check-in</p></div><div class="milestone due"><h4>30-day review</h4><div class="day">DAY 30</div><p>Pending</p></div></div>`,
  '.milestone': () =>
    `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:480px"><div class="milestone done"><h4>Setup</h4><div class="day">DAY 1</div></div><div class="milestone"><h4>Review</h4><div class="day">WEEK 4</div></div><div class="milestone due"><h4>30-day</h4><div class="day">DAY 30</div></div></div>`,
  '.okr-row': () =>
    `<div style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="okr-row"><div class="obj">Reduce DSO 25%<div class="meta">Finance · Q4</div></div><div class="bar-bg"><div class="bar-fill" style="width:72%"></div></div><div class="pct">72%</div></div><div class="okr-row"><div class="obj">Increase NPS to 60<div class="meta">CX · Q4</div></div><div class="bar-bg"><div class="bar-fill" style="width:48%"></div></div><div class="pct">48%</div></div></div>`,
  '.review-grid': () =>
    `<div class="review-grid" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="review-card"><h4>360 review · Q4</h4><div class="meta">Manager + 3 peers</div><div class="review-stat"><span class="lbl">Self</span><span class="v">4.2</span></div><div class="review-stat"><span class="lbl">Manager</span><span class="v">4.0</span></div><div class="review-stat"><span class="lbl">Peers</span><span class="v">4.4</span></div></div><div class="review-card"><h4>Goals review</h4><div class="meta">Q4 OKRs</div><div class="review-stat"><span class="lbl">Met</span><span class="v">3/5</span></div><div class="review-stat"><span class="lbl">Exceeded</span><span class="v">1/5</span></div></div></div>`,
  '.review-card': () =>
    `<div class="review-card" style="max-width:280px"><h4>360 review · Q4</h4><div class="meta">Manager + 3 peers</div><div class="review-stat"><span class="lbl">Self</span><span class="v">4.2</span></div><div class="review-stat"><span class="lbl">Manager</span><span class="v">4.0</span></div></div>`,
  '.review-stat': () =>
    `<div style="background:var(--surface-2);padding:10px 14px;border-radius:6px;max-width:280px"><div class="review-stat"><span class="lbl">Self</span><span class="v">4.2</span></div><div class="review-stat"><span class="lbl">Manager</span><span class="v">4.0</span></div><div class="review-stat"><span class="lbl">Peers</span><span class="v">4.4</span></div></div>`,
  '.path-row': () =>
    `<div style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:640px"><div class="path-row"><div class="name">SQL Mastery<div class="meta">12 modules · 8h total</div></div><div class="bar-bg"><div class="bar-fill" style="width:65%"></div></div><div class="count">65%</div><div class="uplift">+12% NPS</div></div><div class="path-row"><div class="name">Leadership 101<div class="meta">8 modules · 6h</div></div><div class="bar-bg"><div class="bar-fill" style="width:42%"></div></div><div class="count">42%</div><div class="uplift">+8% NPS</div></div></div>`,
  '.bridge': () =>
    `<div class="bridge" style="background:var(--surface-1);border:1px solid var(--rule);border-radius:8px;max-width:480px"><div class="bridge-card"><div><h4>Python · advanced</h4><p>Bridge to Lead Risk role · 14h training path</p></div><div class="delta">+18 readiness</div></div><div class="bridge-card"><div><h4>Stakeholder mgmt</h4><p>Cross-functional facilitation · 8h workshops</p></div><div class="delta">+12 readiness</div></div></div>`,
};

// ========== VARIANTS PER ASSET ==========

const VARIANTS = {
  '.pill': [
    { name: 'default', html: `<span class="pill">DEFAULT</span>`, modifier: '(no modifier)' },
    { name: 'pill-ok', html: `<span class="pill pill-ok">OK</span>`, modifier: '.pill-ok' },
    { name: 'pill-warn', html: `<span class="pill pill-warn">WARN</span>`, modifier: '.pill-warn' },
    {
      name: 'pill-critical',
      html: `<span class="pill pill-critical">CRITICAL</span>`,
      modifier: '.pill-critical',
    },
    { name: 'pill-info', html: `<span class="pill pill-info">INFO</span>`, modifier: '.pill-info' },
    {
      name: 'pill-meets',
      html: `<span class="pill pill-meets">MEETS</span>`,
      modifier: '.pill-meets',
    },
    {
      name: 'pill-exceeds',
      html: `<span class="pill pill-exceeds">EXCEEDS</span>`,
      modifier: '.pill-exceeds',
    },
    { name: 'pill-grow', html: `<span class="pill pill-grow">GROW</span>`, modifier: '.pill-grow' },
  ],
  '.btn': [
    {
      name: 'primary',
      html: `<button class="btn btn-primary">Save</button>`,
      modifier: '.btn-primary',
    },
    {
      name: 'ghost',
      html: `<button class="btn btn-ghost">Cancel</button>`,
      modifier: '.btn-ghost',
    },
    {
      name: 'primary-disabled',
      html: `<button class="btn btn-primary" disabled>Disabled</button>`,
      modifier: '.btn-primary[disabled]',
    },
  ],
  '.bar-fill': [
    {
      name: 'fill-info',
      html: `<div style="background:var(--surface-3);height:8px;border-radius:4px"><span class="bar-fill fill-info" style="display:block;height:100%;width:60%"></span></div>`,
      modifier: '.fill-info',
    },
    {
      name: 'fill-ok',
      html: `<div style="background:var(--surface-3);height:8px;border-radius:4px"><span class="bar-fill fill-ok" style="display:block;height:100%;width:88%"></span></div>`,
      modifier: '.fill-ok',
    },
    {
      name: 'fill-warn',
      html: `<div style="background:var(--surface-3);height:8px;border-radius:4px"><span class="bar-fill fill-warn" style="display:block;height:100%;width:42%"></span></div>`,
      modifier: '.fill-warn',
    },
    {
      name: 'fill-critical',
      html: `<div style="background:var(--surface-3);height:8px;border-radius:4px"><span class="bar-fill fill-critical" style="display:block;height:100%;width:22%"></span></div>`,
      modifier: '.fill-critical',
    },
  ],
  '.tenant-card': [
    {
      name: 'platform',
      html: `<article class="tenant-card platform" style="max-width:280px"><span class="tag tag-platform">PLATFORM</span><h3>Heuresys System</h3><div class="tid">platform · landlord</div></article>`,
      modifier: '.platform',
    },
    {
      name: 'tenant',
      html: `<article class="tenant-card" style="max-width:280px"><span class="tag tag-tenant">TENANT</span><h3>RTL Bank</h3><div class="tid">rtl-bank</div></article>`,
      modifier: '(default)',
    },
  ],
  '.career-stage': [
    {
      name: 'past',
      html: `<div class="career-arc" style="max-width:200px"><div class="career-stage past"><div class="dot">1</div><div class="label">Junior</div><div class="year">2018</div></div></div>`,
      modifier: '.past',
    },
    {
      name: 'current',
      html: `<div class="career-arc" style="max-width:200px"><div class="career-stage current"><div class="dot">2</div><div class="label">Senior</div><div class="year">2023</div></div></div>`,
      modifier: '.current',
    },
    {
      name: 'future',
      html: `<div class="career-arc" style="max-width:200px"><div class="career-stage future"><div class="dot">3</div><div class="label">Lead</div><div class="year">2026 →</div></div></div>`,
      modifier: '.future',
    },
  ],
  '.wordmark': [
    { name: 'hero', html: `<span class="wordmark">heuresys</span>`, modifier: '.wordmark · 22px' },
    {
      name: 'sm',
      html: `<span class="wordmark-sm">heuresys</span>`,
      modifier: '.wordmark-sm · 18px',
    },
    {
      name: 'foot',
      html: `<span class="wordmark-foot">heuresys</span>`,
      modifier: '.wordmark-foot · 14px',
    },
    {
      name: 'legacy',
      html: `<span class="wordmark-sm legacy">heuresys</span>`,
      modifier: '.legacy · brand-blue body',
    },
  ],
  '.heatmap-cell': [
    {
      name: 'heat-0',
      html: `<div class="heatmap-cell heat-0" style="width:80px;height:40px;display:grid;place-items:center">10</div>`,
      modifier: '.heat-0 (low)',
    },
    {
      name: 'heat-2',
      html: `<div class="heatmap-cell heat-2" style="width:80px;height:40px;display:grid;place-items:center">40</div>`,
      modifier: '.heat-2',
    },
    {
      name: 'heat-4',
      html: `<div class="heatmap-cell heat-4" style="width:80px;height:40px;display:grid;place-items:center">70</div>`,
      modifier: '.heat-4',
    },
    {
      name: 'heat-6',
      html: `<div class="heatmap-cell heat-6" style="width:80px;height:40px;display:grid;place-items:center">99</div>`,
      modifier: '.heat-6 (high)',
    },
  ],
};

// ========== MOCKUP-DRIVEN VARIANTS (post-L46 import) ==========
// Variants estratte da .ux-design/06-mockups/dashboards/org-systems.html.
// Differenza vs VARIANTS sopra: queste sono variants graphical riconosciute
// SOLO leggendo il mockup (non da .stories.tsx né da CSS modifier-pattern).

const MOCKUP_DRIVEN_VARIANTS = {
  '.tenant-card': [
    {
      name: 'platform',
      modifier: '.platform',
      html: `<article class="tenant-card platform" style="max-width:280px"><span class="tag tag-platform">PLATFORM</span><h3>Heuresys System</h3><div class="tid">platform · landlord</div><div class="health"><span class="dot"></span><span class="lbl"><strong>OK</strong> all systems healthy</span></div></article>`,
      notes: 'Landlord variant: accent border + accent-soft bg. Per Heuresys System tenant.',
    },
  ],
  '.sidebar-link': [
    {
      name: 'active',
      modifier: '.active',
      html: `<a href="#" class="sidebar-link active" style="display:inline-block;width:200px"><span class="glyph"></span>Dashboard<span class="num">12</span></a>`,
      notes: 'Active route: surface-3 bg + brand-blue 2px border-left.',
    },
  ],
  '.sidebar-section': [
    {
      name: 'collapsed',
      modifier: '.collapsed',
      html: `<div class="sidebar-section collapsed" style="background:var(--surface-1);border-radius:4px"><h4>WORKSPACE <span class="chev">▶</span></h4></div>`,
      notes: 'Section collapsed: children hidden, chevron rotated 0.2s.',
    },
  ],
  '.wordmark-sm': [
    {
      name: 'legacy',
      modifier: '.legacy',
      html: `<span class="wordmark-sm legacy">heuresys</span>`,
      notes: 'Legacy theme variant: brand-blue body + accent y (post-L28).',
    },
  ],
  '.tenant-mini': [
    {
      name: 'avatar-bordered',
      modifier: '.t-avatar.bordered',
      html: `<div class="tenant-mini" style="background:var(--surface-1);border-radius:6px"><div class="ti bordered">RB</div><div class="t-info"><div class="t-name">RTL Bank</div><div class="t-meta">rtl-bank · active</div></div></div>`,
      notes:
        'Bordered tenant avatar: brand-blue border + accent text. Used in sidebar-top tenant-mini.',
    },
  ],
  '.user-card': [
    {
      name: 'avatar-bordered-inverse',
      modifier: '.avatar.bordered-inverse',
      html: `<div class="user-card" style="background:var(--surface-1);border-radius:6px"><div class="avatar bordered-inverse">VC</div><div class="info"><div class="name">valentina.conti</div><div class="role">HR_DIRECTOR</div></div></div>`,
      notes:
        'Inverse-bordered avatar: accent border + brand-blue text. Used in sidebar bottom user-card.',
    },
  ],
  '.tenant-card .health': [
    {
      name: 'dot-warn',
      modifier: '.dot.warn',
      html: `<div class="health" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--rule);display:flex;align-items:center;gap:8px"><span class="dot warn"></span><span class="lbl"><strong>WARN</strong> 1 integration degraded</span></div>`,
      notes: 'Health warn variant: amber glow (--semantic-warning) vs default success green.',
    },
  ],
  // L47 — KPI compact variant (skills-heatmap)
  '.kpi-card': [
    {
      name: 'compact',
      modifier: '.compact',
      html: `<div class="kpi-card compact" style="max-width:200px"><div class="lbl">SKILL COVERAGE</div><div class="val" style="font-size:28px">73<span class="unit"> %</span></div><div class="sub">company-wide · Q4</div></div>`,
      notes:
        'Compact variant per skills-heatmap focus: padding 16/20px (vs 18/20), font 28px (vs 32px). Use case: layout heatmap-centric con KPI ridotte.',
    },
  ],
  // L47 — Gauge card large variant (cross-tenant single-context)
  '.gauge-card': [
    {
      name: 'large',
      modifier: '.large',
      html: `<div class="gauge-card large" style="max-width:240px"><div class="lbl">PLATFORM HEALTH</div><div class="gauge-ring"><svg viewBox="0 0 160 160"><circle cx="80" cy="80" r="68" fill="none" stroke="var(--rule)" stroke-width="8"/><circle cx="80" cy="80" r="68" fill="none" stroke="var(--accent)" stroke-width="8" stroke-dasharray="427" stroke-dashoffset="80" transform="rotate(-90 80 80)"/></svg></div></div>`,
      notes:
        'Large variant: 160px ring (vs default smaller). Per single-gauge layout in cross-tenant overview.',
    },
  ],
  // L47 — Pill capability tones (5 variants, capability-graph)
  '.pill': [
    {
      name: 'cap-process',
      modifier: '.pill-process',
      html: `<span class="pill pill-process">PROCESS</span>`,
      notes: 'Capability tone: process (var(--cap-process) blue).',
    },
    {
      name: 'cap-structure',
      modifier: '.pill-structure',
      html: `<span class="pill pill-structure">STRUCTURE</span>`,
      notes: 'Capability tone: structure (var(--cap-structure) indigo).',
    },
    {
      name: 'cap-role',
      modifier: '.pill-role',
      html: `<span class="pill pill-role">ROLE</span>`,
      notes: 'Capability tone: role (var(--accent) purple).',
    },
    {
      name: 'cap-competence',
      modifier: '.pill-competence',
      html: `<span class="pill pill-competence">COMPETENCE</span>`,
      notes: 'Capability tone: competence (var(--cap-competence) green).',
    },
    {
      name: 'cap-performance',
      modifier: '.pill-performance',
      html: `<span class="pill pill-performance">PERFORMANCE</span>`,
      notes: 'Capability tone: performance (var(--cap-performance) amber).',
    },
  ],
  // L47 — Profile badge (employee-journey)
  '.pbadge': [
    {
      name: 'role',
      modifier: '.role',
      html: `<span class="pbadge role">Analyst</span>`,
      notes: 'Role badge: accent border + soft fill.',
    },
    {
      name: 'dept',
      modifier: '.dept',
      html: `<span class="pbadge dept">Credit Risk</span>`,
      notes: 'Department badge: surface-2 + ink with rule-strong border.',
    },
    {
      name: 'tenure',
      modifier: '.tenure',
      html: `<span class="pbadge tenure">4y 2m</span>`,
      notes: 'Tenure badge: success tint + border.',
    },
  ],
  // L47 — Career arc events (employee-journey)
  '.arc-event': [
    {
      name: 'done',
      modifier: '.done',
      html: `<div class="arc-grid" style="max-width:200px"><div class="arc-event done"><div class="when">2018</div><div class="dot"></div><div class="role-name">Junior</div></div></div>`,
      notes: 'Past stage: filled accent dot with glow.',
    },
    {
      name: 'current',
      modifier: '.current',
      html: `<div class="arc-grid" style="max-width:200px"><div class="arc-event current"><div class="when">2023</div><div class="dot"></div><div class="role-name">Senior</div></div></div>`,
      notes: 'Current stage: outlined accent dot with bigger glow + inner accent dot.',
    },
  ],
  // L47 — Onboarding milestones
  '.milestone': [
    {
      name: 'done',
      modifier: '.done',
      html: `<div class="milestone done" style="max-width:200px"><h4>Setup complete</h4><div class="day">DAY 1</div><p>IT + HR onboarding</p></div>`,
      notes: 'Done milestone: border-left semantic-success.',
    },
    {
      name: 'due',
      modifier: '.due',
      html: `<div class="milestone due" style="max-width:200px"><h4>30-day review</h4><div class="day">DAY 30</div><p>Pending</p></div>`,
      notes: 'Due milestone: border-left semantic-warning.',
    },
  ],
};

// ========== EXPORTS ==========

export function mockupVariantsFor(name) {
  return MOCKUP_DRIVEN_VARIANTS[name] ?? [];
}

export function previewFor(name) {
  if (CSS_TEMPLATES[name]) return CSS_TEMPLATES[name]();
  // Fallback for sub-elements or unknown — naive single class wrapper
  if (name.startsWith('.')) {
    const cls = name.slice(1);
    return `<div class="${cls}" style="padding:8px">.${cls}</div>`;
  }
  return null;
}

export function variantsFor(name) {
  return VARIANTS[name] ?? [];
}

export function hasTemplate(name) {
  return name in CSS_TEMPLATES;
}
