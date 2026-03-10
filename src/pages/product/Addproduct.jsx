import { useState, useRef, useCallback } from "react";

// ── STYLES ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Geist+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F6F3EC;
    --paper: #FDFBF7;
    --warm:  #F0EBE0;
    --warm2: #E8E2D4;

    --ink:   #1B1713;
    --ink80: #2E2720;
    --ink60: #4B4038;
    --ink50: #6B5F54;
    --ink40: #9E9080;
    --ink30: #B8AFA4;
    --ink20: #CFC8BC;
    --ink10: #E4DDD2;
    --ink06: #EDE8E0;
    --ink03: #F5F1EB;

    --gold:    #B8902A;
    --goldl:   #D4A83C;
    --goldd:   #8A6A1A;
    --goldbg:  rgba(184,144,42,.07);
    --goldbr:  rgba(184,144,42,.22);

    --green:   #2D6A4F;
    --greenl:  #3D8A65;
    --greenbg: rgba(45,106,79,.07);
    --greenbr: rgba(45,106,79,.22);

    --red:     #B5372A;
    --redbg:   rgba(181,55,42,.07);
    --redbr:   rgba(181,55,42,.2);

    --blue:    #2B5490;
    --bluebg:  rgba(43,84,144,.07);
    --bluebr:  rgba(43,84,144,.22);

    --purple:  #5B3D8F;
    --purplebg:rgba(91,61,143,.07);
    --purplebr:rgba(91,61,143,.22);

    --shadow-xs: 0 1px 2px rgba(27,23,19,.04);
    --shadow-sm: 0 2px 8px rgba(27,23,19,.06), 0 1px 2px rgba(27,23,19,.04);
    --shadow-md: 0 6px 20px rgba(27,23,19,.09), 0 2px 4px rgba(27,23,19,.05);
    --shadow-lg: 0 16px 48px rgba(27,23,19,.13), 0 4px 12px rgba(27,23,19,.07);

    --topbar-h: 60px;
    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 14px;
  }

  html, body, #root { height: 100%; background: var(--cream); overflow: hidden; }

  .shell {
    display: flex; flex-direction: column; height: 100vh;
    font-family: 'Outfit', sans-serif;
    color: var(--ink);
    background: var(--cream);
    background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(184,144,42,.05) 0%, transparent 60%);
  }

  /* ══ TOPBAR ══ */
  .topbar {
    height: var(--topbar-h); flex-shrink: 0;
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.35);
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
    border: 1.5px solid rgba(184,144,42,.45);
    background: rgba(184,144,42,.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 700; color: var(--goldl);
  }
  .brand-text { display: flex; flex-direction: column; gap: 1px; }
  .brand-name { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; color: #F6F3EC; letter-spacing: .2px; line-height: 1; }
  .brand-sub  { font-size: 9px; font-weight: 600; letter-spacing: 2.2px; text-transform: uppercase; color: rgba(184,144,42,.7); line-height: 1; }

  .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 500; }
  .bc-sep    { color: rgba(246,243,236,.15); font-size: 10px; }
  .bc-link   { color: rgba(246,243,236,.3); cursor: pointer; transition: color .15s; }
  .bc-link:hover { color: rgba(246,243,236,.65); }
  .bc-active { color: rgba(246,243,236,.75); font-weight: 600; }

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
    color: var(--goldl); cursor: pointer; transition: border-color .18s; letter-spacing: .3px;
  }
  .avatar:hover { border-color: rgba(184,144,42,.55); }

  .vdiv { width: 1px; height: 22px; background: rgba(246,243,236,.08); }

  /* ══ CONTENT ══ */
  .content {
    flex: 1; overflow-y: auto;
    padding: 24px 28px 40px;
    display: flex; flex-direction: column; gap: 20px;
  }
  .content::-webkit-scrollbar { width: 3px; }
  .content::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  /* ══ PAGE HEADER ══ */
  .page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    animation: fadeUp .35s ease both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

  .page-title-block {}
  .page-eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;
  }
  .page-eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--gold); opacity: .5; }
  .page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 600; color: var(--ink);
    letter-spacing: -.2px; line-height: 1; margin-bottom: 6px;
  }
  .page-desc { font-size: 13px; color: var(--ink40); font-weight: 400; }

  .page-actions { display: flex; gap: 10px; align-items: center; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: var(--r-sm);
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .2s; font-family: 'Outfit', sans-serif;
    letter-spacing: .2px; border: 1px solid transparent;
  }
  .btn-ghost {
    background: transparent; border-color: var(--ink10); color: var(--ink50);
  }
  .btn-ghost:hover { border-color: var(--ink20); color: var(--ink60); background: var(--warm); }

  .btn-gold {
    background: var(--gold); border-color: var(--goldd);
    color: #fff;
    box-shadow: 0 2px 8px rgba(184,144,42,.3), 0 1px 2px rgba(184,144,42,.2);
  }
  .btn-gold:hover {
    background: var(--goldl); border-color: var(--gold);
    box-shadow: 0 4px 16px rgba(184,144,42,.4), 0 1px 3px rgba(184,144,42,.25);
    transform: translateY(-1px);
  }
  .btn-gold:active { transform: none; }

  .btn-green {
    background: var(--green); border-color: #205038;
    color: #fff;
    box-shadow: 0 2px 8px rgba(45,106,79,.3);
  }
  .btn-green:hover {
    background: var(--greenl);
    box-shadow: 0 4px 16px rgba(45,106,79,.35);
    transform: translateY(-1px);
  }

  /* ══ FORM LAYOUT ══ */
  .form-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

  /* ══ CARD ══ */
  .card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--r-md); box-shadow: var(--shadow-xs);
    overflow: hidden;
    animation: fadeUp .4s ease both;
  }
  .card-header {
    padding: 18px 22px 16px;
    border-bottom: 1px solid var(--ink06);
    display: flex; align-items: center; gap: 13px;
  }
  .card-header-icon {
    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 600; color: var(--ink);
    letter-spacing: .1px; line-height: 1.1; margin-bottom: 2px;
  }
  .card-sub { font-size: 11px; color: var(--ink40); }

  .card-body { padding: 22px; display: flex; flex-direction: column; gap: 18px; }

  /* ══ FORM ELEMENTS ══ */
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field-row { display: grid; gap: 14px; }
  .field-row-2 { grid-template-columns: 1fr 1fr; }
  .field-row-3 { grid-template-columns: 1fr 1fr 1fr; }

  .label {
    font-size: 11px; font-weight: 700; letter-spacing: .8px;
    text-transform: uppercase; color: var(--ink50);
    display: flex; align-items: center; gap: 6px;
  }
  .label-req { color: var(--red); font-size: 13px; line-height: 1; }
  .label-hint { font-size: 10px; font-weight: 400; color: var(--ink30); letter-spacing: 0; text-transform: none; }

  .input, .textarea, .select {
    width: 100%; padding: 10px 13px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: var(--r-sm); color: var(--ink);
    font-size: 13.5px; font-weight: 500;
    font-family: 'Outfit', sans-serif;
    outline: none; transition: all .18s;
    appearance: none;
  }
  .input::placeholder, .textarea::placeholder { color: var(--ink20); font-weight: 400; }
  .input:hover, .textarea:hover, .select:hover { border-color: var(--ink20); background: var(--paper); }
  .input:focus, .textarea:focus, .select:focus {
    border-color: var(--gold);
    background: var(--paper);
    box-shadow: 0 0 0 3px rgba(184,144,42,.1);
  }
  .input.error, .textarea.error, .select.error {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(181,55,42,.08);
  }

  .input-prefix-wrap { position: relative; }
  .input-prefix {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-family: 'Geist Mono', monospace;
    font-size: 13px; font-weight: 500; color: var(--ink40);
    pointer-events: none; user-select: none;
  }
  .input-prefix-wrap .input { padding-left: 24px; }

  .input-suffix-wrap { position: relative; }
  .input-suffix {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 11px; font-weight: 600; color: var(--ink30);
    pointer-events: none; user-select: none;
  }
  .input-suffix-wrap .input { padding-right: 44px; }

  .select-wrap { position: relative; }
  .select-arrow {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    font-size: 10px; color: var(--ink30); pointer-events: none;
  }

  .textarea { resize: vertical; min-height: 90px; line-height: 1.55; }

  .field-error { font-size: 11px; color: var(--red); font-weight: 500; display: flex; align-items: center; gap: 5px; }
  .field-hint  { font-size: 11px; color: var(--ink30); }

  /* SKU preview */
  .sku-preview {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 13px;
    background: var(--ink); border-radius: var(--r-sm);
    border: 1px solid rgba(184,144,42,.2);
  }
  .sku-preview-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink40); }
  .sku-preview-value { font-family: 'Geist Mono', monospace; font-size: 13px; font-weight: 600; color: var(--goldl); letter-spacing: 1px; }

  /* ══ DIVIDER ══ */
  .hdivider { height: 1px; background: var(--ink06); margin: 2px 0; }
  .section-label {
    font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--ink30); display: flex; align-items: center; gap: 10px; margin-bottom: 2px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--ink06); }

  /* ══ IMAGE UPLOAD ══ */
  .upload-zone {
    border: 2px dashed var(--ink10); border-radius: var(--r-md);
    background: var(--warm); padding: 32px 20px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    cursor: pointer; transition: all .2s; text-align: center;
    position: relative;
  }
  .upload-zone:hover { border-color: var(--gold); background: var(--goldbg); }
  .upload-zone.drag-over { border-color: var(--gold); background: rgba(184,144,42,.1); transform: scale(1.01); }

  .upload-ico {
    width: 52px; height: 52px; border-radius: 12px;
    background: var(--paper); border: 1px solid var(--ink10);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; box-shadow: var(--shadow-xs);
    transition: transform .2s;
  }
  .upload-zone:hover .upload-ico { transform: translateY(-3px); box-shadow: var(--shadow-sm); }

  .upload-title { font-size: 13.5px; font-weight: 600; color: var(--ink); }
  .upload-sub   { font-size: 11px; color: var(--ink40); line-height: 1.5; }
  .upload-types { display: flex; gap: 6px; }
  .upload-type-tag {
    padding: 3px 9px; border-radius: 20px;
    background: var(--paper); border: 1px solid var(--ink10);
    font-size: 10px; font-weight: 700; color: var(--ink40);
    font-family: 'Geist Mono', monospace;
  }

  /* Image preview grid */
  .img-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 4px; }
  .img-preview-cell {
    aspect-ratio: 1; border-radius: 8px; overflow: hidden;
    border: 1.5px solid var(--ink10); background: var(--warm);
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .img-preview-cell img { width: 100%; height: 100%; object-fit: cover; }
  .img-remove {
    position: absolute; top: 5px; right: 5px;
    width: 20px; height: 20px; border-radius: 50%;
    background: rgba(27,23,19,.65); color: #fff;
    border: none; cursor: pointer; font-size: 11px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .15s;
  }
  .img-preview-cell:hover .img-remove { opacity: 1; }
  .img-add-cell {
    aspect-ratio: 1; border-radius: 8px;
    border: 2px dashed var(--ink10); background: var(--warm);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 22px; color: var(--ink20);
    transition: all .18s;
  }
  .img-add-cell:hover { border-color: var(--gold); color: var(--gold); background: var(--goldbg); }

  /* ══ TOGGLE SWITCH ══ */
  .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .toggle-info { flex: 1; }
  .toggle-title { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .toggle-desc  { font-size: 11px; color: var(--ink40); line-height: 1.4; }
  .toggle {
    position: relative; width: 42px; height: 24px; flex-shrink: 0; cursor: pointer;
  }
  .toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-track {
    position: absolute; inset: 0; border-radius: 12px;
    background: var(--ink10); transition: all .2s;
    border: 1.5px solid var(--ink10);
  }
  .toggle input:checked ~ .toggle-track { background: var(--green); border-color: #205038; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; transition: transform .2s cubic-bezier(.16,1,.3,1);
    box-shadow: 0 1px 3px rgba(27,23,19,.2);
  }
  .toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(18px); }

  /* ══ BADGE/TAG INPUT ══ */
  .tag-input-wrap {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 8px 10px; min-height: 44px;
    background: var(--cream); border: 1.5px solid var(--ink10);
    border-radius: var(--r-sm); transition: all .18s; cursor: text;
  }
  .tag-input-wrap:focus-within { border-color: var(--gold); background: var(--paper); box-shadow: 0 0 0 3px rgba(184,144,42,.1); }
  .tag-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    background: var(--goldbg); border: 1px solid var(--goldbr);
    color: var(--gold); font-size: 12px; font-weight: 600;
  }
  .tag-remove { background: none; border: none; cursor: pointer; color: var(--gold); opacity: .6; font-size: 13px; line-height: 1; padding: 0; transition: opacity .15s; }
  .tag-remove:hover { opacity: 1; }
  .tag-input-field {
    border: none; background: none; outline: none; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--ink); flex: 1; min-width: 80px;
    padding: 1px 3px;
  }
  .tag-input-field::placeholder { color: var(--ink20); }

  /* ══ VARIANT TABLE ══ */
  .variant-table { border: 1px solid var(--ink10); border-radius: var(--r-sm); overflow: hidden; }
  .variant-head {
    display: grid; grid-template-columns: 1fr 100px 100px 80px 36px;
    gap: 8px; padding: 9px 13px;
    background: var(--warm); border-bottom: 1px solid var(--ink10);
    font-size: 9.5px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--ink40);
  }
  .variant-row {
    display: grid; grid-template-columns: 1fr 100px 100px 80px 36px;
    gap: 8px; padding: 8px 13px; align-items: center;
    border-bottom: 1px solid var(--ink06); transition: background .12s;
  }
  .variant-row:last-child { border-bottom: none; }
  .variant-row:hover { background: var(--warm); }
  .variant-input {
    width: 100%; padding: 6px 9px;
    background: transparent; border: 1px solid transparent;
    border-radius: 5px; font-family: 'Outfit', sans-serif;
    font-size: 12.5px; color: var(--ink); outline: none; transition: all .15s;
  }
  .variant-input:focus { background: var(--cream); border-color: var(--gold); box-shadow: 0 0 0 2px rgba(184,144,42,.1); }
  .variant-input.mono { font-family: 'Geist Mono', monospace; font-size: 12px; }
  .variant-del {
    width: 28px; height: 28px; border-radius: 6px;
    border: 1px solid transparent; background: transparent;
    color: var(--ink20); cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .variant-del:hover { background: var(--redbg); border-color: var(--redbr); color: var(--red); }

  .add-variant-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 13px; width: 100%;
    border: 1px dashed var(--ink10); border-radius: var(--r-sm);
    background: transparent; color: var(--ink40);
    font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: all .18s;
  }
  .add-variant-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--goldbg); }

  /* ══ STATUS SELECTOR ══ */
  .status-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
  .status-opt {
    display: flex; flex-direction: column; align-items: center; gap: 7px;
    padding: 12px 8px; border-radius: var(--r-sm);
    border: 1.5px solid var(--ink10); background: var(--warm);
    cursor: pointer; transition: all .18s; text-align: center;
  }
  .status-opt:hover { border-color: var(--ink20); background: var(--paper); }
  .status-opt.selected { border-color: var(--status-c); background: var(--status-bg); box-shadow: 0 0 0 1px var(--status-c); }
  .status-dot-lg { width: 10px; height: 10px; border-radius: 50%; }
  .status-lbl    { font-size: 11.5px; font-weight: 700; color: var(--ink); }
  .status-desc   { font-size: 10px; color: var(--ink40); line-height: 1.3; }

  /* ══ SUMMARY PANEL ══ */
  .summary-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: var(--r-md); box-shadow: var(--shadow-xs);
    overflow: hidden; position: sticky; top: 0;
    animation: fadeUp .45s ease both;
  }
  .summary-top {
    background: var(--ink); padding: 16px 18px;
    border-bottom: 1px solid rgba(184,144,42,.2);
  }
  .summary-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 600; color: #F6F3EC; margin-bottom: 2px;
  }
  .summary-sub { font-size: 10.5px; color: rgba(246,243,236,.3); }
  .summary-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }

  .summary-preview {
    border-radius: 8px; overflow: hidden;
    border: 1px solid var(--ink10);
    background: var(--warm); aspect-ratio: 4/3;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; position: relative; margin-bottom: 4px;
  }
  .summary-preview img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .summary-preview-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .summary-preview-hint { font-size: 10.5px; color: var(--ink30); font-weight: 500; }

  .summary-name { font-size: 15px; font-weight: 700; color: var(--ink); line-height: 1.3; min-height: 20px; }
  .summary-sku  { font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--gold); margin-top: 3px; letter-spacing: .8px; }
  .summary-cat  { font-size: 11.5px; color: var(--ink40); margin-top: 1px; }

  .summary-divider { height: 1px; background: var(--ink06); }

  .summary-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .summary-row-label { font-size: 11px; color: var(--ink40); font-weight: 500; }
  .summary-row-value { font-family: 'Geist Mono', monospace; font-size: 12.5px; font-weight: 600; color: var(--ink); }
  .summary-price-big {
    font-family: 'Geist Mono', monospace;
    font-size: 28px; font-weight: 600; color: var(--green);
    line-height: 1; letter-spacing: -1px;
  }

  .progress-steps { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
  .progress-step { display: flex; align-items: center; gap: 10px; }
  .pstep-dot {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700;
  }
  .pstep-dot.done  { background: var(--greenbg); border: 1.5px solid var(--greenbr); color: var(--green); }
  .pstep-dot.empty { background: var(--warm2);   border: 1.5px solid var(--ink10);   color: var(--ink20); }
  .pstep-label { font-size: 12px; font-weight: 500; }
  .pstep-label.done  { color: var(--ink60); }
  .pstep-label.empty { color: var(--ink30); }

  .submit-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, var(--gold), var(--goldl));
    border: none; border-radius: var(--r-sm);
    color: #fff; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    letter-spacing: .3px; transition: all .22s;
    box-shadow: 0 4px 16px rgba(184,144,42,.35);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn:hover {
    box-shadow: 0 6px 24px rgba(184,144,42,.45);
    transform: translateY(-2px);
  }
  .submit-btn:active { transform: none; }
  .submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  .draft-btn {
    width: 100%; padding: 10px;
    background: transparent; border: 1.5px solid var(--ink10);
    border-radius: var(--r-sm); color: var(--ink50);
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: all .18s; margin-top: 8px;
  }
  .draft-btn:hover { border-color: var(--ink20); background: var(--warm); color: var(--ink60); }

  /* ══ TOAST ══ */
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: var(--ink); border: 1px solid rgba(184,144,42,.3);
    border-radius: 10px; padding: 12px 20px;
    display: flex; align-items: center; gap: 11px;
    box-shadow: var(--shadow-lg); z-index: 1000;
    opacity: 0; pointer-events: none;
    transition: all .3s cubic-bezier(.16,1,.3,1);
    white-space: nowrap;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
  .toast-icon { font-size: 16px; }
  .toast-msg  { font-size: 13px; font-weight: 600; color: #F6F3EC; }
  .toast-sub  { font-size: 11.5px; color: rgba(246,243,236,.4); margin-left: 4px; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1100px) {
    .form-grid { grid-template-columns: 1fr; }
    .summary-card { position: static; }
  }
  @media (max-width: 720px) {
    .field-row-2, .field-row-3 { grid-template-columns: 1fr; }
    .content { padding: 16px; }
    .status-grid { grid-template-columns: 1fr 1fr; }
    .variant-head, .variant-row { grid-template-columns: 1fr 80px 80px 64px 36px; }
  }
`;

const CATEGORIES = ["Electronics", "Apparel", "Accessories", "Home", "Lifestyle", "Stationery", "Sports", "Beauty", "Toys", "Food & Drink"];
const BRANDS     = ["Nexus", "OEM", "Generic", "Apple", "Samsung", "Sony", "Logitech", "Anker", "Custom"];
const SUPPLIERS  = ["Global Imports Ltd", "TechDist Co.", "FabricWorld", "HomeGoods Inc.", "DirectSource"];
const UNITS      = ["piece", "pair", "set", "box", "kg", "litre", "metre"];
const TAX_RATES  = ["0%", "5%", "10%", "15%", "20%"];

export default function AddProduct() {
  // Core fields
  const [name,        setName]        = useState("");
  const [sku,         setSku]         = useState("");
  const [skuAuto,     setSkuAuto]     = useState(true);
  const [category,    setCategory]    = useState("");
  const [brand,       setBrand]       = useState("");
  const [description, setDescription] = useState("");
  const [barcode,     setBarcode]     = useState("");

  // Pricing
  const [price,       setPrice]       = useState("");
  const [costPrice,   setCostPrice]   = useState("");
  const [compareAt,   setCompareAt]   = useState("");
  const [taxRate,     setTaxRate]     = useState("10%");

  // Inventory
  const [stock,       setStock]       = useState("");
  const [minStock,    setMinStock]    = useState("");
  const [unit,        setUnit]        = useState("piece");
  const [supplier,    setSupplier]    = useState("");
  const [location,    setLocation]    = useState("");

  // Flags
  const [trackStock,  setTrackStock]  = useState(true);
  const [taxable,     setTaxable]     = useState(true);
  const [featured,    setFeatured]    = useState(false);
  const [allowNeg,    setAllowNeg]    = useState(false);
  const [status,      setStatus]      = useState("active");

  // Tags & images
  const [tags,        setTags]        = useState([]);
  const [tagInput,    setTagInput]    = useState("");
  const [images,      setImages]      = useState([]);
  const [dragOver,    setDragOver]    = useState(false);

  // Variants
  const [hasVariants, setHasVariants] = useState(false);
  const [variants,    setVariants]    = useState([
    { id: 1, name: "Default", sku: "", price: "", stock: "" },
  ]);

  // UI
  const [errors,      setErrors]      = useState({});
  const [toast,       setToast]       = useState({ show: false, msg: "", sub: "" });
  const fileInputRef  = useRef();

  // ── Derived ──
  const autoSku = name
    ? (category ? category.slice(0, 3).toUpperCase() : "PRD") + "-" +
      name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 4) +
      "-" + String(Math.floor(Math.random() * 900 + 100))
    : "";

  const displaySku = skuAuto ? autoSku : sku;

  const margin = price && costPrice
    ? (((parseFloat(price) - parseFloat(costPrice)) / parseFloat(price)) * 100).toFixed(1)
    : null;

  // ── Handlers ──
  const handleTagKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags(t => t.slice(0, -1));
    }
  };

  const handleFiles = useCallback((files) => {
    const allowed = Array.from(files).filter(f => f.type.startsWith("image/")).slice(0, 6 - images.length);
    allowed.forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => setImages(prev => [...prev, { url: e.target.result, name: f.name }]);
      reader.readAsDataURL(f);
    });
  }, [images]);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const addVariant = () => setVariants(v => [...v, { id: Date.now(), name: "", sku: "", price: "", stock: "" }]);
  const delVariant = (id) => setVariants(v => v.filter(r => r.id !== id));
  const updateVariant = (id, field, val) => setVariants(v => v.map(r => r.id === id ? { ...r, [field]: val } : r));

  const showToast = (msg, sub = "") => {
    setToast({ show: true, msg, sub });
    setTimeout(() => setToast({ show: false, msg: "", sub: "" }), 3200);
  };

  const validate = () => {
    const e = {};
    if (!name.trim())     e.name     = "Product name is required";
    if (!category)        e.category = "Please select a category";
    if (!price)           e.price    = "Selling price is required";
    if (price && isNaN(parseFloat(price))) e.price = "Must be a valid number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { showToast("Please fix the errors", "Check required fields"); return; }
    showToast("Product saved!", `${name} · ${displaySku || "No SKU"}`);
  };

  const handleDraft = () => {
    showToast("Saved as draft", "You can continue editing later");
  };

  // ── Completion steps ──
  const steps = [
    { label: "Basic info",     done: !!(name && category) },
    { label: "Pricing",        done: !!(price) },
    { label: "Inventory",      done: !!(stock) },
    { label: "Images",         done: images.length > 0 },
    { label: "Tags & details", done: tags.length > 0 || !!description },
  ];
  const completedCount = steps.filter(s => s.done).length;

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
              <span className="bc-active">Add Product</span>
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
            <div className="page-title-block">
              <div className="page-eyebrow">Inventory Management</div>
              <div className="page-title">Add New Product</div>
              <div className="page-desc">Fill in the details below to create a new product listing</div>
            </div>
            <div className="page-actions">
              <button className="btn btn-ghost" onClick={handleDraft}>Save Draft</button>
              <button className="btn btn-green" onClick={handleSubmit}>
                <span>✓</span> Publish Product
              </button>
            </div>
          </div>

          {/* FORM */}
          <div className="form-grid">

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ── Basic Information ── */}
              <div className="card" style={{ animationDelay: "60ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--goldbg)", border: "1px solid var(--goldbr)" }}>
                    <span style={{ fontSize: 16 }}>📦</span>
                  </div>
                  <div>
                    <div className="card-title">Basic Information</div>
                    <div className="card-sub">Product identity &amp; classification</div>
                  </div>
                </div>
                <div className="card-body">

                  {/* Name */}
                  <div className="field">
                    <label className="label">
                      Product Name <span className="label-req">*</span>
                    </label>
                    <input
                      className={`input ${errors.name ? "error" : ""}`}
                      placeholder="e.g. Wireless Earbuds Pro"
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: null })); }}
                    />
                    {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                  </div>

                  {/* SKU */}
                  <div className="field">
                    <label className="label">
                      SKU
                      <span className="label-hint">
                        {skuAuto ? "— auto-generated" : "— manual entry"}
                      </span>
                    </label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {skuAuto
                        ? <div className="sku-preview" style={{ flex: 1 }}>
                            <span className="sku-preview-label">SKU</span>
                            <span className="sku-preview-value">{autoSku || "—"}</span>
                          </div>
                        : <input className="input" placeholder="e.g. WEP-221" value={sku} onChange={e => setSku(e.target.value)} style={{ flex: 1, fontFamily: "'Geist Mono', monospace", fontSize: 13 }} />
                      }
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "9px 14px", fontSize: 12, flexShrink: 0 }}
                        onClick={() => setSkuAuto(v => !v)}
                      >
                        {skuAuto ? "Manual" : "Auto"}
                      </button>
                    </div>
                  </div>

                  {/* Category + Brand */}
                  <div className="field-row field-row-2">
                    <div className="field">
                      <label className="label">Category <span className="label-req">*</span></label>
                      <div className="select-wrap">
                        <select
                          className={`select ${errors.category ? "error" : ""}`}
                          value={category}
                          onChange={e => { setCategory(e.target.value); setErrors(p => ({ ...p, category: null })); }}
                        >
                          <option value="">Select category…</option>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <span className="select-arrow">▾</span>
                      </div>
                      {errors.category && <span className="field-error">⚠ {errors.category}</span>}
                    </div>
                    <div className="field">
                      <label className="label">Brand</label>
                      <div className="select-wrap">
                        <select className="select" value={brand} onChange={e => setBrand(e.target.value)}>
                          <option value="">Select brand…</option>
                          {BRANDS.map(b => <option key={b}>{b}</option>)}
                        </select>
                        <span className="select-arrow">▾</span>
                      </div>
                    </div>
                  </div>

                  {/* Barcode */}
                  <div className="field">
                    <label className="label">Barcode / UPC
                      <span className="label-hint">— EAN-13, UPC-A, QR</span>
                    </label>
                    <div className="input-prefix-wrap">
                      <span className="input-prefix">▮</span>
                      <input className="input" placeholder="Scan or enter barcode" value={barcode} onChange={e => setBarcode(e.target.value)}
                        style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13 }} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="field">
                    <label className="label">Description</label>
                    <textarea
                      className="textarea"
                      placeholder="Describe the product — materials, dimensions, key features…"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Tags */}
                  <div className="field">
                    <label className="label">Tags
                      <span className="label-hint">— press Enter to add</span>
                    </label>
                    <div className="tag-input-wrap" onClick={() => document.getElementById("tag-input-field").focus()}>
                      {tags.map(t => (
                        <span className="tag-chip" key={t}>
                          {t}
                          <button className="tag-remove" onClick={() => setTags(tt => tt.filter(x => x !== t))}>×</button>
                        </span>
                      ))}
                      <input
                        id="tag-input-field"
                        className="tag-input-field"
                        placeholder={tags.length === 0 ? "wireless, audio, bestseller…" : ""}
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagKey}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Pricing ── */}
              <div className="card" style={{ animationDelay: "100ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--greenbg)", border: "1px solid var(--greenbr)" }}>
                    <span style={{ fontSize: 16 }}>💰</span>
                  </div>
                  <div>
                    <div className="card-title">Pricing</div>
                    <div className="card-sub">Selling price, cost &amp; tax</div>
                  </div>
                </div>
                <div className="card-body">

                  <div className="field-row field-row-3">
                    <div className="field">
                      <label className="label">Selling Price <span className="label-req">*</span></label>
                      <div className="input-prefix-wrap">
                        <span className="input-prefix">$</span>
                        <input
                          className={`input ${errors.price ? "error" : ""}`}
                          placeholder="0.00" type="number" min="0" step="0.01"
                          value={price} onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: null })); }}
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                        />
                      </div>
                      {errors.price && <span className="field-error">⚠ {errors.price}</span>}
                    </div>
                    <div className="field">
                      <label className="label">Cost Price</label>
                      <div className="input-prefix-wrap">
                        <span className="input-prefix">$</span>
                        <input
                          className="input" placeholder="0.00" type="number" min="0" step="0.01"
                          value={costPrice} onChange={e => setCostPrice(e.target.value)}
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Compare-at</label>
                      <div className="input-prefix-wrap">
                        <span className="input-prefix">$</span>
                        <input
                          className="input" placeholder="0.00" type="number" min="0" step="0.01"
                          value={compareAt} onChange={e => setCompareAt(e.target.value)}
                          style={{ fontFamily: "'Geist Mono', monospace" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Margin preview */}
                  {margin !== null && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      background: parseFloat(margin) > 30 ? "var(--greenbg)" : parseFloat(margin) > 10 ? "var(--goldbg)" : "var(--redbg)",
                      border: `1px solid ${parseFloat(margin) > 30 ? "var(--greenbr)" : parseFloat(margin) > 10 ? "var(--goldbr)" : "var(--redbr)"}`,
                      borderRadius: "var(--r-sm)",
                    }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(margin) > 30 ? "var(--green)" : parseFloat(margin) > 10 ? "var(--gold)" : "var(--red)" }}>
                        Margin
                      </span>
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 20, fontWeight: 700,
                        color: parseFloat(margin) > 30 ? "var(--green)" : parseFloat(margin) > 10 ? "var(--gold)" : "var(--red)" }}>
                        {margin}%
                      </span>
                      <span style={{ fontSize: 11, color: "var(--ink40)", marginLeft: "auto" }}>
                        ${price && costPrice ? (parseFloat(price) - parseFloat(costPrice)).toFixed(2) : "0.00"} profit per unit
                      </span>
                    </div>
                  )}

                  <div className="field-row field-row-2">
                    <div className="field">
                      <label className="label">Tax Rate</label>
                      <div className="select-wrap">
                        <select className="select" value={taxRate} onChange={e => setTaxRate(e.target.value)}>
                          {TAX_RATES.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <span className="select-arrow">▾</span>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label" style={{ opacity: 0 }}>_</label>
                      <div className="toggle-row" style={{ paddingTop: 8 }}>
                        <div className="toggle-info">
                          <div className="toggle-title" style={{ fontSize: 12 }}>Tax inclusive</div>
                        </div>
                        <label className="toggle">
                          <input type="checkbox" checked={taxable} onChange={e => setTaxable(e.target.checked)} />
                          <div className="toggle-track"><div className="toggle-thumb" /></div>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Inventory ── */}
              <div className="card" style={{ animationDelay: "130ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--bluebg)", border: "1px solid var(--bluebr)" }}>
                    <span style={{ fontSize: 16 }}>🏭</span>
                  </div>
                  <div>
                    <div className="card-title">Inventory</div>
                    <div className="card-sub">Stock levels, units &amp; supplier</div>
                  </div>
                </div>
                <div className="card-body">

                  <div className="toggle-row">
                    <div className="toggle-info">
                      <div className="toggle-title">Track inventory</div>
                      <div className="toggle-desc">Automatically deduct stock on every sale</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={trackStock} onChange={e => setTrackStock(e.target.checked)} />
                      <div className="toggle-track"><div className="toggle-thumb" /></div>
                    </label>
                  </div>

                  {trackStock && (
                    <>
                      <div className="hdivider" />
                      <div className="field-row field-row-3">
                        <div className="field">
                          <label className="label">Opening Stock</label>
                          <div className="input-suffix-wrap">
                            <input className="input" placeholder="0" type="number" min="0"
                              value={stock} onChange={e => setStock(e.target.value)}
                              style={{ fontFamily: "'Geist Mono', monospace" }} />
                            <span className="input-suffix">{unit}</span>
                          </div>
                        </div>
                        <div className="field">
                          <label className="label">Reorder Point</label>
                          <div className="input-suffix-wrap">
                            <input className="input" placeholder="0" type="number" min="0"
                              value={minStock} onChange={e => setMinStock(e.target.value)}
                              style={{ fontFamily: "'Geist Mono', monospace" }} />
                            <span className="input-suffix">{unit}</span>
                          </div>
                        </div>
                        <div className="field">
                          <label className="label">Unit</label>
                          <div className="select-wrap">
                            <select className="select" value={unit} onChange={e => setUnit(e.target.value)}>
                              {UNITS.map(u => <option key={u}>{u}</option>)}
                            </select>
                            <span className="select-arrow">▾</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="field-row field-row-2">
                    <div className="field">
                      <label className="label">Supplier</label>
                      <div className="select-wrap">
                        <select className="select" value={supplier} onChange={e => setSupplier(e.target.value)}>
                          <option value="">Select supplier…</option>
                          {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <span className="select-arrow">▾</span>
                      </div>
                    </div>
                    <div className="field">
                      <label className="label">Storage Location</label>
                      <input className="input" placeholder="e.g. Shelf B-3, Warehouse 1"
                        value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                  </div>

                  <div className="toggle-row">
                    <div className="toggle-info">
                      <div className="toggle-title">Allow negative stock</div>
                      <div className="toggle-desc">Permit sales even when stock reaches zero</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={allowNeg} onChange={e => setAllowNeg(e.target.checked)} />
                      <div className="toggle-track"><div className="toggle-thumb" /></div>
                    </label>
                  </div>

                </div>
              </div>

              {/* ── Variants ── */}
              <div className="card" style={{ animationDelay: "155ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--purplebg)", border: "1px solid var(--purplebr)" }}>
                    <span style={{ fontSize: 16 }}>⬡</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="card-title">Variants</div>
                    <div className="card-sub">Size, colour, configuration options</div>
                  </div>
                  <label className="toggle" style={{ marginRight: 4 }}>
                    <input type="checkbox" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} />
                    <div className="toggle-track"><div className="toggle-thumb" /></div>
                  </label>
                </div>

                {hasVariants && (
                  <div className="card-body" style={{ paddingTop: 16 }}>
                    <div className="variant-table">
                      <div className="variant-head">
                        <span>Variant Name</span><span>SKU</span><span>Price</span><span>Stock</span><span></span>
                      </div>
                      {variants.map(v => (
                        <div className="variant-row" key={v.id}>
                          <input className="variant-input" placeholder="e.g. Red / L" value={v.name}
                            onChange={e => updateVariant(v.id, "name", e.target.value)} />
                          <input className="variant-input mono" placeholder="SKU" value={v.sku}
                            onChange={e => updateVariant(v.id, "sku", e.target.value)} />
                          <input className="variant-input mono" placeholder="0.00" type="number" value={v.price}
                            onChange={e => updateVariant(v.id, "price", e.target.value)} />
                          <input className="variant-input mono" placeholder="0" type="number" value={v.stock}
                            onChange={e => updateVariant(v.id, "stock", e.target.value)} />
                          <button className="variant-del" onClick={() => delVariant(v.id)}>×</button>
                        </div>
                      ))}
                    </div>
                    <button className="add-variant-btn" onClick={addVariant}>
                      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Variant
                    </button>
                  </div>
                )}
              </div>

              {/* ── Media ── */}
              <div className="card" style={{ animationDelay: "175ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--brownbg)", border: "1px solid rgba(122,92,30,.2)" }}>
                    <span style={{ fontSize: 16 }}>🖼</span>
                  </div>
                  <div>
                    <div className="card-title">Product Images</div>
                    <div className="card-sub">Upload up to 6 images · First image is the cover</div>
                  </div>
                </div>
                <div className="card-body">

                  {images.length < 6 && (
                    <div
                      className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <div className="upload-ico">📸</div>
                      <div className="upload-title">Drop images here or click to browse</div>
                      <div className="upload-sub">
                        Recommended: 800×800px or larger · White background preferred
                      </div>
                      <div className="upload-types">
                        {["JPG", "PNG", "WEBP", "AVIF"].map(t => (
                          <span className="upload-type-tag" key={t}>{t}</span>
                        ))}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" multiple hidden
                        onChange={e => handleFiles(e.target.files)} />
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="img-preview-grid">
                      {images.map((img, i) => (
                        <div className="img-preview-cell" key={i}>
                          <img src={img.url} alt={img.name} />
                          {i === 0 && (
                            <div style={{
                              position: "absolute", bottom: 5, left: 5,
                              padding: "2px 7px", borderRadius: 20,
                              background: "rgba(27,23,19,.7)", backdropFilter: "blur(4px)",
                              fontSize: 9, fontWeight: 700, color: "var(--goldl)", letterSpacing: 1,
                            }}>COVER</div>
                          )}
                          <button className="img-remove" onClick={() => setImages(prev => prev.filter((_, ii) => ii !== i))}>×</button>
                        </div>
                      ))}
                      {images.length < 6 && (
                        <div className="img-add-cell" onClick={() => fileInputRef.current.click()}>+</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN — Summary + Status */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Summary */}
              <div className="summary-card">
                <div className="summary-top">
                  <div className="summary-title">Product Preview</div>
                  <div className="summary-sub">{completedCount} / {steps.length} sections complete</div>
                </div>
                <div className="summary-body">

                  {/* Preview image */}
                  <div className="summary-preview">
                    {images.length > 0
                      ? <img src={images[0].url} alt="cover" />
                      : (
                        <div className="summary-preview-empty">
                          <span style={{ fontSize: 36 }}>📦</span>
                          <span className="summary-preview-hint">No image yet</span>
                        </div>
                      )
                    }
                  </div>

                  <div>
                    <div className="summary-name">{name || <span style={{ color: "var(--ink20)", fontWeight: 400 }}>Product name…</span>}</div>
                    <div className="summary-sku">{displaySku || "—"}</div>
                    <div className="summary-cat">{[brand, category].filter(Boolean).join(" · ") || <span style={{ color: "var(--ink20)" }}>Category…</span>}</div>
                  </div>

                  <div className="summary-divider" />

                  <div>
                    <div className="summary-price-big">{price ? `$${parseFloat(price).toFixed(2)}` : "—"}</div>
                    {compareAt && parseFloat(compareAt) > parseFloat(price || 0) && (
                      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "var(--ink30)", textDecoration: "line-through", marginTop: 2 }}>
                        ${parseFloat(compareAt).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <div className="summary-row">
                      <span className="summary-row-label">Cost price</span>
                      <span className="summary-row-value">{costPrice ? `$${parseFloat(costPrice).toFixed(2)}` : "—"}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-row-label">Margin</span>
                      <span className="summary-row-value" style={{ color: margin ? (parseFloat(margin) > 20 ? "var(--green)" : "var(--gold)") : "var(--ink)" }}>
                        {margin ? `${margin}%` : "—"}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-row-label">Opening stock</span>
                      <span className="summary-row-value">{stock ? `${stock} ${unit}` : "—"}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-row-label">Tax</span>
                      <span className="summary-row-value">{taxable ? taxRate : "Exempt"}</span>
                    </div>
                  </div>

                  <div className="summary-divider" />

                  {/* Completeness */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--ink40)", marginBottom: 10 }}>
                      Completeness
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 4, background: "var(--ink10)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                      <div style={{
                        height: "100%", borderRadius: 2,
                        width: `${(completedCount / steps.length) * 100}%`,
                        background: "linear-gradient(90deg, var(--gold), var(--goldl))",
                        transition: "width .5s cubic-bezier(.16,1,.3,1)",
                      }} />
                    </div>
                    <div className="progress-steps">
                      {steps.map((s, i) => (
                        <div className="progress-step" key={i}>
                          <div className={`pstep-dot ${s.done ? "done" : "empty"}`}>
                            {s.done ? "✓" : i + 1}
                          </div>
                          <span className={`pstep-label ${s.done ? "done" : "empty"}`}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="summary-divider" />

                  <button className="submit-btn" onClick={handleSubmit} disabled={!name || !price || !category}>
                    <span>✦</span> Publish Product
                  </button>
                  <button className="draft-btn" onClick={handleDraft}>Save as Draft</button>
                </div>
              </div>

              {/* Status */}
              <div className="card" style={{ animationDelay: "90ms" }}>
                <div className="card-header">
                  <div className="card-header-icon" style={{ background: "var(--greenbg)", border: "1px solid var(--greenbr)" }}>
                    <span style={{ fontSize: 16 }}>⚡</span>
                  </div>
                  <div>
                    <div className="card-title">Visibility &amp; Status</div>
                    <div className="card-sub">Control how this product appears</div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="status-grid">
                    {[
                      { val: "active",   label: "Active",   desc: "Live in POS", color: "var(--green)", bg: "var(--greenbg)", dot: "#3D8A65" },
                      { val: "draft",    label: "Draft",    desc: "Hidden",      color: "var(--gold)",  bg: "var(--goldbg)",  dot: "#D4A83C" },
                      { val: "archived", label: "Archived", desc: "Removed",     color: "var(--ink40)", bg: "var(--warm2)",   dot: "#9E9080" },
                    ].map(s => (
                      <div
                        key={s.val}
                        className={`status-opt ${status === s.val ? "selected" : ""}`}
                        style={{ "--status-c": s.color, "--status-bg": s.bg }}
                        onClick={() => setStatus(s.val)}
                      >
                        <div className="status-dot-lg" style={{ background: s.dot, boxShadow: status === s.val ? `0 0 8px ${s.dot}` : "none" }} />
                        <div className="status-lbl">{s.label}</div>
                        <div className="status-desc">{s.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="hdivider" style={{ margin: "4px 0" }} />

                  <div className="toggle-row">
                    <div className="toggle-info">
                      <div className="toggle-title">Featured product</div>
                      <div className="toggle-desc">Highlight in POS &amp; reports</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
                      <div className="toggle-track"><div className="toggle-thumb" /></div>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* TOAST */}
        <div className={`toast ${toast.show ? "show" : ""}`}>
          <span className="toast-icon">✦</span>
          <span className="toast-msg">{toast.msg}</span>
          {toast.sub && <span className="toast-sub">· {toast.sub}</span>}
        </div>

      </div>
    </>
  );
}