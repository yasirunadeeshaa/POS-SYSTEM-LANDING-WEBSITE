import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../common/DashboardLayout";   // ← shared shell
import { getLeftNavAdmin, LEFT_NAV_BOTTOM_ADMIN, getRightNavAdmin} from "../common/Navconfig";                              // ← shared nav config

const fmt = (n) => Number(n || 0).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DOCUMENTS = [
  { icon: "🧾", label: "Invoice",      desc: "New invoice",    color: "#5B3D8F", routeTo: "/invoice",      badge: "New",  badgeBg: "#5B3D8F12", badgeColor: "#5B3D8F", badgeBorder: "#5B3D8F22" },
  { icon: "📋", label: "Quotation",    desc: "New quotation",  color: "#2B5490", routeTo: "/quotation",    badge: "3",    badgeBg: "#2B549012", badgeColor: "#2B5490", badgeBorder: "#2B549022" },
  { icon: "📦", label: "GRN",          desc: "Goods receipt",  color: "#7A5C1E", routeTo: "/grn",          badge: "5",    badgeBg: "#7A5C1E12", badgeColor: "#7A5C1E", badgeBorder: "#7A5C1E22" },
  { icon: "📝", label: "Credit Note",  desc: "Issue credit",   color: "#2D6A4F", routeTo: "/credit-note"  },
  { icon: "📌", label: "Debit Note",   desc: "Issue debit",    color: "#B8902A", routeTo: "/debit-note"   },
  { icon: "💵", label: "Transactions", desc: "Payment ledger", color: "#2D6A4F", routeTo: "/transactions", badge: "Live", badgeBg: "#2D6A4F12", badgeColor: "#2D6A4F", badgeBorder: "#2D6A4F22" },
  { icon: "🎁", label: "Gift Voucher", desc: "Manage vouchers",color: "#B5372A", routeTo: "/gift-voucher", badge: "Hot",  badgeBg: "#B5372A14", badgeColor: "#7A2018", badgeBorder: "#B5372A22" },
  { icon: "📊", label: "Reports",      desc: "View reports",   color: "#3088da", routeTo: "/reports"      },
  { icon: "📈", label: "Analysis",     desc: "Business insights", color: "#0e7fa8", routeTo: "/analysis"  },
  { icon: "🔖", label: "Audit Logs",   desc: "Security trail", color: "#6B5F54", routeTo: "/audit"        },
];

const USER_ACTIONS = [
  { icon: "👥", label: "All Users",       desc: "View & manage",   color: "#2B5490", routeTo: "/users"              },
  { icon: "➕", label: "Register User",   desc: "Add new user",    color: "#2D6A4F", routeTo: "/users/register"     },
  { icon: "🔒", label: "Locked Accounts", desc: "Unlock / review", color: "#B5372A", routeTo: "/users?filter=locked"},
  { icon: "🪪",  label: "Roles & Access",  desc: "Permissions",     color: "#5B3D8F", routeTo: "/roles"              },
  { icon: "📈", label: "User Activity",   desc: "Login history",   color: "#B8902A", routeTo: "/audit"              },
];

const BRANCH_ACTIONS = [
  { icon: "🏪", label: "All Branches",    desc: "View & manage",  color: "#2B5490", routeTo: "/branches"          },
  { icon: "➕", label: "Add Branch",      desc: "New location",   color: "#2D6A4F", routeTo: "/branches/new"      },
  { icon: "📊", label: "Branch Reports",  desc: "Performance",    color: "#3088da", routeTo: "/reports/branches"  },
  { icon: "⚙",  label: "Branch Settings", desc: "Configure",      color: "#6B5F54", routeTo: "/branches/settings" },
];

