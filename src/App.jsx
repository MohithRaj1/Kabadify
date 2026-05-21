import { useState, useEffect, useRef } from "react";

// ── Fonts via Google Fonts (injected once) ──────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
document.head.appendChild(fontLink);

// ── Design tokens ──────────────────────────────────────────────────────────
const CSS = `
  :root {
    --forest: #1a4731;
    --emerald: #2d7a4f;
    --lime: #6abf69;
    --mint: #b8f0c8;
    --sage: #e8f5e9;
    --earth: #8b6914;
    --clay: #c4a265;
    --sand: #f5efe0;
    --cream: #fdfaf3;
    --charcoal: #1c1c1e;
    --graphite: #3a3a3c;
    --muted: #6e6e73;
    --white: #ffffff;
    --radius: 16px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(26,71,49,0.12);
    --shadow-lg: 0 16px 64px rgba(26,71,49,0.18);
    --transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--charcoal); overflow-x: hidden; }
  h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.04); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-fade-up { animation: fadeUp 0.7s ease both; }
  .animate-fade-in { animation: fadeIn 0.5s ease both; }
  .animate-float   { animation: float 4s ease-in-out infinite; }
  .animate-pulse   { animation: pulse 2s ease-in-out infinite; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--sage); }
  ::-webkit-scrollbar-thumb { background: var(--emerald); border-radius: 3px; }

  /* Nav */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(253,250,243,0.92); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(106,191,105,0.2);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 68px; transition: var(--transition); }
  .nav-logo { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
    background: linear-gradient(135deg, var(--forest), var(--lime));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    cursor: pointer; display: flex; align-items: center; gap: 10px; }
  .nav-logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, var(--emerald), var(--lime));
    border-radius: 10px; display: grid; place-items: center; color: white; font-size: 18px; flex-shrink: 0; }
  .nav-links { display: flex; align-items: center; gap: 6px; }
  .nav-link { padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;
    color: var(--graphite); cursor: pointer; transition: var(--transition); border: none; background: none; }
  .nav-link:hover { background: var(--sage); color: var(--emerald); }
  .nav-link.active { background: var(--sage); color: var(--forest); font-weight: 600; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px;
    border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer;
    border: none; transition: var(--transition); font-family: 'DM Sans', sans-serif; }
  .btn-primary { background: linear-gradient(135deg, var(--forest), var(--emerald));
    color: white; box-shadow: 0 4px 16px rgba(26,71,49,0.3); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,71,49,0.4); }
  .btn-outline { background: transparent; border: 2px solid var(--emerald); color: var(--emerald); }
  .btn-outline:hover { background: var(--emerald); color: white; transform: translateY(-2px); }
  .btn-lime { background: linear-gradient(135deg, var(--lime), #52b153); color: white;
    box-shadow: 0 4px 16px rgba(106,191,105,0.35); }
  .btn-lime:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(106,191,105,0.45); }
  .btn-sm { padding: 7px 16px; font-size: 13px; border-radius: 10px; }
  .btn-lg { padding: 16px 36px; font-size: 16px; border-radius: 16px; }

  /* Hero */
  .hero { min-height: 100vh; background: linear-gradient(160deg, #0d2b1e 0%, #1a4731 40%, #2d7a4f 100%);
    display: flex; align-items: center; position: relative; overflow: hidden; padding: 100px 48px 60px; }
  .hero-bg-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .hero-content { max-width: 680px; position: relative; z-index: 2; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(106,191,105,0.15);
    border: 1px solid rgba(106,191,105,0.3); border-radius: 100px; padding: 6px 16px 6px 10px;
    color: var(--mint); font-size: 13px; font-weight: 500; margin-bottom: 28px; }
  .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); animation: pulse 1.5s infinite; }
  .hero h1 { font-size: clamp(42px, 5vw, 72px); font-weight: 800; line-height: 1.08;
    color: white; margin-bottom: 24px; letter-spacing: -1.5px; }
  .hero h1 span { background: linear-gradient(135deg, var(--lime), var(--mint));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { font-size: 18px; color: rgba(255,255,255,0.72); line-height: 1.7; margin-bottom: 40px; max-width: 520px; }
  .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 60px; }
  .hero-visual { position: absolute; right: 48px; top: 50%; transform: translateY(-50%);
    width: min(520px, 42vw); pointer-events: none; }
  .hero-stats { display: flex; gap: 32px; flex-wrap: wrap; }
  .hero-stat { }
  .hero-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    color: var(--lime); line-height: 1; }
  .hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .hero-stat-divider { width: 1px; background: rgba(255,255,255,0.15); }

  /* Section */
  .section { padding: 96px 48px; }
  .section-sm { padding: 64px 48px; }
  .container { max-width: 1280px; margin: 0 auto; }
  .section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
    color: var(--emerald); margin-bottom: 12px; }
  .section-title { font-size: clamp(28px, 3vw, 44px); font-weight: 800; color: var(--forest);
    margin-bottom: 16px; letter-spacing: -0.5px; line-height: 1.15; }
  .section-sub { font-size: 16px; color: var(--muted); max-width: 560px; line-height: 1.7; }

  /* Cards */
  .card { background: white; border-radius: var(--radius); border: 1px solid rgba(26,71,49,0.08);
    overflow: hidden; transition: var(--transition); box-shadow: var(--shadow); }
  .card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
  .card-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: var(--sage); 
    display: grid; place-items: center; font-size: 48px; }
  .card-body { padding: 20px; }
  .card-tag { display: inline-flex; align-items: center; gap: 6px; background: var(--sage);
    color: var(--emerald); font-size: 12px; font-weight: 600; padding: 4px 10px;
    border-radius: 100px; margin-bottom: 10px; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
    color: var(--charcoal); margin-bottom: 6px; line-height: 1.3; }
  .card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .card-price { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--forest); }
  .card-price-unit { font-size: 13px; font-weight: 400; color: var(--muted); }
  .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px;
    border-top: 1px solid var(--sage); margin-top: 14px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 100px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #e8f5e9; color: #2e7d32; }
  .badge-amber { background: #fff8e1; color: #f57f17; }
  .badge-blue { background: #e3f2fd; color: #1565c0; }
  .badge-earth { background: #fdf3e3; color: var(--earth); }

  /* Grid */
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 24px; }

  /* Category chips */
  .cat-chip { display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 24px 20px; border-radius: var(--radius); border: 2px solid transparent;
    background: white; cursor: pointer; transition: var(--transition); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  .cat-chip:hover, .cat-chip.active { border-color: var(--emerald); background: var(--sage); }
  .cat-chip-icon { width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center;
    font-size: 26px; }
  .cat-chip-label { font-size: 13px; font-weight: 600; color: var(--graphite); text-align: center; }

  /* Stats bar */
  .stats-bar { background: linear-gradient(135deg, var(--forest), #0d2b1e);
    padding: 48px; border-radius: 24px; display: flex; gap: 0; overflow: hidden; }
  .stat-item { flex: 1; text-align: center; padding: 0 32px; position: relative; }
  .stat-item:not(:last-child)::after { content: ''; position: absolute; right: 0; top: 20%;
    height: 60%; width: 1px; background: rgba(255,255,255,0.15); }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800;
    background: linear-gradient(135deg, var(--lime), var(--mint));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
  .stat-label { font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 8px; }

  /* Pricing card */
  .price-card { background: white; border-radius: var(--radius); padding: 24px;
    border: 1px solid rgba(26,71,49,0.1); box-shadow: var(--shadow); }
  .price-change-up { color: #2e7d32; font-size: 13px; font-weight: 600; }
  .price-change-down { color: #c62828; font-size: 13px; font-weight: 600; }
  .price-sparkline { height: 60px; margin: 16px 0; position: relative; overflow: hidden; }
  .sparkline-bar { position: absolute; bottom: 0; width: 10px; border-radius: 3px 3px 0 0;
    background: linear-gradient(180deg, var(--lime), var(--emerald)); transition: height 0.5s ease; }

  /* Dashboard */
  .dash-sidebar { width: 240px; background: linear-gradient(180deg, var(--forest), #0d2b1e);
    min-height: calc(100vh - 68px); padding: 32px 0; flex-shrink: 0; }
  .dash-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px;
    color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; cursor: pointer;
    transition: var(--transition); border-left: 3px solid transparent; }
  .dash-nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
  .dash-nav-item.active { background: rgba(106,191,105,0.15); color: var(--lime);
    border-left-color: var(--lime); }
  .dash-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center;
    font-size: 18px; }
  .metric-card { background: white; border-radius: var(--radius); padding: 24px;
    border: 1px solid rgba(26,71,49,0.08); box-shadow: var(--shadow); }
  .metric-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: var(--forest); line-height: 1; }
  .metric-label { font-size: 13px; color: var(--muted); margin-top: 6px; }
  .metric-delta { display: inline-flex; align-items: center; gap: 4px; font-size: 12px;
    font-weight: 600; padding: 3px 8px; border-radius: 100px; margin-top: 10px; }
  .delta-up { background: #e8f5e9; color: #2e7d32; }
  .delta-down { background: #ffebee; color: #c62828; }

  /* Chart bars */
  .chart-bars { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding: 0 4px; }
  .chart-bar { flex: 1; border-radius: 6px 6px 0 0; transition: var(--transition);
    background: linear-gradient(180deg, var(--lime), var(--emerald)); opacity: 0.85; }
  .chart-bar:hover { opacity: 1; transform: scaleY(1.03); transform-origin: bottom; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--sage); color: var(--forest); font-family: 'Syne', sans-serif;
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
    padding: 12px 16px; text-align: left; }
  td { padding: 14px 16px; border-bottom: 1px solid var(--sage); font-size: 14px; color: var(--graphite); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--sage); }

  /* Footer */
  .footer { background: linear-gradient(180deg, #0d2b1e, #081a10); color: rgba(255,255,255,0.7);
    padding: 80px 48px 40px; }
  .footer-logo { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    background: linear-gradient(135deg, var(--lime), var(--mint));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 60px; }
  .footer-col h4 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    color: white; margin-bottom: 20px; letter-spacing: 0.5px; }
  .footer-link { display: block; color: rgba(255,255,255,0.55); font-size: 14px; margin-bottom: 12px;
    cursor: pointer; transition: var(--transition); }
  .footer-link:hover { color: var(--lime); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px;
    display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .footer-social { display: flex; gap: 12px; }
  .social-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
    display: grid; place-items: center; cursor: pointer; transition: var(--transition); }
  .social-btn:hover { background: rgba(106,191,105,0.2); border-color: var(--lime); }

  /* Tabs */
  .tabs { display: flex; gap: 4px; background: var(--sage); padding: 4px; border-radius: 12px; margin-bottom: 32px; width: fit-content; }
  .tab { padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: var(--transition); color: var(--muted); border: none; background: none; }
  .tab.active { background: white; color: var(--forest); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

  /* Input */
  .input { width: 100%; padding: 12px 16px; border: 2px solid var(--sage);
    border-radius: 12px; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--charcoal); background: white; outline: none; transition: var(--transition); }
  .input:focus { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(45,122,79,0.1); }
  .input::placeholder { color: var(--muted); }
  .input-group { margin-bottom: 20px; }
  .input-label { font-size: 13px; font-weight: 600; color: var(--graphite); margin-bottom: 8px; display: block; }

  /* Search bar */
  .search-bar { display: flex; align-items: center; gap: 12px; background: white;
    border: 2px solid var(--sage); border-radius: 16px; padding: 8px 8px 8px 20px;
    box-shadow: var(--shadow); transition: var(--transition); }
  .search-bar:focus-within { border-color: var(--emerald); box-shadow: 0 0 0 4px rgba(45,122,79,0.1); }
  .search-input { flex: 1; border: none; outline: none; font-size: 15px;
    font-family: 'DM Sans', sans-serif; color: var(--charcoal); background: transparent; }

  /* Toast */
  .toast { position: fixed; bottom: 32px; right: 32px; z-index: 1000;
    background: var(--forest); color: white; padding: 14px 22px; border-radius: 14px;
    font-size: 14px; box-shadow: var(--shadow-lg); display: flex; align-items: center; gap: 10px;
    animation: fadeUp 0.4s ease both; }

  /* Testimonial */
  .testimonial-card { background: white; border-radius: var(--radius); padding: 32px;
    border: 1px solid rgba(26,71,49,0.08); box-shadow: var(--shadow); position: relative; }
  .testimonial-card::before { content: '"'; position: absolute; top: 16px; left: 24px;
    font-size: 80px; color: var(--sage); font-family: 'Syne', sans-serif;
    line-height: 1; pointer-events: none; }
  .star { color: #f59e0b; font-size: 14px; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--emerald), var(--lime));
    display: grid; place-items: center; color: white; font-weight: 700; font-size: 16px; flex-shrink: 0; }

  /* Modal overlay */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px); z-index: 200; display: grid; place-items: center; padding: 24px;
    animation: fadeIn 0.3s ease; }
  .modal { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 520px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.25); animation: fadeUp 0.4s ease; max-height: 90vh; overflow-y: auto; }

  /* Eco badge */
  .eco-badge { display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, var(--sage), #d4edda);
    border: 1px solid rgba(45,122,79,0.2); color: var(--forest);
    font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px;
    text-transform: uppercase; letter-spacing: 0.5px; }

  /* Progress bar */
  .progress-bar { height: 8px; border-radius: 4px; background: var(--sage); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px;
    background: linear-gradient(90deg, var(--emerald), var(--lime)); transition: width 1s ease; }

  /* Toggle */
  .toggle { display: flex; align-items: center; gap: 8px; cursor: pointer; }
  .toggle-track { width: 44px; height: 24px; border-radius: 12px; background: var(--sage);
    position: relative; transition: var(--transition); }
  .toggle-track.on { background: var(--emerald); }
  .toggle-thumb { position: absolute; width: 18px; height: 18px; border-radius: 50%;
    background: white; top: 3px; left: 3px; transition: var(--transition);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  .toggle-track.on .toggle-thumb { left: 23px; }

  /* Responsive helpers */
  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .nav-links { display: none; }
    .hero { padding: 90px 20px 60px; }
    .hero-visual { display: none; }
    .section { padding: 64px 20px; }
    .section-sm { padding: 48px 20px; }
    .stats-bar { flex-direction: column; gap: 32px; }
    .stat-item::after { display: none; }
    .footer { padding: 60px 20px 32px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
    .dash-sidebar { width: 200px; }
    .grid-2 { grid-template-columns: 1fr; }
  }
`;

