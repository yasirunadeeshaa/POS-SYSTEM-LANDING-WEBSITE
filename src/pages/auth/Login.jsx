import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BRANCHES = [
  "Colombo Main Branch",
  "Kandy City Centre",
  "Negombo Outlet",
  "Gampaha Store",
  "Nugegoda Branch",
];

const FEATURES = [
  { icon: "↗", label: "Real-time Sales",   sub: "Live revenue tracking across all registers"    },
  { icon: "◈", label: "Smart Inventory",   sub: "Auto-reorder triggers & low-stock alerts"      },
  { icon: "⚡", label: "0.3s Checkout",     sub: "Fastest POS checkout speed in the industry"    },
  { icon: "⬡", label: "50+ Integrations", sub: "Stripe, Xero, Shopify & more out of the box"   },
];

const STATS = [
  { label: "Transactions daily", value: "10K+"  },
  { label: "Uptime SLA",         value: "99.9%" },
  { label: "Checkout speed",     value: "0.3s"  },
  { label: "Integrations",       value: "50+"   },
];

const ORDER_ITEMS = [
  { name: "Flat White",    price: 4.50,  qty: 2, cat: "Beverage" },
  { name: "Avocado Toast", price: 14.50, qty: 1, cat: "Food"     },
  { name: "Fresh OJ",      price: 6.00,  qty: 1, cat: "Beverage" },
];

