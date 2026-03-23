import { useState, useRef } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const mockCustomers = [
  { id: 1, name: "Ravi Mendis",          email: "ravi.m@email.com",   phone: "+94 77 123 4567", address: "12 Elm Street, Austin TX 78701" },
  { id: 2, name: "Priya Samarawickrama", email: "priya.s@email.com",  phone: "+94 71 987 6543", address: "88 Maple Ave, Brooklyn NY 11201" },
  { id: 3, name: "Daniel Wijesuriya",    email: "d.wije@outlook.com", phone: "+94 76 555 0011", address: "5 Harbor Blvd, Miami FL 33101" },
  { id: 4, name: "Amara Perera",         email: "amara.p@email.com",  phone: "+94 75 444 9920", address: "22 King St, Colombo 02" },
];

const mockInvoices = [
  { id: "INV-2026-441", date: "Mar 1, 2026",  customer: mockCustomers[0], total: 189.50, items: [
    { sku: "WEP-221", name: "Wireless Earbuds Pro",   price: 59.99, qty: 2, cat: "Electronics" },
    { sku: "LWS-441", name: "Leather Wallet Slim",    price: 25.00, qty: 1, cat: "Accessories" },
    { sku: "NAG-007", name: "Notebook A5 Grid",       price: 6.00,  qty: 1, cat: "Stationery"  },
  ]},
  { id: "INV-2026-388", date: "Feb 27, 2026", customer: mockCustomers[1], total: 94.00, items: [
    { sku: "CCT-089", name: "Cotton Crew T-Shirt",    price: 18.00, qty: 3, cat: "Apparel"     },
    { sku: "SWB-330", name: "Stainless Water Bottle", price: 16.99, qty: 1, cat: "Lifestyle"   },
    { sku: "SCS-112", name: "Scented Candle Set",     price: 16.00, qty: 1, cat: "Home"        },
  ]},
  { id: "INV-2026-312", date: "Feb 20, 2026", customer: mockCustomers[2], total: 264.95, items: [
    { sku: "UCH-880", name: "USB-C Hub 7-in-1",       price: 34.99, qty: 3, cat: "Electronics" },
    { sku: "PCI-556", name: "Phone Case iPhone",      price: 14.99, qty: 2, cat: "Accessories" },
    { sku: "WEP-221", name: "Wireless Earbuds Pro",   price: 59.99, qty: 2, cat: "Electronics" },
  ]},
  { id: "INV-2026-290", date: "Feb 15, 2026", customer: mockCustomers[3], total: 76.00, items: [
    { sku: "SCS-112", name: "Scented Candle Set",     price: 16.00, qty: 2, cat: "Home"        },
    { sku: "NAG-007", name: "Notebook A5 Grid",       price: 6.00,  qty: 4, cat: "Stationery"  },
    { sku: "CCT-089", name: "Cotton Crew T-Shirt",    price: 18.00, qty: 1, cat: "Apparel"     },
  ]},
];

const REASON_OPTIONS = [
  "Damaged goods returned",
  "Wrong item delivered",
  "Overcharged on invoice",
  "Duplicate invoice",
  "Quality issue / defect",
  "Cancelled order",
  "Price adjustment",
  "Other",
];