const INVENTORY_ACTIONS = [
  // ── Core (Prime tile) ──
  { icon: "📦", label: "Product Management",     desc: "Manage products",        color: "#2B5490", routeTo: "/productsListView"   },
  { icon: "🏷",  label: "Category Management",   desc: "Manage categories",   color: "#2D6A4F", routeTo: "/categoryManagement" },

  // ── Stock & Purchasing ──
  { icon: "🛒", label: "Purchase Orders",  desc: "Create / manage POs", color: "#2B5490", routeTo: "/purchase-orders"    },
  { icon: "🔔", label: "Low Stock Alerts", desc: "Reorder reminders",   color: "#B5372A", routeTo: "/low-stock",
    badge: "3 alerts", badgeBg: "#B5372A14", badgeColor: "#7A2018", badgeBorder: "#B5372A22" },
  { icon: "📋", label: "Stock Take",       desc: "Full count / audit",  color: "#5B3D8F", routeTo: "/stock-take"         },
  { icon: "📤", label: "Stock Adjustment", desc: "Manual corrections",  color: "#7A5C1E", routeTo: "/stock-adjustment"   },
  { icon: "◈",  label: "Receive Stock",    desc: "Incoming stock",      color: "#5B3D8F"                                 },
  { icon: "⇄",  label: "Transfer Stock",   desc: "Move between stores", color: "#7A5C1E"                                 },

  // ── Pricing & Promotions ──
  { icon: "🏷",  label: "Price Lists",     desc: "Tiered pricing",      color: "#2D6A4F", routeTo: "/price-lists"        },
  { icon: "🎯",  label: "Promotions",      desc: "Active deals",        color: "#B8902A", routeTo: "/promotions"         },
  { icon: "✦",  label: "Discount",         desc: "Apply promo",         color: "#2D6A4F"                                 },
  { icon: "▦",  label: "Price Override",   desc: "Manual price edit",   color: "#B8902A"                                 },
  { icon: "🔖",  label: "Barcode Labels",  desc: "Print shelf labels",  color: "#3088da", routeTo: "/label-print"        },

  // ── Wastage & Adjustments ──
  { icon: "🗑",  label: "Wastage Log",     desc: "Spoilage / damage",   color: "#B5372A", routeTo: "/wastage"            },
  { icon: "⚖",   label: "Variance Report", desc: "Physical vs system",  color: "#6B5F54", routeTo: "/variance"           },
  { icon: "🔄",  label: "Reorder Rules",   desc: "Auto restock config", color: "#5B3D8F", routeTo: "/reorder-rules"      },

  // ── POS Operations ──
  { icon: "◷",  label: "Hold Sale",        desc: "Park transaction",    color: "#B8902A",
    badge: "2 held", badgeBg: "#B8902A12", badgeColor: "#7A5C1E", badgeBorder: "#B8902A22" },
  { icon: "⟲",  label: "Refund",           desc: "Refund / exchange",   color: "#B5372A"                                 },
  { icon: "✔",  label: "Approve Refund",   desc: "Authorise refund",    color: "#5B3D8F",
    badge: "1 pending", badgeBg: "#5B3D8F12", badgeColor: "#5B3D8F", badgeBorder: "#5B3D8F22" },
];

const HISTORY_ACTIONS = [
  // Prime
  { icon: "🧾", label: "Sales",              desc: "Past sales",           color: "#2070c8", routeTo: "/sales-history",
    badge: "142 today", badgeBg: "#60a5fa12", badgeColor: "#1a5fa0", badgeBorder: "#60a5fa22" },

  // ── Left column ──
  { icon: "📋", label: "Quotation Hist.",    desc: "Quotation history",    color: "#2B5490", routeTo: "/quotationHistory"       },
  { icon: "📋", label: "PO History",         desc: "Purchase order log",   color: "#2B5490", routeTo: "/purchase-order-history" },
  { icon: "📄", label: "Invoices",           desc: "Invoice records",      color: "#0e7fa8", routeTo: "/invoice-history"        },
  { icon: "⊗",  label: "Void Sales",         desc: "Cancelled sales",      color: "#c0392b", routeTo: "/void-history"           },
  { icon: "↩",  label: "Refunds",            desc: "Refund log",           color: "#9b30a8", routeTo: "/refund-history"         },
  { icon: "💰", label: "Register",           desc: "Cash register log",    color: "#64748b", routeTo: "/register-history"       },
  { icon: "🧾", label: "Credit Notes",       desc: "Issued credit notes",  color: "#2D6A4F", routeTo: "/credit-note-history"    },
  { icon: "📌", label: "Debit Notes",        desc: "Issued debit notes",   color: "#B8902A", routeTo: "/debit-note-history"     },
  { icon: "🎁", label: "Gift Vouchers",      desc: "Voucher usage log",    color: "#B5372A", routeTo: "/gift-voucher-history"   },

  // ── Right column ──
  { icon: "📦", label: "Stock In",           desc: "Received stock",       color: "#5a6bb0", routeTo: "/receive-stock-history"  },
  { icon: "⇄",  label: "Transfers",          desc: "Stock transfers",      color: "#7c3aed", routeTo: "/transfer-history"       },
  { icon: "🗑", label: "Wastage History",    desc: "Spoilage records",     color: "#B5372A", routeTo: "/wastage-history"        },
  { icon: "📤", label: "Adjustments",        desc: "Stock correction log", color: "#7A5C1E", routeTo: "/adjustment-history"     },
  { icon: "🔄", label: "Reorder History",    desc: "Auto restock log",     color: "#5B3D8F", routeTo: "/reorder-history"        },
  { icon: "📊", label: "Sales by Branch",    desc: "Branch breakdown",     color: "#3088da", routeTo: "/branch-sales-history"   },
  { icon: "📈", label: "Sales by Product",   desc: "Product performance",  color: "#2D6A4F", routeTo: "/product-sales-history"  },
  { icon: "👤", label: "Sales by Cashier",   desc: "Staff performance",    color: "#B8902A", routeTo: "/cashier-sales-history"  },
  { icon: "🏷",  label: "Discount History",  desc: "Applied discounts",    color: "#6B5F54", routeTo: "/discount-history"       },
  { icon: "⚖",  label: "Variance History",   desc: "Stock count log",      color: "#6B5F54", routeTo: "/variance-history"       },
];

