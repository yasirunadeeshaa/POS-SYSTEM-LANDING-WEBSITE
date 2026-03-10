import { useState, useEffect, useRef } from "react";
import InvoicePayment from "./InvoicePayment";
import InvoiceSummaryModal from "./InvoiceSummaryModal";

// ── DATA ─────────────────────────────────────────────────────────────────────
const CASH_CUSTOMER = { id: 0, name: "Cash Customer", email: "—", phone: "—", address: "Walk-in / Counter Sale" };

const mockCustomers = [
  { id: 1, name: "Ravi Mendis",          email: "ravi.m@email.com",   phone: "+94 77 123 4567", address: "12 Elm Street, Austin TX 78701" },
  { id: 2, name: "Priya Samarawickrama", email: "priya.s@email.com",  phone: "+94 71 987 6543", address: "88 Maple Ave, Brooklyn NY 11201" },
  { id: 3, name: "Daniel Wijesuriya",    email: "d.wije@outlook.com", phone: "+94 76 555 0011", address: "5 Harbor Blvd, Miami FL 33101" },
  { id: 4, name: "Amara Perera",         email: "amara.p@email.com",  phone: "+94 75 444 9920", address: "22 King St, Colombo 02" },
];

const productCatalog = [
  { sku: "WEP-221", name: "Wireless Earbuds Pro",   price: 59.99, cat: "Electronics" },
  { sku: "CCT-089", name: "Cotton Crew T-Shirt",    price: 18.00, cat: "Apparel" },
  { sku: "LWS-441", name: "Leather Wallet Slim",    price: 25.00, cat: "Accessories" },
  { sku: "SCS-112", name: "Scented Candle Set",     price: 16.00, cat: "Home" },
  { sku: "SWB-330", name: "Stainless Water Bottle", price: 16.99, cat: "Lifestyle" },
  { sku: "NAG-007", name: "Notebook A5 Grid",       price: 6.00,  cat: "Stationery" },
  { sku: "UCH-880", name: "USB-C Hub 7-in-1",       price: 34.99, cat: "Electronics" },
  { sku: "PCI-556", name: "Phone Case iPhone",      price: 14.99, cat: "Accessories" },
];

const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
function genInvId() { return `INV-2026-${String(Math.floor(Math.random() * 900) + 100)}`; }

