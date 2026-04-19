// BottomBar.jsx — full-width scrolling ticker bar
// Props:
//   tickerItems : array of { label, value } — content to scroll
//                 falls back to DEFAULT_TICKER if not provided

import { useEffect, useState } from "react";

const TICKER_CSS = `
  @keyframes bbTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .bb-ticker-bar {
    height: 30px;
    flex-shrink: 0;
    background: #1A1611;
    border-top: 1px solid rgba(181,138,36,0.18);
    display: flex;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .bb-ticker-track {
    display: flex;
    white-space: nowrap;
    animation: bbTicker 32s linear infinite;
    will-change: transform;
  }

  .bb-ticker-track:hover {
    animation-play-state: paused;
  }

  .bb-ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 22px;
    border-right: 1px solid rgba(244,241,233,0.06);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .bb-ticker-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(184,144,42,0.35);
    flex-shrink: 0;
  }

  .bb-ticker-lbl {
    font-size: 8px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: rgba(181,138,36,0.5);
  }

  .bb-ticker-val {
    font-family: 'Geist Mono', monospace;
    font-size: 9.5px;
    font-weight: 600;
    color: rgba(244,241,233,0.42);
  }
`;

const DEFAULT_TICKER = [
  { label: "System",       value: "Online"  },
  { label: "Uptime",       value: "99.9%"   },
  { label: "Checkout",     value: "0.3s"    },
  { label: "Registers",    value: "3 of 4"  },
  { label: "Payment OK",   value: "99.8%"   },
  { label: "SKUs Synced",  value: "214"     },
  { label: "Low Stock",    value: "7 items" },
  { label: "PO Pending",   value: "2"       },
  { label: "Active Users", value: "4"       },
];

export default function BottomBar({ tickerItems }) {
  const items  = tickerItems?.length ? tickerItems : DEFAULT_TICKER;
  const doubled = [...items, ...items];

  return (
    <>
      <style>{TICKER_CSS}</style>

      <div className="bb-ticker-bar">
        <div className="bb-ticker-track">
          {doubled.map((item, i) => (
            <span className="bb-ticker-item" key={i}>
              <span className="bb-ticker-dot" />
              <span className="bb-ticker-lbl">{item.label}</span>
              <span className="bb-ticker-val">{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}