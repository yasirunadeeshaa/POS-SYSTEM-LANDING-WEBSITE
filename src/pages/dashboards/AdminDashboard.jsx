import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── DATA ──────────────────────────────────────────────
const navItems = [
  { icon: "⬡", label: "Dashboard" },
  { icon: "↗", label: "Sales" },
  { icon: "◈", label: "Inventory" },
  { icon: "▲", label: "Analytics" },
  { icon: "✦", label: "Staff" },
  { icon: "⊞", label: "Products" },
  { icon: "⌂", label: "Customers" },
  { icon: "⌘", label: "Settings" },
];

const recentTransactions = [
  { id: "TXN-8821", customer: "Walk-in", items: 3, total: 48.50, method: "Card", cashier: "Aria K.", time: "2m ago", status: "completed" },
  { id: "TXN-8820", customer: "Ravi M.", items: 1, total: 12.99, method: "Cash", cashier: "Zoe R.", time: "6m ago", status: "completed" },
  { id: "TXN-8819", customer: "Walk-in", items: 5, total: 103.40, method: "QR Pay", cashier: "Marco D.", time: "11m ago", status: "completed" },
  { id: "TXN-8818", customer: "Priya S.", items: 2, total: 34.00, method: "Contactless", cashier: "Aria K.", time: "18m ago", status: "refunded" },
  { id: "TXN-8817", customer: "Walk-in", items: 4, total: 67.80, method: "Card", cashier: "Lena S.", time: "24m ago", status: "completed" },
  { id: "TXN-8816", customer: "Daniel W.", items: 1, total: 9.99, method: "Cash", cashier: "Zoe R.", time: "31m ago", status: "completed" },
];

const topItems = [
  { name: "Wireless Earbuds Pro", sku: "WEP-221", sold: 24, revenue: 1439, stock: 18, cat: "Electronics", trend: +22 },
  { name: "Cotton Crew T-Shirt", sku: "CCT-089", sold: 61, revenue: 1098, stock: 42, cat: "Apparel", trend: +7 },
  { name: "Leather Wallet Slim", sku: "LWS-441", sold: 38, revenue: 950, stock: 9, cat: "Accessories", trend: +14 },
  { name: "Scented Candle Set", sku: "SCS-112", sold: 52, revenue: 832, stock: 5, cat: "Home", trend: -3 },
  { name: "Stainless Water Bottle", sku: "SWB-330", sold: 45, revenue: 764, stock: 23, cat: "Lifestyle", trend: +11 },
  { name: "Notebook A5 Grid", sku: "NAG-007", sold: 89, revenue: 534, stock: 67, cat: "Stationery", trend: +5 },
];

const inventory = [
  { item: "Leather Wallet Slim", sku: "LWS-441", stock: 9, min: 20, cat: "Accessories", warn: true },
  { item: "Scented Candle Set", sku: "SCS-112", stock: 5, min: 15, cat: "Home", warn: true },
  { item: "USB-C Hub 7-in-1", sku: "UCH-880", stock: 3, min: 10, cat: "Electronics", warn: true },
  { item: "Phone Case iPhone", sku: "PCI-556", stock: 14, min: 25, cat: "Accessories", warn: true },
  { item: "Cotton Crew T-Shirt", sku: "CCT-089", stock: 42, min: 30, cat: "Apparel", warn: false },
  { item: "Wireless Earbuds Pro", sku: "WEP-221", stock: 18, min: 15, cat: "Electronics", warn: false },
];

const staff = [
  { name: "Aria K.", role: "Shift Lead", sales: 34, revenue: 1820, status: "active", avatar: "AK", register: "R-01" },
  { name: "Marco D.", role: "Cashier", sales: 28, revenue: 1340, status: "active", avatar: "MD", register: "R-02" },
  { name: "Lena S.", role: "Sales Assoc.", sales: 31, revenue: 1560, status: "active", avatar: "LS", register: "R-03" },
  { name: "Ben T.", role: "Cashier", sales: 19, revenue: 890, status: "break", avatar: "BT", register: "—" },
  { name: "Zoe R.", role: "Sales Assoc.", sales: 22, revenue: 1020, status: "active", avatar: "ZR", register: "R-04" },
];

const pendingTasks = [
  { label: "Restock request pending approval", type: "warn", time: "5m ago" },
  { label: "Refund TXN-8818 approved", type: "info", time: "18m ago" },
  { label: "End-of-day report due", type: "alert", time: "In 2h" },
  { label: "New supplier invoice received", type: "info", time: "1h ago" },
  { label: "Scheduled price update pending", type: "warn", time: "3h ago" },
];

const txStatusStyle = {
  completed: { bg: "rgba(72,187,120,0.12)", border: "rgba(72,187,120,0.28)", text: "#86efac" },
  refunded:  { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.28)", text: "#f87171" },
  voided:    { bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)", text: "#94a3b8" },
};

