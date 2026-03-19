import { useState, useMemo, useRef, useEffect } from "react";
import AddProductModal from "./Addproduct";

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1,  name: "Wireless Earbuds Pro",     sku: "WEP-221", barcode: "8901234567890", category: "Electronics",  brand: "Nexus",    price: 59.99,  cost: 28.00, stock: 18,  minStock: 15, status: "active",   featured: true,  tags: ["wireless","audio","bestseller"], description: "Premium wireless earbuds with active noise cancellation, 30hr battery life and IPX5 water resistance.", images: ["🎧"], supplier: "TechDist Co.", location: "Shelf A-1", sold: 24, trend: +22 },
  { id: 2,  name: "Cotton Crew T-Shirt",       sku: "CCT-089", barcode: "8901234567891", category: "Apparel",      brand: "Generic",  price: 17.99,  cost: 6.50,  stock: 42,  minStock: 30, status: "active",   featured: false, tags: ["cotton","basic","unisex"],      description: "Classic unisex crew neck tee in 100% organic cotton. Pre-shrunk, relaxed fit available in 8 colours.", images: ["👕"], supplier: "FabricWorld",    location: "Shelf C-2", sold: 61, trend: +7  },
  { id: 3,  name: "Leather Wallet Slim",       sku: "LWS-441", barcode: "8901234567892", category: "Accessories",  brand: "Nexus",    price: 24.99,  cost: 9.00,  stock: 9,   minStock: 20, status: "active",   featured: false, tags: ["leather","wallet","slim"],      description: "Genuine full-grain leather bifold wallet with RFID blocking. Holds up to 8 cards.", images: ["👜"], supplier: "Global Imports", location: "Shelf B-3", sold: 38, trend: +14 },
  { id: 4,  name: "Scented Candle Set",        sku: "SCS-112", barcode: "8901234567893", category: "Home",         brand: "OEM",      price: 15.99,  cost: 5.20,  stock: 5,   minStock: 15, status: "active",   featured: false, tags: ["candle","home","gift"],         description: "Set of 3 hand-poured soy wax candles in amber glass vessels. Scents: Cedarwood, Vanilla & Bergamot.", images: ["🕯"], supplier: "HomeGoods Inc.", location: "Shelf D-1", sold: 52, trend: -3  },
  { id: 5,  name: "Stainless Water Bottle",    sku: "SWB-330", barcode: "8901234567894", category: "Lifestyle",    brand: "Nexus",    price: 16.99,  cost: 7.00,  stock: 23,  minStock: 20, status: "active",   featured: true,  tags: ["bottle","eco","insulated"],    description: "Double-wall vacuum insulated 750ml bottle. Keeps cold 24h, hot 12h. BPA-free lid.", images: ["🍶"], supplier: "DirectSource",  location: "Shelf A-4", sold: 45, trend: +11 },
  { id: 6,  name: "Notebook A5 Grid",          sku: "NAG-007", barcode: "8901234567895", category: "Stationery",  brand: "Generic",  price: 5.99,   cost: 1.80,  stock: 67,  minStock: 40, status: "active",   featured: false, tags: ["notebook","grid","a5"],        description: "160-page dot-grid notebook with lay-flat binding, ivory 100gsm paper, and ribbon bookmark.", images: ["📓"], supplier: "Global Imports", location: "Shelf E-2", sold: 89, trend: +5  },
  { id: 7,  name: "USB-C Hub 7-in-1",          sku: "UCH-880", barcode: "8901234567896", category: "Electronics",  brand: "Anker",    price: 44.99,  cost: 19.00, stock: 3,   minStock: 10, status: "active",   featured: false, tags: ["usb","hub","multiport"],       description: "Aluminium 7-in-1 USB-C hub: 4K HDMI, 100W PD, 2× USB-A 3.0, SD/microSD, USB-C data.", images: ["🔌"], supplier: "TechDist Co.", location: "Shelf A-2", sold: 17, trend: +8  },
  { id: 8,  name: "Phone Case iPhone 15",      sku: "PCI-556", barcode: "8901234567897", category: "Accessories",  brand: "Generic",  price: 12.99,  cost: 3.50,  stock: 14,  minStock: 25, status: "active",   featured: false, tags: ["case","iphone","protection"],  description: "Military-grade drop protection with MagSafe compatibility. Frosted matte finish, raised bezels.", images: ["📱"], supplier: "Global Imports", location: "Shelf B-1", sold: 33, trend: -1  },
  { id: 9,  name: "Yoga Mat Pro",              sku: "YMP-203", barcode: "8901234567898", category: "Sports",       brand: "Nexus",    price: 34.99,  cost: 14.00, stock: 11,  minStock: 10, status: "active",   featured: true,  tags: ["yoga","fitness","eco"],        description: "6mm natural rubber yoga mat with alignment lines, carrying strap, and non-slip texture both sides.", images: ["🧘"], supplier: "DirectSource",  location: "Shelf F-1", sold: 28, trend: +18 },
  { id: 10, name: "Ceramic Coffee Mug",        sku: "CCM-445", barcode: "8901234567899", category: "Home",         brand: "OEM",      price: 9.99,   cost: 3.00,  stock: 30,  minStock: 20, status: "active",   featured: false, tags: ["mug","ceramic","kitchen"],     description: "350ml ceramic mug with matte glaze, microwave and dishwasher safe. Available in 6 colours.", images: ["☕"], supplier: "HomeGoods Inc.", location: "Shelf D-3", sold: 41, trend: +2  },
  { id: 11, name: "Bamboo Desk Organiser",     sku: "BDO-119", barcode: "8901234567900", category: "Stationery",  brand: "Generic",  price: 22.99,  cost: 9.50,  stock: 8,   minStock: 12, status: "active",   featured: false, tags: ["bamboo","desk","eco"],         description: "5-compartment bamboo desk organiser. Pen holders, phone slot, and removable dividers.", images: ["🪴"], supplier: "Global Imports", location: "Shelf E-1", sold: 19, trend: +6  },
  { id: 12, name: "Running Socks 3-Pack",      sku: "RSS-062", barcode: "8901234567901", category: "Sports",       brand: "Generic",  price: 11.99,  cost: 3.20,  stock: 55,  minStock: 30, status: "active",   featured: false, tags: ["socks","running","sports"],    description: "Arch support compression socks with moisture-wicking fabric. Sizes S/M/L/XL.", images: ["🧦"], supplier: "FabricWorld",    location: "Shelf F-2", sold: 72, trend: +4  },
  { id: 13, name: "Aroma Diffuser Glass",      sku: "ADG-774", barcode: "8901234567902", category: "Home",         brand: "Nexus",    price: 39.99,  cost: 16.00, stock: 0,   minStock: 8,  status: "archived", featured: false, tags: ["diffuser","aroma","home"],     description: "Ultrasonic glass essential oil diffuser with 7-colour LED, whisper-quiet motor, 300ml tank.", images: ["💨"], supplier: "HomeGoods Inc.", location: "Shelf D-2", sold: 14, trend: -8  },
  { id: 14, name: "Mechanical Keyboard TKL",   sku: "MKT-509", barcode: "8901234567903", category: "Electronics",  brand: "Logitech", price: 89.99,  cost: 42.00, stock: 6,   minStock: 8,  status: "draft",    featured: false, tags: ["keyboard","mechanical","tkl"], description: "Tenkeyless mechanical keyboard with Cherry MX Red switches, PBT keycaps, RGB per-key.", images: ["⌨"], supplier: "TechDist Co.", location: "Shelf A-3", sold: 9,  trend: +30 },
  { id: 15, name: "Linen Throw Blanket",       sku: "LTB-883", barcode: "8901234567904", category: "Home",         brand: "OEM",      price: 28.99,  cost: 11.00, stock: 16,  minStock: 10, status: "active",   featured: false, tags: ["blanket","linen","home"],      description: "Stone-washed linen throw in 130×170cm. Breathable, pre-washed for softness. Oeko-Tex certified.", images: ["🛋"], supplier: "FabricWorld",    location: "Shelf D-4", sold: 22, trend: +9  },
  { id: 16, name: "Portable Charger 20000mAh", sku: "PCH-392", barcode: "8901234567905", category: "Electronics",  brand: "Anker",    price: 49.99,  cost: 21.00, stock: 12,  minStock: 10, status: "active",   featured: true,  tags: ["charger","power","portable"],  description: "20,000mAh power bank with 65W USB-C PD, dual USB-A, LED indicator. Charges laptop, phone simultaneously.", images: ["🔋"], supplier: "TechDist Co.", location: "Shelf A-5", sold: 36, trend: +15 },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category))).sort()];
