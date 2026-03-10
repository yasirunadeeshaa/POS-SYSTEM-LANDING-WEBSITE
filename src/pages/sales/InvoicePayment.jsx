import { useState, useEffect, useRef } from "react";

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const uid      = () => Math.random().toString(36).slice(2, 8);

const BANKS = [
  "Bank of Ceylon","People's Bank","Commercial Bank","Hatton National Bank",
  "Sampath Bank","Nations Trust Bank","Pan Asia Bank","DFCC Bank",
  "NDB Bank","Seylan Bank","Citibank","HSBC","Standard Chartered","Other",
];

const WALLETS = [
  "eZ Cash (Dialog)","mCash (Mobitel)","FriMi (Nations Trust)",
  "Genie (HNB)","iPay (Commercial Bank)","Apple Pay","Google Pay",
  "PayPal","Samsung Pay","Other",
];

const ALL_METHODS = [
  { id: "cash",        label: "Cash",          icon: "💵", color: "#2D6A4F", bg: "rgba(45,106,79,.08)",  br: "rgba(45,106,79,.25)"  },
  { id: "card",        label: "Card",          icon: "💳", color: "#2B5490", bg: "rgba(43,84,144,.08)",  br: "rgba(43,84,144,.25)"  },
  { id: "wallet",      label: "Mobile Wallet", icon: "📲", color: "#5B3D8F", bg: "rgba(91,61,143,.08)",  br: "rgba(91,61,143,.28)"  },
  { id: "contactless", label: "Contactless",   icon: "⚡", color: "#B8902A", bg: "rgba(184,144,42,.08)", br: "rgba(184,144,42,.25)" },
  { id: "cheque",      label: "Cheque",        icon: "🧾", color: "#7A5C1E", bg: "rgba(122,92,30,.07)",  br: "rgba(122,92,30,.22)"  },
  { id: "credit",      label: "Credit",        icon: "📋", color: "#B5372A", bg: "rgba(181,55,42,.08)",  br: "rgba(181,55,42,.22)"  },
];

const blankCard   = () => ({ id: uid(), bank: "", last4: "", holder: "", ref: "",      amount: "" });
const blankCheque = () => ({ id: uid(), bank: "", chequeNo: "", holder: "", date: "", amount: "" });
const blankWallet = () => ({ id: uid(), wallet: "", phone: "", txRef: "",              amount: "" });