const taskTypeStyle = {
  warn:  { dot: "#fcd34d", bg: "rgba(251,191,36,0.07)" },
  info:  { dot: "#a5b4fc", bg: "rgba(102,126,234,0.07)" },
  alert: { dot: "#f87171", bg: "rgba(248,113,113,0.07)" },
};

const methodIcon = { Card: "💳", Cash: "💵", "QR Pay": "📱", Contactless: "⚡" };

// ── CATEGORIZED QUICK ACTIONS ────────────────────────
const quickActionCategories = [
  {
    key: "sales",
    label: "Sales",
    icon: "↗",
    color: "#667eea",
    actions: [
      { icon: "↗", label: "New Sale", color: "#667eea", desc: "Open transaction", routeTo: "/analysis"},
      { icon: "◷", label: "Hold Sale", color: "#f59e0b", desc: "Park transaction" },
      { icon: "⊗", label: "Void Sale", color: "#f87171", desc: "Cancel transaction" },
      { icon: "⟲", label: "Refund", color: "#f093fb", desc: "Refund / exchange" },
      { icon: "✦", label: "Discount", color: "#86efac", desc: "Apply promo" },
      { icon: "▦", label: "Price Override", color: "#fcd34d", desc: "Manual edit" },
      { icon: "⊘", label: "Apply Tax", color: "#67e8f9", desc: "Tax override" },
      { icon: "✉", label: "Send Receipt", color: "#a3e635", desc: "Email / SMS" },
      { icon: "✉", label: "Invoice", color: "#a3e635", desc: "New invoice", routeTo: "/invoice" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: "◈",
    color: "#a5b4fc",
    actions: [
      { icon: "⊞", label: "Add Product", color: "#fb923c", desc: "New SKU", routeTo: "/add-product" },
      { icon: "📦", label: "Product List", color: "#fbbf24", desc: "View all products", routeTo: "/products" },
      { icon: "🏷", label: "Categories", color: "#34d399", desc: "Manage categories", routeTo: "/categories" },
      { icon: "◈", label: "Receive Stock", color: "#a5b4fc", desc: "Add incoming stock" },
      { icon: "⇄", label: "Transfer Stock", color: "#c084fc", desc: "Move between stores" },
      { icon: "☑", label: "Stock Count", color: "#22d3ee", desc: "Manual stocktake" },
      { icon: "⚠", label: "Low Stock", color: "#f87171", desc: "Low inventory alert", routeTo: "/low-stock" },
      { icon: "📑", label: "Stock History", color: "#94a3b8", desc: "Inventory movement" },
    ],
  },
  {
    key: "customers",
    label: "Customers",
    icon: "⌂",
    color: "#38bdf8",
    actions: [
      { icon: "⌂", label: "Customers", color: "#38bdf8", desc: "CRM lookup", routeTo: "/customers" },
      { icon: "➕", label: "Add Customer", color: "#4ade80", desc: "Create new customer", routeTo: "/add-customer" },
      { icon: "⭐", label: "Loyalty Program", color: "#facc15", desc: "Customer rewards" },
      { icon: "📜", label: "Purchase History", color: "#60a5fa", desc: "Customer orders" },
    ],
  },
  {
    key: "suppliers",
    label: "Suppliers",
    icon: "🏭",
    color: "#c084fc",
    actions: [
      { icon: "🏭", label: "Suppliers", color: "#c084fc", desc: "Manage suppliers", routeTo: "/suppliers" },
      { icon: "➕", label: "Add Supplier", color: "#a78bfa", desc: "New supplier" },
      { icon: "📑", label: "Purchase Orders", color: "#818cf8", desc: "Create purchase orders" },
    ],
  },
  {
    key: "register",
    label: "Register",
    icon: "⊕",
    color: "#86efac",
    actions: [
      { icon: "⊕", label: "Open Register", color: "#86efac", desc: "Start till" },
      { icon: "⊟", label: "Close Register", color: "#94a3b8", desc: "Cash up" },
      { icon: "💵", label: "Cash Management", color: "#22c55e", desc: "Cash in / out" },
      { icon: "⊜", label: "End of Day", color: "#818cf8", desc: "Run EOD report" },
    ],
  },
  {
    key: "History",
    label: "History",
    icon: "📅",
    color: "#218dbe",
    actions: [
      { icon: "🧾", label: "Sales History", color: "#60a5fa", desc: "View past sales", action: () => navigate("/sales-history") },
      { icon: "📄", label: "Invoice History", color: "#38bdf8", desc: "View invoice records", routeTo:"/invoice-history" },
      { icon: "📦", label: "Receive Stock History", color: "#a5b4fc", desc: "Incoming stock records", action: () => navigate("/receive-stock-history") },
      { icon: "⇄", label: "Transfer Stock History", color: "#c084fc", desc: "Stock transfer records", action: () => navigate("/transfer-history") },
      { icon: "↩", label: "Refund History", color: "#f093fb", desc: "Refund transactions", action: () => navigate("/refund-history") },
      { icon: "⊗", label: "Void Sale History", color: "#f87171", desc: "Cancelled sales log", action: () => navigate("/void-history") },
      { icon: "☑", label: "Stock Count History", color: "#22d3ee", desc: "Stocktake records", action: () => navigate("/stock-count-history") },
      { icon: "💰", label: "Register History", color: "#94a3b8", desc: "Cash register activity", action: () => navigate("/register-history") }
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: "📊",
    color: "#818cf8",
    actions: [
      { icon: "⊜", label: "Analysis", color: "#818cf8", desc: "View analytics", routeTo: "/analysis" },
      { icon: "📊", label: "Sales Report", color: "#38bdf8", desc: "Daily sales report" },
      { icon: "📈", label: "Profit Report", color: "#4ade80", desc: "Profit analysis" },
      { icon: "📦", label: "Inventory Report", color: "#fbbf24", desc: "Stock insights" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: "⚙",
    color: "#94a3b8",
    actions: [
      { icon: "⚙", label: "System Settings", color: "#94a3b8", desc: "POS configuration", routeTo: "/settings" },
      { icon: "👥", label: "User Management", color: "#60a5fa", desc: "Manage staff accounts" },
      { icon: "🔐", label: "Roles & Permissions", color: "#c084fc", desc: "Access control" },
    ],
  },
];

export default function POSDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveRevenue, setLiveRevenue] = useState(6482.40);
  const [liveTxn, setLiveTxn] = useState(134);
  const [time, setTime] = useState(new Date());
  const [txFilter, setTxFilter] = useState("all");
  const [activeQACategory, setActiveQACategory] = useState("sales");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      if (Math.random() > 0.75) {
        setLiveRevenue(v => +(v + Math.random() * 12).toFixed(2));
        setLiveTxn(v => v + 1);
      }
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const filteredTx = recentTransactions.filter(t => txFilter === "all" || t.status === txFilter);
  const activeCategory = quickActionCategories.find(c => c.key === activeQACategory);

  return (
    <>
      <div className="shell">
        <main className="main">
          <header className="topbar">
            <div className="topbar-left">
              <div className="sidebar-logo">
                <div className="logo-mark"><span className="logo-icon">⬡</span></div>
                {sidebarOpen && <div className="logo-text"><span className="logo-name">Nexus POS</span><span className="logo-tag">Admin · Retail</span></div>}
              </div>
              <div>
                <span className="breadcrumb">{time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
            <div className="topbar-right">
              <div className="live-pill"><span className="live-dot" />LIVE · {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
              <button className="icon-btn" onClick={() => setNotifOpen(v => !v)} style={{ position: "relative" }}>
                🔔<span className="notif-badge">5</span>
              </button>
              <button className="icon-btn">⚙</button>
              <button className="icon-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                {isFullscreen
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                }
              </button>
              <div className="topbar-avatar">AD</div>
            </div>
          </header>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">Notifications</div>
              {[
                { c: "#f87171", t: "Low stock: USB-C Hub (3 left)", s: "2 min ago" },
                { c: "#fcd34d", t: "Refund approved — TXN-8818", s: "18 min ago" },
                { c: "#a5b4fc", t: "Shift started — Aria K. on R-01", s: "1h ago" },
                { c: "#86efac", t: "Daily target 65% reached", s: "2h ago" },
                { c: "#fcd34d", t: "End-of-day report due at 9 PM", s: "Reminder" },
              ].map((n, i) => (
                <div className="notif-row" key={i}>
                  <div className="notif-dot" style={{ background: n.c }} />
                  <div><div className="notif-row-title">{n.t}</div><div className="notif-row-sub">{n.s}</div></div>
                </div>
              ))}
            </div>
          )}

          <div className="content">

            {/* KPI STRIP */}
            <div className="kpi-strip">
              {[
                { label: "Revenue Today", value: `$${liveRevenue.toLocaleString("en", { minimumFractionDigits: 2 })}`, sub: "Target $10k · 65%", icon: "↗", color: "#667eea", prog: 65 },
                { label: "Transactions", value: String(liveTxn), sub: "+12 this hour", icon: "◈", color: "#a5b4fc", prog: null },
                { label: "Avg Sale Value", value: "$48.38", sub: "+$4.20 vs yesterday", icon: "⬡", color: "#f093fb", prog: null },
                { label: "Items Sold", value: "412", sub: "18 categories", icon: "▦", color: "#86efac", prog: null },
                { label: "Refunds Today", value: "3", sub: "$98.50 total", icon: "⟲", color: "#f87171", prog: null },
                { label: "Active Staff", value: "4 / 5", sub: "1 on break", icon: "✦", color: "#fcd34d", prog: null },
              ].map((k, i) => (
                <div className="kpi-card" key={i} style={{ "--c": k.color }}>
                  <div className="kpi-row">
                    <div className="kpi-icon-box" style={{ background: `${k.color}18`, border: `1px solid ${k.color}30` }}>
                      <span style={{ color: k.color, fontSize: 20 }}>{k.icon}</span>
                    </div>
                    <div className="kpi-body">
                      <div className="kpi-label">{k.label}</div>
                      <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
                      <div className="kpi-sub">{k.sub}</div>
                    </div>
                  </div>
                  {k.prog !== null && (
                    <div className="kpi-prog-bg">
                      <div className="kpi-prog-fill" style={{ width: `${k.prog}%`, background: k.color }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── QUICK ACTIONS — CATEGORIZED ── */}
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Quick Actions</div>
                  <div className="card-sub">Common tasks &amp; shortcuts</div>
                </div>
                {/* Action count badge */}
                <span className="qa-count-badge" style={{ background: `${activeCategory.color}18`, border: `1px solid ${activeCategory.color}30`, color: activeCategory.color }}>
                  {activeCategory.actions.length} actions
                </span>
              </div>

              {/* Category Tab Bar */}
              <div className="qa-cat-bar">
                {quickActionCategories.map(cat => (
                  <button
                    key={cat.key}
                    className={`qa-cat-tab ${activeQACategory === cat.key ? "active" : ""}`}
                    style={{ "--tc": cat.color }}
                    onClick={() => setActiveQACategory(cat.key)}
                  >
                    <span className="qa-cat-tab-icon">{cat.icon}</span>
                    <span className="qa-cat-tab-label">{cat.label}</span>
                    {activeQACategory === cat.key && (
                      <span className="qa-cat-tab-count">{cat.actions.length}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Action Grid */}
              <div className="qa-grid">
                {activeCategory.actions.map((a, i) => (
                  <button
                    key={i}
                    className="qa-tile"
                    style={{ "--c": a.color, animationDelay: `${i * 30}ms` }}
                    onClick={a.routeTo ? () => navigate(a.routeTo) : undefined}
                  >
                    <div className="qa-tile-icon" style={{ background: `${a.color}18`, border: `1px solid ${a.color}28` }}>
                      <span style={{ color: a.color, fontSize: 22 }}>{a.icon}</span>
                    </div>
                    <div className="qa-tile-label">{a.label}</div>
                    <div className="qa-tile-desc">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ROW A */}
            <div className="row-a">

              {/* Transactions */}
              <div className="card tx-card">
                <div className="card-header">
                  <div><div className="card-title">Recent Transactions</div><div className="card-sub">Live sales feed · Today</div></div>
                  <div className="tab-row">
                    {["all", "completed", "refunded"].map(f => (
                      <button key={f} className={`tab-btn ${txFilter === f ? "active" : ""}`} onClick={() => setTxFilter(f)}>{f}</button>
                    ))}
                  </div>
                </div>
                <div className="tx-table">
                  <div className="tx-head">
                    <span>ID</span><span>Customer</span><span>Method</span><span>Total</span><span>Status</span><span>Time</span>
                  </div>
                  {filteredTx.map((t, i) => {
                    const s = txStatusStyle[t.status];
                    return (
                      <div className="tx-row" key={i}>
                        <span className="tx-id">{t.id}</span>
                        <span className="tx-customer">{t.customer}</span>
                        <span className="tx-method">{methodIcon[t.method]} {t.method}</span>
                        <span className="tx-total">${t.total.toFixed(2)}</span>
                        <span className="tx-status" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>{t.status}</span>
                        <span className="tx-time">{t.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staff Performance */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Staff Performance</div><div className="card-sub">Current shift</div></div>
                  <span className="badge-green">4 Active</span>
                </div>
                <div className="staff-list">
                  {staff.map((s, i) => {
                    const maxRev = Math.max(...staff.map(x => x.revenue));
                    return (
                      <div className="staff-row" key={i}>
                        <div className="staff-av" style={{ background: s.status === "active" ? "rgba(102,126,234,0.2)" : "rgba(148,163,184,0.1)", color: s.status === "active" ? "#a5b4fc" : "#64748b" }}>
                          {s.avatar}
                          <div className="staff-status-dot" style={{ background: s.status === "active" ? "#86efac" : "#fcd34d" }} />
                        </div>
                        <div className="staff-info">
                          <div className="staff-name">{s.name}</div>
                          <div className="staff-meta">{s.role} · {s.register}</div>
                          <div className="staff-bar-bg"><div className="staff-bar-fill" style={{ width: `${(s.revenue / maxRev) * 100}%` }} /></div>
                        </div>
                        <div className="staff-nums">
                          <div className="staff-num-row"><span className="snv">{s.sales}</span><span className="snl">sales</span></div>
                          <div className="staff-num-row"><span className="snv">${s.revenue}</span><span className="snl">rev</span></div>
                        </div>
                        <span className="staff-badge" style={{
                          background: s.status === "active" ? "rgba(72,187,120,0.12)" : "rgba(251,191,36,0.12)",
                          border: `1px solid ${s.status === "active" ? "rgba(72,187,120,0.3)" : "rgba(251,191,36,0.3)"}`,
                          color: s.status === "active" ? "#86efac" : "#fcd34d"
                        }}>{s.status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="card activity-card">
                <div className="card-header">
                  <div><div className="card-title">Activity Feed</div><div className="card-sub">Alerts &amp; actions</div></div>
                </div>
                <div className="tasks-list">
                  {pendingTasks.map((t, i) => {
                    const s = taskTypeStyle[t.type];
                    return (
                      <div className="task-row" key={i} style={{ background: s.bg }}>
                        <div className="task-dot" style={{ background: s.dot }} />
                        <div className="task-label">{t.label}</div>
                        <div className="task-time">{t.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ROW C */}
            <div className="row-c">
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Top Selling Items</div><div className="card-sub">By revenue · Today</div></div>
                </div>
                <div className="items-head">
                  <span>#</span><span>Product</span><span>Sold</span><span>Stock</span><span>Revenue</span><span>Trend</span>
                </div>
                {topItems.map((item, i) => {
                  const maxRev = Math.max(...topItems.map(x => x.revenue));
                  return (
                    <div className="item-row" key={i}>
                      <span className="item-rank">{i + 1}</span>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-meta">{item.sku} · {item.cat}</div>
                        <div className="item-bar-bg"><div className="item-bar-fill" style={{ width: `${(item.revenue / maxRev) * 100}%` }} /></div>
                      </div>
                      <span className="item-sold">{item.sold}</span>
                      <span className="item-stock" style={{ color: item.stock < 12 ? "#f87171" : "#86efac" }}>{item.stock}</span>
                      <span className="item-rev">${item.revenue}</span>
                      <span className="item-trend" style={{ color: item.trend > 0 ? "#86efac" : "#f87171" }}>{item.trend > 0 ? "↑" : "↓"}{Math.abs(item.trend)}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Inventory Alerts</div><div className="card-sub">Below reorder threshold</div></div>
                  <span className="badge-warn">4 Critical</span>
                </div>
                <div className="inv-list">
                  {inventory.map((item, i) => {
                    const pct = Math.min((item.stock / item.min) * 100, 100);
                    return (
                      <div className="inv-row" key={i}>
                        <div className="inv-info">
                          <div className="inv-top">
                            <span className="inv-name">{item.item}</span>
                            <span className="inv-sku">{item.sku}</span>
                          </div>
                          <div className="inv-bar-bg">
                            <div className="inv-bar-fill" style={{ width: `${pct}%`, background: item.warn ? "linear-gradient(90deg,#ef4444,#f97316)" : "linear-gradient(90deg,#667eea,#a5b4fc)" }} />
                          </div>
                        </div>
                        <div className="inv-right">
                          <span className="inv-count" style={{ color: item.warn ? "#f87171" : "#86efac" }}>{item.stock} left</span>
                          {item.warn && <button className="inv-reorder-btn">Reorder</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="full-reorder-btn">◈ Auto-Reorder All Critical</button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#090914; --bg2:#0d0d20; --card:rgba(13,13,32,0.97); --border:rgba(255,255,255,0.07);
          --border-h:rgba(102,126,234,0.3); --text:#f1f5f9; --text-2:#cbd5e1; --text-3:#7d8fa8;
          --text-4:#3d5068; --accent:#667eea; --accent-l:#a5b4fc; --green:#86efac; --amber:#fcd34d;
          --red:#f87171; --sw:220px; --sc:58px; --th:62px;
          font-size: 15px;
        }
        html,body,#root { width:100%; height:100%; background:var(--bg); overflow:hidden; }
        .shell { display:flex; height:100vh; width:100%; font-family:'Plus Jakarta Sans',sans-serif; color:var(--text); background:var(--bg); }

        /* ── TOPBAR ── */
        .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
        .topbar { height:var(--th); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:rgba(9,9,20,0.97); backdrop-filter:blur(20px); flex-shrink:0; z-index:10; position:relative; }
        .topbar-left { display:flex; align-items:center; gap:16px; }
        .sidebar-logo { height:var(--th); display:flex; align-items:center; gap:12px; padding:0 4px; flex-shrink:0; }
        .logo-mark { width:34px; height:34px; flex-shrink:0; background:linear-gradient(135deg,#667eea,#764ba2); border-radius:9px; display:flex; align-items:center; justify-content:center; }
        .logo-icon { color:#fff; font-size:16px; }
        .logo-text { display:flex; flex-direction:column; }
        .logo-name { font-family:'Plus Jakarta Sans', sans-serif; font-size:16px; font-weight:900; letter-spacing:1.4px; white-space:nowrap; }
        .logo-tag { font-family:'Plus Jakarta Sans', sans-serif; font-size:10.5px; color:var(--text-3); text-transform:uppercase; letter-spacing:1px; white-space:nowrap; margin-top:1px; }
        .breadcrumb { font-size:16px; color:white; font-family:'Plus Jakarta Sans', sans-serif; background:rgba(255,255,255,0.03); border:1px solid var(--border); padding:6px 10px; border-radius:6px; font-weight:800; margin-top:12px; }
        .topbar-right { display:flex; align-items:center; gap:10px; }
        .live-pill { display:flex; align-items:center; gap:7px; padding:6px 15px; background:rgba(72,187,120,0.1); border:1px solid rgba(72,187,120,0.22); border-radius:20px; font-size:12px; font-family:'Plus Jakarta Sans', sans-serif; color:var(--green); font-weight:700; }
        .live-dot { width:7px; height:7px; border-radius:50%; background:var(--green); animation:blink 1.2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .icon-btn { background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text-3); width:36px; height:36px; border-radius:9px; cursor:pointer; font-size:16px; transition:all 0.16s; display:flex; align-items:center; justify-content:center; }
        .icon-btn:hover { background:rgba(102,126,234,0.1); color:var(--accent-l); border-color:var(--border-h); }
        .notif-badge { position:absolute; top:-5px; right:-5px; width:16px; height:16px; background:#ef4444; border-radius:50%; font-size:9px; color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans', sans-serif; font-weight:700; }
        .topbar-avatar { width:36px; height:36px; border-radius:9px; background:linear-gradient(135deg,#667eea,#764ba2); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer; }

        /* ── NOTIFICATIONS ── */
        .notif-dropdown { position:absolute; top:calc(var(--th) + 8px); right:76px; background:var(--bg2); border:1px solid var(--border); border-radius:14px; padding:10px; z-index:100; width:310px; box-shadow:0 20px 60px rgba(0,0,0,0.55); backdrop-filter:blur(20px); }
        .notif-header { font-size:12px; font-family:'Plus Jakarta Sans', sans-serif; color:var(--text-3); text-transform:uppercase; letter-spacing:1px; padding:6px 10px 10px; border-bottom:1px solid var(--border); margin-bottom:6px; }
        .notif-row { display:flex; align-items:flex-start; gap:12px; padding:10px 10px; border-radius:9px; cursor:pointer; transition:background 0.15s; }
        .notif-row:hover { background:rgba(255,255,255,0.04); }
        .notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
        .notif-row-title { font-size:13px; font-weight:600; color:var(--text); line-height:1.4; }
        .notif-row-sub { font-size:11.5px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; margin-top:3px; }

        /* ── CONTENT AREA ── */
        .content { flex:1; overflow-y:auto; padding:18px 24px; display:flex; flex-direction:column; gap:16px; }
        .content::-webkit-scrollbar { width:4px; }
        .content::-webkit-scrollbar-thumb { background:rgba(102,126,234,0.2); border-radius:2px; }

        /* ── KPI STRIP ── */
        .kpi-strip { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
        .kpi-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:15px 16px; transition:border-color 0.22s,transform 0.22s; cursor:default; position:relative; overflow:hidden; }
        .kpi-card::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--c); opacity:0.65; }
        .kpi-card:hover { border-color:rgba(102,126,234,0.22); transform:translateY(-2px); }
        .kpi-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:10px; }
        .kpi-icon-box { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .kpi-label { font-size:11px; color:var(--text-3); text-transform:uppercase; letter-spacing:0.9px; font-family:'Plus Jakarta Sans', sans-serif; font-weight:500; margin-bottom:4px; }
        .kpi-value { font-family:'Plus Jakarta Sans', sans-serif; font-size:24px; font-weight:900; line-height:1; margin-bottom:4px; }
        .kpi-sub { font-size:11.5px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; font-weight:500; }
        .kpi-prog-bg { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; margin-top:2px; }
        .kpi-prog-fill { height:100%; border-radius:2px; transition:width 1s ease; }

        /* ── CARD BASE ── */
        .card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px 20px; }
        .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; gap:10px; flex-wrap:wrap; }
        .card-title { font-family:'Plus Jakarta Sans', sans-serif; font-size:15px; font-weight:800; color:var(--text); margin-bottom:3px; }
        .card-sub { font-size:12px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; }
        .badge-warn { padding:5px 13px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; background:rgba(248,113,113,0.12); border:1px solid rgba(248,113,113,0.28); color:var(--red); white-space:nowrap; }
        .badge-green { padding:5px 13px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; background:rgba(72,187,120,0.12); border:1px solid rgba(72,187,120,0.28); color:var(--green); white-space:nowrap; }

        /* ── QUICK ACTIONS — CATEGORY BAR ── */
        .qa-count-badge { padding:5px 13px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; white-space:nowrap; }

        .qa-cat-bar {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .qa-cat-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.03);
          color: var(--text-3);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .qa-cat-tab:hover {
          background: color-mix(in srgb, var(--tc) 8%, transparent);
          border-color: color-mix(in srgb, var(--tc) 25%, transparent);
          color: var(--text-2);
        }
        .qa-cat-tab.active {
          background: color-mix(in srgb, var(--tc) 14%, transparent);
          border-color: color-mix(in srgb, var(--tc) 38%, transparent);
          color: var(--tc);
        }
        .qa-cat-tab-icon { font-size: 14px; }
        .qa-cat-tab-label { line-height: 1; }
        .qa-cat-tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          background: color-mix(in srgb, var(--tc) 22%, transparent);
          color: var(--tc);
        }

        /* ── QUICK ACTIONS GRID ── */
        .qa-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:10px; }
        @keyframes qa-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .qa-tile {
          display:flex; flex-direction:column; align-items:center; gap:8px; padding:16px 8px 14px;
          background:rgba(255,255,255,0.025); border:1px solid var(--border); border-radius:13px;
          cursor:pointer; transition:all 0.18s; text-align:center;
          animation: qa-in 0.22s ease both;
        }
        .qa-tile:hover { background:color-mix(in srgb,var(--c) 8%,transparent); border-color:color-mix(in srgb,var(--c) 40%,transparent); transform:translateY(-2px); }
        .qa-tile-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .qa-tile-label { font-size:13px; font-weight:700; color:var(--text); font-family:'Plus Jakarta Sans',sans-serif; line-height:1.2; }
        .qa-tile-desc { font-size:11px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; line-height:1.3; }

        /* ── LAYOUT ROWS ── */
        .row-a { display:grid; grid-template-columns:1fr 680px 460px; gap:16px; align-items:start; }
        .row-c { display:grid; grid-template-columns:1fr 580px; gap:16px; }

        /* ── ACTIVITY FEED ── */
        .tasks-list { display:flex; flex-direction:column; gap:7px; }
        .task-row { display:flex; align-items:center; gap:11px; padding:11px 13px; border-radius:10px; }
        .task-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .task-label { flex:1; font-size:13px; color:var(--text-2); font-weight:500; line-height:1.4; }
        .task-time { font-size:11.5px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; white-space:nowrap; padding-left:16px; }

        /* ── TRANSACTIONS ── */
        .tab-row { display:flex; gap:4px; }
        .tab-btn { padding:6px 14px; border-radius:9px; border:1px solid transparent; background:transparent; color:var(--text-3); font-size:12px; cursor:pointer; text-transform:capitalize; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; transition:all 0.16s; }
        .tab-btn:hover { color:var(--text-2); background:rgba(255,255,255,0.04); }
        .tab-btn.active { background:rgba(102,126,234,0.14); border-color:rgba(102,126,234,0.3); color:var(--accent-l); }
        .tx-table { display:flex; flex-direction:column; }
        .tx-head { display:grid; grid-template-columns:100px 90px 130px 72px 100px 64px; font-size:11px; color:var(--text-4); font-family:'Plus Jakarta Sans', sans-serif; text-transform:uppercase; letter-spacing:0.8px; padding:0 10px 9px; border-bottom:1px solid var(--border); gap:6px; }
        .tx-row { display:grid; grid-template-columns:100px 90px 130px 72px 100px 64px; align-items:center; padding:11px 10px; border-radius:10px; transition:background 0.14s; gap:6px; }
        .tx-row:hover { background:rgba(255,255,255,0.03); }
        .tx-id { font-size:12.5px; font-weight:700; color:var(--accent-l); font-family:'Plus Jakarta Sans', sans-serif; }
        .tx-customer { font-size:13px; color:var(--text-2); font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .tx-method { font-size:13px; color:var(--text-2); font-weight:500; }
        .tx-total { font-size:14px; font-weight:700; color:var(--text); }
        .tx-status { display:inline-flex; align-items:center; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; text-transform:capitalize; }
        .tx-time { font-size:11.5px; color:var(--text-4); font-family:'Plus Jakarta Sans', sans-serif; }

        /* ── TOP ITEMS ── */
        .items-head { display:grid; grid-template-columns:28px 1fr 50px 50px 78px 58px; font-size:11px; color:var(--text-4); font-family:'Plus Jakarta Sans', sans-serif; text-transform:uppercase; letter-spacing:0.8px; padding:0 10px 9px; border-bottom:1px solid var(--border); margin-bottom:2px; }
        .item-row { display:grid; grid-template-columns:28px 1fr 50px 50px 78px 58px; align-items:center; padding:10px 10px; border-radius:10px; transition:background 0.14s; }
        .item-row:hover { background:rgba(255,255,255,0.025); }
        .item-rank { font-family:'Syne',sans-serif; font-size:13px; font-weight:900; color:var(--text-4); }
        .item-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px; line-height:1.3; }
        .item-meta { font-size:11px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; margin-bottom:6px; }
        .item-bar-bg { height:3px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
        .item-bar-fill { height:100%; background:linear-gradient(90deg,var(--accent),var(--accent-l)); border-radius:2px; }
        .item-sold,.item-stock { font-size:13px; font-weight:600; font-family:'Plus Jakarta Sans', sans-serif; text-align:center; }
        .item-rev { font-size:13px; font-weight:700; color:var(--text); text-align:right; }
        .item-trend { font-size:12px; font-family:'Plus Jakarta Sans', sans-serif; font-weight:700; text-align:right; }

        /* ── INVENTORY ── */
        .inv-list { display:flex; flex-direction:column; gap:12px; margin-bottom:14px; }
        .inv-row { display:flex; align-items:center; gap:12px; }
        .inv-info { flex:1; min-width:0; }
        .inv-top { display:flex; justify-content:space-between; margin-bottom:7px; gap:8px; }
        .inv-name { font-size:13px; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:140px; }
        .inv-sku { font-size:11px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; flex-shrink:0; }
        .inv-bar-bg { height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
        .inv-bar-fill { height:100%; border-radius:3px; }
        .inv-right { display:flex; flex-direction:column; align-items:flex-end; gap:5px; flex-shrink:0; }
        .inv-count { font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; }
        .inv-reorder-btn { padding:5px 12px; background:rgba(102,126,234,0.12); border:1px solid rgba(102,126,234,0.28); border-radius:7px; color:var(--accent-l); font-size:12px; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; transition:all 0.16s; white-space:nowrap; }
        .inv-reorder-btn:hover { background:rgba(102,126,234,0.22); }
        .full-reorder-btn { width:100%; padding:11px; background:rgba(102,126,234,0.1); border:1px solid rgba(102,126,234,0.22); border-radius:11px; color:var(--accent-l); font-size:13px; font-weight:700; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.18s; }
        .full-reorder-btn:hover { background:rgba(102,126,234,0.2); }

        /* ── STAFF ── */
        .staff-list { display:flex; flex-direction:column; gap:8px; }
        .staff-row { display:flex; align-items:center; gap:12px; padding:10px 11px; border-radius:11px; transition:background 0.14s; }
        .staff-row:hover { background:rgba(255,255,255,0.025); }
        .staff-av { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; flex-shrink:0; position:relative; }
        .staff-status-dot { position:absolute; bottom:-1px; right:-1px; width:9px; height:9px; border-radius:50%; border:2px solid var(--bg2); }
        .staff-info { flex:1; min-width:0; }
        .staff-name { font-size:13.5px; font-weight:700; color:var(--text); }
        .staff-meta { font-size:11px; color:var(--text-3); font-family:'Plus Jakarta Sans', sans-serif; margin-bottom:6px; margin-top:1px; }
        .staff-bar-bg { height:3px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
        .staff-bar-fill { height:100%; background:linear-gradient(90deg,#667eea,#a5b4fc); border-radius:2px; }
        .staff-nums { display:flex; gap:14px; flex-shrink:0; }
        .staff-num-row { display:flex; flex-direction:column; align-items:flex-end; }
        .snv { font-size:13.5px; font-weight:700; color:var(--text); }
        .snl { font-size:10px; color:var(--text-4); font-family:'Plus Jakarta Sans', sans-serif; text-transform:uppercase; letter-spacing:0.5px; margin-top:1px; }
        .staff-badge { padding:4px 11px; border-radius:20px; font-size:11px; font-weight:700; font-family:'Plus Jakarta Sans', sans-serif; flex-shrink:0; }

        /* ── RESPONSIVE ── */
        @media (max-width:1400px) { .kpi-strip{grid-template-columns:repeat(3,1fr);} .row-c{grid-template-columns:1fr 260px;} .qa-grid{grid-template-columns:repeat(6,1fr);} }
        @media (max-width:1100px) { .row-a{grid-template-columns:1fr 1fr;} .row-a .card:last-child{grid-column:1/-1;} .qa-grid{grid-template-columns:repeat(4,1fr);} .row-c{grid-template-columns:1fr;} }
        @media (max-width:800px) { .kpi-strip{grid-template-columns:repeat(2,1fr);} .qa-grid{grid-template-columns:repeat(3,1fr);} .row-a{grid-template-columns:1fr;} }
      `}</style>
    </>
  );
}