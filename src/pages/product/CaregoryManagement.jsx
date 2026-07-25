import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search, X, Download, Plus, Pencil, Trash2, LayoutGrid, List,
  ArrowUp, ArrowDown, ArrowUpDown, ChevronRight, FolderOpen,
  CircleMinus, CirclePlus, CircleAlert, Tag,
} from "lucide-react";
import DashboardLayout from "../common/DashboardLayout";
import {
  getLeftNavAdmin,
  LEFT_NAV_BOTTOM_ADMIN,
  getRightNavAdmin,
} from "../common/Navconfig";

// ─── DATA ────────────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  { category_id: 1,  category_code: "ELEC-001", category_name: "Electronics",  category_description: "Gadgets, devices and tech accessories for everyday use.",  category_is_active: true,  category_created_at: "2024-01-10T08:00:00", category_updated_at: "2024-03-15T12:00:00" },
  { category_id: 2,  category_code: "APPR-001", category_name: "Apparel",      category_description: "Clothing, footwear and fashion items for all occasions.",   category_is_active: true,  category_created_at: "2024-01-10T08:00:00", category_updated_at: "2024-02-20T09:00:00" },
  { category_id: 3,  category_code: "ACCS-001", category_name: "Accessories",  category_description: "Bags, wallets, belts and personal accessories.",           category_is_active: true,  category_created_at: "2024-01-12T10:00:00", category_updated_at: "2024-01-12T10:00:00" },
  { category_id: 4,  category_code: "HOME-001", category_name: "Home",         category_description: "Homewares, décor and household essentials.",                category_is_active: true,  category_created_at: "2024-01-15T11:00:00", category_updated_at: "2024-04-01T14:00:00" },
  { category_id: 5,  category_code: "LIFE-001", category_name: "Lifestyle",    category_description: "Health, wellness and everyday lifestyle products.",         category_is_active: true,  category_created_at: "2024-01-18T09:00:00", category_updated_at: "2024-01-18T09:00:00" },
  { category_id: 6,  category_code: "STAT-001", category_name: "Stationery",   category_description: "Notebooks, pens and office supplies.",                     category_is_active: true,  category_created_at: "2024-01-20T13:00:00", category_updated_at: "2024-01-20T13:00:00" },
  { category_id: 7,  category_code: "SPRT-001", category_name: "Sports",       category_description: "Fitness equipment, activewear and sporting goods.",        category_is_active: true,  category_created_at: "2024-02-01T08:00:00", category_updated_at: "2024-02-01T08:00:00" },
  { category_id: 8,  category_code: "BEAU-001", category_name: "Beauty",       category_description: "Skincare, cosmetics and personal care products.",          category_is_active: false, category_created_at: "2024-02-10T10:00:00", category_updated_at: "2024-03-01T11:00:00" },
  { category_id: 9,  category_code: "FOOD-001", category_name: "Food",         category_description: "Snacks, beverages and packaged food items.",               category_is_active: true,  category_created_at: "2024-02-14T09:00:00", category_updated_at: "2024-02-14T09:00:00" },
  { category_id: 10, category_code: "TOYS-001", category_name: "Toys",         category_description: "Games, toys and hobby items for all ages.",                category_is_active: true,  category_created_at: "2024-02-20T10:00:00", category_updated_at: "2024-02-20T10:00:00" },
];

