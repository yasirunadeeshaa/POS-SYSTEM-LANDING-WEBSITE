import { useState, useEffect, useRef } from "react";

// ── CATEGORIES & OPTIONS ──────────────────────────────────────────────────────
const CATEGORIES = ["Electronics", "Apparel", "Accessories", "Home", "Lifestyle", "Stationery", "Sports"];
const BRANDS     = ["Nexus", "Generic", "OEM", "Anker", "Logitech"];
const SUPPLIERS  = ["TechDist Co.", "FabricWorld", "Global Imports", "HomeGoods Inc.", "DirectSource"];
const LOCATIONS  = ["Shelf A-1","Shelf A-2","Shelf A-3","Shelf A-4","Shelf A-5",
                    "Shelf B-1","Shelf B-2","Shelf B-3","Shelf C-1","Shelf C-2",
                    "Shelf D-1","Shelf D-2","Shelf D-3","Shelf D-4","Shelf E-1","Shelf E-2","Shelf F-1","Shelf F-2"];
const STATUS_OPTIONS = ["active", "draft", "archived"];
const EMOJI_ICONS = ["📦","🎧","👕","👜","🕯","🍶","📓","🔌","📱","🧘","☕","🪴","🧦","💨","⌨","🛋","🔋","🖥","🎮","📷","🖊","🎒","👟","🔦","🧴"];

