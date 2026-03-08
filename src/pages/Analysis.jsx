import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const navItems = [
  { icon: "⬡", label: "Dashboard" },
  { icon: "↗", label: "Sales" },
  { icon: "◈", label: "Inventory" },
  { icon: "▲", label: "Analytics", active: true },
  { icon: "✦", label: "Staff" },
  { icon: "⊞", label: "Products" },
  { icon: "⌂", label: "Customers" },
  { icon: "⌘", label: "Settings" },
];

const weeklyRevenue = [
  { day: "Mon", revenue: 4210, transactions: 98, returns: 3 },
  { day: "Tue", revenue: 5840, transactions: 134, returns: 5 },
  { day: "Wed", revenue: 3920, transactions: 89, returns: 2 },
  { day: "Thu", revenue: 6730, transactions: 158, returns: 7 },
  { day: "Fri", revenue: 9120, transactions: 213, returns: 9 },
  { day: "Sat", revenue: 11400, transactions: 267, returns: 12 },
  { day: "Sun", revenue: 7850, transactions: 184, returns: 6 },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 68400, transactions: 1420 },
  { month: "Feb", revenue: 72100, transactions: 1560 },
  { month: "Mar", revenue: 65800, transactions: 1380 },
  { month: "Apr", revenue: 78900, transactions: 1720 },
  { month: "May", revenue: 84200, transactions: 1890 },
  { month: "Jun", revenue: 91500, transactions: 2010 },
  { month: "Jul", revenue: 88300, transactions: 1950 },
  { month: "Aug", revenue: 95700, transactions: 2140 },
  { month: "Sep", revenue: 102400, transactions: 2280 },
  { month: "Oct", revenue: 98100, transactions: 2190 },
  { month: "Nov", revenue: 114500, transactions: 2560 },
  { month: "Dec", revenue: 128900, transactions: 2890 },
];

const hourlyData = [
  { h: "8", v: 320 }, { h: "9", v: 890 }, { h: "10", v: 1240 },
  { h: "11", v: 1820 }, { h: "12", v: 3100 }, { h: "13", v: 2750 },
  { h: "14", v: 1950 }, { h: "15", v: 1420 }, { h: "16", v: 1680 },
  { h: "17", v: 2890 }, { h: "18", v: 3420 }, { h: "19", v: 2100 },
  { h: "20", v: 980 },
];

const categoryRevenue = [
  { cat: "Electronics", revenue: 28400, pct: 34, color: "#667eea", items: 142 },
  { cat: "Apparel", revenue: 19200, pct: 23, color: "#a5b4fc", items: 389 },
  { cat: "Accessories", revenue: 14800, pct: 18, color: "#f093fb", items: 234 },
  { cat: "Home & Living", revenue: 9900, pct: 12, color: "#86efac", items: 167 },
  { cat: "Stationery", revenue: 6600, pct: 8, color: "#fcd34d", items: 512 },
  { cat: "Lifestyle", revenue: 4200, pct: 5, color: "#fb923c", items: 98 },
];

const paymentMethods = [
  { method: "Contactless", pct: 46, count: 612, value: 28900, color: "#667eea" },
  { method: "Credit Card", pct: 28, count: 373, value: 19200, color: "#a5b4fc" },
  { method: "Cash", pct: 16, count: 213, value: 9800, color: "#86efac" },
  { method: "QR / Mobile Pay", pct: 10, count: 133, value: 6400, color: "#f093fb" },
];

const topProducts = [
  { rank: 1, name: "Wireless Earbuds Pro", sku: "WEP-221", cat: "Electronics", units: 187, revenue: 11220, margin: 42, trend: +22 },
  { rank: 2, name: "Cotton Crew T-Shirt", sku: "CCT-089", cat: "Apparel", units: 412, revenue: 7416, margin: 61, trend: +7 },
  { rank: 3, name: "Leather Wallet Slim", sku: "LWS-441", cat: "Accessories", units: 234, revenue: 5850, margin: 55, trend: +14 },
  { rank: 4, name: "USB-C Hub 7-in-1", sku: "UCH-880", cat: "Electronics", units: 98, revenue: 4802, margin: 38, trend: +31 },
  { rank: 5, name: "Scented Candle Set", sku: "SCS-112", cat: "Home", units: 321, revenue: 4494, margin: 68, trend: -3 },
  { rank: 6, name: "Stainless Water Bottle", sku: "SWB-330", cat: "Lifestyle", units: 289, revenue: 4335, margin: 57, trend: +11 },
  { rank: 7, name: "Phone Case iPhone", sku: "PCI-556", cat: "Accessories", units: 198, revenue: 2772, margin: 72, trend: +4 },
  { rank: 8, name: "Notebook A5 Grid", sku: "NAG-007", cat: "Stationery", units: 534, revenue: 2670, margin: 64, trend: +5 },
];

