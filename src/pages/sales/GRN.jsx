import { useState, useMemo } from "react";

// ══════════════════════════════════════════════════════════════════
// PASTE YOUR SupplierSelectionModal HERE (from SupplierModal.jsx)
// ══════════════════════════════════════════════════════════════════
const SUPPLIERS = [
  { id: 0, name: "Common Supplier", code: "—", category: "—", contactName: "—", contactTitle: "—", email: "—", phone: "—", country: "—", city: "—", currency: "—", status: "active", preferred: false, isDefault: true },
  { id: 1, name: "TechSource Lanka Pvt Ltd", code: "SUP-001", category: "Electronics", contactName: "Mahesh Perera", contactTitle: "Sales Manager", email: "mahesh@techsource.lk", phone: "+94 11 456 7890", country: "Sri Lanka", city: "Colombo", currency: "LKR", status: "active", preferred: true, isDefault: false },
  { id: 2, name: "Ceylon Wholesale Distributors", code: "SUP-002", category: "General", contactName: "Pradeep Jayawardena", contactTitle: "Account Director", email: "pradeep@cwd.lk", phone: "+94 81 234 5678", country: "Sri Lanka", city: "Kandy", currency: "LKR", status: "active", preferred: false, isDefault: false },
  { id: 3, name: "Nexgen IT Solutions", code: "SUP-003", category: "IT & Computing", contactName: "Sampath De Silva", contactTitle: "Export Manager", email: "sampath@nexgen.lk", phone: "+94 11 789 0123", country: "Sri Lanka", city: "Nugegoda", currency: "LKR", status: "active", preferred: true, isDefault: false },
  { id: 4, name: "Island Apparel Suppliers", code: "SUP-004", category: "Apparel", contactName: "Kumari Mendis", contactTitle: "Trade Relations", email: "kumari@islandapp.lk", phone: "+94 31 345 6789", country: "Sri Lanka", city: "Negombo", currency: "LKR", status: "active", preferred: false, isDefault: false },
  { id: 5, name: "Global Stationery Corp", code: "SUP-005", category: "Stationery", contactName: "Nalin Wijesinghe", contactTitle: "Head of Wholesale", email: "nalin@globalstat.lk", phone: "+94 11 901 2345", country: "Sri Lanka", city: "Colombo 3", currency: "LKR", status: "active", preferred: false, isDefault: false },
  { id: 6, name: "Premier Home & Living", code: "SUP-006", category: "Home & Decor", contactName: "Dilani Rathnayake", contactTitle: "Operations Lead", email: "dilani@premhome.lk", phone: "+94 33 567 8901", country: "Sri Lanka", city: "Gampaha", currency: "LKR", status: "inactive", preferred: false, isDefault: false },
];

const PRODUCTS = [
  { id: 1,  name: "Wireless Earbuds Pro",     sku: "WEP-221", icon: "🎧", category: "Electronics", brand: "Nexus",    price: 59.99, cost: 28.00, stock: 18, tax: 18 },
  { id: 2,  name: "Cotton Crew T-Shirt",       sku: "CCT-089", icon: "👕", category: "Apparel",     brand: "Generic",  price: 17.99, cost: 6.50,  stock: 42, tax: 5  },
  { id: 3,  name: "Leather Wallet Slim",       sku: "LWS-441", icon: "👜", category: "Accessories", brand: "Nexus",    price: 24.99, cost: 9.00,  stock: 9,  tax: 5  },
  { id: 4,  name: "Scented Candle Set",        sku: "SCS-112", icon: "🕯", category: "Home",        brand: "OEM",      price: 15.99, cost: 5.20,  stock: 5,  tax: 5  },
  { id: 5,  name: "Stainless Water Bottle",    sku: "SWB-330", icon: "🍶", category: "Lifestyle",   brand: "Nexus",    price: 16.99, cost: 7.00,  stock: 23, tax: 5  },
  { id: 6,  name: "Notebook A5 Grid",          sku: "NAG-007", icon: "📓", category: "Stationery",  brand: "Generic",  price: 5.99,  cost: 1.80,  stock: 67, tax: 0  },
  { id: 7,  name: "USB-C Hub 7-in-1",          sku: "UCH-880", icon: "🔌", category: "Electronics", brand: "Anker",    price: 44.99, cost: 19.00, stock: 3,  tax: 18 },
  { id: 8,  name: "Phone Case iPhone 15",      sku: "PCI-556", icon: "📱", category: "Accessories", brand: "Generic",  price: 12.99, cost: 3.50,  stock: 14, tax: 5  },
  { id: 9,  name: "Yoga Mat Pro",              sku: "YMP-203", icon: "🧘", category: "Sports",      brand: "Nexus",    price: 34.99, cost: 14.00, stock: 11, tax: 5  },
  { id: 10, name: "Ceramic Coffee Mug",        sku: "CCM-445", icon: "☕", category: "Home",        brand: "OEM",      price: 9.99,  cost: 3.00,  stock: 30, tax: 5  },
  { id: 14, name: "Mechanical Keyboard TKL",   sku: "MKT-509", icon: "⌨",  category: "Electronics", brand: "Logitech", price: 89.99, cost: 42.00, stock: 6,  tax: 18 },
  { id: 16, name: "Portable Charger 20000mAh", sku: "PCH-392", icon: "🔋", category: "Electronics", brand: "Anker",    price: 49.99, cost: 21.00, stock: 12, tax: 18 },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];
const BRANDS     = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.brand))).sort()];
const WAREHOUSES = ["Main Warehouse – Colombo", "Branch Store – Kandy", "Negombo Outlet", "Transit Hub – Kelaniya"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "COD", "Advance"];
const CONDITIONS = ["New / Sealed", "Good Condition", "Acceptable", "Damaged – Partial Accept", "Rejected"];
const UNITS = ["pcs", "kg", "g", "l", "ml", "box", "carton", "roll", "pair", "set"];

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],["#2B5490","rgba(43,84,144,.15)"],
  ["#5B3D8F","rgba(91,61,143,.15)"],["#2D6A4F","rgba(45,106,79,.15)"],
  ["#B8902A","rgba(184,144,42,.15)"],["#B5372A","rgba(181,55,42,.15)"],
  ["#7A5C1E","rgba(122,92,30,.15)"],["#8A3A6A","rgba(138,58,106,.15)"],
  ["#1B6B8A","rgba(27,107,138,.15)"],
];
const CAT_COLORS = {
  Electronics: { color:"#2B5490", bg:"rgba(43,84,144,.1)",  border:"rgba(43,84,144,.22)"  },
  Apparel:     { color:"#5B3D8F", bg:"rgba(91,61,143,.1)",  border:"rgba(91,61,143,.22)"  },
  Accessories: { color:"#B8902A", bg:"rgba(184,144,42,.1)", border:"rgba(184,144,42,.22)" },
  Home:        { color:"#7A5C1E", bg:"rgba(122,92,30,.1)",  border:"rgba(122,92,30,.2)"   },
  Lifestyle:   { color:"#2D6A4F", bg:"rgba(45,106,79,.1)",  border:"rgba(45,106,79,.2)"   },
  Stationery:  { color:"#6B5F54", bg:"rgba(107,95,84,.1)",  border:"rgba(107,95,84,.2)"   },
  Sports:      { color:"#B5372A", bg:"rgba(181,55,42,.1)",  border:"rgba(181,55,42,.2)"   },
};

const avColor  = (id) => AV_COLORS[id % AV_COLORS.length];
const initials = (name) => name === "Common Supplier" ? "CS" : name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const fmt      = (n) => Number(n || 0).toFixed(2);
const fmtLoc   = n => Number(n||0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2});
let _uid = 1; const uid = () => _uid++;

