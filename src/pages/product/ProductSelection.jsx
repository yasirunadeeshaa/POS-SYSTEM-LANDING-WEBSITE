import { useState, useMemo, useRef, useEffect, useCallback } from "react";

// ── Sample Data ───────────────────────────────────────────────────────────────
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
  { id: 11, name: "Bamboo Desk Organiser",     sku: "BDO-119", icon: "🪴", category: "Stationery",  brand: "Generic",  price: 22.99, cost: 9.50,  stock: 8,  tax: 5  },
  { id: 12, name: "Running Socks 3-Pack",      sku: "RSS-062", icon: "🧦", category: "Sports",      brand: "Generic",  price: 11.99, cost: 3.20,  stock: 55, tax: 5  },
  { id: 14, name: "Mechanical Keyboard TKL",   sku: "MKT-509", icon: "⌨",  category: "Electronics", brand: "Logitech", price: 89.99, cost: 42.00, stock: 6,  tax: 18 },
  { id: 15, name: "Linen Throw Blanket",       sku: "LTB-883", icon: "🛋", category: "Home",        brand: "OEM",      price: 28.99, cost: 11.00, stock: 16, tax: 5  },
  { id: 16, name: "Portable Charger 20000mAh", sku: "PCH-392", icon: "🔋", category: "Electronics", brand: "Anker",    price: 49.99, cost: 21.00, stock: 12, tax: 18 },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];
const BRANDS     = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.brand))).sort()];

const CAT_COLORS = {
  Electronics: { color:"#2B5490", bg:"rgba(43,84,144,.1)",  border:"rgba(43,84,144,.22)"  },
  Apparel:     { color:"#5B3D8F", bg:"rgba(91,61,143,.1)",  border:"rgba(91,61,143,.22)"  },
  Accessories: { color:"#B8902A", bg:"rgba(184,144,42,.1)", border:"rgba(184,144,42,.22)" },
  Home:        { color:"#7A5C1E", bg:"rgba(122,92,30,.1)",  border:"rgba(122,92,30,.2)"   },
  Lifestyle:   { color:"#2D6A4F", bg:"rgba(45,106,79,.1)",  border:"rgba(45,106,79,.2)"   },
  Stationery:  { color:"#6B5F54", bg:"rgba(107,95,84,.1)",  border:"rgba(107,95,84,.2)"   },
  Sports:      { color:"#B5372A", bg:"rgba(181,55,42,.1)",  border:"rgba(181,55,42,.2)"   },
};