const staffRevenue = [
  { name: "Aria K.", role: "Shift Lead", revenue: 18200, transactions: 340, avg: 53.5, avatar: "AK", color: "#667eea" },
  { name: "Lena S.", role: "Sales Assoc.", revenue: 15600, transactions: 312, avg: 50.0, avatar: "LS", color: "#a5b4fc" },
  { name: "Marco D.", role: "Cashier", revenue: 13400, transactions: 281, avg: 47.7, avatar: "MD", color: "#f093fb" },
  { name: "Zoe R.", role: "Sales Assoc.", revenue: 10200, transactions: 218, avg: 46.8, avatar: "ZR", color: "#86efac" },
  { name: "Ben T.", role: "Cashier", revenue: 8900, transactions: 193, avg: 46.1, avatar: "BT", color: "#fcd34d" },
];

const refundData = [
  { day: "Mon", refunds: 3, value: 142 },
  { day: "Tue", refunds: 5, value: 218 },
  { day: "Wed", refunds: 2, value: 89 },
  { day: "Thu", refunds: 7, value: 310 },
  { day: "Fri", refunds: 9, value: 412 },
  { day: "Sat", refunds: 12, value: 534 },
  { day: "Sun", refunds: 6, value: 267 },
];

const compareKPIs = [
  { label: "Revenue", current: 49070, prev: 41620, unit: "$", color: "#667eea" },
  { label: "Transactions", current: 1143, prev: 980, unit: "", color: "#a5b4fc" },
  { label: "Avg Sale", current: 42.93, prev: 42.47, unit: "$", color: "#f093fb" },
  { label: "Refund Rate", current: 3.8, prev: 4.2, unit: "%", color: "#86efac", inverse: true },
];

// ─── SVG CHART COMPONENTS ────────────────────────────────────────────────────

function BarChart({ data, valueKey, color = "#667eea", height = 120, showLabel = true }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "0 2px" }}>
      {data.map((d, i) => {
        const h = Math.max((d[valueKey] / max) * (height - 24), 4);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
            <div className="bar-wrap" style={{ width: "100%", height: h, position: "relative" }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "4px 4px 0 0",
                background: `linear-gradient(180deg, ${color}cc, ${color}66)`,
                border: `1px solid ${color}44`,
                transition: "height 0.6s ease",
              }} />
            </div>
            {showLabel && <span style={{ fontSize: 9, color: "#475569", fontFamily: "DM Mono, monospace", whiteSpace: "nowrap" }}>{d.day || d.month || d.h}</span>}
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, valueKey, color = "#667eea", height = 120, fill = true }) {
  const vals = data.map(d => d[valueKey]);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const w = 100, h = height - 20;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return [x, y];
  });
  const pathD = "M" + pts.map(p => p.join(",")).join(" L");
  const areaD = `M0,${h} L${pathD.slice(1)} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lc-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {fill && <path d={areaD} fill={`url(#lc-${color.replace("#","")})`} />}
      <path d={pathD} stroke={color} strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill={color} />
      ))}
    </svg>
  );
}