const SYSTEM_ACTIONS = [
  { icon: "⚙",  label: "System Settings", desc: "Global config",    color: "#6B5F54", routeTo: "/settings" },
  { icon: "🔖", label: "Audit Logs",       desc: "Security trail",   color: "#B8902A", routeTo: "/audit"    },
  { icon: "🛡",  label: "Permissions",     desc: "Role management",  color: "#5B3D8F", routeTo: "/roles"    },
  { icon: "💾", label: "Backup",           desc: "Data export",      color: "#2B5490" },
];

const CUSTOMER_ACTIONS = [
  { icon: "⌂",  label: "Customer Mgmt",  desc: "CRM lookup",  color: "#5B3D8F", routeTo: "/customerManagement" },
  { icon: "➕", label: "Add Customer",   desc: "New account", color: "#2D6A4F", routeTo: "/add-customer"        },
];

const SUPPLIER_ACTIONS = [
  { icon: "🏭", label: "Supplier Mgmt",    desc: "Manage suppliers", color: "#a78bfa", routeTo: "/supplierManagement" },
  { icon: "➕", label: "Supplier Accounts",desc: "Manage accounts",  color: "#c084fc", routeTo: "/supplierAccount"    },
];

const ACCOUNT_ACTIONS = [
  { icon: "🔒", label: "Change Password", desc: "Update password", color: "#2B5490", routeTo: "/profile" },
  { icon: "⊞",  label: "Change PIN",      desc: "Update PIN",      color: "#5B3D8F", routeTo: "/profile" },
  { icon: "👤", label: "My Profile",      desc: "View profile",    color: "#2D6A4F", routeTo: "/profile" },
];

const NOTIFICATIONS = [
  { color: "#ef4444", title: "Low stock: USB-C Hub (3 left)",   time: "2 min ago"  },
  { color: "#eab308", title: "2 POs awaiting approval",         time: "10 min ago" },
  { color: "#3b82f6", title: "New user registered: Sarah K.",   time: "22 min ago" },
  { color: "#22c55e", title: "Branch A — daily target 65%",     time: "1h ago"     },
  { color: "#a78bfa", title: "Refund #318 needs authorisation", time: "Reminder"   },
];

const BUSINESS_ALERTS = [
  // Cheque Alerts
  { icon: "🏦", label: "Return Cheque",       desc: "3 cheques returned by bank",     color: "#c0392b", count: 3,  routeTo: "/cheques/returned",    category: "cheque"   },
  { icon: "🏦", label: "Cheque to Bank",       desc: "5 cheques pending deposit",      color: "#2070c8", count: 5,  routeTo: "/cheques/to-bank",     category: "cheque"   },
  { icon: "🏦", label: "Post-Dated Cheques",   desc: "2 cheques maturing this week",   color: "#B8902A", count: 2,  routeTo: "/cheques/post-dated",  category: "cheque"   },

  // Reorder / Low Stock
  { icon: "📦", label: "Reorder Items",        desc: "8 items below reorder level",    color: "#B5372A", count: 8,  routeTo: "/low-stock",           category: "stock"    },
  { icon: "⚠",  label: "Out of Stock",         desc: "2 items fully depleted",         color: "#ef4444", count: 2,  routeTo: "/out-of-stock",        category: "stock"    },
  { icon: "🔄", label: "Pending GRNs",         desc: "4 deliveries not yet received",  color: "#7c3aed", count: 4,  routeTo: "/grn",                 category: "stock"    },

  // Pending Approvals
  { icon: "↩",  label: "Refund Approvals",     desc: "2 refunds awaiting sign-off",    color: "#9b30a8", count: 2,  routeTo: "/refund-approvals",    category: "approval" },
  { icon: "📋", label: "PO Approvals",         desc: "3 purchase orders pending",      color: "#2B5490", count: 3,  routeTo: "/purchase-orders",     category: "approval" },
  { icon: "📝", label: "Credit Note Approvals",desc: "1 credit note needs review",     color: "#2D6A4F", count: 1,  routeTo: "/credit-note",         category: "approval" },

  // Cash & Register
  { icon: "💰", label: "Float Low",            desc: "Branch B float below minimum",   color: "#B8902A", count: 1,  routeTo: "/cash-management",     category: "cash"     },
  { icon: "⚖",  label: "Register Unbalanced",  desc: "1 register variance detected",   color: "#c0392b", count: 1,  routeTo: "/register-history",    category: "cash"     },
  { icon: "🏧", label: "Cash Handover Due",    desc: "End of shift — 2 pending",       color: "#64748b", count: 2,  routeTo: "/cash-management",     category: "cash"     },
];

// ─── Inline tile components (copy from original or import from shared Tiles.jsx) ─