const fmt = n => Number(n||0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2});

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Geist+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  :root{
    --cream:#F6F3EC; --paper:#FDFBF7; --warm:#F0EBE0; --warm2:#E8E2D4;
    --ink:#1B1713; --ink60:#4B4038; --ink50:#6B5F54;
    --ink40:#9E9080; --ink30:#B8AFA4; --ink20:#CFC8BC; --ink10:#E4DDD2;
    --ink06:#EDE8E0; --ink03:#F5F1EB;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenl:#3D8A65;
    --greenbg:rgba(45,106,79,.07); --greenbr:rgba(45,106,79,.22);
    --red:#B5372A; --redbg:rgba(181,55,42,.07); --redbr:rgba(181,55,42,.2);
    --shadow-md:0 8px 32px rgba(27,23,19,.14),0 2px 8px rgba(27,23,19,.07);
    --shadow-lg:0 24px 64px rgba(27,23,19,.22),0 6px 20px rgba(27,23,19,.1);
  }

  @keyframes overlayIn { from{opacity:0}                                        to{opacity:1}              }
  @keyframes modalIn   { from{opacity:0;transform:scale(.97) translateY(16px)}  to{opacity:1;transform:none} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(6px)}              to{opacity:1;transform:none} }
  @keyframes popIn     { from{opacity:0;transform:scale(.88)}                   to{opacity:1;transform:scale(1)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(8px)}              to{opacity:1;transform:none} }

  /* ── Overlay ── */
  .psm-overlay{
    position:fixed;inset:0;
    background:rgba(27,23,19,.55);
    backdrop-filter:blur(3px);
    z-index:500;
    display:flex;align-items:center;justify-content:center;
    padding:20px;
    animation:overlayIn .2s ease;
  }

  /* ── Modal shell ── */
  .psm-shell{
    background:var(--cream);
    border:1px solid var(--ink10);
    border-radius:18px;
    width:100%;max-width:960px;
    height:min(88vh,700px);
    display:flex;flex-direction:column;
    box-shadow:var(--shadow-lg);
    animation:modalIn .28s cubic-bezier(.16,1,.3,1);
    font-family:'Outfit',sans-serif;
    overflow:hidden;
  }

  /* ── Header ── */
  .psm-head{
    background:var(--ink);
    border-bottom:1px solid rgba(184,144,42,.3);
    padding:18px 24px 16px;
    flex-shrink:0;
    position:relative;
  }
  .psm-head::after{
    content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,var(--goldl) 30%,var(--gold) 70%,transparent);
    opacity:.4;
  }
  .psm-head-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px;}
  .psm-eyebrow{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(184,144,42,.7);margin-bottom:4px;display:flex;align-items:center;gap:7px;}
  .psm-eyebrow::before{content:'';width:14px;height:1px;background:var(--gold);opacity:.5;}
  .psm-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:#F6F3EC;line-height:1;}
  .psm-close{
    width:32px;height:32px;border-radius:8px;flex-shrink:0;
    background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.1);
    color:rgba(246,243,236,.4);cursor:pointer;font-size:18px;
    display:flex;align-items:center;justify-content:center;
    transition:all .15s;
  }
  .psm-close:hover{background:rgba(246,243,236,.12);color:rgba(246,243,236,.88);}

  /* Search bar */
  .psm-search-row{display:flex;gap:10px;align-items:center;}
  .psm-search-wrap{position:relative;flex:1;}
  .psm-search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;color:rgba(246,243,236,.25);pointer-events:none;}
  .psm-search{
    width:100%;padding:10px 36px 10px 38px;
    background:rgba(246,243,236,.06);
    border:1.5px solid rgba(246,243,236,.1);
    border-radius:9px;
    font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:500;
    color:#F6F3EC;outline:none;transition:all .18s;
  }
  .psm-search::placeholder{color:rgba(246,243,236,.25);}
  .psm-search:focus{border-color:rgba(184,144,42,.5);background:rgba(246,243,236,.09);box-shadow:0 0 0 3px rgba(184,144,42,.12);}
  .psm-search-clear{
    position:absolute;right:10px;top:50%;transform:translateY(-50%);
    width:20px;height:20px;border-radius:50%;
    background:rgba(246,243,236,.1);border:none;
    color:rgba(246,243,236,.4);cursor:pointer;font-size:12px;
    display:flex;align-items:center;justify-content:center;transition:all .14s;
  }
  .psm-search-clear:hover{background:rgba(246,243,236,.2);color:#F6F3EC;}

  /* Filter pills */
  .psm-filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;}
  .psm-filter-pill{
    padding:5px 12px;border-radius:20px;
    font-size:11.5px;font-weight:700;cursor:pointer;
    border:1.5px solid rgba(246,243,236,.1);
    background:rgba(246,243,236,.05);
    color:rgba(246,243,236,.4);
    transition:all .15s;white-space:nowrap;
  }
  .psm-filter-pill:hover{background:rgba(246,243,236,.1);color:rgba(246,243,236,.75);}
  .psm-filter-pill.active{background:rgba(184,144,42,.18);border-color:rgba(184,144,42,.45);color:var(--goldl);}

  /* Brand mini-filter */
  .psm-brand-pill{
    padding:4px 10px;border-radius:20px;
    font-size:10.5px;font-weight:700;cursor:pointer;
    border:1.5px solid rgba(246,243,236,.08);
    background:transparent;color:rgba(246,243,236,.3);
    transition:all .14s;
  }
  .psm-brand-pill:hover{border-color:rgba(246,243,236,.18);color:rgba(246,243,236,.65);}
  .psm-brand-pill.active{background:rgba(184,144,42,.15);border-color:rgba(184,144,42,.4);color:var(--goldl);}

  /* ── Body ── */
  .psm-body{
    flex:1;display:grid;
    grid-template-columns:1fr 300px;
    overflow:hidden;
  }

  /* ── Product grid ── */
  .psm-grid-wrap{
    overflow-y:auto;padding:18px 18px 24px;
    display:flex;flex-direction:column;gap:14px;
    border-right:1px solid var(--ink10);
  }
  .psm-grid-wrap::-webkit-scrollbar{width:3px;}
  .psm-grid-wrap::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px;}

  /* Results bar */
  .psm-results-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;}
  .psm-count{font-size:11.5px;color:var(--ink40);font-weight:600;}
  .psm-count strong{color:var(--ink60);}
  .psm-sort-wrap{display:flex;align-items:center;gap:7px;}
  .psm-sort-label{font-size:10.5px;color:var(--ink40);font-weight:600;}
  .psm-sort-select{padding:5px 28px 5px 10px;background:var(--paper);border:1.5px solid var(--ink10);border-radius:7px;font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:600;color:var(--ink60);outline:none;appearance:none;cursor:pointer;transition:all .15s;}
  .psm-sort-select:focus{border-color:var(--gold);}
  .psm-sort-sel-wrap{position:relative;}
  .psm-sort-arr{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:8px;color:var(--ink30);pointer-events:none;}

  /* View toggle */
  .psm-view-tog{display:flex;border:1.5px solid var(--ink10);border-radius:7px;overflow:hidden;}
  .psm-view-btn{padding:5px 10px;background:transparent;border:none;color:var(--ink30);cursor:pointer;font-size:13px;transition:all .14s;display:flex;align-items:center;}
  .psm-view-btn:hover{background:var(--warm);color:var(--ink50);}
  .psm-view-btn.active{background:var(--ink);color:var(--goldl);}

  /* Product grid cards */
  .psm-prod-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(162px,1fr));gap:10px;}
  .psm-prod-card{
    background:var(--paper);border:1.5px solid var(--ink10);
    border-radius:11px;padding:13px;cursor:pointer;
    transition:all .2s cubic-bezier(.16,1,.3,1);
    display:flex;flex-direction:column;gap:10px;
    position:relative;overflow:hidden;
    animation:fadeUp .25s ease both;
  }
  .psm-prod-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--cat-c,transparent);opacity:0;transition:opacity .18s;}
  .psm-prod-card:hover{background:#fff;border-color:var(--ink20);box-shadow:var(--shadow-md);transform:translateY(-2px);}
  .psm-prod-card:hover::before{opacity:1;}
  .psm-prod-card.selected{border-color:var(--gold);background:var(--goldbg);box-shadow:0 0 0 2px rgba(184,144,42,.18);}
  .psm-prod-card.selected::before{opacity:1;background:var(--gold);}
  .psm-prod-card.out{opacity:.55;cursor:not-allowed;}
  .psm-prod-card.out:hover{transform:none;box-shadow:none;}

  .psm-card-icon-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
  .psm-card-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0;transition:transform .18s;}
  .psm-prod-card:hover .psm-card-icon{transform:scale(1.06);}
  .psm-prod-card.selected .psm-card-icon{background:rgba(184,144,42,.14);border-color:var(--goldbr);}

  .psm-qty-badge{
    width:22px;height:22px;border-radius:50%;
    background:var(--gold);color:#fff;
    font-size:11px;font-weight:700;
    display:flex;align-items:center;justify-content:center;
    animation:popIn .2s cubic-bezier(.16,1,.3,1);
    flex-shrink:0;
  }
  .psm-card-cat{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;display:inline-flex;align-items:center;}
  .psm-card-name{font-size:12.5px;font-weight:700;color:var(--ink);line-height:1.3;}
  .psm-card-sku{font-family:'Geist Mono',monospace;font-size:10px;color:var(--gold);margin-bottom:1px;}
  .psm-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:auto;}
  .psm-card-price{font-family:'Geist Mono',monospace;font-size:14px;font-weight:700;color:var(--ink);}
  .psm-stock-badge{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:20px;}

  /* ── Table view ── */
  .psm-tbl{width:100%;border-collapse:collapse;}
  .psm-tbl thead th{padding:8px 12px;text-align:left;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40);background:var(--warm);border-bottom:1px solid var(--ink10);white-space:nowrap;}
  .psm-tbl-row{border-bottom:1px solid var(--ink03);cursor:pointer;transition:background .12s;}
  .psm-tbl-row:last-child{border-bottom:none;}
  .psm-tbl-row:hover{background:var(--warm);}
  .psm-tbl-row.selected{background:var(--goldbg);}
  .psm-tbl-row td{padding:10px 12px;vertical-align:middle;}
  .psm-tbl-check{width:16px;height:16px;border-radius:4px;border:1.5px solid var(--ink10);background:transparent;cursor:pointer;appearance:none;transition:all .14s;flex-shrink:0;}
  .psm-tbl-check:checked{background:var(--gold);border-color:var(--gold);}

  /* Empty */
  .psm-empty{padding:48px 24px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;}
  .psm-empty-ico{font-size:44px;opacity:.25;}
  .psm-empty-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink40);}
  .psm-empty-sub{font-size:12px;color:var(--ink30);max-width:240px;line-height:1.6;}

  /* ── Cart sidebar ── */
  .psm-cart{
    display:flex;flex-direction:column;overflow:hidden;
    background:var(--paper);
  }
  .psm-cart-head{
    padding:14px 18px 13px;
    background:linear-gradient(180deg,#fff 0%,rgba(253,251,247,.6) 100%);
    border-bottom:1px solid var(--ink10);
    flex-shrink:0;
    display:flex;align-items:center;justify-content:space-between;
  }
  .psm-cart-title{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:var(--ink);}
  .psm-cart-badge{
    padding:3px 10px;border-radius:20px;
    font-size:10px;font-weight:700;
    background:var(--goldbg);border:1px solid var(--goldbr);color:var(--gold);
  }
  .psm-cart-items{flex:1;overflow-y:auto;padding:10px 14px;}
  .psm-cart-items::-webkit-scrollbar{width:3px;}
  .psm-cart-items::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:3px;}

  /* Cart item row */
  .psm-cart-item{
    display:flex;align-items:center;gap:10px;
    padding:9px 0;border-bottom:1px solid var(--ink06);
    animation:slideIn .18s ease both;
  }
  .psm-cart-item:last-child{border-bottom:none;}
  .psm-ci-icon{width:32px;height:32px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:16px;background:var(--warm2);border:1px solid var(--ink10);flex-shrink:0;}
  .psm-ci-name{font-size:12px;font-weight:700;color:var(--ink);line-height:1.3;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px;}
  .psm-ci-sku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--gold);}
  .psm-ci-price{font-family:'Geist Mono',monospace;font-size:11.5px;font-weight:700;color:var(--ink);text-align:right;white-space:nowrap;}
  .psm-ci-subtotal{font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink40);text-align:right;}

  /* Qty controls */
  .psm-qty-row{display:flex;align-items:center;gap:5px;}
  .psm-qty-btn{
    width:22px;height:22px;border-radius:5px;
    background:var(--warm2);border:1px solid var(--ink10);
    color:var(--ink50);font-size:13px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all .13s;line-height:1;
  }
  .psm-qty-btn:hover{background:var(--ink);color:#fff;border-color:var(--ink);}
  .psm-qty-val{
    min-width:26px;text-align:center;
    font-family:'Geist Mono',monospace;font-size:12px;font-weight:700;color:var(--ink);
    padding:3px 4px;
    background:var(--paper);border:1.5px solid var(--ink10);border-radius:5px;
    outline:none;transition:border-color .14s;
  }
  .psm-qty-val:focus{border-color:var(--gold);}
  .psm-ci-remove{
    width:22px;height:22px;border-radius:5px;flex-shrink:0;
    background:transparent;border:1px solid transparent;
    color:var(--ink30);cursor:pointer;font-size:12px;
    display:flex;align-items:center;justify-content:center;
    transition:all .13s;
  }
  .psm-ci-remove:hover{background:var(--redbg);border-color:var(--redbr);color:var(--red);}

  /* Cart empty */
  .psm-cart-empty{
    flex:1;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:10px;padding:24px;text-align:center;
  }
  .psm-cart-empty-ico{font-size:36px;opacity:.2;}
  .psm-cart-empty-msg{font-size:12.5px;color:var(--ink30);font-weight:600;line-height:1.5;}

  /* Cart footer */
  .psm-cart-footer{
    padding:14px 18px;border-top:1px solid var(--ink10);
    background:var(--paper);flex-shrink:0;
  }
  .psm-totals-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;}
  .psm-totals-label{font-size:11.5px;color:var(--ink50);font-weight:500;}
  .psm-totals-val{font-family:'Geist Mono',monospace;font-size:12.5px;font-weight:700;color:var(--ink);}
  .psm-grand-row{
    display:flex;justify-content:space-between;align-items:center;
    padding:11px 14px;margin:10px 0 12px;
    background:var(--ink);border-radius:9px;
  }
  .psm-grand-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(246,243,236,.4);}
  .psm-grand-val{font-family:'Geist Mono',monospace;font-size:19px;font-weight:700;color:var(--goldl);}

  /* Buttons */
  .psm-btn{
    display:inline-flex;align-items:center;justify-content:center;gap:7px;
    padding:10px 18px;border-radius:8px;
    font-size:13px;font-weight:700;cursor:pointer;
    font-family:'Outfit',sans-serif;border:1px solid transparent;
    transition:all .2s;width:100%;
  }
  .psm-btn-gold{background:var(--gold);border-color:var(--goldd);color:#fff;box-shadow:0 2px 10px rgba(184,144,42,.3);}
  .psm-btn-gold:hover{background:var(--goldl);box-shadow:0 4px 16px rgba(184,144,42,.4);transform:translateY(-1px);}
  .psm-btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
  .psm-btn-ghost{background:transparent;border-color:var(--ink10);color:var(--ink50);}
  .psm-btn-ghost:hover{border-color:var(--ink20);color:var(--ink60);background:var(--warm);}

  @media(max-width:780px){
    .psm-body{grid-template-columns:1fr;}
    .psm-cart{border-top:1px solid var(--ink10);max-height:260px;}
    .psm-prod-grid{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));}
  }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ProductSelectionModal({ onClose, onConfirm, initialCart = [] }) {
  const [search,   setSearch]   = useState("");
  const [catFilter,setCatFilter]= useState("All");
  const [brandFilter,setBrandFilter] = useState("All");
  const [sortKey,  setSortKey]  = useState("name");
  const [view,     setView]     = useState("grid");   // grid | table
  const [cart,     setCart]     = useState(initialCart);
  const searchRef = useRef();

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // ── Filtered products ──
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)  ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
    if (catFilter   !== "All") list = list.filter(p => p.category === catFilter);
    if (brandFilter !== "All") list = list.filter(p => p.brand    === brandFilter);
    list.sort((a, b) => {
      if (sortKey === "price-asc")  return a.price - b.price;
      if (sortKey === "price-desc") return b.price - a.price;
      if (sortKey === "stock")      return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [search, catFilter, brandFilter, sortKey]);

  // ── Cart helpers ──
  const cartItem = useCallback(pid => cart.find(i => i.productId === pid), [cart]);

  const addProduct = useCallback(prod => {
    if (prod.stock === 0) return;
    setCart(prev => {
      const ex = prev.find(i => i.productId === prod.id);
      if (ex) return prev.map(i => i.productId === prod.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        productId: prod.id, name: prod.name, sku: prod.sku,
        icon: prod.icon, unitPrice: prod.price, tax: prod.tax,
        qty: 1, discount: 0,
      }];
    });
  }, []);

  const removeProduct = useCallback(pid => {
    setCart(prev => prev.filter(i => i.productId !== pid));
  }, []);

  const updateQty = useCallback((pid, val) => {
    const q = Math.max(1, parseInt(val) || 1);
    setCart(prev => prev.map(i => i.productId === pid ? { ...i, qty: q } : i));
  }, []);

  const toggleProduct = useCallback(prod => {
    if (prod.stock === 0) return;
    const ex = cart.find(i => i.productId === prod.id);
    if (ex) removeProduct(prod.id);
    else addProduct(prod);
  }, [cart, addProduct, removeProduct]);

  // ── Totals ──
  const totals = useMemo(() => {
    const items    = cart.reduce((s,i) => s + i.qty, 0);
    const subtotal = cart.reduce((s,i) => s + i.unitPrice * i.qty, 0);
    const tax      = cart.reduce((s,i) => s + (i.unitPrice * i.qty * i.tax / 100), 0);
    return { items, subtotal, tax, grand: subtotal + tax };
  }, [cart]);

  const handleConfirm = () => {
    onConfirm?.(cart);
    onClose();
  };

  // ── Stock badge ──
  const StockBadge = ({ stock }) => {
    if (stock === 0) return <span className="psm-stock-badge" style={{ background:"var(--redbg)", color:"var(--red)", border:"1px solid var(--redbr)" }}>Out</span>;
    if (stock <= 10) return <span className="psm-stock-badge" style={{ background:"var(--goldbg)", color:"var(--gold)", border:"1px solid var(--goldbr)" }}>{stock} left</span>;
    return <span className="psm-stock-badge" style={{ background:"var(--greenbg)", color:"var(--green)", border:"1px solid var(--greenbr)" }}>{stock}</span>;
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="psm-overlay" onClick={onClose}>
        <div className="psm-shell" onClick={e => e.stopPropagation()}>

          {/* ══ HEADER ══ */}
          <div className="psm-head">
            <div className="psm-head-row">
              <div>
                <div className="psm-eyebrow">Inventory · Products</div>
                <div className="psm-title">Select Products</div>
              </div>
              <button className="psm-close" onClick={onClose}>×</button>
            </div>

            {/* Search */}
            <div className="psm-search-row">
              <div className="psm-search-wrap">
                <span className="psm-search-ico">⌕</span>
                <input
                  ref={searchRef}
                  className="psm-search"
                  placeholder="Search by product name, SKU or category…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button className="psm-search-clear" onClick={() => setSearch("")}>×</button>
                )}
              </div>

              {/* View toggle */}
              <div className="psm-view-tog">
                <button className={`psm-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid view">⊞</button>
                <button className={`psm-view-btn${view === "table" ? " active" : ""}`} onClick={() => setView("table")} title="Table view">☰</button>
              </div>
            </div>

            {/* Category filters */}
            <div className="psm-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`psm-filter-pill${catFilter === cat ? " active" : ""}`}
                  onClick={() => setCatFilter(cat)}
                >{cat}</button>
              ))}
              <div style={{ width:1, background:"rgba(246,243,236,.1)", alignSelf:"stretch", margin:"0 4px" }} />
              {BRANDS.map(b => (
                <button
                  key={b}
                  className={`psm-brand-pill${brandFilter === b ? " active" : ""}`}
                  onClick={() => setBrandFilter(b)}
                >{b}</button>
              ))}
            </div>
          </div>

          {/* ══ BODY ══ */}
          <div className="psm-body">

            {/* ── Product Grid / Table ── */}
            <div className="psm-grid-wrap">

              {/* Results bar */}
              <div className="psm-results-bar">
                <span className="psm-count">
                  Showing <strong>{filtered.length}</strong> of <strong>{PRODUCTS.length}</strong> products
                  {catFilter !== "All" && ` · ${catFilter}`}
                </span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span className="psm-sort-label">Sort</span>
                  <div className="psm-sort-sel-wrap">
                    <select className="psm-sort-select" value={sortKey} onChange={e => setSortKey(e.target.value)}>
                      <option value="name">Name A–Z</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="stock">Stock ↓</option>
                    </select>
                    <span className="psm-sort-arr">▾</span>
                  </div>
                </div>
              </div>

              {/* ── GRID VIEW ── */}
              {view === "grid" && (
                filtered.length === 0 ? (
                  <div className="psm-empty">
                    <div className="psm-empty-ico">🔍</div>
                    <div className="psm-empty-title">No products found</div>
                    <div className="psm-empty-sub">Try a different search term or clear the category filter</div>
                    <button
                      style={{ marginTop:4, padding:"7px 16px", borderRadius:7, border:"1.5px solid var(--ink10)", background:"transparent", color:"var(--ink50)", cursor:"pointer", fontSize:12.5, fontWeight:700 }}
                      onClick={() => { setSearch(""); setCatFilter("All"); setBrandFilter("All"); }}
                    >Clear filters</button>
                  </div>
                ) : (
                  <div className="psm-prod-grid">
                    {filtered.map((p, i) => {
                      const ci = cartItem(p.id);
                      const catCfg = CAT_COLORS[p.category] || {};
                      return (
                        <div
                          key={p.id}
                          className={`psm-prod-card${ci ? " selected" : ""}${p.stock === 0 ? " out" : ""}`}
                          style={{ "--cat-c": catCfg.color, animationDelay:`${i * 20}ms` }}
                          onClick={() => addProduct(p)}
                        >
                          <div className="psm-card-icon-row">
                            <div className="psm-card-icon">{p.icon}</div>
                            {ci && <div className="psm-qty-badge">{ci.qty}</div>}
                          </div>

                          <div>
                            <div className="psm-card-sku">{p.sku}</div>
                            <div className="psm-card-name">{p.name}</div>
                          </div>

                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, flexWrap:"wrap" }}>
                            <span
                              className="psm-card-cat"
                              style={{ background:catCfg.bg, color:catCfg.color, border:`1px solid ${catCfg.border}` }}
                            >{p.category}</span>
                            <StockBadge stock={p.stock} />
                          </div>

                          <div className="psm-card-bottom">
                            <div className="psm-card-price">${fmt(p.price)}</div>
                            {p.stock === 0 ? (
                              <span style={{ fontSize:10,color:"var(--red)",fontWeight:700 }}>Unavailable</span>
                            ) : (
                              <div style={{
                                width:26, height:26, borderRadius:50,
                                background: ci ? "var(--gold)" : "var(--warm2)",
                                border: `1.5px solid ${ci ? "var(--goldd)" : "var(--ink10)"}`,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                fontSize:14, color: ci ? "#fff" : "var(--ink40)",
                                transition:"all .18s", flexShrink:0,
                              }}>
                                {ci ? "✓" : "+"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* ── TABLE VIEW ── */}
              {view === "table" && (
                filtered.length === 0 ? (
                  <div className="psm-empty">
                    <div className="psm-empty-ico">🔍</div>
                    <div className="psm-empty-title">No products found</div>
                    <div className="psm-empty-sub">Adjust your search or filters</div>
                    <button
                      style={{ marginTop:4, padding:"7px 16px", borderRadius:7, border:"1.5px solid var(--ink10)", background:"transparent", color:"var(--ink50)", cursor:"pointer", fontSize:12.5, fontWeight:700 }}
                      onClick={() => { setSearch(""); setCatFilter("All"); setBrandFilter("All"); }}
                    >Clear filters</button>
                  </div>
                ) : (
                  <div style={{ background:"var(--paper)", border:"1px solid var(--ink10)", borderRadius:10, overflow:"hidden" }}>
                    <table className="psm-tbl">
                      <thead>
                        <tr>
                          <th style={{ width:32 }}></th>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Brand</th>
                          <th style={{ textAlign:"right" }}>Price</th>
                          <th style={{ textAlign:"center" }}>Stock</th>
                          <th style={{ textAlign:"center" }}>Tax</th>
                          <th style={{ width:40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p, i) => {
                          const ci = cartItem(p.id);
                          const catCfg = CAT_COLORS[p.category] || {};
                          return (
                            <tr
                              key={p.id}
                              className={`psm-tbl-row${ci ? " selected" : ""}`}
                              style={{ animationDelay:`${i*15}ms`, animation:"fadeUp .3s ease both", opacity: p.stock===0 ? .5 : 1 }}
                              onClick={() => addProduct(p)}
                            >
                              <td>
                                <input
                                  type="checkbox"
                                  className="psm-tbl-check"
                                  checked={!!ci}
                                  onChange={() => toggleProduct(p)}
                                  onClick={e => e.stopPropagation()}
                                />
                              </td>
                              <td>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div style={{ width:34, height:34, borderRadius:8, background:"var(--warm2)", border:"1px solid var(--ink10)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                                    {p.icon}
                                  </div>
                                  <div>
                                    <div style={{ fontSize:13, fontWeight:700, color:"var(--ink)", marginBottom:1 }}>{p.name}</div>
                                    <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, color:"var(--gold)" }}>{p.sku}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span style={{ padding:"2px 8px", borderRadius:20, fontSize:10.5, fontWeight:700, background:catCfg.bg, color:catCfg.color, border:`1px solid ${catCfg.border}` }}>
                                  {p.category}
                                </span>
                              </td>
                              <td style={{ fontSize:12, color:"var(--ink60)", fontWeight:600 }}>{p.brand}</td>
                              <td style={{ textAlign:"right", fontFamily:"'Geist Mono',monospace", fontSize:13.5, fontWeight:700, color:"var(--ink)" }}>${fmt(p.price)}</td>
                              <td style={{ textAlign:"center" }}><StockBadge stock={p.stock} /></td>
                              <td style={{ textAlign:"center", fontFamily:"'Geist Mono',monospace", fontSize:11.5, color:"var(--ink40)", fontWeight:600 }}>{p.tax}%</td>
                              <td>
                                <div style={{
                                  width:26, height:26, borderRadius:"50%",
                                  background: ci ? "var(--gold)" : "var(--warm2)",
                                  border:`1.5px solid ${ci ? "var(--goldd)" : "var(--ink10)"}`,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  fontSize:13, color: ci ? "#fff" : "var(--ink30)",
                                  transition:"all .18s", cursor:"pointer", margin:"0 auto",
                                }}>
                                  {ci ? "✓" : "+"}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>

            {/* ── CART SIDEBAR ── */}
            <div className="psm-cart">
              <div className="psm-cart-head">
                <div className="psm-cart-title">Selected Items</div>
                {cart.length > 0 && (
                  <span className="psm-cart-badge">{cart.length} product{cart.length > 1 ? "s" : ""}</span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="psm-cart-empty">
                  <div className="psm-cart-empty-ico">🛒</div>
                  <div className="psm-cart-empty-msg">No products selected yet.<br />Click any product to add it.</div>
                </div>
              ) : (
                <div className="psm-cart-items">
                  {cart.map((item, i) => (
                    <div key={item.productId} className="psm-cart-item" style={{ animationDelay:`${i*25}ms` }}>
                      <div className="psm-ci-icon">{item.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="psm-ci-name">{item.name}</div>
                        <div className="psm-ci-sku">{item.sku}</div>
                        <div className="psm-qty-row" style={{ marginTop:5 }}>
                          <button className="psm-qty-btn" onClick={() => item.qty > 1 ? updateQty(item.productId, item.qty - 1) : removeProduct(item.productId)}>−</button>
                          <input
                            className="psm-qty-val"
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => updateQty(item.productId, e.target.value)}
                          />
                          <button className="psm-qty-btn" onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                        <div className="psm-ci-price">${fmt(item.unitPrice)}</div>
                        <div className="psm-ci-subtotal">${fmt(item.unitPrice * item.qty)}</div>
                        <button className="psm-ci-remove" onClick={() => removeProduct(item.productId)} title="Remove">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cart footer */}
              <div className="psm-cart-footer">
                {cart.length > 0 && (
                  <>
                    <div className="psm-totals-row">
                      <span className="psm-totals-label">{totals.items} item{totals.items !== 1 ? "s" : ""}</span>
                      <span className="psm-totals-val">${fmt(totals.subtotal)}</span>
                    </div>
                    <div className="psm-totals-row">
                      <span className="psm-totals-label">Est. Tax</span>
                      <span className="psm-totals-val">${fmt(totals.tax)}</span>
                    </div>
                    <div className="psm-grand-row">
                      <span className="psm-grand-label">Total</span>
                      <span className="psm-grand-val">${fmt(totals.grand)}</span>
                    </div>
                  </>
                )}

                <button
                  className="psm-btn psm-btn-gold"
                  onClick={handleConfirm}
                  disabled={cart.length === 0}
                >
                  ✓ Add {cart.length > 0 ? `${cart.length} Product${cart.length > 1 ? "s" : ""}` : "Products"}
                </button>

                {cart.length > 0 && (
                  <button
                    className="psm-btn psm-btn-ghost"
                    style={{ marginTop:6 }}
                    onClick={() => setCart([])}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>

          </div>{/* end psm-body */}
        </div>
      </div>
    </>
  );
}