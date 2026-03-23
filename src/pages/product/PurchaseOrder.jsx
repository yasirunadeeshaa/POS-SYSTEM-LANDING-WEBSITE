import { useState, useMemo } from "react";
import { NexusHeader } from '../common/Header';

// ─── DATA ────────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  { id: 0, name: "Common Supplier",             code: "—",       category: "—",            contactName: "—",                  email: "—",                    phone: "—",             country: "—",        city: "—",         currency: "—",   status: "active",   preferred: false, isDefault: true  },
  { id: 1, name: "TechSource Lanka Pvt Ltd",    code: "SUP-001", category: "Electronics",   contactName: "Mahesh Perera",       email: "mahesh@techsource.lk",  phone: "+94 11 456 7890", country: "Sri Lanka", city: "Colombo",   currency: "LKR", status: "active",   preferred: true,  isDefault: false },
  { id: 2, name: "Ceylon Wholesale Distributors",code:"SUP-002", category: "General",       contactName: "Pradeep Jayawardena", email: "pradeep@cwd.lk",        phone: "+94 81 234 5678", country: "Sri Lanka", city: "Kandy",     currency: "LKR", status: "active",   preferred: false, isDefault: false },
  { id: 3, name: "Nexgen IT Solutions",         code: "SUP-003", category: "IT & Computing",contactName: "Sampath De Silva",    email: "sampath@nexgen.lk",     phone: "+94 11 789 0123", country: "Sri Lanka", city: "Nugegoda",  currency: "LKR", status: "active",   preferred: true,  isDefault: false },
  { id: 4, name: "Island Apparel Suppliers",    code: "SUP-004", category: "Apparel",       contactName: "Kumari Mendis",       email: "kumari@islandapp.lk",   phone: "+94 31 345 6789", country: "Sri Lanka", city: "Negombo",   currency: "LKR", status: "active",   preferred: false, isDefault: false },
  { id: 5, name: "Global Stationery Corp",      code: "SUP-005", category: "Stationery",    contactName: "Nalin Wijesinghe",    email: "nalin@globalstat.lk",   phone: "+94 11 901 2345", country: "Sri Lanka", city: "Colombo 3", currency: "LKR", status: "active",   preferred: false, isDefault: false },
  { id: 6, name: "Premier Home & Living",       code: "SUP-006", category: "Home & Decor",  contactName: "Dilani Rathnayake",   email: "dilani@premhome.lk",    phone: "+94 33 567 8901", country: "Sri Lanka", city: "Gampaha",   currency: "LKR", status: "inactive", preferred: false, isDefault: false },
];

const PRODUCTS = [
  { id: 1,  name: "Wireless Earbuds Pro",      sku: "WEP-221", icon: "🎧", category: "Electronics", brand: "Nexus",    price: 59.99,  cost: 28.00, stock: 18, tax: 18 },
  { id: 2,  name: "Cotton Crew T-Shirt",        sku: "CCT-089", icon: "👕", category: "Apparel",     brand: "Generic",  price: 17.99,  cost: 6.50,  stock: 42, tax: 5  },
  { id: 3,  name: "Leather Wallet Slim",        sku: "LWS-441", icon: "👜", category: "Accessories", brand: "Nexus",    price: 24.99,  cost: 9.00,  stock: 9,  tax: 5  },
  { id: 4,  name: "Scented Candle Set",         sku: "SCS-112", icon: "🕯", category: "Home",        brand: "OEM",      price: 15.99,  cost: 5.20,  stock: 5,  tax: 5  },
  { id: 5,  name: "Stainless Water Bottle",     sku: "SWB-330", icon: "🍶", category: "Lifestyle",   brand: "Nexus",    price: 16.99,  cost: 7.00,  stock: 23, tax: 5  },
  { id: 6,  name: "Notebook A5 Grid",           sku: "NAG-007", icon: "📓", category: "Stationery",  brand: "Generic",  price: 5.99,   cost: 1.80,  stock: 67, tax: 0  },
  { id: 7,  name: "USB-C Hub 7-in-1",           sku: "UCH-880", icon: "🔌", category: "Electronics", brand: "Anker",    price: 44.99,  cost: 19.00, stock: 3,  tax: 18 },
  { id: 8,  name: "Phone Case iPhone 15",       sku: "PCI-556", icon: "📱", category: "Accessories", brand: "Generic",  price: 12.99,  cost: 3.50,  stock: 14, tax: 5  },
  { id: 9,  name: "Yoga Mat Pro",               sku: "YMP-203", icon: "🧘", category: "Sports",      brand: "Nexus",    price: 34.99,  cost: 14.00, stock: 11, tax: 5  },
  { id: 10, name: "Ceramic Coffee Mug",         sku: "CCM-445", icon: "☕", category: "Home",        brand: "OEM",      price: 9.99,   cost: 3.00,  stock: 30, tax: 5  },
  { id: 14, name: "Mechanical Keyboard TKL",    sku: "MKT-509", icon: "⌨",  category: "Electronics", brand: "Logitech", price: 89.99,  cost: 42.00, stock: 6,  tax: 18 },
  { id: 16, name: "Portable Charger 20000mAh",  sku: "PCH-392", icon: "🔋", category: "Electronics", brand: "Anker",    price: 49.99,  cost: 21.00, stock: 12, tax: 18 },
];

const CATEGORIES   = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];
const BRANDS       = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.brand))).sort()];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60", "COD", "Advance"];
const CURRENCIES   = ["LKR", "USD", "EUR", "GBP", "SGD", "AED"];
const UNITS        = ["pcs", "kg", "g", "l", "ml", "box", "carton", "roll", "pair", "set"];
const DELIVERY_LOCS = ["Main Warehouse – Colombo", "Branch Store – Kandy", "Negombo Outlet", "Transit Hub – Kelaniya"];
const PRIORITIES   = ["Normal", "Urgent", "Low Priority"];

const AV_COLORS = [
  ["#9E9080","rgba(158,144,128,.15)"],["#2B5490","rgba(43,84,144,.15)"],
  ["#5B3D8F","rgba(91,61,143,.15)"], ["#2D6A4F","rgba(45,106,79,.15)"],
  ["#B8902A","rgba(184,144,42,.15)"],["#B5372A","rgba(181,55,42,.15)"],
  ["#7A5C1E","rgba(122,92,30,.15)"], ["#8A3A6A","rgba(138,58,106,.15)"],
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

const avColor  = id  => AV_COLORS[id % AV_COLORS.length];
const initials = name => name === "Common Supplier" ? "CS" : name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const fmt      = n   => Number(n||0).toFixed(2);
const fmtLoc   = n   => Number(n||0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2});
let _uid = 100; const uid = () => _uid++;