const toCode = (name) =>
  name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fmtDate = (s) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const BLANK_FORM = {
  category_name: "",
  category_code: "",
  codeAuto: true,
  category_description: "",
  category_is_active: true,
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:  #F6F3EC;
    --paper:  #FDFBF7;
    --warm:   #F0EBE0;
    --warm2:  #E8E2D4;
    --ink:    #1B1713;
    --ink80:  #2E2720;
    --ink60:  #4B4038;
    --ink50:  #6B5F54;
    --ink40:  #9E9080;
    --ink30:  #B8AFA4;
    --ink20:  #CFC8BC;
    --ink10:  #E4DDD2;
    --ink06:  #EDE8E0;
    --ink03:  #F5F1EB;
    --gold:   #B8902A;
    --goldl:  #D4A83C;
    --goldd:  #8A6A1A;
    --goldbg: rgba(184,144,42,.07);
    --goldbr: rgba(184,144,42,.22);
    --green:  #2D6A4F;
    --greenl: #3D8A65;
    --greenbg: rgba(45,106,79,.07);
    --greenbr: rgba(45,106,79,.22);
    --red:    #B5372A;
    --redbg:  rgba(181,55,42,.07);
    --redbr:  rgba(181,55,42,.2);
    --blue:   #2B5490;
    --bluebg: rgba(43,84,144,.07);
    --bluebr: rgba(43,84,144,.22);
    --shadow-xs: 0 1px 2px rgba(27,23,19,.04);
    --shadow-sm: 0 2px 8px rgba(27,23,19,.06), 0 1px 2px rgba(27,23,19,.04);
    --shadow-md: 0 6px 20px rgba(27,23,19,.09), 0 2px 4px rgba(27,23,19,.05);
    --shadow-lg: 0 16px 48px rgba(27,23,19,.14), 0 4px 12px rgba(27,23,19,.08);
    --sans:  'Outfit', sans-serif;
    --serif: 'Cormorant Garamond', serif;
    --mono:  'Geist Mono', monospace;
    --radius:    7px;
    --radius-lg: 10px;
    --radius-xl: 14px;
  }

  html, body, #root { height: 100%; background: var(--cream); }

  /* ── SHELL ── */
  .shell {
    display: flex; flex-direction: column; min-height: 100vh;
    font-family: var(--sans); color: var(--ink); background: var(--cream);
    background-image:
      radial-gradient(ellipse 70% 40% at 80% -5%, rgba(184,144,42,.06) 0%, transparent 55%),
      radial-gradient(ellipse 50% 30% at 5% 90%, rgba(45,106,79,.04) 0%, transparent 50%);
    position: relative;
  }

  /* ── CONTENT ── */
  .content {
    flex: 1; overflow-y: auto; padding: 28px 30px 40px;
    display: flex; flex-direction: column; gap: 20px;
  }
  .content::-webkit-scrollbar { width: 3px; }
  .content::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:scale(.97) translateY(8px); } to { opacity:1; transform:none; } }

  /* ── PAGE HEADER ── */
  .page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    animation: fadeUp .35s cubic-bezier(.16,1,.3,1) both;
  }

  .page-eyebrow {
    display: flex; align-items: center; gap: 10px;
    font-family: var(--mono); font-size: 9px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold);
    margin-bottom: 7px;
  }
  .page-eyebrow::before {
    content: ''; width: 24px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }

  .page-title {
    font-family: var(--serif); font-size: 32px; font-weight: 600;
    color: var(--ink); letter-spacing: -.3px; line-height: 1;
    margin-bottom: 6px;
  }
  .page-sub { font-size: 12.5px; color: var(--ink40); font-weight: 400; }
  .page-actions { display: flex; gap: 10px; align-items: center; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: var(--radius);
    font-size: 12.5px; font-weight: 600; cursor: pointer;
    font-family: var(--sans); letter-spacing: .15px;
    border: 1px solid transparent; transition: all .2s cubic-bezier(.16,1,.3,1);
  }
  .btn-ghost {
    background: var(--paper); border-color: var(--ink10); color: var(--ink50);
    box-shadow: var(--shadow-xs);
  }
  .btn-ghost:hover { border-color: var(--ink20); color: var(--ink60); background: var(--warm); }

  .btn-primary {
    background: var(--gold); border-color: var(--goldd); color: #fff;
    box-shadow: 0 2px 10px rgba(184,144,42,.35);
  }
  .btn-primary:hover {
    background: var(--goldl);
    box-shadow: 0 4px 18px rgba(184,144,42,.45);
    transform: translateY(-1px);
  }
  .btn-red { background: var(--redbg); border-color: var(--redbr); color: var(--red); }
  .btn-red:hover { background: rgba(181,55,42,.14); }

  /* ── STAT STRIP ── */
  .stat-strip {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both; animation-delay: 50ms;
  }
  .stat-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--radius-xl); padding: 18px 20px;
    box-shadow: var(--shadow-xs);
    position: relative; overflow: hidden;
    transition: box-shadow .2s, transform .2s;
  }
  .stat-card:hover { box-shadow: var(--shadow-sm); transform: translateY(-1px); }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--sc, var(--gold)) 0%, transparent 70%);
  }
  .stat-card::after {
    content: attr(data-num);
    position: absolute; right: 16px; bottom: 10px;
    font-family: var(--serif); font-size: 72px; font-weight: 700;
    color: var(--sc, var(--gold)); opacity: .055; line-height: 1;
    pointer-events: none; user-select: none;
  }
  .stat-lbl {
    font-family: var(--mono); font-size: 9px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase; color: var(--ink40); margin-bottom: 10px;
  }
  .stat-val {
    font-family: var(--mono); font-size: 28px; font-weight: 600;
    color: var(--sc, var(--gold)); line-height: 1;
  }
  .stat-sub { font-size: 11px; color: var(--ink40); margin-top: 4px; }

  /* ── FILTER BAR ── */
  .filter-bar {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--radius-xl); padding: 16px 20px;
    box-shadow: var(--shadow-xs);
    display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
    animation: fadeUp .45s cubic-bezier(.16,1,.3,1) both; animation-delay: 80ms;
  }
  .filter-group { display: flex; flex-direction: column; gap: 6px; }
  .filter-lbl {
    font-family: var(--mono); font-size: 9px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--ink40);
  }

  .search-wrap { position: relative; flex: 1; min-width: 220px; }
  .search-ico  {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--ink30); pointer-events: none;
  }
  .search-input {
    width: 100%; padding: 9px 34px 9px 36px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: var(--radius); font-family: var(--sans);
    font-size: 13px; font-weight: 500; color: var(--ink);
    outline: none; transition: all .2s;
  }
  .search-input::placeholder { color: var(--ink20); }
  .search-input:hover { border-color: var(--ink20); background: var(--paper); }
  .search-input:focus {
    border-color: var(--gold); background: var(--paper);
    box-shadow: 0 0 0 3px rgba(184,144,42,.1);
  }
  .search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--ink10); border: none; color: var(--ink50);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .search-clear:hover { background: var(--ink20); }

  .filter-select-wrap { position: relative; }
  .filter-select {
    padding: 9px 32px 9px 12px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: var(--radius); font-family: var(--sans);
    font-size: 12.5px; font-weight: 500; color: var(--ink);
    outline: none; appearance: none; cursor: pointer;
    transition: all .2s; min-width: 130px;
  }
  .filter-select:hover { border-color: var(--ink20); background: var(--paper); }
  .filter-select:focus {
    border-color: var(--gold); background: var(--paper);
    box-shadow: 0 0 0 3px rgba(184,144,42,.1);
  }
  .filter-arrow {
    position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
    color: var(--ink30); pointer-events: none;
  }

  .filter-divider { width: 1px; background: var(--ink10); align-self: stretch; margin: 2px 0; }

  .view-toggle {
    display: flex; border: 1.5px solid var(--ink10);
    border-radius: var(--radius); overflow: hidden;
    background: var(--cream);
  }
  .view-btn {
    padding: 8px 12px; background: transparent; border: none;
    color: var(--ink30); cursor: pointer; transition: all .15s;
    display: flex; align-items: center;
  }
  .view-btn:hover { background: var(--warm); color: var(--ink50); }
  .view-btn.active { background: var(--ink); color: var(--goldl); }

  /* ── RESULTS BAR ── */
  .results-bar {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }
  .results-count { font-size: 12px; color: var(--ink40); font-weight: 500; font-family: var(--mono); }
  .results-count strong { color: var(--ink60); font-weight: 700; }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--radius-xl); box-shadow: var(--shadow-xs);
    overflow: hidden; overflow-x: auto;
    animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; animation-delay: 110ms;
  }
  .table-wrap::-webkit-scrollbar { height: 4px; }
  .table-wrap::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 4px; }

  .tbl { width: 100%; border-collapse: collapse; min-width: 960px; }

  .tbl thead { background: var(--warm); border-bottom: 1px solid var(--ink10); }
  .tbl th {
    font-family: var(--mono); font-size: 9px; font-weight: 700;
    letter-spacing: 1.8px; text-transform: uppercase; color: var(--ink40);
    padding: 13px 16px; text-align: left; white-space: nowrap;
    cursor: pointer; user-select: none; transition: color .15s;
  }
  .tbl th:hover { color: var(--ink60); }
  .tbl th.sorted { color: var(--gold); }

  .tbl td { padding: 14px 16px; border-bottom: 1px solid var(--ink03); vertical-align: middle; }
  .tbl tbody tr:last-child td { border-bottom: none; }
  .tbl tbody tr { transition: background .14s; cursor: default; }
  .tbl tbody tr:hover td { background: var(--warm); }
  .tbl tbody tr.inactive td { opacity: .5; }

  .col-id      { width: 56px; }
  .col-code    { width: 120px; }
  .col-name    { width: 150px; }
  .col-desc    { min-width: 240px; }
  .col-status  { width: 110px; }
  .col-date    { width: 120px; }
  .col-actions { width: 100px; text-align: right; }

  /* Cell styles */
  .cell-id {
    font-family: var(--mono); font-size: 11px; color: var(--ink30);
    font-weight: 400;
  }
  .code-tag {
    display: inline-flex; align-items: center;
    font-family: var(--mono); font-size: 10.5px; font-weight: 500;
    padding: 3px 9px; border-radius: 5px;
    background: var(--goldbg); border: 1px solid var(--goldbr); color: var(--gold);
    letter-spacing: .3px; white-space: nowrap;
  }
  .cell-name { font-size: 13px; font-weight: 700; color: var(--ink); letter-spacing: -.1px; }
  .cell-desc {
    font-size: 12px; color: var(--ink50); line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .cell-date {
    font-family: var(--mono); font-size: 11px; color: var(--ink40); white-space: nowrap;
  }

  /* Status badge */
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px; white-space: nowrap;
  }
  .status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .status-active   { background: var(--greenbg); border: 1px solid var(--greenbr); color: var(--green); }
  .status-inactive { background: var(--warm2);   border: 1px solid var(--ink10);   color: var(--ink40); }

  /* Row action buttons */
  .tbl-actions { display: flex; gap: 5px; justify-content: flex-end; }
  .act-btn {
    width: 30px; height: 30px; border-radius: var(--radius);
    background: transparent; border: 1px solid transparent;
    color: var(--ink30); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .act-btn:hover      { background: var(--warm2); border-color: var(--ink10); color: var(--ink60); }
  .act-btn.toggle:hover { background: var(--goldbg); border-color: var(--goldbr); color: var(--gold); }
  .act-btn.edit:hover { background: var(--bluebg); border-color: var(--bluebr); color: var(--blue); }
  .act-btn.del:hover  { background: var(--redbg);  border-color: var(--redbr);  color: var(--red); }

  /* ── GRID VIEW ── */
  .cat-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;
  }

  .cat-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--radius-xl); overflow: hidden;
    box-shadow: var(--shadow-xs); display: flex; flex-direction: column;
    transition: box-shadow .25s cubic-bezier(.16,1,.3,1), transform .25s cubic-bezier(.16,1,.3,1), border-color .2s;
    animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both;
    position: relative;
  }
  .cat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold) 0%, var(--goldl) 50%, transparent 100%);
    opacity: 0; transition: opacity .2s;
  }
  .cat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: var(--ink20); }
  .cat-card:hover::before { opacity: 1; }
  .cat-card.inactive { opacity: .5; }

  .cat-card-head {
    padding: 16px 18px 14px; border-bottom: 1px solid var(--ink06);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
  }
  .cat-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--goldbg); border: 1px solid var(--goldbr);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); flex-shrink: 0;
  }
  .cat-card-name {
    font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 5px;
    letter-spacing: -.1px;
  }

  .cat-card-body { padding: 14px 18px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  .cat-card-desc { font-size: 12px; color: var(--ink50); line-height: 1.6; flex: 1; }
  .cat-card-meta { display: flex; flex-wrap: wrap; gap: 5px; }
  .meta-pill {
    font-family: var(--mono); font-size: 9.5px; font-weight: 500;
    padding: 2px 9px; border-radius: 20px;
    background: var(--warm2); border: 1px solid var(--ink10); color: var(--ink40);
  }

  .cat-card-footer {
    padding: 10px 18px 14px; border-top: 1px solid var(--ink06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .cat-card-actions { display: flex; gap: 4px; }
  .card-date { font-family: var(--mono); font-size: 10px; color: var(--ink30); }

  /* ── EMPTY STATE ── */
  .empty-state {
    padding: 72px 32px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .empty-ico   {
    width: 64px; height: 64px; border-radius: 16px;
    background: var(--warm); border: 1px solid var(--ink10);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink20);
  }
  .empty-title { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--ink60); }
  .empty-sub   { font-size: 13px; color: var(--ink40); max-width: 300px; line-height: 1.65; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(27,23,19,.5);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; z-index: 1000;
    backdrop-filter: blur(3px);
    animation: fadeIn .2s ease both;
  }

  .modal {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--radius-xl); box-shadow: var(--shadow-lg);
    width: 100%; max-width: 500px; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    animation: slideIn .25s cubic-bezier(.16,1,.3,1) both;
  }
  .del-modal { max-width: 410px; }

  /* Modal header — dark band with gold serif title */
  .modal-head {
    padding: 20px 24px 18px;
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.2);
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .modal-head::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, var(--gold) 0%, var(--goldl) 40%, transparent 80%);
    opacity: .5;
  }
  .modal-eyebrow {
    font-family: var(--mono); font-size: 9px; font-weight: 700;
    letter-spacing: 2.2px; text-transform: uppercase;
    color: rgba(184,144,42,.65); margin-bottom: 5px;
  }
  .modal-title {
    font-family: var(--serif); font-size: 21px; font-weight: 600;
    color: #F6F3EC; line-height: 1.2;
  }
  .modal-close {
    width: 30px; height: 30px; border-radius: 6px;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    color: rgba(246,243,236,.35); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s; flex-shrink: 0;
  }
  .modal-close:hover { background: rgba(246,243,236,.12); color: rgba(246,243,236,.8); }

  .modal-body {
    padding: 22px 24px; overflow-y: auto; flex: 1;
    display: flex; flex-direction: column; gap: 16px;
  }
  .modal-body::-webkit-scrollbar { width: 3px; }
  .modal-body::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  /* Form fields */
  .field { display: flex; flex-direction: column; gap: 6px; }
  .label {
    font-family: var(--mono); font-size: 9.5px; font-weight: 700;
    letter-spacing: .8px; text-transform: uppercase; color: var(--ink40);
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .label-req  { color: var(--red); font-size: 13px; line-height: 1; }
  .label-hint {
    font-family: var(--sans); font-size: 10px; font-weight: 400;
    color: var(--ink20); letter-spacing: 0; text-transform: none;
  }
  .input, .textarea {
    width: 100%; padding: 10px 13px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: var(--radius); color: var(--ink);
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    outline: none; transition: all .2s; appearance: none;
  }
  .input::placeholder, .textarea::placeholder { color: var(--ink20); }
  .input:hover,    .textarea:hover    { border-color: var(--ink20); background: var(--paper); }
  .input:focus,    .textarea:focus    {
    border-color: var(--gold); background: var(--paper);
    box-shadow: 0 0 0 3px rgba(184,144,42,.1);
  }
  .input.error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(181,55,42,.08); }
  .input-mono  { font-family: var(--mono) !important; font-size: 12px !important; letter-spacing: .5px; }
  .textarea    { resize: vertical; min-height: 76px; line-height: 1.6; }
  .field-error {
    font-size: 11px; color: var(--red); font-weight: 600;
    display: flex; align-items: center; gap: 4px;
  }
  .char-count { font-family: var(--mono); font-size: 10px; color: var(--ink30); text-align: right; }

  .code-wrap { display: flex; gap: 7px; }
  .code-auto-btn {
    padding: 9px 13px; border-radius: var(--radius);
    font-size: 10.5px; font-weight: 700; cursor: pointer;
    font-family: var(--mono); border: 1.5px solid var(--ink10);
    background: var(--cream); color: var(--ink40);
    transition: all .15s; white-space: nowrap; flex-shrink: 0;
    letter-spacing: .5px; text-transform: uppercase;
  }
  .code-auto-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--goldbg); }

  /* Section divider inside modal */
  .m-section {
    font-family: var(--mono); font-size: 8.5px; font-weight: 700;
    letter-spacing: 2.2px; text-transform: uppercase; color: var(--ink30);
    display: flex; align-items: center; gap: 12px;
  }
  .m-section::after { content: ''; flex: 1; height: 1px; background: var(--ink06); }

  /* Toggle */
  .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .toggle-info .toggle-title {
    font-size: 12.5px; font-weight: 700; color: var(--ink); margin-bottom: 3px;
  }
  .toggle-info .toggle-desc { font-size: 11px; color: var(--ink40); line-height: 1.45; }
  .toggle { position: relative; width: 40px; height: 22px; flex-shrink: 0; cursor: pointer; }
  .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-track {
    position: absolute; inset: 0; border-radius: 11px;
    background: var(--ink10); transition: all .2s; border: 1px solid var(--ink20);
  }
  .toggle input:checked ~ .toggle-track { background: var(--green); border-color: #1D5A3F; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px; width: 14px; height: 14px;
    border-radius: 50%; background: #fff;
    transition: transform .2s cubic-bezier(.16,1,.3,1);
    box-shadow: 0 1px 4px rgba(27,23,19,.25);
  }
  .toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(18px); }

  /* Modal footer */
  .modal-footer {
    padding: 15px 24px; border-top: 1px solid var(--ink06);
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    background: var(--paper);
  }
  .modal-footer-hint {
    flex: 1; font-family: var(--mono); font-size: 9.5px; color: var(--ink30);
  }

  /* Delete modal body */
  .del-body {
    padding: 28px 24px; display: flex; flex-direction: column;
    gap: 14px; align-items: center; text-align: center;
  }
  .del-icon {
    width: 52px; height: 52px; border-radius: 12px;
    background: var(--redbg); border: 1px solid var(--redbr);
    display: flex; align-items: center; justify-content: center;
    color: var(--red);
  }
  .del-title { font-family: var(--serif); font-size: 21px; font-weight: 600; color: var(--ink); }
  .del-sub   { font-size: 12.5px; color: var(--ink50); line-height: 1.65; max-width: 290px; }
  .del-meta  {
    font-family: var(--mono); font-size: 10.5px; color: var(--ink40);
    padding: 8px 16px; background: var(--warm); border: 1px solid var(--ink10);
    border-radius: var(--radius); display: flex; gap: 20px;
  }
  .del-meta span { color: var(--ink); font-weight: 700; }
  .del-actions { display: flex; gap: 8px; width: 100%; margin-top: 4px; }

  /* Toast */
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(14px);
    background: var(--ink); border: 1px solid rgba(184,144,42,.25);
    border-radius: var(--radius); padding: 11px 20px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: var(--shadow-lg); z-index: 1200;
    opacity: 0; pointer-events: none;
    transition: all .28s cubic-bezier(.16,1,.3,1); white-space: nowrap;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
  .toast-dot  { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
  .toast-msg  { font-size: 13px; font-weight: 600; color: #F6F3EC; }
  .toast-sub  { font-size: 11px; color: rgba(184,144,42,.65); }

  /* Sort controls */
  .sort-wrap { display: flex; align-items: center; gap: 8px; }
  .sort-label {
    font-family: var(--mono); font-size: 9.5px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink40);
    white-space: nowrap;
  }
`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function CategoryManagement() {
  const [cats,       setCats]       = useState(INITIAL_CATEGORIES);
  const [search,     setSearch]     = useState("");
  const [statFilter, setStatFilter] = useState("all");
  const location = useLocation();
  const [sortKey,    setSortKey]    = useState("category_id");
  const [sortAsc,    setSortAsc]    = useState(true);
  const [view,       setView]       = useState("table");
  const [modalMode,  setModalMode]  = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [form,       setForm]       = useState(BLANK_FORM);
  const [errors,     setErrors]     = useState({});
  const [toast,      setToast]      = useState({ show: false, msg: "", sub: "" });
  const searchRef = useRef();

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setModalMode(null); setDelTarget(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const filtered = useMemo(() => {
    let list = [...cats];
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(c =>
      c.category_name.toLowerCase().includes(q) ||
      c.category_code.toLowerCase().includes(q) ||
      (c.category_description || "").toLowerCase().includes(q)
    );
    if (statFilter === "active")   list = list.filter(c =>  c.category_is_active);
    if (statFilter === "inactive") list = list.filter(c => !c.category_is_active);
    list.sort((a, b) => {
      let av = a[sortKey] ?? "", bv = b[sortKey] ?? "";
      if (typeof av === "boolean") { av = av ? 1 : 0; bv = bv ? 1 : 0; }
      if (typeof av === "string")  { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [cats, search, statFilter, sortKey, sortAsc]);

  const totalCats    = cats.length;
  const activeCats   = cats.filter(c =>  c.category_is_active).length;
  const inactiveCats = cats.filter(c => !c.category_is_active).length;

  // ── handlers ──
  const openAdd = () => { setForm({ ...BLANK_FORM }); setErrors({}); setModalMode("add"); setEditTarget(null); };

  const openEdit = (cat) => {
    setEditTarget(cat.category_id);
    setForm({
      category_name: cat.category_name,
      category_code: cat.category_code,
      codeAuto: false,
      category_description: cat.category_description || "",
      category_is_active: cat.category_is_active,
    });
    setErrors({});
    setModalMode("edit");
  };

  const updateForm = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === "category_name" && f.codeAuto) next.category_code = toCode(val);
      if (key === "category_code") next.codeAuto = false;
      if (key === "codeAuto" && val) next.category_code = toCode(f.category_name);
      return next;
    });
    setErrors(e => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.category_name.trim())
      e.category_name = "category_name is required";
    if (!form.category_code.trim())
      e.category_code = "category_code is required";
    if (cats.some(c => c.category_code === form.category_code.trim() && c.category_id !== editTarget))
      e.category_code = "category_code already exists (UNIQUE)";
    if (cats.some(c => c.category_name === form.category_name.trim() && c.category_id !== editTarget))
      e.category_name = "category_name already exists (UNIQUE)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const now = new Date().toISOString();
    if (modalMode === "add") {
      const newCat = {
        category_id: Date.now(),
        category_code: form.category_code.trim(),
        category_name: form.category_name.trim(),
        category_description: form.category_description.trim() || null,
        category_is_active: form.category_is_active,
        category_created_at: now,
        category_updated_at: now,
      };
      setCats(c => [...c, newCat]);
      showToast("Category created", newCat.category_name);
    } else {
      setCats(c => c.map(cat =>
        cat.category_id === editTarget
          ? { ...cat, category_code: form.category_code.trim(), category_name: form.category_name.trim(),
              category_description: form.category_description.trim() || null,
              category_is_active: form.category_is_active, category_updated_at: now }
          : cat
      ));
      showToast("Category updated", form.category_name.trim());
    }
    setModalMode(null);
  };

  const handleDelete = () => {
    const cat = cats.find(c => c.category_id === delTarget);
    setCats(c => c.filter(x => x.category_id !== delTarget));
    setDelTarget(null);
    showToast("Category deleted", cat?.category_name || "");
  };

  const toggleActive = (id, e) => {
    e?.stopPropagation();
    const now = new Date().toISOString();
    setCats(c => c.map(cat =>
      cat.category_id === id
        ? { ...cat, category_is_active: !cat.category_is_active, category_updated_at: now }
        : cat
    ));
  };

  const showToast = (msg, sub = "") => {
    setToast({ show: true, msg, sub });
    setTimeout(() => setToast({ show: false, msg: "", sub: "" }), 2800);
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ── sub-components ──
  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ArrowUpDown size={9} style={{ opacity: .25, marginLeft: 3 }} />;
    return sortAsc
      ? <ArrowUp size={9} style={{ marginLeft: 3 }} />
      : <ArrowDown size={9} style={{ marginLeft: 3 }} />;
  };

  const StatusBadge = ({ active }) => (
    <span className={`status-badge ${active ? "status-active" : "status-inactive"}`}>
      <span className="status-dot" style={{ background: active ? "var(--green)" : "var(--ink30)" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );

  // ── form modal ──
  const renderFormModal = () => (
    <div className="modal-overlay" onClick={() => setModalMode(null)}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">
              {modalMode === "add" ? "New Record · category" : "Edit Record · category"}
            </div>
            <div className="modal-title">
              {modalMode === "add" ? "Add Category" : `Edit — ${form.category_name || "…"}`}
            </div>
          </div>
          <button className="modal-close" onClick={() => setModalMode(null)}><X size={14} /></button>
        </div>

        <div className="modal-body">
          <div className="m-section">Identity</div>

          <div className="field">
            <label className="label">
              Category Name <span className="label-req">*</span>
              <span className="label-hint">String(100) · UNIQUE · NOT NULL</span>
            </label>
            <input
              className={`input${errors.category_name ? " error" : ""}`}
              placeholder="e.g. Electronics"
              value={form.category_name}
              onChange={e => updateForm("category_name", e.target.value)}
              maxLength={100}
              autoFocus
            />
            {errors.category_name && (
              <span className="field-error">
                <CircleAlert size={11} /> {errors.category_name}
              </span>
            )}
          </div>

          <div className="field">
            <label className="label">
              Category Code <span className="label-req">*</span>
              <span className="label-hint">String(50) · UNIQUE · {form.codeAuto ? "auto-generated" : "manual"}</span>
            </label>
            <div className="code-wrap">
              <input
                className={`input input-mono${errors.category_code ? " error" : ""}`}
                placeholder="ELEC-001"
                value={form.category_code}
                onChange={e => updateForm("category_code", toCode(e.target.value))}
                maxLength={50}
              />
              <button className="code-auto-btn" onClick={() => updateForm("codeAuto", !form.codeAuto)}>
                {form.codeAuto ? "Manual" : "Auto"}
              </button>
            </div>
            {errors.category_code && (
              <span className="field-error">
                <CircleAlert size={11} /> {errors.category_code}
              </span>
            )}
          </div>

          <div className="field">
            <label className="label">
              Description
              <span className="label-hint">String(255) · nullable</span>
            </label>
            <textarea
              className="textarea"
              placeholder="Brief description of this category…"
              rows={3}
              maxLength={255}
              value={form.category_description}
              onChange={e => updateForm("category_description", e.target.value)}
            />
            <span className="char-count">{form.category_description.length} / 255</span>
          </div>

          <div className="m-section">Visibility</div>

          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-title">Active Status</div>
              <div className="toggle-desc">Boolean · DEFAULT true — visible and usable in POS</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.category_is_active}
                onChange={e => updateForm("category_is_active", e.target.checked)}
              />
              <div className="toggle-track"><div className="toggle-thumb" /></div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <span className="modal-footer-hint">
            {modalMode === "add"
              ? "created_at & updated_at → datetime.utcnow()"
              : "updated_at → datetime.utcnow()"}
          </span>
          <button className="btn btn-ghost" onClick={() => setModalMode(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {modalMode === "add" ? "Create Category" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── delete modal ──
  const renderDeleteModal = () => {
    const cat = cats.find(c => c.category_id === delTarget);
    if (!cat) return null;
    return (
      <div className="modal-overlay" onClick={() => setDelTarget(null)}>
        <div className="modal del-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-head">
            <div>
              <div className="modal-eyebrow">Destructive Action · Permanent</div>
              <div className="modal-title">Delete Category</div>
            </div>
            <button className="modal-close" onClick={() => setDelTarget(null)}><X size={14} /></button>
          </div>
          <div className="del-body">
            <div className="del-icon"><Trash2 size={22} /></div>
            <div className="del-title">Delete "{cat.category_name}"?</div>
            <div className="del-meta">
              <span>ID: <span>#{cat.category_id}</span></span>
              <span>Code: <span>{cat.category_code}</span></span>
            </div>
            <div className="del-sub">
              This permanently removes the record from the <code>category</code> table.
              Any products linked to this category will lose their reference. This cannot be undone.
            </div>
            <div className="del-actions">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDelTarget(null)}>Cancel</button>
              <button className="btn btn-red"   style={{ flex: 1 }} onClick={handleDelete}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── empty state ──
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-ico"><FolderOpen size={28} strokeWidth={1.4} /></div>
      <div className="empty-title">No categories found</div>
      <div className="empty-sub">Adjust your search or status filter to find what you're looking for.</div>
      <button className="btn btn-ghost" onClick={() => { setSearch(""); setStatFilter("all"); }}>
        Clear filters
      </button>
    </div>
  );

  // ── render ──
  return (
    <DashboardLayout
      appName="Nexus POS"
      notifications={[]}
      showLive
      showFullscreen
      showLogout
      leftNavItems={getLeftNavAdmin(location.pathname)}
      leftNavBottom={LEFT_NAV_BOTTOM_ADMIN}
      rightNavItems={getRightNavAdmin()}
    >
      <>
        <style>{STYLES}</style>
        <div className="shell">
          <div className="content">

            {/* ── PAGE HEADER ── */}
            <div className="page-header">
              <div>
                <div className="page-eyebrow">Inventory · category table</div>
                <div className="page-title">Category Management</div>
                <div className="page-sub">
                  {totalCats} total categories &nbsp;·&nbsp; {activeCats} active &nbsp;·&nbsp; {inactiveCats} inactive
                </div>
              </div>
              <div className="page-actions">
                <button className="btn btn-ghost"><Download size={13} /> Export</button>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={13} /> Add Category</button>
              </div>
            </div>

            {/* ── STAT STRIP ── */}
            <div className="stat-strip">
              {[
                { label: "Total",    val: totalCats,    sub: "all categories",    color: "var(--gold)",  num: totalCats },
                { label: "Active",   val: activeCats,   sub: "is_active = true",  color: "var(--green)", num: activeCats },
                { label: "Inactive", val: inactiveCats, sub: "is_active = false", color: "var(--red)",   num: inactiveCats },
              ].map(s => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{ "--sc": s.color }}
                  data-num={s.num}
                >
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* ── FILTER BAR ── */}
            <div className="filter-bar">
              {/* Search */}
              <div className="filter-group" style={{ flex: 1 }}>
                <div className="filter-lbl">Search</div>
                <div className="search-wrap">
                  <Search size={13} className="search-ico" />
                  <input
                    ref={searchRef}
                    className="search-input"
                    placeholder="name, code or description…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="search-clear" onClick={() => { setSearch(""); searchRef.current.focus(); }}>
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status filter */}
              <div className="filter-group">
                <div className="filter-lbl">Status</div>
                <div className="filter-select-wrap">
                  <select
                    className="filter-select"
                    value={statFilter}
                    onChange={e => setStatFilter(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                  </select>
                  <ChevronRight size={10} className="filter-arrow" style={{ transform: "translateY(-50%) rotate(90deg)" }} />
                </div>
              </div>

              <div className="filter-divider" />

              {/* View toggle */}
              <div className="filter-group">
                <div className="filter-lbl">View</div>
                <div className="view-toggle">
                  <button
                    className={`view-btn${view === "grid"  ? " active" : ""}`}
                    onClick={() => setView("grid")}
                    title="Grid view"
                  ><LayoutGrid size={14} /></button>
                  <button
                    className={`view-btn${view === "table" ? " active" : ""}`}
                    onClick={() => setView("table")}
                    title="Table view"
                  ><List size={14} /></button>
                </div>
              </div>
            </div>

            {/* ── RESULTS + SORT BAR ── */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>{filtered.length}</strong> of <strong>{cats.length}</strong> categories
              </div>
              <div className="sort-wrap">
                <span className="sort-label">Sort</span>
                <div className="filter-select-wrap">
                  <select
                    className="filter-select"
                    style={{ minWidth: 170, fontSize: 11 }}
                    value={sortKey}
                    onChange={e => { setSortKey(e.target.value); setSortAsc(true); }}
                  >
                    <option value="category_id">ID</option>
                    <option value="category_code">Code</option>
                    <option value="category_name">Name</option>
                    <option value="category_is_active">Status</option>
                    <option value="category_created_at">Created</option>
                    <option value="category_updated_at">Updated</option>
                  </select>
                  <ChevronRight size={10} className="filter-arrow" style={{ transform: "translateY(-50%) rotate(90deg)" }} />
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "7px 11px" }}
                  onClick={() => setSortAsc(v => !v)}
                  title={sortAsc ? "Ascending" : "Descending"}
                >
                  {sortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                </button>
              </div>
            </div>

            {/* ── TABLE VIEW ── */}
            {view === "table" && (
              <div className="table-wrap">
                {filtered.length === 0 ? <EmptyState /> : (
                  <table className="tbl">
                    <thead>
                      <tr>
                        {[
                          { key: "category_id",         label: "ID",         cls: "col-id"      },
                          { key: "category_code",       label: "Code",       cls: "col-code"    },
                          { key: "category_name",       label: "Name",       cls: "col-name"    },
                          { key: null,                  label: "Description",cls: "col-desc"    },
                          { key: "category_is_active",  label: "Status",     cls: "col-status"  },
                          { key: "category_created_at", label: "Created",    cls: "col-date"    },
                          { key: "category_updated_at", label: "Updated",    cls: "col-date"    },
                          { key: null,                  label: "Actions",    cls: "col-actions" },
                        ].map(({ key, label, cls }) => (
                          <th
                            key={label}
                            className={`${cls}${key && sortKey === key ? " sorted" : ""}`}
                            onClick={() => key && toggleSort(key)}
                            style={!key ? { cursor: "default" } : {}}
                          >
                            {label}
                            {key && <SortIcon k={key} />}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((cat, i) => (
                        <tr
                          key={cat.category_id}
                          className={!cat.category_is_active ? "inactive" : ""}
                          style={{ animationDelay: `${i * 20}ms` }}
                        >
                          <td className="col-id">
                            <span className="cell-id">#{cat.category_id}</span>
                          </td>
                          <td className="col-code">
                            <span className="code-tag">{cat.category_code}</span>
                          </td>
                          <td className="col-name">
                            <span className="cell-name">{cat.category_name}</span>
                          </td>
                          <td className="col-desc">
                            <span className="cell-desc">
                              {cat.category_description ||
                                <span style={{ color: "var(--ink20)", fontStyle: "italic" }}>No description</span>}
                            </span>
                          </td>
                          <td className="col-status">
                            <StatusBadge active={cat.category_is_active} />
                          </td>
                          <td className="col-date">
                            <span className="cell-date">{fmtDate(cat.category_created_at)}</span>
                          </td>
                          <td className="col-date">
                            <span className="cell-date">{fmtDate(cat.category_updated_at)}</span>
                          </td>
                          <td className="col-actions">
                            <div className="tbl-actions">
                              <button
                                className="act-btn toggle"
                                title={cat.category_is_active ? "Set inactive" : "Set active"}
                                onClick={e => toggleActive(cat.category_id, e)}
                              >
                                {cat.category_is_active
                                  ? <CircleMinus size={14} />
                                  : <CirclePlus size={14} />}
                              </button>
                              <button
                                className="act-btn edit"
                                title="Edit"
                                onClick={() => openEdit(cat)}
                              ><Pencil size={13} /></button>
                              <button
                                className="act-btn del"
                                title="Delete"
                                onClick={() => setDelTarget(cat.category_id)}
                              ><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {view === "grid" && (
              filtered.length === 0
                ? <div className="table-wrap"><EmptyState /></div>
                : (
                  <div className="cat-grid">
                    {filtered.map((cat, i) => (
                      <div
                        key={cat.category_id}
                        className={`cat-card${!cat.category_is_active ? " inactive" : ""}`}
                        style={{ animationDelay: `${i * 35}ms` }}
                      >
                        <div className="cat-card-head">
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
                            <div className="cat-icon"><Tag size={16} strokeWidth={1.8} /></div>
                            <div style={{ minWidth: 0 }}>
                              <div className="cat-card-name">{cat.category_name}</div>
                              <span className="code-tag">{cat.category_code}</span>
                            </div>
                          </div>
                          <StatusBadge active={cat.category_is_active} />
                        </div>

                        <div className="cat-card-body">
                          {cat.category_description && (
                            <div className="cat-card-desc">{cat.category_description}</div>
                          )}
                          <div className="cat-card-meta">
                            <span className="meta-pill">ID #{cat.category_id}</span>
                            <span className="meta-pill">created {fmtDate(cat.category_created_at)}</span>
                          </div>
                        </div>

                        <div className="cat-card-footer">
                          <span className="card-date">updated {fmtDate(cat.category_updated_at)}</span>
                          <div className="cat-card-actions">
                            <button
                              className="act-btn toggle"
                              title={cat.category_is_active ? "Deactivate" : "Activate"}
                              onClick={e => toggleActive(cat.category_id, e)}
                            >
                              {cat.category_is_active ? <CircleMinus size={14} /> : <CirclePlus size={14} />}
                            </button>
                            <button className="act-btn edit" title="Edit" onClick={() => openEdit(cat)}>
                              <Pencil size={13} />
                            </button>
                            <button className="act-btn del" title="Delete" onClick={() => setDelTarget(cat.category_id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}

          </div>

          {/* ── MODALS ── */}
          {modalMode  && renderFormModal()}
          {delTarget  && renderDeleteModal()}

          {/* ── TOAST ── */}
          <div className={`toast${toast.show ? " show" : ""}`}>
            <span className="toast-dot" />
            <span className="toast-msg">{toast.msg}</span>
            {toast.sub && <span className="toast-sub">· {toast.sub}</span>}
          </div>
        </div>
      </>
    </DashboardLayout>
  );
}