const STATUS_OPTIONS = ["All", "active", "draft", "archived"];

const fmt = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F6F3EC; --paper: #FDFBF7; --warm: #F0EBE0; --warm2: #E8E2D4;
    --ink: #1B1713; --ink80: #2E2720; --ink60: #4B4038; --ink50: #6B5F54;
    --ink40: #9E9080; --ink30: #B8AFA4; --ink20: #CFC8BC; --ink10: #E4DDD2;
    --ink06: #EDE8E0; --ink03: #F5F1EB;
    --gold: #B8902A; --goldl: #D4A83C; --goldd: #8A6A1A;
    --goldbg: rgba(184,144,42,.07); --goldbr: rgba(184,144,42,.22);
    --green: #2D6A4F; --greenl: #3D8A65;
    --greenbg: rgba(45,106,79,.07); --greenbr: rgba(45,106,79,.22);
    --red: #B5372A; --redbg: rgba(181,55,42,.07); --redbr: rgba(181,55,42,.2);
    --blue: #2B5490; --bluebg: rgba(43,84,144,.07); --bluebr: rgba(43,84,144,.22);
    --purple: #5B3D8F; --purplebg: rgba(91,61,143,.07); --purplebr: rgba(91,61,143,.22);
    --brown: #7A5C1E; --brownbg: rgba(122,92,30,.07); --brownbr: rgba(122,92,30,.2);
    --shadow-xs: 0 1px 2px rgba(27,23,19,.04);
    --shadow-sm: 0 2px 8px rgba(27,23,19,.06), 0 1px 2px rgba(27,23,19,.04);
    --shadow-md: 0 6px 20px rgba(27,23,19,.09), 0 2px 4px rgba(27,23,19,.05);
    --shadow-lg: 0 16px 48px rgba(27,23,19,.14), 0 4px 12px rgba(27,23,19,.08);
    --topbar-h: 60px;
  }

  html, body, #root { height: 100%; background: var(--cream); overflow: hidden; }

  .shell {
    display: flex; flex-direction: column; height: 100vh;
    font-family: 'Outfit', sans-serif; color: var(--ink);
    background: var(--cream);
    background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(184,144,42,.05) 0%, transparent 60%);
  }

  /* ══ TOPBAR ══ */
  .topbar {
    height: var(--topbar-h); flex-shrink: 0;
    background: var(--ink); border-bottom: 1px solid rgba(184,144,42,.35);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; z-index: 100; position: relative;
  }
  .topbar::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--goldl) 30%, var(--gold) 70%, transparent 100%);
    opacity: .4;
  }
  .topbar-left  { display: flex; align-items: center; gap: 24px; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .brand { display: flex; align-items: center; gap: 13px; cursor: default; }
  .brand-mark {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1.5px solid rgba(184,144,42,.45); background: rgba(184,144,42,.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: var(--goldl);
  }
  .brand-text { display: flex; flex-direction: column; gap: 1px; }
  .brand-name { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; color: #F6F3EC; letter-spacing: .2px; line-height: 1; }
  .brand-sub  { font-size: 9px; font-weight: 600; letter-spacing: 2.2px; text-transform: uppercase; color: rgba(184,144,42,.7); line-height: 1; }
  .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 500; }
  .bc-sep    { color: rgba(246,243,236,.15); }
  .bc-link   { color: rgba(246,243,236,.3); cursor: pointer; transition: color .15s; }
  .bc-link:hover { color: rgba(246,243,236,.65); }
  .bc-active { color: rgba(246,243,236,.75); font-weight: 600; }
  .vdiv { width: 1px; height: 22px; background: rgba(246,243,236,.08); }
  .icon-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(246,243,236,.04); border: 1px solid rgba(246,243,236,.09);
    color: rgba(246,243,236,.35); cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center; transition: all .18s;
  }
  .icon-btn:hover { background: rgba(246,243,236,.08); border-color: rgba(246,243,236,.16); color: rgba(246,243,236,.75); }
  .avatar {
    width: 36px; height: 36px; border-radius: 8px;
    border: 1.5px solid rgba(184,144,42,.3); background: rgba(184,144,42,.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 700;
    color: var(--goldl); cursor: pointer; letter-spacing: .3px;
  }

  /* ══ MAIN ══ */
  .main { flex: 1; display: flex; overflow: hidden; }

  /* ══ CONTENT ══ */
  .content {
    flex: 1; overflow-y: auto; padding: 22px 26px 32px;
    display: flex; flex-direction: column; gap: 18px;
    transition: margin-right .35s cubic-bezier(.16,1,.3,1);
  }
  .content::-webkit-scrollbar { width: 3px; }
  .content::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }
  .content.drawer-open { margin-right: 420px; }

  /* ══ PAGE HEADER ══ */
  .page-header {
    display: flex; align-items: flex-end; justify-content: space-between; gap: 16px;
    flex-wrap: wrap;
    animation: fadeUp .3s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .page-eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 5px; display: flex; align-items: center; gap: 8px;
  }
  .page-eyebrow::before { content: ''; width: 18px; height: 1px; background: var(--gold); opacity: .5; }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; font-weight: 600; color: var(--ink);
    letter-spacing: -.2px; line-height: 1; margin-bottom: 5px;
  }
  .page-desc { font-size: 12.5px; color: var(--ink40); }

  .page-actions { display: flex; gap: 10px; align-items: center; }
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 6px;
    font-size: 12.5px; font-weight: 600; cursor: pointer;
    font-family: 'Outfit', sans-serif; letter-spacing: .2px;
    border: 1px solid transparent; transition: all .2s;
  }
  .btn-ghost { background: transparent; border-color: var(--ink10); color: var(--ink50); }
  .btn-ghost:hover { border-color: var(--ink20); color: var(--ink60); background: var(--warm); }
  .btn-gold {
    background: var(--gold); border-color: var(--goldd); color: #fff;
    box-shadow: 0 2px 8px rgba(184,144,42,.3);
  }
  .btn-gold:hover { background: var(--goldl); box-shadow: 0 4px 16px rgba(184,144,42,.4); transform: translateY(-1px); }

  /* ══ STAT STRIP ══ */
  .stat-strip {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
    animation: fadeUp .35s ease both; animation-delay: 40ms;
  }
  .stat-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: 10px; padding: 14px 16px; box-shadow: var(--shadow-xs);
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--sc), transparent);
  }
  .stat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--ink40); margin-bottom: 8px; }
  .stat-val { font-family: 'Geist Mono', monospace; font-size: 24px; font-weight: 600; color: var(--sc); line-height: 1; }
  .stat-sub { font-size: 10.5px; color: var(--ink40); margin-top: 4px; }

  /* ══ FILTER BAR ══ */
  .filter-bar {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: 10px; padding: 14px 18px;
    box-shadow: var(--shadow-xs);
    display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
    animation: fadeUp .4s ease both; animation-delay: 70ms;
  }

  .filter-group { display: flex; flex-direction: column; gap: 6px; }
  .filter-label {
    font-size: 9px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: var(--ink40);
  }

  .search-wrap { position: relative; flex: 1; min-width: 220px; }
  .search-ico  {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 13px; color: var(--ink30); pointer-events: none;
  }
  .search-input {
    width: 100%; padding: 9px 12px 9px 36px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: 7px; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--ink);
    outline: none; transition: all .18s;
  }
  .search-input::placeholder { color: var(--ink20); }
  .search-input:hover { border-color: var(--ink20); background: var(--paper); }
  .search-input:focus { border-color: var(--gold); background: var(--paper); box-shadow: 0 0 0 3px rgba(184,144,42,.1); }
  .search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--ink10); border: none; color: var(--ink40);
    font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .search-clear:hover { background: var(--ink20); color: var(--ink60); }

  .filter-select-wrap { position: relative; }
  .filter-select {
    padding: 9px 32px 9px 12px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: 7px; font-family: 'Outfit', sans-serif;
    font-size: 12.5px; font-weight: 500; color: var(--ink);
    outline: none; appearance: none; cursor: pointer;
    transition: all .18s; min-width: 140px;
  }
  .filter-select:hover { border-color: var(--ink20); background: var(--paper); }
  .filter-select:focus { border-color: var(--gold); background: var(--paper); box-shadow: 0 0 0 3px rgba(184,144,42,.1); }
  .filter-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); font-size: 9px; color: var(--ink30); pointer-events: none; }

  .filter-divider { width: 1px; background: var(--ink10); align-self: stretch; margin: 2px 0; }

  .view-toggle { display: flex; border: 1.5px solid var(--ink10); border-radius: 7px; overflow: hidden; }
  .view-btn {
    padding: 8px 12px; background: transparent; border: none;
    color: var(--ink30); cursor: pointer; font-size: 14px;
    transition: all .15s; display: flex; align-items: center;
  }
  .view-btn:hover { background: var(--warm); color: var(--ink50); }
  .view-btn.active { background: var(--ink); color: var(--goldl); }

  .filter-chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
  .filter-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: var(--goldbg); border: 1px solid var(--goldbr);
    color: var(--gold); font-size: 11px; font-weight: 700;
  }
  .chip-remove { background: none; border: none; cursor: pointer; color: var(--gold); opacity: .65; font-size: 14px; line-height: 1; padding: 0; }
  .chip-remove:hover { opacity: 1; }

  /* ══ RESULTS BAR ══ */
  .results-bar {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    flex-wrap: wrap;
  }
  .results-count { font-size: 12px; color: var(--ink40); font-weight: 500; }
  .results-count strong { color: var(--ink60); font-weight: 700; }
  .sort-wrap { display: flex; align-items: center; gap: 8px; }
  .sort-label { font-size: 11px; color: var(--ink40); font-weight: 600; white-space: nowrap; }

  /* ══ TABLE ══ */
  .table-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: 10px; box-shadow: var(--shadow-xs); overflow: hidden;
    animation: fadeUp .45s ease both; animation-delay: 100ms;
  }

  .tbl-head {
    display: grid;
    grid-template-columns: 40px 3fr 1.2fr 1fr 1fr 1fr 1fr 80px;
    gap: 8px; padding: 11px 18px;
    background: var(--warm); border-bottom: 1px solid var(--ink10);
  }
  .tbl-hcell {
    font-size: 9px; font-weight: 700; letter-spacing: 1.8px;
    text-transform: uppercase; color: var(--ink40);
    display: flex; align-items: center; gap: 4px; cursor: pointer;
    user-select: none; transition: color .15s;
  }
  .tbl-hcell:hover { color: var(--ink60); }
  .tbl-hcell.sorted { color: var(--gold); }
  .sort-arrow { font-size: 8px; }

  .tbl-row {
    display: grid;
    grid-template-columns: 40px 3fr 1.2fr 1fr 1fr 1fr 1fr 80px;
    gap: 8px; padding: 13px 18px;
    align-items: center;
    border-bottom: 1px solid var(--ink03);
    transition: background .14s, box-shadow .14s;
    cursor: pointer; position: relative;
  }
  .tbl-row:last-child { border-bottom: none; }
  .tbl-row:hover { background: var(--warm); }
  .tbl-row.selected { background: var(--goldbg); border-left: 3px solid var(--gold); padding-left: 15px; }
  .tbl-row.selected:hover { background: rgba(184,144,42,.1); }

  .tbl-check {
    width: 16px; height: 16px; border-radius: 4px;
    border: 1.5px solid var(--ink10); background: transparent;
    cursor: pointer; appearance: none; transition: all .15s; flex-shrink: 0;
  }
  .tbl-check:checked { background: var(--gold); border-color: var(--gold); }
  .tbl-check:checked::after { content: '✓'; display: block; color: #fff; font-size: 10px; text-align: center; line-height: 13px; font-weight: 700; }

  /* Product cell */
  .prod-cell { display: flex; align-items: center; gap: 11px; min-width: 0; }
  .prod-thumb {
    width: 38px; height: 38px; flex-shrink: 0;
    border-radius: 8px; background: var(--warm2);
    border: 1px solid var(--ink10);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .prod-name { font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1.3; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .prod-sku  { font-family: 'Geist Mono', monospace; font-size: 10.5px; color: var(--gold); font-weight: 500; }

  .tbl-cell  { font-size: 12.5px; color: var(--ink60); font-weight: 500; }
  .tbl-mono  { font-family: 'Geist Mono', monospace; font-size: 12px; color: var(--ink60); }
  .tbl-price { font-family: 'Geist Mono', monospace; font-size: 13.5px; font-weight: 700; color: var(--ink); }
  .tbl-stock { font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 700; }

  /* Status badge */
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 9.5px; font-weight: 700; text-transform: capitalize; letter-spacing: .3px;
  }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; }

  /* Action menu */
  .row-actions { display: flex; gap: 4px; justify-content: flex-end; }
  .row-action-btn {
    width: 28px; height: 28px; border-radius: 6px;
    background: transparent; border: 1px solid transparent;
    color: var(--ink30); cursor: pointer; font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    transition: all .14s;
  }
  .row-action-btn:hover { background: var(--warm2); border-color: var(--ink10); color: var(--ink60); }
  .row-action-btn.del:hover { background: var(--redbg); border-color: var(--redbr); color: var(--red); }

  /* ══ GRID VIEW ══ */
  .product-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px;
    animation: fadeUp .45s ease both; animation-delay: 100ms;
  }
  .grid-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: 10px; overflow: hidden; box-shadow: var(--shadow-xs);
    cursor: pointer; transition: all .22s cubic-bezier(.16,1,.3,1);
    position: relative;
  }
  .grid-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: var(--ink20); }
  .grid-card.selected { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold), var(--shadow-sm); }
  .grid-thumb {
    height: 130px; background: var(--warm);
    display: flex; align-items: center; justify-content: center;
    font-size: 48px; border-bottom: 1px solid var(--ink06);
    position: relative;
  }
  .grid-featured {
    position: absolute; top: 8px; left: 8px;
    padding: 2px 8px; border-radius: 20px;
    background: rgba(27,23,19,.65); backdrop-filter: blur(4px);
    font-size: 8.5px; font-weight: 700; color: var(--goldl); letter-spacing: 1px;
  }
  .grid-body { padding: 12px 14px 14px; }
  .grid-name { font-size: 13px; font-weight: 700; color: var(--ink); line-height: 1.35; margin-bottom: 3px; }
  .grid-sku  { font-family: 'Geist Mono', monospace; font-size: 10px; color: var(--gold); margin-bottom: 8px; }
  .grid-cat  { font-size: 10.5px; color: var(--ink40); margin-bottom: 10px; }
  .grid-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .grid-price { font-family: 'Geist Mono', monospace; font-size: 15px; font-weight: 700; color: var(--ink); }
  .grid-stock { font-size: 10.5px; font-weight: 700; }

  /* ══ EMPTY STATE ══ */
  .empty-state {
    padding: 64px 32px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .empty-ico { font-size: 48px; opacity: .4; }
  .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink60); }
  .empty-sub { font-size: 13px; color: var(--ink40); max-width: 320px; line-height: 1.6; }

  /* ══ DETAIL DRAWER ══ */
  .drawer-overlay {
    position: fixed; inset: 0; background: rgba(27,23,19,.25);
    z-index: 200; backdrop-filter: blur(1px);
    animation: overlayIn .25s ease;
  }
  @keyframes overlayIn { from{opacity:0} to{opacity:1} }

  .drawer {
    position: fixed; top: var(--topbar-h); right: 0; bottom: 0;
    width: 420px; background: var(--paper);
    border-left: 1px solid var(--ink10);
    box-shadow: var(--shadow-lg);
    z-index: 201; overflow-y: auto;
    display: flex; flex-direction: column;
    animation: drawerIn .3s cubic-bezier(.16,1,.3,1);
  }
  @keyframes drawerIn { from{transform:translateX(100%)} to{transform:none} }
  .drawer::-webkit-scrollbar { width: 3px; }
  .drawer::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  .drawer-head {
    padding: 18px 22px 16px;
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.25);
    flex-shrink: 0; position: sticky; top: 0; z-index: 10;
  }
  .drawer-head-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .drawer-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(184,144,42,.7); }
  .drawer-close {
    width: 30px; height: 30px; border-radius: 6px;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    color: rgba(246,243,236,.4); cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
  }
  .drawer-close:hover { background: rgba(246,243,236,.1); color: rgba(246,243,236,.8); }

  .drawer-prod-row { display: flex; align-items: center; gap: 13px; }
  .drawer-thumb {
    width: 52px; height: 52px; border-radius: 10px;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0;
  }
  .drawer-prod-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: #F6F3EC; line-height: 1.2; margin-bottom: 4px; }
  .drawer-prod-sku  { font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--goldl); letter-spacing: .8px; }

  .drawer-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 20px; flex: 1; }

  .d-section-label {
    font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--ink40); display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
  }
  .d-section-label::after { content: ''; flex: 1; height: 1px; background: var(--ink06); }

  .d-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 6px 0; border-bottom: 1px solid var(--ink03); }
  .d-row:last-child { border-bottom: none; }
  .d-label { font-size: 11.5px; color: var(--ink40); font-weight: 500; flex-shrink: 0; }
  .d-value { font-size: 12.5px; font-weight: 600; color: var(--ink); text-align: right; }
  .d-mono  { font-family: 'Geist Mono', monospace; font-size: 12px; }

  .d-desc-box {
    padding: 12px 14px; background: var(--warm); border: 1px solid var(--ink10);
    border-radius: 8px; font-size: 12.5px; color: var(--ink60);
    line-height: 1.65; font-weight: 400;
  }

  /* Stock gauge */
  .stock-gauge { margin-bottom: 4px; }
  .gauge-bar { height: 6px; background: var(--ink10); border-radius: 4px; overflow: hidden; margin: 8px 0 5px; }
  .gauge-fill { height: 100%; border-radius: 4px; transition: width .6s cubic-bezier(.16,1,.3,1); }
  .gauge-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--ink30); font-family: 'Geist Mono', monospace; }

  .tag-list { display: flex; flex-wrap: wrap; gap: 5px; }
  .d-tag {
    padding: 3px 9px; border-radius: 20px;
    background: var(--warm2); border: 1px solid var(--ink10);
    font-size: 11px; font-weight: 600; color: var(--ink50);
  }

  /* Drawer actions */
  .drawer-actions {
    padding: 16px 22px; border-top: 1px solid var(--ink10);
    display: flex; gap: 8px; flex-shrink: 0;
    background: var(--paper);
    position: sticky; bottom: 0;
  }
  .d-btn {
    flex: 1; padding: 10px; border-radius: 7px;
    font-size: 12.5px; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; border: 1px solid transparent;
    transition: all .18s; display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .d-btn-edit { background: var(--gold); border-color: var(--goldd); color: #fff; box-shadow: 0 2px 8px rgba(184,144,42,.25); }
  .d-btn-edit:hover { background: var(--goldl); box-shadow: 0 4px 14px rgba(184,144,42,.35); }
  .d-btn-ghost { background: transparent; border-color: var(--ink10); color: var(--ink50); }
  .d-btn-ghost:hover { border-color: var(--ink20); background: var(--warm); color: var(--ink60); }
  .d-btn-danger { background: var(--redbg); border-color: var(--redbr); color: var(--red); }
  .d-btn-danger:hover { background: rgba(181,55,42,.14); }

  /* ══ BULK BAR ══ */
  .bulk-bar {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: var(--ink); border: 1px solid rgba(184,144,42,.3);
    border-radius: 12px; padding: 12px 20px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: var(--shadow-lg); z-index: 300;
    animation: bulkIn .28s cubic-bezier(.16,1,.3,1);
    white-space: nowrap;
  }
  @keyframes bulkIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .bulk-count { font-size: 13px; font-weight: 700; color: var(--goldl); }
  .bulk-divider { width: 1px; height: 18px; background: rgba(246,243,236,.12); }
  .bulk-btn {
    padding: 7px 14px; border-radius: 7px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; border: 1px solid transparent; transition: all .15s;
    display: flex; align-items: center; gap: 6px;
  }
  .bulk-btn-ghost { background: rgba(246,243,236,.06); border-color: rgba(246,243,236,.1); color: rgba(246,243,236,.6); }
  .bulk-btn-ghost:hover { background: rgba(246,243,236,.1); color: rgba(246,243,236,.9); }
  .bulk-btn-red { background: var(--redbg); border-color: var(--redbr); color: var(--red); }
  .bulk-btn-red:hover { background: rgba(181,55,42,.16); }
  .bulk-btn-clear { background: none; border: none; color: rgba(246,243,236,.3); cursor: pointer; font-size: 18px; line-height: 1; padding: 0 4px; transition: color .15s; }
  .bulk-btn-clear:hover { color: rgba(246,243,236,.7); }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1200px) {
    .tbl-head, .tbl-row { grid-template-columns: 40px 3fr 1.2fr 1fr 1fr 1fr 80px; }
    .tbl-head > :nth-child(6), .tbl-row > :nth-child(6) { display: none; }
    .drawer { width: 380px; }
    .content.drawer-open { margin-right: 380px; }
  }
  @media (max-width: 960px) {
    .tbl-head, .tbl-row { grid-template-columns: 3fr 1fr 1fr 1fr 80px; }
    .tbl-head > :nth-child(1), .tbl-row > :nth-child(1),
    .tbl-head > :nth-child(3), .tbl-row > :nth-child(3) { display: none; }
    .stat-strip { grid-template-columns: repeat(2, 1fr); }
    .drawer { width: 340px; }
    .content.drawer-open { margin-right: 340px; }
  }
  @media (max-width: 680px) {
    .content { padding: 14px 16px; }
    .content.drawer-open { margin-right: 0; }
    .drawer { width: 100%; }
    .stat-strip { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const statusStyle = {
  active:   { bg: "var(--greenbg)", border: "var(--greenbr)", text: "var(--green)",  dot: "#3D8A65" },
  draft:    { bg: "var(--goldbg)",  border: "var(--goldbr)",  text: "var(--gold)",   dot: "#D4A83C" },
  archived: { bg: "var(--warm2)",   border: "var(--ink10)",   text: "var(--ink40)",  dot: "#9E9080" },
};

const catColors = {
  Electronics: "var(--blue)",  Apparel:    "var(--purple)", Accessories: "var(--gold)",
  Home:        "var(--brown)", Lifestyle:  "var(--green)",  Stationery:  "var(--ink50)",
  Sports:      "var(--red)",   Beauty:     "var(--purple)", Toys:        "var(--goldl)",
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ProductList() {
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("All");
  const [statFilter, setStatFilter] = useState("All");
  const [sortKey,    setSortKey]    = useState("name");
  const [sortAsc,    setSortAsc]    = useState(true);
  const [view,       setView]       = useState("table"); // table | grid
  const [selected,   setSelected]   = useState(null);   // product id for drawer
  const [checked,    setChecked]    = useState([]);      // bulk selection ids
  const searchRef = useRef();
  const [addOpen, setAddOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Filtering & sorting ──
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)  ||
      p.barcode.includes(q)            ||
      p.brand.toLowerCase().includes(q)
    );
    if (catFilter  !== "All") list = list.filter(p => p.category === catFilter);
    if (statFilter !== "All") list = list.filter(p => p.status === statFilter);

    list.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [search, catFilter, statFilter, sortKey, sortAsc]);

  const selectedProduct = PRODUCTS.find(p => p.id === selected);

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleCheck = (id, e) => {
    e.stopPropagation();
    setChecked(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  };
  const toggleAll = () => {
    setChecked(c => c.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const activeFilters = [];
  if (search)             activeFilters.push({ label: `"${search}"`,   clear: () => setSearch("") });
  if (catFilter  !== "All") activeFilters.push({ label: catFilter,      clear: () => setCatFilter("All") });
  if (statFilter !== "All") activeFilters.push({ label: statFilter,     clear: () => setStatFilter("All") });

  // Stats
  const totalActive   = PRODUCTS.filter(p => p.status === "active").length;
  const lowStock      = PRODUCTS.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStock    = PRODUCTS.filter(p => p.stock === 0).length;
  const totalValue    = PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0);

  const SortIcon = ({ k }) => sortKey === k
    ? <span className="sort-arrow">{sortAsc ? "▲" : "▼"}</span>
    : <span className="sort-arrow" style={{ opacity: .3 }}>▲</span>;

  return (
    <>
      <style>{STYLES}</style>
      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">
              <div className="brand-mark">N</div>
              <div className="brand-text">
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
              <span className="bc-active">Products</span>
            </nav>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">⚙</button>
            <div className="vdiv" />
            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="main">
          <div className={`content${selected ? " drawer-open" : ""}`}>

            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <div className="page-eyebrow">Inventory Management</div>
                <div className="page-title">Product Catalogue</div>
                <div className="page-desc">{PRODUCTS.length} products across {CATEGORIES.length - 1} categories</div>
              </div>
              <div className="page-actions">
                <button className="btn btn-ghost">↓ Export</button>
                <button className="btn btn-gold" onClick={() => setAddOpen(true)}>＋ Add Product</button>
              </div>
            </div>

            {/* STAT STRIP */}
            <div className="stat-strip">
              {[
                { label: "Total Products",  val: PRODUCTS.length, sub: "All categories",        color: "var(--blue)"  },
                { label: "Active Listings", val: totalActive,      sub: "Published in POS",      color: "var(--green)" },
                { label: "Low Stock",       val: lowStock,         sub: "Below reorder point",   color: "var(--gold)"  },
                { label: "Out of Stock",    val: outOfStock,       sub: `Inventory value $${Math.round(totalValue / 1000)}k`, color: "var(--red)" },
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
              <div className="filter-group" style={{ flex: 1 }}>
                <div className="filter-label">Search</div>
                <div className="search-wrap">
                  <span className="search-ico">⌕</span>
                  <input
                    ref={searchRef}
                    className="search-input"
                    placeholder="Name, SKU or barcode…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="search-clear" onClick={() => { setSearch(""); searchRef.current.focus(); }}>×</button>
                  )}
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

              {/* Status */}
              <div className="filter-group">
                <div className="filter-label">Status</div>
                <div className="filter-select-wrap">
                  <select className="filter-select" value={statFilter} onChange={e => setStatFilter(e.target.value)} style={{ minWidth: 120 }}>
                    {STATUS_OPTIONS.map(s => <option key={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
              </div>

              <div className="filter-divider" />

              {/* View toggle */}
              <div className="filter-group">
                <div className="filter-label">View</div>
                <div className="view-toggle">
                  <button className={`view-btn${view === "table" ? " active" : ""}`} onClick={() => setView("table")} title="Table view">☰</button>
                  <button className={`view-btn${view === "grid"  ? " active" : ""}`} onClick={() => setView("grid")}  title="Grid view">⊞</button>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <>
                  <div className="filter-divider" />
                  <div className="filter-group" style={{ justifyContent: "flex-end" }}>
                    <div className="filter-label">Active Filters</div>
                    <div className="filter-chips">
                      {activeFilters.map((f, i) => (
                        <span className="filter-chip" key={i}>
                          {f.label}
                          <button className="chip-remove" onClick={f.clear}>×</button>
                        </span>
                      ))}
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}
                        onClick={() => { setSearch(""); setCatFilter("All"); setStatFilter("All"); }}>
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
                Showing <strong>{filtered.length}</strong> of <strong>{PRODUCTS.length}</strong> products
                {activeFilters.length > 0 && " (filtered)"}
              </div>
              <div className="sort-wrap">
                <span className="sort-label">Sort by</span>
                <div className="filter-select-wrap">
                  <select className="filter-select" style={{ minWidth: 130, fontSize: 12 }}
                    value={sortKey} onChange={e => { setSortKey(e.target.value); setSortAsc(true); }}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                    <option value="sold">Sold</option>
                    <option value="category">Category</option>
                  </select>
                  <span className="filter-arrow">▾</span>
                </div>
                <button className="btn btn-ghost" style={{ padding: "7px 11px", fontSize: 13 }}
                  onClick={() => setSortAsc(v => !v)} title={sortAsc ? "Ascending" : "Descending"}>
                  {sortAsc ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* TABLE VIEW */}
            {view === "table" && (
              <div className="table-card">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-ico">🔍</div>
                    <div className="empty-title">No products found</div>
                    <div className="empty-sub">Try adjusting your search term, category or status filter to find what you're looking for.</div>
                    <button className="btn btn-ghost" onClick={() => { setSearch(""); setCatFilter("All"); setStatFilter("All"); }}>Clear filters</button>
                  </div>
                ) : (
                  <>
                    <div className="tbl-head">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input type="checkbox" className="tbl-check"
                          checked={checked.length === filtered.length && filtered.length > 0}
                          onChange={toggleAll} />
                      </div>
                      <div className={`tbl-hcell${sortKey === "name" ? " sorted" : ""}`} onClick={() => toggleSort("name")}>
                        Product <SortIcon k="name" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "sku" ? " sorted" : ""}`} onClick={() => toggleSort("sku")}>
                        SKU / Code <SortIcon k="sku" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "category" ? " sorted" : ""}`} onClick={() => toggleSort("category")}>
                        Category <SortIcon k="category" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "price" ? " sorted" : ""}`} onClick={() => toggleSort("price")}>
                        Price <SortIcon k="price" />
                      </div>
                      <div className={`tbl-hcell${sortKey === "stock" ? " sorted" : ""}`} onClick={() => toggleSort("stock")}>
                        Stock <SortIcon k="stock" />
                      </div>
                      <div className="tbl-hcell">Status</div>
                      <div className="tbl-hcell" style={{ justifyContent: "flex-end" }}>Actions</div>
                    </div>

                    {filtered.map((p, i) => {
                      const ss = statusStyle[p.status];
                      const isLow = p.stock > 0 && p.stock <= p.minStock;
                      const isOut = p.stock === 0;
                      return (
                        <div
                          key={p.id}
                          className={`tbl-row${selected === p.id ? " selected" : ""}`}
                          style={{ animationDelay: `${i * 18}ms` }}
                          onClick={() => setSelected(s => s === p.id ? null : p.id)}
                        >
                          <div onClick={e => e.stopPropagation()}>
                            <input type="checkbox" className="tbl-check"
                              checked={checked.includes(p.id)}
                              onChange={e => toggleCheck(p.id, e)} />
                          </div>

                          <div className="prod-cell">
                            <div className="prod-thumb">{p.images[0]}</div>
                            <div style={{ minWidth: 0 }}>
                              <div className="prod-name">{p.name}</div>
                              <div className="prod-sku">{p.sku}</div>
                            </div>
                          </div>

                          <div>
                            <div className="tbl-mono" style={{ marginBottom: 2 }}>{p.sku}</div>
                            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: "var(--ink30)" }}>{p.barcode}</div>
                          </div>

                          <div>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                              background: `${catColors[p.category] || "var(--ink40)"}15`,
                              color: catColors[p.category] || "var(--ink40)",
                              border: `1px solid ${catColors[p.category] || "var(--ink40)"}28`,
                            }}>{p.category}</span>
                          </div>

                          <div className="tbl-price">${fmt(p.price)}</div>

                          <div className="tbl-stock" style={{
                            color: isOut ? "var(--red)" : isLow ? "var(--gold)" : "var(--green)",
                          }}>
                            {p.stock}
                            {isOut && <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: "var(--red)", letterSpacing: ".5px" }}>OUT</div>}
                            {isLow && !isOut && <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: "var(--gold)", letterSpacing: ".5px" }}>LOW</div>}
                          </div>

                          <span className="status-badge" style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text }}>
                            <span className="status-dot" style={{ background: ss.dot }} />
                            {p.status}
                          </span>

                          <div className="row-actions" onClick={e => e.stopPropagation()}>
                            <button className="row-action-btn" title="Edit" onClick={() => setSelected(p.id)}>✏</button>
                            <button className="row-action-btn del" title="Delete">🗑</button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* GRID VIEW */}
            {view === "grid" && (
              filtered.length === 0 ? (
                <div className="table-card">
                  <div className="empty-state">
                    <div className="empty-ico">🔍</div>
                    <div className="empty-title">No products found</div>
                    <div className="empty-sub">Try adjusting your filters to find what you're looking for.</div>
                    <button className="btn btn-ghost" onClick={() => { setSearch(""); setCatFilter("All"); setStatFilter("All"); }}>Clear filters</button>
                  </div>
                </div>
              ) : (
                <div className="product-grid">
                  {filtered.map((p, i) => {
                    const ss = statusStyle[p.status];
                    const isLow = p.stock > 0 && p.stock <= p.minStock;
                    const isOut = p.stock === 0;
                    return (
                      <div
                        key={p.id}
                        className={`grid-card${selected === p.id ? " selected" : ""}`}
                        style={{ animationDelay: `${i * 22}ms`, animation: "fadeUp .4s ease both" }}
                        onClick={() => setSelected(s => s === p.id ? null : p.id)}
                      >
                        <div className="grid-thumb">
                          {p.featured && <div className="grid-featured">★ FEATURED</div>}
                          {p.images[0]}
                        </div>
                        <div className="grid-body">
                          <div className="grid-name">{p.name}</div>
                          <div className="grid-sku">{p.sku}</div>
                          <div className="grid-cat" style={{ color: catColors[p.category] || "var(--ink40)" }}>{p.category}</div>
                          <div className="grid-footer">
                            <div className="grid-price">${fmt(p.price)}</div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                              <span className="status-badge" style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text, padding: "2px 7px" }}>
                                <span className="status-dot" style={{ background: ss.dot }} />
                                {p.status}
                              </span>
                              <span className="grid-stock" style={{ color: isOut ? "var(--red)" : isLow ? "var(--gold)" : "var(--green)", fontSize: 11 }}>
                                {isOut ? "Out of stock" : isLow ? `Low: ${p.stock}` : `${p.stock} in stock`}
                              </span>
                            </div>
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
          {selected && selectedProduct && (() => {
            const p = selectedProduct;
            const ss = statusStyle[p.status];
            const isLow = p.stock > 0 && p.stock <= p.minStock;
            const isOut = p.stock === 0;
            const margin = (((p.price - p.cost) / p.price) * 100).toFixed(1);
            const stockPct = Math.min((p.stock / (p.minStock * 3)) * 100, 100);

            return (
              <>
                <div className="drawer-overlay" onClick={() => setSelected(null)} />
                <aside className="drawer">
                  {/* Header */}
                  <div className="drawer-head">
                    <div className="drawer-head-top">
                      <span className="drawer-eyebrow">Product Detail</span>
                      <button className="drawer-close" onClick={() => setSelected(null)}>×</button>
                    </div>
                    <div className="drawer-prod-row">
                      <div className="drawer-thumb">{p.images[0]}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="drawer-prod-name">{p.name}</div>
                        <div className="drawer-prod-sku">{p.sku}</div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="drawer-body">

                    {/* Status + featured */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="status-badge" style={{ background: ss.bg, border: `1px solid ${ss.border}`, color: ss.text, padding: "5px 12px", fontSize: 11 }}>
                        <span className="status-dot" style={{ background: ss.dot }} />
                        {p.status}
                      </span>
                      {p.featured && (
                        <span className="status-badge" style={{ background: "var(--goldbg)", border: "1px solid var(--goldbr)", color: "var(--gold)", padding: "5px 12px", fontSize: 11 }}>
                          ★ Featured
                        </span>
                      )}
                      <span style={{
                        padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: `${catColors[p.category] || "var(--ink40)"}15`,
                        color: catColors[p.category] || "var(--ink40)",
                        border: `1px solid ${catColors[p.category] || "var(--ink40)"}28`,
                      }}>{p.category}</span>
                    </div>

                    {/* Description */}
                    {p.description && (
                      <div>
                        <div className="d-section-label">Description</div>
                        <div className="d-desc-box">{p.description}</div>
                      </div>
                    )}

                    {/* Identification */}
                    <div>
                      <div className="d-section-label">Identification</div>
                      <div className="d-row">
                        <span className="d-label">SKU</span>
                        <span className="d-value d-mono" style={{ color: "var(--gold)" }}>{p.sku}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Barcode</span>
                        <span className="d-value d-mono">{p.barcode}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Brand</span>
                        <span className="d-value">{p.brand}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Supplier</span>
                        <span className="d-value">{p.supplier}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Location</span>
                        <span className="d-value d-mono">{p.location}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <div className="d-section-label">Pricing</div>
                      <div className="d-row">
                        <span className="d-label">Selling Price</span>
                        <span className="d-value d-mono" style={{ color: "var(--green)", fontSize: 16 }}>${fmt(p.price)}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Cost Price</span>
                        <span className="d-value d-mono">${fmt(p.cost)}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Gross Margin</span>
                        <span className="d-value d-mono" style={{ color: parseFloat(margin) > 30 ? "var(--green)" : "var(--gold)" }}>{margin}%</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Profit / Unit</span>
                        <span className="d-value d-mono">${fmt(p.price - p.cost)}</span>
                      </div>
                    </div>

                    {/* Inventory */}
                    <div>
                      <div className="d-section-label">Inventory</div>

                      {/* Stock gauge */}
                      <div className="stock-gauge">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink50)" }}>Current Stock</span>
                          <span style={{
                            fontFamily: "'Geist Mono', monospace", fontSize: 20, fontWeight: 700,
                            color: isOut ? "var(--red)" : isLow ? "var(--gold)" : "var(--green)",
                          }}>{p.stock}</span>
                        </div>
                        <div className="gauge-bar">
                          <div className="gauge-fill" style={{
                            width: `${stockPct}%`,
                            background: isOut ? "var(--red)" : isLow
                              ? "linear-gradient(90deg,var(--gold),var(--goldl))"
                              : "linear-gradient(90deg,var(--green),var(--greenl))",
                          }} />
                        </div>
                        <div className="gauge-labels">
                          <span>0</span>
                          <span>Reorder: {p.minStock}</span>
                          <span>{p.minStock * 3}</span>
                        </div>
                      </div>

                      <div className="d-row" style={{ marginTop: 6 }}>
                        <span className="d-label">Reorder Point</span>
                        <span className="d-value d-mono">{p.minStock} units</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Stock Status</span>
                        <span className="d-value" style={{ color: isOut ? "var(--red)" : isLow ? "var(--gold)" : "var(--green)" }}>
                          {isOut ? "⚠ Out of stock" : isLow ? "⚠ Low stock" : "✓ Healthy"}
                        </span>
                      </div>
                    </div>

                    {/* Sales */}
                    <div>
                      <div className="d-section-label">Sales Performance</div>
                      <div className="d-row">
                        <span className="d-label">Units Sold (today)</span>
                        <span className="d-value d-mono">{p.sold}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Revenue (today)</span>
                        <span className="d-value d-mono">${fmt(p.sold * p.price)}</span>
                      </div>
                      <div className="d-row">
                        <span className="d-label">Trend</span>
                        <span className="d-value d-mono" style={{ color: p.trend > 0 ? "var(--green)" : "var(--red)" }}>
                          {p.trend > 0 ? "↑" : "↓"} {Math.abs(p.trend)}% vs yesterday
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {p.tags.length > 0 && (
                      <div>
                        <div className="d-section-label">Tags</div>
                        <div className="tag-list">
                          {p.tags.map(t => <span className="d-tag" key={t}>{t}</span>)}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Drawer Actions */}
                  <div className="drawer-actions">
                    <button className="d-btn d-btn-edit">✏ Edit Product</button>
                    <button className="d-btn d-btn-ghost" style={{ flex: "0 0 auto", padding: "10px 14px" }} title="Duplicate">⧉</button>
                    <button className="d-btn d-btn-danger" style={{ flex: "0 0 auto", padding: "10px 14px" }} title="Delete">🗑</button>
                  </div>
                </aside>
              </>
            );
          })()}
        </div>

        {/* BULK ACTION BAR */}
        {checked.length > 0 && (
          <div className="bulk-bar">
            <span className="bulk-count">{checked.length} selected</span>
            <div className="bulk-divider" />
            <button className="bulk-btn bulk-btn-ghost">✏ Edit</button>
            <button className="bulk-btn bulk-btn-ghost">↓ Export</button>
            <button className="bulk-btn bulk-btn-ghost">⊟ Archive</button>
            <button className="bulk-btn bulk-btn-red">🗑 Delete</button>
            <div className="bulk-divider" />
            <button className="bulk-btn-clear" onClick={() => setChecked([])}>×</button>
          </div>
        )}

        {addOpen && (
          <AddProductModal
            onClose={() => setAddOpen(false)}
            onSave={(newProduct) => {
              // push newProduct into your products state/API here
              console.log("New product:", newProduct);
            }}
          />
        )}

      </div>
    </>
  );
}