function RowTile({ action, delay = 0, onClick }) {
  return (
    <button className="row-tile" style={{ animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="rt-icon" style={{ width:30, height:30, borderRadius:7, background:action.color+"14", border:`1.5px solid ${action.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:action.color }}>{action.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11.5, fontWeight:600, color:"#1A1611", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{action.label}</div>
        <div style={{ fontSize:9, color:"#9B8E80", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{action.desc}</div>
      </div>
      {action.badge && <span style={{ fontSize:7.5, fontWeight:700, padding:"2px 6px", borderRadius:20, flexShrink:0, background:action.badgeBg||action.color+"14", color:action.badgeColor||action.color, border:`1px solid ${action.badgeBorder||action.color+"22"}`, whiteSpace:"nowrap", letterSpacing:0.4 }}>{action.badge}</span>}
      <span className="rt-arrow">›</span>
    </button>
  );
}

function PrimeTile({ action, delay = 0, onClick }) {
  return (
    <button className="prime-tile" style={{ background:action.color+"12", border:`1.5px solid ${action.color}28`, animationDelay:`${delay}ms` }} onClick={onClick}>
      <div className="prime-icon" style={{ width:36, height:36, borderRadius:9, background:action.color+"1a", border:`1.5px solid ${action.color}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:action.color }}>{action.icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#1A1611", lineHeight:1.3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{action.label}</div>
        <div style={{ fontSize:9.5, color:"#9B8E80", marginTop:1 }}>{action.desc}</div>
      </div>
      {action.badge && <span style={{ fontSize:7.5, fontWeight:700, padding:"2px 6px", borderRadius:20, flexShrink:0, background:action.badgeBg||action.color+"14", color:action.badgeColor||action.color, border:`1px solid ${action.badgeBorder||action.color+"22"}`, whiteSpace:"nowrap" }}>{action.badge}</span>}
    </button>
  );
}

function DocLaunchTile({ action, delay = 0, onClick }) {
  return (
    <button className="doc-launch-tile" style={{ animationDelay:`${delay}ms` }} onClick={onClick}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:action.color, borderRadius:"12px 12px 0 0", opacity:0.65 }} />
      <div className="doc-launch-icon">{action.icon}</div>
      <div className="doc-launch-label">{action.label}</div>
      <div className="doc-launch-desc">{action.desc}</div>
      {action.badge && <span className="doc-launch-badge" style={{ background:action.badgeBg||action.color+"15", color:action.badgeColor||action.color, border:`1px solid ${action.badgeBorder||action.color+"22"}` }}>{action.badge}</span>}
    </button>
  );
}

function SubColHeader({ accent, icon, label, count }) {
  return (
    <div className="col-head">
      <div className="col-head-accent" style={{ background:`linear-gradient(90deg,${accent} 0%,${accent}55 60%,transparent)` }} />
      <div className="col-head-left">
        <div className="col-icon-wrap" style={{ background:accent+"12", border:`1px solid ${accent}20`, color:accent }}>{icon}</div>
        <span className="col-title">{label}</span>
      </div>
      <span className="col-count" style={{ background:accent+"12", border:`1px solid ${accent}20`, color:accent }}>{count}</span>
    </div>
  );
}

function RcTile({ action, delay = 0, onClick }) {
  return (
    <button className="rc-tile" style={{ "--tile-accent":action.color, animationDelay:`${delay}ms` }} onClick={onClick}>
      <div style={{ width:26, height:26, borderRadius:6, flexShrink:0, background:action.color+"15", border:`1px solid ${action.color}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:action.color }}>{action.icon}</div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#1A1611", lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{action.label}</div>
        <div style={{ fontSize:9, color:"#9B8E80", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{action.desc}</div>
      </div>
    </button>
  );
}

function WHead({ accent, icon, label, badge, badgeStyle }) {
  return (
    <div>
      <div style={{ height:2, background:`linear-gradient(90deg,${accent} 0%,transparent 65%)`, opacity:0.75 }} />
      <div className="w-head">
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:22, height:22, borderRadius:5, background:accent+"12", border:`1px solid ${accent}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:accent }}>{icon}</div>
          <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:12.5, fontWeight:700, color:"#1A1611" }}>{label}</span>
        </div>
        {badge !== undefined && <span style={{ fontSize:8, fontWeight:700, padding:"1px 6px", borderRadius:20, ...badgeStyle }}>{badge}</span>}
      </div>
    </div>
  );
}

function RcSection({ accent, icon, label, actions, onAction }) {
  return (
    <div className="w-card">
      <WHead accent={accent} icon={icon} label={label} badge={actions.length} badgeStyle={{ background:accent+"12", border:`1px solid ${accent}20`, color:accent }} />
      <div style={{ display:"flex", flexDirection:"column", gap:4, padding:"7px 8px", background:"rgba(245,242,236,0.35)" }}>
        {actions.map((a, i) => <RcTile key={a.label} action={a} delay={i * 16} onClick={() => onAction(a)} />)}
      </div>
    </div>
  );
}