// Inject global CSS
const styleTag = document.createElement("style");
styleTag.textContent = CSS;
document.head.appendChild(styleTag);

// ── Data ──────────────────────────────────────────────────────────────────
const WASTE_LISTINGS = [
  { id: 1, name: "HDPE Plastic Bales", cat: "Plastic Waste", price: 18, prev: 16, qty: 500, minQty: 50, grade: "A", emoji: "🧴", desc: "Clean, sorted HDPE plastic bales ready for processing. Excellent purity.", seller: "EcoPlast Pvt Ltd", city: "Mumbai", inStock: true },
  { id: 2, name: "Mild Steel Scrap", cat: "Metal Scrap", price: 34, prev: 37, qty: 2000, minQty: 100, grade: "B+", emoji: "🔩", desc: "Industrial grade mild steel scrap from manufacturing units. Well sorted.", seller: "MetalKraft India", city: "Pune", inStock: true },
  { id: 3, name: "OCC Cardboard", cat: "Paper Waste", price: 9, prev: 8, qty: 1200, minQty: 200, grade: "A", emoji: "📦", desc: "Old corrugated containers, dry and baled. High fibre content.", seller: "PaperCycle Hub", city: "Delhi", inStock: true },
  { id: 4, name: "Mixed E-Waste", cat: "E-Waste", price: 45, prev: 42, qty: 300, minQty: 20, grade: "Mixed", emoji: "💻", desc: "PCBs, cables, defunct electronics. Certified recycler pickup available.", seller: "TechReclaim", city: "Bengaluru", inStock: false },
  { id: 5, name: "Clear Glass Cullet", cat: "Glass Waste", price: 7, prev: 7.5, qty: 3000, minQty: 500, grade: "A", emoji: "🪟", desc: "Crushed clear glass cullet, washed and sorted. Ideal for furnaces.", seller: "GlassLoop Co", city: "Chennai", inStock: true },
  { id: 6, name: "Green Organic Compost", cat: "Organic Waste", price: 5, prev: 4.5, qty: 5000, minQty: 100, grade: "A+", emoji: "🌿", desc: "Processed organic waste, ready for composting. Zero contamination.", seller: "BioGreen Farms", city: "Hyderabad", inStock: true },
];

