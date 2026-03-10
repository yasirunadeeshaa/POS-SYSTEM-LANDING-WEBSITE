import { useState, useMemo, useRef, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const INITIAL_SUPPLIERS = [
  {
    id: 1, name: "TechDist Co.", code: "SUP-001", category: "Electronics",
    contactName: "Marcus Holt", contactTitle: "Sales Manager",
    email: "marcus.holt@techdist.com", phone: "+1 415 230 8800", altPhone: "+1 415 230 8801",
    website: "www.techdist.com", country: "United States", city: "San Francisco",
    address: "88 Market Street, San Francisco, CA 94103",
    taxId: "US-88-4421007", paymentTerms: "Net 30", currency: "USD",
    leadTime: 7, minOrder: 500, status: "active", rating: 5, preferred: true,
    totalOrders: 48, totalValue: 184200, lastOrder: "2025-03-01", joinedAt: "2022-01-15",
    bankName: "Wells Fargo", bankAccount: "****4821", bankSwift: "WFBIUS6S",
    notes: "Primary electronics supplier. Fast shipping. Excellent quality control.",
    tags: ["preferred", "electronics", "international"],
    products: ["Wireless Earbuds Pro", "USB-C Hub 7-in-1", "Mechanical Keyboard TKL", "Portable Charger 20000mAh"],
  },
  {
    id: 2, name: "FabricWorld", code: "SUP-002", category: "Apparel",
    contactName: "Priyanka Nair", contactTitle: "Account Director",
    email: "p.nair@fabricworld.in", phone: "+91 22 4001 7700", altPhone: "",
    website: "www.fabricworld.in", country: "India", city: "Mumbai",
    address: "Plot 14, SEEPZ, Andheri East, Mumbai 400096",
    taxId: "IN-27AABCF1234A1Z5", paymentTerms: "Net 45", currency: "INR",
    leadTime: 14, minOrder: 300, status: "active", rating: 4, preferred: false,
    totalOrders: 31, totalValue: 56800, lastOrder: "2025-02-18", joinedAt: "2022-06-10",
    bankName: "HDFC Bank", bankAccount: "****9933", bankSwift: "HDFCINBB",
    notes: "Good for bulk fabric orders. Lead time can stretch to 20 days during peak season.",
    tags: ["apparel", "bulk", "international"],
    products: ["Cotton Crew T-Shirt", "Running Socks 3-Pack", "Linen Throw Blanket", "Tops & Tees"],
  },
  {
    id: 3, name: "Global Imports Ltd", code: "SUP-003", category: "General",
    contactName: "Haruto Yamamoto", contactTitle: "Export Manager",
    email: "h.yamamoto@globalimports.jp", phone: "+81 3 5678 9010", altPhone: "+81 3 5678 9011",
    website: "www.globalimports.jp", country: "Japan", city: "Tokyo",
    address: "2-3-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005",
    taxId: "JP-6010001123456", paymentTerms: "Net 60", currency: "JPY",
    leadTime: 21, minOrder: 1000, status: "active", rating: 5, preferred: true,
    totalOrders: 62, totalValue: 312400, lastOrder: "2025-03-05", joinedAt: "2021-09-01",
    bankName: "Mizuho Bank", bankAccount: "****2244", bankSwift: "MHCBJPJT",
    notes: "Longest relationship. Reliable for diverse product categories. Excellent packaging.",
    tags: ["preferred", "general", "international", "reliable"],
    products: ["Leather Wallet Slim", "Notebook A5 Grid", "Bamboo Desk Organiser", "Phone Case iPhone 15"],
  },
  {
    id: 4, name: "HomeGoods Inc.", code: "SUP-004", category: "Home",
    contactName: "Sandra Mills", contactTitle: "Trade Relations",
    email: "smills@homegoodsinc.com", phone: "+44 20 7946 0321", altPhone: "",
    website: "www.homegoodsinc.co.uk", country: "United Kingdom", city: "London",
    address: "12 Canary Wharf, London E14 5HQ",
    taxId: "GB-123456789", paymentTerms: "Net 30", currency: "GBP",
    leadTime: 10, minOrder: 250, status: "active", rating: 4, preferred: false,
    totalOrders: 27, totalValue: 74100, lastOrder: "2025-02-28", joinedAt: "2023-02-20",
    bankName: "Barclays", bankAccount: "****6677", bankSwift: "BARCGB22",
    notes: "Good range of home decor. Responsive account manager.",
    tags: ["home", "international"],
    products: ["Scented Candle Set", "Ceramic Coffee Mug", "Aroma Diffuser Glass", "Linen Throw Blanket"],
  },
  {
    id: 5, name: "DirectSource", code: "SUP-005", category: "Lifestyle",
    contactName: "Ahmad Khalil", contactTitle: "Head of Wholesale",
    email: "a.khalil@directsource.ae", phone: "+971 4 321 9900", altPhone: "+971 55 123 4567",
    website: "www.directsource.ae", country: "UAE", city: "Dubai",
    address: "Office 1204, Jumeirah Lake Towers, Dubai",
    taxId: "AE-100123456", paymentTerms: "Prepaid", currency: "AED",
    leadTime: 5, minOrder: 200, status: "active", rating: 3, preferred: false,
    totalOrders: 19, totalValue: 38600, lastOrder: "2025-01-14", joinedAt: "2023-08-05",
    bankName: "Emirates NBD", bankAccount: "****5512", bankSwift: "EBILAEAD",
    notes: "Fast lead time but occasional quality issues with lifestyle products. Under review.",
    tags: ["lifestyle", "international"],
    products: ["Stainless Water Bottle", "Yoga Mat Pro"],
  },
  {
    id: 6, name: "LocalPrint Solutions", code: "SUP-006", category: "Stationery",
    contactName: "Chamara Dissanayake", contactTitle: "Operations Lead",
    email: "chamara@localprint.lk", phone: "+94 11 256 8800", altPhone: "+94 77 123 9900",
    website: "www.localprint.lk", country: "Sri Lanka", city: "Colombo",
    address: "No. 45, Vauxhall Street, Colombo 02",
    taxId: "LK-VAT-123456789", paymentTerms: "Net 14", currency: "LKR",
    leadTime: 3, minOrder: 50, status: "active", rating: 4, preferred: false,
    totalOrders: 14, totalValue: 12800, lastOrder: "2025-03-03", joinedAt: "2024-01-10",
    bankName: "Commercial Bank", bankAccount: "****3301", bankSwift: "CCEYLKLX",
    notes: "Local supplier. Good turnaround for stationery and small runs.",
    tags: ["local", "stationery"],
    products: ["Notebook A5 Grid", "Bamboo Desk Organiser"],
  },
  {
    id: 7, name: "SportGear Asia", code: "SUP-007", category: "Sports",
    contactName: "Ji-Woo Park", contactTitle: "Export Coordinator",
    email: "jiwoo.park@sportgearasia.kr", phone: "+82 2 3456 7890", altPhone: "",
    website: "www.sportgearasia.kr", country: "South Korea", city: "Seoul",
    address: "14F, Teheran-ro 432, Gangnam-gu, Seoul 06192",
    taxId: "KR-214-88-12345", paymentTerms: "Net 30", currency: "KRW",
    leadTime: 12, minOrder: 400, status: "inactive", rating: 3, preferred: false,
    totalOrders: 8, totalValue: 22100, lastOrder: "2024-11-20", joinedAt: "2023-11-01",
    bankName: "Kookmin Bank", bankAccount: "****7788", bankSwift: "CZNBKRSE",
    notes: "Paused orders pending quality audit after batch issue in Nov 2024.",
    tags: ["sports", "international", "under-review"],
    products: ["Yoga Mat Pro", "Running Socks 3-Pack"],
  },
  {
    id: 8, name: "PackRight Materials", code: "SUP-008", category: "Packaging",
    contactName: "Lena Bauer", contactTitle: "Key Account Manager",
    email: "l.bauer@packright.de", phone: "+49 89 4321 0000", altPhone: "",
    website: "www.packright.de", country: "Germany", city: "Munich",
    address: "Maximilianstraße 12, 80539 Munich",
    taxId: "DE-123456789", paymentTerms: "Net 30", currency: "EUR",
    leadTime: 8, minOrder: 150, status: "active", rating: 4, preferred: false,
    totalOrders: 22, totalValue: 31500, lastOrder: "2025-02-10", joinedAt: "2023-05-18",
    bankName: "Deutsche Bank", bankAccount: "****0099", bankSwift: "DEUTDEFF",
    notes: "Eco-certified packaging. Good for gift sets and premium product lines.",
    tags: ["packaging", "eco", "international"],
    products: ["Gift Packaging", "Custom Boxes"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(INITIAL_SUPPLIERS.map(s => s.category))).sort()];
const COUNTRIES   = ["All", ...Array.from(new Set(INITIAL_SUPPLIERS.map(s => s.country))).sort()];
const TERMS_OPTS  = ["Net 14", "Net 30", "Net 45", "Net 60", "Prepaid", "COD"];
const CURRENCY_OPTS = ["USD", "EUR", "GBP", "AED", "INR", "JPY", "LKR", "KRW", "AUD", "SGD"];
const CATEGORY_OPTS = ["Electronics", "Apparel", "Home", "Lifestyle", "Stationery", "Sports", "Packaging", "General", "Beauty", "Food & Drink"];

const fmt  = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtD = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RATING_COLORS = { 5: "#2D6A4F", 4: "#3D8A65", 3: "#B8902A", 2: "#B5372A", 1: "#9E9080" };

const TAG_STYLES = {
  preferred:     { bg: "rgba(184,144,42,.1)",  border: "rgba(184,144,42,.25)", text: "#B8902A" },
  electronics:   { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.2)",  text: "#2B5490" },
  apparel:       { bg: "rgba(91,61,143,.08)",  border: "rgba(91,61,143,.2)",  text: "#5B3D8F" },
  international: { bg: "rgba(45,106,79,.07)",  border: "rgba(45,106,79,.2)",  text: "#2D6A4F" },
  local:         { bg: "rgba(45,106,79,.12)",  border: "rgba(45,106,79,.28)", text: "#2D6A4F" },
  bulk:          { bg: "rgba(122,92,30,.08)",  border: "rgba(122,92,30,.2)",  text: "#7A5C1E" },
  reliable:      { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.2)",  text: "#2B5490" },
  "under-review":{ bg: "rgba(181,55,42,.08)",  border: "rgba(181,55,42,.2)",  text: "#B5372A" },
  eco:           { bg: "rgba(45,106,79,.08)",  border: "rgba(45,106,79,.2)",  text: "#2D6A4F" },
  packaging:     { bg: "rgba(158,144,128,.1)", border: "rgba(158,144,128,.2)","text":"#9E9080" },
  home:          { bg: "rgba(122,92,30,.07)",  border: "rgba(122,92,30,.18)", text: "#7A5C1E" },
  lifestyle:     { bg: "rgba(45,106,79,.07)",  border: "rgba(45,106,79,.18)", text: "#2D6A4F" },
  general:       { bg: "rgba(158,144,128,.08)",border: "rgba(158,144,128,.2)","text":"#9E9080" },
  stationery:    { bg: "rgba(158,144,128,.1)", border: "rgba(158,144,128,.2)","text":"#6B5F54" },
  sports:        { bg: "rgba(181,55,42,.07)",  border: "rgba(181,55,42,.18)", text: "#B5372A" },
};

const COUNTRY_FLAG = {
  "United States": "🇺🇸", "India": "🇮🇳", "Japan": "🇯🇵", "United Kingdom": "🇬🇧",
  "UAE": "🇦🇪", "Sri Lanka": "🇱🇰", "South Korea": "🇰🇷", "Germany": "🇩🇪",
  "Australia": "🇦🇺", "Singapore": "🇸🇬",
};

const BLANK_FORM = {
  name: "", code: "", category: "", contactName: "", contactTitle: "",
  email: "", phone: "", altPhone: "", website: "",
  country: "", city: "", address: "", taxId: "",
  paymentTerms: "Net 30", currency: "USD",
  leadTime: "", minOrder: "", status: "active", rating: 4, preferred: false,
  bankName: "", bankAccount: "", bankSwift: "", notes: "", tags: [],
};

// ── AVATAR COLORS ─────────────────────────────────────────────────────────────
const AV_COLORS = [
  ["#2B5490","rgba(43,84,144,.14)"], ["#5B3D8F","rgba(91,61,143,.14)"],
  ["#2D6A4F","rgba(45,106,79,.14)"], ["#B8902A","rgba(184,144,42,.14)"],
  ["#B5372A","rgba(181,55,42,.14)"], ["#7A5C1E","rgba(122,92,30,.14)"],
  ["#8A3A6A","rgba(138,58,106,.14)"],["#1B6B8A","rgba(27,107,138,.14)"],
];
const avColor = (id) => AV_COLORS[(id - 1) % AV_COLORS.length];
const initials = (name) => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

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
    --purple:#5B3D8F; --purplebg:rgba(91,61,143,.07); --purplebr:rgba(91,61,143,.22);
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
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
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
  .tb-avatar {
    width:36px; height:36px; border-radius:8px;
    border:1.5px solid rgba(184,144,42,.3); background:rgba(184,144,42,.08);
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; color:var(--goldl); cursor:pointer;
  }

  /* ══ MAIN ══ */
  .main { flex:1; display:flex; overflow:hidden; }

  /* ══ CONTENT ══ */
  .content {
    flex:1; overflow-y:auto; padding:22px 28px 36px;
    display:flex; flex-direction:column; gap:18px;
    transition:margin-right .35s cubic-bezier(.16,1,.3,1);
  }
  .content::-webkit-scrollbar { width:3px; }
  .content::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }
  .content.drawer-open { margin-right:430px; }

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

  /* ══ BUTTONS ══ */
  .btn { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:6px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif; letter-spacing:.2px; border:1px solid transparent; transition:all .2s; }
  .btn-ghost { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .btn-ghost:hover { border-color:var(--ink20); color:var(--ink60); background:var(--warm); }
  .btn-gold  { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.3); }
  .btn-gold:hover { background:var(--goldl); box-shadow:0 4px 16px rgba(184,144,42,.4); transform:translateY(-1px); }
  .btn-red   { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .btn-red:hover { background:rgba(181,55,42,.14); }

  /* ══ STAT STRIP ══ */
  .stat-strip { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; animation:fadeUp .35s ease both; animation-delay:40ms; }
  .stat-card  {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 16px; box-shadow:var(--shadow-xs);
    position:relative; overflow:hidden; transition:box-shadow .2s,transform .2s; cursor:default;
  }
  .stat-card:hover { box-shadow:var(--shadow-sm); transform:translateY(-1px); }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--sc),transparent); }
  .stat-lbl { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); margin-bottom:8px; }
  .stat-val { font-family:'Geist Mono',monospace; font-size:24px; font-weight:600; color:var(--sc); line-height:1; }
  .stat-sub { font-size:10.5px; color:var(--ink40); margin-top:4px; }

  /* ══ FILTER BAR ══ */
  .filter-bar {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:10px; padding:14px 18px; box-shadow:var(--shadow-xs);
    display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
    animation:fadeUp .4s ease both; animation-delay:70ms;
  }
  .filter-group { display:flex; flex-direction:column; gap:6px; }
  .filter-label { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); }
  .search-wrap  { position:relative; }
  .search-ico   { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--ink30); pointer-events:none; }
  .search-input {
    width:100%; padding:9px 12px 9px 36px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:13px; font-weight:500; color:var(--ink); outline:none; transition:all .18s;
  }
  .search-input::placeholder { color:var(--ink20); }
  .search-input:hover  { border-color:var(--ink20); background:var(--paper); }
  .search-input:focus  { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .search-input.active { border-color:var(--gold); background:var(--paper); }
  .search-clear { position:absolute; right:10px; top:50%; transform:translateY(-50%); width:20px; height:20px; border-radius:50%; background:var(--ink10); border:none; color:var(--ink40); font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .search-clear:hover { background:var(--ink20); color:var(--ink60); }
  .filter-select-wrap { position:relative; }
  .filter-select {
    padding:9px 32px 9px 12px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; font-family:'Outfit',sans-serif;
    font-size:12.5px; font-weight:500; color:var(--ink);
    outline:none; appearance:none; cursor:pointer; transition:all .18s; min-width:120px;
  }
  .filter-select:hover { border-color:var(--ink20); background:var(--paper); }
  .filter-select:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .filter-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .filter-divider { width:1px; background:var(--ink10); align-self:stretch; margin:2px 0; }
  .view-toggle { display:flex; border:1.5px solid var(--ink10); border-radius:7px; overflow:hidden; }
  .view-btn    { padding:8px 12px; background:transparent; border:none; color:var(--ink30); cursor:pointer; font-size:14px; transition:all .15s; display:flex; align-items:center; }
  .view-btn:hover  { background:var(--warm); color:var(--ink50); }
  .view-btn.active { background:var(--ink); color:var(--goldl); }
  .filter-chips { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .filter-chip  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; background:var(--goldbg); border:1px solid var(--goldbr); color:var(--gold); font-size:11px; font-weight:700; }
  .chip-remove  { background:none; border:none; cursor:pointer; color:var(--gold); opacity:.65; font-size:14px; line-height:1; padding:0; }
  .chip-remove:hover { opacity:1; }

  /* ══ RESULTS BAR ══ */
  .results-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .results-count { font-size:12px; color:var(--ink40); font-weight:500; }
  .results-count strong { color:var(--ink60); font-weight:700; }

  /* ══ TABLE ══ */
  .table-card { background:var(--paper); border:1px solid var(--ink10); border-radius:10px; box-shadow:var(--shadow-xs); overflow:hidden; animation:fadeUp .45s ease both; animation-delay:100ms; }
  .tbl-head { display:grid; grid-template-columns:52px 2.6fr 1.1fr 1fr 1fr 80px 100px; gap:8px; padding:11px 18px; background:var(--warm); border-bottom:1px solid var(--ink10); }
  .tbl-hcell { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none; transition:color .15s; }
  .tbl-hcell:hover { color:var(--ink60); }
  .tbl-hcell.sorted { color:var(--gold); }
  .sort-arr  { font-size:8px; }
  .tbl-row {
    display:grid; grid-template-columns:52px 2.6fr 1.1fr 1fr 1fr 80px 100px; gap:8px;
    padding:11px 18px; align-items:center;
    border-bottom:1px solid var(--ink03); transition:background .14s; cursor:pointer;
  }
  .tbl-row:last-child { border-bottom:none; }
  .tbl-row:hover { background:var(--warm); }
  .tbl-row.sel-row { background:var(--goldbg); border-left:3px solid var(--gold); padding-left:15px; }
  .sup-av {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:700; flex-shrink:0; letter-spacing:.3px;
  }
  .sup-av-lg {
    width:52px; height:52px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; flex-shrink:0; letter-spacing:.3px;
  }
  .sup-name { font-size:13.5px; font-weight:700; color:var(--ink); margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sup-sub  { font-size:11px; color:var(--ink40); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sup-code { font-family:'Geist Mono',monospace; font-size:10.5px; color:var(--gold); margin-top:1px; }
  .tbl-cell { font-size:12.5px; color:var(--ink60); font-weight:500; }
  .tbl-mono { font-family:'Geist Mono',monospace; font-size:12px; color:var(--ink60); }
  .tbl-actions { display:flex; gap:4px; justify-content:flex-end; }
  .tbl-act-btn { width:28px; height:28px; border-radius:6px; background:transparent; border:1px solid transparent; color:var(--ink30); cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:all .14s; }
  .tbl-act-btn:hover       { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .tbl-act-btn.edit:hover  { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }
  .tbl-act-btn.del:hover   { background:var(--redbg);  border-color:var(--redbr);  color:var(--red);  }

  /* Status + badges */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:9.5px; font-weight:700; text-transform:capitalize; letter-spacing:.3px; }
  .status-dot   { width:5px; height:5px; border-radius:50%; }
  .tag-chip     { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:.3px; white-space:nowrap; }

  /* Star rating */
  .stars { display:flex; align-items:center; gap:2px; }
  .star  { font-size:11px; line-height:1; }

  /* ══ CARD VIEW ══ */
  .sup-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; animation:fadeUp .45s ease both; animation-delay:100ms; }
  .sup-card {
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:12px; overflow:hidden; box-shadow:var(--shadow-xs);
    cursor:pointer; transition:all .22s cubic-bezier(.16,1,.3,1); display:flex; flex-direction:column;
  }
  .sup-card:hover { box-shadow:var(--shadow-md); transform:translateY(-3px); border-color:var(--ink20); }
  .sup-card.sel-card { border-color:var(--gold); box-shadow:0 0 0 2px var(--gold),var(--shadow-sm); }
  .sup-card-head { padding:16px 18px 14px; display:flex; gap:13px; align-items:flex-start; }
  .sup-card-info { flex:1; min-width:0; }
  .sup-card-name { font-size:15px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sup-card-contact { font-size:11.5px; color:var(--ink40); margin-bottom:6px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sup-card-tags { display:flex; gap:4px; flex-wrap:wrap; }
  .sup-card-stats { display:grid; grid-template-columns:1fr 1fr 1fr; border-top:1px solid var(--ink06); }
  .sup-stat { padding:10px 12px; display:flex; flex-direction:column; gap:3px; }
  .sup-stat:not(:last-child) { border-right:1px solid var(--ink06); }
  .ssv { font-family:'Geist Mono',monospace; font-size:13px; font-weight:700; color:var(--ink); }
  .ssl { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--ink40); }
  .sup-card-footer { padding:10px 18px; background:var(--warm); border-top:1px solid var(--ink06); display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:auto; }
  .sup-card-actions { display:flex; gap:5px; }
  .sup-act-btn { width:28px; height:28px; border-radius:6px; background:transparent; border:1px solid transparent; color:var(--ink30); cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:all .14s; }
  .sup-act-btn:hover       { background:var(--warm2); border-color:var(--ink10); color:var(--ink60); }
  .sup-act-btn.edit:hover  { background:var(--goldbg); border-color:var(--goldbr); color:var(--gold); }
  .sup-act-btn.del:hover   { background:var(--redbg);  border-color:var(--redbr);  color:var(--red);  }

  /* ══ EMPTY ══ */
  .empty-state { padding:64px 32px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .empty-ico   { font-size:48px; opacity:.4; }
  .empty-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink60); }
  .empty-sub   { font-size:13px; color:var(--ink40); max-width:300px; line-height:1.6; }

  /* ══ DRAWER ══ */
  .drawer-overlay { position:fixed; inset:0; background:rgba(27,23,19,.2); z-index:200; backdrop-filter:blur(1px); animation:overlayIn .22s ease; }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  .drawer {
    position:fixed; top:var(--topbar-h); right:0; bottom:0;
    width:430px; background:var(--paper);
    border-left:1px solid var(--ink10); box-shadow:var(--shadow-lg);
    z-index:201; display:flex; flex-direction:column; overflow:hidden;
    animation:drawerIn .3s cubic-bezier(.16,1,.3,1);
  }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:none} }
  .drawer-head { padding:18px 20px 16px; background:var(--ink); border-bottom:1px solid rgba(184,144,42,.2); flex-shrink:0; }
  .drawer-head-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .drawer-eyebrow  { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); }
  .drawer-close { width:30px; height:30px; border-radius:6px; background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1); color:rgba(246,243,236,.4); cursor:pointer; font-size:17px; display:flex; align-items:center; justify-content:center; transition:all .15s; }
  .drawer-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }
  .drawer-profile { display:flex; align-items:center; gap:14px; }
  .drawer-name  { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:600; color:#F6F3EC; line-height:1.1; margin-bottom:3px; }
  .drawer-sub   { font-size:11.5px; color:rgba(246,243,236,.4); }
  .drawer-tags  { display:flex; gap:5px; flex-wrap:wrap; margin-top:7px; }
  .drawer-body  { flex:1; overflow-y:auto; padding:18px 20px; display:flex; flex-direction:column; gap:20px; }
  .drawer-body::-webkit-scrollbar { width:3px; }
  .drawer-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }
  .d-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .d-section::after { content:''; flex:1; height:1px; background:var(--ink06); }
  .d-kpi-row { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .d-kpi { padding:12px 13px; border-radius:9px; background:var(--warm); border:1px solid var(--ink10); text-align:center; }
  .d-kpi-val { font-family:'Geist Mono',monospace; font-size:16px; font-weight:700; color:var(--ink); line-height:1; margin-bottom:4px; }
  .d-kpi-lbl { font-size:9px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--ink40); }
  .d-row { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:7px 0; border-bottom:1px solid var(--ink03); }
  .d-row:last-child { border-bottom:none; }
  .d-label { font-size:11.5px; color:var(--ink40); font-weight:500; flex-shrink:0; }
  .d-value { font-size:12.5px; font-weight:600; color:var(--ink); text-align:right; line-height:1.4; }
  .d-mono  { font-family:'Geist Mono',monospace; font-size:12px; }
  .notes-box { padding:11px 13px; background:var(--warm); border:1px solid var(--ink10); border-radius:8px; font-size:12.5px; color:var(--ink60); line-height:1.6; }
  .products-list { display:flex; flex-wrap:wrap; gap:6px; }
  .product-tag { padding:4px 10px; border-radius:6px; background:var(--warm); border:1px solid var(--ink10); font-size:11.5px; font-weight:600; color:var(--ink60); }
  /* Rating bar */
  .rating-row { display:flex; align-items:center; gap:10px; }
  .rating-stars { display:flex; gap:3px; }
  .rating-star  { font-size:16px; }
  .rating-label { font-size:12px; font-weight:700; color:var(--ink50); }
  /* Bank info box */
  .bank-box { background:var(--ink); border:1px solid rgba(184,144,42,.18); border-radius:9px; padding:13px 15px; display:flex; flex-direction:column; gap:8px; }
  .bank-row { display:flex; justify-content:space-between; align-items:center; }
  .bank-label { font-size:10.5px; color:rgba(246,243,236,.35); font-weight:600; }
  .bank-value { font-family:'Geist Mono',monospace; font-size:11.5px; color:rgba(246,243,236,.75); font-weight:600; }
  .drawer-actions { padding:14px 20px; border-top:1px solid var(--ink10); display:flex; gap:8px; flex-shrink:0; background:var(--paper); }
  .d-btn { flex:1; padding:10px; border-radius:7px; font-size:12.5px; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif; border:1px solid transparent; transition:all .18s; display:flex; align-items:center; justify-content:center; gap:7px; }
  .d-btn-gold  { background:var(--gold); border-color:var(--goldd); color:#fff; box-shadow:0 2px 8px rgba(184,144,42,.25); }
  .d-btn-gold:hover { background:var(--goldl); }
  .d-btn-ghost { background:transparent; border-color:var(--ink10); color:var(--ink50); }
  .d-btn-ghost:hover { border-color:var(--ink20); background:var(--warm); }
  .d-btn-danger { background:var(--redbg); border-color:var(--redbr); color:var(--red); }
  .d-btn-danger:hover { background:rgba(181,55,42,.14); }

  /* ══ MODAL ══ */
  .modal-backdrop { position:fixed; inset:0; background:rgba(27,23,19,.5); z-index:400; backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; animation:bdIn .22s ease; }
  @keyframes bdIn { from{opacity:0} to{opacity:1} }
  .modal { background:var(--paper); border:1px solid var(--ink10); border-radius:16px; box-shadow:var(--shadow-lg); width:100%; max-width:680px; max-height:93vh; display:flex; flex-direction:column; overflow:hidden; animation:modalIn .28s cubic-bezier(.16,1,.3,1); }
  @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(12px)} to{opacity:1;transform:none} }
  .modal-head { padding:20px 26px 18px; background:var(--ink); border-bottom:1px solid rgba(184,144,42,.25); display:flex; align-items:flex-start; justify-content:space-between; flex-shrink:0; }
  .modal-eyebrow { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(184,144,42,.7); margin-bottom:4px; }
  .modal-title   { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; }
  .modal-close   { width:32px; height:32px; border-radius:7px; background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.1); color:rgba(246,243,236,.4); cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
  .modal-close:hover { background:rgba(246,243,236,.12); color:rgba(246,243,236,.85); }

  /* Preview strip */
  .modal-preview { padding:13px 26px; background:linear-gradient(135deg,rgba(27,23,19,.97),rgba(43,38,33,.92)); border-bottom:1px solid rgba(184,144,42,.1); display:flex; align-items:center; gap:14px; flex-shrink:0; }
  .mp-av { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:700; flex-shrink:0; }
  .mp-name    { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:600; color:#F6F3EC; line-height:1.1; }
  .mp-contact { font-size:11.5px; color:rgba(246,243,236,.38); margin-top:2px; }

  .modal-body { padding:22px 26px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:18px; }
  .modal-body::-webkit-scrollbar { width:3px; }
  .modal-body::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:3px; }

  /* Form */
  .field       { display:flex; flex-direction:column; gap:7px; }
  .field-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .field-row-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .label { font-size:10.5px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:var(--ink50); display:flex; align-items:center; gap:5px; }
  .label-req  { color:var(--red); font-size:13px; line-height:1; }
  .label-hint { font-size:10px; font-weight:400; color:var(--ink30); letter-spacing:0; text-transform:none; }
  .input,.textarea,.mselect {
    width:100%; padding:10px 13px;
    background:var(--cream); border:1.5px solid var(--ink10);
    border-radius:7px; color:var(--ink); font-size:13.5px; font-weight:500; font-family:'Outfit',sans-serif;
    outline:none; transition:all .18s; appearance:none;
  }
  .input::placeholder,.textarea::placeholder { color:var(--ink20); font-weight:400; }
  .input:hover,.textarea:hover,.mselect:hover { border-color:var(--ink20); background:var(--paper); }
  .input:focus,.textarea:focus,.mselect:focus { border-color:var(--gold); background:var(--paper); box-shadow:0 0 0 3px rgba(184,144,42,.1); }
  .input.error { border-color:var(--red); box-shadow:0 0 0 3px rgba(181,55,42,.08); }
  .textarea { resize:vertical; min-height:72px; line-height:1.55; }
  .sel-wrap  { position:relative; }
  .sel-arrow { position:absolute; right:11px; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink30); pointer-events:none; }
  .field-error { font-size:11px; color:var(--red); font-weight:500; display:flex; align-items:center; gap:4px; }

  /* Star rating input */
  .star-input  { display:flex; gap:4px; }
  .star-btn    { font-size:22px; background:none; border:none; cursor:pointer; transition:transform .15s; line-height:1; padding:0 2px; }
  .star-btn:hover { transform:scale(1.2); }

  /* Toggle */
  .toggle-row { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .toggle-info .toggle-title { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:2px; }
  .toggle-info .toggle-desc  { font-size:11px; color:var(--ink40); line-height:1.4; }
  .toggle { position:relative; width:40px; height:22px; flex-shrink:0; cursor:pointer; }
  .toggle input { opacity:0; width:0; height:0; position:absolute; }
  .toggle-track { position:absolute; inset:0; border-radius:11px; background:var(--ink10); transition:all .2s; border:1.5px solid var(--ink10); }
  .toggle input:checked~.toggle-track { background:var(--green); border-color:#205038; }
  .toggle-thumb { position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform .2s cubic-bezier(.16,1,.3,1); box-shadow:0 1px 3px rgba(27,23,19,.2); }
  .toggle input:checked~.toggle-track .toggle-thumb { transform:translateX(18px); }

  /* Section heading inside modal */
  .m-section { font-size:9px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--ink30); display:flex; align-items:center; gap:10px; }
  .m-section::after { content:''; flex:1; height:1px; background:var(--ink06); }

  .modal-footer { padding:16px 26px; border-top:1px solid var(--ink10); display:flex; align-items:center; gap:10px; flex-shrink:0; background:var(--paper); }
  .modal-footer-hint { flex:1; font-size:11px; color:var(--ink30); }

  /* Delete */
  .del-modal { max-width:400px; }
  .del-body  { padding:28px 24px; display:flex; flex-direction:column; gap:14px; align-items:center; text-align:center; }
  .del-icon  { font-size:44px; }
  .del-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--ink); }
  .del-sub   { font-size:13px; color:var(--ink40); line-height:1.6; max-width:280px; }

  /* Toast */
  .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(16px); background:var(--ink); border:1px solid rgba(184,144,42,.3); border-radius:10px; padding:12px 20px; display:flex; align-items:center; gap:10px; box-shadow:var(--shadow-lg); z-index:1000; opacity:0; pointer-events:none; transition:all .3s cubic-bezier(.16,1,.3,1); white-space:nowrap; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
  .toast-icon { font-size:15px; }
  .toast-msg  { font-size:13px; font-weight:600; color:#F6F3EC; }
  .toast-sub  { font-size:11.5px; color:rgba(246,243,236,.4); }

  /* ══ RESPONSIVE ══ */
  @media (max-width:1280px) {
    .tbl-head,.tbl-row { grid-template-columns:52px 2.6fr 1.1fr 1fr 80px 100px; }
    .tbl-head>:nth-child(5),.tbl-row>:nth-child(5) { display:none; }
    .stat-strip { grid-template-columns:repeat(3,1fr); }
    .content.drawer-open { margin-right:390px; }
    .drawer { width:390px; }
  }
  @media (max-width:960px) {
    .tbl-head,.tbl-row { grid-template-columns:52px 2.6fr 1fr 80px 90px; }
    .tbl-head>:nth-child(3),.tbl-row>:nth-child(3) { display:none; }
    .content.drawer-open { margin-right:0; }
    .drawer { width:100%; max-width:430px; }
    .stat-strip { grid-template-columns:repeat(3,1fr); }
  }
  @media (max-width:680px) {
    .content { padding:14px 16px; }
    .stat-strip { grid-template-columns:repeat(2,1fr); }
    .field-row-2,.field-row-3 { grid-template-columns:1fr; }
    .sup-grid { grid-template-columns:1fr; }
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function SupplierManagement() {
  const [suppliers,  setSuppliers]  = useState(INITIAL_SUPPLIERS);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("All");
  const [countryF,   setCountryF]   = useState("All");
  const [statFilter, setStatFilter] = useState("All");
  const [prefFilter, setPrefFilter] = useState("All");
  const [sortKey,    setSortKey]    = useState("name");
  const [sortAsc,    setSortAsc]    = useState(true);
  const [view,       setView]       = useState("table");
  const [selectedId, setSelectedId] = useState(null);
  const [modalMode,  setModalMode]  = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(BLANK_FORM);
  const [errors,     setErrors]     = useState({});
  const [toast,      setToast]      = useState({ show: false, msg: "", sub: "" });
  const searchRef = useRef();

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setModalMode(null); setDelTarget(null); setSelectedId(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── filter & sort ──
  const filtered = useMemo(() => {
    let list = [...suppliers];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(s =>
      s.name.toLowerCase().includes(q)        ||
      s.code.toLowerCase().includes(q)        ||
      s.contactName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)       ||
      s.city.toLowerCase().includes(q)
    );
    if (catFilter  !== "All") list = list.filter(s => s.category === catFilter);
    if (countryF   !== "All") list = list.filter(s => s.country  === countryF);
    if (statFilter !== "All") list = list.filter(s => s.status   === statFilter);
    if (prefFilter === "preferred") list = list.filter(s => s.preferred);

    list.sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [suppliers, search, catFilter, countryF, statFilter, prefFilter, sortKey, sortAsc]);

  const selectedSupplier = suppliers.find(s => s.id === selectedId);

  // ── stats ──
  const activeCount    = suppliers.filter(s => s.status === "active").length;
  const preferredCount = suppliers.filter(s => s.preferred).length;
  const totalValue     = suppliers.reduce((s, x) => s + x.totalValue, 0);
  const avgLeadTime    = Math.round(suppliers.reduce((s, x) => s + x.leadTime, 0) / suppliers.length);

  // ── modal helpers ──
  const openAdd = () => {
    setForm({ ...BLANK_FORM, code: `SUP-${String(suppliers.length + 1).padStart(3, "0")}` });
    setErrors({}); setEditTarget(null); setModalMode("add");
  };
  const openEdit = (s) => {
    setEditTarget(s.id);
    setForm({
      name: s.name, code: s.code, category: s.category,
      contactName: s.contactName, contactTitle: s.contactTitle,
      email: s.email, phone: s.phone, altPhone: s.altPhone || "",
      website: s.website || "", country: s.country, city: s.city,
      address: s.address || "", taxId: s.taxId || "",
      paymentTerms: s.paymentTerms, currency: s.currency,
      leadTime: String(s.leadTime), minOrder: String(s.minOrder),
      status: s.status, rating: s.rating, preferred: s.preferred,
      bankName: s.bankName || "", bankAccount: s.bankAccount || "",
      bankSwift: s.bankSwift || "", notes: s.notes || "", tags: [...s.tags],
    });
    setErrors({}); setModalMode("edit");
  };

  const updateForm = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Supplier name is required";
    if (!form.code.trim())        e.code        = "Supplier code is required";
    if (!form.contactName.trim()) e.contactName = "Contact name is required";
    if (!form.phone.trim())       e.phone       = "Phone number is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modalMode === "add") {
      const ns = {
        id: Date.now(), ...form,
        name: form.name.trim(), code: form.code.trim(),
        contactName: form.contactName.trim(),
        leadTime: parseInt(form.leadTime) || 7,
        minOrder: parseInt(form.minOrder) || 0,
        totalOrders: 0, totalValue: 0,
        lastOrder: "—", joinedAt: new Date().toISOString().split("T")[0],
        products: [],
      };
      setSuppliers(s => [ns, ...s]);
      showToast("Supplier added", form.name.trim());
    } else {
      setSuppliers(s => s.map(x => x.id === editTarget ? {
        ...x, ...form,
        leadTime: parseInt(form.leadTime) || x.leadTime,
        minOrder: parseInt(form.minOrder) || x.minOrder,
      } : x));
      showToast("Supplier updated", form.name.trim());
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    const s = suppliers.find(x => x.id === delTarget);
    setSuppliers(list => list.filter(x => x.id !== delTarget));
    if (selectedId === delTarget) setSelectedId(null);
    setDelTarget(null);
    showToast("Supplier removed", s?.name || "");
  };

  const showToast = (msg, sub = "") => {
    setToast({ show: true, msg, sub });
    setTimeout(() => setToast({ show: false, msg: "", sub: "" }), 3000);
  };

  const toggleSort = (k) => { if (sortKey === k) setSortAsc(v => !v); else { setSortKey(k); setSortAsc(true); } };
  const SortIcon = ({ k }) => (
    <span className="sort-arr" style={{ opacity: sortKey === k ? 1 : .3, color: sortKey === k ? "var(--gold)" : "inherit" }}>
      {sortAsc && sortKey === k ? "▲" : "▼"}
    </span>
  );

  const StarRow = ({ rating, size = 12 }) => (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="star" style={{ fontSize: size, opacity: i <= rating ? 1 : .2, color: RATING_COLORS[rating] || "#B8902A" }}>★</span>
      ))}
    </div>
  );

  const TagBadge = ({ tag }) => {
    const s = TAG_STYLES[tag] || { bg: "var(--warm2)", border: "var(--ink10)", text: "var(--ink50)" };
    return <span className="tag-chip" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{tag}</span>;
  };

  const StatusBadge = ({ status }) => (
    <span className="status-badge" style={{
      background: status === "active" ? "var(--greenbg)" : "var(--warm2)",
      border: `1px solid ${status === "active" ? "var(--greenbr)" : "var(--ink10)"}`,
      color: status === "active" ? "var(--green)" : "var(--ink40)",
    }}>
      <span className="status-dot" style={{ background: status === "active" ? "#3D8A65" : "#9E9080" }} />
      {status}
    </span>
  );

  const hasFilter = search || catFilter !== "All" || countryF !== "All" || statFilter !== "All" || prefFilter !== "All";
  const clearAll  = () => { setSearch(""); setCatFilter("All"); setCountryF("All"); setStatFilter("All"); setPrefFilter("All"); };

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
              <span className="bc-active">Suppliers</span>
            </nav>
          </div>
          <div className="topbar-right">
            <div className="vdiv" />
            <div className="tb-avatar">AD</div>
          </div>
        </header>

        <div className="main">
          <div className={`content${selectedId ? " drawer-open" : ""}`}>

            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <div className="page-eyebrow">Procurement · Supply Chain</div>
                <div className="page-title">Supplier Management</div>
                <div className="page-desc">{suppliers.length} registered suppliers across {new Set(suppliers.map(s => s.country)).size} countries</div>
              </div>
              <div className="page-actions">
                <button className="btn btn-ghost">↓ Export</button>
                <button className="btn btn-gold" onClick={openAdd}>＋ Add Supplier</button>
              </div>
            </div>

            {/* STAT STRIP */}
            <div className="stat-strip">
              {[
                { label: "Total Suppliers",   val: suppliers.length,  sub: "All registered",         color: "var(--blue)"   },
                { label: "Active",            val: activeCount,        sub: "Currently supplying",    color: "var(--green)"  },
                { label: "Preferred",         val: preferredCount,     sub: "Priority partners",      color: "var(--gold)"   },
                { label: "Avg Lead Time",     val: `${avgLeadTime}d`,  sub: "Days to delivery",       color: "var(--purple)" },
                { label: "Total Order Value", val: `$${Math.round(totalValue / 1000)}k`, sub: "Lifetime purchases", color: "var(--brown)" },
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
              {/* Search */}
              <div className="filter-group" style={{ flex: 1, minWidth: 200 }}>
                <div className="filter-label">Search</div>
                <div className="search-wrap">
                  <span className="search-ico">⌕</span>
                  <input
                    ref={searchRef}
                    className={`search-input${search ? " active" : ""}`}
                    placeholder="Name, code, contact, city…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && <button className="search-clear" onClick={() => { setSearch(""); searchRef.current.focus(); }}>×</button>}
                </div>
              </div>

              {/* Category */}
              <div className="filter-group">
                <div className="filter-label">Category</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Country */}
              <div className="filter-group">
                <div className="filter-label">Country</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={countryF} onChange={e => setCountryF(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Status */}
              <div className="filter-group">
                <div className="filter-label">Status</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={statFilter} onChange={e => setStatFilter(e.target.value)} style={{ minWidth: 110 }}>
                    <option>All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              {/* Preferred */}
              <div className="filter-group">
                <div className="filter-label">Type</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={prefFilter} onChange={e => setPrefFilter(e.target.value)} style={{ minWidth: 120 }}>
                    <option value="All">All</option>
                    <option value="preferred">Preferred only</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              <div className="filter-divider" />

              {/* View toggle */}
              <div className="filter-group">
                <div className="filter-label">View</div>
                <div className="view-toggle">
                  <button className={`view-btn${view === "table" ? " active" : ""}`} onClick={() => setView("table")} title="Table">☰</button>
                  <button className={`view-btn${view === "card"  ? " active" : ""}`} onClick={() => setView("card")}  title="Cards">⊞</button>
                </div>
              </div>

              {hasFilter && (
                <button className="btn btn-ghost" style={{ padding: "7px 13px", fontSize: 11.5, alignSelf: "flex-end" }} onClick={clearAll}>
                  ✕ Clear all
                </button>
              )}
            </div>

            {/* RESULTS BAR */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>{filtered.length}</strong> of <strong>{suppliers.length}</strong> suppliers
                {hasFilter && " (filtered)"}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--ink40)", fontWeight: 600 }}>Sort</span>
                <div className="filter-select-wrap">
                  <select className="filter-select" style={{ minWidth: 145, fontSize: 12 }}
                    value={sortKey} onChange={e => { setSortKey(e.target.value); setSortAsc(true); }}>
                    <option value="name">Name</option>
                    <option value="code">Code</option>
                    <option value="totalValue">Order Value</option>
                    <option value="totalOrders">Total Orders</option>
                    <option value="leadTime">Lead Time</option>
                    <option value="rating">Rating</option>
                    <option value="lastOrder">Last Order</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
                <button className="btn btn-ghost" style={{ padding: "7px 11px", fontSize: 13 }}
                  onClick={() => setSortAsc(v => !v)}>{sortAsc ? "↑" : "↓"}</button>
              </div>
            </div>

            {/* ══ TABLE VIEW ══ */}
            {view === "table" && (
              <div className="table-card">
                {filtered.length === 0
                  ? <div className="empty-state"><div className="empty-ico">🏭</div><div className="empty-title">No suppliers found</div><div className="empty-sub">Adjust your search or filters, or add a new supplier.</div><button className="btn btn-ghost" onClick={clearAll}>Clear filters</button></div>
                  : (
                    <>
                      <div className="tbl-head">
                        <div className="tbl-hcell" />
                        <div className={`tbl-hcell${sortKey === "name" ? " sorted" : ""}`} onClick={() => toggleSort("name")}>Supplier <SortIcon k="name" /></div>
                        <div className="tbl-hcell">Location</div>
                        <div className={`tbl-hcell${sortKey === "totalValue" ? " sorted" : ""}`} onClick={() => toggleSort("totalValue")}>Orders <SortIcon k="totalValue" /></div>
                        <div className={`tbl-hcell${sortKey === "leadTime" ? " sorted" : ""}`} onClick={() => toggleSort("leadTime")}>Lead Time <SortIcon k="leadTime" /></div>
                        <div className={`tbl-hcell${sortKey === "rating" ? " sorted" : ""}`} onClick={() => toggleSort("rating")}>Rating <SortIcon k="rating" /></div>
                        <div className="tbl-hcell" style={{ justifyContent: "flex-end" }}>Actions</div>
                      </div>

                      {filtered.map((s, i) => {
                        const [clr, bg] = avColor(s.id);
                        return (
                          <div
                            key={s.id}
                            className={`tbl-row${selectedId === s.id ? " sel-row" : ""}`}
                            style={{ animationDelay: `${i * 15}ms`, animation: "fadeUp .4s ease both", opacity: s.status === "active" ? 1 : .65 }}
                            onClick={() => setSelectedId(x => x === s.id ? null : s.id)}
                          >
                            <div className="sup-av" style={{ background: bg, border: `1.5px solid ${clr}30`, color: clr }}>
                              {initials(s.name)}
                            </div>

                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                                <span className="sup-name">{s.name}</span>
                                {s.preferred && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20, background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)", letterSpacing: ".5px" }}>★ PREFERRED</span>}
                              </div>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <span className="sup-code">{s.code}</span>
                                <span style={{ fontSize: 10, color: "var(--ink30)" }}>·</span>
                                <span style={{ fontSize: 11, color: "var(--ink40)" }}>{s.contactName}</span>
                              </div>
                              <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
                                {s.tags.slice(0, 2).map(t => <TagBadge key={t} tag={t} />)}
                              </div>
                            </div>

                            <div>
                              <div className="tbl-cell" style={{ marginBottom: 2 }}>
                                {COUNTRY_FLAG[s.country] || "🌐"} {s.city}
                              </div>
                              <div className="tbl-mono" style={{ fontSize: 10.5 }}>{s.country}</div>
                            </div>

                            <div>
                              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>${fmt(s.totalValue)}</div>
                              <div style={{ fontSize: 10.5, color: "var(--ink40)" }}>{s.totalOrders} orders</div>
                            </div>

                            <div>
                              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 14, fontWeight: 700, color: s.leadTime <= 7 ? "var(--green)" : s.leadTime <= 14 ? "var(--gold)" : "var(--red)" }}>
                                {s.leadTime}d
                              </div>
                              <div style={{ fontSize: 10, color: "var(--ink40)" }}>{s.paymentTerms}</div>
                            </div>

                            <StarRow rating={s.rating} size={13} />

                            <div className="tbl-actions" onClick={e => e.stopPropagation()}>
                              <button className="tbl-act-btn edit" title="Edit" onClick={() => openEdit(s)}>✏</button>
                              <button className="tbl-act-btn del"  title="Delete" onClick={() => setDelTarget(s.id)}>🗑</button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )
                }
              </div>
            )}

            {/* ══ CARD VIEW ══ */}
            {view === "card" && (
              filtered.length === 0
                ? <div className="table-card"><div className="empty-state"><div className="empty-ico">🏭</div><div className="empty-title">No suppliers found</div><div className="empty-sub">Adjust filters to find suppliers.</div><button className="btn btn-ghost" onClick={clearAll}>Clear filters</button></div></div>
                : (
                  <div className="sup-grid">
                    {filtered.map((s, i) => {
                      const [clr, bg] = avColor(s.id);
                      return (
                        <div
                          key={s.id}
                          className={`sup-card${selectedId === s.id ? " sel-card" : ""}`}
                          style={{ animationDelay: `${i * 20}ms`, animation: "fadeUp .4s ease both", opacity: s.status === "active" ? 1 : .65 }}
                          onClick={() => setSelectedId(x => x === s.id ? null : s.id)}
                        >
                          <div className="sup-card-head">
                            <div className="sup-av" style={{ background: bg, border: `1.5px solid ${clr}30`, color: clr, width: 46, height: 46, borderRadius: 10, fontSize: 15 }}>
                              {initials(s.name)}
                            </div>
                            <div className="sup-card-info">
                              <div className="sup-card-name">{s.name}</div>
                              <div className="sup-card-contact">{COUNTRY_FLAG[s.country] || "🌐"} {s.city}, {s.country}</div>
                              <div className="sup-card-tags">
                                {s.preferred && <span className="tag-chip" style={{ background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)" }}>★ preferred</span>}
                                {s.tags.slice(0, 2).map(t => <TagBadge key={t} tag={t} />)}
                              </div>
                            </div>
                          </div>

                          <div className="sup-card-stats">
                            <div className="sup-stat"><div className="ssv">${Math.round(s.totalValue / 1000)}k</div><div className="ssl">Value</div></div>
                            <div className="sup-stat"><div className="ssv">{s.leadTime}d</div><div className="ssl">Lead</div></div>
                            <div className="sup-stat">
                              <StarRow rating={s.rating} size={12} />
                              <div className="ssl" style={{ marginTop: 3 }}>Rating</div>
                            </div>
                          </div>

                          <div className="sup-card-footer">
                            <StatusBadge status={s.status} />
                            <div className="sup-card-actions" onClick={e => e.stopPropagation()}>
                              <button className="sup-act-btn edit" onClick={() => openEdit(s)}>✏</button>
                              <button className="sup-act-btn del"  onClick={() => setDelTarget(s.id)}>🗑</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
            )}

          </div>

          {/* ══ DETAIL DRAWER ══ */}
          {selectedId && selectedSupplier && (() => {
            const s = selectedSupplier;
            const [clr, bg] = avColor(s.id);
            return (
              <>
                <div className="drawer-overlay" onClick={() => setSelectedId(null)} />
                <aside className="drawer">
                  <div className="drawer-head">
                    <div className="drawer-head-top">
                      <span className="drawer-eyebrow">Supplier Profile</span>
                      <button className="drawer-close" onClick={() => setSelectedId(null)}>×</button>
                    </div>
                    <div className="drawer-profile">
                      <div className="sup-av-lg" style={{ background: bg, border: `2px solid ${clr}35`, color: clr }}>
                        {initials(s.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="drawer-name">{s.name}</div>
                        <div className="drawer-sub">{s.code} · {s.category}</div>
                        <div className="drawer-tags">
                          {s.preferred && <span className="tag-chip" style={{ background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)" }}>★ Preferred</span>}
                          {s.tags.map(t => <TagBadge key={t} tag={t} />)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="drawer-body">

                    {/* KPI tiles */}
                    <div className="d-kpi-row">
                      <div className="d-kpi"><div className="d-kpi-val">${fmt(s.totalValue)}</div><div className="d-kpi-lbl">Total Value</div></div>
                      <div className="d-kpi"><div className="d-kpi-val">{s.totalOrders}</div><div className="d-kpi-lbl">Orders</div></div>
                      <div className="d-kpi">
                        <div className="d-kpi-val" style={{ color: s.leadTime <= 7 ? "var(--green)" : s.leadTime <= 14 ? "var(--gold)" : "var(--red)" }}>{s.leadTime}d</div>
                        <div className="d-kpi-lbl">Lead Time</div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <div className="d-section">Performance Rating</div>
                      <div className="rating-row">
                        <div className="rating-stars">
                          {[1,2,3,4,5].map(i => (
                            <span key={i} className="rating-star" style={{ opacity: i <= s.rating ? 1 : .15, color: RATING_COLORS[s.rating] }}>★</span>
                          ))}
                        </div>
                        <span className="rating-label">{s.rating}/5</span>
                        <StatusBadge status={s.status} />
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <div className="d-section">Contact</div>
                      <div className="d-row"><span className="d-label">Contact</span><span className="d-value">{s.contactName}{s.contactTitle && <span style={{ fontWeight: 400, color: "var(--ink40)", fontSize: 11 }}><br />{s.contactTitle}</span>}</span></div>
                      <div className="d-row"><span className="d-label">Email</span><span className="d-value" style={{ fontSize: 12 }}>{s.email || "—"}</span></div>
                      <div className="d-row"><span className="d-label">Phone</span><span className="d-value d-mono">{s.phone}</span></div>
                      {s.altPhone && <div className="d-row"><span className="d-label">Alt Phone</span><span className="d-value d-mono">{s.altPhone}</span></div>}
                      {s.website  && <div className="d-row"><span className="d-label">Website</span><span className="d-value" style={{ fontSize: 12, color: "var(--blue)" }}>{s.website}</span></div>}
                    </div>

                    {/* Location */}
                    <div>
                      <div className="d-section">Location</div>
                      <div className="d-row"><span className="d-label">Country</span><span className="d-value">{COUNTRY_FLAG[s.country] || "🌐"} {s.country}</span></div>
                      <div className="d-row"><span className="d-label">City</span><span className="d-value">{s.city}</span></div>
                      {s.address && <div className="d-row"><span className="d-label">Address</span><span className="d-value" style={{ fontSize: 11.5 }}>{s.address}</span></div>}
                      {s.taxId   && <div className="d-row"><span className="d-label">Tax ID</span><span className="d-value d-mono" style={{ fontSize: 11 }}>{s.taxId}</span></div>}
                    </div>

                    {/* Terms */}
                    <div>
                      <div className="d-section">Trading Terms</div>
                      <div className="d-row"><span className="d-label">Payment Terms</span><span className="d-value">{s.paymentTerms}</span></div>
                      <div className="d-row"><span className="d-label">Currency</span><span className="d-value d-mono">{s.currency}</span></div>
                      <div className="d-row"><span className="d-label">Min. Order</span><span className="d-value d-mono">{s.currency} {fmt(s.minOrder)}</span></div>
                      <div className="d-row"><span className="d-label">Last Order</span><span className="d-value d-mono">{s.lastOrder}</span></div>
                      <div className="d-row"><span className="d-label">Partner Since</span><span className="d-value d-mono">{s.joinedAt}</span></div>
                    </div>

                    {/* Bank */}
                    {(s.bankName || s.bankAccount) && (
                      <div>
                        <div className="d-section">Banking Details</div>
                        <div className="bank-box">
                          {s.bankName    && <div className="bank-row"><span className="bank-label">Bank</span><span className="bank-value">{s.bankName}</span></div>}
                          {s.bankAccount && <div className="bank-row"><span className="bank-label">Account</span><span className="bank-value">{s.bankAccount}</span></div>}
                          {s.bankSwift   && <div className="bank-row"><span className="bank-label">SWIFT</span><span className="bank-value">{s.bankSwift}</span></div>}
                        </div>
                      </div>
                    )}

                    {/* Products */}
                    {s.products?.length > 0 && (
                      <div>
                        <div className="d-section">Supplied Products</div>
                        <div className="products-list">
                          {s.products.map(p => <span className="product-tag" key={p}>{p}</span>)}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {s.notes && (
                      <div>
                        <div className="d-section">Notes</div>
                        <div className="notes-box">{s.notes}</div>
                      </div>
                    )}

                  </div>

                  <div className="drawer-actions">
                    <button className="d-btn d-btn-gold" onClick={() => openEdit(s)}>✏ Edit</button>
                    <button className="d-btn d-btn-ghost" style={{ flex: "0 0 auto", padding: "10px 14px" }} title="Contact">✉</button>
                    <button className="d-btn d-btn-danger" style={{ flex: "0 0 auto", padding: "10px 14px" }} onClick={() => setDelTarget(s.id)}>🗑</button>
                  </div>
                </aside>
              </>
            );
          })()}
        </div>

        {/* ══ ADD / EDIT MODAL ══ */}
        {modalMode && (
          <div className="modal-backdrop" onClick={() => setModalMode(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>

              <div className="modal-head">
                <div>
                  <div className="modal-eyebrow">{modalMode === "add" ? "New Supplier" : "Edit Supplier"}</div>
                  <div className="modal-title">{modalMode === "add" ? "Register a new supplier" : `Editing: ${form.name || "…"}`}</div>
                </div>
                <button className="modal-close" onClick={() => setModalMode(null)}>×</button>
              </div>

              {/* Live preview */}
              {form.name && (
                <div className="modal-preview">
                  <div className="mp-av" style={{ background: avColor(editTarget || 0)[1], border: `1px solid ${avColor(editTarget || 0)[0]}30`, color: avColor(editTarget || 0)[0] }}>
                    {initials(form.name)}
                  </div>
                  <div>
                    <div className="mp-name">{form.name}</div>
                    <div className="mp-contact">{form.code}{form.contactName && ` · ${form.contactName}`}</div>
                  </div>
                </div>
              )}

              <div className="modal-body">

                {/* ── Identity ── */}
                <div className="m-section">Supplier Identity</div>
                <div className="field-row-2">
                  <div className="field">
                    <label className="label">Supplier Name <span className="label-req">*</span></label>
                    <input className={`input${errors.name ? " error" : ""}`} placeholder="e.g. TechDist Co." value={form.name} onChange={e => updateForm("name", e.target.value)} autoFocus />
                    {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                  </div>
                  <div className="field">
                    <label className="label">Supplier Code <span className="label-req">*</span></label>
                    <input className={`input${errors.code ? " error" : ""}`} placeholder="SUP-001" value={form.code} onChange={e => updateForm("code", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13 }} />
                    {errors.code && <span className="field-error">⚠ {errors.code}</span>}
                  </div>
                </div>
                <div className="field-row-2">
                  <div className="field">
                    <label className="label">Category</label>
                    <div className="sel-wrap">
                      <select className="mselect" value={form.category} onChange={e => updateForm("category", e.target.value)}>
                        <option value="">Select…</option>
                        {CATEGORY_OPTS.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <span className="sel-arrow">▾</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Tax / Business ID</label>
                    <input className="input" placeholder="e.g. US-88-4421007" value={form.taxId} onChange={e => updateForm("taxId", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13 }} />
                  </div>
                </div>

                {/* ── Contact ── */}
                <div className="m-section">Contact Person</div>
                <div className="field-row-2">
                  <div className="field">
                    <label className="label">Full Name <span className="label-req">*</span></label>
                    <input className={`input${errors.contactName ? " error" : ""}`} placeholder="Marcus Holt" value={form.contactName} onChange={e => updateForm("contactName", e.target.value)} />
                    {errors.contactName && <span className="field-error">⚠ {errors.contactName}</span>}
                  </div>
                  <div className="field">
                    <label className="label">Job Title</label>
                    <input className="input" placeholder="Sales Manager" value={form.contactTitle} onChange={e => updateForm("contactTitle", e.target.value)} />
                  </div>
                </div>
                <div className="field-row-3">
                  <div className="field">
                    <label className="label">Phone <span className="label-req">*</span></label>
                    <input className={`input${errors.phone ? " error" : ""}`} placeholder="+1 415 000 0000" value={form.phone} onChange={e => updateForm("phone", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12.5 }} />
                    {errors.phone && <span className="field-error">⚠ {errors.phone}</span>}
                  </div>
                  <div className="field">
                    <label className="label">Alt Phone</label>
                    <input className="input" placeholder="Optional" value={form.altPhone} onChange={e => updateForm("altPhone", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12.5 }} />
                  </div>
                  <div className="field">
                    <label className="label">Email</label>
                    <input className={`input${errors.email ? " error" : ""}`} type="email" placeholder="contact@supplier.com" value={form.email} onChange={e => updateForm("email", e.target.value)} />
                    {errors.email && <span className="field-error">⚠ {errors.email}</span>}
                  </div>
                </div>
                <div className="field">
                  <label className="label">Website</label>
                  <input className="input" placeholder="www.supplier.com" value={form.website} onChange={e => updateForm("website", e.target.value)} />
                </div>

                {/* ── Location ── */}
                <div className="m-section">Location</div>
                <div className="field-row-2">
                  <div className="field">
                    <label className="label">Country</label>
                    <div className="sel-wrap">
                      <select className="mselect" value={form.country} onChange={e => updateForm("country", e.target.value)}>
                        <option value="">Select country…</option>
                        {["United States","United Kingdom","Germany","Japan","India","South Korea","UAE","Sri Lanka","Singapore","Australia","China","France","Canada","Other"].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <span className="sel-arrow">▾</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">City</label>
                    <input className="input" placeholder="San Francisco" value={form.city} onChange={e => updateForm("city", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Address</label>
                  <input className="input" placeholder="Full street address" value={form.address} onChange={e => updateForm("address", e.target.value)} />
                </div>

                {/* ── Trading Terms ── */}
                <div className="m-section">Trading Terms</div>
                <div className="field-row-3">
                  <div className="field">
                    <label className="label">Payment Terms</label>
                    <div className="sel-wrap">
                      <select className="mselect" value={form.paymentTerms} onChange={e => updateForm("paymentTerms", e.target.value)}>
                        {TERMS_OPTS.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <span className="sel-arrow">▾</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Currency</label>
                    <div className="sel-wrap">
                      <select className="mselect" value={form.currency} onChange={e => updateForm("currency", e.target.value)}>
                        {CURRENCY_OPTS.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <span className="sel-arrow">▾</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Min. Order</label>
                    <input className="input" type="number" min="0" placeholder="500" value={form.minOrder} onChange={e => updateForm("minOrder", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace" }} />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Lead Time <span className="label-hint">— days to delivery</span></label>
                  <input className="input" type="number" min="1" placeholder="7" value={form.leadTime} onChange={e => updateForm("leadTime", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", maxWidth: 120 }} />
                </div>

                {/* ── Bank ── */}
                <div className="m-section">Banking Details <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--ink20)", fontSize: 9 }}>— optional</span></div>
                <div className="field-row-3">
                  <div className="field">
                    <label className="label">Bank Name</label>
                    <input className="input" placeholder="Wells Fargo" value={form.bankName} onChange={e => updateForm("bankName", e.target.value)} />
                  </div>
                  <div className="field">
                    <label className="label">Account No.</label>
                    <input className="input" placeholder="****4821" value={form.bankAccount} onChange={e => updateForm("bankAccount", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13 }} />
                  </div>
                  <div className="field">
                    <label className="label">SWIFT / BIC</label>
                    <input className="input" placeholder="WFBIUS6S" value={form.bankSwift} onChange={e => updateForm("bankSwift", e.target.value)} style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13 }} />
                  </div>
                </div>

                {/* ── Rating & Status ── */}
                <div className="m-section">Rating &amp; Status</div>
                <div className="field">
                  <label className="label">Supplier Rating</label>
                  <div className="star-input">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} className="star-btn" onClick={() => updateForm("rating", i)}>
                        <span style={{ color: i <= form.rating ? (RATING_COLORS[form.rating] || "#B8902A") : "var(--ink10)", fontSize: 24 }}>★</span>
                      </button>
                    ))}
                    <span style={{ fontSize: 12, color: "var(--ink40)", marginLeft: 8, alignSelf: "center" }}>{form.rating}/5</span>
                  </div>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-title">Active</div>
                    <div className="toggle-desc">Supplier is available for purchase orders</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={form.status === "active"} onChange={e => updateForm("status", e.target.checked ? "active" : "inactive")} />
                    <div className="toggle-track"><div className="toggle-thumb" /></div>
                  </label>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <div className="toggle-title">Preferred Supplier</div>
                    <div className="toggle-desc">Mark as priority partner for procurement</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={form.preferred} onChange={e => updateForm("preferred", e.target.checked)} />
                    <div className="toggle-track"><div className="toggle-thumb" /></div>
                  </label>
                </div>

                {/* Notes */}
                <div className="m-section">Internal Notes</div>
                <div className="field">
                  <textarea className="textarea" placeholder="Any internal notes about this supplier — delivery quality, special agreements, contact preferences…" rows={2} value={form.notes} onChange={e => updateForm("notes", e.target.value)} />
                </div>

              </div>

              <div className="modal-footer">
                <span className="modal-footer-hint">{modalMode === "add" ? "Supplier will be registered immediately" : "Changes saved immediately"}</span>
                <button className="btn btn-ghost" onClick={() => setModalMode(null)}>Cancel</button>
                <button className="btn btn-gold" onClick={handleSave}>
                  {modalMode === "add" ? "✦ Register Supplier" : "✓ Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ DELETE CONFIRM ══ */}
        {delTarget && (() => {
          const s = suppliers.find(x => x.id === delTarget);
          const [clr, bg] = avColor(s?.id || 1);
          return (
            <div className="modal-backdrop" onClick={() => setDelTarget(null)}>
              <div className="modal del-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                  <div><div className="modal-eyebrow">Confirm Action</div><div className="modal-title">Remove Supplier</div></div>
                  <button className="modal-close" onClick={() => setDelTarget(null)}>×</button>
                </div>
                <div className="del-body">
                  <div className="sup-av-lg" style={{ background: bg, border: `2px solid ${clr}35`, color: clr }}>{s && initials(s.name)}</div>
                  <div className="del-title">{s?.name}</div>
                  <div className="del-sub">
                    This will permanently remove <strong>{s?.name}</strong> and all their associated records. Products linked to this supplier will become unassigned. This cannot be undone.
                  </div>
                  <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 4 }}>
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDelTarget(null)}>Cancel</button>
                    <button className="btn btn-red"   style={{ flex: 1 }} onClick={handleDelete}>🗑 Remove Supplier</button>
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