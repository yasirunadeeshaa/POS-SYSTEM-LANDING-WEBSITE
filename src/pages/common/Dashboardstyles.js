// dashboardStyles.js — shared CSS for all dashboard/page layouts

export const DASHBOARD_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Geist+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }
  @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }

  /* ── Row Tile ── */
  .row-tile {
    display:flex; align-items:center; gap:9px; padding:7px 8px; border-radius:9px; cursor:pointer;
    background:transparent; border:1px solid transparent; width:100%; text-align:left;
    font-family:'DM Sans',sans-serif; transition:all 0.14s; margin-bottom:3px; animation:fadeUp 0.2s ease both;
  }
  .row-tile:hover { background:#fff; border-color:rgba(26,22,17,0.08); transform:translateX(2px); box-shadow:0 2px 8px rgba(26,22,17,0.06); }
  .row-tile:hover .rt-arrow { opacity:1; transform:translateX(0); }
  .row-tile:hover .rt-icon  { transform:scale(1.07); }
  .rt-icon  { transition:transform 0.14s; flex-shrink:0; }
  .rt-arrow { font-size:10px; color:#C8BFB4; opacity:0; transform:translateX(-4px); transition:all 0.14s; flex-shrink:0; }

  /* ── Prime Tile ── */
  .prime-tile {
    display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:10px;
    cursor:pointer; width:100%; text-align:left; font-family:'DM Sans',sans-serif;
    transition:all 0.14s; margin-bottom:5px; animation:fadeUp 0.2s ease both;
  }
  .prime-tile:hover { transform:translateX(2px); filter:brightness(1.04); }
  .prime-tile:hover .prime-icon { transform:scale(1.07); }
  .prime-icon { transition:transform 0.14s; flex-shrink:0; }

  /* ── Doc Quick-Launch Tile ── */
  .doc-launch-tile {
    flex-shrink:0; width:108px; background:#FDFBF4; border:1px solid rgba(26,22,17,0.09);
    border-radius:12px; padding:10px 8px 9px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:5px;
    transition:all 0.15s; animation:fadeUp 0.2s ease both;
    position:relative; overflow:hidden; font-family:'DM Sans',sans-serif;
  }
  .doc-launch-tile:hover { background:#fff; border-color:rgba(26,22,17,0.15); transform:translateY(-2px); box-shadow:0 6px 20px rgba(26,22,17,0.1); }
  .doc-launch-tile:hover .doc-launch-icon { transform:scale(1.1); }
  .doc-launch-icon  { font-size:22px; line-height:1; transition:transform 0.15s; margin-bottom:1px; }
  .doc-launch-label { font-size:11px; font-weight:700; color:#1A1611; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; }
  .doc-launch-desc  { font-size:9px; color:#9B8E80; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%; }
  .doc-launch-badge { font-size:7.5px; font-weight:700; padding:2px 7px; border-radius:20px; letter-spacing:0.4px; margin-top:1px; }

  /* ── Sub Column ── */
  .sub-col {
    background:#FDFBF4; border:1px solid rgba(26,22,17,0.09); border-radius:12px;
    overflow:hidden; display:flex; flex-direction:column;
    box-shadow:0 1px 3px rgba(26,22,17,0.04); transition:box-shadow 0.2s;
  }
  .sub-col:hover { box-shadow:0 4px 18px rgba(26,22,17,0.08); }

  /* ── Col Header ── */
  .col-head {
    padding:10px 12px 9px; border-bottom:1px solid rgba(26,22,17,0.06);
    background:linear-gradient(180deg,#fff 0%,rgba(253,251,245,0.5) 100%);
    flex-shrink:0; display:flex; align-items:center; justify-content:space-between; position:relative;
  }
  .col-head-accent { position:absolute; top:0; left:0; right:0; height:2.5px; border-radius:12px 12px 0 0; }
  .col-head-left   { display:flex; align-items:center; gap:8px; }
  .col-icon-wrap   { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .col-title       { font-family:'Playfair Display',serif; font-size:13px; font-weight:700; color:#1A1611; letter-spacing:0.1px; }
  .col-count       { font-size:8px; font-weight:700; padding:2px 7px; border-radius:20px; letter-spacing:0.5px; }

  /* ── Col Body ── */
  .col-body { flex:1; overflow-y:auto; padding:7px; background:rgba(245,242,236,0.3); }
  .col-body::-webkit-scrollbar { width:3px; }
  .col-body::-webkit-scrollbar-thumb { background:rgba(26,22,17,0.1); border-radius:3px; }

  /* ── Section Divider ── */
  .sec-divider {
    display:flex; align-items:center; gap:6px; font-size:7.5px; font-weight:700;
    letter-spacing:2px; text-transform:uppercase; color:#A89E90; padding:5px 4px 3px; margin-top:3px;
  }
  .sec-divider::after { content:''; flex:1; height:1px; background:rgba(26,22,17,0.07); }

  /* ── Right Panel Cards ── */
  .w-card { background:#FDFBF5; border:1px solid #E4DDD3; border-radius:12px; overflow:hidden; flex-shrink:0; box-shadow:0 1px 4px rgba(26,22,17,0.04); }
  .w-head { display:flex; align-items:center; justify-content:space-between; padding:8px 12px 7px; border-bottom:1px solid rgba(26,22,17,0.055); background:linear-gradient(180deg,#FDFBF5 0%,rgba(253,251,245,0.6) 100%); }

  /* ── RC Tile (right column) ── */
  .rc-tile {
    display:flex; align-items:center; gap:8px; padding:7px 9px; border-radius:8px; cursor:pointer;
    background:rgba(255,255,255,0.52); border:1px solid rgba(26,22,17,0.07);
    font-family:'DM Sans',sans-serif; transition:all 0.14s; width:100%;
    position:relative; overflow:hidden; animation:slideIn 0.2s ease both;
  }
  .rc-tile::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2.5px; background:var(--tile-accent,transparent); opacity:0; transition:opacity 0.15s; }
  .rc-tile:hover { background:#fff; border-color:rgba(26,22,17,0.12); box-shadow:0 2px 8px rgba(26,22,17,0.08); transform:translateY(-1px); }
  .rc-tile:hover::before { opacity:1; }

  /* ── Scroll ── */
  .col-scroll::-webkit-scrollbar { width:3px; }
  .col-scroll::-webkit-scrollbar-track { background:transparent; }
  .col-scroll::-webkit-scrollbar-thumb { background:rgba(26,22,17,0.1); border-radius:3px; }

  /* ── KPI Chip ── */
  .kpi-chip { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.09); border-radius:9px; padding:5px 12px; text-align:right; }
  .kpi-lbl  { font-size:7.5px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(181,138,36,0.55); font-weight:700; font-family:'DM Sans',sans-serif; }
  .kpi-val  { font-family:'Geist Mono',monospace; font-size:13px; font-weight:600; color:#F4F1E9; margin-top:2px; }

  /* ── Left Sidebar ── */
  .left-sidebar {
    width:54px; flex-shrink:0; background:#1A1611; border-right:1px solid rgba(181,138,36,0.18);
    display:flex; flex-direction:column; align-items:center; padding:10px 0 8px; gap:2px; overflow:hidden;
  }

  /* ── Right Sidebar ── */
  .right-sidebar {
    width:54px; flex-shrink:0; background:#1A1611; border-left:1px solid rgba(181,138,36,0.18);
    display:flex; flex-direction:column; align-items:center; padding:10px 0 8px; gap:2px; overflow:hidden;
  }

  /* ── Nav Items (both sidebars) ── */
  .nav-item {
    width:40px; height:40px; border-radius:9px; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:2px; position:relative; transition:all 0.14s;
    background:transparent; border:1px solid transparent; flex-shrink:0;
  }
  .nav-item:hover { background:rgba(244,241,233,0.08); border-color:rgba(244,241,233,0.06); }
  .nav-item.nav-active { background:rgba(181,138,36,0.12); border-color:rgba(181,138,36,0.3); }
  .nav-icon  { font-size:15px; line-height:1; }
  .nav-label { font-size:6.5px; font-weight:700; letter-spacing:0.3px; text-transform:uppercase; color:rgba(244,241,233,0.28); line-height:1; }
  .nav-item.nav-active .nav-label { color:rgba(181,138,36,0.75); }
  .nav-badge {
    position:absolute; top:3px; right:3px; width:13px; height:13px; background:#B03428;
    border-radius:50%; border:1.5px solid #1A1611; font-size:6.5px; color:#fff; font-weight:700;
    display:flex; align-items:center; justify-content:center;
  }
  .nav-divider { width:28px; height:1px; background:rgba(244,241,233,0.07); margin:5px 0; flex-shrink:0; }
  .nav-spacer  { flex:1; }

  /* ── Bottom Status Bar ── */
  .bottom-bar {
    height:30px; flex-shrink:0; background:#1A1611; border-top:1px solid rgba(181,138,36,0.18);
    display:flex; align-items:center; padding:0 16px; gap:0; overflow:hidden;
  }
  .bb-item { display:flex; align-items:center; gap:5px; padding:0 13px; border-right:1px solid rgba(244,241,233,0.07); white-space:nowrap; }
  .bb-item:first-child { padding-left:0; }
  .bb-item:last-child  { border-right:none; }
  .bb-label { font-size:7.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(181,138,36,0.5); font-family:'DM Sans',sans-serif; }
  .bb-value { font-family:'Geist Mono',monospace; font-size:9.5px; font-weight:600; color:rgba(244,241,233,0.42); }
  .bb-dot   { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
  .bb-spacer { flex:1; }

  /* ── Stat Mini (used in widgets) ── */
  .stat-mini { background:#fff; border:1px solid rgba(26,22,17,0.07); border-radius:8px; padding:7px 9px; }
  /* ── Column Scroll Fix ── */
.col-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(26,22,17,0.12) transparent;
}
.col-scroll::-webkit-scrollbar { width: 3px; }
.col-scroll::-webkit-scrollbar-track { background: transparent; }
.col-scroll::-webkit-scrollbar-thumb { background: rgba(26,22,17,0.12); border-radius: 3px; }
.col-scroll::-webkit-scrollbar-thumb:hover { background: rgba(26,22,17,0.22); }

/* ── Sub Column ── */
.sub-col {
  background: #FDFBF4;
  border: 1px solid rgba(26,22,17,0.09);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(26,22,17,0.04);
  transition: box-shadow 0.2s;
  min-height: 0;        /* ← critical for flex scroll to work */
}
.sub-col:hover { box-shadow: 0 4px 18px rgba(26,22,17,0.08); }

/* ── Col Body (scrollable area inside sub-col) ── */
.col-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 7px;
  background: rgba(245,242,236,0.3);
  min-height: 0;        /* ← critical */
  scrollbar-width: thin;
  scrollbar-color: rgba(26,22,17,0.12) transparent;
}
.col-body::-webkit-scrollbar { width: 3px; }
.col-body::-webkit-scrollbar-track { background: transparent; }
.col-body::-webkit-scrollbar-thumb { background: rgba(26,22,17,0.12); border-radius: 3px; }
.col-body::-webkit-scrollbar-thumb:hover { background: rgba(26,22,17,0.22); }
`;