const RECYCLED_PRODUCTS = [
  { id: 1, name: "Upcycled Teak Chair", price: 4800, rating: 4.8, reviews: 124, material: "Wood Scrap + Steel", impact: "12kg CO₂ saved", emoji: "🪑", badge: "Best Seller", stock: 8 },
  { id: 2, name: "Plastic Bottle Planter Set", price: 649, rating: 4.6, reviews: 287, material: "HDPE Plastic", impact: "3kg CO₂ saved", emoji: "🌱", badge: "Eco Pick", stock: 45 },
  { id: 3, name: "Recycled Denim Tote Bag", price: 899, rating: 4.7, reviews: 98, material: "Textile Waste", impact: "2kg CO₂ saved", emoji: "👜", badge: "Handmade", stock: 23 },
  { id: 4, name: "Metal Scrap Lamp", price: 2200, rating: 4.9, reviews: 56, material: "Steel Scrap", impact: "8kg CO₂ saved", emoji: "💡", badge: "Artisan", stock: 12 },
  { id: 5, name: "Newspaper Mache Bowl Set", price: 480, rating: 4.5, reviews: 173, material: "Paper Waste", impact: "1.5kg CO₂ saved", emoji: "🥣", badge: "New", stock: 60 },
  { id: 6, name: "Eco Packaging Bundle", price: 1299, rating: 4.8, reviews: 210, material: "Mixed Recycled", impact: "5kg CO₂ saved", emoji: "📦", badge: "Bulk Deal", stock: 200 },
];