const highlight = (text, query) => {
  if (!query.trim() || !text || text === "—") return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<mark style={{ background:"rgba(184,144,42,.28)", color:"var(--gold)", borderRadius:2, padding:"0 1px" }}>{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
};

// ═══════════════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════════════
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --cream:#F6F3EC;--paper:#FDFBF7;--warm:#EEE9DF;--warm2:#E4DDD2;
    --ink:#1B1713;--ink70:#4B4038;--ink50:#6B5F54;--ink40:#9E9080;
    --ink20:#C9C0B2;--ink10:#E4DDD2;--ink06:#EDE8E0;--ink03:#F5F1EB;
    --gold:#B8902A;--goldl:#D4A83C;--goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07);--goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
    --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);
    --blue:#2B5490;--bluebg:rgba(43,84,144,.08);--bluebr:rgba(43,84,144,.22);
    --s0:0 1px 3px rgba(27,23,19,.06);--s1:0 4px 14px rgba(27,23,19,.1);
    --s2:0 8px 28px rgba(27,23,19,.13);
    --shadow-lg:0 24px 64px rgba(27,23,19,.22),0 6px 20px rgba(27,23,19,.1);
  }
  html,body,#root{min-height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink)}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes qhRowIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  @keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
  @keyframes overlayIn{from{opacity:0}to{opacity:1}}
  @keyframes modalIn{from{opacity:0;transform:scale(.97) translateY(16px)}to{opacity:1;transform:none}}
  @keyframes spmIn{from{opacity:0;transform:scale(.95) translateY(12px)}to{opacity:1;transform:none}}
  @keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}

  /* ── Page ── */
  .grn-page{min-height:100vh;display:flex;flex-direction:column;background:var(--cream)}

  /* ── Topbar ── */
  .grn-tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
  .grn-tb-l{display:flex;align-items:center;gap:20px}
  .grn-brand{display:flex;align-items:center;gap:10px}
  .grn-bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
  .grn-bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
  .grn-bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
  .grn-bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
  .grn-bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.grn-bca:hover{color:rgba(246,243,236,.65)}
  .grn-bcsep{color:rgba(246,243,236,.15)}.grn-bccur{color:var(--goldl);font-weight:500}
  .grn-tb-r{display:flex;align-items:center;gap:8px}
  .btn-outline-tb{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:transparent;border:1.5px solid rgba(246,243,236,.2);color:rgba(246,243,236,.65);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-outline-tb:hover{border-color:rgba(246,243,236,.4);color:#F6F3EC}
  .btn-gold-tb{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
  .btn-gold-tb:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.4)}

  /* ── Main & layout ── */
  .grn-main{flex:1;padding:22px 20px 80px;width:100%}
  .grn-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:20px}
  .grn-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:5px;display:flex;align-items:center;gap:8px}
  .grn-eyebrow::before{content:'';width:18px;height:1px;background:var(--gold);opacity:.6}
  .grn-page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.3px}
  .grn-page-sub{font-size:12px;color:var(--ink40);margin-top:5px}
  .grn-doc-badge{font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;color:var(--gold);background:var(--goldbg);border:1px solid var(--goldbr);padding:7px 13px;border-radius:7px;display:flex;align-items:center;gap:8px;white-space:nowrap}
  .grn-status-bar{display:flex;gap:5px;margin-top:7px;justify-content:flex-end}
  .grn-status-opt{padding:5px 12px;border-radius:20px;font-size:10.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--paper);color:var(--ink40);transition:all .14s;font-family:'DM Sans',sans-serif}
  .grn-status-opt.on-draft{background:rgba(158,144,128,.1);border-color:rgba(158,144,128,.3);color:#9E9080}
  .grn-status-opt.on-partial{background:var(--goldbg);border-color:var(--goldbr);color:var(--gold)}
  .grn-status-opt.on-complete{background:var(--greenbg);border-color:var(--greenbr);color:var(--green)}

  /* 3-col grid */
  .grn-3col{display:grid;grid-template-columns:300px 1fr 240px;gap:14px;align-items:start}

  /* ── Cards ── */
  .g-card{background:var(--paper);border:1px solid var(--ink10);border-radius:10px;box-shadow:var(--s0);overflow:hidden;animation:fadeUp .22s ease both}
  .g-card+.g-card{margin-top:14px}
  .g-card-head{padding:12px 16px;border-bottom:1px solid var(--ink06);display:flex;align-items:center;justify-content:space-between;background:#EDE8DE}
  .g-card-title{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:7px}
  .g-title-icon{width:20px;height:20px;border-radius:5px;background:var(--goldbg);border:1px solid var(--goldbr);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
  .g-card-body{padding:16px}

  /* ── Form elements ── */
  .g-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40);margin-bottom:5px;display:block}
  .g-label .req{color:var(--gold)}
  .g-input,.g-select,.g-textarea{width:100%;padding:8px 11px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);outline:none;transition:all .18s;appearance:none}
  .g-input:hover,.g-select:hover{border-color:var(--ink20)}
  .g-input:focus,.g-select:focus,.g-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1);background:var(--paper)}
  .g-input::placeholder{color:var(--ink20)}
  .g-input[readonly]{background:var(--ink03);color:var(--ink40);cursor:default;border-style:dashed}
  .g-textarea{resize:vertical;min-height:68px;line-height:1.5}
  .g-sel-wrap{position:relative}.g-sel-wrap::after{content:'▾';position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--ink30);pointer-events:none}
  .g-select{padding-right:26px;cursor:pointer}
  .g-mono{font-family:'Geist Mono',monospace;font-size:11.5px}
  .g-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .g-field{margin-bottom:11px}
  .g-field:last-child{margin-bottom:0}

  /* ── Supplier panel (left col) ── */
  .sup-trigger{display:flex;align-items:center;gap:10px;padding:11px 13px;border:1.5px dashed var(--goldbr);border-radius:8px;background:var(--goldbg);cursor:pointer;transition:all .15s}
  .sup-trigger:hover{border-style:solid;background:rgba(184,144,42,.11)}
  .sup-trigger-icon{width:36px;height:36px;border-radius:8px;background:rgba(184,144,42,.1);border:1px solid var(--goldbr);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
  .sup-trigger-text{font-size:12.5px;font-weight:700;color:var(--gold)}
  .sup-trigger-sub{font-size:10.5px;color:var(--ink40);margin-top:1px}

  .sup-card{border:1.5px solid var(--goldbr);border-radius:8px;padding:13px;background:var(--goldbg)}
  .sup-card-top{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .sup-av{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:700;flex-shrink:0}
  .sup-name{font-size:13px;font-weight:700;color:var(--ink);margin-bottom:3px}
  .sup-tags{display:flex;gap:5px;flex-wrap:wrap}
  .sup-tag{font-size:8.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:2px 7px;border-radius:20px;background:var(--bluebg);border:1px solid var(--bluebr);color:var(--blue)}
  .sup-details{display:flex;flex-direction:column;gap:5px}
  .sup-detail-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--ink06)}
  .sup-detail-row:last-child{border-bottom:none}
  .sup-detail-lbl{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink40);flex-shrink:0}
  .sup-detail-val{font-size:11.5px;font-weight:600;color:var(--ink70);text-align:right;word-break:break-word;max-width:60%}
  .sup-change-btn{display:flex;align-items:center;gap:5px;margin-top:10px;padding:6px 12px;border-radius:6px;border:1px solid var(--goldbr);background:transparent;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;transition:all .13s;font-family:'DM Sans',sans-serif;width:100%;justify-content:center}
  .sup-change-btn:hover{background:var(--goldbg)}

  /* ── Items table (middle) ── */
  .items-thead{display:grid;grid-template-columns:28px 2.4fr 1fr 80px 90px 110px 75px 90px 32px;gap:0;padding:7px 12px;background:#EDE8DE;border-bottom:2px solid var(--gold)}
  .items-th{font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
  .items-th.r{text-align:right;display:flex;justify-content:flex-end}
  .item-row{display:grid;grid-template-columns:28px 2.4fr 1fr 80px 90px 110px 75px 90px 32px;gap:0;padding:8px 12px;border-bottom:1px solid var(--ink06);align-items:center;transition:background .12s;animation:qhRowIn .2s ease both}
  .item-row:hover{background:var(--warm)}
  .item-num{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink20);font-weight:600}
  .item-inp{width:100%;padding:6px 8px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;color:var(--ink);outline:none;transition:all .15s}
  .item-inp:hover{border-color:var(--ink20)}
  .item-inp:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,144,42,.1);background:var(--paper)}
  .item-inp::placeholder{color:var(--ink20)}
  .item-inp.mono{font-family:'Geist Mono',monospace;font-size:11px}
  .item-sel-w{position:relative;padding-right:4px}.item-sel-w::after{content:'▾';position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:8px;color:var(--ink30);pointer-events:none}
  .item-sel{width:100%;padding:6px 20px 6px 7px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:5px;font-family:'DM Sans',sans-serif;font-size:11px;color:var(--ink);outline:none;appearance:none;cursor:pointer;transition:border-color .15s}
  .item-sel:focus{border-color:var(--gold)}
  .item-del{width:26px;height:26px;border-radius:5px;border:1px solid transparent;background:none;color:var(--ink20);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;margin:0 auto}
  .item-del:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red)}
  .item-del:disabled{opacity:.3;cursor:default}
  .item-line-total{font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:var(--ink);text-align:right;padding-right:4px}
  .cond-sel{width:100%;padding:5px 20px 5px 6px;border-radius:5px;font-size:10px;font-weight:700;cursor:pointer;outline:none;appearance:none;border:1.5px solid var(--ink10);transition:border-color .15s}
  .cond-sel:focus{border-color:var(--gold)}
  .items-add-row{padding:10px 12px;border-top:1px dashed var(--ink10);display:flex;align-items:center;gap:8px}
  .add-item-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px dashed var(--goldbr);background:var(--goldbg);color:var(--gold);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
  .add-item-btn:hover{background:rgba(184,144,42,.13);border-color:var(--gold)}
  .add-prod-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px solid var(--bluebr);background:var(--bluebg);color:var(--blue);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
  .add-prod-btn:hover{background:rgba(43,84,144,.14);border-color:var(--blue)}

  /* QC cards */
  .qc-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:13px}
  .qc-card{border:1.5px solid var(--ink10);border-radius:8px;padding:10px;background:var(--cream);cursor:pointer;transition:all .15s;text-align:center}
  .qc-card:hover{border-color:var(--ink20);background:var(--paper)}
  .qc-card.active.accept{border-color:var(--greenbr);background:var(--greenbg)}
  .qc-card.active.partial{border-color:var(--goldbr);background:var(--goldbg)}
  .qc-card.active.reject{border-color:var(--redbr);background:var(--redbg)}
  .qc-icon{font-size:18px;margin-bottom:4px}
  .qc-label{font-size:10.5px;font-weight:700;color:var(--ink50)}
  .qc-card.active.accept .qc-label{color:var(--green)}
  .qc-card.active.partial .qc-label{color:var(--gold)}
  .qc-card.active.reject .qc-label{color:var(--red)}

  /* ── Right sidebar ── */
  .sum-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--ink06);font-size:12px}
  .sum-row:last-child{border-bottom:none}
  .sum-lbl{color:var(--ink50);font-weight:500}
  .sum-val{font-family:'Geist Mono',monospace;font-weight:700;color:var(--ink);font-size:12px}
  .sum-total{background:var(--ink);border-radius:8px;padding:11px 13px;display:flex;align-items:center;justify-content:space-between;margin-top:12px}
  .sum-total-lbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.45)}
  .sum-cur{font-size:10px;font-weight:600;color:rgba(246,243,236,.35);margin-bottom:1px}
  .sum-total-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--goldl)}

  /* Checklist */
  .check-item{display:flex;align-items:center;gap:7px;padding:5px 0;font-size:11px}
  .check-box{width:15px;height:15px;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;transition:all .2s}

  /* ── Action bar ── */
  .grn-action-bar{position:fixed;bottom:0;left:0;right:0;background:var(--ink);border-top:2px solid var(--gold);padding:11px 24px;display:flex;align-items:center;justify-content:space-between;z-index:40;box-shadow:0 -4px 20px rgba(27,23,19,.3)}
  .action-info{font-size:11px;color:rgba(246,243,236,.35);display:flex;align-items:center;gap:14px}
  .action-info strong{color:var(--goldl);font-family:'Geist Mono',monospace;font-size:12px}
  .action-btns{display:flex;gap:7px}
  .btn-save{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:6px;background:transparent;border:1.5px solid rgba(246,243,236,.2);color:rgba(246,243,236,.65);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
  .btn-save:hover{border-color:rgba(246,243,236,.4);color:#F6F3EC}
  .btn-post{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;background:var(--green);border:1px solid rgba(45,106,79,.6);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
  .btn-post:hover{background:#3D8A65;transform:translateY(-1px);box-shadow:0 4px 14px rgba(45,106,79,.35)}

  /* ── Toast ── */
  .grn-toast{position:fixed;top:66px;right:22px;z-index:200;background:var(--ink);border:1px solid var(--gold);border-radius:8px;padding:11px 16px;display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;color:#F6F3EC;box-shadow:var(--s2);animation:toastIn .22s ease;pointer-events:none}
  .toast-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0}

  /* ══════════════════════════════════════
     SUPPLIER SELECTION MODAL
  ══════════════════════════════════════ */
  .spm-backdrop{position:fixed;inset:0;z-index:900;background:rgba(27,23,19,.58);backdrop-filter:blur(6px) saturate(.85);display:flex;align-items:center;justify-content:center;padding:24px;animation:overlayIn .2s ease both}
  .spm-modal{background:var(--paper);border:1px solid var(--ink10);border-radius:16px;box-shadow:var(--shadow-lg);width:100%;max-width:700px;max-height:min(86vh,680px);display:flex;flex-direction:column;overflow:hidden;animation:spmIn .3s cubic-bezier(.16,1,.3,1) both}
  .spm-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 15px;background:var(--ink);border-bottom:1px solid rgba(184,144,42,.18);flex-shrink:0;position:relative}
  .spm-head::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);opacity:.32}
  .spm-head-left{display:flex;align-items:center;gap:12px}
  .spm-icon-wrap{width:36px;height:36px;border-radius:8px;flex-shrink:0;background:rgba(184,144,42,.1);border:1.5px solid rgba(184,144,42,.28);display:flex;align-items:center;justify-content:center}
  .spm-eyebrow-m{font-family:'DM Sans',sans-serif;font-size:8px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:rgba(184,144,42,.6);margin-bottom:2px}
  .spm-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#F6F3EC;line-height:1}
  .spm-close{width:28px;height:28px;border-radius:7px;flex-shrink:0;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);color:rgba(246,243,236,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .spm-close:hover{background:rgba(246,243,236,.13);color:rgba(246,243,236,.9)}
  .spm-search-zone{padding:11px 16px;background:var(--warm);border-bottom:1px solid var(--ink10);display:flex;align-items:center;gap:10px;flex-shrink:0}
  .spm-search-wrap{flex:1;position:relative}
  .spm-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink30);pointer-events:none}
  .spm-search{width:100%;padding:8px 34px 8px 34px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;outline:none;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);transition:all .18s}
  .spm-search::placeholder{color:var(--ink30);font-weight:400}
  .spm-search:hover{border-color:var(--ink20)}
  .spm-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
  .spm-clear{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:var(--ink10);border:none;cursor:pointer;color:var(--ink40);display:flex;align-items:center;justify-content:center;transition:all .15s}
  .spm-clear:hover{background:var(--ink20)}
  .spm-col-head{display:grid;grid-template-columns:200px 110px 1fr 130px;gap:0;padding:8px 16px 7px;border-bottom:1px solid var(--ink10);flex-shrink:0;background:var(--cream)}
  .spm-col-lbl{font-size:8.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40)}
  .spm-col-lbl.right{text-align:right}
  .spm-list{flex:1;overflow-y:auto}
  .spm-list::-webkit-scrollbar{width:3px}
  .spm-list::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .spm-divider-label{padding:6px 16px 5px;font-size:8px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--ink30);background:var(--ink03);border-bottom:1px solid var(--ink06);display:flex;align-items:center;gap:8px}
  .spm-divider-label::after{content:'';flex:1;height:1px;background:var(--ink10)}
  .spm-item{display:grid;grid-template-columns:200px 110px 1fr 130px;gap:0;padding:10px 16px;align-items:center;cursor:pointer;border-bottom:1px solid var(--ink03);transition:background .12s;position:relative;animation:qhRowIn .28s ease both}
  .spm-item:last-child{border-bottom:none}
  .spm-item:hover{background:var(--warm)}
  .spm-item--selected{background:var(--goldbg)!important}
  .spm-item--selected::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);border-radius:0 2px 2px 0}
  .spm-item--inactive{opacity:.5}
  .spm-item--default{background:rgba(158,144,128,.04)}
  .spm-col-name{display:flex;align-items:center;gap:10px;min-width:0;padding-right:10px}
  .spm-av{width:36px;height:36px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;letter-spacing:.3px}
  .spm-name-wrap{min-width:0}
  .spm-name{font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'DM Sans',sans-serif;margin-bottom:2px}
  .spm-name-meta{display:flex;align-items:center;gap:5px}
  .spm-preferred{font-size:8px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:1px 6px;border-radius:20px;background:var(--goldbg);border:1px solid var(--goldbr);color:var(--gold);flex-shrink:0}
  .spm-default-tag{font-size:8px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:1px 6px;border-radius:20px;background:rgba(158,144,128,.12);border:1px solid rgba(158,144,128,.25);color:var(--ink40);flex-shrink:0}
  .spm-status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;background:var(--ink20)}
  .spm-status-dot--active{background:#3D8A65}
  .spm-col-code{padding-right:10px}
  .spm-code{font-family:'Geist Mono',monospace;font-size:11px;font-weight:600;color:var(--gold)}
  .spm-category{font-size:10.5px;color:var(--ink40);margin-top:2px}
  .spm-col-email{padding-right:10px;min-width:0}
  .spm-email{font-size:11.5px;color:var(--ink50);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .spm-contact-name{font-size:10.5px;color:var(--ink40);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .spm-col-phone{text-align:right}
  .spm-phone{font-family:'Geist Mono',monospace;font-size:11px;color:var(--ink50);font-weight:500}
  .spm-currency{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink30);margin-top:2px}
  .spm-check{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;background:var(--gold);border:2px solid var(--goldd);display:flex;align-items:center;justify-content:center;color:#fff}
  .spm-empty{padding:48px 32px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
  .spm-empty-icon{font-size:32px;opacity:.3}
  .spm-empty-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink40)}
  .spm-empty-sub{font-size:12px;color:var(--ink30);max-width:240px;line-height:1.6}
  .spm-footer-count{padding:9px 16px;border-top:1px solid var(--ink06);background:var(--warm);flex-shrink:0;font-size:11px;color:var(--ink40);font-weight:500;display:flex;align-items:center;gap:6px}
  .spm-footer-count strong{color:var(--ink70);font-weight:700}

  /* ══════════════════════════════════════
     PRODUCT SELECTION MODAL
  ══════════════════════════════════════ */
  .psm-overlay{position:fixed;inset:0;background:rgba(27,23,19,.55);backdrop-filter:blur(3px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .2s ease}
  .psm-shell{background:var(--cream);border:1px solid var(--ink10);border-radius:18px;width:100%;max-width:960px;height:min(88vh,700px);display:flex;flex-direction:column;box-shadow:var(--shadow-lg);animation:modalIn .28s cubic-bezier(.16,1,.3,1);font-family:'DM Sans',sans-serif;overflow:hidden}
  .psm-head{background:var(--ink);border-bottom:1px solid rgba(184,144,42,.3);padding:18px 24px 16px;flex-shrink:0;position:relative}
  .psm-head::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);opacity:.4}
  .psm-head-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}
  .psm-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(184,144,42,.7);margin-bottom:4px;display:flex;align-items:center;gap:7px}
  .psm-eyebrow::before{content:'';width:14px;height:1px;background:var(--gold);opacity:.5}
  .psm-modal-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#F6F3EC;line-height:1}
  .psm-close{width:32px;height:32px;border-radius:8px;flex-shrink:0;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);color:rgba(246,243,236,.4);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .psm-close:hover{background:rgba(246,243,236,.12);color:rgba(246,243,236,.88)}
  .psm-search-row{display:flex;gap:10px;align-items:center}
  .psm-search-wrap{position:relative;flex:1}
  .psm-search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;color:rgba(246,243,236,.25);pointer-events:none}
  .psm-search{width:100%;padding:10px 36px 10px 38px;background:rgba(246,243,236,.06);border:1.5px solid rgba(246,243,236,.1);border-radius:9px;font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:500;color:#F6F3EC;outline:none;transition:all .18s}
  .psm-search::placeholder{color:rgba(246,243,236,.25)}
  .psm-search:focus{border-color:rgba(184,144,42,.5);background:rgba(246,243,236,.09);box-shadow:0 0 0 3px rgba(184,144,42,.12)}
  .psm-search-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:20px;height:20px;border-radius:50%;background:rgba(246,243,236,.1);border:none;color:rgba(246,243,236,.4);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .14s}
  .psm-search-clear:hover{background:rgba(246,243,236,.2);color:#F6F3EC}
  .psm-filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
  .psm-filter-pill{padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:700;cursor:pointer;border:1.5px solid rgba(246,243,236,.1);background:rgba(246,243,236,.05);color:rgba(246,243,236,.4);transition:all .15s;white-space:nowrap;font-family:'DM Sans',sans-serif}
  .psm-filter-pill:hover{background:rgba(246,243,236,.1);color:rgba(246,243,236,.75)}
  .psm-filter-pill.active{background:rgba(184,144,42,.18);border-color:rgba(184,144,42,.45);color:var(--goldl)}
  .psm-brand-pill{padding:4px 10px;border-radius:20px;font-size:10.5px;font-weight:700;cursor:pointer;border:1.5px solid rgba(246,243,236,.08);background:transparent;color:rgba(246,243,236,.3);transition:all .14s;font-family:'DM Sans',sans-serif}
  .psm-brand-pill:hover{border-color:rgba(246,243,236,.18);color:rgba(246,243,236,.65)}
  .psm-brand-pill.active{background:rgba(184,144,42,.15);border-color:rgba(184,144,42,.4);color:var(--goldl)}
  .psm-body{flex:1;display:grid;grid-template-columns:1fr 300px;overflow:hidden}
  .psm-grid-wrap{overflow-y:auto;padding:16px 16px 20px;display:flex;flex-direction:column;gap:12px;border-right:1px solid var(--ink10)}
  .psm-grid-wrap::-webkit-scrollbar{width:3px}
  .psm-grid-wrap::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .psm-results-bar{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .psm-count{font-size:11.5px;color:var(--ink40);font-weight:600}
  .psm-count strong{color:var(--ink70)}
  .psm-sort-sel-wrap{position:relative}
  .psm-sort-select{padding:5px 28px 5px 10px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:600;color:var(--ink70);outline:none;appearance:none;cursor:pointer;transition:all .15s}
  .psm-sort-select:focus{border-color:var(--gold)}
  .psm-sort-arr{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:8px;color:var(--ink30);pointer-events:none}
  .psm-prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:9px}
  .psm-prod-card{background:var(--paper);border:1.5px solid var(--ink10);border-radius:11px;padding:12px;cursor:pointer;transition:all .2s cubic-bezier(.16,1,.3,1);display:flex;flex-direction:column;gap:9px;position:relative;overflow:hidden;animation:fadeUp .25s ease both}
  .psm-prod-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--cat-c,transparent);opacity:0;transition:opacity .18s}
  .psm-prod-card:hover{background:#fff;border-color:var(--ink20);box-shadow:var(--s1);transform:translateY(-2px)}
  .psm-prod-card:hover::before{opacity:1}
  .psm-prod-card.selected{border-color:var(--gold);background:var(--goldbg);box-shadow:0 0 0 2px rgba(184,144,42,.18)}
  .psm-prod-card.selected::before{opacity:1;background:var(--gold)}
  .psm-prod-card.out{opacity:.55;cursor:not-allowed}
  .psm-prod-card.out:hover{transform:none;box-shadow:none}
  .psm-card-icon-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
  .psm-card-icon{width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:21px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0;transition:transform .18s}
  .psm-prod-card:hover .psm-card-icon{transform:scale(1.06)}
  .psm-qty-badge{width:21px;height:21px;border-radius:50%;background:var(--gold);color:#fff;font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;animation:popIn .2s cubic-bezier(.16,1,.3,1);flex-shrink:0}
  .psm-card-sku{font-family:'Geist Mono',monospace;font-size:10px;color:var(--gold);margin-bottom:1px}
  .psm-card-name{font-size:12px;font-weight:700;color:var(--ink);line-height:1.3}
  .psm-card-cat{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;display:inline-flex;align-items:center}
  .psm-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-top:auto}
  .psm-card-price{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:700;color:var(--ink)}
  .psm-stock-badge{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:20px}
  .psm-cart{display:flex;flex-direction:column;overflow:hidden;background:var(--paper)}
  .psm-cart-head{padding:13px 16px;background:linear-gradient(180deg,#fff 0%,rgba(253,251,247,.6) 100%);border-bottom:1px solid var(--ink10);flex-shrink:0;display:flex;align-items:center;justify-content:space-between}
  .psm-cart-title{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700;color:var(--ink)}
  .psm-cart-badge{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;background:var(--goldbg);border:1px solid var(--goldbr);color:var(--gold)}
  .psm-cart-items{flex:1;overflow-y:auto;padding:8px 13px}
  .psm-cart-items::-webkit-scrollbar{width:3px}
  .psm-cart-items::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
  .psm-cart-item{display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--ink06);animation:slideIn .18s ease both}
  .psm-cart-item:last-child{border-bottom:none}
  .psm-ci-icon{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0}
  .psm-ci-name{font-size:11.5px;font-weight:700;color:var(--ink);line-height:1.3;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px}
  .psm-ci-sku{font-family:'Geist Mono',monospace;font-size:9px;color:var(--gold)}
  .psm-ci-price{font-family:'Geist Mono',monospace;font-size:11px;font-weight:700;color:var(--ink);text-align:right;white-space:nowrap}
  .psm-ci-subtotal{font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink40);text-align:right}
  .psm-qty-row{display:flex;align-items:center;gap:4px}
  .psm-qty-btn{width:20px;height:20px;border-radius:4px;background:var(--warm2);border:1px solid var(--ink10);color:var(--ink50);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .13s;line-height:1}
  .psm-qty-btn:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
  .psm-qty-val{min-width:24px;text-align:center;font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:700;color:var(--ink);padding:2px 3px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:5px;outline:none;transition:border-color .14s}
  .psm-qty-val:focus{border-color:var(--gold)}
  .psm-ci-remove{width:20px;height:20px;border-radius:5px;flex-shrink:0;background:transparent;border:1px solid transparent;color:var(--ink20);cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;transition:all .13s}
  .psm-ci-remove:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red)}
  .psm-cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:20px;text-align:center}
  .psm-cart-empty-ico{font-size:32px;opacity:.2}
  .psm-cart-empty-msg{font-size:12px;color:var(--ink30);font-weight:600;line-height:1.5}
  .psm-cart-footer{padding:12px 16px;border-top:1px solid var(--ink10);background:var(--paper);flex-shrink:0}
  .psm-totals-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0}
  .psm-totals-label{font-size:11px;color:var(--ink50);font-weight:500}
  .psm-totals-val{font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:var(--ink)}
  .psm-grand-row{display:flex;justify-content:space-between;align-items:center;padding:10px 13px;margin:9px 0 11px;background:var(--ink);border-radius:8px}
  .psm-grand-label{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(246,243,236,.4)}
  .psm-grand-val{font-family:'Geist Mono',monospace;font-size:18px;font-weight:700;color:var(--goldl)}
  .psm-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:7px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;border:1px solid transparent;transition:all .2s;width:100%}
  .psm-btn-gold{background:var(--gold);border-color:var(--goldd);color:#fff;box-shadow:0 2px 10px rgba(184,144,42,.3)}
  .psm-btn-gold:hover{background:var(--goldl);box-shadow:0 4px 16px rgba(184,144,42,.4);transform:translateY(-1px)}
  .psm-btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
  .psm-btn-ghost{background:transparent;border-color:var(--ink10);color:var(--ink50)}
  .psm-btn-ghost:hover{border-color:var(--ink20);color:var(--ink70);background:var(--warm)}
  .psm-empty-state{padding:40px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
  .psm-empty-state-ico{font-size:40px;opacity:.22}
  .psm-empty-state-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--ink40)}
  .psm-empty-state-sub{font-size:11.5px;color:var(--ink30);max-width:220px;line-height:1.6}
