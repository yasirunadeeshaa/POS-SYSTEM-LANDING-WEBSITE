import { useState, useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const TAG_COLORS = {
  vip:       { bg: "rgba(184,144,42,.1)",  border: "rgba(184,144,42,.25)", text: "#B8902A" },
  gold:      { bg: "rgba(184,144,42,.08)", border: "rgba(184,144,42,.2)",  text: "#D4A83C" },
  wholesale: { bg: "rgba(43,84,144,.08)",  border: "rgba(43,84,144,.22)",  text: "#2B5490" },
  regular:   { bg: "rgba(45,106,79,.08)",  border: "rgba(45,106,79,.2)",   text: "#2D6A4F" },
  new:       { bg: "rgba(91,61,143,.08)",  border: "rgba(91,61,143,.2)",   text: "#5B3D8F" },
};

const AVATAR_COLORS = [
  ["#2B5490","rgba(43,84,144,.15)"],["#5B3D8F","rgba(91,61,143,.15)"],
  ["#2D6A4F","rgba(45,106,79,.15)"],["#B8902A","rgba(184,144,42,.15)"],
  ["#B5372A","rgba(181,55,42,.15)"],["#7A5C1E","rgba(122,92,30,.15)"],
  ["#8A3A6A","rgba(138,58,106,.15)"],["#1B6B8A","rgba(27,107,138,.15)"],
];

const BLANK_FORM = {
  firstName: "", lastName: "", phone: "", email: "",
  nic: "", address: "", tags: [], status: "active", notes: "",
};

const MODAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Geist+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F6F3EC; --paper: #FDFBF7; --warm: #F0EBE0; --warm2: #E8E2D4;
    --ink: #1B1713; --ink60: #4B4038; --ink50: #6B5F54;
    --ink40: #9E9080; --ink30: #B8AFA4; --ink20: #CFC8BC; --ink10: #E4DDD2;
    --ink06: #EDE8E0; --ink03: #F5F1EB;
    --gold: #B8902A; --goldl: #D4A83C; --goldd: #8A6A1A;
    --goldbg: rgba(184,144,42,.07); --goldbr: rgba(184,144,42,.22);
    --green: #2D6A4F; --greenl: #3D8A65;
    --greenbg: rgba(45,106,79,.07); --greenbr: rgba(45,106,79,.22);
    --red: #B5372A; --redbg: rgba(181,55,42,.07); --redbr: rgba(181,55,42,.2);
    --shadow-lg: 0 20px 60px rgba(27,23,19,.2), 0 6px 16px rgba(27,23,19,.1);
  }

  @keyframes bdIn     { from{opacity:0}                                 to{opacity:1} }
  @keyframes modalIn  { from{opacity:0;transform:scale(.97) translateY(14px)} to{opacity:1;transform:none} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-6px)}      to{opacity:1;transform:none} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }

  /* ── Backdrop ── */
  .acm-backdrop {
    position: fixed; inset: 0;
    background: rgba(27,23,19,.52);
    backdrop-filter: blur(3px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: bdIn .2s ease;
  }

  /* ── Modal shell ── */
  .acm-modal {
    background: var(--paper);
    border: 1px solid var(--ink10);
    border-radius: 16px;
    width: 100%; max-width: 580px;
    max-height: calc(100vh - 40px);
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    animation: modalIn .28s cubic-bezier(.16,1,.3,1);
    font-family: 'Outfit', sans-serif;
  }
  .acm-modal.shake { animation: shake .32s ease; }

  /* ── Header ── */
  .acm-head {
    background: var(--ink);
    border-bottom: 1px solid rgba(184,144,42,.28);
    padding: 20px 24px 0;
    flex-shrink: 0;
    position: relative;
  }
  .acm-head::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--goldl) 30%, var(--gold) 70%, transparent);
    opacity: .35;
  }
  .acm-head-top {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    margin-bottom: 16px;
  }
  .acm-eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(184,144,42,.7); margin-bottom: 5px;
    display: flex; align-items: center; gap: 7px;
  }
  .acm-eyebrow::before { content: ''; width: 16px; height: 1px; background: var(--gold); opacity: .5; }
  .acm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 23px; font-weight: 600; color: #F6F3EC;
    line-height: 1; letter-spacing: -.1px;
  }
  .acm-close {
    width: 32px; height: 32px; border-radius: 7px; flex-shrink: 0;
    background: rgba(246,243,236,.06); border: 1px solid rgba(246,243,236,.1);
    color: rgba(246,243,236,.4); cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s; line-height: 1;
  }
  .acm-close:hover { background: rgba(246,243,236,.12); color: rgba(246,243,236,.88); }

  /* ── Live preview strip ── */
  .acm-preview {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0 14px;
    animation: fadeDown .2s ease;
  }
  .acm-av {
    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700;
  }
  .acm-av-placeholder {
    width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
    background: rgba(246,243,236,.04); border: 1.5px dashed rgba(246,243,236,.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; color: rgba(246,243,236,.2);
  }
  .acm-preview-name  { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: #F6F3EC; line-height: 1.15; }
  .acm-preview-sub   { font-size: 11.5px; color: rgba(246,243,236,.38); margin-top: 2px; }

  /* ── Body ── */
  .acm-body {
    flex: 1; overflow-y: auto; padding: 22px 24px 4px;
    display: flex; flex-direction: column; gap: 20px;
    background: var(--cream);
    background-image: radial-gradient(ellipse 80% 30% at 50% 0%, rgba(184,144,42,.04) 0%, transparent 55%);
  }
  .acm-body::-webkit-scrollbar { width: 3px; }
  .acm-body::-webkit-scrollbar-thumb { background: var(--ink10); border-radius: 3px; }

  /* ── Section label ── */
  .acm-section {
    font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    color: var(--ink40); display: flex; align-items: center; gap: 10px;
    margin-bottom: -6px;
  }
  .acm-section::after { content: ''; flex: 1; height: 1px; background: var(--ink10); }

  /* ── Field ── */
  .acm-field { display: flex; flex-direction: column; gap: 6px; }
  .acm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .acm-label {
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    color: var(--ink50); display: flex; align-items: center; gap: 5px;
  }
  .acm-req  { color: var(--red); font-size: 12px; line-height: 1; }
  .acm-hint { font-size: 10px; font-weight: 400; color: var(--ink30); letter-spacing: 0; text-transform: none; }

  .acm-input, .acm-textarea, .acm-select {
    width: 100%; padding: 10px 13px;
    background: var(--paper); border: 1.5px solid var(--ink10);
    border-radius: 8px; color: var(--ink);
    font-size: 13.5px; font-weight: 500; font-family: 'Outfit', sans-serif;
    outline: none; transition: all .18s; appearance: none;
  }
  .acm-input::placeholder, .acm-textarea::placeholder { color: var(--ink20); font-weight: 400; }
  .acm-input:hover,  .acm-textarea:hover,  .acm-select:hover  { border-color: var(--ink20); background: #fff; }
  .acm-input:focus,  .acm-textarea:focus,  .acm-select:focus  { border-color: var(--gold); background: #fff; box-shadow: 0 0 0 3px rgba(184,144,42,.1); }
  .acm-input.error, .acm-select.error { border-color: var(--red); box-shadow: 0 0 0 3px rgba(181,55,42,.08); }
  .acm-textarea { resize: vertical; min-height: 72px; line-height: 1.6; }
  .acm-mono     { font-family: 'Geist Mono', monospace !important; font-size: 13px !important; }
  .acm-sel-wrap { position: relative; }
  .acm-sel-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); font-size: 9px; color: var(--ink30); pointer-events: none; }
  .acm-field-error { font-size: 11px; color: var(--red); font-weight: 600; display: flex; align-items: center; gap: 4px; }

  /* ── Tag pills ── */
  .acm-tag-row { display: flex; gap: 7px; flex-wrap: wrap; }
  .acm-tag {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 13px; border-radius: 20px;
    border: 1.5px solid var(--ink10); background: var(--paper);
    cursor: pointer; font-size: 12px; font-weight: 600; color: var(--ink50);
    transition: all .16s; user-select: none;
  }
  .acm-tag:hover { border-color: var(--ink20); background: var(--warm); }
  .acm-tag.on { border-color: var(--tc); background: var(--tbg); color: var(--tc); }
  .acm-tag-check { font-size: 11px; }

  /* ── Status toggle ── */
  .acm-toggle-row {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 13px 15px;
    background: var(--paper); border: 1.5px solid var(--ink10); border-radius: 9px;
    cursor: pointer; transition: all .15s;
  }
  .acm-toggle-row:hover { border-color: var(--ink20); background: #fff; }
  .acm-toggle-row.active { border-color: var(--greenbr); background: var(--greenbg); }
  .acm-toggle-title { font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .acm-toggle-desc  { font-size: 11px; color: var(--ink40); line-height: 1.4; }
  .acm-switch {
    width: 42px; height: 24px; border-radius: 12px;
    background: var(--ink10); position: relative; flex-shrink: 0;
    transition: background .2s;
  }
  .acm-switch.on { background: var(--green); }
  .acm-knob {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 4px rgba(27,23,19,.25);
    transition: transform .22s cubic-bezier(.16,1,.3,1);
  }
  .acm-switch.on .acm-knob { transform: translateX(18px); }

  /* ── Footer ── */
  .acm-footer {
    padding: 16px 24px; border-top: 1px solid var(--ink10);
    background: var(--paper); flex-shrink: 0;
    display: flex; align-items: center; gap: 10px;
  }
  .acm-footer-hint { flex: 1; font-size: 11px; color: var(--ink30); }
  .acm-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 7px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; letter-spacing: .2px;
    border: 1px solid transparent; transition: all .2s;
  }
  .acm-btn-ghost { background: transparent; border-color: var(--ink10); color: var(--ink50); }
  .acm-btn-ghost:hover { border-color: var(--ink20); color: var(--ink60); background: var(--warm); }
  .acm-btn-gold {
    background: var(--gold); border-color: var(--goldd); color: #fff;
    box-shadow: 0 2px 10px rgba(184,144,42,.3);
  }
  .acm-btn-gold:hover { background: var(--goldl); box-shadow: 0 4px 16px rgba(184,144,42,.4); transform: translateY(-1px); }

  @media (max-width: 600px) {
    .acm-modal { border-radius: 12px; }
    .acm-row-2 { grid-template-columns: 1fr; }
    .acm-body  { padding: 18px 18px 4px; }
    .acm-head  { padding: 18px 18px 0; }
    .acm-footer { padding: 14px 18px; }
  }
`;

export default function AddCustomerModal({ onClose, onSave }) {
  const [form,   setForm]   = useState(BLANK_FORM);
  const [errors, setErrors] = useState({});
  const [shake,  setShake]  = useState(false);
  const firstRef = useRef();

  // Deterministic avatar colour from name
  const colorIdx = (form.firstName + form.lastName).split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const [avColor, avBg] = AVATAR_COLORS[colorIdx];

  const hasName = form.firstName.trim() || form.lastName.trim();
  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase();

  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  };

  const toggleTag = t =>
    setForm(f => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter(x => x !== t) : [...f.tags, t] }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.phone.trim())     e.phone     = "Phone number is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }
    onSave?.({
      id:            Date.now(),
      firstName:     form.firstName.trim(),
      lastName:      form.lastName.trim(),
      phone:         form.phone.trim(),
      email:         form.email.trim(),
      nic:           form.nic.trim(),
      address:       form.address.trim(),
      city:          "",
      tags:          form.tags,
      status:        form.status,
      notes:         form.notes.trim(),
      loyaltyPoints: 0,
      totalSpend:    0,
      visits:        0,
      joinedAt:      new Date().toISOString().split("T")[0],
      lastVisit:     new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <>
      <style>{MODAL_CSS}</style>

      <div className="acm-backdrop" onClick={onClose}>
        <div className={`acm-modal${shake ? " shake" : ""}`} onClick={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div className="acm-head">
            <div className="acm-head-top">
              <div>
                <div className="acm-eyebrow">CRM · Customer Relations</div>
                <div className="acm-title">Add New Customer</div>
              </div>
              <button className="acm-close" onClick={onClose}>×</button>
            </div>

            {/* Live preview */}
            <div className="acm-preview">
              {hasName ? (
                <div className="acm-av" style={{ background: avBg, border: `1.5px solid ${avColor}35`, color: avColor }}>
                  {initials}
                </div>
              ) : (
                <div className="acm-av-placeholder">👤</div>
              )}
              <div>
                <div className="acm-preview-name">
                  {hasName ? `${form.firstName} ${form.lastName}`.trim() : "New Customer"}
                </div>
                <div className="acm-preview-sub">
                  {form.phone || form.email || "Fill in the details below"}
                </div>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="acm-body">

            {/* ── Personal ── */}
            <div className="acm-section">Full Name</div>

            <div className="acm-row-2">
              <div className="acm-field">
                <label className="acm-label">First Name <span className="acm-req">*</span></label>
                <input
                  ref={firstRef}
                  className={`acm-input${errors.firstName ? " error" : ""}`}
                  placeholder="e.g. Ravi"
                  value={form.firstName}
                  onChange={e => set("firstName", e.target.value)}
                />
                {errors.firstName && <span className="acm-field-error">⚠ {errors.firstName}</span>}
              </div>
              <div className="acm-field">
                <label className="acm-label">Last Name <span className="acm-req">*</span></label>
                <input
                  className={`acm-input${errors.lastName ? " error" : ""}`}
                  placeholder="e.g. Mendis"
                  value={form.lastName}
                  onChange={e => set("lastName", e.target.value)}
                />
                {errors.lastName && <span className="acm-field-error">⚠ {errors.lastName}</span>}
              </div>
            </div>

            {/* ── Contact ── */}
            <div className="acm-section">Contact Details</div>

            <div className="acm-row-2">
              <div className="acm-field">
                <label className="acm-label">Phone <span className="acm-req">*</span></label>
                <input
                  className={`acm-input acm-mono${errors.phone ? " error" : ""}`}
                  placeholder="+94 71 234 5678"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                />
                {errors.phone && <span className="acm-field-error">⚠ {errors.phone}</span>}
              </div>
              <div className="acm-field">
                <label className="acm-label">
                  Email <span className="acm-hint">— optional</span>
                </label>
                <input
                  className={`acm-input${errors.email ? " error" : ""}`}
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                />
                {errors.email && <span className="acm-field-error">⚠ {errors.email}</span>}
              </div>
            </div>

            <div className="acm-field">
              <label className="acm-label">
                NIC / National ID <span className="acm-hint">— optional</span>
              </label>
              <input
                className="acm-input acm-mono"
                placeholder="199012345678 or 900123456V"
                value={form.nic}
                onChange={e => set("nic", e.target.value)}
              />
            </div>

            {/* ── Address ── */}
            <div className="acm-section">Address</div>

            <div className="acm-field">
              <label className="acm-label">Street Address <span className="acm-hint">— optional</span></label>
              <input
                className="acm-input"
                placeholder="12 Galle Road, Colombo 03"
                value={form.address}
                onChange={e => set("address", e.target.value)}
              />
            </div>

            {/* ── Tags ── */}
            <div className="acm-section">Tags</div>

            <div className="acm-tag-row">
              {["vip", "gold", "wholesale", "regular", "new"].map(t => {
                const s   = TAG_COLORS[t];
                const on  = form.tags.includes(t);
                return (
                  <div
                    key={t}
                    className={`acm-tag${on ? " on" : ""}`}
                    style={on ? { "--tc": s.text, "--tbg": s.bg, borderColor: s.border } : {}}
                    onClick={() => toggleTag(t)}
                  >
                    {on && <span className="acm-tag-check">✓</span>}
                    {t}
                  </div>
                );
              })}
            </div>

            {/* ── Status ── */}
            <div className="acm-section">Account Status</div>

            <div
              className={`acm-toggle-row${form.status === "active" ? " active" : ""}`}
              onClick={() => set("status", form.status === "active" ? "inactive" : "active")}
            >
              <div>
                <div className="acm-toggle-title">
                  {form.status === "active" ? "Active" : "Inactive"}
                </div>
                <div className="acm-toggle-desc">
                  {form.status === "active"
                    ? "Customer can transact in the POS"
                    : "Customer is disabled and cannot transact"}
                </div>
              </div>
              <div className={`acm-switch${form.status === "active" ? " on" : ""}`}>
                <div className="acm-knob" />
              </div>
            </div>

            {/* ── Notes ── */}
            <div className="acm-section">Notes</div>

            <div className="acm-field" style={{ paddingBottom: 6 }}>
              <textarea
                className="acm-textarea"
                placeholder="Any special instructions, preferences or notes about this customer…"
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
              />
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="acm-footer">
            <span className="acm-footer-hint">Customer will be registered immediately</span>
            <button className="acm-btn acm-btn-ghost" onClick={onClose} type="button">Cancel</button>
            <button className="acm-btn acm-btn-gold" onClick={handleSave} type="button">
              ✦ Register Customer
            </button>
          </div>

        </div>
      </div>
    </>
  );
}