const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

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
    --shadow-lg: 0 24px 64px rgba(27,23,19,.22), 0 6px 20px rgba(27,23,19,.12);
  }

  @keyframes overlayIn { from{opacity:0} to{opacity:1} }
  @keyframes modalIn   { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:none} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(27,23,19,.55);
    backdrop-filter: blur(3px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: overlayIn .2s ease;
  }

  .modal-shell {
    background: var(--paper);
    border: 1px solid var(--ink10);
    border-radius: 16px;
    width: 100%; max-width: 740px;
    max-height: calc(100vh - 48px);
    display: flex; flex-direction: column;
    box-shadow: var(--shadow-lg);
    animation: modalIn .28s cubic-bezier(.16,1,.3,1);
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
  }

  /* ── Modal Header ── */
  .modal-head {
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.3);
    padding: 20px 26px 18px;
    flex-shrink: 0;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    position: relative;
  }
  .modal-head::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--goldl) 30%, var(--gold) 70%, transparent);
    opacity: .4;
  }
  .modal-eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(184,144,42,.7); margin-bottom: 5px;
    display: flex; align-items: center; gap: 8px;
  }
  .modal-eyebrow::before { content:''; width:16px; height:1px; background:var(--gold); opacity:.5; }
  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 600; color: #F6F3EC; letter-spacing: -.1px; line-height: 1;
    margin-bottom: 4px;
  }
  .modal-subtitle { font-size: 12px; color: rgba(246,243,236,.3); font-weight: 400; }
  .modal-close-btn {
    width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    color: rgba(246,243,236,.4); cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center; transition: all .15s;
    line-height: 1;
  }
  .modal-close-btn:hover { background: rgba(246,243,236,.12); color: rgba(246,243,236,.85); }

  /* ── Step Nav ── */
  .step-nav {
    display: flex; align-items: center; gap: 0;
    padding: 0 26px;
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.15);
    flex-shrink: 0;
  }
  .step-tab {
    display: flex; align-items: center; gap: 8px;
    padding: 13px 18px 12px;
    font-size: 11.5px; font-weight: 600; cursor: pointer;
    color: rgba(246,243,236,.28); border-bottom: 2px solid transparent;
    transition: all .18s; white-space: nowrap;
    background: none; border-top: none; border-left: none; border-right: none;
    font-family: 'Outfit', sans-serif;
  }
  .step-tab:hover { color: rgba(246,243,236,.6); }
  .step-tab.active { color: var(--goldl); border-bottom-color: var(--gold); }
  .step-tab.done   { color: rgba(246,243,236,.45); }
  .step-num {
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700;
    background: rgba(246,243,236,.1); color: rgba(246,243,236,.35);
    transition: all .18s;
  }
  .step-tab.active .step-num { background: var(--gold); color: #fff; }
  .step-tab.done   .step-num { background: var(--green); color: #fff; }

  /* ── Body ── */
  .modal-body {
    flex: 1; overflow-y: auto; padding: 24px 26px;
    background: var(--cream);
    background-image: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(184,144,42,.04) 0%, transparent 55%);
  }
  .modal-body::-webkit-scrollbar { width: 3px; }
  .modal-body::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  .step-panel { animation: fadeUp .22s ease both; }

  /* ── Section labels ── */
  .field-section {
    font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--ink40); display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px; margin-top: 4px;
  }
  .field-section::after { content:''; flex:1; height:1px; background:var(--ink10); }

  /* ── Grid layouts ── */
  .field-row   { display: grid; gap: 14px; margin-bottom: 14px; }
  .col-2 { grid-template-columns: 1fr 1fr; }
  .col-3 { grid-template-columns: 1fr 1fr 1fr; }
  .col-1-2 { grid-template-columns: 1fr 2fr; }
  .col-2-1 { grid-template-columns: 2fr 1fr; }

  /* ── Field ── */
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--ink50); display: flex; align-items: center; gap: 6px;
  }
  .field-required { color: var(--red); font-size: 12px; line-height: 1; }
  .field-hint { font-size: 10.5px; color: var(--ink30); font-weight: 400; letter-spacing: 0; text-transform: none; margin-top: -2px; }

  .field-input, .field-select, .field-textarea {
    padding: 10px 14px;
    background: var(--paper); border: 1.5px solid var(--ink10);
    border-radius: 8px; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--ink);
    outline: none; transition: all .18s; width: 100%;
  }
  .field-input::placeholder, .field-textarea::placeholder { color: var(--ink20); }
  .field-input:hover, .field-select:hover, .field-textarea:hover { border-color: var(--ink20); background: #fff; }
  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: var(--gold); background: #fff;
    box-shadow: 0 0 0 3px rgba(184,144,42,.1);
  }
  .field-input.error, .field-select.error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(181,55,42,.1); }
  .field-input.error:focus { border-color: var(--red); }
  .field-error { font-size: 10.5px; color: var(--red); font-weight: 600; margin-top: -2px; display: flex; align-items: center; gap: 4px; }

  .field-select { appearance: none; cursor: pointer; padding-right: 34px; }
  .select-wrap { position: relative; }
  .select-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 9px; color: var(--ink30); pointer-events: none; }

  .field-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

  .field-mono {
    font-family: 'Geist Mono', monospace !important;
    font-size: 12.5px !important; letter-spacing: .3px;
  }

  /* ── Price input with prefix ── */
  .input-prefix-wrap { position: relative; }
  .input-prefix {
    position: absolute; left: 0; top: 0; bottom: 0; width: 36px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--ink40);
    border-right: 1.5px solid var(--ink10); pointer-events: none;
    transition: border-color .18s;
  }
  .input-prefix-wrap:focus-within .input-prefix { border-color: var(--gold); color: var(--gold); }
  .input-prefix-wrap .field-input { padding-left: 46px; }

  /* ── Margin badge ── */
  .margin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700;
    font-family: 'Geist Mono', monospace;
    transition: all .3s;
  }

  /* ── Toggle / checkbox ── */
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; background: var(--paper); border: 1.5px solid var(--ink10);
    border-radius: 8px; cursor: pointer; transition: all .15s;
  }
  .toggle-row:hover { border-color: var(--ink20); background: #fff; }
  .toggle-row.checked { border-color: var(--goldbr); background: var(--goldbg); }
  .toggle-label { font-size: 13px; font-weight: 600; color: var(--ink60); }
  .toggle-desc  { font-size: 11px; color: var(--ink40); margin-top: 1px; }
  .toggle-switch {
    width: 38px; height: 22px; border-radius: 11px;
    background: var(--ink10); position: relative; flex-shrink: 0;
    transition: background .2s;
  }
  .toggle-switch.on { background: var(--gold); }
  .toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 4px rgba(27,23,19,.2);
    transition: transform .2s cubic-bezier(.16,1,.3,1);
  }
  .toggle-switch.on .toggle-knob { transform: translateX(16px); }

  /* ── Icon picker ── */
  .icon-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 6px;
  }
  .icon-option {
    width: 44px; height: 44px; border-radius: 8px; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    background: var(--paper); border: 1.5px solid var(--ink10);
    cursor: pointer; transition: all .14s;
  }
  .icon-option:hover { border-color: var(--ink20); background: var(--warm); transform: scale(1.05); }
  .icon-option.selected { border-color: var(--gold); background: var(--goldbg); box-shadow: 0 0 0 2px var(--gold); }

  /* ── Tag input ── */
  .tag-input-row { display: flex; gap: 8px; }
  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: var(--goldbg); border: 1px solid var(--goldbr);
    color: var(--gold); font-size: 11.5px; font-weight: 700;
  }
  .tag-remove { background: none; border: none; cursor: pointer; color: var(--gold); opacity: .6; font-size: 14px; line-height: 1; padding: 0; transition: opacity .14s; }
  .tag-remove:hover { opacity: 1; }

  /* ── Summary card ── */
  .summary-card {
    background: var(--paper); border: 1px solid var(--ink10);
    border-radius: 10px; overflow: hidden; margin-bottom: 16px;
  }
  .summary-head {
    background: var(--ink); padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    border-bottom: 1px solid rgba(184,144,42,.2);
  }
  .summary-icon {
    width: 48px; height: 48px; border-radius: 10px;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0;
  }
  .summary-name { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 600; color: #F6F3EC; line-height: 1.2; margin-bottom: 3px; }
  .summary-sku  { font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--goldl); }
  .summary-body { padding: 16px 18px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .summary-row {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 7px 0; border-bottom: 1px solid var(--ink03);
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-label { font-size: 11.5px; color: var(--ink40); font-weight: 500; }
  .summary-value { font-size: 12.5px; font-weight: 700; color: var(--ink); font-family: 'Geist Mono', monospace; }

  /* ── Footer ── */
  .modal-footer {
    padding: 16px 26px; border-top: 1px solid var(--ink10);
    background: var(--paper); flex-shrink: 0;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .footer-left  { display: flex; gap: 8px; }
  .footer-right { display: flex; gap: 8px; }

  .m-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 7px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; letter-spacing: .2px;
    border: 1px solid transparent; transition: all .2s;
  }
  .m-btn-ghost { background: transparent; border-color: var(--ink10); color: var(--ink50); }
  .m-btn-ghost:hover { border-color: var(--ink20); color: var(--ink60); background: var(--warm); }
  .m-btn-outline { background: transparent; border-color: var(--goldbr); color: var(--gold); }
  .m-btn-outline:hover { background: var(--goldbg); border-color: var(--gold); }
  .m-btn-gold {
    background: var(--gold); border-color: var(--goldd); color: #fff;
    box-shadow: 0 2px 10px rgba(184,144,42,.3);
  }
  .m-btn-gold:hover { background: var(--goldl); box-shadow: 0 4px 16px rgba(184,144,42,.4); transform: translateY(-1px); }
  .m-btn-gold:disabled { opacity: .5; cursor: not-allowed; transform: none; }
  .m-btn-green { background: var(--green); border-color: #1e4d38; color: #fff; box-shadow: 0 2px 10px rgba(45,106,79,.25); }
  .m-btn-green:hover { background: var(--greenl); box-shadow: 0 4px 16px rgba(45,106,79,.35); transform: translateY(-1px); }

  /* ── Step progress dots ── */
  .step-dots { display: flex; align-items: center; gap: 6px; }
  .step-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--ink10); transition: all .2s;
  }
  .step-dot.active { background: var(--gold); width: 18px; border-radius: 3px; }
  .step-dot.done   { background: var(--green); }

  /* ── Shake animation for validation ── */
  .shake { animation: shake .35s ease; }
`;

const STEPS = [
  { id: 0, label: "Basic Info",  icon: "📋" },
  { id: 1, label: "Pricing",     icon: "💰" },
  { id: 2, label: "Inventory",   icon: "📦" },
  { id: 3, label: "Details",     icon: "🏷" },
  { id: 4, label: "Review",      icon: "✓"  },
];

const DEFAULT_FORM = {
  name: "", sku: "", barcode: "", category: "", brand: "", status: "active",
  description: "", icon: "📦",
  price: "", cost: "", featured: false,
  stock: "", minStock: "", location: "", supplier: "",
  tags: [], tagInput: "",
};

function genSKU(name, category) {
  if (!name || !category) return "";
  const prefix = category.slice(0, 2).toUpperCase();
  const suffix = name.replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const num    = Math.floor(100 + Math.random() * 900);
  return `${prefix}${suffix}-${num}`;
}

function genBarcode() {
  return "890" + Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join("");
}

export default function AddProductModal({ onClose, onSave }) {
  const [step,   setStep]   = useState(0);
  const [form,   setForm]   = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [shake,  setShake]  = useState(false);
  const firstInputRef = useRef();

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 80);
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const margin = form.price && form.cost
    ? (((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price)) * 100).toFixed(1)
    : null;

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.name.trim())     e.name     = "Product name is required";
      if (!form.category)        e.category = "Please select a category";
      if (!form.sku.trim())      e.sku      = "SKU is required";
    }
    if (s === 1) {
      if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = "Enter a valid selling price";
      if (!form.cost  || isNaN(form.cost)  || +form.cost  <= 0) e.cost  = "Enter a valid cost price";
      if (+form.cost >= +form.price) e.cost = "Cost must be less than selling price";
    }
    if (s === 2) {
      if (form.stock === "" || isNaN(form.stock) || +form.stock < 0) e.stock    = "Enter a valid stock quantity";
      if (!form.minStock || isNaN(form.minStock) || +form.minStock < 0) e.minStock = "Enter a reorder point";
    }
    return e;
  };

  const nextStep = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    set("tagInput", "");
  };

  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  const autoFillSKU  = () => set("sku",     genSKU(form.name, form.category));
  const autoFillBarcode = () => set("barcode", genBarcode());

  const handleSave = () => {
    const newProduct = {
      id: Date.now(),
      name:        form.name.trim(),
      sku:         form.sku.trim(),
      barcode:     form.barcode || genBarcode(),
      category:    form.category,
      brand:       form.brand || "Generic",
      price:       parseFloat(form.price),
      cost:        parseFloat(form.cost),
      stock:       parseInt(form.stock, 10),
      minStock:    parseInt(form.minStock, 10),
      status:      form.status,
      featured:    form.featured,
      description: form.description.trim(),
      images:      [form.icon],
      supplier:    form.supplier || "—",
      location:    form.location || "—",
      tags:        form.tags,
      sold:        0,
      trend:       0,
    };
    onSave?.(newProduct);
    onClose();
  };

  // ── Render step content ──────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {

      // ── STEP 0: Basic Info ──
      case 0: return (
        <div className="step-panel">
          <div className="field-section">Product Identity</div>

          {/* Icon picker */}
          <div className="field" style={{ marginBottom: 16 }}>
            <div className="field-label">Product Icon</div>
            <div className="icon-grid">
              {EMOJI_ICONS.map(ico => (
                <button key={ico} className={`icon-option${form.icon === ico ? " selected" : ""}`}
                  onClick={() => set("icon", ico)} type="button">{ico}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="field-row" style={{ marginBottom: 14 }}>
            <div className="field">
              <label className="field-label">
                Product Name <span className="field-required">*</span>
              </label>
              <input
                ref={firstInputRef}
                className={`field-input${errors.name ? " error" : ""}`}
                placeholder="e.g. Wireless Earbuds Pro"
                value={form.name}
                onChange={e => set("name", e.target.value)}
              />
              {errors.name && <span className="field-error">⚠ {errors.name}</span>}
            </div>
          </div>

          {/* SKU + Barcode */}
          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">
                SKU <span className="field-required">*</span>
                <span className="field-hint">· <button type="button" onClick={autoFillSKU} style={{ background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:10,fontWeight:700,padding:0 }}>Auto-generate</button></span>
              </label>
              <input
                className={`field-input field-mono${errors.sku ? " error" : ""}`}
                placeholder="e.g. WEP-221"
                value={form.sku}
                onChange={e => set("sku", e.target.value.toUpperCase())}
              />
              {errors.sku && <span className="field-error">⚠ {errors.sku}</span>}
            </div>
            <div className="field">
              <label className="field-label">
                Barcode
                <span className="field-hint">· <button type="button" onClick={autoFillBarcode} style={{ background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:10,fontWeight:700,padding:0 }}>Auto-generate</button></span>
              </label>
              <input
                className="field-input field-mono"
                placeholder="e.g. 8901234567890"
                value={form.barcode}
                onChange={e => set("barcode", e.target.value)}
              />
            </div>
          </div>

          {/* Category + Brand */}
          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">Category <span className="field-required">*</span></label>
              <div className="select-wrap">
                <select className={`field-select${errors.category ? " error" : ""}`}
                  value={form.category} onChange={e => set("category", e.target.value)}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.category && <span className="field-error">⚠ {errors.category}</span>}
            </div>
            <div className="field">
              <label className="field-label">Brand</label>
              <div className="select-wrap">
                <select className="field-select" value={form.brand} onChange={e => set("brand", e.target.value)}>
                  <option value="">Select brand…</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">Status</label>
              <div className="select-wrap">
                <select className="field-select" value={form.status} onChange={e => set("status", e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform:"capitalize" }}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
            <div className="field" style={{ justifyContent:"flex-end" }}>
              <label className="field-label">Featured</label>
              <div className={`toggle-row${form.featured ? " checked" : ""}`} onClick={() => set("featured", !form.featured)}>
                <div>
                  <div className="toggle-label">Mark as featured</div>
                  <div className="toggle-desc">Highlighted in POS &amp; storefront</div>
                </div>
                <div className={`toggle-switch${form.featured ? " on" : ""}`}>
                  <div className="toggle-knob" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="field-section" style={{ marginTop: 8 }}>Description</div>
          <div className="field">
            <label className="field-label">Product Description</label>
            <textarea
              className="field-input field-textarea"
              placeholder="Describe this product — features, materials, dimensions…"
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </div>
        </div>
      );

      // ── STEP 1: Pricing ──
      case 1: return (
        <div className="step-panel">
          <div className="field-section">Pricing</div>

          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">Selling Price <span className="field-required">*</span></label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">$</span>
                <input
                  className={`field-input field-mono${errors.price ? " error" : ""}`}
                  type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.price}
                  onChange={e => set("price", e.target.value)}
                />
              </div>
              {errors.price && <span className="field-error">⚠ {errors.price}</span>}
            </div>
            <div className="field">
              <label className="field-label">Cost Price <span className="field-required">*</span></label>
              <div className="input-prefix-wrap">
                <span className="input-prefix">$</span>
                <input
                  className={`field-input field-mono${errors.cost ? " error" : ""}`}
                  type="number" min="0" step="0.01" placeholder="0.00"
                  value={form.cost}
                  onChange={e => set("cost", e.target.value)}
                />
              </div>
              {errors.cost && <span className="field-error">⚠ {errors.cost}</span>}
            </div>
          </div>

          {/* Live margin display */}
          {margin !== null && (
            <div style={{
              background: "var(--paper)", border: "1px solid var(--ink10)",
              borderRadius: 10, padding: "16px 18px", marginBottom: 14,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              animation: "fadeUp .2s ease",
            }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--ink40)", marginBottom: 4 }}>Live Margin Calculator</div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink40)", marginBottom: 2 }}>Profit / unit</div>
                    <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
                      ${(parseFloat(form.price || 0) - parseFloat(form.cost || 0)).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ width: 1, height: 32, background: "var(--ink10)" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--ink40)", marginBottom: 2 }}>Gross margin</div>
                    <span className="margin-badge" style={{
                      background: parseFloat(margin) >= 30 ? "var(--greenbg)" : parseFloat(margin) >= 15 ? "var(--goldbg)" : "var(--redbg)",
                      border: `1px solid ${parseFloat(margin) >= 30 ? "var(--greenbr)" : parseFloat(margin) >= 15 ? "var(--goldbr)" : "var(--redbr)"}`,
                      color: parseFloat(margin) >= 30 ? "var(--green)" : parseFloat(margin) >= 15 ? "var(--gold)" : "var(--red)",
                      fontSize: 16,
                    }}>
                      {margin}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "var(--ink40)", marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: parseFloat(margin) >= 30 ? "var(--green)" : parseFloat(margin) >= 15 ? "var(--gold)" : "var(--red)" }}>
                  {parseFloat(margin) >= 30 ? "✓ Excellent" : parseFloat(margin) >= 15 ? "◉ Acceptable" : "⚠ Review pricing"}
                </div>
              </div>
            </div>
          )}

          <div className="field-section" style={{ marginTop: 8 }}>Markup guide</div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 4,
          }}>
            {[
              { label: "Below 15%", note: "Review pricing",  color: "var(--red)",   bg: "var(--redbg)",   br: "var(--redbr)"   },
              { label: "15–30%",    note: "Acceptable",      color: "var(--gold)",  bg: "var(--goldbg)",  br: "var(--goldbr)"  },
              { label: "Above 30%", note: "Excellent",       color: "var(--green)", bg: "var(--greenbg)", br: "var(--greenbr)" },
            ].map(g => (
              <div key={g.label} style={{ padding: "10px 12px", borderRadius: 8, background: g.bg, border: `1px solid ${g.br}`, textAlign: "center" }}>
                <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12, fontWeight: 700, color: g.color }}>{g.label}</div>
                <div style={{ fontSize: 10, color: g.color, opacity: .8, marginTop: 2 }}>{g.note}</div>
              </div>
            ))}
          </div>
        </div>
      );

      // ── STEP 2: Inventory ──
      case 2: return (
        <div className="step-panel">
          <div className="field-section">Stock Levels</div>

          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">Opening Stock <span className="field-required">*</span></label>
              <input
                className={`field-input field-mono${errors.stock ? " error" : ""}`}
                type="number" min="0" step="1" placeholder="0"
                value={form.stock}
                onChange={e => set("stock", e.target.value)}
              />
              {errors.stock && <span className="field-error">⚠ {errors.stock}</span>}
            </div>
            <div className="field">
              <label className="field-label">Reorder Point <span className="field-required">*</span></label>
              <input
                className={`field-input field-mono${errors.minStock ? " error" : ""}`}
                type="number" min="0" step="1" placeholder="10"
                value={form.minStock}
                onChange={e => set("minStock", e.target.value)}
              />
              {errors.minStock && <span className="field-error">⚠ {errors.minStock}</span>}
              <span className="field-hint" style={{ marginTop: 2 }}>Alert when stock falls below this</span>
            </div>
          </div>

          {/* Stock health preview */}
          {form.stock !== "" && form.minStock !== "" && (
            <div style={{
              background: "var(--paper)", border: "1px solid var(--ink10)",
              borderRadius: 10, padding: "14px 18px", marginBottom: 14,
              animation: "fadeUp .2s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink50)" }}>Stock Health Preview</span>
                <span style={{
                  fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 700,
                  color: +form.stock === 0 ? "var(--red)" : +form.stock <= +form.minStock ? "var(--gold)" : "var(--green)",
                }}>{form.stock}</span>
              </div>
              <div style={{ height: 6, background: "var(--ink10)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${Math.min((+form.stock / Math.max(+form.minStock * 3, 1)) * 100, 100)}%`,
                  background: +form.stock === 0 ? "var(--red)"
                    : +form.stock <= +form.minStock
                    ? "linear-gradient(90deg,var(--gold),var(--goldl))"
                    : "linear-gradient(90deg,var(--green),var(--greenl))",
                  transition: "width .5s cubic-bezier(.16,1,.3,1)",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink30)", fontFamily: "'Geist Mono',monospace", marginTop: 5 }}>
                <span>0</span>
                <span>Reorder: {form.minStock}</span>
                <span>{+form.minStock * 3}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: +form.stock === 0 ? "var(--red)" : +form.stock <= +form.minStock ? "var(--gold)" : "var(--green)" }}>
                {+form.stock === 0 ? "⚠ Out of stock from day one" : +form.stock <= +form.minStock ? "⚠ Opening stock is below reorder point" : "✓ Healthy opening stock"}
              </div>
            </div>
          )}

          <div className="field-section" style={{ marginTop: 8 }}>Location &amp; Supplier</div>

          <div className="field-row col-2">
            <div className="field">
              <label className="field-label">Shelf Location</label>
              <div className="select-wrap">
                <select className="field-select" value={form.location} onChange={e => set("location", e.target.value)}>
                  <option value="">Select location…</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
            <div className="field">
              <label className="field-label">Supplier</label>
              <div className="select-wrap">
                <select className="field-select" value={form.supplier} onChange={e => set("supplier", e.target.value)}>
                  <option value="">Select supplier…</option>
                  {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="select-arrow">▾</span>
              </div>
            </div>
          </div>
        </div>
      );

      // ── STEP 3: Details / Tags ──
      case 3: return (
        <div className="step-panel">
          <div className="field-section">Tags</div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label className="field-label">Product Tags</label>
            <div className="tag-input-row">
              <input
                className="field-input"
                placeholder="Add tag and press Enter…"
                value={form.tagInput}
                onChange={e => set("tagInput", e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                style={{ flex: 1 }}
              />
              <button type="button" className="m-btn m-btn-outline" onClick={addTag}
                style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>+ Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="tag-list">
                {form.tags.map(t => (
                  <span className="tag-chip" key={t}>
                    {t}
                    <button className="tag-remove" onClick={() => removeTag(t)}>×</button>
                  </span>
                ))}
              </div>
            )}
            <span className="field-hint" style={{ marginTop: 6 }}>Tags help with search and filtering in the POS</span>
          </div>

          <div className="field-section" style={{ marginTop: 8 }}>Quick Summary</div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--ink10)", borderRadius: 10, padding: "16px 18px" }}>
            {[
              { label: "Name",     val: form.name     || "—" },
              { label: "SKU",      val: form.sku      || "—", mono: true, color: "var(--gold)" },
              { label: "Category", val: form.category || "—" },
              { label: "Price",    val: form.price    ? `$${parseFloat(form.price).toFixed(2)}` : "—", mono: true, color: "var(--green)" },
              { label: "Stock",    val: form.stock    ? `${form.stock} units` : "—", mono: true },
              { label: "Status",   val: form.status   || "—" },
            ].map(r => (
              <div key={r.label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--ink03)" }}>
                <span style={{ fontSize:11.5, color:"var(--ink40)", fontWeight:500 }}>{r.label}</span>
                <span style={{ fontSize:12.5, fontWeight:700, color: r.color || "var(--ink)", fontFamily: r.mono ? "'Geist Mono',monospace" : "inherit" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      );

      // ── STEP 4: Review ──
      case 4: return (
        <div className="step-panel">
          <div className="field-section">Final Review</div>

          {/* Summary card */}
          <div className="summary-card">
            <div className="summary-head">
              <div className="summary-icon">{form.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div className="summary-name">{form.name || "Unnamed Product"}</div>
                <div className="summary-sku">{form.sku || "No SKU"}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 10.5, fontWeight: 700,
                  background: form.status === "active" ? "var(--greenbg)" : form.status === "draft" ? "var(--goldbg)" : "var(--warm2)",
                  color: form.status === "active" ? "var(--green)" : form.status === "draft" ? "var(--gold)" : "var(--ink40)",
                  border: `1px solid ${form.status === "active" ? "var(--greenbr)" : form.status === "draft" ? "var(--goldbr)" : "var(--ink10)"}`,
                }}>{form.status}</span>
              </div>
            </div>
            <div className="summary-body">
              <div className="summary-grid">
                {[
                  { label: "Category",      val: form.category  || "—" },
                  { label: "Brand",         val: form.brand     || "—" },
                  { label: "Selling Price", val: form.price     ? `$${parseFloat(form.price).toFixed(2)}` : "—" },
                  { label: "Cost Price",    val: form.cost      ? `$${parseFloat(form.cost).toFixed(2)}`  : "—" },
                  { label: "Gross Margin",  val: margin         ? `${margin}%` : "—" },
                  { label: "Opening Stock", val: form.stock     ? `${form.stock} units` : "—" },
                  { label: "Reorder Point", val: form.minStock  ? `${form.minStock} units` : "—" },
                  { label: "Supplier",      val: form.supplier  || "—" },
                  { label: "Location",      val: form.location  || "—" },
                  { label: "Barcode",       val: form.barcode   || "—" },
                ].map(r => (
                  <div key={r.label} className="summary-row">
                    <span className="summary-label">{r.label}</span>
                    <span className="summary-value">{r.val}</span>
                  </div>
                ))}
              </div>

              {form.tags.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--ink06)" }}>
                  <div style={{ fontSize: 10, color: "var(--ink40)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 7 }}>Tags</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {form.tags.map(t => (
                      <span key={t} style={{ padding:"3px 9px", borderRadius:20, background:"var(--goldbg)", border:"1px solid var(--goldbr)", color:"var(--gold)", fontSize:11, fontWeight:700 }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {form.description && (
                <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--warm)", borderRadius: 8, fontSize: 12.5, color: "var(--ink60)", lineHeight: 1.65 }}>
                  {form.description}
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: "12px 16px", background: "var(--greenbg)", border: "1px solid var(--greenbr)", borderRadius: 8, fontSize: 12.5, color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>✓</span>
            Everything looks good! Click <strong>Save Product</strong> to add it to your catalogue.
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <>
      <style>{MODAL_CSS}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className={`modal-shell${shake ? " shake" : ""}`} onClick={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="modal-head">
            <div>
              <div className="modal-eyebrow">Inventory Management</div>
              <div className="modal-title">Add New Product</div>
              <div className="modal-subtitle">Fill in the details below to create a new product listing</div>
            </div>
            <button className="modal-close-btn" onClick={onClose}>×</button>
          </div>

          {/* ── Step tabs ── */}
          <div className="step-nav">
            {STEPS.map(s => (
              <button
                key={s.id}
                className={`step-tab${step === s.id ? " active" : ""}${step > s.id ? " done" : ""}`}
                onClick={() => { if (s.id < step) setStep(s.id); }}
                type="button"
              >
                <span className="step-num">{step > s.id ? "✓" : s.id + 1}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* ── Body ── */}
          <div className="modal-body">
            {renderStep()}
          </div>

          {/* ── Footer ── */}
          <div className="modal-footer">
            <div className="footer-left">
              {/* Step dots */}
              <div className="step-dots">
                {STEPS.map(s => (
                  <div key={s.id} className={`step-dot${step === s.id ? " active" : ""}${step > s.id ? " done" : ""}`} />
                ))}
              </div>
            </div>
            <div className="footer-right">
              <button className="m-btn m-btn-ghost" onClick={onClose} type="button">Cancel</button>
              {step > 0 && (
                <button className="m-btn m-btn-outline" onClick={prevStep} type="button">← Back</button>
              )}
              {step < STEPS.length - 1 ? (
                <button className="m-btn m-btn-gold" onClick={nextStep} type="button">
                  Continue →
                </button>
              ) : (
                <button className="m-btn m-btn-green" onClick={handleSave} type="button">
                  ✓ Save Product
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}