const fmt      = (n) => Number(n || 0).toFixed(2);
const initials = (n) => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
function genCnId() { return `CN-2026-${String(Math.floor(Math.random() * 900) + 100)}`; }

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function CreditNote() {
  const [creditNoteId] = useState(genCnId);
  const [issueDate]    = useState("Mar 16, 2026");
  const [taxRate,    setTaxRate]    = useState(8);
  const [note,       setNote]       = useState("This credit note cancels or adjusts the referenced invoice.");
  const [reason,     setReason]     = useState(REASON_OPTIONS[0]);
  const [customReason, setCustomReason] = useState("");

  // Invoice reference
  const [invSearch,    setInvSearch]    = useState("");
  const [showInvDrop,  setShowInvDrop]  = useState(false);
  const [linkedInv,    setLinkedInv]    = useState(null);

  // Customer
  const [customer,      setCustomer]      = useState(null);
  const [custSearch,    setCustSearch]    = useState("");
  const [showCustDrop,  setShowCustDrop]  = useState(false);

  // Line items (return lines)
  const [lineItems, setLineItems] = useState([]);

  // Refund method
  const [refundMethod, setRefundMethod] = useState("store-credit");

  // Confirm modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [issued,      setIssued]      = useState(false);

  // Filter
  const filtInv  = mockInvoices.filter(i =>
    i.id.toLowerCase().includes(invSearch.toLowerCase()) ||
    i.customer.name.toLowerCase().includes(invSearch.toLowerCase())
  );
  const filtCust = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(custSearch.toLowerCase())
  );

  const linkInvoice = (inv) => {
    setLinkedInv(inv);
    setCustomer(inv.customer);
    setLineItems(inv.items.map((it, idx) => ({ id: idx + 1, ...it, returnQty: it.qty, lineDisc: 0, selected: true })));
    setInvSearch("");
    setShowInvDrop(false);
  };

  const updateLine  = (id, f, v) => setLineItems(prev => prev.map(l => l.id === id ? { ...l, [f]: v } : l));
  const toggleLine  = (id) => setLineItems(prev => prev.map(l => l.id === id ? { ...l, selected: !l.selected } : l));

  const activeLines    = lineItems.filter(l => l.selected);
  const subtotal       = activeLines.reduce((s, l) => s + l.price * l.returnQty, 0);
  const discTotal      = activeLines.reduce((s, l) => s + l.price * l.returnQty * (l.lineDisc / 100), 0);
  const afterDisc      = subtotal - discTotal;
  const taxAmt         = afterDisc * (taxRate / 100);
  const creditTotal    = afterDisc + taxAmt;
  const totalReturnQty = activeLines.reduce((s, l) => s + l.returnQty, 0);

  const handleIssue = () => {
    if (activeLines.length === 0) return;
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setIssued(true);
  };

  const REFUND_METHODS = [
    { key: "store-credit", label: "Store Credit",   icon: "💳", desc: "Added to customer account"   },
    { key: "cash",         label: "Cash Refund",     icon: "💵", desc: "Physical cash return"         },
    { key: "bank",         label: "Bank Transfer",   icon: "🏦", desc: "Via original payment method" },
    { key: "voucher",      label: "Gift Voucher",    icon: "🎁", desc: "Issue as a gift voucher"      },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400&family=Geist+Mono:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --cream:#F6F3EC;--paper:#FDFBF6;--warm:#EEE9DF;
          --ink:#1B1713;--ink70:#4B4038;--ink40:#9E9080;--ink20:#C9C0B2;--ink10:#E4DDD2;
          --gold:#B8902A;--goldl:#D4A83C;--goldbg:rgba(184,144,42,.07);--goldbr:rgba(184,144,42,.22);
          --red:#B5372A;--redbg:rgba(181,55,42,.08);--redbr:rgba(181,55,42,.22);--redl:#D4503F;
          --green:#2D6A4F;--greenbg:rgba(45,106,79,.08);--greenbr:rgba(45,106,79,.25);
          --blue:#2B5490;--bluebg:rgba(43,84,144,.08);--bluebr:rgba(43,84,144,.22);
          --purple:#5B3D8F;--purplebg:rgba(91,61,143,.08);--purplebr:rgba(91,61,143,.22);
          --s0:0 1px 3px rgba(27,23,19,.06),0 1px 2px rgba(27,23,19,.04);
          --s2:0 8px 28px rgba(27,23,19,.12),0 2px 6px rgba(27,23,19,.06);
          --s3:0 24px 64px rgba(27,23,19,.22),0 4px 16px rgba(27,23,19,.1);
        }
        html,body,#root{height:100%;background:var(--cream);font-family:'DM Sans',sans-serif;color:var(--ink);overflow:hidden}
        .page{display:flex;flex-direction:column;height:100vh}

        /* ── TOPBAR ── */
        .tb{height:54px;flex-shrink:0;background:var(--ink);border-bottom:2px solid var(--red);display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:20}
        .tb-l{display:flex;align-items:center;gap:20px}
        .brand{display:flex;align-items:center;gap:10px}
        .bmark{width:30px;height:30px;border-radius:5px;border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;color:var(--goldl)}
        .bname{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:#F6F3EC}
        .bsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);font-weight:600;margin-top:1px;opacity:.85}
        .bc{display:flex;align-items:center;gap:7px;font-size:11.5px}
        .bca{color:rgba(246,243,236,.3);cursor:pointer;transition:color .15s}.bca:hover{color:rgba(246,243,236,.65)}
        .bcsep{color:rgba(246,243,236,.15)}.bccur{color:var(--redl);font-weight:500}
        .tb-r{display:flex;align-items:center;gap:7px}
        .av{width:30px;height:30px;border-radius:4px;border:1.5px solid var(--goldbr);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:12px;font-weight:600;color:var(--goldl)}
        .btn{display:inline-flex;align-items:center;gap:5px;padding:7px 15px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border:none;transition:all .15s;white-space:nowrap}
        .btn-red{background:var(--red);color:#F6F3EC;font-weight:600}
        .btn-red:hover{background:#c43a2d;transform:translateY(-1px);box-shadow:0 4px 14px rgba(181,55,42,.4)}
        .btn-red:disabled{background:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none;opacity:.6}
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
        .inp-ro{color:var(--red)!important;font-family:'Geist Mono',monospace!important;font-size:11px!important;background:var(--redbg)!important;border-color:var(--redbr)!important;cursor:default}
        .sel{background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:8px 10px;color:var(--ink);font-size:12.5px;font-family:'DM Sans',sans-serif;outline:none;width:100%;cursor:pointer}
        .sel:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,144,42,.1)}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:9px}

        /* ── SEARCH/DROP ── */
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

        /* ── LINKED INVOICE PILL ── */
        .inv-pill{display:flex;align-items:center;gap:12px;background:var(--redbg);border:1px solid var(--redbr);border-radius:6px;padding:10px 12px;position:relative}
        .inv-ico{width:36px;height:36px;border-radius:5px;background:var(--ink);border:1.5px solid var(--red);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
        .inv-id{font-family:'Geist Mono',monospace;font-size:12.5px;font-weight:600;color:var(--red);letter-spacing:.5px}
        .inv-meta{font-size:11px;color:var(--ink40);line-height:1.7;margin-top:1px}
        .inv-unlink{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:3px;background:transparent;border:1px solid var(--redbr);color:var(--red);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;transition:all .13s;line-height:1}
        .inv-unlink:hover{background:var(--red);color:#fff}

        /* ── CUSTOMER PILL ── */
        .cpill{display:flex;align-items:flex-start;gap:10px;background:var(--goldbg);border:1px solid var(--goldbr);border-radius:6px;padding:10px 12px}
        .cav{width:36px;height:36px;border-radius:5px;flex-shrink:0;background:var(--ink);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--goldl)}
        .cname{font-size:13px;font-weight:600;color:var(--ink)}
        .cdet{font-size:11px;color:var(--ink40);line-height:1.7;margin-top:1px}

        /* ── MIDDLE TABLE ── */
        .mcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);display:flex;flex-direction:column;flex:1;overflow:hidden}
        .mhead{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;background:var(--ink);border-bottom:2px solid var(--red);border-radius:6px 6px 0 0;flex-shrink:0}
        .mtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
        .msubtitle{font-size:10px;color:rgba(246,243,236,.4);margin-top:2px;letter-spacing:.5px}
        .tscroll{flex:1;overflow-y:auto}
        .tscroll::-webkit-scrollbar{width:3px}
        .tscroll::-webkit-scrollbar-thumb{background:var(--ink10)}

        .thead{display:grid;grid-template-columns:28px 28px 1fr 88px 80px 72px 80px 90px 90px 28px;gap:6px;padding:8px 14px;background:#EDE8DE;border-bottom:2px solid var(--red);position:sticky;top:0;z-index:2}
        .tth{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink40)}
        .trow{display:grid;grid-template-columns:28px 28px 1fr 88px 80px 72px 80px 90px 90px 28px;gap:6px;align-items:center;padding:9px 14px;border-bottom:1px solid var(--ink10);transition:background .1s}
        .trow:last-child{border-bottom:none}
        .trow:hover{background:var(--warm)}
        .trow.deselected{opacity:.45}
        .tnum{font-family:'Geist Mono',monospace;font-size:10.5px;color:var(--ink20);font-weight:600}
        .tpname{font-size:12.5px;font-weight:500;color:var(--ink)}
        .tsku{font-family:'Geist Mono',monospace;font-size:9.5px;color:var(--ink40)}
        .tcat{display:inline-block;padding:1px 5px;background:var(--warm);border:1px solid var(--ink10);border-radius:3px;font-size:9px;color:var(--ink40);font-weight:700;letter-spacing:.5px}
        .tprice{font-size:12px;color:var(--ink70)}
        .tlinetot{font-size:13px;font-weight:700;color:var(--red);text-align:right}
        .tinp{background:var(--warm);border:1px solid var(--ink10);border-radius:4px;padding:5px 6px;color:var(--ink);font-size:12.5px;font-weight:500;font-family:'DM Sans',sans-serif;outline:none;width:100%;text-align:center;transition:border-color .13s}
        .tinp:focus{border-color:var(--gold);box-shadow:0 0 0 2px rgba(184,144,42,.12)}
        .chk{width:16px;height:16px;accent-color:var(--red);cursor:pointer}
        .tempty{padding:36px 20px;text-align:center;color:var(--ink20);font-size:13px}

        /* ── TOTALS BAR ── */
        .tbar{background:var(--ink);border-top:2px solid var(--red);padding:12px 16px;border-radius:0 0 6px 6px;flex-shrink:0}
        .tgrid{display:grid;grid-template-columns:1fr 1fr 1fr 1px 0.6fr;align-items:center}
        .ti{padding:0 12px}.ti:first-child{padding-left:0}
        .tlbl{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(246,243,236,.3);font-weight:700;margin-bottom:3px}
        .tval{font-family:'Geist Mono',monospace;font-size:13.5px;font-weight:500;color:rgba(246,243,236,.7)}
        .tdiv{width:1px;height:32px;background:rgba(246,243,236,.1);margin:0 4px}
        .tgrand .tlbl{color:var(--red);opacity:.9}
        .tgrand .tval{font-size:19px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

        /* ── RIGHT PANEL ── */
        .rcard{background:var(--paper);border:1px solid var(--ink10);border-radius:7px;box-shadow:var(--s0);overflow:hidden;flex:1;display:flex;flex-direction:column}
        .rhead{background:var(--ink);padding:12px 16px;border-bottom:2px solid var(--red);flex-shrink:0}
        .rsub{font-size:8.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);font-weight:700;margin-bottom:3px;opacity:.9}
        .rtitle{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#F6F3EC}
        .rbody{padding:14px 16px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px}
        .rbody::-webkit-scrollbar{width:3px}
        .rbody::-webkit-scrollbar-thumb{background:var(--ink10)}
        .sec{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink40);display:flex;align-items:center;gap:8px;margin-bottom:8px}
        .sec::after{content:'';flex:1;height:1px;background:var(--ink10)}

        /* Refund method cards */
        .rfgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
        .rfcard{padding:9px 10px;border-radius:6px;cursor:pointer;border:1.5px solid var(--ink10);background:var(--warm);transition:all .15s;text-align:left}
        .rfcard:hover{border-color:var(--ink20);background:var(--paper)}
        .rfcard.active{border-color:var(--red);background:var(--redbg)}
        .rfcard.active .rf-lbl{color:var(--red)}
        .rf-ico{font-size:17px;margin-bottom:5px}
        .rf-lbl{font-size:11.5px;font-weight:700;color:var(--ink);display:block;margin-bottom:2px}
        .rf-desc{font-size:9.5px;color:var(--ink40)}

        /* Summary */
        .srow{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
        .slbl{color:var(--ink40)}
        .sval{color:var(--ink70);font-weight:500;font-family:'Geist Mono',monospace;font-size:11.5px}
        .srow.red .slbl,.srow.red .sval{color:var(--red)}
        .shr{height:1px;background:var(--ink10);margin:6px 0}
        .stot{display:flex;justify-content:space-between;align-items:center;background:var(--ink);border-radius:5px;padding:10px 12px;margin-top:2px}
        .stlbl{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--redl);letter-spacing:.3px}
        .stval{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:#F6F3EC;letter-spacing:.5px}

        /* Issue button */
        .issue-btn{background:var(--red);color:#F6F3EC;width:100%;justify-content:center;padding:13px;font-size:14px;font-weight:700;letter-spacing:.3px;border-radius:6px;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:8px;margin-top:auto}
        .issue-btn:hover{background:#c43a2d;transform:translateY(-1px);box-shadow:0 6px 20px rgba(181,55,42,.4)}
        .issue-btn:disabled{background:var(--ink20);cursor:not-allowed;transform:none;box-shadow:none;opacity:.6}
        .draft-btn{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);width:100%;justify-content:center;padding:9px;font-size:12px;font-weight:500;border-radius:5px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;margin-top:7px}
        .draft-btn:hover{border-color:var(--ink20);color:var(--ink70)}

        /* nota */
        .nota{width:100%;background:var(--warm);border:1px solid var(--ink10);border-radius:5px;padding:9px 10px;resize:none;color:var(--ink70);font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;line-height:1.6;outline:none;transition:border-color .15s}
        .nota:focus{border-color:var(--gold)}

        /* ── CONFIRM MODAL ── */
        .modal-bd{position:fixed;inset:0;background:rgba(27,23,19,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:bdIn .2s ease}
        @keyframes bdIn{from{opacity:0}to{opacity:1}}
        .modal{background:var(--paper);border:1px solid var(--ink10);border-radius:12px;box-shadow:var(--s3);width:100%;max-width:460px;overflow:hidden;animation:modalIn .22s cubic-bezier(.34,1.2,.64,1)}
        @keyframes modalIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        .modal-head{background:var(--ink);border-bottom:2px solid var(--red);padding:16px 22px;display:flex;align-items:center;justify-content:space-between}
        .modal-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);font-weight:700;margin-bottom:4px;opacity:.9}
        .modal-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#F6F3EC;letter-spacing:.3px}
        .modal-close{width:32px;height:32px;border-radius:6px;background:rgba(246,243,236,.06);border:1px solid rgba(246,243,236,.12);color:rgba(246,243,236,.5);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s}
        .modal-close:hover{background:rgba(181,55,42,.2);color:#F6F3EC;border-color:var(--redbr)}
        .modal-body{padding:22px}
        .modal-cn-badge{font-family:'Geist Mono',monospace;font-size:13px;font-weight:600;color:var(--redl);background:var(--redbg);border:1px solid var(--redbr);border-radius:5px;padding:6px 12px;letter-spacing:.8px;display:inline-block;margin-bottom:18px}
        .modal-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
        .modal-lbl{color:var(--ink40)}
        .modal-val{font-weight:600;color:var(--ink)}
        .modal-hr{height:1px;background:var(--ink10);margin:10px 0}
        .modal-total{display:flex;justify-content:space-between;align-items:center;background:var(--redbg);border:1.5px solid var(--redbr);border-radius:7px;padding:12px 16px;margin-top:14px}
        .modal-total-lbl{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--red)}
        .modal-total-val{font-family:'Geist Mono',monospace;font-size:20px;font-weight:600;color:var(--red)}
        .modal-refund-info{display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--warm);border:1px solid var(--ink10);border-radius:6px;margin-top:10px;font-size:12px;color:var(--ink40)}
        .modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}
        .modal-cancel{background:var(--warm);border:1px solid var(--ink10);color:var(--ink40);padding:10px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s}
        .modal-cancel:hover{border-color:var(--ink20);color:var(--ink)}
        .modal-confirm{background:var(--red);color:#fff;padding:10px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
        .modal-confirm:hover{background:#c43a2d;box-shadow:0 4px 14px rgba(181,55,42,.35)}

        /* ── ISSUED STATE ── */
        .issued-overlay{position:fixed;inset:0;background:rgba(27,23,19,.65);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:bdIn .2s ease}
        .issued-card{background:var(--paper);border:1px solid var(--redbr);border-radius:12px;box-shadow:var(--s3);width:100%;max-width:420px;padding:32px;text-align:center;animation:modalIn .3s cubic-bezier(.34,1.2,.64,1)}
        .issued-ico{width:64px;height:64px;border-radius:50%;background:var(--redbg);border:2px solid var(--redbr);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px}
        .issued-eyebrow{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--red);font-weight:700;margin-bottom:6px;opacity:.9}
        .issued-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);margin-bottom:4px}
        .issued-sub{font-size:12.5px;color:var(--ink40);margin-bottom:22px}
        .issued-cn{font-family:'Geist Mono',monospace;font-size:15px;font-weight:600;color:var(--red);background:var(--redbg);border:1.5px solid var(--redbr);border-radius:6px;padding:8px 16px;display:inline-block;margin-bottom:22px;letter-spacing:.8px}
        .issued-details{background:var(--warm);border:1px solid var(--ink10);border-radius:7px;padding:14px 16px;margin-bottom:20px;text-align:left}
        .issued-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
        .issued-rl{color:var(--ink40)}
        .issued-rv{font-weight:600;color:var(--ink)}
        .issued-total{font-family:'Geist Mono',monospace;font-size:18px;font-weight:600;color:var(--red)}
        .issued-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .btn-outline-red{background:transparent;border:1.5px solid var(--redbr);color:var(--red);padding:10px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:600;cursor:pointer;transition:all .15s}
        .btn-outline-red:hover{background:var(--redbg)}
        .btn-primary-red{background:var(--red);color:#fff;padding:10px;border-radius:5px;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
        .btn-primary-red:hover{background:#c43a2d}

        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .col-l{animation:fadeUp .24s ease both}
        .mcard{animation:fadeUp .24s .04s ease both}
        .rcard{animation:fadeUp .24s .08s ease both}
      `}</style>

      <div className="page">

        {/* ── TOPBAR ── */}
        <header className="tb">
          <div className="tb-l">
            <div className="brand">
              <div className="bmark">N</div>
              <div><div className="bname">Nexus POS</div><div className="bsub">Credit Notes</div></div>
            </div>
            <div className="bc">
              <span className="bca">Dashboard</span><span className="bcsep">›</span>
              <span className="bca">Documents</span><span className="bcsep">›</span>
              <span className="bca">Credit Notes</span><span className="bcsep">›</span>
              <span className="bccur">New Credit Note</span>
            </div>
          </div>
          <div className="tb-r">
            <button className="btn btn-gh">📋 History</button>
            <button className="btn btn-ol">Save Draft</button>
            <button className="btn btn-red"
              disabled={activeLines.length === 0 || !customer}
              onClick={handleIssue}>
              Issue Credit Note →
            </button>
            <div className="av">AD</div>
          </div>
        </header>

        <div className="body">

          {/* ══ LEFT ══ */}
          <div className="col-l">

            {/* Credit Note Details */}
            <div className="card">
              <div className="ctitle">Credit Note Details</div>
              <div className="field">
                <label className="lbl">Credit Note No.</label>
                <input className="inp inp-ro" readOnly value={creditNoteId} />
              </div>
              <div className="g2">
                <div className="field">
                  <label className="lbl">Issue Date</label>
                  <input className="inp" readOnly value={issueDate} style={{ fontSize: 11 }} />
                </div>
                <div className="field">
                  <label className="lbl">Tax Rate (%)</label>
                  <input type="number" className="inp" min={0} max={30} step={0.5} value={taxRate}
                    onChange={e => setTaxRate(+e.target.value)} />
                </div>
              </div>
            </div>

            {/* Link to Invoice */}
            <div className="card">
              <div className="ctitle">Reference Invoice</div>
              {!linkedInv ? (
                <div style={{ position: "relative" }}>
                  <div className="sbox">
                    <span className="sico">⌕</span>
                    <input className="sinp" placeholder="Search invoice or customer…"
                      value={invSearch}
                      onChange={e => { setInvSearch(e.target.value); setShowInvDrop(true); }}
                      onFocus={() => setShowInvDrop(true)}
                      onBlur={() => setTimeout(() => setShowInvDrop(false), 150)} />
                  </div>
                  {showInvDrop && filtInv.length > 0 && (
                    <div className="drop">
                      {filtInv.map(inv => (
                        <div className="ditem" key={inv.id} onMouseDown={() => linkInvoice(inv)}>
                          <div className="dn" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--red)" }}>{inv.id}</span>
                            <span style={{ fontSize: 11, color: "var(--ink40)" }}>· {inv.customer.name}</span>
                          </div>
                          <div className="ds">{inv.date} · ${fmt(inv.total)} · {inv.items.length} items</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--warm)", border: "1px dashed var(--ink10)", borderRadius: 6, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--ink20)", marginBottom: 4 }}>No invoice linked</div>
                    <div style={{ fontSize: 10.5, color: "var(--ink40)" }}>Link an invoice to auto-populate items</div>
                  </div>
                </div>
              ) : (
                <div className="inv-pill">
                  <div className="inv-ico">🧾</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="inv-id">{linkedInv.id}</div>
                    <div className="inv-meta">
                      {linkedInv.customer.name}<br/>
                      {linkedInv.date} · ${fmt(linkedInv.total)}
                    </div>
                  </div>
                  <button className="inv-unlink" onClick={() => { setLinkedInv(null); setLineItems([]); setCustomer(null); }}>×</button>
                </div>
              )}
            </div>

            {/* Customer */}
            <div className="card">
              <div className="ctitle">Customer</div>
              {!customer ? (
                <div style={{ position: "relative" }}>
                  <div className="sbox">
                    <span className="sico">⌕</span>
                    <input className="sinp" placeholder="Search customer…" value={custSearch}
                      onChange={e => { setCustSearch(e.target.value); setShowCustDrop(true); }}
                      onFocus={() => setShowCustDrop(true)}
                      onBlur={() => setTimeout(() => setShowCustDrop(false), 150)} />
                  </div>
                  {showCustDrop && filtCust.length > 0 && (
                    <div className="drop">
                      {filtCust.map(c => (
                        <div className="ditem" key={c.id} onMouseDown={() => { setCustomer(c); setShowCustDrop(false); setCustSearch(""); }}>
                          <div className="dn">{c.name}</div>
                          <div className="ds">{c.email} · {c.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <div className="cpill">
                    <div className="cav">{initials(customer.name)}</div>
                    <div>
                      <div className="cname">{customer.name}</div>
                      <div className="cdet">{customer.address}</div>
                      <div className="cdet">{customer.email}</div>
                      <div className="cdet">{customer.phone}</div>
                    </div>
                  </div>
                  {!linkedInv && (
                    <button className="inv-unlink" style={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => setCustomer(null)}>×</button>
                  )}
                </div>
              )}
            </div>

            {/* Reason */}
            <div className="card">
              <div className="ctitle">Reason for Credit</div>
              <div className="field">
                <label className="lbl">Category</label>
                <select className="sel" value={reason} onChange={e => setReason(e.target.value)}>
                  {REASON_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              {reason === "Other" && (
                <div className="field">
                  <label className="lbl">Describe</label>
                  <input className="inp" placeholder="Describe the reason…" value={customReason}
                    onChange={e => setCustomReason(e.target.value)} />
                </div>
              )}
              <div className="field">
                <label className="lbl">Internal Note</label>
                <textarea className="nota" rows={3} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Additional notes…" />
              </div>
            </div>
          </div>

          {/* ══ MIDDLE ══ */}
          <div className="col-m">
            <div className="mcard">
              <div className="mhead">
                <div>
                  <div className="mtitle">Return Items</div>
                  <div className="msubtitle">
                    {linkedInv ? `From ${linkedInv.id} · uncheck items not being returned` : "Link an invoice to populate items"}
                  </div>
                </div>
                {activeLines.length > 0 && (
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11.5, color: "var(--redl)", background: "rgba(181,55,42,.12)", border: "1px solid rgba(181,55,42,.3)", borderRadius: 5, padding: "4px 10px" }}>
                    {activeLines.length} of {lineItems.length} returning
                  </div>
                )}
              </div>

              <div className="tscroll">
                {lineItems.length === 0 ? (
                  <div className="tempty">
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔗</div>
                    Link a reference invoice above to populate return items
                  </div>
                ) : (
                  <>
                    <div className="thead">
                      <span className="tth">✓</span>
                      <span className="tth">#</span>
                      <span className="tth">Product</span>
                      <span className="tth">SKU</span>
                      <span className="tth">Category</span>
                      <span className="tth">Unit Price</span>
                      <span className="tth" style={{ textAlign: "center" }}>Orig. Qty</span>
                      <span className="tth" style={{ textAlign: "center" }}>Return Qty</span>
                      <span className="tth" style={{ textAlign: "right" }}>Credit Amt</span>
                      <span></span>
                    </div>
                    {lineItems.map((item, i) => {
                      const creditAmt = item.price * item.returnQty;
                      return (
                        <div className={`trow${!item.selected ? " deselected" : ""}`} key={item.id}>
                          <input type="checkbox" className="chk" checked={item.selected}
                            onChange={() => toggleLine(item.id)} />
                          <span className="tnum">{String(i + 1).padStart(2, "0")}</span>
                          <div>
                            <div className="tpname">{item.name}</div>
                          </div>
                          <span className="tsku" style={{ display: "flex", alignItems: "center" }}>{item.sku}</span>
                          <span style={{ display: "flex", alignItems: "center" }}>
                            <span className="tcat">{item.cat}</span>
                          </span>
                          <span className="tprice">${fmt(item.price)}</span>
                          <span className="tprice" style={{ textAlign: "center", color: "var(--ink20)" }}>{item.qty}</span>
                          <input className="tinp" type="number" min={1} max={item.qty}
                            value={item.returnQty}
                            disabled={!item.selected}
                            onChange={e => updateLine(item.id, "returnQty", Math.max(1, Math.min(item.qty, +e.target.value)))} />
                          <div style={{ textAlign: "right" }}>
                            <span className={`tlinetot${!item.selected ? "" : ""}`}
                              style={{ color: item.selected ? "var(--red)" : "var(--ink20)" }}>
                              ${fmt(creditAmt)}
                            </span>
                          </div>
                          <span></span>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="tbar">
                <div className="tgrid">
                  <div className="ti">
                    <div className="tlbl">Return Items</div>
                    <div className="tval">{activeLines.length} lines</div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Return Units</div>
                    <div className="tval">{totalReturnQty}</div>
                  </div>
                  <div className="ti">
                    <div className="tlbl">Tax ({taxRate}%)</div>
                    <div className="tval">${fmt(taxAmt)}</div>
                  </div>
                  <div className="tdiv" />
                  <div className="ti tgrand">
                    <div className="tlbl">Credit Total</div>
                    <div className="tval">${fmt(creditTotal)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="col-r">
            <div className="rcard">
              <div className="rhead">
                <div className="rsub">Returns & Adjustments</div>
                <div className="rtitle">Credit Summary</div>
              </div>
              <div className="rbody">

                {/* Refund Method */}
                <div>
                  <div className="sec">Refund Method</div>
                  <div className="rfgrid">
                    {REFUND_METHODS.map(m => (
                      <button key={m.key}
                        className={`rfcard${refundMethod === m.key ? " active" : ""}`}
                        onClick={() => setRefundMethod(m.key)}>
                        <div className="rf-ico">{m.icon}</div>
                        <span className="rf-lbl">{m.label}</span>
                        <span className="rf-desc">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary stats */}
                <div>
                  <div className="sec">Credit Breakdown</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div style={{ background: "var(--warm)", border: "1px solid var(--ink10)", borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--ink40)", marginBottom: 4 }}>Items</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>{activeLines.length}</div>
                      <div style={{ fontSize: 10.5, color: "var(--ink40)", marginTop: 2 }}>{totalReturnQty} unit{totalReturnQty !== 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ background: "var(--redbg)", border: "1px solid var(--redbr)", borderRadius: 6, padding: "10px 12px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>Credit</div>
                      <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 600, color: "var(--red)" }}>${fmt(creditTotal)}</div>
                      <div style={{ fontSize: 10.5, color: "var(--red)", opacity: .7, marginTop: 2 }}>to be issued</div>
                    </div>
                  </div>

                  <div className="srow">
                    <span className="slbl">Subtotal (before tax)</span>
                    <span className="sval">${fmt(afterDisc)}</span>
                  </div>
                  <div className="srow red">
                    <span className="slbl">Tax ({taxRate}%)</span>
                    <span className="sval">${fmt(taxAmt)}</span>
                  </div>
                  <div className="shr" />
                  <div className="stot">
                    <span className="stlbl">Credit Total</span>
                    <span className="stval">${fmt(creditTotal)}</span>
                  </div>
                </div>

                {/* Reason summary */}
                <div>
                  <div className="sec">Details</div>
                  <div style={{ background: "var(--warm)", border: "1px solid var(--ink10)", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div className="srow" style={{ padding: "2px 0" }}>
                        <span className="slbl">Credit Note</span>
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--red)", fontWeight: 600 }}>{creditNoteId}</span>
                      </div>
                      {linkedInv && (
                        <div className="srow" style={{ padding: "2px 0" }}>
                          <span className="slbl">Reference</span>
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--ink70)", fontWeight: 600 }}>{linkedInv.id}</span>
                        </div>
                      )}
                      <div className="srow" style={{ padding: "2px 0" }}>
                        <span className="slbl">Reason</span>
                        <span className="sval" style={{ fontSize: 11, color: "var(--ink)", maxWidth: 160, textAlign: "right", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                          {reason === "Other" ? (customReason || "Other") : reason}
                        </span>
                      </div>
                      <div className="srow" style={{ padding: "2px 0" }}>
                        <span className="slbl">Refund via</span>
                        <span className="sval" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                          {REFUND_METHODS.find(m => m.key === refundMethod)?.label}
                        </span>
                      </div>
                      {customer && (
                        <div className="srow" style={{ padding: "2px 0" }}>
                          <span className="slbl">Customer</span>
                          <span className="sval" style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{customer.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1 }} />

                <button className="issue-btn"
                  disabled={activeLines.length === 0 || !customer}
                  onClick={handleIssue}>
                  📝 Issue Credit Note →
                </button>
                <button className="draft-btn">Save as Draft</button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONFIRM MODAL ══ */}
      {showConfirm && (
        <div className="modal-bd" onClick={() => setShowConfirm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-eyebrow">Confirm Issuance</div>
                <div className="modal-title">Issue Credit Note</div>
              </div>
              <button className="modal-close" onClick={() => setShowConfirm(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-cn-badge">{creditNoteId}</div>
              {customer && (
                <div className="modal-row">
                  <span className="modal-lbl">Customer</span>
                  <span className="modal-val">{customer.name}</span>
                </div>
              )}
              {linkedInv && (
                <div className="modal-row">
                  <span className="modal-lbl">Reference Invoice</span>
                  <span className="modal-val" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 12 }}>{linkedInv.id}</span>
                </div>
              )}
              <div className="modal-row">
                <span className="modal-lbl">Return Lines</span>
                <span className="modal-val">{activeLines.length} items ({totalReturnQty} units)</span>
              </div>
              <div className="modal-row">
                <span className="modal-lbl">Reason</span>
                <span className="modal-val">{reason === "Other" ? (customReason || "Other") : reason}</span>
              </div>
              <div className="modal-row">
                <span className="modal-lbl">Refund Method</span>
                <span className="modal-val">{REFUND_METHODS.find(m => m.key === refundMethod)?.label}</span>
              </div>
              <div className="modal-hr" />
              <div className="modal-row">
                <span className="modal-lbl">Subtotal</span>
                <span className="modal-val" style={{ fontFamily: "'Geist Mono',monospace" }}>${fmt(afterDisc)}</span>
              </div>
              <div className="modal-row">
                <span className="modal-lbl">Tax ({taxRate}%)</span>
                <span className="modal-val" style={{ fontFamily: "'Geist Mono',monospace" }}>${fmt(taxAmt)}</span>
              </div>
              <div className="modal-total">
                <span className="modal-total-lbl">Credit Total</span>
                <span className="modal-total-val">${fmt(creditTotal)}</span>
              </div>
              <div className="modal-refund-info">
                <span style={{ fontSize: 16 }}>{REFUND_METHODS.find(m => m.key === refundMethod)?.icon}</span>
                <span>{REFUND_METHODS.find(m => m.key === refundMethod)?.desc} — ${fmt(creditTotal)} will be processed</span>
              </div>
              <div className="modal-actions">
                <button className="modal-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="modal-confirm" onClick={handleConfirm}>Confirm & Issue →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ISSUED STATE ══ */}
      {issued && (
        <div className="issued-overlay">
          <div className="issued-card">
            <div className="issued-ico">📝</div>
            <div className="issued-eyebrow">Credit Note Issued</div>
            <div className="issued-title">Credit Note Issued</div>
            <div className="issued-sub">The credit has been recorded and will be processed shortly.</div>
            <div className="issued-cn">{creditNoteId}</div>
            <div className="issued-details">
              {customer && (
                <div className="issued-row">
                  <span className="issued-rl">Customer</span>
                  <span className="issued-rv">{customer.name}</span>
                </div>
              )}
              {linkedInv && (
                <div className="issued-row">
                  <span className="issued-rl">Reference</span>
                  <span className="issued-rv" style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11 }}>{linkedInv.id}</span>
                </div>
              )}
              <div className="issued-row">
                <span className="issued-rl">Refund via</span>
                <span className="issued-rv">{REFUND_METHODS.find(m => m.key === refundMethod)?.label}</span>
              </div>
              <div className="issued-row">
                <span className="issued-rl">Items returned</span>
                <span className="issued-rv">{activeLines.length} lines · {totalReturnQty} units</span>
              </div>
              <div style={{ height: 1, background: "var(--ink10)", margin: "8px 0" }} />
              <div className="issued-row">
                <span className="issued-rl" style={{ fontWeight: 700, color: "var(--ink)" }}>Credit Total</span>
                <span className="issued-total">${fmt(creditTotal)}</span>
              </div>
            </div>
            <div className="issued-btns">
              <button className="btn-outline-red" onClick={() => { setIssued(false); window.location.reload?.(); }}>+ New Credit Note</button>
              <button className="btn-primary-red">🖨 Print / Download</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}