const CATEGORIES = [
  { label: "Plastic Waste", emoji: "🧴", color: "#e3f2fd" },
  { label: "Metal Scrap", emoji: "🔩", color: "#fce4ec" },
  { label: "Paper Waste", emoji: "📰", color: "#fff8e1" },
  { label: "E-Waste", emoji: "💻", color: "#ede7f6" },
  { label: "Glass Waste", emoji: "🫙", color: "#e8f5e9" },
  { label: "Organic Waste", emoji: "🌿", color: "#f1f8e9" },
  { label: "Textile Waste", emoji: "🧵", color: "#fce4ec" },
  { label: "Industrial Scrap", emoji: "🏭", color: "#fafafa" },
];

const TESTIMONIALS = [
  { name: "Ritu Sharma", role: "Waste Collector, Delhi", text: "Kabadify changed how I sell scrap. I now get 30% more per KG than local dealers, and payments are instant. Absolutely brilliant platform.", rating: 5, initial: "R" },
  { name: "Ankit Mehta", role: "Recycling Startup, Ahmedabad", text: "As a buyer, the quality grading system gave me confidence to procure remotely. Saved us ₹4 lakhs in transport by finding local suppliers.", rating: 5, initial: "A" },
  { name: "Priya Nair", role: "Eco Craft Seller, Kochi", text: "My upcycled furniture business grew 3x after listing on Kabadify. The recycled products section gets serious buyers who value sustainability.", rating: 5, initial: "P" },
];

const PRICE_HISTORY = {
  "Plastic Waste": [14, 15, 13, 16, 15, 17, 18],
  "Metal Scrap": [32, 35, 38, 36, 34, 33, 34],
  "Paper Waste": [7, 8, 8, 9, 8, 8, 9],
  "E-Waste": [40, 41, 43, 42, 44, 42, 45],
};

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

// ── Components ─────────────────────────────────────────────────────────────
function AnimatedNumber({ target, prefix = "", suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function SparkLine({ data }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${(v / max) * 100}%`,
          borderRadius: "4px 4px 0 0",
          background: `linear-gradient(180deg, #6abf69, #2d7a4f)`,
          opacity: i === data.length - 1 ? 1 : 0.5,
          transition: "all 0.3s"
        }} title={v} />
      ))}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="toast">
      <span>✅</span>
      <span>{msg}</span>
      <span style={{ cursor: "pointer", marginLeft: 8, opacity: 0.7 }} onClick={onClose}>✕</span>
    </div>
  );
}