const hl = (text, q) => {
  if (!q.trim() || !text || text==="—") return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i===-1) return text;
  return <>{text.slice(0,i)}<mark style={{background:"rgba(184,144,42,.28)",color:"var(--gold)",borderRadius:2,padding:"0 1px"}}>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
};

const today = () => new Date().toISOString().split("T")[0];
const addDays = (d,n) => { const dt=new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().split("T")[0]; };
const genPONo = () => `PO-2026-${String(Math.floor(Math.random()*900)+100).padStart(3,"0")}`;

// ─── CSS ─────────────────────────────────────────────────────────────────────
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
  --purple:#5B3D8F;--purplebg:rgba(91,61,143,.08);--purplebr:rgba(91,61,143,.22);
  --s0:0 1px 3px rgba(27,23,19,.06);--s1:0 4px 14px rgba(27,23,19,.1);
  --s2:0 8px 28px rgba(27,23,19,.13);
  --shadow-lg:0 24px 64px rgba(27,23,19,.22),0 6px 20px rgba(27,23,19,.1);
}
html,body,#root{min-height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink)}

@keyframes fadeUp   {from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:none}}
@keyframes rowIn    {from{opacity:0;transform:translateY(4px)}  to{opacity:1;transform:none}}
@keyframes toastIn  {from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none}}
@keyframes overlayIn{from{opacity:0}                            to{opacity:1}}
@keyframes modalIn  {from{opacity:0;transform:scale(.97) translateY(16px)} to{opacity:1;transform:none}}
@keyframes spmIn    {from{opacity:0;transform:scale(.95) translateY(12px)} to{opacity:1;transform:none}}
@keyframes popIn    {from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)}}
@keyframes slideIn  {from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:none}}

/* ── Page shell ── */
.po-page{min-height:100vh;display:flex;flex-direction:column;background:var(--cream)}

/* ── Topbar ── */
.po-tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
.po-tb-l{display:flex;align-items:center;gap:20px}
.po-brand{display:flex;align-items:center;gap:10px}
.po-bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
.po-bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
.po-bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
.po-bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
.po-bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.po-bca:hover{color:rgba(246,243,236,.65)}
.po-bcsep{color:rgba(246,243,236,.15)}.po-bccur{color:var(--goldl);font-weight:500}
.po-tb-r{display:flex;align-items:center;gap:8px}
.btn-outline-tb{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:transparent;border:1.5px solid rgba(246,243,236,.2);color:rgba(246,243,236,.65);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.btn-outline-tb:hover{border-color:rgba(246,243,236,.4);color:#F6F3EC}
.btn-gold-tb{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:5px;background:var(--gold);border:1px solid var(--goldd);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.btn-gold-tb:hover{background:var(--goldl);transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.4)}

/* ── Main ── */
.po-main{flex:1;padding:22px 20px 80px;width:100%}
.po-page-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:20px}
.po-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:5px;display:flex;align-items:center;gap:8px}
.po-eyebrow::before{content:'';width:18px;height:1px;background:var(--gold);opacity:.6}
.po-page-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.3px}
.po-page-sub{font-size:12px;color:var(--ink40);margin-top:5px}

/* Status selector */
.po-status-bar{display:flex;gap:5px;align-items:center}
.po-status-opt{padding:5px 12px;border-radius:20px;font-size:10.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:var(--paper);color:var(--ink40);transition:all .14s;font-family:'DM Sans',sans-serif}
.po-status-opt.on-draft   {background:rgba(158,144,128,.1);border-color:rgba(158,144,128,.3);color:#9E9080}
.po-status-opt.on-sent    {background:var(--bluebg);border-color:var(--bluebr);color:var(--blue)}
.po-status-opt.on-approved{background:var(--greenbg);border-color:var(--greenbr);color:var(--green)}

/* Priority badge */
.po-priority-wrap{display:flex;gap:5px}
.po-priority-opt{padding:4px 10px;border-radius:20px;font-size:10.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--ink10);background:transparent;color:var(--ink40);transition:all .13s}
.po-priority-opt.on-Normal       {background:var(--greenbg);border-color:var(--greenbr);color:var(--green)}
.po-priority-opt.on-Urgent       {background:var(--redbg);border-color:var(--redbr);color:var(--red)}
.po-priority-opt.on-Low\ Priority{background:var(--ink03);border-color:var(--ink10);color:var(--ink40)}

/* ── 3-col layout ── */
.po-3col{display:grid;grid-template-columns:300px 1fr 240px;gap:14px;align-items:start}

/* ── Cards ── */
.g-card{background:var(--paper);border:1px solid var(--ink10);border-radius:10px;box-shadow:var(--s0);overflow:hidden;animation:fadeUp .22s ease both}
.g-card+.g-card{margin-top:14px}
.g-card-head{padding:12px 16px;border-bottom:1px solid var(--ink06);display:flex;align-items:center;justify-content:space-between;background:#EDE8DE}
.g-card-title{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--ink);display:flex;align-items:center;gap:7px}
.g-title-icon{width:20px;height:20px;border-radius:5px;background:var(--goldbg);border:1px solid var(--goldbr);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.g-card-body{padding:16px}

/* ── Form elements ── */
.g-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40);margin-bottom:5px;display:block}
.g-req{color:var(--gold)}
.g-input,.g-select,.g-textarea{width:100%;padding:8px 11px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);outline:none;transition:all .18s;appearance:none}
.g-input:hover,.g-select:hover{border-color:var(--ink20)}
.g-input:focus,.g-select:focus,.g-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1);background:var(--paper)}
.g-input::placeholder,.g-textarea::placeholder{color:var(--ink20)}
.g-input[readonly]{background:var(--ink03);color:var(--gold);cursor:default;border-style:dashed;font-family:'Geist Mono',monospace;font-weight:700;letter-spacing:.5px}
.g-textarea{resize:vertical;min-height:68px;line-height:1.5}
.g-sel-wrap{position:relative}.g-sel-wrap::after{content:'▾';position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--ink30);pointer-events:none}
.g-select{padding-right:26px;cursor:pointer}
.g-mono{font-family:'Geist Mono',monospace;font-size:11.5px}
.g-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.g-field{margin-bottom:11px}
.g-field:last-child{margin-bottom:0}

/* ── Supplier panel ── */
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
.sup-details{display:flex;flex-direction:column;gap:0}
.sup-detail-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--ink06)}
.sup-detail-row:last-child{border-bottom:none}
.sup-detail-lbl{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink40);flex-shrink:0}
.sup-detail-val{font-size:11.5px;font-weight:600;color:var(--ink70);text-align:right;word-break:break-word;max-width:60%}
.sup-change-btn{display:flex;align-items:center;gap:5px;margin-top:10px;padding:6px 12px;border-radius:6px;border:1px solid var(--goldbr);background:transparent;color:var(--gold);font-size:11px;font-weight:700;cursor:pointer;transition:all .13s;font-family:'DM Sans',sans-serif;width:100%;justify-content:center}
.sup-change-btn:hover{background:var(--goldbg)}

