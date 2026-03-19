import { useState, useMemo, useRef, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  { id: 1,  name: "Electronics",  slug: "electronics",  description: "Gadgets, devices and tech accessories for everyday use.",        icon: "⚡", color: "#2B5490", products: 4,  active: true,  featured: true,  sortOrder: 1,  parent: null,          createdAt: "2024-01-10" },
  { id: 2,  name: "Apparel",      slug: "apparel",       description: "Clothing, footwear and fashion items for all occasions.",         icon: "👕", color: "#5B3D8F", products: 2,  active: true,  featured: true,  sortOrder: 2,  parent: null,          createdAt: "2024-01-10" },
  { id: 3,  name: "Accessories",  slug: "accessories",   description: "Bags, wallets, belts and personal accessories.",                 icon: "👜", color: "#B8902A", products: 3,  active: true,  featured: false, sortOrder: 3,  parent: null,          createdAt: "2024-01-12" },
  { id: 4,  name: "Home",         slug: "home",           description: "Homewares, decor, kitchenware and household essentials.",        icon: "🏠", color: "#7A5C1E", products: 4,  active: true,  featured: true,  sortOrder: 4,  parent: null,          createdAt: "2024-01-15" },
  { id: 5,  name: "Lifestyle",    slug: "lifestyle",     description: "Health, wellness and everyday lifestyle products.",              icon: "🍃", color: "#2D6A4F", products: 2,  active: true,  featured: false, sortOrder: 5,  parent: null,          createdAt: "2024-01-18" },
  { id: 6,  name: "Stationery",   slug: "stationery",    description: "Notebooks, pens, desk organizers and office supplies.",          icon: "✏️", color: "#9E9080", products: 3,  active: true,  featured: false, sortOrder: 6,  parent: null,          createdAt: "2024-01-20" },
  { id: 7,  name: "Sports",       slug: "sports",        description: "Fitness equipment, activewear and sporting goods.",              icon: "🏃", color: "#B5372A", products: 2,  active: true,  featured: true,  sortOrder: 7,  parent: null,          createdAt: "2024-02-01" },
  { id: 8,  name: "Beauty",       slug: "beauty",        description: "Skincare, cosmetics and personal care products.",                icon: "✨", color: "#8A3A6A", products: 0,  active: false, featured: false, sortOrder: 8,  parent: null,          createdAt: "2024-02-10" },
  { id: 9,  name: "Smartphones",  slug: "smartphones",   description: "Mobile phones and smart devices.",                              icon: "📱", color: "#2B5490", products: 1,  active: true,  featured: false, sortOrder: 1,  parent: "Electronics", createdAt: "2024-02-14" },
  { id: 10, name: "Audio",        slug: "audio",         description: "Headphones, speakers and audio accessories.",                   icon: "🎧", color: "#2B5490", products: 2,  active: true,  featured: false, sortOrder: 2,  parent: "Electronics", createdAt: "2024-02-14" },
  { id: 11, name: "Tops & Tees",  slug: "tops-tees",     description: "T-shirts, blouses, and casual tops.",                          icon: "🧥", color: "#5B3D8F", products: 3,  active: true,  featured: false, sortOrder: 1,  parent: "Apparel",     createdAt: "2024-02-20" },
  { id: 12, name: "Footwear",     slug: "footwear",      description: "Shoes, sandals, boots and sneakers.",                          icon: "👟", color: "#5B3D8F", products: 0,  active: false, featured: false, sortOrder: 2,  parent: "Apparel",     createdAt: "2024-03-01" },
];

const COLOR_PRESETS = [
  "#2B5490","#5B3D8F","#B8902A","#2D6A4F","#B5372A","#7A5C1E",
  "#9E9080","#8A3A6A","#1B6B8A","#3D7A3A","#8A5A1A","#5A1B6A",
];

const ICONS = ["📦","⚡","👕","👜","🏠","🍃","✏️","🏃","✨","📱","🎧","🧥","👟","💄","🍕","🎮","🛒","🔧","🎵","📚","🌿","💎","🧴","🏋️"];