const TICKER = [
  ["Revenue today","$4,820"],["Orders","1,042"],["Uptime","99.97%"],
  ["Checkout","0.3s"],["Stock synced","214 SKUs"],["Registers","3 of 4"],
  ["Payment success","99.8%"],["Revenue today","$4,820"],["Orders","1,042"],
  ["Uptime","99.97%"],["Checkout","0.3s"],["Stock synced","214 SKUs"],
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream:#F6F3EC; --paper:#FDFBF6; --warm:#EEE9DF; --warm2:#E4DDD2;
    --ink:#1B1713; --ink70:#4B4038; --ink50:#6B5F54; --ink40:#9E9080;
    --ink20:#C9C0B2; --ink10:#E4DDD2; --ink06:#EDE8E0;
    --gold:#B8902A; --goldl:#D4A83C; --goldd:#8A6A1A;
    --goldbg:rgba(184,144,42,.09); --goldbr:rgba(184,144,42,.28);
    --green:#2D6A4F; --greenbg:rgba(45,106,79,.09); --greenbr:rgba(45,106,79,.3);
    --red:#B5372A; --redbg:rgba(181,55,42,.08); --redbr:rgba(181,55,42,.25);
    --s3:0 24px 64px rgba(27,23,19,.22),0 4px 16px rgba(27,23,19,.1);
  }
  html,body,#root { height:100%; overflow:hidden; background:var(--ink); font-family:'DM Sans',sans-serif; color:var(--ink); }

  @keyframes lgFadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  @keyframes lgShake     { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-7px)} 30%{transform:translateX(7px)} 45%{transform:translateX(-5px)} 60%{transform:translateX(5px)} 75%{transform:translateX(-3px)} 88%{transform:translateX(3px)} }
  @keyframes lgRing1     { to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes lgRing2     { to{transform:translate(-50%,-50%) rotate(-360deg)} }
  @keyframes lgFloat     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes lgBlink     { 0%,100%{opacity:1} 50%{opacity:.25} }
  @keyframes lgTicker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes lgSpin      { to{transform:rotate(360deg)} }
  @keyframes lgGrad      { 0%,100%{background-position:0%} 50%{background-position:100%} }
  @keyframes overlayIn   { from{opacity:0} to{opacity:1} }

  /* ── SHELL ── */
  .lg-shell { display:flex; height:100vh; overflow:hidden; opacity:0; transition:opacity .45s ease; }
  .lg-shell.in { opacity:1; }

  /* ══════════ LEFT PANEL ══════════ */
  .lg-left {
    flex:0 0 52%; position:relative; overflow:hidden;
    background:linear-gradient(145deg,#1B1713 0%,#231E17 55%,#1A1611 100%);
    display:flex; flex-direction:column;
    border-right:1px solid rgba(184,144,42,.2);
  }
  .lg-canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; }
  .lg-orb { position:absolute; border-radius:50%; pointer-events:none; z-index:0; }
  .lg-orb-a { width:600px; height:600px; background:radial-gradient(circle,rgba(184,144,42,.07) 0%,transparent 65%); top:-180px; left:-160px; }
  .lg-orb-b { width:500px; height:500px; background:radial-gradient(circle,rgba(45,106,79,.06) 0%,transparent 65%); bottom:-150px; right:-100px; }
  .lg-ring  { position:absolute; border-radius:50%; pointer-events:none; top:50%; left:50%; transform:translate(-50%,-50%); }
  .lg-ring-1 { width:480px; height:480px; border:1.5px solid rgba(184,144,42,.08); animation:lgRing1 22s linear infinite; }
  .lg-ring-2 { width:660px; height:660px; border:1px solid rgba(184,144,42,.05);   animation:lgRing2 34s linear infinite; }

  .lg-left-content { position:relative; z-index:2; flex:1; display:flex; flex-direction:column; padding:32px 40px 0; }

  /* brand */
  .lg-brand { display:flex; align-items:center; gap:12px; animation:lgFadeUp .5s .1s ease both; }
  .lg-bmark { width:38px; height:38px; border-radius:8px; border:2px solid var(--gold); background:rgba(184,144,42,.1); display:flex; align-items:center; justify-content:center; font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:var(--goldl); }
  .lg-bname { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:#F6F3EC; letter-spacing:.3px; }
  .lg-bsub  { font-size:8.5px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-top:1px; }

  /* headline */
  .lg-headline { margin-top:28px; animation:lgFadeUp .5s .2s ease both; }
  .lg-eyebrow  { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
  .lg-eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); opacity:.6; }
  .lg-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(26px,2.8vw,42px); font-weight:700; line-height:1.1; letter-spacing:-.4px; color:#F6F3EC; margin-bottom:12px; }
  .lg-h1 .grad { background:linear-gradient(135deg,var(--goldl) 0%,#f0c060 50%,var(--gold) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; background-size:200%; animation:lgGrad 5s ease infinite; }
  .lg-h1 .dim  { color:rgba(244,241,233,.32); -webkit-text-fill-color:rgba(244,241,233,.32); }
  .lg-desc { font-size:13px; color:rgba(244,241,233,.42); line-height:1.75; max-width:360px; }

  /* feature pill */
  .lg-feat-wrap { margin-top:20px; height:54px; overflow:hidden; animation:lgFadeUp .5s .3s ease both; }
  .lg-feat { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:10px; background:rgba(244,241,233,.04); border:1px solid rgba(184,144,42,.14); transition:all .4s ease; }
  .lg-feat-ico { width:30px; height:30px; border-radius:7px; flex-shrink:0; background:rgba(184,144,42,.1); border:1px solid rgba(184,144,42,.22); display:flex; align-items:center; justify-content:center; font-size:14px; color:var(--goldl); }
  .lg-feat-lbl { font-size:12.5px; font-weight:700; color:#F6F3EC; margin-bottom:1px; }
  .lg-feat-sub { font-size:10px; color:rgba(244,241,233,.38); }

  /* stats */
  .lg-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:18px; animation:lgFadeUp .5s .35s ease both; }
  .lg-stat  { background:rgba(244,241,233,.03); border:1px solid rgba(184,144,42,.1); border-radius:8px; padding:9px 11px; transition:background .15s,border-color .15s; }
  .lg-stat:hover { background:rgba(184,144,42,.06); border-color:rgba(184,144,42,.22); }
  .lg-stat-val { font-family:'Geist Mono',monospace; font-size:15px; font-weight:600; color:var(--goldl); margin-bottom:3px; }
  .lg-stat-lbl { font-size:8.5px; color:rgba(244,241,233,.3); font-weight:500; letter-spacing:.5px; text-transform:uppercase; }

  /* POS card */
  .lg-pos-wrap { flex:1; display:flex; align-items:flex-end; justify-content:center; padding:0 20px; animation:lgFadeUp .5s .45s ease both; }
  .lg-pos {
    width:275px; margin-bottom:0;
    background:rgba(27,23,19,.93); border:1px solid rgba(184,144,42,.22); border-bottom:none;
    border-radius:16px 16px 0 0; overflow:hidden;
    box-shadow:0 -10px 50px rgba(184,144,42,.06),0 -4px 20px rgba(0,0,0,.4);
    backdrop-filter:blur(16px); animation:lgFloat 7s ease-in-out infinite;
  }
  .lg-pos-chrome { display:flex; align-items:center; gap:8px; padding:11px 14px; border-bottom:1px solid rgba(184,144,42,.14); background:rgba(244,241,233,.03); }
  .lg-pos-dots   { display:flex; gap:5px; }
  .lg-pos-dot    { width:9px; height:9px; border-radius:50%; }
  .lg-pos-title  { font-size:10px; color:rgba(244,241,233,.28); font-family:'Geist Mono',monospace; letter-spacing:.3px; margin:0 auto; }
  .lg-pos-live   { display:flex; align-items:center; gap:4px; font-size:9px; font-family:monospace; color:#86efac; font-weight:700; }
  .lg-pos-live-dot { width:5px; height:5px; background:#86efac; border-radius:50%; animation:lgBlink 1.3s infinite; }
  .lg-pos-inner  { padding:13px 14px; }
  .lg-pos-sec    { font-size:8.5px; text-transform:uppercase; letter-spacing:1.5px; color:rgba(244,241,233,.22); font-weight:700; margin-bottom:9px; }
  .lg-pos-row    { display:flex; align-items:center; justify-content:space-between; padding:7px 9px; background:rgba(244,241,233,.04); border:1px solid rgba(244,241,233,.06); border-radius:7px; margin-bottom:5px; transition:border-color .15s; }
  .lg-pos-row:hover { border-color:rgba(184,144,42,.2); }
  .lg-pos-name   { font-size:12px; font-weight:600; color:#F6F3EC; }
  .lg-pos-cat    { font-size:9px; color:rgba(244,241,233,.28); margin-top:1px; font-family:monospace; }
  .lg-pos-price  { font-size:12px; font-weight:700; background:linear-gradient(135deg,var(--goldl),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .lg-pos-qty    { font-size:9px; color:rgba(244,241,233,.28); text-align:right; margin-top:1px; font-family:monospace; }
  .lg-pos-div    { height:1px; background:rgba(244,241,233,.07); margin:10px 0; }
  .lg-pos-tot-row { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px; }
  .lg-pos-tot-lbl { font-size:11px; color:rgba(244,241,233,.38); }
  .lg-pos-tot-val { font-size:24px; font-weight:800; font-family:'Geist Mono',monospace; color:#F6F3EC; letter-spacing:-1px; }
  .lg-pos-charge  { width:100%; padding:10px; border:none; border-radius:8px; cursor:pointer; background:linear-gradient(135deg,var(--gold),#8A6A1A); color:#F6F3EC; font-size:12.5px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:7px; font-family:'DM Sans',sans-serif; box-shadow:0 4px 18px rgba(184,144,42,.35); transition:transform .2s,box-shadow .2s; }
  .lg-pos-charge:hover { transform:translateY(-2px); box-shadow:0 7px 24px rgba(184,144,42,.45); }
  .lg-sparkline   { padding:10px 14px 0; margin:0 -14px -13px; border-top:1px solid rgba(244,241,233,.06); background:rgba(184,144,42,.03); }
  .lg-spark-lbl   { font-size:8px; text-transform:uppercase; letter-spacing:1.5px; color:rgba(244,241,233,.2); margin-bottom:6px; }
  .lg-spark-bars  { display:flex; gap:3px; align-items:flex-end; height:26px; padding-bottom:10px; }
  .lg-spark-bar   { flex:1; border-radius:2px 2px 0 0; background:rgba(184,144,42,.16); min-height:3px; transition:background .2s; }
  .lg-spark-bar.act { background:linear-gradient(180deg,var(--goldl),var(--gold)); }

  /* ticker */
  .lg-ticker { position:relative; z-index:3; height:34px; border-top:1px solid rgba(184,144,42,.14); display:flex; align-items:center; overflow:hidden; background:rgba(27,23,19,.95); flex-shrink:0; }
  .lg-ticker-lbl { font-size:9px; font-family:monospace; color:var(--goldl); letter-spacing:1px; text-transform:uppercase; padding:0 16px; border-right:1px solid rgba(184,144,42,.14); white-space:nowrap; flex-shrink:0; }
  .lg-ticker-track { display:flex; white-space:nowrap; animation:lgTicker 26s linear infinite; flex:1; overflow:hidden; }
  .lg-ticker-item  { display:inline-flex; align-items:center; gap:6px; padding:0 22px; border-right:1px solid rgba(184,144,42,.08); font-size:10.5px; font-family:monospace; color:rgba(244,241,233,.28); }
  .lg-ticker-item span { color:var(--goldl); font-weight:700; }

  /* ══════════ RIGHT PANEL ══════════ */
  .lg-right { flex:1; display:flex; align-items:center; justify-content:center; background:var(--cream); padding:32px 24px; overflow-y:auto; }
  .lg-form-wrap { width:100%; max-width:400px; animation:lgFadeUp .5s .15s ease both; }

  /* form header */
  .lg-form-header { margin-bottom:26px; }
  .lg-form-eyebrow { font-size:9px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
  .lg-form-eyebrow::before { content:''; width:16px; height:1px; background:var(--gold); opacity:.6; }
  .lg-form-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:700; color:var(--ink); letter-spacing:-.4px; line-height:1.1; margin-bottom:6px; }
  .lg-form-sub   { font-size:12.5px; color:var(--ink40); line-height:1.65; }

  /* branch */
  .lg-branch-wrap { margin-bottom:20px; padding:12px 14px; background:var(--paper); border:1.5px solid var(--ink10); border-radius:8px; display:flex; align-items:center; gap:10px; }
  .lg-branch-ico  { width:32px; height:32px; border-radius:7px; flex-shrink:0; background:var(--goldbg); border:1px solid var(--goldbr); display:flex; align-items:center; justify-content:center; font-size:14px; }
  .lg-branch-lbl  { font-size:8.5px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--ink40); margin-bottom:4px; }
  .lg-branch-sw   { position:relative; flex:1; }
  .lg-branch-sw::after { content:'▾'; position:absolute; right:0; top:50%; transform:translateY(-50%); font-size:9px; color:var(--ink40); pointer-events:none; }
  .lg-branch-sel  { width:100%; background:transparent; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:var(--ink); padding-right:16px; cursor:pointer; appearance:none; }

  /* tabs */
  .lg-tabs { display:flex; border:1.5px solid var(--ink10); border-radius:8px; overflow:hidden; margin-bottom:20px; background:var(--warm); }
  .lg-tab  { flex:1; padding:10px 12px; text-align:center; cursor:pointer; font-size:12px; font-weight:600; color:var(--ink40); background:transparent; border:none; font-family:'DM Sans',sans-serif; transition:all .15s; display:flex; align-items:center; justify-content:center; gap:6px; }
  .lg-tab:first-child { border-right:1.5px solid var(--ink10); }
  .lg-tab.active { background:var(--ink); color:var(--goldl); }

  /* fields */
  .lg-field  { margin-bottom:14px; }
  .lg-lbl    { font-size:9.5px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:var(--ink40); margin-bottom:6px; display:block; }
  .lg-inp-w  { position:relative; }
  .lg-inp    { width:100%; padding:11px 14px; background:var(--paper); border:1.5px solid var(--ink10); border-radius:7px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--ink); outline:none; transition:border-color .18s,box-shadow .18s; }
  .lg-inp::placeholder { color:var(--ink20); }
  .lg-inp:hover  { border-color:var(--ink20); }
  .lg-inp:focus  { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.1); background:#fff; }
  .lg-inp.ico    { padding-left:40px; }
  .lg-inp.pw-btn { padding-right:52px; }
  .lg-field-ico  { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--ink20); font-size:15px; pointer-events:none; user-select:none; }
  .lg-pw-eye     { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--ink40); font-size:11px; font-weight:700; font-family:'DM Sans',sans-serif; padding:3px 5px; transition:color .15s; letter-spacing:.3px; }
  .lg-pw-eye:hover { color:var(--ink); }

  /* PIN */
  .lg-pin-row  { display:flex; gap:10px; justify-content:center; margin:8px 0 4px; }
  .lg-pin-cell { width:66px; height:66px; text-align:center; background:var(--paper); border:2px solid var(--ink10); border-radius:10px; font-family:'Geist Mono',monospace; font-size:22px; font-weight:700; color:var(--ink); outline:none; caret-color:var(--gold); transition:border-color .15s,box-shadow .15s,background .15s; }
  .lg-pin-cell::placeholder { color:var(--ink10); font-size:30px; }
  .lg-pin-cell:focus  { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,144,42,.12); background:#fff; }
  .lg-pin-cell.filled { border-color:var(--goldbr); background:var(--goldbg); color:var(--gold); }
  .lg-pin-hint { text-align:center; font-size:11px; color:var(--ink40); margin-top:6px; }

  /* remember */
  .lg-remember { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .lg-chk-wrap { display:flex; align-items:center; gap:8px; cursor:pointer; }
  .lg-chk      { width:16px; height:16px; border-radius:4px; cursor:pointer; accent-color:var(--gold); }
  .lg-chk-lbl  { font-size:12px; font-weight:500; color:var(--ink50); cursor:pointer; }
  .lg-forgot   { font-size:11.5px; font-weight:600; color:var(--gold); background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; transition:color .15s; }
  .lg-forgot:hover { color:var(--goldl); }

  /* error */
  .lg-error { display:flex; align-items:center; gap:8px; background:var(--redbg); border:1px solid var(--redbr); border-radius:7px; padding:9px 12px; margin-bottom:14px; font-size:12px; color:var(--red); font-weight:500; animation:lgFadeUp .2s ease both; }

  /* submit */
  .lg-submit { width:100%; padding:14px; border:none; border-radius:8px; background:var(--gold); color:#F6F3EC; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:9px; transition:background .15s,transform .15s,box-shadow .15s; box-shadow:0 4px 18px rgba(184,144,42,.32); letter-spacing:.2px; }
  .lg-submit:hover:not(:disabled) { background:var(--goldl); transform:translateY(-2px); box-shadow:0 8px 28px rgba(184,144,42,.42); }
  .lg-submit:disabled     { background:var(--ink20); cursor:not-allowed; transform:none; box-shadow:none; }
  .lg-submit.success      { background:var(--green); box-shadow:0 4px 18px rgba(45,106,79,.3); }

  /* spinner */
  .lg-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:lgSpin .7s linear infinite; flex-shrink:0; }

  /* divider */
  .lg-div { display:flex; align-items:center; gap:12px; margin:18px 0; font-size:11px; color:var(--ink20); font-weight:500; }
  .lg-div::before,.lg-div::after { content:''; flex:1; height:1px; background:var(--ink10); }

  /* demo hint */
  .lg-demo { background:var(--goldbg); border:1px solid var(--goldbr); border-radius:7px; padding:10px 13px; font-size:11.5px; color:var(--ink50); line-height:1.65; }
  .lg-demo strong { color:var(--gold); font-weight:700; }

  /* footer */
  .lg-footer { margin-top:20px; text-align:center; font-size:11px; color:var(--ink20); line-height:1.75; }
  .lg-footer a { color:var(--gold); font-weight:600; cursor:pointer; text-decoration:none; }
  .lg-footer a:hover { color:var(--goldl); }

  /* shake */
  .shake { animation:lgShake .5s ease; }

  /* success overlay */
  .lg-success-bd { position:fixed; inset:0; z-index:100; background:rgba(27,23,19,.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; animation:overlayIn .25s ease; }
  .lg-success-card { background:var(--paper); border:1.5px solid var(--greenbr); border-radius:16px; padding:36px 32px; text-align:center; box-shadow:var(--s3); animation:lgFadeUp .3s ease; max-width:320px; width:100%; }
  .lg-success-ico  { width:56px; height:56px; border-radius:50%; background:var(--greenbg); border:2px solid var(--greenbr); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 16px; }
  .lg-success-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:600; color:var(--ink); margin-bottom:6px; }
  .lg-success-sub   { font-size:12.5px; color:var(--ink40); margin-bottom:14px; }
  .lg-success-branch { font-family:'Geist Mono',monospace; font-size:12px; font-weight:600; color:var(--green); background:var(--greenbg); border:1px solid var(--greenbr); border-radius:6px; padding:6px 14px; display:inline-block; }

  /* scrollbar */
  .lg-right::-webkit-scrollbar { width:4px; }
  .lg-right::-webkit-scrollbar-thumb { background:var(--ink10); border-radius:2px; }
`;

export default function LoginPage() {
  const navigate = useNavigate();

  const [tab,      setTab]      = useState("password");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [pin,      setPin]      = useState(["","","",""]);
  const [branch,   setBranch]   = useState(BRANCHES[0]);
  const [remember, setRemember] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [shake,    setShake]    = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [amount,   setAmount]   = useState(0);
  const [tick,     setTick]     = useState(0);
  const [feat,     setFeat]     = useState(0);
  const [entered,  setEntered]  = useState(false);

  const canvasRef = useRef(null);
  const pinRefs   = useRef([]);

  // ── Particle canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 55 }, () => ({
      x:  Math.random() * 2000,
      y:  Math.random() * 2000,
      r:  Math.random() * 1.6 + 0.5,
      sx: (Math.random() - 0.5) * 0.32,
      sy: (Math.random() - 0.5) * 0.32,
      op: Math.random() * 0.35 + 0.1,
    }));

    let id;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x = (p.x + p.sx + canvas.width)  % canvas.width;
        p.y = (p.y + p.sy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,144,42,${p.op})`;
        ctx.fill();
      });
      pts.forEach((a, i) =>
        pts.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 105) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(184,144,42,${0.07 * (1 - d / 105)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        })
      );
      id = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  // ── Timers ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 90);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let c = 0;
    const target = 29.50;
    const step = target / 30;
    const t = setInterval(() => {
      c = Math.min(c + step, target);
      setAmount(c);
      if (c >= target) clearInterval(t);
    }, 45);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeat(n => (n + 1) % FEATURES.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ── PIN ─────────────────────────────────────────────────────────────────────
  const handlePinKey = (i, e) => {
    if (e.key === "Backspace") {
      const n = [...pin]; n[i] = ""; setPin(n); setError("");
      if (i > 0) pinRefs.current[i - 1]?.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const n = [...pin]; n[i] = e.key; setPin(n); setError("");
    if (i < 3) setTimeout(() => pinRefs.current[i + 1]?.focus(), 0);
  };

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 550); };

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setPin(["","","",""]);
    setEmail("");
    setPassword("");
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tab === "password") {
      if (!email.trim()) { setError("Please enter your email or username."); triggerShake(); return; }
      if (!password)      { setError("Please enter your password.");          triggerShake(); return; }
    } else {
      if (pin.some(d => d === "")) { setError("Please enter all 4 PIN digits."); triggerShake(); return; }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1300));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/dashboard"), 900);
  };

  const canSubmit = !loading && !success &&
    (tab === "password" ? (email && password) : pin.every(d => d !== ""));

  return (
    <>
      <style>{CSS}</style>

      <div className={`lg-shell${entered ? " in" : ""}`}>

        {/* ═══════════════ LEFT ═══════════════ */}
        <div className="lg-left">
          <canvas ref={canvasRef} className="lg-canvas" />
          <div className="lg-orb lg-orb-a" />
          <div className="lg-orb lg-orb-b" />
          <div className="lg-ring lg-ring-1" />
          <div className="lg-ring lg-ring-2" />

          <div className="lg-left-content">
            {/* Brand */}
            <div className="lg-brand">
              <div className="lg-bmark">N</div>
              <div>
                <div className="lg-bname">Nexus POS</div>
                <div className="lg-bsub">Command Centre</div>
              </div>
            </div>

            {/* Headline */}
            <div className="lg-headline">
              <div className="lg-eyebrow">Point of Sale · Enterprise</div>
              <h1 className="lg-h1">
                The POS that moves<br />
                as fast as <span className="grad">your business</span><br />
                <span className="dim">was built to.</span>
              </h1>
              <p className="lg-desc">
                Cloud-native point-of-sale for modern retail, restaurants, and service businesses.
                Real-time inventory, predictive analytics, and seamless payments — all unified.
              </p>
            </div>

            {/* Rotating feature pill */}
            <div className="lg-feat-wrap">
              <div className="lg-feat">
                <div className="lg-feat-ico">{FEATURES[feat].icon}</div>
                <div>
                  <div className="lg-feat-lbl">{FEATURES[feat].label}</div>
                  <div className="lg-feat-sub">{FEATURES[feat].sub}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg-stats">
              {STATS.map(s => (
                <div className="lg-stat" key={s.label}>
                  <div className="lg-stat-val">{s.value}</div>
                  <div className="lg-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Live POS Card */}
            <div className="lg-pos-wrap">
              <div className="lg-pos">
                <div className="lg-pos-chrome">
                  <div className="lg-pos-dots">
                    <div className="lg-pos-dot" style={{ background: "#ef4444" }} />
                    <div className="lg-pos-dot" style={{ background: "#f59e0b" }} />
                    <div className="lg-pos-dot" style={{ background: "#10b981" }} />
                  </div>
                  <span className="lg-pos-title">Order #1042 · Table 7</span>
                  <div className="lg-pos-live">
                    <span className="lg-pos-live-dot" /> LIVE
                  </div>
                </div>
                <div className="lg-pos-inner">
                  <div className="lg-pos-sec">Order items</div>
                  {ORDER_ITEMS.map(item => (
                    <div className="lg-pos-row" key={item.name}>
                      <div>
                        <div className="lg-pos-name">{item.name}</div>
                        <div className="lg-pos-cat">{item.cat}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="lg-pos-price">${item.price.toFixed(2)}</div>
                        <div className="lg-pos-qty">×{item.qty}</div>
                      </div>
                    </div>
                  ))}
                  <div className="lg-pos-div" />
                  <div className="lg-pos-tot-row">
                    <span className="lg-pos-tot-lbl">Total due</span>
                    <span className="lg-pos-tot-val">${amount.toFixed(2)}</span>
                  </div>
                  <button className="lg-pos-charge">
                    <span>↗</span> Charge ${amount.toFixed(2)}
                  </button>
                  <div className="lg-sparkline">
                    <div className="lg-spark-lbl">Hourly revenue</div>
                    <div className="lg-spark-bars">
                      {[30,52,44,68,45,72,88,62,95,80,100, tick % 100].map((h, i, arr) => (
                        <div
                          key={i}
                          className={`lg-spark-bar${i === arr.length - 1 ? " act" : ""}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker */}
          <div className="lg-ticker">
            <span className="lg-ticker-lbl">↑ Live</span>
            <div className="lg-ticker-track">
              {TICKER.map(([label, val], i) => (
                <span className="lg-ticker-item" key={i}>
                  {label} — <span>{val}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ RIGHT ═══════════════ */}
        <div className="lg-right">
          <div className={`lg-form-wrap${shake ? " shake" : ""}`}>

            {/* Header */}
            <div className="lg-form-header">
              <div className="lg-form-eyebrow">Nexus POS · Secure Access</div>
              <h2 className="lg-form-title">Welcome back</h2>
              <p className="lg-form-sub">
                Sign in to your store dashboard. Enter any credentials to access.
              </p>
            </div>

            {/* Branch selector */}
            <div className="lg-branch-wrap">
              <div className="lg-branch-ico">🏪</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lg-branch-lbl">Store / Branch</div>
                <div className="lg-branch-sw">
                  <select
                    className="lg-branch-sel"
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                  >
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="lg-tabs">
              <button
                className={`lg-tab${tab === "password" ? " active" : ""}`}
                type="button"
                onClick={() => switchTab("password")}
              >
                🔑 Password
              </button>
              <button
                className={`lg-tab${tab === "pin" ? " active" : ""}`}
                type="button"
                onClick={() => switchTab("pin")}
              >
                🔢 PIN
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>

              {tab === "password" ? (
                <>
                  <div className="lg-field">
                    <label className="lg-lbl">Email or Username</label>
                    <div className="lg-inp-w">
                      <span className="lg-field-ico">👤</span>
                      <input
                        className="lg-inp ico"
                        type="text"
                        placeholder="staff@nexuspos.com"
                        value={email}
                        autoFocus
                        autoComplete="username"
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                      />
                    </div>
                  </div>

                  <div className="lg-field">
                    <label className="lg-lbl">Password</label>
                    <div className="lg-inp-w">
                      <span className="lg-field-ico">🔒</span>
                      <input
                        className="lg-inp ico pw-btn"
                        type={showPw ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        autoComplete="current-password"
                        onChange={e => { setPassword(e.target.value); setError(""); }}
                      />
                      <button
                        type="button"
                        className="lg-pw-eye"
                        onClick={() => setShowPw(v => !v)}
                      >
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="lg-field">
                  <label className="lg-lbl" style={{ textAlign: "center", display: "block" }}>
                    Enter 4-Digit PIN
                  </label>
                  <div className="lg-pin-row">
                    {pin.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => pinRefs.current[i] = el}
                        className={`lg-pin-cell${digit ? " filled" : ""}`}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        placeholder="·"
                        autoFocus={i === 0}
                        onKeyDown={e => handlePinKey(i, e)}
                        onChange={() => {}}
                      />
                    ))}
                  </div>
                  <div className="lg-pin-hint">Use your assigned staff PIN</div>
                </div>
              )}

              {/* Remember + Forgot */}
              <div className="lg-remember">
                <label className="lg-chk-wrap">
                  <input
                    type="checkbox"
                    className="lg-chk"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span className="lg-chk-lbl">Remember this device</span>
                </label>
                <button type="button" className="lg-forgot">Forgot password?</button>
              </div>

              {/* Error */}
              {error && (
                <div className="lg-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`lg-submit${success ? " success" : ""}`}
                disabled={!canSubmit}
              >
                {loading ? (
                  <><div className="lg-spinner" /> Signing in…</>
                ) : success ? (
                  <>✓ Signed in — redirecting…</>
                ) : (
                  <>Sign In to {branch.split(" ")[0]} →</>
                )}
              </button>
            </form>

            <div className="lg-div">or</div>

            {/* Demo hint */}
            <div className="lg-demo">
              <strong>Demo mode:</strong> Enter any email &amp; password (or any 4‑digit PIN) to sign in
              and explore the full Nexus POS dashboard.
            </div>

            {/* Footer */}
            <div className="lg-footer">
              Need help? <a href="#">Contact your system administrator</a><br />
              <span style={{ opacity: .55 }}>Nexus POS v2.6 · © 2026 Nexus Technologies</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Success overlay ── */}
      {success && (
        <div className="lg-success-bd">
          <div className="lg-success-card">
            <div className="lg-success-ico">✓</div>
            <div className="lg-success-title">Access Granted</div>
            <div className="lg-success-sub">Loading your dashboard…</div>
            <div className="lg-success-branch">{branch}</div>
          </div>
        </div>
      )}
    </>
  );
}