// ── MAIN INVOICE ──────────────────────────────────────────────────────────────
export default function Invoice() {
  const [invoiceId] = useState(genInvId);
  const [dueDate, setDueDate] = useState("2026-03-21");
  const [taxRate, setTaxRate] = useState(8);
  const [note, setNote]       = useState("Thank you for your purchase.");

  const [customer, setCustomer]         = useState(CASH_CUSTOMER);
  const [custMode, setCustMode]         = useState("cash");
  const [custSearch, setCustSearch]     = useState("");
  const [showCustDrop, setShowCustDrop] = useState(false);

  const [lineItems, setLineItems] = useState([
    { id: 1, ...productCatalog[0], qty: 1, lineDisc: 0 },
    { id: 2, ...productCatalog[2], qty: 2, lineDisc: 10 },
  ]);
  const [prodSearch, setProdSearch]     = useState("");
  const [showProdDrop, setShowProdDrop] = useState(false);

  const [invoiceDisc, setInvoiceDisc]         = useState(0);
  const [invoiceDiscType, setInvoiceDiscType] = useState("pct");
  const [extraCharge, setExtraCharge]         = useState(0);
  const [extraLabel, setExtraLabel]           = useState("Delivery");

  const [showPayModal, setShowPayModal] = useState(false);
  const [issued, setIssued]             = useState(false);

  const [showSummary, setShowSummary] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // ── DERIVED ──
  const grossTotal     = lineItems.reduce((s, i) => s + i.price * i.qty, 0);                                      // sum of price × qty, no discounts
  const lineDiscTotal  = lineItems.reduce((s, i) => s + i.price * i.qty * (i.lineDisc / 100), 0);                // total saved from line discounts
  const lineSubtotal   = grossTotal - lineDiscTotal;                                                               // after line discounts
  const invDiscAmt     = invoiceDiscType === "pct"
    ? lineSubtotal * (invoiceDisc / 100)
    : Math.min(+invoiceDisc, lineSubtotal);
  const afterDisc = lineSubtotal - invDiscAmt;
  const taxAmt    = afterDisc * (taxRate / 100);
  const total     = afterDisc + taxAmt + +extraCharge;
  const totalItems     = lineItems.reduce((s, i) => s + i.qty, 0);
  const totalSaved     = lineDiscTotal + invDiscAmt;

  const addItem    = (p) => { setLineItems(prev => [...prev, { id: Date.now(), ...p, qty: 1, lineDisc: 0 }]); setShowProdDrop(false); setProdSearch(""); };
  const updateItem = (id, f, v) => setLineItems(prev => prev.map(i => i.id === id ? { ...i, [f]: v } : i));
  const removeItem = (id) => setLineItems(prev => prev.filter(i => i.id !== id));

  const filtCust = mockCustomers.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()));
  const filtProd = productCatalog.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(prodSearch.toLowerCase())
  );

  const handleConfirm = (paymentData) => {
    setLastPayment(paymentData);
    setShowPayModal(false);
    setIssued(true);
    setShowSummary(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --cream:#F6F3EC;--paper:#FDFBF6;--warm:#EEE9DF;
          --ink:#1B1713;--ink70:#4B4038;--ink40:#9E9080;--ink20:#C9C0B2;--ink10:#E4DDD2;
          --gold:#B8902A;--goldl:#D4A83C;--goldbg:rgba(184,144,42,.07);--goldbr:rgba(184,144,42,.22);
          --green:#2D6A4F;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
          --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);
          --s0:0 1px 3px rgba(27,23,19,.06),0 1px 2px rgba(27,23,19,.04);
          --s2:0 8px 28px rgba(27,23,19,.12),0 2px 6px rgba(27,23,19,.06);
          --s3:0 24px 64px rgba(27,23,19,.22),0 4px 16px rgba(27,23,19,.1);
        }
        html,body,#root{height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink);overflow:hidden}
        .page{display:flex;flex-direction:column;height:100vh}

        /* ── TOPBAR ── */
        .tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--gold);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:20}
        .tb-l{display:flex;align-items:center;gap:20px}
        .brand{display:flex;align-items:center;gap:10px}
        .bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
        .bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
        .bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-top:1px}
        .bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
        .bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.bca:hover{color:rgba(246,243,236,.65)}
        .bcsep{color:rgba(246,243,236,.15)}.bccur{color:var(--goldl);font-weight:500}
        .tb-r{display:flex;align-items:center;gap:7px}
        .av{width:30px;height:30px;border-radius:4px;border:1.5px solid var(--goldbr);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:600;color:var(--goldl)}
        .btn{display:inline-flex;align-items:center;gap:5px;padding:7px 15px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
        .btn-gold{background:var(--gold);color:#F6F3EC;font-weight:600}
        .btn-gold:hover{background:#C99B2E;transform:translateY(-1px);box-shadow:0 4px 14px rgba(184,144,42,.35)}
        .btn-ol{background:transparent;border:1px solid rgba(246,243,236,.18)!important;color:rgba(246,243,236,.4)}
        .btn-ol:hover{border-color:rgba(246,243,236,.4)!important;color:rgba(246,243,236,.75)}
        .btn-gh{background:transparent;border:1px solid rgba(246,243,236,.1)!important;color:rgba(246,243,236,.28)}
        .btn-gh:hover{color:rgba(246,243,236,.55);border-color:rgba(246,243,236,.2)!important}

        /* ── LAYOUT ── */
        .body{flex:1;overflow:hidden;display:flex;padding:14px 16px;gap:12px;background:var(--cream)}
        .col-l{width:300px;flex-shrink:0;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
        .col-m{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
        .col-r{width:400px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden}
        .col-l::-webkit-scrollbar,.col-r::-webkit-scrollbar{width:3px}
        .col-l::-webkit-scrollbar-thumb,.col-r::-webkit-scrollbar-thumb{background:var(--ink10);border-radius:2px}

        /* ── CARD ── */
        .card{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;padding:14px 16px;box-shadow:var(--s0)}
        .ctitle{font-size:9px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:12px}
        .ctitle::after{content:'';flex:1;height:1px;background:var(--ink10)}

        /* ── FORM ── */
        .field{display:flex;flex-direction:column;gap:5px;margin-bottom:9px}
        .field:last-child{margin-bottom:0}
        .lbl{font-size:9.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:var(--ink40)}
        .inp{background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:8px 10px;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;outline:none;width:100%;transition:border-color .15s,box-shadow .15s}
        .inp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
        .inp[readonly]{color:var(--gold);font-family:'Geist Mono',monospace;font-size:11px;background:var(--goldbg);border-color:var(--goldbr);cursor:default}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:9px}

        /* ── CUSTOMER ── */
        .ctog{display:flex;border:1px solid var(--ink10);border-radius:6px;overflow:hidden;margin-bottom:10px}
        .ctab{flex:1;padding:8px 8px;text-align:center;font-size:11px;font-weight:500;cursor:pointer;background:var(--warm);color:var(--ink40);border:none;font-family:'DM Sans',sans-serif;transition:all .15s}
        .ctab.active{background:var(--ink);color:var(--goldl);font-weight:700}
        .ctab:first-child{border-right:1px solid var(--ink10)}
        .cpill{display:flex;align-items:flex-start;gap:10px;background:var(--goldbg);border:1px solid var(--goldbr);border-radius:6px;padding:10px 12px}
        .cav{width:36px;height:36px;border-radius:5px;flex-shrink:0;background:var(--ink);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--goldl)}
        .cav.cash{background:var(--warm);border-color:var(--ink20);font-size:18px}
        .cname{font-size:13px;font-weight:600;color:var(--ink)}
        .cdet{font-size:11px;color:var(--ink40);line-height:1.7;margin-top:1px}

        /* ── SEARCH ── */
        .sbox{display:flex;align-items:center;gap:7px;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:0 10px;height:34px;transition:border-color .15s}
        .sbox:focus-within{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
        .sico{color:var(--ink20);font-size:13px}
        .sinp{background:transparent;border:none;outline:none;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;width:100%}
        .sinp::placeholder{color:var(--ink20)}
        .drop{position:absolute;top:calc(100% + 5px);left:0;right:0;background:var(--paper);border:1px solid var(--ink10);border-radius:7px;z-index:100;box-shadow:var(--s2);overflow:hidden}
        .ditem{padding:9px 12px;cursor:pointer;transition:background .1s;border-bottom:1px solid var(--ink10)}
        .ditem:last-child{border-bottom:none}
        .ditem:hover{background:var(--warm)}
        .dn{font-size:12.5px;font-weight:600;color:var(--ink)}
        .ds{font-size:11px;color:var(--ink40);margin-top:1px}

        /* ── MIDDLE ── */
        .mcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);display:flex;flex-direction:column;flex:1;overflow:hidden}
        .mhead{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:var(--ink);border-bottom:2px solid var(--gold);border-radius:6px 6px 0 0;flex-shrink:0}
        .mtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
        .tscroll{flex:1;overflow-y:auto}
        .tscroll::-webkit-scrollbar{width:3px}
        .tscroll::-webkit-scrollbar-thumb{background:var(--ink10)}
        .thead{display:grid;grid-template-columns:26px 1fr 90px 90px 70px 76px 98px 150px 82px 86px 28px;gap:6px;padding:8px 14px;background:#EDE8DE;border-bottom:2px solid var(--gold);position:sticky;top:0;z-index:2}
        .tth{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
        .trow{display:grid;grid-template-columns:26px 1fr 90px 90px 70px 76px 98px 150px 82px 86px 28px;gap:6px;align-items:center;padding:9px 14px;border-bottom:1px solid var(--ink10);transition:background .1s}
        .trow:last-child{border-bottom:none}
        .trow:hover{background:var(--warm)}
        .tnum{font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink20);font-weight:600}
        .tpname{font-size:12.5px;font-weight:500;color:var(--ink)}
        .tsku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--ink40)}
        .tcat{display:inline-block;padding:1px 5px;background:var(--warm);border:1px solid var(--ink10);border-radius:3px;font-size:9px;color:var(--ink40);font-weight:700;letter-spacing:.5px}
        .tprice{font-size:12px;color:var(--ink70)}
        .tmrp{font-size:12px;color:var(--ink20);text-decoration:line-through}
        .tdiscprice{font-size:12px;font-weight:600;color:var(--green); align-items:center;}
        .tgross{font-size:13px;font-weight:700;color:var(--ink);text-align:right}
        .tinp{background:var(--warm);border:1px solid var(--ink10);border-radius:4px;padding:5px 6px;color:var(--ink);font-size:12.5px;font-weight:500;font-family:'DM Sans',sans-serif;outline:none;width:100%;text-align:center;transition:border-color .13s}
        .tinp:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,144,42,.12)}
        .tdinp{background:var(--greenbg);border:1px solid var(--greenbr);border-radius:4px;padding:5px 6px;color:var(--green);font-size:12.5px;font-weight:600;font-family:'DM Sans',sans-serif;outline:none;width:100%;text-align:center}
        .tdinp:focus{border-color:var(--green)}
        .ttot{font-size:13px;font-weight:700;color:var(--ink);text-align:right}
        .trm{width:24px;height:24px;background:transparent;border:1px solid transparent;border-radius:4px;color:var(--ink20);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .13s;line-height:1}
        .trm:hover{background:var(--redbg);color:var(--red);border-color:var(--redbr)}
        .tempty{padding:36px 20px;text-align:center;color:var(--ink20);font-size:13px}

        /* ── TOTALS BAR ── */
        .tbar{background:var(--ink);border-top:2px solid var(--gold);padding:12px 16px;border-radius:0 0 6px 6px;flex-shrink:0}
        .tgrid{display:grid;grid-template-columns:1fr 1fr 1fr 1px 0.6fr;align-items:center}
        .ti{padding:0 12px}
        .ti:first-child{padding-left:0}
        .tlbl{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.3);font-weight:700;margin-bottom:3px}
        .tval{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:500;color:rgba(246,243,236,.7)}
        .tdiv{width:1px;height:32px;background:rgba(246,243,236,.1);margin:0 4px}
        .tgrand .tlbl{color:var(--gold)}
        .tgrand .tval{font-size:19px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

        /* ── RIGHT PANEL ── */
        .rcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);overflow:hidden;flex:1;display:flex;flex-direction:column}
        .rhead{background:var(--ink);padding:12px 16px;border-bottom:2px solid var(--gold);flex-shrink:0}
        .rsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:3px}
        .rtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC}
        .rbody{padding:14px 16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px}
        .rbody::-webkit-scrollbar{width:3px}
        .rbody::-webkit-scrollbar-thumb{background:var(--ink10)}
        .sec{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .sec::after{content:'';flex:1;height:1px;background:var(--ink10)}

        /* Right panel form elements */
        .dtabs{display:flex;border:1px solid var(--ink10);border-radius:5px;overflow:hidden;margin-bottom:8px}
        .dtab{flex:1;padding:7px;text-align:center;cursor:pointer;font-size:10.5px;font-weight:600;background:var(--warm);color:var(--ink40);border:none;font-family:'DM Sans',sans-serif;transition:all .15s}
        .dtab.active{background:var(--green);color:#fff}
        .dtab:first-child{border-right:1px solid var(--ink10)}
        .dinpwrap{position:relative}
        .dinp{width:100%;background:var(--greenbg);border:1px solid var(--greenbr);border-radius:5px;padding:9px 28px 9px 10px;color:var(--green);font-size:15px;font-weight:600;font-family:'Geist Mono',monospace;outline:none;transition:border-color .15s}
        .dinp:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(45,106,79,.1)}
        .dunit{position:absolute;right:9px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--green);font-family:'Geist Mono',monospace;font-weight:600;pointer-events:none}
        .exrow{display:grid;grid-template-columns:1fr 80px;gap:8px;align-items:end}
        .cinp{width:100%;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:8px 10px;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s}
        .cinp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
        .nota{width:100%;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:9px 10px;resize:none;color:var(--ink70);font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;line-height:1.6;outline:none;transition:border-color .15s}
        .nota:focus{border-color:var(--gold)}

        /* Summary rows */
        .srow{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
        .slbl{color:var(--ink40)}
        .sval{color:var(--ink70);font-weight:500;font-family:'Geist Mono',monospace;font-size:11.5px}
        .srow.disc .slbl,.srow.disc .sval{color:var(--green)}
        .shr{height:1px;background:var(--ink10);margin:6px 0}
        .stot{display:flex;justify-content:space-between;align-items:center;background:var(--ink);border-radius:5px;padding:10px 12px;margin-top:2px}
        .stlbl{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--goldl);letter-spacing:.3px}
        .stval{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

        /* Issue button */
        .issue-btn{background:var(--gold);color:#F6F3EC;width:100%;justify-content:center;padding:13px;font-size:14px;font-weight:700;letter-spacing:.3px;border-radius:6px;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:8px;margin-top:auto}
        .issue-btn:hover{background:#C99B2E;transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,144,42,.4)}
        .issue-btn:disabled{background:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none}
        .draft-btn{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);width:100%;justify-content:center;padding:9px;font-size:12px;font-weight:500;border-radius:5px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;margin-top:7px}
        .draft-btn:hover{border-color:var(--ink20);color:var(--ink70)}

        /* ── MODAL BACKDROP ── */
        .modal-backdrop{position:fixed;inset:0;background:rgba(27,23,19,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:bdIn .2s ease}
        @keyframes bdIn{from{opacity:0}to{opacity:1}}

        /* ── MODAL ── */
        .modal{background:var(--paper);border:1px solid var(--ink10);border-radius:12px;box-shadow:var(--s3);width:100%;max-width:820px;max-height:92vh;overflow:hidden;display:flex;flex-direction:column;animation:modalIn .22s cubic-bezier(.34,1.2,.64,1)}
        @keyframes modalIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}

        .modal-head{background:var(--ink);border-bottom:2px solid var(--gold);padding:16px 22px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .modal-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:4px}
        .modal-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
        .modal-inv-badge{font-family:'Geist Mono',monospace;font-size:12px;font-weight:500;color:var(--goldl);background:rgba(184,144,42,.1);border:1px solid var(--goldbr);border-radius:5px;padding:5px 10px;letter-spacing:.8px}
        .modal-close{width:32px;height:32px;border-radius:6px;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.12);color:rgba(246,243,236,.5);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s;margin-left:8px}
        .modal-close:hover{background:rgba(181,55,42,.15);color:#F6F3EC;border-color:rgba(181,55,42,.3)}

        .modal-body{display:grid;grid-template-columns:1fr 300px;overflow:hidden;flex:1}

        /* Modal LEFT */
        .modal-left{padding:20px 22px;overflow-y:auto;border-right:1px solid var(--ink10)}
        .modal-left::-webkit-scrollbar{width:3px}
        .modal-left::-webkit-scrollbar-thumb{background:var(--ink10)}
        .modal-section-label{font-size:9px;font-weight:700;letter-spacing:2.2px;text-transform:uppercase;color:var(--ink40);margin-bottom:4px}
        .modal-sub{font-size:11.5px;color:var(--ink40);margin-bottom:14px}

        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .col-l{animation:fadeUp .24s ease both}
        .mcard{animation:fadeUp .24s .04s ease both}
        .rcard{animation:fadeUp .24s .08s ease both}
      `}</style>

      <div className="page">

        {/* TOPBAR */}
        <header className="tb">
          <div className="tb-l">
            <div className="brand">
              <div className="bmark">N</div>
              <div><div className="bname">Nexus POS</div><div className="bsub">Invoicing</div></div>
            </div>
            <div className="bc">
              <span className="bca">Dashboard</span><span className="bcsep">›</span>
              <span className="bca">Invoices</span><span className="bcsep">›</span>
              <span className="bccur">New Invoice</span>
            </div>
          </div>
          <div className="tb-r">
            <button className="btn btn-gh">📋 History</button>
            <button className="btn btn-ol">Save Draft</button>
            <button className="btn btn-gold" onClick={() => lineItems.length > 0 && setShowPayModal(true)}>
              Issue Invoice →
            </button>
            <div className="av">AD</div>
          </div>
        </header>

        <div className="body">

          {/* ══ LEFT ══ */}
          <div className="col-l">
            <div className="card">
              <div className="ctitle">Invoice Details</div>
              <div className="field">
                <label className="lbl">Invoice No.</label>
                <input className="inp" readOnly value={invoiceId} />
              </div>
              <div className="g2">
                <div className="field">
                  <label className="lbl">Issue Date</label>
                  <input className="inp" readOnly value="Mar 7, 2026" style={{ fontSize: 11 }} />
                </div>
                <div className="field">
                  <label className="lbl">Due Date</label>
                  <input type="date" className="inp" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="lbl">Tax Rate (%)</label>
                <input type="number" className="inp" min={0} max={30} step={0.5} value={taxRate}
                  onChange={e => setTaxRate(+e.target.value)} />
              </div>
            </div>

            <div className="card">
              <div className="ctitle">Customer</div>
              <div className="ctog">
                <button className={`ctab${custMode === "cash" ? " active" : ""}`}
                  onClick={() => { setCustMode("cash"); setCustomer(CASH_CUSTOMER); setCustSearch(""); }}>
                  💵 Cash
                </button>
                <button className={`ctab${custMode === "account" ? " active" : ""}`}
                  onClick={() => { setCustMode("account"); setShowCustDrop(true); }}>
                  👤 Account
                </button>
              </div>
              {custMode === "account" && (
                <div style={{ position: "relative", marginBottom: 10 }}>
                  <div className="sbox">
                    <span className="sico">⌕</span>
                    <input className="sinp" placeholder="Search customer…" value={custSearch} autoFocus
                      onChange={e => { setCustSearch(e.target.value); setShowCustDrop(true); }}
                      onFocus={() => setShowCustDrop(true)}
                      onBlur={() => setTimeout(() => setShowCustDrop(false), 150)} />
                  </div>
                  {showCustDrop && filtCust.length > 0 && (
                    <div className="drop">
                      {filtCust.map(c => (
                        <div className="ditem" key={c.id}
                          onMouseDown={() => { setCustomer(c); setCustSearch(""); setShowCustDrop(false); }}>
                          <div className="dn">{c.name}</div>
                          <div className="ds">{c.email} · {c.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="cpill">
                {custMode === "cash"
                  ? <div className="cav cash">💵</div>
                  : <div className="cav">{initials(customer.name)}</div>}
                <div>
                  <div className="cname">{customer.name}</div>
                  <div className="cdet">{customer.address}</div>
                  {custMode === "account" && customer.email !== "—" && <div className="cdet">{customer.email}</div>}
                  {custMode === "account" && <div className="cdet">{customer.phone}</div>}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="ctitle">Notes & Terms</div>
              <textarea className="nota" rows={3} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Payment terms, notes…" />
            </div>
          </div>

          {/* ══ MIDDLE ══ */}
          <div className="col-m">
            <div className="mcard">
              <div className="mhead">
                <div className="mtitle">Line Items</div>
                <div style={{ position: "relative" }}>
                  <div className="sbox" style={{ width: 218 }}>
                    <span className="sico" style={{ fontWeight: 700, fontSize: 14 }}>＋</span>
                    <input className="sinp" placeholder="Add product or SKU…" value={prodSearch}
                      onChange={e => { setProdSearch(e.target.value); setShowProdDrop(true); }}
                      onFocus={() => setShowProdDrop(true)}
                      onBlur={() => setTimeout(() => setShowProdDrop(false), 150)} />
                  </div>
                  {showProdDrop && filtProd.length > 0 && (
                    <div className="drop" style={{ right: 0, left: "auto", minWidth: 250 }}>
                      {filtProd.map(p => (
                        <div className="ditem" key={p.sku} onMouseDown={() => addItem(p)}>
                          <div className="dn">{p.name}</div>
                          <div className="ds">{p.sku} · ${p.price.toFixed(2)} · {p.cat}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="tscroll">
                <div className="thead">
                  <span className="tth">#</span>
                  <span className="tth">Product</span>
                  <span className="tth">Item Code</span>
                  <span className="tth">Catagory</span>
                  <span className="tth">MRP</span>
                  <span className="tth">Unit Price</span>
                  <span className="tth" style={{ textAlign: "center" }}>Disc%</span>
                  <span className="tth" style={{ textAlign: "right" }}>Disc. Unit Price</span>
                  <span className="tth" style={{ textAlign: "center" }}>Qty</span>
                  <span className="tth" style={{ textAlign: "right" }}>Gross Total</span>
                  <span></span>
                </div>
                {lineItems.length === 0 && (
                  <div className="tempty">
                    <div style={{ fontSize: 26, marginBottom: 6 }}>📦</div>
                    Search above to add products
                  </div>
                )}
                {lineItems.map((item, i) => {
                  const discUnitPrice = item.price * (1 - item.lineDisc / 100);
                  const grossTotal    = item.price * item.qty;           // no discount
                  const netTotal      = discUnitPrice * item.qty;        // with line disc
                  const savedAmt      = grossTotal - netTotal;
                  return (
                    <div className="trow" key={item.id}>
                      <span className="tnum">{String(i + 1).padStart(2, "0")}</span>
                      {/* name */}
                      <div className="tpname">{item.name}</div>
                      {/* code */}
                      <span className="tsku" style={{ display: "flex", alignItems: "center" }}>{item.sku}</span>
                      {/* category */}
                      <span className="tcat" style={{ display: "flex", alignItems: "center"}}>{item.cat}</span>
                      {/* MRP — strikethrough if discount applied */}
                      <span className={item.lineDisc > 0 ? "tmrp" : "tprice"}>${item.price.toFixed(2)}</span>
                      {/* Unit Price = same as MRP (editable base price) */}
                      <span className="tprice">${item.price.toFixed(2)}</span>
                      {/* Line Disc % */}
                      <input className="tdinp" type="number" min={0} max={100} value={item.lineDisc}
                        onChange={e => updateItem(item.id, "lineDisc", Math.max(0, Math.min(100, +e.target.value)))} />
                      {/* Discounted Unit Price */}
                      <div style={{ textAlign: "right", marginRight: 18 }}>
                        <span className="tdiscprice">${discUnitPrice.toFixed(2)}</span>
                        {savedAmt > 0 && (
                          <div style={{ fontSize: 9.5, color: "var(--green)", opacity: .75, marginTop: 1}}>
                            save ${fmt(savedAmt)}
                          </div>
                        )}
                      </div>
                      {/* Qty */}
                      <input className="tinp" type="number" min={1} value={item.qty}
                        onChange={e => updateItem(item.id, "qty", Math.max(1, +e.target.value))} />
                      {/* Gross Total — price × qty, NO line discount */}
                      <div style={{ textAlign: "right" }}>
                        <span className="tgross">${fmt(grossTotal)}</span>
                        {item.lineDisc > 0 && (
                          <div style={{ fontSize: 9.5, color: "var(--green)", marginTop: 1 }}>
                            net ${fmt(netTotal)}
                          </div>
                        )}
                      </div>
                      <button className="trm" onClick={() => removeItem(item.id)}>×</button>
                    </div>
                  );
                })}
              </div>

              <div className="tbar">
                <div className="tgrid">
                  <div className="ti">
                    <div className="tlbl">Gross Total</div>
                    <div className="tval">${fmt(grossTotal)}</div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Line Discounts</div>
                    <div className="tval" style={{ color: lineDiscTotal > 0 ? "#86efac" : undefined }}>
                      −${fmt(lineDiscTotal)}
                    </div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Net Subtotal</div>
                    <div className="tval">${fmt(lineSubtotal)}</div>
                  </div>
                  <div className="tdiv" />
                  <div className="ti tgrand">
                    <div className="tlbl">Payable Total</div>
                    <div className="tval">${fmt(total)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="col-r">
            <div className="rcard">
              <div className="rhead">
                <div className="rsub">Discounts & Charges</div>
                <div className="rtitle">Order Details</div>
              </div>
              <div className="rbody">

                {/* Invoice Discount */}
                <div>
                  <div className="sec">Invoice Discount</div>
                  <div className="dtabs">
                    <button className={`dtab${invoiceDiscType === "pct" ? " active" : ""}`}
                      onClick={() => { setInvoiceDiscType("pct"); setInvoiceDisc(0); }}>% Percentage</button>
                    <button className={`dtab${invoiceDiscType === "amt" ? " active" : ""}`}
                      onClick={() => { setInvoiceDiscType("amt"); setInvoiceDisc(0); }}>$ Fixed</button>
                  </div>
                  <div className="dinpwrap">
                    <input className="dinp" type="number" min={0}
                      max={invoiceDiscType === "pct" ? 100 : undefined}
                      step={invoiceDiscType === "pct" ? 0.5 : 0.01}
                      value={invoiceDisc} onChange={e => setInvoiceDisc(+e.target.value)} placeholder="0" />
                    <span className="dunit">{invoiceDiscType === "pct" ? "%" : "$"}</span>
                  </div>
                  {invDiscAmt > 0 && (
                    <div style={{ marginTop: 5, fontSize: 11, color: "var(--green)", fontWeight: 500 }}>
                      Saving ${fmt(invDiscAmt)} on this invoice
                    </div>
                  )}
                </div>

                {/* Additional Charge */}
                <div>
                  <div className="sec">Additional Charge</div>
                  <div className="exrow">
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="lbl">Label</label>
                      <input className="cinp" value={extraLabel} onChange={e => setExtraLabel(e.target.value)} placeholder="e.g. Delivery" />
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="lbl">Amount</label>
                      <input className="cinp" type="number" min={0} step={0.5} value={extraCharge}
                        onChange={e => setExtraCharge(+e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <div className="sec">Order Summary</div>

                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div style={{ background: "var(--warm)", border: "1px solid var(--ink10)", borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--ink40)", marginBottom: 4 }}>Items</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{lineItems.length}</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink40)", marginTop: 2 }}>{totalItems} unit{totalItems !== 1 ? "s" : ""} total</div>
                    </div>
                    <div style={{ background: "var(--greenbg)", border: "1px solid var(--greenbr)", borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--green)", marginBottom: 4 }}>You Save</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--green)" }}>${fmt(totalSaved)}</div>
                      <div style={{ fontSize: 10.5, color: "var(--green)", opacity: .7, marginTop: 2 }}>total discounts</div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="srow">
                    <span className="slbl">Gross Total</span>
                    <span className="sval">${fmt(grossTotal)}</span>
                  </div>
                  {lineDiscTotal > 0 && (
                    <div className="srow disc">
                      <span className="slbl">Line Discounts</span>
                      <span className="sval">−${fmt(lineDiscTotal)}</span>
                    </div>
                  )}
                  <div className="srow">
                    <span className="slbl">Net Subtotal</span>
                    <span className="sval">${fmt(lineSubtotal)}</span>
                  </div>
                  {invDiscAmt > 0 && (
                    <div className="srow disc">
                      <span className="slbl">Invoice Discount</span>
                      <span className="sval">−${fmt(invDiscAmt)}</span>
                    </div>
                  )}
                  <div className="srow">
                    <span className="slbl">Tax ({taxRate}%)</span>
                    <span className="sval">${fmt(taxAmt)}</span>
                  </div>
                  {+extraCharge > 0 && (
                    <div className="srow">
                      <span className="slbl">{extraLabel || "Extra"}</span>
                      <span className="sval">+${fmt(+extraCharge)}</span>
                    </div>
                  )}
                  <div className="shr" />
                  <div className="stot">
                    <span className="stlbl">Total Payable</span>
                    <span className="stval">${fmt(total)}</span>
                  </div>
                </div>

                {/* Spacer + Issue button */}
                <div style={{ flex: 1 }} />
                <button className="issue-btn"
                  disabled={lineItems.length === 0}
                  onClick={() => setShowPayModal(true)}>
                  💳 Issue Invoice →
                </button>
                <button className="draft-btn">Save as Draft</button>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ PAYMENT MODAL ══ */}
      <InvoicePayment
        isOpen={showPayModal}
        total={total}
        grossTotal={grossTotal}
        lineDiscTotal={lineDiscTotal}
        invDiscAmt={invDiscAmt}
        taxAmt={taxAmt}
        taxRate={taxRate}
        extraCharge={+extraCharge}
        extraLabel={extraLabel}
        customer={customer}
        invoiceId={invoiceId}
        onClose={() => setShowPayModal(false)}
        onConfirm={handleConfirm}
      />
      <InvoiceSummaryModal
          isOpen={showSummary}
          invoiceId={invoiceId}
          customer={customer}
          lineItems={lineItems}
          grossTotal={grossTotal}
          lineDiscTotal={lineDiscTotal}
          invDiscAmt={invDiscAmt}
          taxRate={taxRate}
          taxAmt={taxAmt}
          extraCharge={+extraCharge}
          extraLabel={extraLabel}
          total={total}
          payments={lastPayment}
          issueDate="Mar 8, 2026"
          dueDate={dueDate}
          onClose={() => setShowSummary(false)}
          onNewInvoice={() => { setShowSummary(false); setIssued(false); }}
        />

    </>
  );
}