const fmt = (n) => Number(n || 0).toLocaleString("en");

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:#F6F3EC; --paper:#FDFBF7; --warm:#F0EBE0; --warm2:#E8E2D4;
    --ink:#1B1713; --ink80:#2E2720; --ink60:#4B4038; --ink50:#6B5F54;
    --ink40:#9E9080; --ink30:#B8AFA4; --ink20:#CFC8BC; --ink10:#E4DDD2;
    --ink06:#EDE8E0; --ink03:#F5F1EB;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenl:#3D8A65;
    --greenbg:rgba(45,106,79,.07); --greenbr:rgba(45,106,79,.22);
    --red:#B5372A; --redbg:rgba(181,55,42,.07); --redbr:rgba(181,55,42,.2);
    --blue:#2B5490; --bluebg:rgba(43,84,144,.07); --bluebr:rgba(43,84,144,.22);
    --shadow-xs:0 1px 2px rgba(27,23,19,.04);
    --shadow-sm:0 2px 8px rgba(27,23,19,.06),0 1px 2px rgba(27,23,19,.04);
    --shadow-md:0 6px 20px rgba(27,23,19,.09),0 2px 4px rgba(27,23,19,.05);
    --shadow-lg:0 20px 60px rgba(27,23,19,.18),0 6px 16px rgba(27,23,19,.1);
    --topbar-h:60px;
  }

  html,body,#root { height:100%; background:var(--cream); overflow:hidden; }

  .shell {
    display:flex; flex-direction:column; height:100vh;
    font-family:'Outfit',sans-serif; color:var(--ink);
    background:var(--cream);
    background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(184,144,42,.05) 0%,transparent 60%);
  }

  /* ══ TOPBAR ══ */
  .topbar {
    height:var(--topbar-h); flex-shrink:0;
    background:var(--ink); border-bottom:1px solid rgba(184,144,42,.35);
    display:flex; align-items:center; justify-content:space-between;
    padding:0 28px; z-index:100; position:relative;
  }
  .topbar::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent 0%,var(--goldl) 30%,var(--gold) 70%,transparent 100%);
    opacity:.4;
  }
  .topbar-left  { display:flex; align-items:center; gap:24px; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .brand { display:flex; align-items:center; gap:13px; }
  .brand-mark {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.45); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:var(--goldl);
  }
  .brand-name { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; letter-spacing:.2px; line-height:1; }
  .brand-sub  { font-size:9px; font-weight:600; letter-spacing:2.2px; text-transform:uppercase; color:rgba(184,144,42,.7); line-height:1; }
  .breadcrumb { display:flex; align-items:center; gap:8px; font-size:11.5px; font-weight:500; }
  .bc-sep    { color:rgba(246,243,236,.15); }
  .bc-link   { color:rgba(246,243,236,.3); cursor:pointer; transition:color .15s; }
  .bc-link:hover { color:rgba(246,243,236,.65); }
  .bc-active { color:rgba(246,243,236,.75); font-weight:600; }
  .vdiv { width:1px; height:22px; background:rgba(246,243,236,.08); flex-shrink:0; }
  .avatar {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.3); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; color:var(--goldl); cursor:pointer;
  }

  /* ══ CONTENT ══ */
  .content {
    flex:1; overflow-y:auto; padding:22px 28px 36px;
    display:flex; flex-direction:column; gap:18px;
  }
  .content::-webkit-scrollbar { width:3px; }
  .content::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* ══ PAGE HEADER ══ */
  .page-header {
    display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap;
    animation:fadeUp .3s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .page-eyebrow {
    font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase;
    color:var(--gold); margin-bottom:5px; display:flex; align-items:center; gap:8px;
  }
  .page-eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); opacity:.5; }
  .page-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:600; color:var(--ink); letter-spacing:-.2px; line-height:1; margin-bottom:5px; }
  .page-desc  { font-size:12.5px; color:var(--ink40); }
  .page-actions { display:flex; gap:10px; align-items:center; }

  /* Buttons */
  .btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 18px; border-radius:6px;
    font-size:12.5px; font-weight:600; cursor:pointer;
    font-family:'Outfit',sans-serif; letter-spacing:.2px;
    border:1px solid transparent; transition:all .2s;
  }
  .btn-ghost { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .btn-ghost:hover { border-color:var(--ink20); color:var(--ink60); background:var(--warm); }
  .btn-gold {
    background:var(--gold); border-color:var(--goldd); color:#fff;
    box-shadow:0 2px 8px rgba(184,144,42,.3);
  }
  .btn-gold:hover { background:var(--goldl); box-shadow:0 4px 16px rgba(184,144,42,.4); transform:translateY(-1px); }
  .btn-green { background:var(--green); border-color:#205038; color:#fff; box-shadow:0 2px 8px rgba(45,106,79,.25); }
  .btn-green:hover { background:var(--greenl); box-shadow:0 4px 14px rgba(45,106,79,.35); transform:translateY(-1px); }
  .btn-red { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .btn-red:hover { background:rgba(181,55,42,.14); }

  /* ══ STAT STRIP ══ */
  .stat-strip {
    display:grid; grid-template-columns:repeat(4,1fr); gap:10px;
    animation:fadeUp .35s ease both; animation-delay:40ms;
  }
  .stat-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 16px; box-shadow:var(--shadow-xs);
    position:relative; overflow:hidden; cursor:default;
    transition:box-shadow .2s,transform .2s;
  }
  .stat-card:hover { box-shadow:var(--shadow-sm); transform:translateY(-1px); }
  .stat-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,var(--sc),transparent);
  }
  .stat-lbl { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); margin-bottom:8px; }
  .stat-val { font-family:'Geist Mono',monospace; font-size:26px; font-weight:600; color:var(--sc); line-height:1; }
  .stat-sub { font-size:10.5px; color:var(--ink40); margin-top:4px; }

  /* ══ FILTER BAR ══ */
  .filter-bar {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 18px;
    box-shadow:var(--shadow-xs);
    display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
    animation:fadeUp .4s ease both; animation-delay:70ms;
  }
  .filter-group { display:flex; flex-direction:column; gap:6px; }
  .filter-label { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); }

  .search-wrap { position:relative; flex:1; min-width:200px; }
  .search-ico  { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--ink30); pointer-events:none; }
  .search-input {
    width:100%; padding:9px 12px 9px 36px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:13px; font-weight:500; color:var(--ink); outline:none; transition:all .18s;
  }
  .search-input::placeholder { color:var(--ink20); }
  .search-input:hover { border-color:var(--ink20); background:var(--paper); }
  .search-input:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .search-clear {
    position:absolute; right:10px; top:50%; transform:translateY(-50%);
    width:20px; height:20px; border-radius:50%;
    background:var(--ink10); border:none; color:var(--ink40);
    font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .search-clear:hover { background:var(--ink20); color:var(--ink60); }

  .filter-select-wrap { position:relative; }
  .filter-select {
    padding:9px 32px 9px 12px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:12.5px; font-weight:500; color:var(--ink);
    outline:none; appearance:none; cursor:pointer; transition:all .18s; min-width:130px;
  }
  .filter-select:hover { border-color:var(--ink20); background:var(--paper); }
  .filter-select:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .filter-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .filter-divider { width:1px; background:var(--ink10); align-self:stretch; margin:2px 0; }

  .view-toggle { display:flex; border:1.5px solid var(--ink10); border-radius:7px; overflow:hidden; }
  .view-btn { padding:8px 12px; background:transparent; border:none; color:var(--ink30); cursor:pointer; font-size:14px; transition:all .15s; display:flex; align-items:center; }
  .view-btn:hover { background:var(--warm); color:var(--ink50); }
  .view-btn.active { background:var(--ink); color:var(--goldl); }

  .filter-chips { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .filter-chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:20px;
    background:var(--goldbg); border:1px solid var(--goldbr);
    color:var(--gold); font-size:11px; font-weight:700;
  }
  .chip-remove { background:none; border:none; cursor:pointer; color:var(--gold); opacity:.65; font-size:14px; line-height:1; padding:0; }
  .chip-remove:hover { opacity:1; }

  /* ══ RESULTS BAR ══ */
  .results-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .results-count { font-size:12px; color:var(--ink40); font-weight:500; }
  .results-count strong { color:var(--ink60); font-weight:700; }

  /* ══ GRID VIEW ══ */
  .cat-grid {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px;
    animation:fadeUp .45s ease both; animation-delay:100ms;
  }
  .cat-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:12px; overflow:hidden; box-shadow:var(--shadow-xs);
    cursor:pointer; transition:all .22s cubic-bezier(.16,1,.3,1);
    position:relative; display:flex; flex-direction:column;
  }
  .cat-card:hover { box-shadow:var(--shadow-md); transform:translateY(-3px); border-color:var(--ink20); }
  .cat-card.inactive { opacity:.65; }

  .cat-card-top {
    height:72px; position:relative; flex-shrink:0;
    display:flex; align-items:center; padding:0 20px; gap:14px;
  }
  .cat-card-stripe {
    position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,var(--cc),transparent);
  }
  .cat-icon-wrap {
    width:44px; height:44px; border-radius:10px;
    background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.15);
    display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0;
  }
  .cat-name { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:#fff; line-height:1; letter-spacing:.1px; }
  .cat-slug { font-family:'Geist Mono',monospace; font-size:10px; color:rgba(255,255,255,.5); margin-top:3px; }

  .cat-badges {
    position:absolute; top:10px; right:12px;
    display:flex; gap:5px;
  }
  .cat-badge {
    padding:2px 8px; border-radius:20px;
    font-size:8.5px; font-weight:700; letter-spacing:.8px; text-transform:uppercase;
    backdrop-filter:blur(4px);
  }
  .cat-badge-feat { background:rgba(184,144,42,.25); border:1px solid rgba(212,168,60,.35); color:var(--goldl); }
  .cat-badge-off  { background:rgba(181,55,42,.2); border:1px solid rgba(181,55,42,.3); color:#F4886E; }
  .cat-badge-sub  { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.15); color:rgba(255,255,255,.7); }

  .cat-body { padding:14px 18px 16px; flex:1; display:flex; flex-direction:column; gap:10px; }
  .cat-desc { font-size:12px; color:var(--ink50); line-height:1.6; flex:1; }
  .cat-meta { display:flex; gap:8px; flex-wrap:wrap; margin-top:2px; }
  .cat-meta-pill {
    display:flex; align-items:center; gap:5px;
    padding:4px 10px; border-radius:20px;
    background:var(--warm); border:1px solid var(--ink10);
    font-size:10.5px; font-weight:600; color:var(--ink50);
  }
  .cat-meta-pill span { font-family:'Geist Mono',monospace; font-weight:700; color:var(--ink); }

  .cat-footer {
    padding:10px 18px 14px;
    border-top:1px solid var(--ink06);
    display:flex; align-items:center; justify-content:space-between; gap:8px;
  }
  .cat-actions { display:flex; gap:5px; }
  .cat-action-btn {
    width:30px; height:30px; border-radius:7px;
    background:transparent; border:1px solid transparent;
    color:var(--ink30); cursor:pointer; font-size:13px;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .cat-action-btn:hover { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .cat-action-btn.del:hover { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .cat-action-btn.edit:hover { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }

  /* ══ TABLE VIEW ══ */
  .table-card { background:var(--paper); border:1px solid var(--ink10); border-radius:10px; box-shadow:var(--shadow-xs); overflow:hidden; animation:fadeUp .45s ease both; animation-delay:100ms; }
  .tbl-head { display:grid; grid-template-columns:44px 2.5fr 1.2fr 80px 80px 80px 100px; gap:8px; padding:11px 18px; background:var(--warm); border-bottom:1px solid var(--ink10); }
  .tbl-hcell { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none; transition:color .15s; }
  .tbl-hcell:hover { color:var(--ink60); }
  .tbl-hcell.sorted { color:var(--gold); }
  .sort-arr { font-size:8px; }

  .tbl-row {
    display:grid; grid-template-columns:44px 2.5fr 1.2fr 80px 80px 80px 100px; gap:8px;
    padding:12px 18px; align-items:center;
    border-bottom:1px solid var(--ink03); transition:background .14s; cursor:pointer;
  }
  .tbl-row:last-child { border-bottom:none; }
  .tbl-row:hover { background:var(--warm); }

  .tbl-icon-cell { display:flex; align-items:center; justify-content:center; }
  .tbl-icon-badge {
    width:36px; height:36px; border-radius:8px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:18px;
  }
  .tbl-name-cell { display:flex; flex-direction:column; gap:2px; min-width:0; }
  .tbl-name { font-size:13.5px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .tbl-desc { font-size:11px; color:var(--ink40); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .tbl-slug { font-family:'Geist Mono',monospace; font-size:10.5px; color:var(--gold); margin-top:1px; }
  .tbl-cell { font-size:12.5px; color:var(--ink60); font-weight:500; }
  .tbl-mono { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:var(--ink); }
  .tbl-actions { display:flex; gap:4px; justify-content:flex-end; }
  .tbl-act-btn {
    width:28px; height:28px; border-radius:6px;
    background:transparent; border:1px solid transparent;
    color:var(--ink30); cursor:pointer; font-size:12px;
    display:flex; align-items:center; justify-content:center; transition:all .14s;
  }
  .tbl-act-btn:hover { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .tbl-act-btn.edit:hover { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }
  .tbl-act-btn.del:hover  { background:var(--redbg); border-color:var(--redbr); color:var(--red); }

  /* Status badge */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:9.5px; font-weight:700; text-transform:capitalize; letter-spacing:.3px; }
  .status-dot   { width:5px; height:5px; border-radius:50%; }

  /* ══ EMPTY ══ */
  .empty-state { padding:64px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .empty-ico   { font-size:48px; opacity:.4; }
  .empty-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink60); }
  .empty-sub   { font-size:13px; color:var(--ink40); max-width:300px; line-height:1.6; }

  /* ══ MODAL OVERLAY ══ */
  .modal-backdrop {
    position:fixed; inset:0; background:rgba(27,23,19,.45);
    z-index:400; backdrop-filter:blur(3px);
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:bdIn .22s ease;
  }
  @keyframes bdIn { from{opacity:0} to{opacity:1} }

  .modal {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:16px; box-shadow:var(--shadow-lg);
    width:100%; max-width:560px; max-height:92vh;
    display:flex; flex-direction:column; overflow:hidden;
    animation:modalIn .28s cubic-bezier(.16,1,.3,1);
  }
  @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(12px)} to{opacity:1;transform:none} }

  .modal-head {
    padding:20px 24px 18px; background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.25);
    display:flex; align-items:flex-start; justify-content:space-between; flex-shrink:0;
  }
  .modal-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); margin-bottom:4px; }
  .modal-title   { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; line-height:1.1; }
  .modal-close {
    width:32px; height:32px; border-radius:7px;
    background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.4); cursor:pointer; font-size:18px;
    display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0;
  }
  .modal-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }

  /* Category preview strip inside modal */
  .cat-preview-strip {
    height:56px; position:relative;
    display:flex; align-items:center; padding:0 22px; gap:12px;
    flex-shrink:0;
  }
  .preview-icon { font-size:26px; }
  .preview-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:#fff; }
  .preview-slug { font-family:'Geist Mono',monospace; font-size:10px; color:rgba(255,255,255,.45); margin-top:2px; }

  .modal-body { padding:22px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px; }
  .modal-body::-webkit-scrollbar { width:3px; }
  .modal-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* Form field */
  .field { display:flex; flex-direction:column; gap:7px; }
  .field-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .label {
    font-size:10.5px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:var(--ink50);
    display:flex; align-items:center; gap:6px;
  }
  .label-req { color:var(--red); font-size:13px; line-height:1; }
  .label-hint { font-size:10px; font-weight:400; color:var(--ink30); letter-spacing:0; text-transform:none; }

  .input,.textarea,.mselect {
    width:100%; padding:10px 13px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; color:var(--ink);
    font-size:13.5px; font-weight:500; font-family:'Outfit',sans-serif;
    outline:none; transition:all .18s; appearance:none;
  }
  .input::placeholder,.textarea::placeholder { color:var(--ink20); font-weight:400; }
  .input:hover,.textarea:hover,.mselect:hover { border-color:var(--ink20); background:var(--paper); }
  .input:focus,.textarea:focus,.mselect:focus {
    border-color:var(--gold); background:var(--paper);
    box-shadow:0 0 0 3px rgba(184,144,42,.1);
  }
  .input.error { border-color:var(--red); box-shadow:0 0 0 3px rgba(181,55,42,.08); }
  .textarea { resize:vertical; min-height:80px; line-height:1.55; }
  .mselect-wrap { position:relative; }
  .mselect-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .field-error { font-size:11px; color:var(--red); font-weight:500; display:flex; align-items:center; gap:4px; }

  /* Slug preview */
  .slug-preview {
    display:flex; align-items:center; gap:8px; padding:8px 12px;
    background:var(--cream); border:1.5px solid var(--ink10); border-radius:7px;
  }
  .slug-base { font-size:11.5px; color:var(--ink30); }
  .slug-val  { font-family:'Geist Mono',monospace; font-size:12px; color:var(--gold); font-weight:600; }

  /* Icon picker */
  .icon-picker { display:flex; flex-wrap:wrap; gap:6px; }
  .icon-opt {
    width:38px; height:38px; border-radius:8px; font-size:18px;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; border:1.5px solid var(--ink10); background:var(--warm);
    transition:all .16s;
  }
  .icon-opt:hover  { border-color:var(--ink20); background:var(--paper); transform:scale(1.08); }
  .icon-opt.active { border-color:var(--gold); background:var(--goldbg); box-shadow:0 0 0 1px var(--gold); transform:scale(1.08); }

  /* Color picker */
  .color-picker { display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
  .color-swatch {
    width:32px; height:32px; border-radius:50%; cursor:pointer;
    border:2.5px solid transparent; transition:all .16s; flex-shrink:0;
  }
  .color-swatch:hover  { transform:scale(1.12); }
  .color-swatch.active { border-color:var(--ink); box-shadow:0 0 0 2px #fff,0 0 0 4px var(--ink); }
  .color-input-wrap { display:flex; align-items:center; gap:8px; }
  .color-hex { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:var(--ink50); }

  /* Toggle */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .toggle-info .toggle-title { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:2px; }
  .toggle-info .toggle-desc  { font-size:11px; color:var(--ink40); line-height:1.4; }
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; cursor:pointer; }
  .toggle input { opacity:0; width:0; height:0; position:absolute; }
  .toggle-track {
    position:absolute; inset:0; border-radius:11px;
    background:var(--ink10); transition:all .2s; border:1.5px solid var(--ink10);
  }
  .toggle input:checked~.toggle-track { background:var(--green); border-color:#205038; }
  .toggle-thumb {
    position:absolute; top:3px; left:3px;
    width:14px; height:14px; border-radius:50%;
    background:#fff; transition:transform .2s cubic-bezier(.16,1,.3,1);
    box-shadow:0 1px 3px rgba(27,23,19,.2);
  }
  .toggle input:checked~.toggle-track .toggle-thumb { transform:translateX(18px); }

  /* Section divider inside modal */
  .m-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink30); display:flex; align-items:center; gap:10px; }
  .m-section::after { content:''; flex:1; height:1px; background:var(--ink06); }

  /* Modal footer */
  .modal-footer {
    padding:16px 24px; border-top:1px solid var(--ink10);
    display:flex; align-items:center; gap:10px; flex-shrink:0;
    background:var(--paper);
  }
  .modal-footer-hint { flex:1; font-size:11px; color:var(--ink30); }

  /* ══ DELETE CONFIRM MODAL ══ */
  .del-modal { max-width:400px; }
  .del-body  { padding:24px; display:flex; flex-direction:column; gap:14px; align-items:center; text-align:center; }
  .del-icon  { font-size:40px; }
  .del-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); }
  .del-sub   { font-size:13px; color:var(--ink40); line-height:1.6; max-width:280px; }

  /* ══ TOAST ══ */
  .toast {
    position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(16px);
    background:var(--ink); border:1px solid rgba(184,144,42,.3);
    border-radius:10px; padding:12px 20px;
    display:flex; align-items:center; gap:10px;
    box-shadow:var(--shadow-lg); z-index:1000;
    opacity:0; pointer-events:none;
    transition:all .3s cubic-bezier(.16,1,.3,1); white-space:nowrap;
  }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
  .toast-icon { font-size:15px; }
  .toast-msg  { font-size:13px; font-weight:600; color:#F6F3EC; }
  .toast-sub  { font-size:11.5px; color:rgba(246,243,236,.4); }

  /* ══ RESPONSIVE ══ */
  @media (max-width:1000px) {
    .tbl-head,.tbl-row { grid-template-columns:44px 2.5fr 80px 80px 80px 100px; }
    .tbl-head>:nth-child(3),.tbl-row>:nth-child(3) { display:none; }
    .stat-strip { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:680px) {
    .content { padding:14px 16px; }
    .cat-grid { grid-template-columns:1fr; }
    .tbl-head,.tbl-row { grid-template-columns:2.5fr 80px 80px 90px; }
    .tbl-head>:nth-child(1),.tbl-row>:nth-child(1),
    .tbl-head>:nth-child(4),.tbl-row>:nth-child(4) { display:none; }
    .field-row-2 { grid-template-columns:1fr; }
  }
`;

// ── HELPERS ────────────────────────────────────────────────────────────────────
const toSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BLANK_FORM = {
  name: "", slug: "", slugAuto: true,
  description: "", icon: "📦", color: "#2B5490",
  parent: "", active: true, featured: false, sortOrder: "",
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function CategoryManagement() {
  const [cats,       setCats]       = useState(INITIAL_CATEGORIES);
  const [search,     setSearch]     = useState("");
  const [statFilter, setStatFilter] = useState("All");     // All | active | inactive
  const [typeFilter, setTypeFilter] = useState("All");     // All | parent | sub
  const [sortKey,    setSortKey]    = useState("sortOrder");
  const [sortAsc,    setSortAsc]    = useState(true);
  const [view,       setView]       = useState("grid");

  const [modalMode,  setModalMode]  = useState(null);      // null | "add" | "edit"
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(BLANK_FORM);
  const [errors,     setErrors]     = useState({});
  const [toast,      setToast]      = useState({ show: false, msg: "", sub: "" });

  const searchRef = useRef();

  // Close modal on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setModalMode(null); setDelTarget(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Filter & sort ──
  const filtered = useMemo(() => {
    let list = [...cats];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
    if (statFilter === "active")   list = list.filter(c =>  c.active);
    if (statFilter === "inactive") list = list.filter(c => !c.active);
    if (typeFilter === "parent")   list = list.filter(c => !c.parent);
    if (typeFilter === "sub")      list = list.filter(c =>  c.parent);

    list.sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [cats, search, statFilter, typeFilter, sortKey, sortAsc]);

  // ── Stats ──
  const totalCats    = cats.length;
  const activeCats   = cats.filter(c => c.active).length;
  const parentCats   = cats.filter(c => !c.parent).length;
  const subCats      = cats.filter(c =>  c.parent).length;

  const parentOptions = cats.filter(c => !c.parent);

  // ── Modal helpers ──
  const openAdd = () => {
    setForm({ ...BLANK_FORM, sortOrder: String(cats.length + 1) });
    setErrors({});
    setModalMode("add");
  };

  const openEdit = (cat) => {
    setEditTarget(cat.id);
    setForm({
      name: cat.name, slug: cat.slug, slugAuto: false,
      description: cat.description || "", icon: cat.icon,
      color: cat.color, parent: cat.parent || "",
      active: cat.active, featured: cat.featured,
      sortOrder: String(cat.sortOrder),
    });
    setErrors({});
    setModalMode("edit");
  };

  const updateForm = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === "name" && f.slugAuto) next.slug = toSlug(val);
      if (key === "slug") next.slugAuto = false;
      if (key === "slugAuto" && val) next.slug = toSlug(f.name);
      return next;
    });
    setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (cats.some(c => c.slug === form.slug.trim() && c.id !== editTarget)) e.slug = "This slug is already taken";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modalMode === "add") {
      const newCat = {
        id: Date.now(), name: form.name.trim(), slug: form.slug.trim(),
        description: form.description.trim(), icon: form.icon, color: form.color,
        products: 0, active: form.active, featured: form.featured,
        sortOrder: parseInt(form.sortOrder) || cats.length + 1,
        parent: form.parent || null, createdAt: new Date().toISOString().split("T")[0],
      };
      setCats(c => [...c, newCat]);
      showToast("Category created", newCat.name);
    } else {
      setCats(c => c.map(cat => cat.id === editTarget ? {
        ...cat, name: form.name.trim(), slug: form.slug.trim(),
        description: form.description.trim(), icon: form.icon, color: form.color,
        active: form.active, featured: form.featured,
        sortOrder: parseInt(form.sortOrder) || cat.sortOrder,
        parent: form.parent || null,
      } : cat));
      showToast("Category updated", form.name.trim());
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    const cat = cats.find(c => c.id === delTarget);
    setCats(c => c.filter(x => x.id !== delTarget));
    setDelTarget(null);
    showToast("Category deleted", cat?.name || "");
  };

  const toggleActive = (id) => {
    setCats(c => c.map(cat => cat.id === id ? { ...cat, active: !cat.active } : cat));
  };

  const showToast = (msg, sub = "") => {
    setToast({ show: true, msg, sub });
    setTimeout(() => setToast({ show: false, msg: "", sub: "" }), 3000);
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }) => (
    <span className="sort-arr" style={{ opacity: sortKey === k ? 1 : .3, color: sortKey === k ? "var(--gold)" : "inherit" }}>
      {sortAsc && sortKey === k ? "▲" : "▼"}
    </span>
  );

  const activeFilters = [];
  if (search)              activeFilters.push({ label: `"${search}"`, clear: () => setSearch("") });
  if (statFilter !== "All") activeFilters.push({ label: statFilter,   clear: () => setStatFilter("All") });
  if (typeFilter !== "All") activeFilters.push({ label: typeFilter,   clear: () => setTypeFilter("All") });

  // ── STATUS BADGE ──
  const StatusBadge = ({ active }) => (
    <span className="status-badge" style={{
      background: active ? "var(--greenbg)" : "var(--warm2)",
      border: `1px solid ${active ? "var(--greenbr)" : "var(--ink10)"}`,
      color: active ? "var(--green)" : "var(--ink40)",
    }}>
      <span className="status-dot" style={{ background: active ? "#3D8A65" : "#9E9080" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-mark">N</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div className="brand-name">Nexus POS</div>
                <div className="brand-sub">Admin · Retail</div>
              </div>
            </div>
            <div className="vdiv" />
            <nav className="breadcrumb">
              <span className="bc-link">Dashboard</span>
              <span className="bc-sep">›</span>
              <span className="bc-link">Inventory</span>
              <span className="bc-sep">›</span>
              <span className="bc-active">Categories</span>
            </nav>
          </div>
          <div className="topbar-right">
            <div className="vdiv" />
            <div className="avatar">AD</div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="content">

          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <div className="page-eyebrow">Inventory Management</div>
              <div className="page-title">Category Management</div>
              <div className="page-desc">{totalCats} categories · {parentCats} parent, {subCats} sub-categories</div>
            </div>
            <div className="page-actions">
              <button className="btn btn-ghost">↓ Export</button>
              <button className="btn btn-gold" onClick={openAdd}>＋ Add Category</button>
            </div>
          </div>

          {/* STAT STRIP */}
          <div className="stat-strip">
            {[
              { label: "Total Categories", val: totalCats,  sub: "All types",             color: "var(--blue)"  },
              { label: "Active",           val: activeCats, sub: "Published in POS",       color: "var(--green)" },
              { label: "Parent",           val: parentCats, sub: "Top-level categories",   color: "var(--gold)"  },
              { label: "Sub-categories",   val: subCats,    sub: "Nested under parent",    color: "var(--purple)"},
            ].map((s, i) => (
              <div className="stat-card" key={i} style={{ "--sc": s.color }}>
                <div className="stat-lbl">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* FILTER BAR */}
          <div className="filter-bar">
            <div className="filter-group" style={{ flex: 1 }}>
              <div className="filter-label">Search</div>
              <div className="search-wrap">
                <span className="search-ico">⌕</span>
                <input
                  ref={searchRef}
                  className="search-input"
                  placeholder="Name, slug or description…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button className="search-clear" onClick={() => { setSearch(""); searchRef.current.focus(); }}>×</button>
                )}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">Status</div>
              <div className="filter-select-wrap">
                <select className="filter-select" value={statFilter} onChange={e => setStatFilter(e.target.value)}>
                  <option>All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <span className="filter-arrow">▾</span>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">Type</div>
              <div className="filter-select-wrap">
                <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option>All</option>
                  <option value="parent">Parent only</option>
                  <option value="sub">Sub-categories</option>
                </select>
                <span className="filter-arrow">▾</span>
              </div>
            </div>

            <div className="filter-divider" />

            <div className="filter-group">
              <div className="filter-label">View</div>
              <div className="view-toggle">
                <button className={`view-btn${view === "grid"  ? " active" : ""}`} onClick={() => setView("grid")}  title="Grid">⊞</button>
                <button className={`view-btn${view === "table" ? " active" : ""}`} onClick={() => setView("table")} title="Table">☰</button>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <>
                <div className="filter-divider" />
                <div className="filter-group">
                  <div className="filter-label">Active Filters</div>
                  <div className="filter-chips">
                    {activeFilters.map((f, i) => (
                      <span className="filter-chip" key={i}>
                        {f.label}
                        <button className="chip-remove" onClick={f.clear}>×</button>
                      </span>
                    ))}
                    <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}
                      onClick={() => { setSearch(""); setStatFilter("All"); setTypeFilter("All"); }}>
                      Clear all
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RESULTS BAR */}
          <div className="results-bar">
            <div className="results-count">
              Showing <strong>{filtered.length}</strong> of <strong>{cats.length}</strong> categories
              {activeFilters.length > 0 && " (filtered)"}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--ink40)", fontWeight: 600 }}>Sort</span>
              <div className="filter-select-wrap">
                <select className="filter-select" style={{ minWidth: 130, fontSize: 12 }}
                  value={sortKey} onChange={e => { setSortKey(e.target.value); setSortAsc(true); }}>
                  <option value="sortOrder">Sort Order</option>
                  <option value="name">Name</option>
                  <option value="products">Products</option>
                  <option value="createdAt">Date Added</option>
                </select>
                <span className="filter-arrow">▾</span>
              </div>
              <button className="btn btn-ghost" style={{ padding: "7px 11px", fontSize: 13 }}
                onClick={() => setSortAsc(v => !v)}>{sortAsc ? "↑" : "↓"}</button>
            </div>
          </div>

          {/* ══ GRID VIEW ══ */}
          {view === "grid" && (
            filtered.length === 0
              ? <div className="table-card"><div className="empty-state"><div className="empty-ico">🗂</div><div className="empty-title">No categories found</div><div className="empty-sub">Try adjusting your search or filters.</div><button className="btn btn-ghost" onClick={() => { setSearch(""); setStatFilter("All"); setTypeFilter("All"); }}>Clear filters</button></div></div>
              : (
                <div className="cat-grid">
                  {filtered.map((cat, i) => (
                    <div
                      key={cat.id}
                      className={`cat-card${!cat.active ? " inactive" : ""}`}
                      style={{ animationDelay: `${i * 20}ms`, animation: "fadeUp .4s ease both", "--cc": cat.color }}
                    >
                      {/* Coloured top strip */}
                      <div className="cat-card-top" style={{ background: `linear-gradient(135deg, ${cat.color}EE, ${cat.color}99)` }}>
                        <div className="cat-icon-wrap">{cat.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="cat-name">{cat.name}</div>
                          <div className="cat-slug">/{cat.slug}</div>
                        </div>
                        <div className="cat-card-stripe" />
                        <div className="cat-badges">
                          {cat.featured  && <span className="cat-badge cat-badge-feat">★ Featured</span>}
                          {!cat.active   && <span className="cat-badge cat-badge-off">Off</span>}
                          {cat.parent    && <span className="cat-badge cat-badge-sub">Sub</span>}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="cat-body">
                        {cat.description && <div className="cat-desc">{cat.description}</div>}
                        <div className="cat-meta">
                          <div className="cat-meta-pill">
                            📦 <span>{cat.products}</span> products
                          </div>
                          {cat.parent && (
                            <div className="cat-meta-pill">
                              ⤷ <span>{cat.parent}</span>
                            </div>
                          )}
                          <div className="cat-meta-pill">
                            # <span>{cat.sortOrder}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="cat-footer">
                        <StatusBadge active={cat.active} />
                        <div className="cat-actions">
                          <button className="cat-action-btn" title={cat.active ? "Deactivate" : "Activate"}
                            onClick={e => { e.stopPropagation(); toggleActive(cat.id); }}
                            style={{ fontSize: 14 }}>
                            {cat.active ? "⊟" : "⊕"}
                          </button>
                          <button className="cat-action-btn edit" title="Edit"
                            onClick={e => { e.stopPropagation(); openEdit(cat); }}>✏</button>
                          <button className="cat-action-btn del" title="Delete"
                            onClick={e => { e.stopPropagation(); setDelTarget(cat.id); }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
          )}

          {/* ══ TABLE VIEW ══ */}
          {view === "table" && (
            <div className="table-card">
              {filtered.length === 0
                ? <div className="empty-state"><div className="empty-ico">🗂</div><div className="empty-title">No categories found</div><div className="empty-sub">Adjust filters or add a new category.</div><button className="btn btn-ghost" onClick={openAdd}>＋ Add Category</button></div>
                : (
                  <>
                    <div className="tbl-head">
                      <div className="tbl-hcell" />
                      <div className={`tbl-hcell${sortKey === "name" ? " sorted" : ""}`} onClick={() => toggleSort("name")}>
                        Category <SortIcon k="name" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "name" ? " sorted" : ""}`}>
                        Parent
                      </div>
                      <div className={`tbl-hcell${sortKey === "products" ? " sorted" : ""}`} onClick={() => toggleSort("products")}>
                        Products <SortIcon k="products" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "sortOrder" ? " sorted" : ""}`} onClick={() => toggleSort("sortOrder")}>
                        Order <SortIcon k="sortOrder" />
                      </div>
                      <div className="tbl-hcell">Status</div>
                      <div className="tbl-hcell" style={{ justifyContent: "flex-end" }}>Actions</div>
                    </div>

                    {filtered.map((cat, i) => (
                      <div key={cat.id} className="tbl-row" style={{ animationDelay: `${i * 16}ms`, animation: "fadeUp .4s ease both", opacity: cat.active ? 1 : .65 }}>
                        <div className="tbl-icon-cell">
                          <div className="tbl-icon-badge" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
                            {cat.icon}
                          </div>
                        </div>
                        <div className="tbl-name-cell">
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span className="tbl-name">{cat.name}</span>
                            {cat.featured && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)", letterSpacing: ".5px" }}>★</span>}
                          </div>
                          <div className="tbl-slug">/{cat.slug}</div>
                          {cat.description && <div className="tbl-desc">{cat.description}</div>}
                        </div>
                        <div className="tbl-cell" style={{ color: cat.parent ? "var(--ink50)" : "var(--ink20)", fontSize: 12 }}>
                          {cat.parent || <span style={{ fontStyle: "italic" }}>—</span>}
                        </div>
                        <div className="tbl-mono">{cat.products}</div>
                        <div className="tbl-mono">{cat.sortOrder}</div>
                        <StatusBadge active={cat.active} />
                        <div className="tbl-actions">
                          <button className="tbl-act-btn" title={cat.active ? "Deactivate" : "Activate"} onClick={() => toggleActive(cat.id)} style={{ fontSize: 14 }}>
                            {cat.active ? "⊟" : "⊕"}
                          </button>
                          <button className="tbl-act-btn edit" title="Edit" onClick={() => openEdit(cat)}>✏</button>
                          <button className="tbl-act-btn del" title="Delete" onClick={() => setDelTarget(cat.id)}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </>
                )
              }
            </div>
          )}

        </div>

        {/* ══════════════════════════════════════
            ADD / EDIT MODAL
        ══════════════════════════════════════ */}
        {modalMode && (
          <div className="modal-backdrop" onClick={() => setModalMode(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>

              {/* Modal header */}
              <div className="modal-head">
                <div>
                  <div className="modal-eyebrow">{modalMode === "add" ? "New Category" : "Edit Category"}</div>
                  <div className="modal-title">{modalMode === "add" ? "Create a new category" : `Editing: ${form.name || "…"}`}</div>
                </div>
                <button className="modal-close" onClick={() => setModalMode(null)}>×</button>
              </div>

              {/* Live preview strip */}
              <div className="cat-preview-strip" style={{ background: `linear-gradient(135deg,${form.color}EE,${form.color}99)` }}>
                <span className="preview-icon">{form.icon}</span>
                <div>
                  <div className="preview-name">{form.name || <span style={{ opacity: .4 }}>Category name…</span>}</div>
                  <div className="preview-slug">/{form.slug || <span style={{ opacity: .4 }}>slug</span>}</div>
                </div>
              </div>

              {/* Modal body */}
              <div className="modal-body">

                {/* ── Basic ── */}
                <div className="m-section">Basic Information</div>

                {/* Name */}
                <div className="field">
                  <label className="label">Name <span className="label-req">*</span></label>
                  <input
                    className={`input${errors.name ? " error" : ""}`}
                    placeholder="e.g. Electronics"
                    value={form.name}
                    onChange={e => updateForm("name", e.target.value)}
                    autoFocus
                  />
                  {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                </div>

                {/* Slug */}
                <div className="field">
                  <label className="label">
                    Slug <span className="label-req">*</span>
                    <span className="label-hint">— {form.slugAuto ? "auto" : "manual"}</span>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div className="slug-preview" style={{ flex: 1 }}>
                      <span className="slug-base">nexuspos.com/categories/</span>
                      <span className="slug-val">{form.slug || <span style={{ opacity: .35 }}>slug</span>}</span>
                    </div>
                    {!form.slugAuto && (
                      <input
                        className={`input${errors.slug ? " error" : ""}`}
                        style={{ flex: 1 }}
                        placeholder="custom-slug"
                        value={form.slug}
                        onChange={e => updateForm("slug", toSlug(e.target.value))}
                      />
                    )}
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "9px 13px", fontSize: 11.5, flexShrink: 0 }}
                      onClick={() => updateForm("slugAuto", !form.slugAuto)}
                    >{form.slugAuto ? "Manual" : "Auto"}</button>
                  </div>
                  {errors.slug && <span className="field-error">⚠ {errors.slug}</span>}
                </div>

                {/* Description */}
                <div className="field">
                  <label className="label">Description <span className="label-hint">— optional</span></label>
                  <textarea
                    className="textarea"
                    placeholder="Briefly describe what this category covers…"
                    rows={2}
                    value={form.description}
                    onChange={e => updateForm("description", e.target.value)}
                  />
                </div>

                {/* ── Appearance ── */}
                <div className="m-section">Appearance</div>

                {/* Icon */}
                <div className="field">
                  <label className="label">Icon</label>
                  <div className="icon-picker">
                    {ICONS.map(ic => (
                      <div
                        key={ic}
                        className={`icon-opt${form.icon === ic ? " active" : ""}`}
                        onClick={() => updateForm("icon", ic)}
                      >{ic}</div>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="field">
                  <label className="label">Colour</label>
                  <div className="color-picker">
                    {COLOR_PRESETS.map(c => (
                      <div
                        key={c}
                        className={`color-swatch${form.color === c ? " active" : ""}`}
                        style={{ background: c }}
                        onClick={() => updateForm("color", c)}
                        title={c}
                      />
                    ))}
                    <div className="color-input-wrap">
                      <input
                        type="color"
                        value={form.color}
                        onChange={e => updateForm("color", e.target.value)}
                        style={{ width: 32, height: 32, border: "none", background: "none", cursor: "pointer", padding: 0, borderRadius: "50%" }}
                        title="Custom colour"
                      />
                      <span className="color-hex">{form.color.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* ── Organisation ── */}
                <div className="m-section">Organisation</div>

                <div className="field-row-2">
                  {/* Parent */}
                  <div className="field">
                    <label className="label">Parent Category</label>
                    <div className="mselect-wrap">
                      <select className="mselect" value={form.parent} onChange={e => updateForm("parent", e.target.value)}>
                        <option value="">None (top-level)</option>
                        {parentOptions.filter(p => p.id !== editTarget).map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      <span className="mselect-arrow">▾</span>
                    </div>
                  </div>
                  {/* Sort order */}
                  <div className="field">
                    <label className="label">Sort Order</label>
                    <input
                      className="input" type="number" min="1"
                      placeholder="1"
                      value={form.sortOrder}
                      onChange={e => updateForm("sortOrder", e.target.value)}
                      style={{ fontFamily: "'Geist Mono',monospace" }}
                    />
                  </div>
                </div>

                {/* ── Visibility ── */}
                <div className="m-section">Visibility</div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-title">Active</div>
                    <div className="toggle-desc">Visible and usable in the POS system</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={form.active} onChange={e => updateForm("active", e.target.checked)} />
                    <div className="toggle-track"><div className="toggle-thumb" /></div>
                  </label>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-title">Featured</div>
                    <div className="toggle-desc">Highlighted in the dashboard and product listing</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={form.featured} onChange={e => updateForm("featured", e.target.checked)} />
                    <div className="toggle-track"><div className="toggle-thumb" /></div>
                  </label>
                </div>

              </div>

              {/* Modal footer */}
              <div className="modal-footer">
                <span className="modal-footer-hint">
                  {modalMode === "edit" ? "Changes save immediately" : "Category will be created and active"}
                </span>
                <button className="btn btn-ghost" onClick={() => setModalMode(null)}>Cancel</button>
                <button className="btn btn-gold" onClick={handleSave}>
                  {modalMode === "add" ? "✦ Create Category" : "✓ Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ DELETE CONFIRM ══ */}
        {delTarget && (() => {
          const cat = cats.find(c => c.id === delTarget);
          return (
            <div className="modal-backdrop" onClick={() => setDelTarget(null)}>
              <div className="modal del-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                  <div>
                    <div className="modal-eyebrow">Confirm Action</div>
                    <div className="modal-title">Delete Category</div>
                  </div>
                  <button className="modal-close" onClick={() => setDelTarget(null)}>×</button>
                </div>
                <div className="del-body">
                  <div className="del-icon">{cat?.icon}</div>
                  <div className="del-title">Delete "{cat?.name}"?</div>
                  <div className="del-sub">
                    This will permanently remove the category. The <strong>{cat?.products}</strong> products
                    assigned to it will become uncategorised. This action cannot be undone.
                  </div>
                  <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 4 }}>
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDelTarget(null)}>Cancel</button>
                    <button className="btn btn-red" style={{ flex: 1 }} onClick={handleDelete}>🗑 Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TOAST */}
        <div className={`toast${toast.show ? " show" : ""}`}>
          <span className="toast-icon">✦</span>
          <span className="toast-msg">{toast.msg}</span>
          {toast.sub && <span className="toast-sub">· {toast.sub}</span>}
        </div>

      </div>
    </>
  );
}