// ── STYLES ────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --cream:#F6F3EC; --paper:#FDFBF6; --warm:#EEE9DF;
    --ink:#1B1713; --ink70:#4B4038; --ink40:#9E9080; --ink20:#C9C0B2; --ink10:#E4DDD2;
    --gold:#B8902A; --goldl:#D4A83C; --goldbg:rgba(184,144,42,.07); --goldbr:rgba(184,144,42,.22);
    --green:#2D6A4F; --greenbg:rgba(45,106,79,.08); --greenbr:rgba(45,106,79,.25);
    --red:#B5372A; --redbg:rgba(181,55,42,.08); --redbr:rgba(181,55,42,.22);
    --blue:#2B5490; --bluebg:rgba(43,84,144,.08); --bluebr:rgba(43,84,144,.25);
    --purple:#5B3D8F; --purplebg:rgba(91,61,143,.08); --purplebr:rgba(91,61,143,.28);
    --s3:0 24px 64px rgba(27,23,19,.22), 0 4px 16px rgba(27,23,19,.1);
  }

  .ip-backdrop {
    position:fixed; inset:0; background:rgba(27,23,19,.68);
    backdrop-filter:blur(7px); z-index:1000;
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:ipBdIn .2s ease;
  }
  @keyframes ipBdIn { from{opacity:0} to{opacity:1} }

  .ip-modal {
    background:var(--paper); border:1px solid var(--ink10); border-radius:12px;
    box-shadow:var(--s3); width:100%; max-width:860px; max-height:94vh;
    overflow:hidden; display:flex; flex-direction:column;
    animation:ipIn .24s cubic-bezier(.34,1.15,.64,1);
  }
  @keyframes ipIn { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:none} }

  /* ── Header ── */
  .ip-head {
    background:var(--ink); border-bottom:2px solid var(--gold);
    padding:16px 24px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
  }
  .ip-eyebrow   { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:700; margin-bottom:4px }
  .ip-htitle    { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:#F6F3EC; letter-spacing:.3px }
  .ip-inv-badge { font-family:'Geist Mono',monospace; font-size:12px; font-weight:500; color:var(--goldl); background:rgba(184,144,42,.1); border:1px solid var(--goldbr); border-radius:5px; padding:5px 11px; letter-spacing:.8px }
  .ip-x         { width:32px; height:32px; border-radius:6px; background:rgba(246,243,236,.06); border:1px solid rgba(246,243,236,.12); color:rgba(246,243,236,.5); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all .15s; margin-left:10px; font-family:sans-serif }
  .ip-x:hover   { background:rgba(181,55,42,.18); color:#F6F3EC; border-color:rgba(181,55,42,.35) }

  .ip-body { display:grid; grid-template-columns:1fr 296px; flex:1; overflow:hidden }

  /* ── Left panel ── */
  .ip-left { padding:18px 22px; overflow-y:auto; border-right:1px solid var(--ink10); display:flex; flex-direction:column; gap:5px }
  .ip-left::-webkit-scrollbar { width:3px }
  .ip-left::-webkit-scrollbar-thumb { background:var(--ink10) }

  .ip-sec     { font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:var(--ink40); display:flex; align-items:center; gap:8px; margin-bottom:6px; margin-top:2px }
  .ip-sec::after { content:''; flex:1; height:1px; background:var(--ink10) }
  .ip-sec-lbl { font-size:9px; font-weight:700; letter-spacing:2.2px; text-transform:uppercase; color:var(--ink40); margin-bottom:4px }

  /* ── Method row ── */
  .m-row {
    display:grid; grid-template-columns:44px 1fr auto auto;
    align-items:center; gap:8px; padding:9px 12px;
    background:var(--warm); border:1.5px solid var(--ink10);
    border-radius:8px; transition:border-color .15s, box-shadow .15s, background .15s;
  }
  .m-row:hover    { border-color:var(--ink20) }
  .m-row.m-active { box-shadow:0 2px 10px rgba(27,23,19,.07) }
  .m-icon   { font-size:20px; text-align:center }
  .m-label  { font-size:13px; font-weight:600; color:var(--ink70); transition:color .15s }
  .m-inwrap {
    display:flex; align-items:center; gap:5px;
    background:var(--paper); border:1px solid var(--ink10);
    border-radius:6px; padding:0 10px; height:38px; width:130px;
    transition:border-color .15s;
  }
  .m-inwrap:focus-within { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.1) }
  .m-inwrap.readonly { background:var(--warm); opacity:.8 }
  .m-prefix { font-family:'Geist Mono',monospace; font-size:13px; font-weight:600; color:var(--ink40) }
  .m-input  { background:transparent; border:none; outline:none; color:var(--ink); font-family:'Geist Mono',monospace; font-size:15px; font-weight:600; width:100%; text-align:right }
  .m-input::placeholder { color:var(--ink20); font-weight:400 }
  .m-input[readonly] { cursor:default }
  .fill-btn { padding:5px 9px; background:var(--paper); border:1px solid var(--ink10); border-radius:5px; color:var(--ink40); font-size:10px; font-weight:700; letter-spacing:.3px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .14s; white-space:nowrap }
  .fill-btn:hover { background:var(--warm); border-color:var(--ink20) }
  .fill-btn:disabled { opacity:.35; cursor:not-allowed }

  /* ── Detail toggle button — always visible, disabled when no amount ── */
  .details-toggle {
    width:100%; display:flex; align-items:center; justify-content:space-between;
    padding:9px 14px; border-radius:7px; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:12px; font-weight:700;
    letter-spacing:.3px; transition:all .18s; margin-top:4px;
  }

  /* Card toggle */
  .details-toggle.card-toggle         { background:var(--bluebg);  color:var(--blue);   border:1.5px dashed var(--bluebr) }
  .details-toggle.card-toggle:not(:disabled):hover { background:rgba(43,84,144,.14);  border-color:var(--blue) }
  .details-toggle.card-toggle.t-open  { border-style:solid; border-radius:7px 7px 0 0; border-bottom-color:transparent }

  /* Wallet toggle */
  .details-toggle.wallet-toggle         { background:var(--purplebg); color:var(--purple); border:1.5px dashed var(--purplebr) }
  .details-toggle.wallet-toggle:not(:disabled):hover { background:rgba(91,61,143,.14); border-color:var(--purple) }
  .details-toggle.wallet-toggle.t-open  { border-style:solid; border-radius:7px 7px 0 0; border-bottom-color:transparent }

  /* Cheque toggle */
  .details-toggle.chq-toggle         { background:var(--goldbg);  color:var(--gold);   border:1.5px dashed var(--goldbr) }
  .details-toggle.chq-toggle:not(:disabled):hover { background:rgba(184,144,42,.14); border-color:var(--gold) }
  .details-toggle.chq-toggle.t-open  { border-style:solid; border-radius:7px 7px 0 0; border-bottom-color:transparent }

  /* Disabled state — visible but muted, no-hover */
  .details-toggle:disabled {
    opacity:.38; cursor:not-allowed; border-style:dashed;
    filter:grayscale(20%);
  }

  .toggle-left  { display:flex; align-items:center; gap:8px }
  .toggle-icon  { font-size:15px }
  .toggle-arrow { font-size:11px; transition:transform .25s; display:inline-block }
  .toggle-arrow.rotated { transform:rotate(180deg) }
  .toggle-hint  { font-size:10px; font-weight:500; opacity:.65; margin-left:6px }

  /* ── Collapsible detail body ── */
  .details-body { max-height:0; overflow:hidden; transition:max-height .32s cubic-bezier(.4,0,.2,1) }
  .details-body.d-open { max-height:900px }

  .details-body-inner {
    padding:12px 14px 14px;
    background:var(--paper);
    border:1.5px solid var(--bluebr);
    border-top:none; border-radius:0 0 7px 7px;
  }
  .details-body-inner.wallet-inner { border-color:var(--purplebr) }
  .details-body-inner.chq-inner    { border-color:var(--goldbr) }

  /* ── Individual slot ── */
  .slot {
    background:var(--cream); border:1px solid var(--ink10);
    border-radius:7px; padding:11px 12px; margin-bottom:8px;
    animation:slotIn .18s ease;
  }
  .slot:last-of-type { margin-bottom:0 }
  @keyframes slotIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:none} }

  .slot-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px }
  .slot-badge { display:flex; align-items:center; gap:7px }
  .slot-tag   { font-family:'Geist Mono',monospace; font-size:10.5px; font-weight:600; padding:3px 8px; border-radius:4px; letter-spacing:.5px }
  .slot-tag.card-tag   { color:var(--blue);   background:var(--bluebg);   border:1px solid var(--bluebr) }
  .slot-tag.wallet-tag { color:var(--purple); background:var(--purplebg); border:1px solid var(--purplebr) }
  .slot-tag.chq-tag    { color:var(--gold);   background:var(--goldbg);   border:1px solid var(--goldbr) }

  .entry-rm { width:22px; height:22px; background:transparent; border:1px solid transparent; border-radius:4px; color:var(--ink20); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all .13s; line-height:1; font-family:sans-serif }
  .entry-rm:hover { background:var(--redbg); color:var(--red); border-color:var(--redbr) }

  .cgrid2 { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:7px }
  .cgrid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:7px }
  .cfield { display:flex; flex-direction:column; gap:3px }
  .clbl   { font-size:9px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40) }
  .cinp   { background:var(--warm); border:1px solid var(--ink10); border-radius:5px; padding:7px 9px; color:var(--ink); font-size:12px; font-family:'DM Sans',sans-serif; outline:none; width:100%; transition:border-color .15s, box-shadow .15s }
  .cinp.card-f:focus   { border-color:var(--blue);   box-shadow:0 0 0 3px rgba(43,84,144,.1) }
  .cinp.wallet-f:focus { border-color:var(--purple);  box-shadow:0 0 0 3px rgba(91,61,143,.1) }
  .cinp.chq-f:focus    { border-color:var(--gold);   box-shadow:0 0 0 3px rgba(184,144,42,.1) }
  .cinp.mono { font-family:'Geist Mono',monospace; font-size:13px; font-weight:600; letter-spacing:1.5px }
  select.cinp { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239E9080'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 9px center; padding-right:24px; cursor:pointer }

  .slot-amt-row { margin-top:8px; padding-top:8px; border-top:1px solid var(--ink10); display:grid; grid-template-columns:1fr auto; gap:8px; align-items:end }
  .cinp.slot-amt { font-family:'Geist Mono',monospace; font-size:14px; font-weight:700 }
  .cinp.card-amt   { color:var(--blue);   background:var(--bluebg);   border-color:var(--bluebr) }
  .cinp.card-amt:focus   { border-color:var(--blue);   box-shadow:0 0 0 3px rgba(43,84,144,.1) }
  .cinp.wallet-amt { color:var(--purple); background:var(--purplebg); border-color:var(--purplebr) }
  .cinp.wallet-amt:focus { border-color:var(--purple);  box-shadow:0 0 0 3px rgba(91,61,143,.1) }
  .cinp.chq-amt    { color:var(--gold);   background:var(--goldbg);   border-color:var(--goldbr) }
  .cinp.chq-amt:focus    { border-color:var(--gold);   box-shadow:0 0 0 3px rgba(184,144,42,.1) }

  .add-slot-btn { display:flex; align-items:center; justify-content:center; gap:7px; width:100%; margin-top:10px; padding:8px; border-radius:6px; font-size:11.5px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; letter-spacing:.3px }
  .add-slot-btn.card-add   { border:1.5px dashed var(--bluebr);   background:rgba(43,84,144,.04); color:var(--blue) }
  .add-slot-btn.card-add:hover   { background:rgba(43,84,144,.1);  border-color:var(--blue) }
  .add-slot-btn.wallet-add { border:1.5px dashed var(--purplebr); background:rgba(91,61,143,.04); color:var(--purple) }
  .add-slot-btn.wallet-add:hover { background:rgba(91,61,143,.1);  border-color:var(--purple) }
  .add-slot-btn.chq-add    { border:1.5px dashed var(--goldbr);   background:rgba(184,144,42,.04); color:var(--gold) }
  .add-slot-btn.chq-add:hover    { background:rgba(184,144,42,.1); border-color:var(--gold) }

  /* ── Note + Clear ── */
  .ip-note { width:100%; background:var(--warm); border:1px solid var(--ink10); border-radius:5px; padding:8px 10px; resize:none; color:var(--ink70); font-family:'DM Sans',sans-serif; font-size:12.5px; line-height:1.6; outline:none; transition:border-color .15s }
  .ip-note:focus { border-color:var(--gold) }
  .clear-all { padding:5px 10px; background:transparent; border:1px solid var(--ink10); border-radius:4px; color:var(--ink40); font-size:10.5px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .14s }
  .clear-all:hover { color:var(--red); border-color:var(--redbr); background:var(--redbg) }

  /* ── Right panel ── */
  .ip-right { padding:18px 18px; display:flex; flex-direction:column; gap:11px; overflow-y:auto; background:var(--cream) }
  .ip-right::-webkit-scrollbar { width:3px }
  .ip-right::-webkit-scrollbar-thumb { background:var(--ink10) }

  .ip-cust     { display:flex; align-items:center; gap:10px; background:var(--goldbg); border:1px solid var(--goldbr); border-radius:6px; padding:10px 12px }
  .ip-cust-av  { width:34px; height:34px; border-radius:5px; flex-shrink:0; background:var(--ink); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:600; color:var(--goldl) }
  .ip-cust-name{ font-size:13px; font-weight:600; color:var(--ink) }
  .ip-cust-det { font-size:11px; color:var(--ink40); margin-top:1px }

  .ip-total-box { background:var(--ink); border-radius:7px; padding:11px 14px; display:flex; justify-content:space-between; align-items:center }
  .ip-total-lbl { font-family:'Cormorant Garamond',serif; font-size:14px; font-weight:600; color:var(--goldl); letter-spacing:.3px }
  .ip-total-val { font-family:'Geist Mono',monospace; font-size:22px; font-weight:600; color:#F6F3EC; letter-spacing:.5px }

  .ip-prog-track { height:6px; background:var(--ink10); border-radius:3px; overflow:hidden }
  .ip-prog-fill  { height:100%; border-radius:3px; transition:width .3s ease, background .3s ease }

  .ip-breakdown { background:var(--paper); border:1px solid var(--ink10); border-radius:7px; padding:10px 12px }
  .bd-empty { font-size:11.5px; color:var(--ink20); text-align:center; padding:6px 0; font-style:italic }
  .bd-row   { display:flex; justify-content:space-between; align-items:flex-start; padding:5px 0 }
  .bd-row + .bd-row { border-top:1px solid var(--ink10) }
  .bd-lbl   { font-size:11.5px; font-weight:600 }
  .bd-sub   { font-size:10px; color:var(--ink40); margin-top:1px; font-family:'Geist Mono',monospace }
  .bd-val   { font-family:'Geist Mono',monospace; font-size:12.5px; font-weight:600 }
  .bd-hr    { height:1px; background:var(--ink10); margin:4px 0 }

  .ip-inv-mini { background:var(--warm); border:1px solid var(--ink10); border-radius:7px; padding:10px 12px }
  .iim-row  { display:flex; justify-content:space-between; padding:2px 0; font-size:11.5px; color:var(--ink40) }
  .iim-row.disc { color:var(--green) }
  .iim-mono { font-family:'Geist Mono',monospace }

  .ip-confirm { width:100%; padding:12px; border-radius:7px; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all .15s; background:var(--ink20); color:var(--paper) }
  .ip-confirm.ready { background:var(--green); color:#fff }
  .ip-confirm.ready:hover { background:#256042; transform:translateY(-1px); box-shadow:0 4px 16px rgba(45,106,79,.35) }
  .ip-confirm:disabled { cursor:not-allowed; font-size:11px; font-weight:500 }
  .ip-cancel { width:100%; padding:8px; border-radius:5px; border:1px solid var(--ink10); background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; color:var(--ink40); cursor:pointer; transition:all .15s }
  .ip-cancel:hover { border-color:var(--ink20); color:var(--ink70) }
`;

// ── CARD SLOT ─────────────────────────────────────────────────────────────────
function CardSlot({ slot, index, onUpdate, onRemove, onFill }) {
  return (
    <div className="slot">
      <div className="slot-head">
        <div className="slot-badge">
          <span style={{ fontSize: 16 }}>💳</span>
          <span className="slot-tag card-tag">CARD {String(index + 1).padStart(2, "0")}</span>
        </div>
        {index > 0 && <button className="entry-rm" onClick={onRemove}>×</button>}
      </div>
      <div className="cgrid2">
        <div className="cfield">
          <label className="clbl">Bank / Issuer</label>
          <select className="cinp card-f" value={slot.bank} onChange={e => onUpdate("bank", e.target.value)}>
            <option value="">Select bank…</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="cfield">
          <label className="clbl">Last 4 Digits</label>
          <input className="cinp mono card-f" type="text" inputMode="numeric"
            maxLength={4} placeholder="•••• ____" value={slot.last4}
            onChange={e => onUpdate("last4", e.target.value.replace(/\D/g, "").slice(0, 4))} />
        </div>
      </div>
      <div className="cgrid2">
        <div className="cfield">
          <label className="clbl">Cardholder Name</label>
          <input className="cinp card-f" type="text" placeholder="As on card"
            value={slot.holder} onChange={e => onUpdate("holder", e.target.value)} />
        </div>
        <div className="cfield">
          <label className="clbl">Approval / Ref</label>
          <input className="cinp mono card-f" type="text" placeholder="AUTH code"
            value={slot.ref} onChange={e => onUpdate("ref", e.target.value)} />
        </div>
      </div>
      <div className="slot-amt-row">
        <div className="cfield">
          <label className="clbl">Amount on this card ($)</label>
          <input className="cinp slot-amt card-amt" type="number" min={0} step={0.01} placeholder="0.00"
            value={slot.amount} onChange={e => onUpdate("amount", e.target.value)} />
        </div>
        <button className="fill-btn"
          style={{ color: "var(--blue)", borderColor: "var(--bluebr)", alignSelf: "flex-end", marginBottom: 1 }}
          onClick={onFill}>↙ Fill</button>
      </div>
    </div>
  );
}

// ── WALLET SLOT ───────────────────────────────────────────────────────────────
function WalletSlot({ slot, index, onUpdate, onRemove, onFill }) {
  return (
    <div className="slot">
      <div className="slot-head">
        <div className="slot-badge">
          <span style={{ fontSize: 16 }}>📲</span>
          <span className="slot-tag wallet-tag">WALLET {String(index + 1).padStart(2, "0")}</span>
        </div>
        {index > 0 && <button className="entry-rm" onClick={onRemove}>×</button>}
      </div>
      <div className="cgrid2">
        <div className="cfield">
          <label className="clbl">Wallet / App</label>
          <select className="cinp wallet-f" value={slot.wallet} onChange={e => onUpdate("wallet", e.target.value)}>
            <option value="">Select wallet…</option>
            {WALLETS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div className="cfield">
          <label className="clbl">Mobile No.</label>
          <input className="cinp mono wallet-f" type="tel" placeholder="+94 7X XXX XXXX"
            value={slot.phone} onChange={e => onUpdate("phone", e.target.value)} />
        </div>
      </div>
      <div className="cfield" style={{ marginBottom: 7 }}>
        <label className="clbl">Transaction Reference No.</label>
        <input className="cinp mono wallet-f" type="text" placeholder="e.g. TXN-20260307-XXXXXX"
          value={slot.txRef} onChange={e => onUpdate("txRef", e.target.value)} />
      </div>
      <div className="slot-amt-row">
        <div className="cfield">
          <label className="clbl">Amount via this wallet ($)</label>
          <input className="cinp slot-amt wallet-amt" type="number" min={0} step={0.01} placeholder="0.00"
            value={slot.amount} onChange={e => onUpdate("amount", e.target.value)} />
        </div>
        <button className="fill-btn"
          style={{ color: "var(--purple)", borderColor: "var(--purplebr)", alignSelf: "flex-end", marginBottom: 1 }}
          onClick={onFill}>↙ Fill</button>
      </div>
    </div>
  );
}

// ── CHEQUE SLOT ───────────────────────────────────────────────────────────────
function ChequeSlot({ slot, index, onUpdate, onRemove, onFill }) {
  return (
    <div className="slot">
      <div className="slot-head">
        <div className="slot-badge">
          <span style={{ fontSize: 16 }}>🧾</span>
          <span className="slot-tag chq-tag">CHEQUE {String(index + 1).padStart(2, "0")}</span>
        </div>
        {index > 0 && <button className="entry-rm" onClick={onRemove}>×</button>}
      </div>
      <div className="cgrid2">
        <div className="cfield">
          <label className="clbl">Bank Name</label>
          <select className="cinp chq-f" value={slot.bank} onChange={e => onUpdate("bank", e.target.value)}>
            <option value="">Select bank…</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="cfield">
          <label className="clbl">Cheque No.</label>
          <input className="cinp mono chq-f" type="text" placeholder="000000"
            value={slot.chequeNo} onChange={e => onUpdate("chequeNo", e.target.value)} />
        </div>
      </div>
      <div className="cgrid2">
        <div className="cfield">
          <label className="clbl">Cheque Holder</label>
          <input className="cinp chq-f" type="text" placeholder="Name on cheque"
            value={slot.holder} onChange={e => onUpdate("holder", e.target.value)} />
        </div>
        <div className="cfield">
          <label className="clbl">Cheque Date</label>
          <input className="cinp chq-f" type="date"
            value={slot.date} onChange={e => onUpdate("date", e.target.value)} />
        </div>
      </div>
      <div className="slot-amt-row">
        <div className="cfield">
          <label className="clbl">Cheque Amount ($)</label>
          <input className="cinp slot-amt chq-amt" type="number" min={0} step={0.01} placeholder="0.00"
            value={slot.amount} onChange={e => onUpdate("amount", e.target.value)} />
        </div>
        <button className="fill-btn"
          style={{ color: "var(--gold)", borderColor: "var(--goldbr)", alignSelf: "flex-end", marginBottom: 1 }}
          onClick={onFill}>↙ Fill</button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function InvoicePayment({
  isOpen,
  total = 0,
  grossTotal = 0,
  lineDiscTotal = 0,
  invDiscAmt = 0,
  taxAmt = 0,
  taxRate = 0,
  extraCharge = 0,
  extraLabel = "Extra",
  customer = { name: "Cash Customer", address: "Walk-in / Counter Sale" },
  invoiceId = "INV-2026-000",
  onClose,
  onConfirm,
}) {
  const [amounts,      setAmounts]      = useState({ cash: "", card: "", wallet: "", contactless: "", cheque: "", credit: "" });
  const [cards,        setCards]        = useState([blankCard()]);
  const [wallets,      setWallets]      = useState([blankWallet()]);
  const [cheques,      setCheques]      = useState([blankCheque()]);
  const [cardOpen,     setCardOpen]     = useState(false);
  const [walletOpen,   setWalletOpen]   = useState(false);
  const [chequeOpen,   setChequeOpen]   = useState(false);
  const [note,         setNote]         = useState("");
  const cashRef = useRef(null);

  useEffect(() => { if (isOpen) setTimeout(() => cashRef.current?.focus(), 120); }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setAmounts({ cash: "", card: "", wallet: "", contactless: "", cheque: "", credit: "" });
      setCards([blankCard()]); setWallets([blankWallet()]); setCheques([blankCheque()]);
      setCardOpen(false); setWalletOpen(false); setChequeOpen(false);
      setNote("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  // ── Sync slot totals → top-level amounts (only when slots have values) ──────
  // Only overwrite amounts.card/wallet/cheque when the slot sum is > 0,
  // so opening the panel never clears what the user already typed.
  useEffect(() => {
    if (!isOpen) return;
    setAmounts(prev => {
      const next = { ...prev };
      if (cardOpen) {
        const t = cards.reduce((s, c) => s + (+c.amount || 0), 0);
        if (t > 0) next.card = fmt(t);
        // Do NOT clear when t === 0 — preserve what user typed in top-level field
      }
      if (walletOpen) {
        const t = wallets.reduce((s, w) => s + (+w.amount || 0), 0);
        if (t > 0) next.wallet = fmt(t);
      }
      if (chequeOpen) {
        const t = cheques.reduce((s, c) => s + (+c.amount || 0), 0);
        if (t > 0) next.cheque = fmt(t);
      }
      return next;
    });
  }, [cards, wallets, cheques, cardOpen, walletOpen, chequeOpen, isOpen]);
  // ──────────────────────────────────────────────────────────────────────────

  if (!isOpen) return null;

  // ── Totals ──
  // When panel is open: use slot sum if any slots have amounts, else fall back
  // to what the user typed in the top-level field. This way opening the panel
  // never loses the original amount, and slot entries update it correctly.
  const cardSlotSum   = cards.reduce((s, c)  => s + (+c.amount || 0), 0);
  const walletSlotSum = wallets.reduce((s, w) => s + (+w.amount || 0), 0);
  const chequeSlotSum = cheques.reduce((s, c) => s + (+c.amount || 0), 0);

  const effectiveCard   = cardOpen   ? (cardSlotSum   > 0 ? cardSlotSum   : (+amounts.card   || 0)) : (+amounts.card   || 0);
  const effectiveWallet = walletOpen ? (walletSlotSum > 0 ? walletSlotSum : (+amounts.wallet || 0)) : (+amounts.wallet || 0);
  const effectiveCheque = chequeOpen ? (chequeSlotSum > 0 ? chequeSlotSum : (+amounts.cheque || 0)) : (+amounts.cheque || 0);

  const totalPaid =
    (+amounts.cash        || 0) +
    (+amounts.contactless || 0) +
    (+amounts.credit      || 0) +
    effectiveCard + effectiveWallet + effectiveCheque;

  const remaining   = total - totalPaid;
  const change      = totalPaid > total + 0.001 ? totalPaid - total : 0;
  const isFullyPaid = totalPaid >= total - 0.001;
  const pct         = Math.min(100, (totalPaid / total) * 100);

  const cardAmt   = effectiveCard;
  const walletAmt = effectiveWallet;
  const chequeAmt = effectiveCheque;

  const setAmt = (id, val) => setAmounts(p => ({ ...p, [id]: val }));

  const fillFor = (id) => {
    const others = Object.entries(amounts).filter(([k]) => k !== id).reduce((s, [, v]) => s + (+v || 0), 0);
    setAmt(id, Math.max(0, total - others) > 0 ? fmt(Math.max(0, total - others)) : "");
  };

  // Card helpers
  const updateCard    = (id, f, v) => setCards(p => p.map(c => c.id === id ? { ...c, [f]: v } : c));
  const removeCard    = (id) => setCards(p => p.filter(c => c.id !== id));
  const fillCardSlot  = (cid) => {
    const others = cards.filter(c => c.id !== cid).reduce((s, c) => s + (+c.amount || 0), 0);
    updateCard(cid, "amount", fmt(Math.max(0, cardAmt - others)));
  };

  // Wallet helpers
  const updateWallet   = (id, f, v) => setWallets(p => p.map(w => w.id === id ? { ...w, [f]: v } : w));
  const removeWallet   = (id) => setWallets(p => p.filter(w => w.id !== id));
  const fillWalletSlot = (wid) => {
    const others = wallets.filter(w => w.id !== wid).reduce((s, w) => s + (+w.amount || 0), 0);
    updateWallet(wid, "amount", fmt(Math.max(0, walletAmt - others)));
  };

  // Cheque helpers
  const updateCheque   = (id, f, v) => setCheques(p => p.map(c => c.id === id ? { ...c, [f]: v } : c));
  const removeCheque   = (id) => setCheques(p => p.filter(c => c.id !== id));
  const fillChequeSlot = (cid) => {
    const others = cheques.filter(c => c.id !== cid).reduce((s, c) => s + (+c.amount || 0), 0);
    updateCheque(cid, "amount", fmt(Math.max(0, chequeAmt - others)));
  };

  const clearAll = () => {
    setAmounts({ cash: "", card: "", wallet: "", contactless: "", cheque: "", credit: "" });
    setCards([blankCard()]); setWallets([blankWallet()]); setCheques([blankCheque()]);
    setCardOpen(false); setWalletOpen(false); setChequeOpen(false);
  };

  // ── Breakdown for right panel ──
  const breakdownItems = [];
  ALL_METHODS.forEach(m => {
    const amt = +amounts[m.id] || 0;
    if (!amt) return;
    if (m.id === "card") {
      const filled = cards.filter(c => +c.amount > 0);
      filled.length > 0
        ? filled.forEach((c, i) => breakdownItems.push({ key: c.id, icon: "💳", label: `Card ${i + 1}`, color: m.color, amount: +c.amount, sub: [c.bank, c.last4 ? `···· ${c.last4}` : ""].filter(Boolean).join("  ") }))
        : breakdownItems.push({ key: m.id, icon: m.icon, label: m.label, color: m.color, amount: amt, sub: null });
    } else if (m.id === "wallet") {
      const filled = wallets.filter(w => +w.amount > 0);
      filled.length > 0
        ? filled.forEach((w, i) => breakdownItems.push({ key: w.id, icon: "📲", label: `Wallet ${i + 1}`, color: m.color, amount: +w.amount, sub: [w.wallet, w.txRef ? `Ref: ${w.txRef}` : ""].filter(Boolean).join("  ") }))
        : breakdownItems.push({ key: m.id, icon: m.icon, label: m.label, color: m.color, amount: amt, sub: null });
    } else if (m.id === "cheque") {
      const filled = cheques.filter(c => +c.amount > 0);
      filled.length > 0
        ? filled.forEach((c, i) => breakdownItems.push({ key: c.id, icon: "🧾", label: `Cheque ${i + 1}`, color: m.color, amount: +c.amount, sub: [c.bank, c.chequeNo ? `#${c.chequeNo}` : ""].filter(Boolean).join("  ") }))
        : breakdownItems.push({ key: m.id, icon: m.icon, label: m.label, color: m.color, amount: amt, sub: null });
    } else {
      breakdownItems.push({ key: m.id, icon: m.icon, label: m.label, color: m.color, amount: amt, sub: null });
    }
  });

  // Helper: hint text for disabled toggle
  const detailHint = (hasAmt, openState, enteredCount) => {
    if (!hasAmt) return <span className="toggle-hint">— enter amount above first</span>;
    if (openState && enteredCount > 0) return <span className="toggle-hint">({enteredCount} entered)</span>;
    return null;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ip-backdrop" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="ip-modal">

          {/* HEADER */}
          <div className="ip-head">
            <div>
              <div className="ip-eyebrow">Complete Payment</div>
              <div className="ip-htitle">Issue Invoice</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="ip-inv-badge">{invoiceId}</div>
              <button className="ip-x" onClick={onClose}>✕</button>
            </div>
          </div>

          <div className="ip-body">

            {/* ════ LEFT ════ */}
            <div className="ip-left">
              <div className="ip-sec">Payment Methods</div>

              {/* All method rows */}
              {ALL_METHODS.map((m) => {
                const val    = amounts[m.id];
                const hasVal = +val > 0;
                // When detail panel is open, top-level input is read-only (driven by slots)
                const isReadOnly =
                  (m.id === "card"   && cardOpen)   ||
                  (m.id === "wallet" && walletOpen) ||
                  (m.id === "cheque" && chequeOpen);
                return (
                  <div key={m.id} className={`m-row${hasVal ? " m-active" : ""}`}
                    style={hasVal ? { borderColor: m.br, background: m.bg } : {}}>
                    <div className="m-icon">{m.icon}</div>
                    <div className="m-label" style={hasVal ? { color: m.color } : {}}>{m.label}</div>
                    <div className={`m-inwrap${isReadOnly ? " readonly" : ""}`} style={hasVal ? { borderColor: m.br } : {}}>
                      <span className="m-prefix" style={hasVal ? { color: m.color } : {}}>$</span>
                      <input
                        ref={m.id === "cash" ? cashRef : undefined}
                        className="m-input"
                        type="number" min={0} step={0.01} placeholder="0.00"
                        value={val}
                        readOnly={isReadOnly}
                        style={hasVal ? { color: m.color } : {}}
                        onChange={(e) => !isReadOnly && setAmt(m.id, e.target.value)}
                      />
                    </div>
                    <button
                      className="fill-btn"
                      style={hasVal ? { color: m.color, borderColor: m.br } : {}}
                      disabled={isReadOnly}
                      onClick={() => fillFor(m.id)}
                    >↙ Fill</button>
                  </div>
                );
              })}

              {/* ── Add Card Details button — always visible ── */}
              <div style={{ marginTop: 8 }}>
                <button
                  className={`details-toggle card-toggle${cardOpen && cardAmt > 0 ? " t-open" : ""}`}
                  disabled={!cardAmt}
                  onClick={() => cardAmt > 0 && setCardOpen(o => !o)}
                >
                  <div className="toggle-left">
                    <span className="toggle-icon">💳</span>
                    <span>
                      {cardOpen && cardAmt > 0 ? "Hide Card Details" : "Add Card Details"}
                      {detailHint(cardAmt, cardOpen, cards.filter(c => c.bank || c.last4).length)}
                    </span>
                  </div>
                  <span className={`toggle-arrow${cardOpen && cardAmt > 0 ? " rotated" : ""}`}>▼</span>
                </button>
                <div className={`details-body${cardOpen && cardAmt > 0 ? " d-open" : ""}`}>
                  <div className="details-body-inner">
                    {cards.map((card, idx) => (
                      <CardSlot key={card.id} slot={card} index={idx}
                        onUpdate={(f, v) => updateCard(card.id, f, v)}
                        onRemove={() => removeCard(card.id)}
                        onFill={() => fillCardSlot(card.id)} />
                    ))}
                    {cards.length < 5 && (
                      <button className="add-slot-btn card-add"
                        onClick={() => setCards(p => [...p, blankCard()])}>
                        + Add Another Card
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Add Mobile Wallet Details button — always visible ── */}
              <div>
                <button
                  className={`details-toggle wallet-toggle${walletOpen && walletAmt > 0 ? " t-open" : ""}`}
                  disabled={!walletAmt}
                  onClick={() => walletAmt > 0 && setWalletOpen(o => !o)}
                >
                  <div className="toggle-left">
                    <span className="toggle-icon">📲</span>
                    <span>
                      {walletOpen && walletAmt > 0 ? "Hide Wallet Details" : "Add Mobile Wallet Details"}
                      {detailHint(walletAmt, walletOpen, wallets.filter(w => w.wallet || w.txRef).length)}
                    </span>
                  </div>
                  <span className={`toggle-arrow${walletOpen && walletAmt > 0 ? " rotated" : ""}`}>▼</span>
                </button>
                <div className={`details-body${walletOpen && walletAmt > 0 ? " d-open" : ""}`}>
                  <div className="details-body-inner wallet-inner">
                    {wallets.map((w, idx) => (
                      <WalletSlot key={w.id} slot={w} index={idx}
                        onUpdate={(f, v) => updateWallet(w.id, f, v)}
                        onRemove={() => removeWallet(w.id)}
                        onFill={() => fillWalletSlot(w.id)} />
                    ))}
                    {wallets.length < 5 && (
                      <button className="add-slot-btn wallet-add"
                        onClick={() => setWallets(p => [...p, blankWallet()])}>
                        + Add Another Wallet
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Add Cheque Details button — always visible ── */}
              <div>
                <button
                  className={`details-toggle chq-toggle${chequeOpen && chequeAmt > 0 ? " t-open" : ""}`}
                  disabled={!chequeAmt}
                  onClick={() => chequeAmt > 0 && setChequeOpen(o => !o)}
                >
                  <div className="toggle-left">
                    <span className="toggle-icon">🧾</span>
                    <span>
                      {chequeOpen && chequeAmt > 0 ? "Hide Cheque Details" : "Add Cheque Details"}
                      {detailHint(chequeAmt, chequeOpen, cheques.filter(c => c.bank || c.chequeNo).length)}
                    </span>
                  </div>
                  <span className={`toggle-arrow${chequeOpen && chequeAmt > 0 ? " rotated" : ""}`}>▼</span>
                </button>
                <div className={`details-body${chequeOpen && chequeAmt > 0 ? " d-open" : ""}`}>
                  <div className="details-body-inner chq-inner">
                    {cheques.map((chq, idx) => (
                      <ChequeSlot key={chq.id} slot={chq} index={idx}
                        onUpdate={(f, v) => updateCheque(chq.id, f, v)}
                        onRemove={() => removeCheque(chq.id)}
                        onFill={() => fillChequeSlot(chq.id)} />
                    ))}
                    {cheques.length < 5 && (
                      <button className="add-slot-btn chq-add"
                        onClick={() => setCheques(p => [...p, blankCheque()])}>
                        + Add Another Cheque
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Note + Clear */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div className="ip-sec-lbl">
                    Payment Note{" "}
                    <span style={{ fontWeight: 400, color: "var(--ink40)", letterSpacing: 0, textTransform: "none", fontSize: 11 }}>(optional)</span>
                  </div>
                  <button className="clear-all" onClick={clearAll}>Clear All</button>
                </div>
                <textarea className="ip-note" rows={2} value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Reference, memo, or transaction ID…" />
              </div>
            </div>

            {/* ════ RIGHT ════ */}
            <div className="ip-right">
              <div className="ip-sec-lbl">Invoice Summary</div>

              <div className="ip-cust">
                <div className="ip-cust-av">{initials(customer.name)}</div>
                <div>
                  <div className="ip-cust-name">{customer.name}</div>
                  <div className="ip-cust-det">{customer.address}</div>
                </div>
              </div>

              <div className="ip-total-box">
                <div className="ip-total-lbl">Total Due</div>
                <div className="ip-total-val">${fmt(total)}</div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 10.5, color: "var(--ink40)", fontWeight: 600, letterSpacing: ".5px" }}>
                  <span style={{ color: totalPaid > 0 ? "var(--green)" : undefined }}>
                    {totalPaid > 0 ? `$${fmt(totalPaid)} paid` : "AWAITING PAYMENT"}
                  </span>
                  <span style={{ color: isFullyPaid ? "var(--green)" : undefined }}>{pct.toFixed(0)}%</span>
                </div>
                <div className="ip-prog-track">
                  <div className="ip-prog-fill"
                    style={{ width: `${pct}%`, background: isFullyPaid ? "var(--green)" : "var(--gold)" }} />
                </div>
              </div>

              {/* Payment method breakdown */}
              <div className="ip-breakdown">
                {breakdownItems.length === 0 && <div className="bd-empty">No payments entered yet</div>}
                {breakdownItems.map(item => (
                  <div key={item.key} className="bd-row">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                      <span style={{ fontSize: 14, marginTop: 1 }}>{item.icon}</span>
                      <div>
                        <div className="bd-lbl" style={{ color: item.color }}>{item.label}</div>
                        {item.sub && <div className="bd-sub">{item.sub}</div>}
                      </div>
                    </div>
                    <span className="bd-val" style={{ color: item.color }}>${fmt(item.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Invoice mini breakdown */}
              <div className="ip-inv-mini">
                <div className="iim-row"><span>Gross Total</span><span className="iim-mono">${fmt(grossTotal)}</span></div>
                {lineDiscTotal > 0 && <div className="iim-row disc"><span>Line Discounts</span><span className="iim-mono">−${fmt(lineDiscTotal)}</span></div>}
                {invDiscAmt   > 0 && <div className="iim-row disc"><span>Invoice Discount</span><span className="iim-mono">−${fmt(invDiscAmt)}</span></div>}
                <div className="iim-row"><span>Tax ({taxRate}%)</span><span className="iim-mono">${fmt(taxAmt)}</span></div>
                {extraCharge  > 0 && <div className="iim-row"><span>{extraLabel || "Extra"}</span><span className="iim-mono">+${fmt(extraCharge)}</span></div>}
              </div>

              {/* Paid / Remaining / Change summary */}
              <div style={{ background: "var(--paper)", border: "1px solid var(--ink10)", borderRadius: 8, overflow: "hidden" }}>

                {/* Total Due row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--ink10)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--ink40)" }}>Total Due</span>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>${fmt(total)}</span>
                </div>

                {/* Paid row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid var(--ink10)", background: totalPaid > 0 ? "var(--greenbg)" : undefined }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>✓</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: totalPaid > 0 ? "var(--green)" : "var(--ink40)" }}>Paid</span>
                  </div>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, color: totalPaid > 0 ? "var(--green)" : "var(--ink40)" }}>${fmt(totalPaid)}</span>
                </div>

                {/* Remaining row — always shown */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: remaining > 0 ? "var(--redbg)" : "var(--greenbg)", borderBottom: change > 0 ? "1px solid var(--ink10)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{remaining > 0 ? "⏳" : "✓"}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: remaining > 0 ? "var(--red)" : "var(--green)" }}>Remaining</span>
                  </div>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, color: remaining > 0 ? "var(--red)" : "var(--green)" }}>${fmt(Math.max(0, remaining))}</span>
                </div>

                {/* Change row — only shown when overpaid */}
                {change > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--goldbg)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>↩</span>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "var(--gold)" }}>Change Due</span>
                    </div>
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>${fmt(change)}</span>
                  </div>
                )}
              </div>

              <button className={`ip-confirm${isFullyPaid ? " ready" : ""}`}
                disabled={!isFullyPaid}
                onClick={() => isFullyPaid && onConfirm?.({ amounts, cards, wallets, cheques, note })}>
                {isFullyPaid ? "✓ Confirm & Issue Invoice" : `Enter $${fmt(remaining)} more to continue`}
              </button>
              <button className="ip-cancel" onClick={onClose}>Cancel</button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}