// ── Pages ──────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        {/* Orbs */}
        <div className="hero-bg-orb" style={{ width: 600, height: 600, background: "rgba(106,191,105,0.12)", top: "10%", left: "-10%" }} />
        <div className="hero-bg-orb" style={{ width: 400, height: 400, background: "rgba(45,122,79,0.18)", bottom: "5%", right: "5%" }} />

        <div className="hero-content animate-fade-up">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            🌿 India's #1 Waste Marketplace
          </div>
          <h1>Transforming <span>Waste</span><br />Into Value.</h1>
          <p>Connect with verified waste sellers, buy quality scrap materials, and discover products made from recycled materials — all in one sustainable ecosystem.</p>
          <div className="hero-cta">
            <button className="btn btn-lime btn-lg" onClick={() => setPage("marketplace")}>♻️ Sell Waste</button>
            <button className="btn btn-outline btn-lg" style={{ borderColor: "rgba(106,191,105,0.5)", color: "var(--mint)" }} onClick={() => setPage("marketplace")}>🛒 Buy Waste</button>
            <button className="btn btn-lg" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }} onClick={() => setPage("recycled")}>🛍️ Recycled Products</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value"><AnimatedNumber target={48500} suffix="+" /></div>
              <div className="hero-stat-label">Tonnes Recycled</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value"><AnimatedNumber target={12400} suffix="+" /></div>
              <div className="hero-stat-label">Active Users</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value"><AnimatedNumber target={29800} suffix="t" /></div>
              <div className="hero-stat-label">CO₂ Saved</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual animate-float">
          <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="hg1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6abf69" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#1a4731" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="240" cy="240" r="200" fill="url(#hg1)"/>
            <circle cx="240" cy="240" r="140" fill="none" stroke="rgba(106,191,105,0.2)" strokeWidth="1" strokeDasharray="8 4"/>
            <circle cx="240" cy="240" r="90" fill="rgba(106,191,105,0.08)" stroke="rgba(106,191,105,0.3)" strokeWidth="1"/>
            {/* Recycling symbol */}
            <text x="240" y="260" textAnchor="middle" fontSize="90" fill="rgba(106,191,105,0.7)">♻️</text>
            {/* Orbiting dots */}
            {[0,60,120,180,240,300].map((deg,i) => {
              const rad = (deg * Math.PI) / 180;
              return <circle key={i} cx={240 + 140 * Math.cos(rad)} cy={240 + 140 * Math.sin(rad)} r="6" fill="#6abf69" opacity="0.7" />;
            })}
            {/* Category bubbles */}
            {[{ x:90,y:120,e:"🧴",l:"Plastic" },{x:380,y:100,e:"🔩",l:"Metal"},{x:60,y:340,e:"📦",l:"Paper"},{x:380,y:360,e:"💻",l:"E-Waste"}].map((b,i) => (
              <g key={i}>
                <circle cx={b.x} cy={b.y} r="42" fill="rgba(255,255,255,0.1)" stroke="rgba(106,191,105,0.4)" strokeWidth="1.5"/>
                <text x={b.x} y={b.y-4} textAnchor="middle" fontSize="22">{b.e}</text>
                <text x={b.x} y={b.y+16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)" fontFamily="DM Sans">{b.l}</text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="section-sm" style={{ background: "white" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label">Browse by Category</div>
            <h2 className="section-title" style={{ margin: "0 auto" }}>What Are You Looking For?</h2>
          </div>
          <div className="grid-4">
            {CATEGORIES.map(c => (
              <div key={c.label} className="cat-chip" onClick={() => setPage("marketplace")}
                style={{ background: c.color }}>
                <div className="cat-chip-icon" style={{ background: "white" }}>{c.emoji}</div>
                <div className="cat-chip-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className="stats-bar">
            {[
              { num: "48,500+", label: "Tonnes of Waste Recycled" },
              { num: "29,800t", label: "CO₂ Emissions Prevented" },
              { num: "12,400+", label: "Registered Users" },
              { num: "₹8.2Cr+", label: "Total Transactions" },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section" style={{ background: "var(--sage)", paddingTop: 0, marginTop: -32 }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div className="section-label">Waste Marketplace</div>
              <h2 className="section-title">Featured Listings</h2>
            </div>
            <button className="btn btn-outline" onClick={() => setPage("marketplace")}>View All →</button>
          </div>
          <div className="grid-3">
            {WASTE_LISTINGS.slice(0, 3).map(l => <WasteCard key={l.id} item={l} />)}
          </div>
        </div>
      </section>

      {/* Recycled Products Teaser */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <div className="section-label">Recycled Products</div>
              <h2 className="section-title">Shop Sustainable</h2>
              <p className="section-sub">Products crafted from recycled materials — beautiful, affordable, and planet-friendly.</p>
            </div>
            <button className="btn btn-outline" onClick={() => setPage("recycled")}>Explore All →</button>
          </div>
          <div className="grid-3">
            {RECYCLED_PRODUCTS.slice(0, 3).map(p => <ProductCard key={p.id} item={p} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-sm" style={{ background: "var(--forest)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label" style={{ color: "var(--lime)" }}>Testimonials</div>
            <h2 className="section-title" style={{ color: "white" }}>Loved by the Community</h2>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="testimonial-card">
                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                  {Array(t.rating).fill(0).map((_,i) => <span key={i} className="star">★</span>)}
                </div>
                <p style={{ fontSize: 15, color: "var(--graphite)", lineHeight: 1.7, marginBottom: 20, paddingTop: 8 }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar">{t.initial}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section-sm" style={{ background: "linear-gradient(135deg, var(--lime), var(--emerald))" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, color: "white", marginBottom: 16 }}>Ready to Kabadify Your Waste?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 32, fontSize: 16 }}>Join 12,000+ users already turning waste into income.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-lg" style={{ background: "white", color: "var(--forest)" }}>Start Selling Free</button>
            <button className="btn btn-lg" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.4)" }}>Learn More</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function WasteCard({ item, onAdd }) {
  const up = item.price >= item.prev;
  const pct = Math.abs(((item.price - item.prev) / item.prev) * 100).toFixed(1);
  return (
    <div className="card">
      <div className="card-img" style={{ background: "linear-gradient(135deg, var(--sage), #d4edda)", fontSize: 64 }}>
        {item.emoji}
      </div>
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span className="card-tag">{item.cat}</span>
          <span className={`badge ${item.inStock ? "badge-green" : "badge-amber"}`}>
            {item.inStock ? "In Stock" : "Low Stock"}
          </span>
        </div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc">{item.desc}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 12 }}>
          <div>
            <div className="card-price">₹{item.price} <span className="card-price-unit">/ kg</span></div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>was ₹{item.prev}/kg</div>
          </div>
          <span className={up ? "price-change-up" : "price-change-down"} style={{ marginBottom: 18 }}>
            {up ? "▲" : "▼"} {pct}%
          </span>
        </div>
        <SparkLine data={PRICE_HISTORY[item.cat] || [5,6,7,6,8,7,9]} />
        <div className="card-footer">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            📍 {item.city} · Min {item.minQty}kg · Grade {item.grade}
          </div>
          <button className="btn btn-primary btn-sm" onClick={onAdd}>Buy</button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item, onAdd }) {
  return (
    <div className="card">
      <div className="card-img" style={{ background: "linear-gradient(135deg, var(--sand), #f0e6d0)", fontSize: 64 }}>
        {item.emoji}
      </div>
      <div className="card-body">
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span className="eco-badge">♻️ {item.badge}</span>
          {item.stock < 20 && <span className="badge badge-amber">Only {item.stock} left</span>}
        </div>
        <div className="card-title">{item.name}</div>
        <div className="card-desc" style={{ fontSize: 12 }}>🌿 {item.material} · {item.impact}</div>
        <div style={{ display: "flex", gap: 4, margin: "8px 0" }}>
          {Array(5).fill(0).map((_,i) => (
            <span key={i} className="star" style={{ opacity: i < Math.floor(item.rating) ? 1 : 0.3 }}>★</span>
          ))}
          <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 4 }}>({item.reviews})</span>
        </div>
        <div className="card-footer">
          <div className="card-price">₹{item.price.toLocaleString()}</div>
          <button className="btn btn-lime btn-sm" onClick={onAdd}>🛒 Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function MarketplacePage({ toast }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const cats = ["All", ...CATEGORIES.map(c => c.label)];
  const filtered = WASTE_LISTINGS.filter(l =>
    (cat === "All" || l.cat === cat) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.cat.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : 0);

  return (
    <div className="section">
      <div className="container">
        <div className="section-label">Waste Marketplace</div>
        <h1 className="section-title">Browse & Buy Waste Materials</h1>
        <p className="section-sub" style={{ marginBottom: 40 }}>Live pricing updated by verified sellers across India.</p>

        {/* Search + filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
            <span>🔍</span>
            <input className="search-input" placeholder="Search waste, category, city…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select className="input" style={{ width: "auto", padding: "10px 16px" }} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "8px 18px", borderRadius: "100px", border: "2px solid",
              borderColor: cat === c ? "var(--emerald)" : "var(--sage)",
              background: cat === c ? "var(--emerald)" : "white",
              color: cat === c ? "white" : "var(--graphite)",
              fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s"
            }}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p>No listings match your search.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map(l => <WasteCard key={l.id} item={l} onAdd={() => toast(`Added ${l.name} to cart!`)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function RecycledPage({ toast }) {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const filtered = RECYCLED_PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="section">
      <div className="container">
        <div className="section-label">Recycled Products</div>
        <h1 className="section-title">Shop Sustainably</h1>
        <p className="section-sub" style={{ marginBottom: 40 }}>Beautiful products made from recycled and upcycled materials.</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
            <span>🔍</span>
            <input className="search-input" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          {cart.length > 0 && (
            <button className="btn btn-primary" onClick={() => toast("Proceeding to checkout…")}>
              🛒 Cart ({cart.length})
            </button>
          )}
        </div>

        <div className="grid-3">
          {filtered.map(p => (
            <ProductCard key={p.id} item={p} onAdd={() => {
              setCart(c => [...c, p.id]);
              toast(`${p.name} added to cart!`);
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingPage() {
  const [selected, setSelected] = useState("Plastic Waste");
  const data = PRICE_HISTORY[selected] || [10,11,12,11,13,12,14];
  const max = Math.max(...data);
  const current = data[data.length - 1];
  const prev = data[data.length - 2];
  const pct = (((current - prev) / prev) * 100).toFixed(1);
  const up = current >= prev;

  return (
    <div className="section">
      <div className="container">
        <div className="section-label">Live Market Prices</div>
        <h1 className="section-title">Dynamic Pricing System</h1>
        <p className="section-sub" style={{ marginBottom: 40 }}>Real-time market prices updated by sellers and admin benchmarks.</p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          {Object.keys(PRICE_HISTORY).map(c => (
            <button key={c} onClick={() => setSelected(c)} style={{
              padding: "10px 20px", borderRadius: "100px", border: "2px solid",
              borderColor: selected === c ? "var(--emerald)" : "var(--sage)",
              background: selected === c ? "var(--sage)" : "white",
              color: selected === c ? "var(--forest)" : "var(--graphite)",
              fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
            }}>{c}</button>
          ))}
        </div>

        <div className="grid-2">
          {/* Price chart */}
          <div className="price-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{selected} — Current Price</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 48, fontWeight: 800, color: "var(--forest)", lineHeight: 1 }}>₹{current}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>per kilogram</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={up ? "price-change-up" : "price-change-down"} style={{ fontSize: 22 }}>
                  {up ? "▲" : "▼"} {Math.abs(pct)}%
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>vs last month</div>
                <div style={{ marginTop: 8 }}>
                  <span className={`badge ${up ? "badge-green" : ""}`} style={!up ? { background: "#ffebee", color: "#c62828" } : {}}>
                    {up ? "Rising" : "Falling"}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
                {data.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                      <div style={{
                        width: "100%", height: `${(v / max) * 100}%`,
                        borderRadius: "6px 6px 0 0",
                        background: i === data.length - 1
                          ? "linear-gradient(180deg, #6abf69, #2d7a4f)"
                          : "linear-gradient(180deg, rgba(106,191,105,0.4), rgba(45,122,79,0.4))",
                        transition: "height 0.5s ease",
                        position: "relative"
                      }}>
                        {i === data.length - 1 && (
                          <div style={{ position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)",
                            fontSize: 11, fontWeight: 700, color: "var(--emerald)", whiteSpace: "nowrap" }}>
                            ₹{v}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 0 0", borderTop: "1px solid var(--sage)", display: "flex", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>7-Day High</div>
                <div style={{ fontWeight: 700, color: "var(--forest)" }}>₹{max}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>7-Day Low</div>
                <div style={{ fontWeight: 700, color: "var(--forest)" }}>₹{Math.min(...data)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Avg Price</div>
                <div style={{ fontWeight: 700, color: "var(--forest)" }}>₹{(data.reduce((a,b)=>a+b,0)/data.length).toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* All categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(PRICE_HISTORY).map(([cat, hist]) => {
              const cur = hist[hist.length - 1];
              const prv = hist[hist.length - 2];
              const u = cur >= prv;
              const pc = Math.abs(((cur - prv) / prv) * 100).toFixed(1);
              return (
                <div key={cat} className="price-card" style={{ padding: 18, cursor: "pointer" }}
                  onClick={() => setSelected(cat)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{cat}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Updated 2h ago</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "var(--forest)" }}>₹{cur}/kg</div>
                      <div className={u ? "price-change-up" : "price-change-down"} style={{ fontSize: 12 }}>
                        {u ? "▲" : "▼"} {pc}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SellerDashboard() {
  const [dashTab, setDashTab] = useState("overview");
  const [newPrice, setNewPrice] = useState({ Plastic: 18, Metal: 34, Paper: 9 });

  const monthlyRevenue = [120000, 145000, 132000, 168000, 155000, 192000, 178000];
  const maxRev = Math.max(...monthlyRevenue);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
      {/* Sidebar */}
      <div className="dash-sidebar">
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Seller Dashboard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar">S</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>ScrapMart</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Verified Seller</div>
            </div>
          </div>
        </div>
        {[
          { icon: "📊", label: "Overview", key: "overview" },
          { icon: "📦", label: "My Listings", key: "listings" },
          { icon: "💰", label: "Price Manager", key: "pricing" },
          { icon: "📈", label: "Analytics", key: "analytics" },
          { icon: "🛒", label: "Orders", key: "orders" },
          { icon: "⚙️", label: "Settings", key: "settings" },
        ].map(item => (
          <div key={item.key} className={`dash-nav-item ${dashTab === item.key ? "active" : ""}`}
            onClick={() => setDashTab(item.key)}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 40, background: "var(--cream)", overflowY: "auto" }}>
        {dashTab === "overview" && (
          <div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, color: "var(--forest)", marginBottom: 8 }}>Good morning, ScrapMart 👋</h2>
            <p style={{ color: "var(--muted)", marginBottom: 32 }}>Here's your performance summary.</p>

            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[
                { label: "Total Revenue", value: "₹4.8L", delta: "+18%", up: true, icon: "💰" },
                { label: "Active Listings", value: "12", delta: "+3", up: true, icon: "📦" },
                { label: "Total Orders", value: "284", delta: "+24%", up: true, icon: "🛒" },
                { label: "CO₂ Saved", value: "2.4t", delta: "+0.3t", up: true, icon: "🌿" },
              ].map(m => (
                <div key={m.label} className="metric-card">
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{m.icon}</div>
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                  <div className={`metric-delta ${m.up ? "delta-up" : "delta-down"}`}>
                    {m.up ? "▲" : "▼"} {m.delta} this month
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="metric-card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: 24, color: "var(--forest)" }}>Monthly Revenue (₹)</h3>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
                {monthlyRevenue.map((v, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                      <div style={{
                        width: "100%", height: `${(v / maxRev) * 100}%`,
                        borderRadius: "8px 8px 0 0",
                        background: i === monthlyRevenue.length - 1
                          ? "linear-gradient(180deg, var(--lime), var(--emerald))"
                          : "linear-gradient(180deg, rgba(106,191,105,0.35), rgba(45,122,79,0.35))",
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="metric-card">
              <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: 20, color: "var(--forest)" }}>Recent Orders</h3>
              <table>
                <thead><tr>
                  <th>Order ID</th><th>Waste Type</th><th>Quantity</th><th>Amount</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {[
                    { id: "#KBD-1042", type: "HDPE Plastic", qty: "200 kg", amt: "₹3,600", status: "Delivered" },
                    { id: "#KBD-1041", type: "MS Scrap", qty: "500 kg", amt: "₹17,000", status: "In Transit" },
                    { id: "#KBD-1040", type: "OCC Cardboard", qty: "300 kg", amt: "₹2,700", status: "Processing" },
                    { id: "#KBD-1039", type: "Clear Glass", qty: "800 kg", amt: "₹5,600", status: "Delivered" },
                  ].map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600, color: "var(--emerald)" }}>{o.id}</td>
                      <td>{o.type}</td>
                      <td>{o.qty}</td>
                      <td style={{ fontWeight: 700 }}>{o.amt}</td>
                      <td><span className={`badge ${o.status === "Delivered" ? "badge-green" : o.status === "In Transit" ? "badge-blue" : "badge-amber"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {dashTab === "pricing" && (
          <div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, color: "var(--forest)", marginBottom: 8 }}>Price Manager</h2>
            <p style={{ color: "var(--muted)", marginBottom: 32 }}>Update your listing prices in real-time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.entries(newPrice).map(([cat, price]) => (
                <div key={cat} className="metric-card" style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{cat} Waste</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>Current: ₹{price}/kg</div>
                  </div>
                  <SparkLine data={PRICE_HISTORY[cat + " Waste"] || [8,9,10,9,11,10,price]} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button style={{ width: 36, height: 36, borderRadius: 10, border: "2px solid var(--sage)", background: "white", cursor: "pointer", fontSize: 18, fontWeight: 700 }}
                      onClick={() => setNewPrice(p => ({ ...p, [cat]: Math.max(1, p[cat] - 1) }))}>−</button>
                    <input type="number" value={price} onChange={e => setNewPrice(p => ({ ...p, [cat]: +e.target.value }))}
                      style={{ width: 80, textAlign: "center", padding: "8px", border: "2px solid var(--emerald)", borderRadius: 10, fontWeight: 700, fontSize: 16, fontFamily: "'Syne', sans-serif", outline: "none" }} />
                    <button style={{ width: 36, height: 36, borderRadius: 10, border: "2px solid var(--sage)", background: "white", cursor: "pointer", fontSize: 18, fontWeight: 700 }}
                      onClick={() => setNewPrice(p => ({ ...p, [cat]: p[cat] + 1 }))}>+</button>
                    <span style={{ fontSize: 14, color: "var(--muted)" }}>/kg</span>
                  </div>
                  <button className="btn btn-primary btn-sm">Update Price</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {dashTab === "listings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, color: "var(--forest)", marginBottom: 4 }}>My Listings</h2>
                <p style={{ color: "var(--muted)" }}>Manage all your waste material listings.</p>
              </div>
              <button className="btn btn-primary">+ Add Listing</button>
            </div>
            <div className="grid-3">
              {WASTE_LISTINGS.slice(0,3).map(l => <WasteCard key={l.id} item={l} />)}
            </div>
          </div>
        )}

        {(dashTab === "analytics" || dashTab === "orders" || dashTab === "settings") && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>
              {dashTab === "analytics" ? "📈" : dashTab === "orders" ? "🛒" : "⚙️"}
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", color: "var(--forest)", marginBottom: 12 }}>
              {dashTab.charAt(0).toUpperCase() + dashTab.slice(1)}
            </h2>
            <p style={{ color: "var(--muted)" }}>This section is fully functional in the production build.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 68px)" }}>
      <div className="dash-sidebar">
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Admin Panel</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ background: "linear-gradient(135deg, #c4a265, #8b6914)" }}>A</div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>Admin</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Super Admin</div>
            </div>
          </div>
        </div>
        {["🏠 Overview","👥 Users","📋 Listings","💸 Transactions","♻️ Metrics","⚙️ Settings"].map(i => (
          <div key={i} className={`dash-nav-item ${i.startsWith("🏠") ? "active" : ""}`}>{i}</div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 40, background: "var(--cream)", overflowY: "auto" }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, color: "var(--forest)", marginBottom: 8 }}>Admin Overview</h2>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>Platform-wide statistics and management.</p>

        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: "Total Users", value: "12,418", delta: "+342 this month", icon: "👥" },
            { label: "Active Listings", value: "3,284", delta: "+128 pending", icon: "📋" },
            { label: "Total Revenue", value: "₹8.2Cr", delta: "+22% YoY", icon: "💰" },
            { label: "Waste Recycled", value: "48,500t", delta: "+1,200t this month", icon: "♻️" },
          ].map(m => (
            <div key={m.label} className="metric-card">
              <div style={{ fontSize: 28, marginBottom: 12 }}>{m.icon}</div>
              <div className="metric-value" style={{ fontSize: 26 }}>{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-delta delta-up" style={{ marginTop: 8 }}>▲ {m.delta}</div>
            </div>
          ))}
        </div>

        {/* Sustainability Metrics */}
        <div className="metric-card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", color: "var(--forest)", marginBottom: 24 }}>Sustainability Impact</h3>
          {[
            { label: "Plastic Recycled", value: 18400, max: 25000, unit: "t" },
            { label: "Metal Recycled", value: 14200, max: 20000, unit: "t" },
            { label: "Paper Recycled", value: 9800, max: 15000, unit: "t" },
            { label: "CO₂ Saved", value: 29800, max: 40000, unit: "t" },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</span>
                <span style={{ fontSize: 14, color: "var(--emerald)", fontWeight: 700 }}>{m.value.toLocaleString()}{m.unit} / {m.max.toLocaleString()}{m.unit}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(m.value/m.max)*100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="metric-card">
          <h3 style={{ fontFamily: "'Syne',sans-serif", color: "var(--forest)", marginBottom: 20 }}>Recent Users</h3>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>City</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {[
                { name: "Ritu Sharma", role: "Seller", city: "Delhi", joined: "10 May 2026", status: "Active" },
                { name: "Ankit Mehta", role: "Buyer", city: "Ahmedabad", joined: "9 May 2026", status: "Active" },
                { name: "Priya Nair", role: "Seller", city: "Kochi", joined: "8 May 2026", status: "Pending" },
                { name: "Raj Kumar", role: "Buyer", city: "Mumbai", joined: "7 May 2026", status: "Active" },
              ].map(u => (
                <tr key={u.name}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{u.name[0]}</div>{u.name}</div></td>
                  <td><span className={`badge ${u.role === "Seller" ? "badge-earth" : "badge-blue"}`}>{u.role}</span></td>
                  <td>{u.city}</td>
                  <td style={{ color: "var(--muted)", fontSize: 13 }}>{u.joined}</td>
                  <td><span className={`badge ${u.status === "Active" ? "badge-green" : "badge-amber"}`}>{u.status}</span></td>
                  <td><button className="btn btn-outline btn-sm">Manage</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ setPage }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("buyer");
  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "linear-gradient(135deg, var(--sage), var(--cream))", display: "grid", placeItems: "center", padding: 40 }}>
      <div style={{ width: "100%", maxWidth: 460, background: "white", borderRadius: 24, padding: 48, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>♻️</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, color: "var(--forest)", marginBottom: 8 }}>
            {mode === "login" ? "Welcome back!" : "Join Kabadify"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {mode === "login" ? "Sign in to your account" : "Create your free account today"}
          </p>
        </div>

        <div className="tabs" style={{ width: "100%", marginBottom: 24 }}>
          <button className={`tab ${mode === "login" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setMode("login")}>Sign In</button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setMode("register")}>Register</button>
        </div>

        {mode === "register" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["buyer","seller","admin"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{
                flex: 1, padding: "10px 0", border: "2px solid",
                borderColor: role === r ? "var(--emerald)" : "var(--sage)",
                background: role === r ? "var(--sage)" : "white",
                borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer",
                color: role === r ? "var(--forest)" : "var(--muted)", transition: "all 0.2s"
              }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
            ))}
          </div>
        )}

        {mode === "register" && (
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input" placeholder="Your name" />
          </div>
        )}
        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input className="input" type="email" placeholder="you@example.com" />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input" type="password" placeholder="••••••••" />
        </div>

        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 16, padding: "14px" }}
          onClick={() => {
            if (role === "seller") setPage("seller-dash");
            else if (role === "admin") setPage("admin-dash");
            else setPage("home");
          }}>
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <div style={{ position: "relative", textAlign: "center", margin: "20px 0" }}>
          <div style={{ height: 1, background: "var(--sage)", position: "absolute", left: 0, right: 0, top: "50%" }} />
          <span style={{ background: "white", padding: "0 12px", color: "var(--muted)", fontSize: 13, position: "relative" }}>or continue with</span>
        </div>

        <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          🌐 Continue with Google
        </button>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <section className="section" style={{ background: "linear-gradient(160deg, var(--forest), var(--emerald))", color: "white" }}>
        <div className="container">
          <div className="section-label" style={{ color: "var(--lime)" }}>About Kabadify</div>
          <h1 className="section-title" style={{ color: "white", maxWidth: 640 }}>Building India's Circular Economy, One Transaction at a Time.</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", maxWidth: 560, lineHeight: 1.8 }}>
            Kabadify is a tech-first platform connecting waste generators with responsible recyclers, and promoting products made from recycled materials — creating a sustainable loop of value.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {[
              { icon: "🌍", title: "Our Mission", text: "To digitize India's informal waste economy, creating fair prices, transparent transactions, and measurable environmental impact." },
              { icon: "🔄", title: "Circular Economy", text: "We believe in keeping materials in use for as long as possible — reducing waste, preventing pollution, and regenerating natural systems." },
              { icon: "🤝", title: "Community First", text: "Empowering waste collectors, small recyclers, and eco-entrepreneurs with technology that was previously only available to large corporations." },
            ].map(c => (
              <div key={c.title} className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{c.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: "var(--forest)", marginBottom: 12 }}>{c.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const showToast = (msg) => setToast(msg);

  const navLinks = [
    { label: "Home", key: "home" },
    { label: "Marketplace", key: "marketplace" },
    { label: "Recycled Products", key: "recycled" },
    { label: "Live Prices", key: "pricing" },
    { label: "About", key: "about" },
  ];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          <div className="nav-logo-icon">♻</div>
          Kabadify
        </div>
        <div className="nav-links">
          {navLinks.map(l => (
            <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => setPage(l.key)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn btn-outline btn-sm" onClick={() => setPage("seller-dash")}>📊 Dashboard</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPage("login")}>Sign In</button>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ paddingTop: 68 }}>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "marketplace" && <MarketplacePage toast={showToast} />}
        {page === "recycled" && <RecycledPage toast={showToast} />}
        {page === "pricing" && <PricingPage />}
        {page === "about" && <AboutPage />}
        {page === "seller-dash" && <SellerDashboard />}
        {page === "admin-dash" && <AdminDashboard />}
        {page === "login" && <LoginPage setPage={setPage} />}
      </div>

      {/* Footer */}
      {!["seller-dash","admin-dash"].includes(page) && (
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <div className="footer-logo">♻ Kabadify</div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
                  India's leading digital marketplace for waste trading and recycled products. Building a sustainable circular economy.
                </p>
                <div className="footer-social" style={{ marginTop: 24 }}>
                  {["𝕏","in","f","▶"].map(s => (
                    <div key={s} className="social-btn" style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{s}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4>Marketplace</h4>
                {["Buy Waste","Sell Waste","Recycled Products","Live Prices","Categories"].map(l => <div key={l} className="footer-link">{l}</div>)}
              </div>
              <div>
                <h4>Platform</h4>
                {["About Us","How It Works","Seller Guide","Buyer Guide","Blog"].map(l => <div key={l} className="footer-link">{l}</div>)}
              </div>
              <div>
                <h4>Support</h4>
                {["Contact Us","Help Centre","Privacy Policy","Terms of Service","Careers"].map(l => <div key={l} className="footer-link">{l}</div>)}
              </div>
            </div>
            <div className="footer-bottom">
              <div>© 2026 Kabadify Pvt Ltd. All rights reserved.</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--lime)", animation: "pulse 1.5s infinite" }} />
                <span style={{ color: "var(--lime)", fontSize: 13 }}>All systems operational</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