function DonutChart({ data, size = 140 }) {
  const r = size * 0.38, cx = size / 2, cy = size / 2, sw = size * 0.14;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />
      {data.map((d, i) => {
        const offset = circ * (1 - cum / 100);
        const dash = (d.pct / 100) * circ;
        cum += d.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`}
            strokeDashoffset={offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, transition: "stroke-dasharray 0.8s ease" }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#fff" fontSize={size * 0.12} fontWeight="800" fontFamily="Syne, sans-serif">64%</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize={size * 0.07} fontFamily="DM Mono, monospace">margin</text>
    </svg>
  );
}

function HeatRow({ label, values, max }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <span style={{ width: 26, fontSize: 10, color: "#475569", fontFamily: "DM Mono, monospace", flexShrink: 0, textAlign: "right" }}>{label}</span>
      <div style={{ display: "flex", gap: 3, flex: 1 }}>
        {values.map((v, i) => {
          const intensity = v / max;
          return (
            <div key={i} title={`${v}`} style={{
              flex: 1, height: 18, borderRadius: 3,
              background: `rgba(102,126,234,${0.05 + intensity * 0.7})`,
              border: `1px solid rgba(102,126,234,${0.1 + intensity * 0.3})`,
              transition: "background 0.3s",
              cursor: "default",
            }} />
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [activeNav, setActiveNav] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [period, setPeriod] = useState("week");
  const [chartView, setChartView] = useState("revenue");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
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

  const chartData = period === "week" ? weeklyRevenue : monthlyRevenue;
  const maxRev = Math.max(...chartData.map(d => d.revenue));

  const heatmapData = {
    rows: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    cols: ["8am","10am","12pm","2pm","4pm","6pm","8pm"],
    values: [
      [12, 28, 48, 31, 24, 38, 14],
      [18, 35, 62, 44, 38, 52, 21],
      [8,  22, 41, 28, 19, 31, 12],
      [21, 42, 71, 53, 44, 61, 28],
      [29, 58, 94, 72, 61, 84, 38],
      [34, 72, 112, 88, 79, 98, 52],
      [22, 48, 78, 59, 51, 71, 34],
    ],
  };
  const heatMax = 112;

  return (
    <>
      <div className="shell">
       
        {/* ── MAIN ── */}
        <main className="main">
          <header className="topbar">
            <div className="topbar-left">
              <div>
                <h2 className="page-title">Analytics</h2>
                <span className="breadcrumb">Performance insights · {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
              </div>
            </div>
            <div className="topbar-right">
              {/* Period selector */}
              <div className="period-group">
                {["day","week","month","year"].map(p => (
                  <button key={p} className={`period-btn ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
                ))}
              </div>
              <button className="export-btn">↓ Export</button>
              <button className="icon-btn" onClick={toggleFullscreen}>
                {isFullscreen
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                }
              </button>
              <div className="topbar-avatar">AD</div>
            </div>
          </header>

          <div className="content">

            {/* ── COMPARE STRIP ── */}
            <div className="compare-strip">
              {compareKPIs.map((k, i) => {
                const diff = k.current - k.prev;
                const pctChange = ((diff / k.prev) * 100).toFixed(1);
                const up = k.inverse ? diff < 0 : diff > 0;
                return (
                  <div className="compare-card" key={i} style={{ "--c": k.color }}>
                    <div className="compare-top">
                      <span className="compare-label">{k.label}</span>
                      <span className="compare-change" style={{ color: up ? "#86efac" : "#f87171", background: up ? "rgba(72,187,120,0.1)" : "rgba(248,113,113,0.1)", border: `1px solid ${up ? "rgba(72,187,120,0.25)" : "rgba(248,113,113,0.25)"}` }}>
                        {up ? "↑" : "↓"} {Math.abs(pctChange)}%
                      </span>
                    </div>
                    <div className="compare-value" style={{ color: k.color }}>
                      {k.unit === "$" ? `$${k.current.toLocaleString()}` : `${k.current}${k.unit}`}
                    </div>
                    <div className="compare-prev">
                      vs {k.unit === "$" ? `$${k.prev.toLocaleString()}` : `${k.prev}${k.unit}`} last {period}
                    </div>
                    <div className="compare-bar-bg">
                      <div className="compare-bar-fill" style={{ width: `${Math.min((k.current / (k.current + Math.abs(diff) * 2)) * 100, 100)}%`, background: k.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── REVENUE CHART + CATEGORY SPLIT ── */}
            <div className="row-main">

              {/* Big Revenue Chart */}
              <div className="card chart-big">
                <div className="card-header">
                  <div>
                    <div className="card-title">Revenue Overview</div>
                    <div className="card-sub">{period === "week" ? "Last 7 days" : "Last 12 months"} · Retail sales</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {["revenue","transactions"].map(v => (
                      <button key={v} className={`tab-btn ${chartView === v ? "active" : ""}`} onClick={() => setChartView(v)}>{v}</button>
                    ))}
                  </div>
                </div>

                {/* Y-axis labels + bars */}
                <div className="chart-area">
                  <div className="y-axis">
                    {[100, 75, 50, 25, 0].map(p => (
                      <div key={p} className="y-label">{chartView === "revenue" ? `$${Math.round(maxRev * p / 100 / 1000)}k` : `${Math.round(Math.max(...chartData.map(d=>d.transactions)) * p / 100)}`}</div>
                    ))}
                  </div>
                  <div className="chart-bars-wrap">
                    <div className="grid-lines">
                      {[0,25,50,75,100].map(p => <div key={p} className="grid-line" style={{ bottom: `${p}%` }} />)}
                    </div>
                    {chartData.map((d, i) => {
                      const val = chartView === "revenue" ? d.revenue : d.transactions;
                      const maxVal = Math.max(...chartData.map(x => chartView === "revenue" ? x.revenue : x.transactions));
                      const pct = (val / maxVal) * 100;
                      const isToday = period === "week" && i === 6;
                      return (
                        <div key={i} className="bar-col">
                          <div className="bar-tooltip">{chartView === "revenue" ? `$${val.toLocaleString()}` : `${val} txns`}</div>
                          <div className="bar-outer" style={{ height: "100%" }}>
                            <div className="bar-inner" style={{
                              height: `${pct}%`,
                              background: isToday
                                ? "linear-gradient(180deg, #a5b4fc, #667eea)"
                                : "linear-gradient(180deg, rgba(102,126,234,0.7), rgba(102,126,234,0.25))",
                              boxShadow: isToday ? "0 0 12px rgba(102,126,234,0.4)" : "none",
                            }} />
                          </div>
                          <div className="bar-label">{d.day || d.month}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary row */}
                <div className="chart-summary">
                  {[
                    { label: "Total Revenue", value: `$${chartData.reduce((s,d)=>s+d.revenue,0).toLocaleString()}` },
                    { label: "Total Transactions", value: chartData.reduce((s,d)=>s+d.transactions,0).toLocaleString() },
                    { label: "Peak Day", value: chartData.reduce((a,b) => a.revenue > b.revenue ? a : b).day || chartData.reduce((a,b) => a.revenue > b.revenue ? a : b).month },
                    { label: "Avg Daily Revenue", value: `$${Math.round(chartData.reduce((s,d)=>s+d.revenue,0)/chartData.length).toLocaleString()}` },
                  ].map((s, i) => (
                    <div className="sum-item" key={i}>
                      <div className="sum-val">{s.value}</div>
                      <div className="sum-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Split */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Revenue by Category</div><div className="card-sub">This {period}</div></div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                  <DonutChart data={categoryRevenue} size={150} />
                </div>
                <div className="cat-list">
                  {categoryRevenue.map((c, i) => (
                    <div className="cat-row" key={i}>
                      <div className="cat-dot" style={{ background: c.color }} />
                      <div className="cat-info">
                        <div className="cat-name">{c.cat}</div>
                        <div className="cat-bar-bg">
                          <div className="cat-bar-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                        </div>
                      </div>
                      <div className="cat-nums">
                        <span className="cat-pct" style={{ color: c.color }}>{c.pct}%</span>
                        <span className="cat-rev">${c.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── ROW 2: Hourly + Payment Methods + Refunds ── */}
            <div className="row-three">

              {/* Hourly Traffic */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Hourly Sales Traffic</div><div className="card-sub">Revenue by hour · Today</div></div>
                </div>
                <div className="hourly-chart">
                  <LineChart data={hourlyData} valueKey="v" color="#667eea" height={100} />
                  <div className="hour-labels">
                    {hourlyData.map((d, i) => <span key={i}>{d.h}</span>)}
                  </div>
                </div>
                <div className="hourly-stats">
                  <div className="hstat"><span className="hstat-v">12pm</span><span className="hstat-l">Peak Hour</span></div>
                  <div className="hstat"><span className="hstat-v">$3,100</span><span className="hstat-l">Peak Revenue</span></div>
                  <div className="hstat"><span className="hstat-v">8am</span><span className="hstat-l">Quiet Hour</span></div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Payment Breakdown</div><div className="card-sub">Method split · This {period}</div></div>
                </div>
                <div className="pay-list">
                  {paymentMethods.map((p, i) => (
                    <div className="pay-row" key={i}>
                      <div className="pay-icon" style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                        <span style={{ color: p.color, fontSize: 13 }}>{["⚡","💳","💵","📱"][i]}</span>
                      </div>
                      <div className="pay-info">
                        <div className="pay-name">{p.method}</div>
                        <div className="pay-bar-bg">
                          <div className="pay-bar-fill" style={{ width: `${p.pct}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
                        </div>
                      </div>
                      <div className="pay-nums">
                        <span className="pay-pct" style={{ color: p.color }}>{p.pct}%</span>
                        <span className="pay-count">{p.count} txns</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Analysis */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Refund Analysis</div><div className="card-sub">Returns & exchanges · This week</div></div>
                  <span className="badge-ok">3.8% rate</span>
                </div>
                <BarChart data={refundData} valueKey="refunds" color="#f87171" height={90} />
                <div className="refund-stats">
                  {[
                    { v: "44", l: "Total Refunds" },
                    { v: "$1,972", l: "Total Value" },
                    { v: "$44.82", l: "Avg Refund" },
                  ].map((s,i) => (
                    <div className="rstat" key={i}>
                      <span className="rstat-v">{s.v}</span>
                      <span className="rstat-l">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── ROW 3: Top Products Table ── */}
            <div className="card">
              <div className="card-header">
                <div><div className="card-title">Product Performance</div><div className="card-sub">Top items by revenue · This {period}</div></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="export-btn">↓ CSV</button>
                </div>
              </div>
              <div className="prod-table">
                <div className="prod-head">
                  <span>#</span><span>Product</span><span>Category</span><span>Units Sold</span><span>Revenue</span><span>Margin</span><span>Trend</span>
                </div>
                {topProducts.map((p, i) => (
                  <div className="prod-row" key={i}>
                    <span className="prod-rank">{p.rank}</span>
                    <div className="prod-info">
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-sku">{p.sku}</div>
                    </div>
                    <span className="prod-cat">
                      <span className="cat-chip" style={{ background: categoryRevenue.find(c=>c.cat.includes(p.cat) || p.cat.includes(c.cat.split(" ")[0]))?.color+"1a" || "rgba(102,126,234,0.12)", color: categoryRevenue.find(c=>c.cat.includes(p.cat) || p.cat.includes(c.cat.split(" ")[0]))?.color || "#a5b4fc" }}>
                        {p.cat}
                      </span>
                    </span>
                    <span className="prod-units">{p.units.toLocaleString()}</span>
                    <span className="prod-rev">${p.revenue.toLocaleString()}</span>
                    <div className="prod-margin-wrap">
                      <div className="prod-margin-bar">
                        <div style={{ width: `${p.margin}%`, height: "100%", background: "linear-gradient(90deg,#667eea,#a5b4fc)", borderRadius: 3 }} />
                      </div>
                      <span className="prod-margin-val">{p.margin}%</span>
                    </div>
                    <span className="prod-trend" style={{ color: p.trend > 0 ? "#86efac" : "#f87171" }}>
                      {p.trend > 0 ? "↑" : "↓"} {Math.abs(p.trend)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ROW 4: Heatmap + Staff ── */}
            <div className="row-bottom">

              {/* Sales Heatmap */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Sales Heatmap</div><div className="card-sub">Transactions by day & hour</div></div>
                </div>
                <div style={{ paddingBottom: 8 }}>
                  {/* Hour col headers */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 26, flexShrink: 0 }} />
                    <div style={{ display: "flex", gap: 3, flex: 1 }}>
                      {heatmapData.cols.map(c => (
                        <div key={c} style={{ flex: 1, fontSize: 9, color: "#334155", fontFamily: "DM Mono, monospace", textAlign: "center" }}>{c}</div>
                      ))}
                    </div>
                  </div>
                  {heatmapData.rows.map((row, i) => (
                    <HeatRow key={row} label={row} values={heatmapData.values[i]} max={heatMax} />
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <span style={{ width: 26 }} />
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: "#475569", fontFamily: "DM Mono, monospace" }}>Low</span>
                      {[0.05, 0.2, 0.4, 0.6, 0.75].map((o, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(102,126,234,${o})`, border: `1px solid rgba(102,126,234,${o+0.15})` }} />
                      ))}
                      <span style={{ fontSize: 9, color: "#475569", fontFamily: "DM Mono, monospace" }}>High</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Leaderboard */}
              <div className="card">
                <div className="card-header">
                  <div><div className="card-title">Staff Leaderboard</div><div className="card-sub">Revenue performance · This {period}</div></div>
                </div>
                <div className="leader-list">
                  {staffRevenue.map((s, i) => {
                    const maxRev = staffRevenue[0].revenue;
                    return (
                      <div className="leader-row" key={i}>
                        <div className="leader-rank" style={{ color: i === 0 ? "#fcd34d" : i === 1 ? "#94a3b8" : i === 2 ? "#fb923c" : "#334155" }}>
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                        </div>
                        <div className="leader-av" style={{ background: `${s.color}1a`, border: `1px solid ${s.color}30`, color: s.color }}>
                          {s.avatar}
                        </div>
                        <div className="leader-info">
                          <div className="leader-name">{s.name}<span className="leader-role">{s.role}</span></div>
                          <div className="leader-bar-bg">
                            <div className="leader-bar-fill" style={{ width: `${(s.revenue / maxRev) * 100}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
                          </div>
                        </div>
                        <div className="leader-nums">
                          <span className="lnv" style={{ color: s.color }}>${s.revenue.toLocaleString()}</span>
                          <span className="lnl">{s.transactions} txns · avg ${s.avg}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#090914; --bg2:#0d0d20; --card:rgba(13,13,32,0.97); --border:rgba(255,255,255,0.07);
          --border-h:rgba(102,126,234,0.3); --text:#f1f5f9; --text-2:#cbd5e1; --text-3:#64748b;
          --text-4:#334155; --accent:#667eea; --accent-l:#a5b4fc; --green:#86efac; --amber:#fcd34d;
          --red:#f87171; --sw:220px; --sc:58px; --th:58px;
        }
        html,body,#root { width:100%; height:100%; background:var(--bg); overflow:hidden; }
        .shell { display:flex; height:100vh; width:100%; font-family:'DM Sans',sans-serif; color:var(--text); background:var(--bg); }

        /* TOPBAR */
        .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
        .topbar { height:var(--th); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 22px; background:rgba(9,9,20,0.97); backdrop-filter:blur(20px); flex-shrink:0; z-index:10; }
        .topbar-left { display:flex; align-items:center; gap:14px; }
        .page-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:var(--text); }
        .breadcrumb { font-size:10.5px; color:var(--text-3); font-family:'DM Mono',monospace; display:block; margin-top:1px; }
        .topbar-right { display:flex; align-items:center; gap:10px; }
        .period-group { display:flex; background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:9px; padding:3px; gap:2px; }
        .period-btn { padding:5px 13px; border-radius:7px; border:none; background:transparent; color:var(--text-3); font-family:'DM Mono',monospace; font-size:11px; cursor:pointer; text-transform:capitalize; transition:all 0.16s; }
        .period-btn:hover { color:var(--text-2); }
        .period-btn.active { background:rgba(102,126,234,0.2); color:var(--accent-l); border:1px solid rgba(102,126,234,0.3); }
        .export-btn { padding:7px 16px; background:rgba(102,126,234,0.1); border:1px solid rgba(102,126,234,0.25); border-radius:8px; color:var(--accent-l); font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.16s; white-space:nowrap; }
        .export-btn:hover { background:rgba(102,126,234,0.2); }
        .icon-btn { background:rgba(255,255,255,0.05); border:1px solid var(--border); color:var(--text-3); width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:14px; transition:all 0.16s; display:flex; align-items:center; justify-content:center; }
        .icon-btn:hover { background:rgba(102,126,234,0.1); color:var(--accent-l); border-color:var(--border-h); }
        .topbar-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#667eea,#764ba2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; font-family:'Syne',sans-serif; cursor:pointer; }

        /* CONTENT */
        .content { flex:1; overflow-y:auto; padding:18px 22px; display:flex; flex-direction:column; gap:16px; }
        .content::-webkit-scrollbar { width:3px; }
        .content::-webkit-scrollbar-thumb { background:rgba(102,126,234,0.2); border-radius:2px; }

        /* COMPARE STRIP */
        .compare-strip { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        .compare-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:16px 18px; position:relative; overflow:hidden; transition:transform 0.2s,border-color 0.2s; }
        .compare-card::after { content:''; position:absolute; top:0;left:0;right:0;height:2px; background:var(--c); opacity:0.7; }
        .compare-card:hover { transform:translateY(-2px); border-color:rgba(102,126,234,0.2); }
        .compare-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
        .compare-label { font-size:11px; color:var(--text-3); text-transform:uppercase; letter-spacing:1px; font-family:'DM Mono',monospace; }
        .compare-change { padding:3px 9px; border-radius:20px; font-size:11px; font-weight:700; font-family:'DM Mono',monospace; }
        .compare-value { font-family:'Syne',sans-serif; font-size:28px; font-weight:900; line-height:1; margin-bottom:4px; }
        .compare-prev { font-size:10.5px; color:var(--text-3); margin-bottom:12px; }
        .compare-bar-bg { height:3px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
        .compare-bar-fill { height:100%; border-radius:2px; transition:width 1s ease; }

        /* CARD */
        .card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px; }
        .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; gap:10px; flex-wrap:wrap; }
        .card-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:800; color:var(--text); margin-bottom:2px; }
        .card-sub { font-size:10.5px; color:var(--text-3); font-family:'DM Mono',monospace; }
        .tab-btn { padding:5px 12px; border-radius:8px; border:1px solid transparent; background:transparent; color:var(--text-3); font-size:10.5px; cursor:pointer; text-transform:capitalize; font-family:'DM Mono',monospace; transition:all 0.16s; }
        .tab-btn:hover { color:var(--text-2); }
        .tab-btn.active { background:rgba(102,126,234,0.14); border-color:rgba(102,126,234,0.3); color:var(--accent-l); }
        .badge-ok { padding:4px 11px; border-radius:20px; font-size:10px; font-weight:700; font-family:'DM Mono',monospace; background:rgba(72,187,120,0.12); border:1px solid rgba(72,187,120,0.28); color:var(--green); white-space:nowrap; }

        /* ROW MAIN */
        .row-main { display:grid; grid-template-columns:1fr 280px; gap:16px; }

        /* BIG CHART */
        .chart-big {}
        .chart-area { display:flex; gap:12px; height:160px; margin-bottom:14px; }
        .y-axis { display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; padding-bottom:18px; flex-shrink:0; }
        .y-label { font-size:9px; color:var(--text-4); font-family:'DM Mono',monospace; white-space:nowrap; }
        .chart-bars-wrap { flex:1; display:flex; gap:5px; position:relative; }
        .grid-lines { position:absolute; inset:0; pointer-events:none; }
        .grid-line { position:absolute; left:0; right:0; height:1px; background:rgba(255,255,255,0.04); }
        .bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; position:relative; }
        .bar-col:hover .bar-tooltip { opacity:1; transform:translateY(-4px); }
        .bar-tooltip { position:absolute; top:-28px; left:50%; transform:translateX(-50%) translateY(0); background:rgba(17,24,39,0.95); border:1px solid var(--border-h); border-radius:7px; padding:3px 9px; font-size:10px; color:var(--accent-l); font-family:'DM Mono',monospace; white-space:nowrap; opacity:0; transition:all 0.18s; pointer-events:none; z-index:10; }
        .bar-outer { flex:1; display:flex; align-items:flex-end; width:100%; }
        .bar-inner { width:100%; border-radius:4px 4px 0 0; transition:height 0.6s ease; min-height:4px; }
        .bar-label { font-size:9px; color:var(--text-4); font-family:'DM Mono',monospace; white-space:nowrap; }
        .chart-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); border-radius:10px; overflow:hidden; margin-top:4px; }
        .sum-item { background:rgba(255,255,255,0.025); padding:10px 14px; }
        .sum-val { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:var(--text); margin-bottom:2px; }
        .sum-lbl { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }

        /* CATEGORY */
        .cat-list { display:flex; flex-direction:column; gap:9px; }
        .cat-row { display:flex; align-items:center; gap:10px; }
        .cat-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .cat-info { flex:1; min-width:0; }
        .cat-name { font-size:12px; color:var(--text-2); margin-bottom:5px; }
        .cat-bar-bg { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
        .cat-bar-fill { height:100%; border-radius:2px; transition:width 0.6s ease; }
        .cat-nums { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0; gap:1px; }
        .cat-pct { font-size:12px; font-weight:700; font-family:'DM Mono',monospace; }
        .cat-rev { font-size:10px; color:var(--text-3); font-family:'DM Mono',monospace; }

        /* ROW THREE */
        .row-three { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
        .hourly-chart { margin-bottom:6px; }
        .hour-labels { display:flex; justify-content:space-between; margin-top:4px; }
        .hour-labels span { font-size:9px; color:var(--text-4); font-family:'DM Mono',monospace; }
        .hourly-stats { display:flex; gap:0; border-top:1px solid var(--border); margin-top:10px; }
        .hstat { flex:1; padding:10px 0; display:flex; flex-direction:column; gap:2px; border-right:1px solid var(--border); padding-left:12px; }
        .hstat:last-child { border-right:none; }
        .hstat-v { font-family:'Syne',sans-serif; font-size:15px; font-weight:800; color:var(--text); }
        .hstat-l { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }
        .pay-list { display:flex; flex-direction:column; gap:10px; }
        .pay-row { display:flex; align-items:center; gap:10px; }
        .pay-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pay-info { flex:1; }
        .pay-name { font-size:12px; color:var(--text-2); margin-bottom:5px; }
        .pay-bar-bg { height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
        .pay-bar-fill { height:100%; border-radius:3px; transition:width 0.6s ease; }
        .pay-nums { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0; }
        .pay-pct { font-size:13px; font-weight:700; font-family:'DM Mono',monospace; }
        .pay-count { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }
        .refund-stats { display:flex; justify-content:space-between; border-top:1px solid var(--border); margin-top:12px; padding-top:10px; }
        .rstat { display:flex; flex-direction:column; gap:2px; }
        .rstat-v { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:var(--text); }
        .rstat-l { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }

        /* PRODUCT TABLE */
        .prod-table { display:flex; flex-direction:column; }
        .prod-head { display:grid; grid-template-columns:28px 1fr 110px 90px 90px 120px 70px; font-size:9.5px; color:var(--text-4); font-family:'DM Mono',monospace; text-transform:uppercase; letter-spacing:0.8px; padding:0 10px 8px; border-bottom:1px solid var(--border); gap:10px; }
        .prod-row { display:grid; grid-template-columns:28px 1fr 110px 90px 90px 120px 70px; align-items:center; padding:10px 10px; border-radius:9px; transition:background 0.14s; gap:10px; }
        .prod-row:hover { background:rgba(255,255,255,0.025); }
        .prod-rank { font-family:'Syne',sans-serif; font-size:13px; font-weight:900; color:var(--text-4); }
        .prod-name { font-size:12.5px; font-weight:600; color:var(--text); margin-bottom:1px; }
        .prod-sku { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }
        .cat-chip { padding:3px 9px; border-radius:20px; font-size:10px; font-weight:600; display:inline-block; }
        .prod-units { font-size:12px; color:var(--text-2); font-family:'DM Mono',monospace; }
        .prod-rev { font-size:13px; font-weight:700; color:var(--text); }
        .prod-margin-wrap { display:flex; align-items:center; gap:8px; }
        .prod-margin-bar { flex:1; height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
        .prod-margin-val { font-size:11px; font-weight:700; color:var(--accent-l); font-family:'DM Mono',monospace; flex-shrink:0; }
        .prod-trend { font-size:11.5px; font-weight:700; font-family:'DM Mono',monospace; }

        /* BOTTOM ROW */
        .row-bottom { display:grid; grid-template-columns:1fr 360px; gap:16px; }
        .leader-list { display:flex; flex-direction:column; gap:10px; }
        .leader-row { display:flex; align-items:center; gap:12px; padding:10px 10px; border-radius:10px; transition:background 0.14s; }
        .leader-row:hover { background:rgba(255,255,255,0.025); }
        .leader-rank { width:28px; text-align:center; font-size:16px; flex-shrink:0; }
        .leader-av { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; font-family:'Syne',sans-serif; flex-shrink:0; }
        .leader-info { flex:1; min-width:0; }
        .leader-name { font-size:13px; font-weight:600; color:var(--text); display:flex; align-items:center; gap:8px; margin-bottom:6px; }
        .leader-role { font-size:10px; color:var(--text-3); font-family:'DM Mono',monospace; font-weight:400; }
        .leader-bar-bg { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
        .leader-bar-fill { height:100%; border-radius:2px; transition:width 0.6s ease; }
        .leader-nums { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0; }
        .lnv { font-size:14px; font-weight:800; font-family:'Syne',sans-serif; }
        .lnl { font-size:9.5px; color:var(--text-3); font-family:'DM Mono',monospace; }

        @media (max-width:1400px) { .compare-strip{grid-template-columns:repeat(2,1fr);} .row-main{grid-template-columns:1fr;} .row-three{grid-template-columns:1fr 1fr;} }
        @media (max-width:1100px) { .row-three{grid-template-columns:1fr;} .row-bottom{grid-template-columns:1fr;} .prod-head,.prod-row{grid-template-columns:28px 1fr 80px 70px 80px 90px 60px;} }
        @media (max-width:800px) { .compare-strip{grid-template-columns:1fr 1fr;} }
      `}</style>
    </>
  );
}