/* ── Items table ── */
.items-thead{display:grid;grid-template-columns:28px 2.4fr 1fr 80px 90px 110px 90px 90px 32px;gap:0;padding:7px 12px;background:#EDE8DE;border-bottom:2px solid var(--gold)}
.items-th{font-size:8px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
.items-th.r{text-align:right}
.item-row{display:grid;grid-template-columns:28px 2.4fr 1fr 80px 90px 110px 90px 90px 32px;gap:0;padding:8px 12px;border-bottom:1px solid var(--ink06);align-items:center;transition:background .12s;animation:rowIn .2s ease both}
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
.items-add-row{padding:10px 12px;border-top:1px dashed var(--ink10);display:flex;align-items:center;gap:8px}
.add-item-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px dashed var(--goldbr);background:var(--goldbg);color:var(--gold);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
.add-item-btn:hover{background:rgba(184,144,42,.13);border-color:var(--gold)}
.add-prod-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:6px;border:1.5px solid var(--bluebr);background:var(--bluebg);color:var(--blue);font-size:11.5px;font-weight:700;cursor:pointer;transition:all .14s;font-family:'DM Sans',sans-serif}
.add-prod-btn:hover{background:rgba(43,84,144,.14);border-color:var(--blue)}

/* ── Summary ── */
.sum-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--ink06);font-size:12px}
.sum-row:last-child{border-bottom:none}
.sum-lbl{color:var(--ink50);font-weight:500}
.sum-val{font-family:'Geist Mono',monospace;font-weight:700;color:var(--ink);font-size:12px}
.sum-disc-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--ink06)}
.sum-disc-inp{width:72px;padding:4px 8px;background:var(--cream);border:1.5px solid var(--ink10);border-radius:5px;font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:600;color:var(--ink);outline:none;text-align:right;transition:all .15s}
.sum-disc-inp:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,144,42,.1)}
.sum-total-box{background:var(--ink);border-radius:8px;padding:11px 13px;display:flex;align-items:center;justify-content:space-between;margin-top:12px}
.sum-total-lbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.45)}
.sum-cur{font-size:10px;font-weight:600;color:rgba(246,243,236,.35);margin-bottom:1px}
.sum-total-val{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--goldl)}

/* ── Checklist ── */
.check-item{display:flex;align-items:center;gap:7px;padding:5px 0;font-size:11px}
.check-box{width:15px;height:15px;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;transition:all .2s}

/* ── Terms & conditions ── */
.terms-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:11px}

/* ── Action bar ── */
.po-action-bar{position:fixed;bottom:0;left:0;right:0;background:var(--ink);border-top:2px solid var(--gold);padding:11px 24px;display:flex;align-items:center;justify-content:space-between;z-index:40;box-shadow:0 -4px 20px rgba(27,23,19,.3)}
.action-info{font-size:11px;color:rgba(246,243,236,.35);display:flex;align-items:center;gap:14px}
.action-info strong{color:var(--goldl);font-family:'Geist Mono',monospace;font-size:12px}
.action-btns{display:flex;gap:7px}
.btn-save{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:6px;background:transparent;border:1.5px solid rgba(246,243,236,.2);color:rgba(246,243,236,.65);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.btn-save:hover{border-color:rgba(246,243,236,.4);color:#F6F3EC}
.btn-send{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;background:var(--blue);border:1px solid rgba(43,84,144,.6);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.btn-send:hover{background:#3A6BC5;transform:translateY(-1px);box-shadow:0 4px 14px rgba(43,84,144,.35)}
.btn-approve{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:6px;background:var(--green);border:1px solid rgba(45,106,79,.6);color:#fff;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s}
.btn-approve:hover{background:#3D8A65;transform:translateY(-1px);box-shadow:0 4px 14px rgba(45,106,79,.35)}

/* ── Toast ── */
.po-toast{position:fixed;top:66px;right:22px;z-index:200;background:var(--ink);border:1px solid var(--gold);border-radius:8px;padding:11px 16px;display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;color:#F6F3EC;box-shadow:var(--s2);animation:toastIn .22s ease;pointer-events:none}
.toast-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0}

/* ══════════════════════════════
   SUPPLIER SELECTION MODAL
══════════════════════════════ */
.spm-backdrop{position:fixed;inset:0;z-index:900;background:rgba(27,23,19,.58);backdrop-filter:blur(6px) saturate(.85);display:flex;align-items:center;justify-content:center;padding:24px;animation:overlayIn .2s ease both}
.spm-modal{background:var(--paper);border:1px solid var(--ink10);border-radius:16px;box-shadow:var(--shadow-lg);width:100%;max-width:700px;max-height:min(86vh,680px);display:flex;flex-direction:column;overflow:hidden;animation:spmIn .3s cubic-bezier(.16,1,.3,1) both}
.spm-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 15px;background:var(--ink);border-bottom:1px solid rgba(184,144,42,.18);flex-shrink:0;position:relative}
.spm-head::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);opacity:.32}
.spm-head-left{display:flex;align-items:center;gap:12px}
.spm-icon-wrap{width:36px;height:36px;border-radius:8px;flex-shrink:0;background:rgba(184,144,42,.1);border:1.5px solid rgba(184,144,42,.28);display:flex;align-items:center;justify-content:center}
.spm-eyebrow-m{font-size:8px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:rgba(184,144,42,.6);margin-bottom:2px}
.spm-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:#F6F3EC;line-height:1}
.spm-close{width:28px;height:28px;border-radius:7px;flex-shrink:0;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);color:rgba(246,243,236,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.spm-close:hover{background:rgba(246,243,236,.13);color:rgba(246,243,236,.9)}
.spm-search-zone{padding:11px 16px;background:var(--warm);border-bottom:1px solid var(--ink10);display:flex;align-items:center;gap:10px;flex-shrink:0}
.spm-search-wrap{flex:1;position:relative}
.spm-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink30);pointer-events:none}
.spm-search{width:100%;padding:8px 34px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;outline:none;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;color:var(--ink);transition:all .18s}
.spm-search::placeholder{color:var(--ink30)}
.spm-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
.spm-clear{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:18px;height:18px;border-radius:50%;background:var(--ink10);border:none;cursor:pointer;color:var(--ink40);display:flex;align-items:center;justify-content:center;transition:all .15s}
.spm-clear:hover{background:var(--ink20)}
.spm-col-head{display:grid;grid-template-columns:200px 110px 1fr 130px;padding:8px 16px 7px;border-bottom:1px solid var(--ink10);flex-shrink:0;background:var(--cream)}
.spm-col-lbl{font-size:8.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40)}
.spm-col-lbl.right{text-align:right}
.spm-list{flex:1;overflow-y:auto}
.spm-list::-webkit-scrollbar{width:3px}
.spm-list::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px}
.spm-divider-label{padding:6px 16px 5px;font-size:8px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--ink30);background:var(--ink03);border-bottom:1px solid var(--ink06);display:flex;align-items:center;gap:8px}
.spm-divider-label::after{content:'';flex:1;height:1px;background:var(--ink10)}
.spm-item{display:grid;grid-template-columns:200px 110px 1fr 130px;padding:10px 16px;align-items:center;cursor:pointer;border-bottom:1px solid var(--ink03);transition:background .12s;position:relative;animation:rowIn .28s ease both}
.spm-item:last-child{border-bottom:none}
.spm-item:hover{background:var(--warm)}
.spm-item--selected{background:var(--goldbg)!important}
.spm-item--selected::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--gold);border-radius:0 2px 2px 0}
.spm-item--inactive{opacity:.5}
.spm-col-name{display:flex;align-items:center;gap:10px;min-width:0;padding-right:10px}
.spm-av{width:36px;height:36px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700}
.spm-name-wrap{min-width:0}
.spm-name{font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:2px}
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
.spm-footer{padding:9px 16px;border-top:1px solid var(--ink06);background:var(--warm);flex-shrink:0;font-size:11px;color:var(--ink40);font-weight:500;display:flex;align-items:center;gap:6px}
.spm-footer strong{color:var(--ink70);font-weight:700}