`;

// ═══════════════════════════════════════════════════════════════════════
// SUPPLIER SELECTION MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function SupplierModal({ open, onClose, onSelect, selected }) {
  const [search, setSearch] = useState("");

  const { defaultSupplier, filtered } = useMemo(() => {
    const q = search.toLowerCase().trim();
    const def = SUPPLIERS.find(s => s.isDefault);
    const rest = SUPPLIERS.filter(s => !s.isDefault);
    if (!q) return { defaultSupplier: def, filtered: rest };
    const match = s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.contactName.toLowerCase().includes(q);
    return { defaultSupplier: match(def) ? def : null, filtered: rest.filter(match) };
  }, [search]);

  const totalVisible = (defaultSupplier ? 1 : 0) + filtered.length;
  if (!open) return null;

  const renderRow = (s, i, isDefault = false) => {
    const [clr, bg] = avColor(s.id);
    const isSel = selected?.id === s.id;
    return (
      <div key={s.id}
        className={`spm-item${isSel ? " spm-item--selected" : ""}${s.status === "inactive" ? " spm-item--inactive" : ""}${isDefault ? " spm-item--default" : ""}`}
        style={{ animationDelay:`${i * 16}ms` }}
        onClick={() => { onSelect(s); onClose(); }}
      >
        <div className="spm-col-name">
          <div className="spm-av" style={{ background:bg, border:`1.5px solid ${clr}25`, color:clr }}>{initials(s.name)}</div>
          <div className="spm-name-wrap">
            <div className="spm-name">{highlight(s.name, search)}</div>
            <div className="spm-name-meta">
              {isDefault && <span className="spm-default-tag">Default</span>}
              {s.preferred && <span className="spm-preferred">★ Preferred</span>}
              {!isDefault && <span className={`spm-status-dot${s.status === "active" ? " spm-status-dot--active" : ""}`} />}
            </div>
          </div>
        </div>
        <div className="spm-col-code">
          <div className="spm-code">{isDefault ? "—" : highlight(s.code, search)}</div>
          <div className="spm-category">{s.category}</div>
        </div>
        <div className="spm-col-email">
          <div className="spm-email">{isDefault ? "—" : s.email}</div>
          <div className="spm-contact-name">{isDefault ? "Walk-in / General" : highlight(s.contactName, search)}</div>
        </div>
        <div className="spm-col-phone">
          <div className="spm-phone">{isDefault ? "—" : s.phone}</div>
          <div className="spm-currency">{isDefault ? "" : s.currency}</div>
        </div>
        {isSel && <div className="spm-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
      </div>
    );
  };

  return (
    <div className="spm-backdrop" onClick={onClose}>
      <div className="spm-modal" onClick={e => e.stopPropagation()}>
        <div className="spm-head">
          <div className="spm-head-left">
            <div className="spm-icon-wrap">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{color:"var(--goldl)"}}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div><div className="spm-eyebrow-m">Procurement</div><div className="spm-title">Select Supplier</div></div>
          </div>
          <button className="spm-close" onClick={onClose}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="spm-search-zone">
          <div className="spm-search-wrap">
            <svg className="spm-search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="spm-search" placeholder="Search by name, code or contact…" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
            {search && <button className="spm-clear" onClick={() => setSearch("")}>×</button>}
          </div>
        </div>
        <div className="spm-col-head">
          <div className="spm-col-lbl">Supplier Name</div>
          <div className="spm-col-lbl">Supplier No.</div>
          <div className="spm-col-lbl">Email</div>
          <div className="spm-col-lbl right">Phone</div>
        </div>
        <div className="spm-list">
          {totalVisible === 0 ? (
            <div className="spm-empty">
              <div className="spm-empty-icon">🔍</div>
              <div className="spm-empty-title">No suppliers found</div>
              <div className="spm-empty-sub">Try a different name, code, or contact.</div>
            </div>
          ) : (
            <>
              {defaultSupplier && <><div className="spm-divider-label">Default</div>{renderRow(defaultSupplier, 0, true)}</>}
              {filtered.length > 0 && <><div className="spm-divider-label">Suppliers</div>{filtered.map((s, i) => renderRow(s, i + 1, false))}</>}
            </>
          )}
        </div>
        <div className="spm-footer-count"><strong>{totalVisible}</strong> supplier{totalVisible !== 1 ? "s" : ""} shown{search && <> · searching <strong>"{search}"</strong></>}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT SELECTION MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function ProductModal({ open, onClose, onConfirm, existingItems }) {
  const [search, setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [cart, setCart]       = useState([]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    if (catFilter !== "All") list = list.filter(p => p.category === catFilter);
    if (brandFilter !== "All") list = list.filter(p => p.brand === brandFilter);
    list.sort((a, b) => sortKey === "price-asc" ? a.price - b.price : sortKey === "price-desc" ? b.price - a.price : sortKey === "stock" ? b.stock - a.stock : a.name.localeCompare(b.name));
    return list;
  }, [search, catFilter, brandFilter, sortKey]);

  const cartItem = pid => cart.find(i => i.productId === pid);
  const addProduct = prod => {
    if (prod.stock === 0) return;
    setCart(prev => {
      const ex = prev.find(i => i.productId === prod.id);
      if (ex) return prev.map(i => i.productId === prod.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, { productId:prod.id, name:prod.name, sku:prod.sku, icon:prod.icon, unitPrice:prod.price, tax:prod.tax, qty:1, discount:0 }];
    });
  };
  const removeProduct = pid => setCart(prev => prev.filter(i => i.productId !== pid));
  const updateQty = (pid, val) => { const q = Math.max(1, parseInt(val)||1); setCart(prev => prev.map(i => i.productId === pid ? {...i, qty:q} : i)); };

  const subtotal = cart.reduce((s,i) => s + i.unitPrice * i.qty, 0);
  const tax      = cart.reduce((s,i) => s + i.unitPrice * i.qty * i.tax / 100, 0);

  const StockBadge = ({ stock }) => {
    if (stock === 0) return <span className="psm-stock-badge" style={{background:"var(--redbg)",color:"var(--red)",border:"1px solid var(--redbr)"}}>Out</span>;
    if (stock <= 10) return <span className="psm-stock-badge" style={{background:"var(--goldbg)",color:"var(--gold)",border:"1px solid var(--goldbr)"}}>{stock} left</span>;
    return <span className="psm-stock-badge" style={{background:"var(--greenbg)",color:"var(--green)",border:"1px solid var(--greenbr)"}}>{stock}</span>;
  };

  if (!open) return null;

  return (
    <div className="psm-overlay" onClick={onClose}>
      <div className="psm-shell" onClick={e => e.stopPropagation()}>
        <div className="psm-head">
          <div className="psm-head-row">
            <div><div className="psm-eyebrow">Inventory · Products</div><div className="psm-modal-title">Select Products</div></div>
            <button className="psm-close" onClick={onClose}>×</button>
          </div>
          <div className="psm-search-row">
            <div className="psm-search-wrap">
              <span className="psm-search-ico">⌕</span>
              <input className="psm-search" placeholder="Search by product name, SKU or category…" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
              {search && <button className="psm-search-clear" onClick={() => setSearch("")}>×</button>}
            </div>
          </div>
          <div className="psm-filters">
            {CATEGORIES.map(cat => <button key={cat} className={`psm-filter-pill${catFilter===cat?" active":""}`} onClick={() => setCatFilter(cat)}>{cat}</button>)}
            <div style={{width:1,background:"rgba(246,243,236,.1)",alignSelf:"stretch",margin:"0 4px"}}/>
            {BRANDS.map(b => <button key={b} className={`psm-brand-pill${brandFilter===b?" active":""}`} onClick={() => setBrandFilter(b)}>{b}</button>)}
          </div>
        </div>
        <div className="psm-body">
          <div className="psm-grid-wrap">
            <div className="psm-results-bar">
              <span className="psm-count">Showing <strong>{filtered.length}</strong> of <strong>{PRODUCTS.length}</strong></span>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span style={{fontSize:10.5,color:"var(--ink40)",fontWeight:600}}>Sort</span>
                <div className="psm-sort-sel-wrap">
                  <select className="psm-sort-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
                    <option value="name">Name A–Z</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="stock">Stock ↓</option>
                  </select>
                  <span className="psm-sort-arr">▾</span>
                </div>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="psm-empty-state">
                <div className="psm-empty-state-ico">🔍</div>
                <div className="psm-empty-state-title">No products found</div>
                <div className="psm-empty-state-sub">Try a different search term or clear filters</div>
                <button style={{marginTop:4,padding:"7px 14px",borderRadius:7,border:"1.5px solid var(--ink10)",background:"transparent",color:"var(--ink50)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}} onClick={() => {setSearch("");setCatFilter("All");setBrandFilter("All");}}>Clear filters</button>
              </div>
            ) : (
              <div className="psm-prod-grid">
                {filtered.map((p, i) => {
                  const ci = cartItem(p.id);
                  const cc = CAT_COLORS[p.category] || {};
                  return (
                    <div key={p.id} className={`psm-prod-card${ci?" selected":""}${p.stock===0?" out":""}`} style={{"--cat-c":cc.color,animationDelay:`${i*18}ms`}} onClick={() => addProduct(p)}>
                      <div className="psm-card-icon-row">
                        <div className="psm-card-icon">{p.icon}</div>
                        {ci && <div className="psm-qty-badge">{ci.qty}</div>}
                      </div>
                      <div><div className="psm-card-sku">{p.sku}</div><div className="psm-card-name">{p.name}</div></div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4,flexWrap:"wrap"}}>
                        <span className="psm-card-cat" style={{background:cc.bg,color:cc.color,border:`1px solid ${cc.border}`}}>{p.category}</span>
                        <StockBadge stock={p.stock} />
                      </div>
                      <div className="psm-card-bottom">
                        <div className="psm-card-price">${fmtLoc(p.price)}</div>
                        <div style={{width:24,height:24,borderRadius:"50%",background:ci?"var(--gold)":"var(--warm2)",border:`1.5px solid ${ci?"var(--goldd)":"var(--ink10)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:ci?"#fff":"var(--ink40)",transition:"all .18s",flexShrink:0}}>{ci?"✓":"+"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Cart */}
          <div className="psm-cart">
            <div className="psm-cart-head">
              <div className="psm-cart-title">Selected Items</div>
              {cart.length > 0 && <span className="psm-cart-badge">{cart.length} product{cart.length>1?"s":""}</span>}
            </div>
            {cart.length === 0 ? (
              <div className="psm-cart-empty"><div className="psm-cart-empty-ico">🛒</div><div className="psm-cart-empty-msg">No products selected.<br/>Click any product to add.</div></div>
            ) : (
              <div className="psm-cart-items">
                {cart.map((item, i) => (
                  <div key={item.productId} className="psm-cart-item" style={{animationDelay:`${i*20}ms`}}>
                    <div className="psm-ci-icon">{item.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="psm-ci-name">{item.name}</div>
                      <div className="psm-ci-sku">{item.sku}</div>
                      <div className="psm-qty-row" style={{marginTop:4}}>
                        <button className="psm-qty-btn" onClick={() => item.qty>1?updateQty(item.productId,item.qty-1):removeProduct(item.productId)}>−</button>
                        <input className="psm-qty-val" type="number" min="1" value={item.qty} onChange={e => updateQty(item.productId, e.target.value)} />
                        <button className="psm-qty-btn" onClick={() => updateQty(item.productId, item.qty+1)}>+</button>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                      <div className="psm-ci-price">${fmtLoc(item.unitPrice)}</div>
                      <div className="psm-ci-subtotal">${fmtLoc(item.unitPrice*item.qty)}</div>
                      <button className="psm-ci-remove" onClick={() => removeProduct(item.productId)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="psm-cart-footer">
              {cart.length > 0 && (
                <>
                  <div className="psm-totals-row"><span className="psm-totals-label">{cart.reduce((s,i)=>s+i.qty,0)} items</span><span className="psm-totals-val">${fmtLoc(subtotal)}</span></div>
                  <div className="psm-totals-row"><span className="psm-totals-label">Est. Tax</span><span className="psm-totals-val">${fmtLoc(tax)}</span></div>
                  <div className="psm-grand-row"><span className="psm-grand-label">Total</span><span className="psm-grand-val">${fmtLoc(subtotal+tax)}</span></div>
                </>
              )}
              <button className="psm-btn psm-btn-gold" onClick={() => { onConfirm(cart); onClose(); }} disabled={cart.length===0}>
                ✓ Add {cart.length>0?`${cart.length} Product${cart.length>1?"s":""}`:"Products"}
              </button>
              {cart.length > 0 && <button className="psm-btn psm-btn-ghost" style={{marginTop:6}} onClick={() => setCart([])}>Clear Selection</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN GRN PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function GRNPage({ onBack }) {
  const today  = new Date().toISOString().split("T")[0];
  const grnNo  = "GRN-2026-" + String(Math.floor(Math.random() * 900) + 100).padStart(3,"0");

  const [supplier, setSupplier]     = useState(null);
  const [showSupModal, setShowSupModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);

  const [form, setForm] = useState({
    grnDate: today, deliveryDate: today,
    poRef:"", invoiceNo:"", invoiceDate:"", deliveryNote:"",
    warehouse: WAREHOUSES[0], vehicleNo:"", driverName:"",
    receivedBy:"", paymentTerms:"Net 30", currency:"LKR",
    status:"draft", notes:"", internalNotes:"",
  });
  const setF = (k,v) => setForm(f => ({...f,[k]:v}));

  const [items, setItems]   = useState([{ id:uid(), description:"", sku:"", icon:"", qty:"", unit:"pcs", unitPrice:"", discount:0, taxRate:8, condition:"New / Sealed" }]);
  const [qcStatus, setQcStatus] = useState("accept");
  const [toast, setToast]   = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2800); };

  // Item helpers
  const updateItem = (id,k,v) => setItems(its => its.map(it => it.id===id?{...it,[k]:v}:it));
  const removeItem = id => setItems(its => its.filter(it => it.id!==id));
  const addBlankItem = () => setItems(its => [...its, {id:uid(),description:"",sku:"",icon:"",qty:"",unit:"pcs",unitPrice:"",discount:0,taxRate:8,condition:"New / Sealed"}]);

  // Merge products from modal into items list
  const handleProductsConfirmed = (cartItems) => {
    const newLines = cartItems.map(ci => ({
      id: uid(),
      description: ci.name,
      sku: ci.sku,
      icon: ci.icon || "",
      qty: String(ci.qty),
      unit: "pcs",
      unitPrice: String(ci.unitPrice),
      discount: ci.discount || 0,
      taxRate: ci.tax || 0,
      condition: "New / Sealed",
    }));
    setItems(prev => {
      // remove blank placeholder if only one empty row
      const clean = prev.filter(it => it.description || it.sku || it.unitPrice);
      return [...clean, ...newLines];
    });
    showToast(`✦ ${newLines.length} product${newLines.length>1?"s":""} added`);
  };

  const lineTotal = it => {
    const base = (parseFloat(it.qty)||0) * (parseFloat(it.unitPrice)||0);
    return base * (1 - (parseFloat(it.discount)||0)/100);
  };
  const lineTax = it => lineTotal(it) * ((parseFloat(it.taxRate)||0)/100);

  const subtotal   = items.reduce((s,it)=>s+lineTotal(it),0);
  const totalTax   = items.reduce((s,it)=>s+lineTax(it),0);
  const grandTotal = subtotal + totalTax;
  const totalQty   = items.reduce((s,it)=>s+(parseFloat(it.qty)||0),0);

  const checklist = [
    { label:"Supplier selected",    done:!!supplier                                    },
    { label:"GRN date set",         done:!!form.grnDate                                },
    { label:"Warehouse assigned",   done:!!form.warehouse                              },
    { label:"Items added",          done:items.some(it=>it.description)                },
    { label:"Quantities entered",   done:items.some(it=>parseFloat(it.qty)>0)          },
    { label:"Prices entered",       done:items.some(it=>parseFloat(it.unitPrice)>0)    },
    { label:"Received by filled",   done:!!form.receivedBy                             },
    { label:"Invoice no. entered",  done:!!form.invoiceNo                              },
  ];
  const checkDone = checklist.filter(c=>c.done).length;

  const handlePost = () => {
    if (!supplier)                      { showToast("⚠ Please select a supplier"); return; }
    if (!items.some(it=>it.description)){ showToast("⚠ Add at least one item");    return; }
    setF("status","complete");
    showToast(`✦ ${grnNo} posted & stock updated`);
  };

  const condStyle = v => ({
    color:      v==="Rejected"?"var(--red)":v==="Damaged – Partial Accept"?"var(--gold)":"var(--green)",
    borderColor:v==="Rejected"?"var(--redbr)":v==="Damaged – Partial Accept"?"var(--goldbr)":"var(--greenbr)",
    background: v==="Rejected"?"var(--redbg)":v==="Damaged – Partial Accept"?"var(--goldbg)":"var(--greenbg)",
  });

  const [clr, bg] = supplier ? avColor(supplier.id) : ["#9E9080","rgba(158,144,128,.15)"];

  return (
    <>
      <style>{CSS}</style>

      {/* Modals */}
      <SupplierModal open={showSupModal} onClose={()=>setShowSupModal(false)} onSelect={s=>{setSupplier(s);setF("paymentTerms",s.terms||"Net 30");setF("currency",s.currency||"LKR");}} selected={supplier} />
      <ProductModal  open={showProdModal} onClose={()=>setShowProdModal(false)} onConfirm={handleProductsConfirmed} existingItems={items} />

      <div className="grn-page">
        {/* TOPBAR */}
        <header className="grn-tb">
          <div className="grn-tb-l">
            <div className="grn-brand">
              <div className="grn-bmark">N</div>
              <div><div className="grn-bname">Nexus POS</div><div className="grn-bsub">Documents</div></div>
            </div>
            <div className="grn-bc">
              <span className="grn-bca">Dashboard</span><span className="grn-bcsep">›</span>
              <span className="grn-bca">Documents</span><span className="grn-bcsep">›</span>
              <span className="grn-bca" onClick={onBack}>GRN</span><span className="grn-bcsep">›</span>
              <span className="grn-bccur">New GRN</span>
            </div>
          </div>
          <div className="grn-tb-r">
            <button className="btn-outline-tb" onClick={onBack}>← Back</button>
            <button className="btn-gold-tb" onClick={handlePost}>✦ Post GRN</button>
          </div>
        </header>

        <div className="grn-main">
          {/* PAGE HEADER */}
          <div className="grn-page-header">
            <div>
              <div className="grn-eyebrow">Documents · Procurement</div>
              <div className="grn-page-title">Goods Received Note</div>
              <div className="grn-page-sub">Record supplier deliveries · update stock inventory</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {["draft","partial","complete"].map(s=>(
                <button key={s} className={`grn-status-opt${form.status===s?` on-${s}`:""}`} onClick={()=>setF("status",s)}>
                  {s==="draft"?"Draft":s==="partial"?"Partial":"Complete"}
                </button>
              ))}
            </div>
          </div>

          {/* 3-COLUMN LAYOUT */}
          <div className="grn-3col">

            {/* ═══ LEFT COLUMN: Supplier + GRN Details ═══ */}
            <div>
              {/* Supplier Card */}
              <div className="g-card" style={{animationDelay:"0ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">🏭</div>Supplier</div>
                  {supplier && <button className="sup-change-btn" style={{width:"auto",padding:"4px 10px",marginTop:0}} onClick={()=>setShowSupModal(true)}>Change</button>}
                </div>
                <div className="g-card-body" style={{padding:"14px"}}>
                  {!supplier ? (
                    <div className="sup-trigger" onClick={()=>setShowSupModal(true)}>
                      <div className="sup-trigger-icon">🏭</div>
                      <div>
                        <div className="sup-trigger-text">Select Supplier</div>
                        <div className="sup-trigger-sub">Click to choose from supplier list</div>
                      </div>
                    </div>
                  ) : (
                    <div className="sup-card">
                      <div className="sup-card-top">
                        <div className="sup-av" style={{background:bg,border:`1.5px solid ${clr}30`,color:clr}}>{initials(supplier.name)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div className="sup-name">{supplier.name}</div>
                          <div className="sup-tags">
                            {supplier.city && supplier.city!=="—" && <span className="sup-tag">📍 {supplier.city}</span>}
                            {supplier.category && supplier.category!=="—" && <span className="sup-tag">{supplier.category}</span>}
                            {supplier.preferred && <span style={{fontSize:"8.5px",fontWeight:800,padding:"2px 7px",borderRadius:20,background:"var(--goldbg)",border:"1px solid var(--goldbr)",color:"var(--gold)"}}>★ Preferred</span>}
                          </div>
                        </div>
                      </div>
                      <div className="sup-details">
                        {[
                          ["Code",      supplier.code],
                          ["Contact",   supplier.contactName],
                          ["Phone",     supplier.phone],
                          ["Email",     supplier.email],
                          ["Tax No.",   supplier.taxNo || "—"],
                          ["Terms",     supplier.terms || form.paymentTerms],
                          ["Currency",  supplier.currency],
                          ["Country",   supplier.country],
                        ].map(([l,v]) => v && v!=="—" ? (
                          <div key={l} className="sup-detail-row">
                            <span className="sup-detail-lbl">{l}</span>
                            <span className="sup-detail-val">{v}</span>
                          </div>
                        ) : null)}
                      </div>
                      <button className="sup-change-btn" onClick={()=>setShowSupModal(true)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Change Supplier
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* GRN Details */}
              <div className="g-card" style={{animationDelay:"40ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">📋</div>GRN Details</div></div>
                <div className="g-card-body" style={{padding:"14px"}}>
                  <div className="g-field">
                    <label className="g-label">GRN No. <span className="req">✦</span></label>
                    <input className="g-input g-mono" value={grnNo} readOnly style={{fontWeight:700,color:"var(--gold)",letterSpacing:"0.5px"}} />
                  </div>
                  <div className="g-field">
                    <label className="g-label">GRN Date <span className="req">✦</span></label>
                    <input type="date" className="g-input g-mono" value={form.grnDate} onChange={e=>setF("grnDate",e.target.value)} />
                  </div>
                  <div className="g-field">
                    <label className="g-label">Delivery Date</label>
                    <input type="date" className="g-input g-mono" value={form.deliveryDate} onChange={e=>setF("deliveryDate",e.target.value)} />
                  </div>
                  <div className="g-field">
                    <label className="g-label">Warehouse <span className="req">✦</span></label>
                    <div className="g-sel-wrap"><select className="g-select" value={form.warehouse} onChange={e=>setF("warehouse",e.target.value)}>{WAREHOUSES.map(w=><option key={w}>{w}</option>)}</select></div>
                  </div>
                  <div className="g-grid-2" style={{gap:10,marginBottom:11}}>
                    <div>
                      <label className="g-label">Invoice No.</label>
                      <input className="g-input g-mono" placeholder="INV-XXXX" value={form.invoiceNo} onChange={e=>setF("invoiceNo",e.target.value)} />
                    </div>
                    <div>
                      <label className="g-label">Invoice Date</label>
                      <input type="date" className="g-input g-mono" value={form.invoiceDate} onChange={e=>setF("invoiceDate",e.target.value)} />
                    </div>
                  </div>
                  <div className="g-field">
                    <label className="g-label">PO / Quote Ref</label>
                    <input className="g-input g-mono" placeholder="QUO-2026-XXX" value={form.poRef} onChange={e=>setF("poRef",e.target.value)} />
                  </div>
                  <div className="g-field">
                    <label className="g-label">Delivery Note No.</label>
                    <input className="g-input g-mono" placeholder="DN-XXXX" value={form.deliveryNote} onChange={e=>setF("deliveryNote",e.target.value)} />
                  </div>
                  <div className="g-grid-2" style={{gap:10,marginBottom:11}}>
                    <div>
                      <label className="g-label">Vehicle No.</label>
                      <input className="g-input" placeholder="CAB-1234" value={form.vehicleNo} onChange={e=>setF("vehicleNo",e.target.value)} />
                    </div>
                    <div>
                      <label className="g-label">Driver</label>
                      <input className="g-input" placeholder="Name" value={form.driverName} onChange={e=>setF("driverName",e.target.value)} />
                    </div>
                  </div>
                  <div className="g-field">
                    <label className="g-label">Received By <span className="req">✦</span></label>
                    <input className="g-input" placeholder="Staff name" value={form.receivedBy} onChange={e=>setF("receivedBy",e.target.value)} />
                  </div>
                  <div className="g-grid-2" style={{gap:10}}>
                    <div>
                      <label className="g-label">Payment Terms</label>
                      <div className="g-sel-wrap"><select className="g-select" value={form.paymentTerms} onChange={e=>setF("paymentTerms",e.target.value)}>{PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}</select></div>
                    </div>
                    <div>
                      <label className="g-label">Currency</label>
                      <input className="g-input g-mono" value={form.currency} onChange={e=>setF("currency",e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ MIDDLE COLUMN: Items + QC ═══ */}
            <div>
              {/* Items */}
              <div className="g-card" style={{animationDelay:"20ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">📦</div>Received Items</div>
                  <span style={{fontSize:10.5,color:"var(--ink40)",fontFamily:"'Geist Mono',monospace"}}>{items.length} line{items.length!==1?"s":""} · {fmt(totalQty)} units</span>
                </div>

                {/* Column headers */}
                <div className="items-thead">
                  <div className="items-th">#</div>
                  <div className="items-th">Description</div>
                  <div className="items-th">SKU / Barcode</div>
                  <div className="items-th">Qty</div>
                  <div className="items-th">Unit</div>
                  <div className="items-th">Unit Price</div>
                  <div className="items-th">Condition</div>
                  <div className="items-th r">Line Total</div>
                  <div className="items-th"></div>
                </div>

                {/* Rows */}
                {items.map((it, i) => (
                  <div key={it.id} className="item-row" style={{animationDelay:`${i*25}ms`}}>
                    <div className="item-num">{String(i+1).padStart(2,"0")}</div>
                    {/* Description */}
                    <div style={{paddingRight:6,display:"flex",alignItems:"center",gap:5}}>
                      {it.icon && <span style={{fontSize:14,flexShrink:0}}>{it.icon}</span>}
                      <input className="item-inp" placeholder="Item description…" value={it.description} onChange={e=>updateItem(it.id,"description",e.target.value)} />
                    </div>
                    {/* SKU */}
                    <div style={{paddingRight:6}}>
                      <input className="item-inp mono" placeholder="SKU / Barcode" value={it.sku} onChange={e=>updateItem(it.id,"sku",e.target.value)} style={{fontSize:10.5,color:"var(--ink50)"}} />
                    </div>
                    {/* Qty */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" type="number" min="0" placeholder="0" value={it.qty} onChange={e=>updateItem(it.id,"qty",e.target.value)} style={{textAlign:"right"}} />
                    </div>
                    {/* Unit */}
                    <div className="item-sel-w">
                      <select className="item-sel" value={it.unit} onChange={e=>updateItem(it.id,"unit",e.target.value)}>
                        {UNITS.map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                    {/* Unit Price */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" type="number" min="0" step="0.01" placeholder="0.00" value={it.unitPrice} onChange={e=>updateItem(it.id,"unitPrice",e.target.value)} style={{textAlign:"right"}} />
                    </div>
                    {/* Condition */}
                    <div className="item-sel-w">
                      <select className="cond-sel" value={it.condition} onChange={e=>updateItem(it.id,"condition",e.target.value)} style={condStyle(it.condition)}>
                        {CONDITIONS.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    {/* Line Total */}
                    <div className="item-line-total">{lineTotal(it)>0?`${fmt(lineTotal(it))}`:"—"}</div>
                    {/* Delete */}
                    <button className="item-del" onClick={()=>removeItem(it.id)} disabled={items.length===1}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                ))}

                <div className="items-add-row">
                  <button className="add-item-btn" onClick={addBlankItem}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Line
                  </button>
                  <button className="add-prod-btn" onClick={()=>setShowProdModal(true)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Browse Products
                  </button>
                </div>
              </div>

              {/* QC */}
              <div className="g-card" style={{animationDelay:"60ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">🔍</div>Quality Control & Inspection</div></div>
                <div className="g-card-body">
                  <label className="g-label" style={{marginBottom:9,display:"block"}}>Overall Delivery Outcome</label>
                  <div className="qc-grid">
                    {[
                      {key:"accept",  icon:"✅",label:"Fully Accepted",   cls:"accept"},
                      {key:"partial", icon:"⚠️", label:"Partial Accept",  cls:"partial"},
                      {key:"reject",  icon:"❌",label:"Rejected",         cls:"reject"},
                    ].map(o=>(
                      <div key={o.key} className={`qc-card${qcStatus===o.key?` active ${o.cls}`:""}`} onClick={()=>setQcStatus(o.key)}>
                        <div className="qc-icon">{o.icon}</div>
                        <div className="qc-label">{o.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="g-grid-2">
                    <div>
                      <label className="g-label">Inspection Notes</label>
                      <textarea className="g-textarea" placeholder="Discrepancies, damage, shortages…" value={form.notes} onChange={e=>setF("notes",e.target.value)} rows={3} />
                    </div>
                    <div>
                      <label className="g-label">Internal Remarks</label>
                      <textarea className="g-textarea" placeholder="Internal only (not printed)…" value={form.internalNotes} onChange={e=>setF("internalNotes",e.target.value)} rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT COLUMN: Summary + Checklist ═══ */}
            <div style={{position:"sticky",top:70}}>
              {/* Summary */}
              <div className="g-card" style={{animationDelay:"30ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">💰</div>Summary</div></div>
                <div className="g-card-body" style={{padding:"14px"}}>
                  <div className="sum-row"><span className="sum-lbl">Lines</span><span className="sum-val">{items.filter(it=>it.description).length}</span></div>
                  <div className="sum-row"><span className="sum-lbl">Total Qty</span><span className="sum-val">{fmt(totalQty)} units</span></div>
                  <div className="sum-row"><span className="sum-lbl">Subtotal</span><span className="sum-val">{form.currency} {fmt(subtotal)}</span></div>
                  <div className="sum-row"><span className="sum-lbl">Tax</span><span className="sum-val">{form.currency} {fmt(totalTax)}</span></div>
                  <div className="sum-total">
                    <div><div className="sum-total-lbl">Grand Total</div><div className="sum-cur">{form.currency}</div></div>
                    <div className="sum-total-val">{fmt(grandTotal)}</div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="g-card" style={{animationDelay:"60ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">✔</div>Checklist</div>
                  <span style={{fontSize:10,fontWeight:700,color:checkDone===checklist.length?"var(--green)":"var(--ink40)",fontFamily:"'Geist Mono',monospace"}}>{checkDone}/{checklist.length}</span>
                </div>
                <div className="g-card-body" style={{padding:"12px 14px"}}>
                  {checklist.map(c=>(
                    <div key={c.label} className="check-item">
                      <div className="check-box" style={{background:c.done?"var(--greenbg)":"var(--ink06)",border:`1.5px solid ${c.done?"var(--greenbr)":"var(--ink10)"}`,color:c.done?"var(--green)":"transparent"}}>✓</div>
                      <span style={{color:c.done?"var(--ink70)":"var(--ink30)",fontWeight:c.done?600:400}}>{c.label}</span>
                    </div>
                  ))}
                  {/* Progress bar */}
                  <div style={{marginTop:12,height:4,borderRadius:4,background:"var(--ink10)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(checkDone/checklist.length)*100}%`,background:checkDone===checklist.length?"var(--green)":"var(--gold)",borderRadius:4,transition:"width .4s ease"}} />
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="g-card" style={{animationDelay:"90ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">⚡</div>Actions</div></div>
                <div className="g-card-body" style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:7}}>
                  <button onClick={()=>showToast("Draft saved")} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:7,border:"1.5px solid var(--ink10)",background:"var(--paper)",color:"var(--ink50)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",transition:"all .14s",width:"100%"}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Draft
                  </button>
                  <button onClick={()=>showToast("Print preview opened")} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:7,border:"1.5px solid var(--ink10)",background:"var(--paper)",color:"var(--ink50)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",transition:"all .14s",width:"100%"}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    Print GRN
                  </button>
                  <button onClick={handlePost} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"9px 12px",borderRadius:7,border:"1px solid rgba(45,106,79,.6)",background:"var(--green)",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",transition:"all .14s",width:"100%"}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Post & Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="grn-action-bar">
          <div className="action-info">
            <span>GRN · <strong>{grnNo}</strong></span>
            {supplier && <span>Supplier: <strong>{supplier.name.split(" ").slice(0,2).join(" ")}</strong></span>}
            <span>Total: <strong>{form.currency} {fmt(grandTotal)}</strong></span>
            <span style={{color:checkDone===checklist.length?"var(--green)":"inherit"}}>Checklist: <strong>{checkDone}/{checklist.length}</strong></span>
          </div>
          <div className="action-btns">
            <button className="btn-save" onClick={()=>showToast("Draft saved")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Draft
            </button>
            <button className="btn-save" onClick={()=>showToast("Print preview opened")}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print
            </button>
            <button className="btn-post" onClick={handlePost}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Post GRN & Update Stock
            </button>
          </div>
        </div>

        {/* TOAST */}
        {toast && <div className="grn-toast"><div className="toast-dot"/>{toast}</div>}
      </div>
    </>
  );
}