function BranchesWidget({ branches, loading }) {
  return (
    <div className="w-card">
      <WHead accent="#2B5490" icon="🏪" label="Branches"
        badge={loading ? "…" : `${branches.filter(b => b.active).length} active`}
        badgeStyle={{ background:"#2B549012", border:"1px solid #2B549020", color:"#2B5490" }} />
      <div style={{ display:"flex", flexDirection:"column", gap:4, padding:"7px 8px", background:"rgba(245,242,236,0.35)" }}>
        {loading
          ? [1,2,3].map(i => <div key={i} style={{ height:38, borderRadius:8, background:"rgba(26,22,17,0.05)", animation:"fadeUp 0.3s ease" }} />)
          : branches.length === 0
            ? <p style={{ fontSize:11, color:"#9B8E80", textAlign:"center", padding:"8px 0", margin:0 }}>No branches found</p>
            : branches.map(b => (
              <div key={b.id} className="rc-tile" style={{ cursor:"default" }}>
                <div style={{ width:26, height:26, borderRadius:6, background:"#2B549015", border:"1px solid #2B549025", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#2B5490" }}>🏪</div>
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#1A1611", lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{b.name}</div>
                  {b.address && <div style={{ fontSize:9, color:"#9B8E80", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{b.address}</div>}
                </div>
                <span style={{ fontSize:7.5, fontWeight:700, padding:"2px 6px", borderRadius:20, flexShrink:0, background:b.active?"#2D6A4F12":"rgba(26,22,17,0.05)", color:b.active?"#2D6A4F":"#9B8E80", border:`1px solid ${b.active?"#2D6A4F20":"rgba(26,22,17,0.08)"}` }}>
                  {b.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}

function AdminCard({ user, initials }) {
  return (
    <div className="w-card">
      <WHead accent="#B8902A" icon="🪪" label="Shop Owner" />
      <div style={{ padding:"10px 12px 12px", background:"rgba(245,242,236,0.35)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:38, height:38, borderRadius:9, background:"rgba(181,138,36,0.1)", border:"1.5px solid rgba(181,138,36,0.28)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:"#D1A534", flexShrink:0 }}>{initials}</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:13, fontWeight:700, color:"#1A1611", lineHeight:1.25 }}>{user?.full_name || user?.username || "Admin"}</div>
            <div style={{ fontSize:9, color:"#9B8E80", letterSpacing:0.5, textTransform:"uppercase", marginTop:2 }}>Shop Owner · System Admin</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:9, fontWeight:700, color:"#3C8A62", letterSpacing:0.8, fontFamily:"'DM Sans',sans-serif" }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:"#3C8A62", display:"inline-block", animation:"blink 1.5s ease-in-out infinite" }} />
          ADMIN STATION · ACTIVE
        </div>
      </div>
    </div>
  );
}

function DateTimeCard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div style={{ background:"#1A1611", border:"1px solid rgba(181,138,36,0.22)", borderRadius:12, padding:"12px 14px", flexShrink:0, boxShadow:"0 1px 6px rgba(26,22,17,0.14)" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#F4F1E9", lineHeight:1 }}>{time.toLocaleDateString("en-US", { weekday:"long" })}</div>
      <div style={{ fontSize:9.5, color:"rgba(181,138,36,0.6)", letterSpacing:0.5, marginTop:3 }}>{time.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" })}</div>
      <div style={{ fontFamily:"'Geist Mono',monospace", fontSize:15, fontWeight:600, color:"#D1A534", marginTop:8, letterSpacing:1 }}>{time.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}</div>
      <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:6, fontSize:8.5, fontWeight:700, color:"#3C8A62", letterSpacing:0.8, fontFamily:"'DM Sans',sans-serif" }}>
        <span style={{ width:5, height:5, borderRadius:"50%", background:"#3C8A62", display:"inline-block", animation:"blink 1.5s ease-in-out infinite" }} />
        SYSTEM ONLINE
      </div>
    </div>
  );
}

const ALERT_SECTIONS = [
  { key: "cheque",   label: "Cheque Alerts",      accent: "#2070c8", icon: "🏦" },
  { key: "stock",    label: "Stock Alerts",        accent: "#B5372A", icon: "📦" },
  { key: "approval", label: "Pending Approvals",   accent: "#9b30a8", icon: "📋" },
  { key: "cash",     label: "Cash & Register",     accent: "#B8902A", icon: "💰" },
];

function BusinessAlertsWidget({ onNavigate }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div className="sec-divider">Business Alerts</div>

      {ALERT_SECTIONS.map(section => {
        const items = BUSINESS_ALERTS.filter(a => a.category === section.key);
        const totalCount = items.reduce((s, a) => s + (a.count || 0), 0);

        return (
          <div key={section.key} style={{ borderRadius:9, overflow:"hidden", border:`1px solid ${section.accent}18`, background:"rgba(245,242,236,0.4)" }}>

            {/* Section Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 8px", background:section.accent+"0e", borderBottom:`1px solid ${section.accent}15` }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:18, height:18, borderRadius:4, background:section.accent+"18", border:`1px solid ${section.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>{section.icon}</div>
                <span style={{ fontSize:9.5, fontWeight:700, color:section.accent, letterSpacing:0.4 }}>{section.label}</span>
              </div>
              <span style={{ fontSize:8, fontWeight:700, padding:"1px 6px", borderRadius:20, background:section.accent+"15", color:section.accent, border:`1px solid ${section.accent}25` }}>{totalCount} pending</span>
            </div>

            {/* Alert Rows */}
            <div style={{ display:"flex", flexDirection:"column", gap:2, padding:"4px 6px 6px" }}>
              {items.map((alert, i) => (
                <button
                  key={alert.label}
                  onClick={() => onNavigate(alert)}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 6px", borderRadius:7, background:"transparent", border:"none", cursor:"pointer", textAlign:"left", width:"100%", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = alert.color+"0d"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width:22, height:22, borderRadius:5, background:alert.color+"14", border:`1px solid ${alert.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>{alert.icon}</div>
                  <div style={{ minWidth:0, flex:1 }}>
                    <div style={{ fontSize:10, fontWeight:600, color:"#1A1611", lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{alert.label}</div>
                    <div style={{ fontSize:8.5, color:"#9B8E80", marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{alert.desc}</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:12, flexShrink:0, background:alert.color+"14", color:alert.color, border:`1px solid ${alert.color}22` }}>{alert.count}</span>
                  <span style={{ fontSize:11, color:"#9B8E80", flexShrink:0 }}>›</span>
                </button>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const user = { first_name: "Admin", last_name: "User", username: "admin" };
  const navigate  = useNavigate();

  const [users,    setUsers]    = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [toastMsg,     setToastMsg]     = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
const [totalTxnCount, setTotalTxnCount] = useState(0);
const [avgBasket, setAvgBasket] = useState("0.00");
  const toastTimer = useRef(null);

  useEffect(() => {
  setUsers([
    { full_name: "Sarah K.", active: true,  account_locked: false, role: "manager" },
    { full_name: "John D.", active: true,  account_locked: false, role: "cashier" },
    { full_name: "Mike T.", active: false, account_locked: true,  role: "cashier" },
  ]);
  setBranches([
    { id: 1, name: "Main Branch",   address: "123 Main St",  active: true  },
    { id: 2, name: "Branch A",      address: "456 North Ave", active: true  },
    { id: 3, name: "Branch B",      address: "789 South Rd",  active: false },
  ]);
  setLoading(false);
}, []);

  const fmt = (num) => Number(num).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalUsers     = users.length;
  const activeUsers    = users.filter(u => u.active).length;
  const lockedUsers    = users.filter(u => u.account_locked).length;
  const totalBranches  = branches.length;
  const activeBranches = branches.filter(b => b.active).length;
  const managers = users.filter(u => u.role === "manager").length;
  const cashiers = users.filter(u => u.role === "cashier").length;

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const initials = user ? `${user.first_name?.[0]||""}${user.last_name?.[0]||""}`.toUpperCase() : "AD";

  const showToast = useCallback((msg) => {
    setToastMsg(msg); setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2400);
  }, []);

  const handleAction = useCallback((action) => {
    if (action.routeTo) navigate(action.routeTo);
    else showToast(`${action.label} — coming soon`);
  }, [navigate, showToast]);

  const userActionsWithBadge = USER_ACTIONS.map(a =>
    (a.label === "Locked Accounts" && !loading && lockedUsers > 0)
      ? { ...a, badge:`${lockedUsers} locked`, badgeBg:"#B5372A14", badgeColor:"#7A2018", badgeBorder:"#B5372A22" }
      : a
  );

  // ── BottomBar left items (role-specific stats) ──────────────────────────────
  const bottomLeftItems = [
    { label: "Role",     value: "Admin" },
    { label: "Owner",    value: `${user?.first_name || "—"} ${user?.last_name || ""}` },
    { label: "Users",    value: loading ? "…" : totalUsers },
    { label: "Branches", value: loading ? "…" : totalBranches },
  ];

 return (
  <DashboardLayout
    leftNavItems={getLeftNavAdmin()}
    leftBottomItems={LEFT_NAV_BOTTOM_ADMIN}
    rightNavItems={getRightNavAdmin()}
    bottomLeftItems={bottomLeftItems}
    topBarProps={{ notifications: NOTIFICATIONS }}
    onNavigate={handleAction}
    toast={{ message: toastMsg, visible: toastVisible }}
  >
    {/* ── INNER CONTENT ── */}
    <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"row", gap:8, padding:"10px" }}>

      <div className="col-scroll" style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column", gap:8, minHeight:0, overflowY:"auto" }}>
        <AdminCard user={user} initials={initials} />
        <BranchesWidget branches={branches} loading={loading} />
        <RcSection accent="#5B3D8F" icon="⌂"  label="Customers" actions={CUSTOMER_ACTIONS} onAction={handleAction} />
        <RcSection accent="#a78bfa" icon="🏭" label="Suppliers"  actions={SUPPLIER_ACTIONS} onAction={handleAction} />
        <RcSection accent="#2D6A4F" icon="👤" label="Account"    actions={ACCOUNT_ACTIONS}  onAction={handleAction} />
        <DateTimeCard />
      </div>

      <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:9, overflow:"hidden" }}>

        {/* Greeting Bar */}
        <div style={{ flexShrink:0, background:"#1A1611", borderRadius:12, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid rgba(181,138,36,0.2)", boxShadow:"0 1px 6px rgba(26,22,17,0.12)" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:700, color:"#F4F1E9", letterSpacing:-0.2, lineHeight:1 }}>
              {greeting}, {user?.first_name || "Admin"} 👋
            </div>
            <div style={{ fontSize:9, color:"rgba(181,138,36,0.55)", letterSpacing:2, textTransform:"uppercase", marginTop:3, fontWeight:700 }}>
              System Admin · Shop Owner Dashboard
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[
              { label:"Total Users",     value: loading ? "..." : totalUsers                                        },
              { label:"Active Users",    value: loading ? "..." : activeUsers,    color:"#4ade80"                   },
              { label:"Branches",        value: loading ? "..." : totalBranches                                     },
              { label:"Active Branches", value: loading ? "..." : activeBranches, color:"#4ade80"                   },
              { label:"Locked",          value: loading ? "..." : lockedUsers,    color: lockedUsers > 0 ? "#f87171" : undefined },
              { label:"Total Revenue",   value: loading ? "..." : `$${fmt(totalRevenue)}`, color:"#4ade80"          },
              { label:"Transactions",    value: loading ? "..." : totalTxnCount                                     },
              { label:"Avg. Basket",     value: loading ? "..." : `$${avgBasket}`                                   },
            ].map(({ label, value, color }) => (
              <div key={label} className="kpi-chip">
                <div className="kpi-lbl">{label}</div>
                <div className="kpi-val" style={color ? { color } : {}}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main body: [Docs + Cols 1,2,3] | [Col 4] ── */}
        <div style={{ flex:1, minHeight:0, overflow:"hidden", display:"flex", gap:8 }}>

          {/* Left side — Documents + Cols 1, 2, 3 */}
          <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:8, overflow:"hidden" }}>

          {/* Documents Quick Launch */}
          <div style={{ flexShrink:0, borderRadius:9, overflow:"hidden", border:"1px solid rgba(91,61,143,0.18)", background:"rgba(245,242,236,0.4)" }}>

            {/* Header — same style as cheque alert section header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 10px", background:"#5B3D8F0e", borderBottom:"1px solid #5B3D8F15" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:18, height:18, borderRadius:4, background:"#5B3D8F18", border:"1px solid #5B3D8F25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>🧾</div>
                <span style={{ fontSize:9.5, fontWeight:700, color:"#5B3D8F", letterSpacing:0.4 }}>Quick Actions</span>
              </div>
              <span style={{ fontSize:8, fontWeight:700, padding:"1px 6px", borderRadius:20, background:"#5B3D8F15", color:"#5B3D8F", border:"1px solid #5B3D8F25" }}>{DOCUMENTS.length} tools</span>
            </div>

            {/* Tiles row */}
            <div style={{ display:"flex", gap:12.5, overflowX:"auto", padding:"8px 10px 10px" }} className="col-scroll">
              {DOCUMENTS.map((a, i) => (
                <DocLaunchTile key={a.label} action={a} delay={i * 20} onClick={() => handleAction(a)} />
              ))}
            </div>

          </div>

            {/* Error Banner */}
            {error && (
              <div style={{ flexShrink:0, display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:"rgba(181,55,42,0.08)", border:"1px solid rgba(181,55,42,0.25)", borderRadius:10, color:"#B5372A", fontSize:12 }}>
                ⚠ {error}
                <button onClick={() => window.location.reload()} style={{ marginLeft:"auto", background:"none", border:"1px solid rgba(181,55,42,0.3)", borderRadius:8, padding:"2px 10px", fontSize:11, color:"#B5372A", cursor:"pointer" }}>Retry</button>
              </div>
            )}

            {/* Cols 1, 2, 3 */}
            <div style={{ flex:1, overflow:"hidden", display:"grid", gridTemplateColumns:"2fr 2fr 1.2fr", gap:8, minHeight:0 }}>

            {/* Col 1 — Inventory */}
            <div className="sub-col" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <SubColHeader accent="#5B3D8F" icon="📦" label="Inventory" count={INVENTORY_ACTIONS.length} />
              
              <div style={{ flex:1, minHeight:0, display:"flex", gap:0, overflow:"hidden" }}>
                
                {/* Left half */}
                <div style={{ flex:1, minWidth:0, minHeight:0, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column", gap:4, padding:"6px 6px 10px",
                  scrollbarWidth:"thin", scrollbarColor:"rgba(26,22,17,0.12) transparent" }}>
                  <PrimeTile action={INVENTORY_ACTIONS[0]} delay={0} onClick={() => handleAction(INVENTORY_ACTIONS[0])} />
                  <div className="sec-divider">Stock & Purchasing</div>
                  {INVENTORY_ACTIONS.slice(1, 7).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={i * 18} onClick={() => handleAction(a)} />
                  ))}
                  <div className="sec-divider" style={{ marginTop:4 }}>POS Operations</div>
                  {INVENTORY_ACTIONS.slice(16).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={i * 18} onClick={() => handleAction(a)} />
                  ))}
                </div>

                {/* Divider */}
                <div style={{ width:1, background:"rgba(26,22,17,0.07)", flexShrink:0, margin:"8px 0" }} />

                {/* Right half */}
                <div style={{ flex:1, minWidth:0, minHeight:0, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column", gap:4, padding:"6px 6px 10px",
                  scrollbarWidth:"thin", scrollbarColor:"rgba(26,22,17,0.12) transparent" }}>
                  <PrimeTile action={INVENTORY_ACTIONS[1]} delay={0} onClick={() => handleAction(INVENTORY_ACTIONS[1])} />
                  <div className="sec-divider">Pricing & Promos</div>
                  {INVENTORY_ACTIONS.slice(7, 13).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={i * 18} onClick={() => handleAction(a)} />
                  ))}
                  <div className="sec-divider" style={{ marginTop:4 }}>Wastage & Adjustments</div>
                  {INVENTORY_ACTIONS.slice(13, 16).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={i * 18} onClick={() => handleAction(a)} />
                  ))}
                </div>

              </div>
            </div>

                          {/* Col 2 — History */}
            <div className="sub-col" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column" }}>
              <SubColHeader accent="#218dbe" icon="📅" label="History" count={HISTORY_ACTIONS.length} />

              <div style={{ flex:1, minHeight:0, display:"flex", gap:0, overflow:"hidden" }}>

                {/* Left half */}
                <div style={{ flex:1, minWidth:0, minHeight:0, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column", gap:4, padding:"6px 6px 10px",
                  scrollbarWidth:"thin", scrollbarColor:"rgba(26,22,17,0.12) transparent" }}>
                  <PrimeTile action={HISTORY_ACTIONS[0]} delay={0} onClick={() => handleAction(HISTORY_ACTIONS[0])} />
                  <div className="sec-divider">Transactions</div>
                  {HISTORY_ACTIONS.slice(1, 7).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={(i + 1) * 18} onClick={() => handleAction(a)} />
                  ))}
                  <div className="sec-divider" style={{ marginTop:4 }}>Documents</div>
                  {HISTORY_ACTIONS.slice(7, 10).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={(i + 1) * 18} onClick={() => handleAction(a)} />
                  ))}
                </div>

                {/* Divider */}
                <div style={{ width:1, background:"rgba(26,22,17,0.07)", flexShrink:0, margin:"8px 0" }} />

                {/* Right half */}
                <div style={{ flex:1, minWidth:0, minHeight:0, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column", gap:4, padding:"6px 6px 10px",
                  scrollbarWidth:"thin", scrollbarColor:"rgba(26,22,17,0.12) transparent" }}>
                  <div className="sec-divider">Stock History</div>
                  {HISTORY_ACTIONS.slice(10, 15).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={(i + 1) * 18} onClick={() => handleAction(a)} />
                  ))}
                  <div className="sec-divider" style={{ marginTop:4 }}>Sales Analytics</div>
                  {HISTORY_ACTIONS.slice(15).map((a, i) => (
                    <RowTile key={a.label} action={a} delay={(i + 1) * 18} onClick={() => handleAction(a)} />
                  ))}
                </div>

              </div>
            </div>

              {/* Col 3 — Users + Branches */}
              <div className="sub-col" style={{ height:"100%", overflow:"hidden", display:"flex", flexDirection:"column", gap:0 }}>
                <div style={{ display:"flex", flexDirection:"column", flex:"0 0 auto", maxHeight:"100%", overflow:"hidden" }}>
                  <SubColHeader accent="#2B5490" icon="👥" label="Users" count={loading ? "…" : totalUsers} />
                  <div className="col-body" style={{ overflowY:"auto", minHeight:0 }}>
                    <PrimeTile action={userActionsWithBadge[0]} delay={0} onClick={() => handleAction(userActionsWithBadge[0])} />
                    <div className="sec-divider">Manage</div>
                    {userActionsWithBadge.slice(1).map((a, i) => (
                      <RowTile key={a.label} action={a} delay={(i+1)*22} onClick={() => handleAction(a)} />
                    ))}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
                  <SubColHeader accent="#7A5C1E" icon="🏪" label="Branches" count={loading ? "…" : totalBranches} />
                  <div className="col-body" style={{ flex:1, overflowY:"auto", minHeight:0 }}>
                    <PrimeTile action={BRANCH_ACTIONS[0]} delay={0} onClick={() => handleAction(BRANCH_ACTIONS[0])} />
                    <div className="sec-divider">Manage</div>
                    {BRANCH_ACTIONS.slice(1).map((a, i) => (
                      <RowTile key={a.label} action={a} delay={(i+1)*22} onClick={() => handleAction(a)} />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Col 4 — Sales & System (full height, beside greeting + docs + cols) */}
        <div style={{ width:280, flexShrink:0, display:"flex", flexDirection:"column" }}>
          <div className="sub-col" style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <SubColHeader accent="#5B3D8F" icon="⚙" label="Sales & System" count={SYSTEM_ACTIONS.length} />
            <div className="col-body" style={{ flex:1, overflowY:"auto", minHeight:0, display:"flex", flexDirection:"column", gap:4, padding:"6px 4px" }}>
              
              <BusinessAlertsWidget onNavigate={handleAction} />
              <div className="sec-divider">System</div>
              {SYSTEM_ACTIONS.map((a, i) => (
                <RowTile key={a.label} action={a} delay={i * 18} onClick={() => handleAction(a)} />
              ))}
            </div>
          </div>
        </div>
    </div>
  </DashboardLayout>
);
}