/* ══════════════════════════════
   PRODUCT SELECTION MODAL
══════════════════════════════ */
.psm-overlay{position:fixed;inset:0;background:rgba(27,23,19,.55);backdrop-filter:blur(3px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayIn .2s ease}
.psm-shell{background:var(--cream);border:1px solid var(--ink10);border-radius:18px;width:100%;max-width:960px;height:min(88vh,700px);display:flex;flex-direction:column;box-shadow:var(--shadow-lg);animation:modalIn .28s cubic-bezier(.16,1,.3,1);overflow:hidden}
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

// ─── SUPPLIER MODAL ──────────────────────────────────────────────────────────
function SupplierModal({ open, onClose, onSelect, selected }) {
  const [search, setSearch] = useState("");
  const { defaultSupplier, filtered } = useMemo(() => {
    const q = search.toLowerCase().trim();
    const def  = SUPPLIERS.find(s => s.isDefault);
    const rest = SUPPLIERS.filter(s => !s.isDefault);
    if (!q) return { defaultSupplier: def, filtered: rest };
    const match = s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.contactName.toLowerCase().includes(q);
    return { defaultSupplier: match(def) ? def : null, filtered: rest.filter(match) };
  }, [search]);
  const total = (defaultSupplier?1:0) + filtered.length;
  if (!open) return null;

  const renderRow = (s, i, isDef=false) => {
    const [clr,bg] = avColor(s.id);
    const isSel = selected?.id === s.id;
    return (
      <div key={s.id}
        className={`spm-item${isSel?" spm-item--selected":""}${s.status==="inactive"?" spm-item--inactive":""}`}
        style={{animationDelay:`${i*14}ms`}}
        onClick={()=>{onSelect(s);onClose();}}
      >
        <div className="spm-col-name">
          <div className="spm-av" style={{background:bg,border:`1.5px solid ${clr}25`,color:clr}}>{initials(s.name)}</div>
          <div className="spm-name-wrap">
            <div className="spm-name">{hl(s.name,search)}</div>
            <div className="spm-name-meta">
              {isDef && <span className="spm-default-tag">Default</span>}
              {s.preferred && <span className="spm-preferred">★ Preferred</span>}
              {!isDef && <span className={`spm-status-dot${s.status==="active"?" spm-status-dot--active":""}`}/>}
            </div>
          </div>
        </div>
        <div className="spm-col-code">
          <div className="spm-code">{isDef?"—":hl(s.code,search)}</div>
          <div className="spm-category">{s.category}</div>
        </div>
        <div className="spm-col-email">
          <div className="spm-email">{isDef?"—":s.email}</div>
          <div className="spm-contact-name">{isDef?"Walk-in / General":hl(s.contactName,search)}</div>
        </div>
        <div className="spm-col-phone">
          <div className="spm-phone">{isDef?"—":s.phone}</div>
          <div className="spm-currency">{isDef?"":s.currency}</div>
        </div>
        {isSel && <div className="spm-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
      </div>
    );
  };

  return (
    <div className="spm-backdrop" onClick={onClose}>
      <div className="spm-modal" onClick={e=>e.stopPropagation()}>
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
            <input className="spm-search" placeholder="Search by name, code or contact…" value={search} onChange={e=>setSearch(e.target.value)} autoFocus />
            {search && <button className="spm-clear" onClick={()=>setSearch("")}>×</button>}
          </div>
        </div>
        <div className="spm-col-head">
          <div className="spm-col-lbl">Supplier Name</div>
          <div className="spm-col-lbl">Supplier No.</div>
          <div className="spm-col-lbl">Email</div>
          <div className="spm-col-lbl right">Phone</div>
        </div>
        <div className="spm-list">
          {total === 0 ? (
            <div className="spm-empty"><div className="spm-empty-icon">🔍</div><div className="spm-empty-title">No suppliers found</div><div className="spm-empty-sub">Try a different name, code, or contact.</div></div>
          ) : (
            <>
              {defaultSupplier && <><div className="spm-divider-label">Default</div>{renderRow(defaultSupplier,0,true)}</>}
              {filtered.length>0 && <><div className="spm-divider-label">Suppliers</div>{filtered.map((s,i)=>renderRow(s,i+1,false))}</>}
            </>
          )}
        </div>
        <div className="spm-footer"><strong>{total}</strong> supplier{total!==1?"s":""} shown{search&&<> · searching <strong>"{search}"</strong></>}</div>
      </div>
    </div>
  );
}

// ─── PRODUCT MODAL ───────────────────────────────────────────────────────────
function ProductModal({ open, onClose, onConfirm }) {
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [brandFilter, setBrandFilter] = useState("All");
  const [sortKey, setSortKey]     = useState("name");
  const [cart, setCart]           = useState([]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)||p.category.toLowerCase().includes(q));
    if (catFilter!=="All")   list = list.filter(p=>p.category===catFilter);
    if (brandFilter!=="All") list = list.filter(p=>p.brand===brandFilter);
    list.sort((a,b)=>sortKey==="price-asc"?a.price-b.price:sortKey==="price-desc"?b.price-a.price:sortKey==="stock"?b.stock-a.stock:a.name.localeCompare(b.name));
    return list;
  }, [search, catFilter, brandFilter, sortKey]);

  const ci       = pid => cart.find(i=>i.productId===pid);
  const addProd  = prod => {
    if (prod.stock===0) return;
    setCart(prev=>{
      const ex=prev.find(i=>i.productId===prod.id);
      if(ex) return prev.map(i=>i.productId===prod.id?{...i,qty:i.qty+1}:i);
      return [...prev,{productId:prod.id,name:prod.name,sku:prod.sku,icon:prod.icon,unitPrice:prod.price,cost:prod.cost,tax:prod.tax,qty:1,discount:0}];
    });
  };
  const remProd  = pid => setCart(prev=>prev.filter(i=>i.productId!==pid));
  const updQty   = (pid,v) => { const q=Math.max(1,parseInt(v)||1); setCart(prev=>prev.map(i=>i.productId===pid?{...i,qty:q}:i)); };

  const subtotal = cart.reduce((s,i)=>s+i.unitPrice*i.qty,0);
  const tax      = cart.reduce((s,i)=>s+(i.unitPrice*i.qty*i.tax/100),0);

  const StockBadge = ({stock}) => {
    if(stock===0) return <span className="psm-stock-badge" style={{background:"var(--redbg)",color:"var(--red)",border:"1px solid var(--redbr)"}}>Out</span>;
    if(stock<=10) return <span className="psm-stock-badge" style={{background:"var(--goldbg)",color:"var(--gold)",border:"1px solid var(--goldbr)"}}>{stock} left</span>;
    return <span className="psm-stock-badge" style={{background:"var(--greenbg)",color:"var(--green)",border:"1px solid var(--greenbr)"}}>{stock}</span>;
  };

  if (!open) return null;
  return (
    
    <div className="psm-overlay" onClick={onClose}>
      <div className="psm-shell" onClick={e=>e.stopPropagation()}>
        <div className="psm-head">
          <div className="psm-head-row">
            <div><div className="psm-eyebrow">Inventory · Products</div><div className="psm-modal-title">Select Products</div></div>
            <button className="psm-close" onClick={onClose}>×</button>
          </div>
          <div className="psm-search-row">
            <div className="psm-search-wrap">
              <span className="psm-search-ico">⌕</span>
              <input className="psm-search" placeholder="Search by name, SKU or category…" value={search} onChange={e=>setSearch(e.target.value)} autoFocus />
              {search && <button className="psm-search-clear" onClick={()=>setSearch("")}>×</button>}
            </div>
          </div>
          <div className="psm-filters">
            {CATEGORIES.map(c=><button key={c} className={`psm-filter-pill${catFilter===c?" active":""}`} onClick={()=>setCatFilter(c)}>{c}</button>)}
            <div style={{width:1,background:"rgba(246,243,236,.1)",alignSelf:"stretch",margin:"0 4px"}}/>
            {BRANDS.map(b=><button key={b} className={`psm-brand-pill${brandFilter===b?" active":""}`} onClick={()=>setBrandFilter(b)}>{b}</button>)}
          </div>
        </div>
        <div className="psm-body">
          <div className="psm-grid-wrap">
            <div className="psm-results-bar">
              <span className="psm-count">Showing <strong>{filtered.length}</strong> of <strong>{PRODUCTS.length}</strong></span>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span style={{fontSize:10.5,color:"var(--ink40)",fontWeight:600}}>Sort</span>
                <div className="psm-sort-sel-wrap">
                  <select className="psm-sort-select" value={sortKey} onChange={e=>setSortKey(e.target.value)}>
                    <option value="name">Name A–Z</option><option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option><option value="stock">Stock ↓</option>
                  </select>
                  <span className="psm-sort-arr">▾</span>
                </div>
              </div>
            </div>
            {filtered.length===0 ? (
              <div className="psm-empty-state">
                <div className="psm-empty-state-ico">🔍</div>
                <div className="psm-empty-state-title">No products found</div>
                <div className="psm-empty-state-sub">Try a different search term or clear filters</div>
                <button style={{marginTop:4,padding:"7px 14px",borderRadius:7,border:"1.5px solid var(--ink10)",background:"transparent",color:"var(--ink50)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{setSearch("");setCatFilter("All");setBrandFilter("All")}}>Clear filters</button>
              </div>
            ) : (
              <div className="psm-prod-grid">
                {filtered.map((p,i)=>{
                  const c=ci(p.id); const cc=CAT_COLORS[p.category]||{};
                  return (
                    <div key={p.id} className={`psm-prod-card${c?" selected":""}${p.stock===0?" out":""}`} style={{"--cat-c":cc.color,animationDelay:`${i*18}ms`}} onClick={()=>addProd(p)}>
                      <div className="psm-card-icon-row">
                        <div className="psm-card-icon">{p.icon}</div>
                        {c && <div className="psm-qty-badge">{c.qty}</div>}
                      </div>
                      <div><div className="psm-card-sku">{p.sku}</div><div className="psm-card-name">{p.name}</div></div>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4,flexWrap:"wrap"}}>
                        <span className="psm-card-cat" style={{background:cc.bg,color:cc.color,border:`1px solid ${cc.border}`}}>{p.category}</span>
                        <StockBadge stock={p.stock}/>
                      </div>
                      <div className="psm-card-bottom">
                        <div className="psm-card-price">${fmtLoc(p.price)}</div>
                        <div style={{width:24,height:24,borderRadius:"50%",background:c?"var(--gold)":"var(--warm2)",border:`1.5px solid ${c?"var(--goldd)":"var(--ink10)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c?"#fff":"var(--ink40)",transition:"all .18s",flexShrink:0}}>{c?"✓":"+"}</div>
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
              {cart.length>0 && <span className="psm-cart-badge">{cart.length} product{cart.length>1?"s":""}</span>}
            </div>
            {cart.length===0 ? (
              <div className="psm-cart-empty"><div className="psm-cart-empty-ico">🛒</div><div className="psm-cart-empty-msg">No products selected.<br/>Click any product to add.</div></div>
            ) : (
              <div className="psm-cart-items">
                {cart.map((item,i)=>(
                  <div key={item.productId} className="psm-cart-item" style={{animationDelay:`${i*20}ms`}}>
                    <div className="psm-ci-icon">{item.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="psm-ci-name">{item.name}</div>
                      <div className="psm-ci-sku">{item.sku}</div>
                      <div className="psm-qty-row" style={{marginTop:4}}>
                        <button className="psm-qty-btn" onClick={()=>item.qty>1?updQty(item.productId,item.qty-1):remProd(item.productId)}>−</button>
                        <input className="psm-qty-val" type="number" min="1" value={item.qty} onChange={e=>updQty(item.productId,e.target.value)}/>
                        <button className="psm-qty-btn" onClick={()=>updQty(item.productId,item.qty+1)}>+</button>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                      <div className="psm-ci-price">${fmtLoc(item.unitPrice)}</div>
                      <div className="psm-ci-subtotal">${fmtLoc(item.unitPrice*item.qty)}</div>
                      <button className="psm-ci-remove" onClick={()=>remProd(item.productId)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="psm-cart-footer">
              {cart.length>0 && (
                <>
                  <div className="psm-totals-row"><span className="psm-totals-label">{cart.reduce((s,i)=>s+i.qty,0)} items</span><span className="psm-totals-val">${fmtLoc(subtotal)}</span></div>
                  <div className="psm-totals-row"><span className="psm-totals-label">Est. Tax</span><span className="psm-totals-val">${fmtLoc(tax)}</span></div>
                  <div className="psm-grand-row"><span className="psm-grand-label">Total</span><span className="psm-grand-val">${fmtLoc(subtotal+tax)}</span></div>
                </>
              )}
              <button className="psm-btn psm-btn-gold" onClick={()=>{onConfirm(cart);onClose();}} disabled={cart.length===0}>
                ✓ Add {cart.length>0?`${cart.length} Product${cart.length>1?"s":""}`:"Products"}
              </button>
              {cart.length>0 && <button className="psm-btn psm-btn-ghost" style={{marginTop:6}} onClick={()=>setCart([])}>Clear Selection</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function PurchaseOrderPage({ onBack }) {
  const [poNo]   = useState(genPONo);
  const todayStr = today();

  const [supplier, setSupplier]         = useState(null);
  const [showSupModal, setShowSupModal] = useState(false);
  const [showProdModal,setShowProdModal]= useState(false);

  const [form, setForm] = useState({
    poDate:     todayStr,
    deliveryDate: addDays(todayStr, 14),
    deliveryLocation: DELIVERY_LOCS[0],
    paymentTerms: "Net 30",
    currency:   "LKR",
    reference:  "",
    quotationRef:"",
    priority:   "Normal",
    status:     "draft",
    // billing
    billingAddress: "",
    // terms
    warrantyTerms: "",
    specialInstructions: "",
    internalNotes: "",
  });
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const [items,    setItems]    = useState([{id:uid(),description:"",sku:"",icon:"",qty:"",unit:"pcs",unitPrice:"",discount:0,taxRate:8}]);
  const [overallDisc, setOverallDisc] = useState(0);
  const [toast,    setToast]    = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null), 2800); };

  const updateItem  = (id,k,v) => setItems(its=>its.map(it=>it.id===id?{...it,[k]:v}:it));
  const removeItem  = id => setItems(its=>its.filter(it=>it.id!==id));
  const addBlank    = () => setItems(its=>[...its,{id:uid(),description:"",sku:"",icon:"",qty:"",unit:"pcs",unitPrice:"",discount:0,taxRate:8}]);

  const handleProductsConfirmed = cartItems => {
    const newLines = cartItems.map(ci=>({
      id: uid(), description:ci.name, sku:ci.sku, icon:ci.icon||"",
      qty:String(ci.qty), unit:"pcs", unitPrice:String(ci.unitPrice),
      discount:ci.discount||0, taxRate:ci.tax||0,
    }));
    setItems(prev=>{
      const clean = prev.filter(it=>it.description||it.sku||it.unitPrice);
      return [...clean,...newLines];
    });
    showToast(`✦ ${newLines.length} product${newLines.length>1?"s":""} added`);
  };

  const lineSubtotal = it => (parseFloat(it.qty)||0)*(parseFloat(it.unitPrice)||0);
  const lineDisc     = it => lineSubtotal(it)*(parseFloat(it.discount)||0)/100;
  const lineNet      = it => lineSubtotal(it)-lineDisc(it);
  const lineTax      = it => lineNet(it)*(parseFloat(it.taxRate)||0)/100;
  const lineTotal    = it => lineNet(it)+lineTax(it);

  const subtotal     = items.reduce((s,it)=>s+lineNet(it),0);
  const totalTax     = items.reduce((s,it)=>s+lineTax(it),0);
  const overallDiscAmt = subtotal*(parseFloat(overallDisc)||0)/100;
  const grandTotal   = subtotal - overallDiscAmt + totalTax;
  const totalQty     = items.reduce((s,it)=>s+(parseFloat(it.qty)||0),0);

  const checklist = [
    { label:"Supplier selected",     done:!!supplier                                   },
    { label:"PO date set",           done:!!form.poDate                                },
    { label:"Delivery date set",     done:!!form.deliveryDate                          },
    { label:"Delivery location set", done:!!form.deliveryLocation                      },
    { label:"Items added",           done:items.some(it=>it.description)               },
    { label:"Quantities entered",    done:items.some(it=>parseFloat(it.qty)>0)         },
    { label:"Prices entered",        done:items.some(it=>parseFloat(it.unitPrice)>0)   },
    { label:"Payment terms set",     done:!!form.paymentTerms                          },
  ];
  const checkDone = checklist.filter(c=>c.done).length;

  const handleSend = () => {
    if (!supplier)                       { showToast("⚠ Please select a supplier"); return; }
    if (!items.some(it=>it.description)) { showToast("⚠ Add at least one item");    return; }
    setF("status","sent");
    showToast(`✦ ${poNo} sent to supplier`);
  };
  const handleApprove = () => {
    if (!supplier)                       { showToast("⚠ Please select a supplier"); return; }
    if (!items.some(it=>it.description)) { showToast("⚠ Add at least one item");    return; }
    setF("status","approved");
    showToast(`✓ ${poNo} approved`);
  };

  const [clr,bg] = supplier ? avColor(supplier.id) : ["#9E9080","rgba(158,144,128,.15)"];

  return (
    <>
        <NexusHeader
            activePage="Inventory"
            breadcrumbs={[
                { label: "Inventory" },
                { label: "Purchase Orders" },
                { label: "New PO", current: true }
            ]}
            />
      <style>{CSS}</style>
      <SupplierModal open={showSupModal} onClose={()=>setShowSupModal(false)} onSelect={s=>{setSupplier(s);setF("paymentTerms",s.terms||"Net 30");setF("currency",s.currency||"LKR");}} selected={supplier}/>
      <ProductModal  open={showProdModal} onClose={()=>setShowProdModal(false)} onConfirm={handleProductsConfirmed}/>

      <div className="po-page">

        <div className="po-main">
          {/* PAGE HEADER */}
          <div className="po-page-header">
            <div>
              <div className="po-eyebrow">Documents · Procurement</div>
              <div className="po-page-title">Purchase Order</div>
              <div className="po-page-sub">Create and manage supplier purchase orders</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
              <div className="po-status-bar">
                {["draft","sent","approved"].map(s=>(
                  <button key={s} className={`po-status-opt${form.status===s?` on-${s}`:""}`} onClick={()=>setF("status",s)}>
                    {s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="po-priority-wrap">
                {PRIORITIES.map(p=>(
                  <button key={p} className={`po-priority-opt${form.priority===p?` on-${p}`:""}`} onClick={()=>setF("priority",p)}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          {/* 3-COLUMN LAYOUT */}
          <div className="po-3col">

            {/* ══ LEFT: Supplier + PO Details ══ */}
            <div>
              {/* Supplier */}
              <div className="g-card" style={{animationDelay:"0ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">🏭</div>Supplier</div>
                  {supplier && <button style={{fontSize:10.5,fontWeight:700,color:"var(--gold)",background:"none",border:"1px solid var(--goldbr)",borderRadius:5,padding:"3px 9px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .13s"}} onClick={()=>setShowSupModal(true)}>Change</button>}
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
                            {supplier.city&&supplier.city!=="—"&&<span className="sup-tag">📍 {supplier.city}</span>}
                            {supplier.category&&supplier.category!=="—"&&<span className="sup-tag">{supplier.category}</span>}
                            {supplier.preferred&&<span style={{fontSize:"8.5px",fontWeight:800,padding:"2px 7px",borderRadius:20,background:"var(--goldbg)",border:"1px solid var(--goldbr)",color:"var(--gold)"}}>★ Preferred</span>}
                          </div>
                        </div>
                      </div>
                      <div className="sup-details">
                        {[
                          ["Code",     supplier.code],
                          ["Contact",  supplier.contactName],
                          ["Phone",    supplier.phone],
                          ["Email",    supplier.email],
                          ["Country",  supplier.country],
                          ["Currency", supplier.currency],
                        ].map(([l,v])=>v&&v!=="—"?(
                          <div key={l} className="sup-detail-row">
                            <span className="sup-detail-lbl">{l}</span>
                            <span className="sup-detail-val">{v}</span>
                          </div>
                        ):null)}
                      </div>
                      <button className="sup-change-btn" onClick={()=>setShowSupModal(true)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Change Supplier
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* PO Details */}
              <div className="g-card" style={{animationDelay:"40ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">📋</div>PO Details</div></div>
                <div className="g-card-body" style={{padding:"14px"}}>

                  {/* PO Number - readonly */}
                  <div className="g-field">
                    <label className="g-label">PO Number <span className="g-req">✦</span></label>
                    <input className="g-input" value={poNo} readOnly />
                  </div>

                  <div className="g-grid-2" style={{marginBottom:11}}>
                    <div>
                      <label className="g-label">PO Date <span className="g-req">✦</span></label>
                      <input type="date" className="g-input g-mono" value={form.poDate} onChange={e=>setF("poDate",e.target.value)}/>
                    </div>
                    <div>
                      <label className="g-label">Expected Delivery <span className="g-req">✦</span></label>
                      <input type="date" className="g-input g-mono" value={form.deliveryDate} onChange={e=>setF("deliveryDate",e.target.value)}/>
                    </div>
                  </div>

                  <div className="g-field">
                    <label className="g-label">Delivery Location <span className="g-req">✦</span></label>
                    <div className="g-sel-wrap">
                      <select className="g-select" value={form.deliveryLocation} onChange={e=>setF("deliveryLocation",e.target.value)}>
                        {DELIVERY_LOCS.map(l=><option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="g-grid-2" style={{marginBottom:11}}>
                    <div>
                      <label className="g-label">Payment Terms</label>
                      <div className="g-sel-wrap">
                        <select className="g-select" value={form.paymentTerms} onChange={e=>setF("paymentTerms",e.target.value)}>
                          {PAYMENT_TERMS.map(t=><option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="g-label">Currency</label>
                      <div className="g-sel-wrap">
                        <select className="g-select" value={form.currency} onChange={e=>setF("currency",e.target.value)}>
                          {CURRENCIES.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="g-field">
                    <label className="g-label">Quotation / RFQ Ref</label>
                    <input className="g-input g-mono" placeholder="QUO-2026-XXX" value={form.quotationRef} onChange={e=>setF("quotationRef",e.target.value)}/>
                  </div>

                  <div className="g-field">
                    <label className="g-label">External Reference</label>
                    <input className="g-input g-mono" placeholder="e.g. Supplier's ref no." value={form.reference} onChange={e=>setF("reference",e.target.value)}/>
                  </div>

                  <div className="g-field">
                    <label className="g-label">Special Instructions</label>
                    <textarea className="g-textarea" placeholder="Packing, labelling, or delivery instructions…" value={form.specialInstructions} onChange={e=>setF("specialInstructions",e.target.value)} rows={3}/>
                  </div>

                  <div className="g-field" style={{marginBottom:0}}>
                    <label className="g-label">Internal Notes</label>
                    <textarea className="g-textarea" placeholder="Internal only — not shown on printed PO…" value={form.internalNotes} onChange={e=>setF("internalNotes",e.target.value)} rows={2}/>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ MIDDLE: Items + Terms ══ */}
            <div>
              {/* Items Table */}
              <div className="g-card" style={{animationDelay:"20ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">📦</div>Order Items</div>
                  <span style={{fontSize:10.5,color:"var(--ink40)",fontFamily:"'Geist Mono',monospace"}}>{items.length} line{items.length!==1?"s":""} · {fmt(totalQty)} units</span>
                </div>

                {/* Table head */}
                <div className="items-thead">
                  <div className="items-th">#</div>
                  <div className="items-th">Description</div>
                  <div className="items-th">SKU</div>
                  <div className="items-th">Qty</div>
                  <div className="items-th">Unit</div>
                  <div className="items-th">Unit Price</div>
                  <div className="items-th">Disc %</div>
                  <div className="items-th r">Line Total</div>
                  <div className="items-th"></div>
                </div>

                {/* Rows */}
                {items.map((it,i)=>(
                  <div key={it.id} className="item-row" style={{animationDelay:`${i*22}ms`}}>
                    <div className="item-num">{String(i+1).padStart(2,"0")}</div>
                    {/* Description */}
                    <div style={{paddingRight:6,display:"flex",alignItems:"center",gap:5}}>
                      {it.icon&&<span style={{fontSize:14,flexShrink:0}}>{it.icon}</span>}
                      <input className="item-inp" placeholder="Item description…" value={it.description} onChange={e=>updateItem(it.id,"description",e.target.value)}/>
                    </div>
                    {/* SKU */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" placeholder="SKU" value={it.sku} onChange={e=>updateItem(it.id,"sku",e.target.value)} style={{fontSize:10.5,color:"var(--ink50)"}}/>
                    </div>
                    {/* Qty */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" type="number" min="0" placeholder="0" value={it.qty} onChange={e=>updateItem(it.id,"qty",e.target.value)} style={{textAlign:"right"}}/>
                    </div>
                    {/* Unit */}
                    <div className="item-sel-w">
                      <select className="item-sel" value={it.unit} onChange={e=>updateItem(it.id,"unit",e.target.value)}>
                        {UNITS.map(u=><option key={u}>{u}</option>)}
                      </select>
                    </div>
                    {/* Unit Price */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" type="number" min="0" step="0.01" placeholder="0.00" value={it.unitPrice} onChange={e=>updateItem(it.id,"unitPrice",e.target.value)} style={{textAlign:"right"}}/>
                    </div>
                    {/* Discount */}
                    <div style={{paddingRight:4}}>
                      <input className="item-inp mono" type="number" min="0" max="100" placeholder="0" value={it.discount} onChange={e=>updateItem(it.id,"discount",e.target.value)} style={{textAlign:"right"}}/>
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
                  <button className="add-item-btn" onClick={addBlank}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Line
                  </button>
                  <button className="add-prod-btn" onClick={()=>setShowProdModal(true)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Browse Products
                  </button>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="g-card" style={{animationDelay:"60ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">📝</div>Terms & Conditions</div></div>
                <div className="g-card-body">
                  <div className="terms-row">
                    <div>
                      <label className="g-label">Warranty Terms</label>
                      <input className="g-input" placeholder="e.g. 12-month manufacturer warranty" value={form.warrantyTerms} onChange={e=>setF("warrantyTerms",e.target.value)}/>
                    </div>
                    <div>
                      <label className="g-label">Billing Address</label>
                      <input className="g-input" placeholder="If different from default" value={form.billingAddress} onChange={e=>setF("billingAddress",e.target.value)}/>
                    </div>
                  </div>
                  <div style={{padding:"11px 13px",background:"var(--ink03)",border:"1px solid var(--ink10)",borderRadius:7,fontSize:11,color:"var(--ink40)",lineHeight:1.7}}>
                    <strong style={{color:"var(--ink70)",fontSize:10,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase"}}>Standard Terms</strong><br/>
                    All goods must be delivered by the specified date. Supplier must provide packing list and invoice with each delivery. Payment will be processed as per agreed terms upon receipt of satisfactory goods and documentation.
                  </div>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: Summary + Checklist + Actions ══ */}
            <div style={{position:"sticky",top:70}}>
              {/* Summary */}
              <div className="g-card" style={{animationDelay:"30ms"}}>
                <div className="g-card-head">
                  <div className="g-card-title"><div className="g-title-icon">💰</div>Summary</div>
                  <span style={{fontFamily:"'Geist Mono',monospace",fontSize:10,color:"var(--ink40)",fontWeight:600}}>{form.currency}</span>
                </div>
                <div className="g-card-body" style={{padding:"14px"}}>
                  <div className="sum-row"><span className="sum-lbl">Lines</span><span className="sum-val">{items.filter(it=>it.description).length}</span></div>
                  <div className="sum-row"><span className="sum-lbl">Total Qty</span><span className="sum-val">{fmt(totalQty)} units</span></div>
                  <div className="sum-row"><span className="sum-lbl">Subtotal</span><span className="sum-val">{fmt(subtotal)}</span></div>
                  <div className="sum-disc-row">
                    <span className="sum-lbl" style={{fontSize:12,color:"var(--ink50)",fontWeight:500}}>Overall Disc.</span>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <input className="sum-disc-inp" type="number" min="0" max="100" step="0.5" value={overallDisc} onChange={e=>setOverallDisc(e.target.value)} placeholder="0"/>
                      <span style={{fontFamily:"'Geist Mono',monospace",fontSize:11,color:"var(--ink40)",fontWeight:600}}>%</span>
                    </div>
                  </div>
                  {overallDiscAmt > 0 && <div className="sum-row" style={{color:"var(--red)"}}><span className="sum-lbl">Discount</span><span className="sum-val" style={{color:"var(--red)"}}>−{fmt(overallDiscAmt)}</span></div>}
                  <div className="sum-row"><span className="sum-lbl">Tax</span><span className="sum-val">{fmt(totalTax)}</span></div>
                  <div className="sum-total-box">
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
                  <div style={{marginTop:12,height:4,borderRadius:4,background:"var(--ink10)",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(checkDone/checklist.length)*100}%`,background:checkDone===checklist.length?"var(--green)":"var(--gold)",borderRadius:4,transition:"width .4s ease"}}/>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="g-card" style={{animationDelay:"90ms"}}>
                <div className="g-card-head"><div className="g-card-title"><div className="g-title-icon">⚡</div>Actions</div></div>
                <div className="g-card-body" style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:7}}>
                  {[
                    { label:"Save Draft",    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>, fn:()=>showToast("Draft saved"),       color:"var(--ink10)", textColor:"var(--ink50)", border:"var(--ink10)" },
                    { label:"Print PO",      icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>, fn:()=>showToast("Print preview opened"), color:"var(--ink10)", textColor:"var(--ink50)", border:"var(--ink10)" },
                    { label:"Send to Supplier", icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>, fn:handleSend,          color:"var(--bluebg)", textColor:"var(--blue)", border:"var(--bluebr)" },
                    { label:"Approve PO",    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>, fn:handleApprove,        color:"var(--greenbg)", textColor:"var(--green)", border:"var(--greenbr)" },
                  ].map(a=>(
                    <button key={a.label} onClick={a.fn} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 12px",borderRadius:7,border:`1.5px solid ${a.border}`,background:a.color,color:a.textColor,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'DM Sans',sans-serif",transition:"all .14s",width:"100%"}}>
                      {a.icon}{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ACTION BAR */}
        <div className="po-action-bar">
          <div className="action-info">
            <span>PO · <strong>{poNo}</strong></span>
            {supplier&&<span>Supplier: <strong>{supplier.name.split(" ").slice(0,2).join(" ")}</strong></span>}
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
            <button className="btn-send" onClick={handleSend}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send to Supplier
            </button>
            <button className="btn-approve" onClick={handleApprove}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Approve PO
            </button>
          </div>
        </div>

        {/* TOAST */}
        {toast && <div className="po-toast"><div className="toast-dot"/>{toast}</div>}
      </div>
    </>
  );
}