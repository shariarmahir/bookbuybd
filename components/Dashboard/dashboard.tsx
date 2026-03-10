'use client';
import { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════ DATA ═══════════════════════════════ */
const D = {
    total_revenue: 1800.00, total_orders: 2, pending_orders: 1,
    confirmed_orders: 1, rejected_orders: 0, pending_deliveries: 2,
    processing_deliveries: 0, shipped_deliveries: 0,
    delivered_deliveries: 0, cancelled_deliveries: 0,
    total_books: 3, active_books: 3, in_stock_books: 3,
    out_of_stock_books: 0, low_stock_books: 1,
};
const REVENUE_MONTHLY = [820, 940, 1100, 870, 1340, 1560, 1200, 1680, 1450, 1720, 1590, 1800];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const RETENTION = {
    smes: [55, 60, 45, 70, 65, 80, 55, 75, 85, 90, 78, 88],
    startups: [70, 80, 60, 85, 75, 90, 70, 85, 95, 88, 92, 96],
    enterprises: [80, 90, 70, 95, 85, 100, 80, 92, 100, 95, 98, 100],
};
const LOCATIONS = [
    { country: 'Australia', flag: '🇦🇺', pct: 48 },
    { country: 'Malaysia', flag: '🇲🇾', pct: 33 },
    { country: 'Indonesia', flag: '🇮🇩', pct: 25 },
    { country: 'Singapore', flag: '🇸🇬', pct: 17 },
    { country: 'Philippines', flag: '🇵🇭', pct: 10 },
];
const BOOKS_DATA = [
    { id: 1, title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', stock: 12, price: 29.99, status: 'active', orders: 18 },
    { id: 2, title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', stock: 3, price: 24.99, status: 'active', orders: 14 },
    { id: 3, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', stock: 8, price: 19.99, status: 'active', orders: 22 },
];
const ORDERS_DATA = [
    { id: '#ORD-001', customer: 'Amir Hassan', book: 'The Lean Startup', date: 'Mar 6, 2025', amount: 29.99, status: 'confirmed', delivery: 'pending' },
    { id: '#ORD-002', customer: 'Sarah Kim', book: 'Atomic Habits', date: 'Mar 5, 2025', amount: 19.99, status: 'pending', delivery: 'pending' },
];
const NOTIFICATIONS_INIT = [
    { id: 1, type: 'order', msg: 'New order #ORD-002 received', time: '2m ago', read: false },
    { id: 2, type: 'stock', msg: 'Atomic Habits stock running low', time: '1h ago', read: false },
    { id: 3, type: 'system', msg: 'Dashboard data refreshed', time: '3h ago', read: true },
    { id: 4, type: 'order', msg: 'Order #ORD-001 confirmed', time: '5h ago', read: true },
];

/* ═══════════════════════════════ ICONS ═══════════════════════════════ */
const Sv = (d: string, sw = 1.8) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className="w-4 h-4"><path d={d} /></svg>;
const Ico = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    deals: Sv("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"),
    notes: Sv("M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"),
    inbox: Sv("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
    reports: Sv("M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"),
    workflows: Sv("M4 6h16M4 10h16M4 14h16M4 18h16"),
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>,
    help: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
    bell: Sv("M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"),
    chevD: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M19 9l-7 7-7-7" /></svg>,
    chevR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path d="M9 18l6-6-6-6" /></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><path d="M12 5v14M5 12h14" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><path d="M20 6L9 17l-5-5" /></svg>,
    book: Sv("M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 17V5a2 2 0 012-2h14v14H6.5"),
    truck: Sv("M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m0 0h4l2 4v5h-6m0 0a2 2 0 11-4 0m4 0a2 2 0 01-4 0M3 12h12"),
    moon: Sv("M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"),
    sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>,
    users: Sv("M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"),
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    clock: Sv("M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z"),
    export: Sv("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"),
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    folder: Sv("M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"),
    cloud: Sv("M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"),
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12" /></svg>,
    warn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>,
    refresh: Sv("M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"),
    msg: Sv("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"),
    package: Sv("M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"),
    trend: Sv("M23 6l-9.5 9.5-5-5L1 18"),
    percent: Sv("M19 5L5 19M6.5 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM17.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"),
    edit: Sv("M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"),
    camera: Sv("M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z"),
    save: Sv("M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8"),
    shield: Sv("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
    credit: Sv("M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"),
    team: Sv("M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"),
    dots: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>,
};

/* ═══════════════════════════════ HELPERS ═══════════════════════════════ */
function AnimCount({ to, prefix = '', suffix = '', dec = 0, dur = 1200 }: { to: number; prefix?: string; suffix?: string; dec?: number; dur?: number }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        const t0 = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
            setV(e * to); if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [to]);
    return <>{prefix}{v.toFixed(dec)}{suffix}</>;
}

function Sparkline({ data, color = '#3b82f6', h = 28 }: { data: number[]; color?: string; h?: number }) {
    const w = 80, mx = Math.max(...data), mn = Math.min(...data);
    const pts = data.map((v, i) => [i / (data.length - 1) * w, h - ((v - mn) / (mx - mn || 1)) * (h - 4) - 2]);
    const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
    const area = path + ` L${w},${h} L0,${h} Z`;
    const id = `sg${color.replace(/[^a-z0-9]/gi, '')}`;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-16" preserveAspectRatio="none">
            <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
            <path d={area} fill={`url(#${id})`} /><path d={path} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

function Ring({ pct, color, size = 48, stroke = 5 }: { pct: number; color: string; size?: number; stroke?: number }) {
    const r = (size - stroke * 2) / 2, circ = 2 * Math.PI * r;
    const [off, setOff] = useState(circ);
    useEffect(() => { setTimeout(() => setOff(circ * (1 - pct / 100)), 400); }, [pct, circ]);
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
    );
}

function Toggle({ v, onChange }: { v: boolean; onChange: (b: boolean) => void }) {
    return (
        <button onClick={() => onChange(!v)}
            className={`w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0 ${v ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300"
                style={{ left: v ? 'calc(100% - 1.125rem)' : '0.125rem' }} />
        </button>
    );
}

/* ═══════════════════════════════ REVENUE CHART ═══════════════════════════════ */
function RevenueChart({ dark }: { dark: boolean }) {
    const [range, setRange] = useState('1Y');
    const [anim, setAnim] = useState(false);
    const [hover, setHover] = useState<number | null>(null);
    useEffect(() => { setTimeout(() => setAnim(true), 400); }, []);
    const slices: Record<string, number[]> = { '1M': REVENUE_MONTHLY.slice(-1), '3M': REVENUE_MONTHLY.slice(-3), '6M': REVENUE_MONTHLY.slice(-6), '1Y': REVENUE_MONTHLY, 'ALL': [...REVENUE_MONTHLY, 1820, 1900] };
    const data = slices[range] || REVENUE_MONTHLY;
    const W = 560, H = 110, pad = 10;
    const max = Math.max(...data), min = Math.min(...data) * 0.9;
    const px = (i: number) => data.length > 1 ? pad + (i / (data.length - 1)) * (W - pad * 2) : W / 2;
    const py = (v: number) => max !== min ? H - pad - (v - min) / (max - min) * (H - pad * 2) : H / 2;
    const pts = data.map((v, i) => [px(i), py(v)] as [number, number]);
    const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const area = path + ` L${px(data.length - 1)},${H} L${px(0)},${H} Z`;
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Revenue</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">↑ 22%</span>
                    </div>
                    <span className={`text-2xl font-black font-mono ${dark ? 'text-white' : 'text-gray-900'}`}>
                        TK <AnimCount to={D.total_revenue} dec={2} />
                    </span>
                </div>
                <div className="flex gap-0.5">
                    {['1M', '3M', '6M', '1Y', 'ALL'].map(r => (
                        <button key={r} onClick={() => { setRange(r); setAnim(false); setTimeout(() => setAnim(true), 50); }}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${r === range ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{r}</button>
                    ))}
                </div>
            </div>
            <div className="relative" onMouseLeave={() => setHover(null)}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28" preserveAspectRatio="none">
                    <defs><linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></linearGradient></defs>
                    <path d={area} fill="url(#revGrad)" style={{ opacity: anim ? 1 : 0, transition: 'opacity 0.8s' }} />
                    <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5"
                        style={{ strokeDasharray: 2200, strokeDashoffset: anim ? 0 : 2200, transition: 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)' }} />
                    {hover !== null && <line x1={pts[hover][0]} x2={pts[hover][0]} y1={0} y2={H} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" opacity="0.5" />}
                    {hover !== null && <circle cx={pts[hover][0]} cy={pts[hover][1]} r={4} fill="#3b82f6" />}
                    {pts.map(([x], i) => <rect key={i} x={x - 20} y={0} width={40} height={H} fill="transparent" onMouseEnter={() => setHover(i)} style={{ cursor: 'crosshair' }} />)}
                </svg>
                {hover !== null && (
                    <div className="absolute top-0 pointer-events-none bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl z-10"
                        style={{ left: `${(hover / (data.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}>
                        <div className="text-gray-300">{MONTHS[MONTHS.length - data.length + hover]}</div>
                        <div className="text-blue-300">TK {data[hover].toLocaleString()}</div>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-1">
                {data.map((_, i) => <span key={i} className="text-[8px] text-gray-400">{MONTHS[MONTHS.length - data.length + i]}</span>)}
            </div>
        </div>
    );
}

/* ═══════════════════════════════ RETENTION CHART ═══════════════════════════════ */
function RetentionChart({ dark }: { dark: boolean }) {
    const [anim, setAnim] = useState(false);
    useEffect(() => { setTimeout(() => setAnim(true), 600); }, []);
    const months = MONTHS.slice(-9);
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <span className={`text-sm font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Retention Rate</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className={`text-xl font-black font-mono ${dark ? 'text-white' : 'text-gray-900'}`}>95%</span>
                        <span className="text-xs text-emerald-500 font-bold">+12% vs last month</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-300 inline-block" />SMEs</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Startups</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-800 inline-block" />Enterprise</span>
                </div>
            </div>
            <div className="flex items-end gap-1 h-16 mt-2">
                {months.map((_, i) => (
                    <div key={i} className="flex-1 flex items-end gap-0.5">
                        {[{ v: RETENTION.smes[i], c: 'bg-sky-300' }, { v: RETENTION.startups[i], c: 'bg-blue-500' }, { v: RETENTION.enterprises[i], c: 'bg-blue-800' }].map(({ v, c }, j) => (
                            <div key={j} className={`flex-1 rounded-sm ${c}`}
                                style={{ height: anim ? `${v}%` : '0%', transition: `height 0.7s cubic-bezier(0.4,0,0.2,1) ${(i * 3 + j) * 0.04}s` }} />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1">
                {months.map(m => <span key={m} className="text-[8px] text-gray-400">{m}</span>)}
            </div>
        </div>
    );
}

/* ═══════════════════════════════ KPI CARD ═══════════════════════════════ */
function KpiCard({ title, value, sub, delta, up, icon, color, sparkData, dark, delay = 0 }:
    { title: string; value: any; sub: string; delta: string; up: boolean; icon: any; color: string; sparkData: number[]; dark: boolean; delay?: number }) {
    const [vis, setVis] = useState(false);
    useEffect(() => { setTimeout(() => setVis(true), delay); }, [delay]);
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    return (
        <div className={`rounded-xl border p-4 flex-1 transition-all duration-500 ${card}`}
            style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(16px)' }}>
            <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '20' }}>
                    <span style={{ color }}>{icon}</span>
                </div>
                <Sparkline data={sparkData} color={color} />
            </div>
            <div className={`text-xl font-black font-mono mb-0.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
            <div className={`text-[10px] mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</div>
            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {up ? '↑' : '↓'} {delta} <span className="font-normal opacity-70">vs last week</span>
            </div>
            <p className={`text-[10px] mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{title}</p>
        </div>
    );
}

/* ═══════════════════════════════ LEADS PANEL ═══════════════════════════════ */
function LeadsPanel({ dark }: { dark: boolean }) {
    const [tab, setTab] = useState('Status');
    const leads = { open: 114, inProgress: 62, lost: 47, won: 38 };
    const total = Object.values(leads).reduce((a, b) => a + b, 0);
    const items = [
        { label: 'Open', val: leads.open, pct: Math.round(leads.open / total * 100), color: '#60a5fa' },
        { label: 'In Progress', val: leads.inProgress, pct: Math.round(leads.inProgress / total * 100), color: '#3b82f6' },
        { label: 'Lost', val: leads.lost, pct: Math.round(leads.lost / total * 100), color: '#1d4ed8' },
        { label: 'Won', val: leads.won, pct: Math.round(leads.won / total * 100), color: '#1e3a8a' },
    ];
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <h3 className={`text-sm font-bold mb-3 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Leads Management</h3>
            <div className="flex gap-0.5 mb-3 bg-gray-100 rounded-lg p-0.5">
                {['Status', 'Sources', 'Qualification'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 text-[10px] font-semibold py-1 rounded-md transition-all ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>{t}</button>
                ))}
            </div>
            <div className="flex rounded-full overflow-hidden h-1.5 mb-4 gap-px">
                {items.map(it => <div key={it.label} className="transition-all duration-1000 rounded-sm" style={{ width: `${it.pct}%`, background: it.color }} />)}
            </div>
            <div className="space-y-2">
                {items.map(it => (
                    <div key={it.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: it.color }} />
                            <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{it.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{it.val} leads</span>
                            <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: it.color }}>{it.pct}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════ DELIVERY PIPELINE ═══════════════════════════════ */
function DeliveryPipeline({ dark }: { dark: boolean }) {
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const stages = [
        { label: 'Pending', val: D.pending_deliveries, color: '#f59e0b', icon: Ico.clock },
        { label: 'Processing', val: D.processing_deliveries, color: '#3b82f6', icon: Ico.refresh },
        { label: 'Shipped', val: D.shipped_deliveries, color: '#8b5cf6', icon: Ico.truck },
        { label: 'Delivered', val: D.delivered_deliveries, color: '#10b981', icon: Ico.check },
        { label: 'Cancelled', val: D.cancelled_deliveries, color: '#ef4444', icon: Ico.x },
    ];
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <h3 className={`text-sm font-bold mb-4 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Delivery Pipeline</h3>
            <div className="flex items-center justify-between relative">
                <div className={`absolute top-4 left-0 right-0 h-0.5 mx-6 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                {stages.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm relative"
                            style={{ background: s.val > 0 ? s.color + '20' : '', backgroundColor: s.val > 0 ? undefined : (dark ? '#1f2937' : '#f9fafb'), border: `2px solid ${s.val > 0 ? s.color : dark ? '#374151' : '#e5e7eb'}` }}>
                            <span style={{ color: s.val > 0 ? s.color : dark ? '#4b5563' : '#d1d5db' }}>{s.icon}</span>
                            {s.val > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ background: s.color }}>{s.val}</span>}
                        </div>
                        <span className={`text-[9px] font-semibold ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════ ORDERS TABLE ═══════════════════════════════ */
function OrdersTable({ dark }: { dark: boolean }) {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? ORDERS_DATA : ORDERS_DATA.filter(o => o.status === filter.toLowerCase());
    const sColors: Record<string, string> = { confirmed: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-600' };
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const rowH = dark ? 'hover:bg-gray-800 border-gray-800' : 'hover:bg-gray-50 border-gray-50';
    const th = dark ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-100';
    return (
        <div className={`rounded-xl border ${card} transition-colors duration-300`}>
            <div className="flex items-center justify-between p-4 pb-3">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Recent Orders</h3>
                <div className="flex gap-1">
                    {['All', 'Confirmed', 'Pending'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className={`border-t text-[10px] font-semibold uppercase tracking-wide ${th}`}>
                            {['Order', 'Customer', 'Book', 'Amount', 'Status', 'Delivery'].map(h => (
                                <th key={h} className="px-4 py-2 text-left">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(o => (
                            <tr key={o.id} className={`border-t transition-colors ${rowH}`}>
                                <td className="px-4 py-2.5 text-[11px] font-bold text-blue-500">{o.id}</td>
                                <td className={`px-4 py-2.5 text-[11px] ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{o.customer}</td>
                                <td className={`px-4 py-2.5 text-[11px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{o.book}</td>
                                <td className={`px-4 py-2.5 text-[11px] font-bold font-mono ${dark ? 'text-gray-200' : 'text-gray-800'}`}>TK {o.amount}</td>
                                <td className="px-4 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sColors[o.status]}`}>{o.status}</span></td>
                                <td className="px-4 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{o.delivery}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ BOOKS TABLE ═══════════════════════════════ */
function BooksTable({ dark }: { dark: boolean }) {
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const th = dark ? 'text-gray-500 border-gray-800' : 'text-gray-400 border-gray-100';
    const rowH = dark ? 'hover:bg-gray-800 border-gray-800' : 'hover:bg-gray-50 border-gray-50';
    return (
        <div className={`rounded-xl border ${card} transition-colors duration-300`}>
            <div className="flex items-center justify-between p-4 pb-3">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Book Inventory</h3>
                <div className="flex gap-2">
                    <span className="text-[10px] text-amber-600 bg-amber-50 font-bold px-2 py-1 rounded-full flex items-center gap-1">{Ico.warn}{D.low_stock_books} Low Stock</span>
                    <button className="text-[10px] font-semibold bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition">+ Add Book</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className={`border-t text-[10px] font-semibold uppercase tracking-wide ${th}`}>
                            {['Title', 'Author', 'Genre', 'Stock', 'Price', 'Orders', 'Status'].map(h => <th key={h} className="px-4 py-2 text-left">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {BOOKS_DATA.map(b => (
                            <tr key={b.id} className={`border-t transition-colors cursor-pointer ${rowH}`}>
                                <td className={`px-4 py-3 text-[11px] font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{b.title}</td>
                                <td className={`px-4 py-3 text-[11px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{b.author}</td>
                                <td className="px-4 py-3"><span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">{b.genre}</span></td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[11px] font-bold ${b.stock <= 3 ? 'text-amber-500' : 'text-gray-700'}`}>{b.stock}</span>
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${b.stock <= 3 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (b.stock / 20) * 100)}%`, transition: 'width 1s ease' }} />
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-4 py-3 text-[11px] font-mono font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>TK {b.price}</td>
                                <td className="px-4 py-3 text-[11px] font-bold text-blue-500">{b.orders}</td>
                                <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{b.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ CALENDAR ═══════════════════════════════ */
function CalendarWidget({ dark }: { dark: boolean }) {
    const [activeDay, setActiveDay] = useState(6);
    const days = [{ l: 'Sun', d: 5 }, { l: 'Mon', d: 6 }, { l: 'Tue', d: 7 }, { l: 'Wed', d: 8 }, { l: 'Thu', d: 9 }, { l: 'Fri', d: 10 }];
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Calendar</h3>
                <button className={`flex items-center gap-1 text-xs border rounded-full px-2.5 py-1 ${dark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>March {Ico.chevD}</button>
            </div>
            <div className="flex gap-1 mb-3">
                {days.map(d => (
                    <button key={d.d} onClick={() => setActiveDay(d.d)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs transition-all duration-200 ${d.d === activeDay ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <span className="text-[9px] mb-0.5 opacity-70">{d.l}</span><span className="font-bold">{d.d}</span>
                    </button>
                ))}
            </div>
            <div className="space-y-2">
                <div className={`border rounded-xl px-3 py-2.5 ${dark ? 'bg-blue-950 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${dark ? 'text-blue-300' : 'text-blue-800'}`}>Mesh Weekly Meeting</span>
                        <span className="text-[9px] text-blue-500">9:00–10:30</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-1">
                            {['J', 'S', 'K'].map((a, i) => <div key={i} className="w-4 h-4 rounded-full bg-blue-500 border border-white text-white text-[7px] font-bold flex items-center justify-center">{a}</div>)}
                            <div className="w-4 h-4 rounded-full bg-gray-200 border border-white text-gray-500 text-[7px] font-bold flex items-center justify-center">+7</div>
                        </div>
                        <span className={`text-[9px] ${dark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-0.5`}>{Ico.clock} 90m</span>
                    </div>
                </div>
                <div className={`border rounded-xl px-3 py-2.5 ${dark ? 'bg-violet-950 border-violet-800' : 'bg-violet-50 border-violet-200'}`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${dark ? 'text-violet-300' : 'text-violet-800'}`}>Patreon Demo</span>
                        <span className="text-[9px] text-violet-500">10:45–12:45</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ WORLD MAP ═══════════════════════════════ */
function WorldMap({ dark }: { dark: boolean }) {
    const fill = dark ? '#1e40af' : '#bfdbfe';
    return (
        <div className={`relative w-full h-full rounded-xl overflow-hidden ${dark ? 'bg-gray-800' : 'bg-sky-50'}`}>
            <svg viewBox="0 0 500 280" className="w-full h-full opacity-90">
                <path d="M60,60 Q80,40 120,50 Q150,55 160,80 Q170,110 150,130 Q130,150 110,140 Q80,130 60,110 Q40,90 60,60Z" fill={fill} opacity="0.8" />
                <path d="M110,145 Q130,135 145,150 Q160,170 155,200 Q150,230 130,240 Q110,245 100,225 Q90,200 95,175 Q100,155 110,145Z" fill={fill} opacity="0.8" />
                <path d="M210,50 Q230,40 255,45 Q270,50 265,70 Q260,85 245,80 Q230,75 220,80 Q210,75 205,65 Q203,55 210,50Z" fill={dark ? '#3b82f6' : fill} opacity="0.9" />
                <path d="M215,90 Q240,82 255,95 Q270,110 268,140 Q265,170 245,185 Q225,195 210,180 Q195,165 195,140 Q194,110 205,97Z" fill={fill} opacity="0.85" />
                <path d="M270,40 Q320,30 370,40 Q400,50 410,75 Q415,100 395,110 Q370,120 340,110 Q310,100 290,110 Q270,115 260,100 Q250,80 255,60 Q260,45 270,40Z" fill={dark ? '#3b82f6' : fill} opacity="0.9" />
                <path d="M360,150 Q390,140 410,155 Q425,170 415,195 Q400,210 375,205 Q355,195 352,175 Q350,160 360,150Z" fill={dark ? '#60a5fa' : '#3b82f6'} opacity="0.95" />
            </svg>
            {[{ t: '35%', l: '25%' }, { t: '50%', l: '67%' }, { t: '48%', l: '63%' }, { t: '45%', l: '68%' }, { t: '43%', l: '70%' }].map((pos, i) => (
                <div key={i} className="absolute group" style={{ top: pos.t, left: pos.l }}>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping opacity-50 absolute" />
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full relative z-10 border-2 border-white shadow" />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        {LOCATIONS[i].flag} {LOCATIONS[i].country} {LOCATIONS[i].pct}%
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════ QUICK STATS ═══════════════════════════════ */
function QuickStats({ dark }: { dark: boolean }) {
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const items = [
        { label: 'Total Revenue', val: <>TK <AnimCount to={D.total_revenue} dec={2} /></>, color: '#3b82f6', pct: 100, icon: Ico.trend },
        { label: 'Total Orders', val: <AnimCount to={D.total_orders} />, color: '#10b981', pct: 50, icon: Ico.deals },
        { label: 'Total Books', val: <AnimCount to={D.total_books} />, color: '#8b5cf6', pct: 100, icon: Ico.book },
        { label: 'Low Stock', val: <AnimCount to={D.low_stock_books} />, color: '#f59e0b', pct: 33, icon: Ico.warn },
    ];
    return (
        <div className={`rounded-xl border p-4 ${card} transition-colors duration-300`}>
            <h3 className={`text-sm font-bold mb-3 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Quick Stats</h3>
            <div className="space-y-3">
                {items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: it.color + '18' }}>
                            <span style={{ color: it.color }}>{it.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{it.label}</p>
                            <p className={`text-sm font-black font-mono ${dark ? 'text-white' : 'text-gray-900'}`}>{it.val}</p>
                        </div>
                        <Ring pct={it.pct} color={it.color} size={36} stroke={4} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════ PROFILE FORM ═══════════════════════════════ */
function ProfileForm({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const [form, setForm] = useState({ firstName: 'Admin', lastName: 'User', email: 'admin@bookbuybd.com', phone: '+880 1XXX XXXXXX', role: 'Admin', company: 'BookBuyBD', timezone: 'UTC+6', bio: 'Administrator at BookBuyBD. Managing inventory and customer orders.' });
    const [avatar, setAvatar] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const inp = dark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400';
    const lbl = dark ? 'text-gray-300' : 'text-gray-600';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1500);
    };
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) { const r = new FileReader(); r.onload = ev => setAvatar(ev.target?.result as string); r.readAsDataURL(f); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-[520px] max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${bg}`}
                style={{ animation: 'fadeUp 0.3s ease' }}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${sec}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600">{Ico.edit}</span>
                        <span className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-800'}`}>Edit Profile</span>
                    </div>
                    <button onClick={onClose} className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'} transition`}>{Ico.x}</button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b" style={{ borderColor: dark ? '#1f2937' : '#f3f4f6' }}>
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                                {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> :
                                    <span className="text-white text-xl font-black">{form.firstName[0]}{form.lastName[0]}</span>}
                            </div>
                            <button onClick={() => fileRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white text-white hover:bg-blue-700 transition shadow-sm">
                                <span className="scale-75">{Ico.camera}</span>
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>{form.firstName} {form.lastName}</p>
                            <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{form.email}</p>
                            <span className="mt-1 inline-flex text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full">{form.role}</span>
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[['First Name', 'firstName'], ['Last Name', 'lastName']].map(([l, k]) => (
                            <div key={k}>
                                <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>{l}</label>
                                <input value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                                    className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition ${inp}`} />
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>Email Address</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition ${inp}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[['Phone', 'phone'], ['Company', 'company']].map(([l, k]) => (
                            <div key={k}>
                                <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>{l}</label>
                                <input value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                                    className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition ${inp}`} />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>Role</label>
                            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 transition ${inp}`}>
                                {['Admin', 'Editor', 'Viewer', 'Manager'].map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>Timezone</label>
                            <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                                className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 transition ${inp}`}>
                                {['UTC+0', 'UTC+3', 'UTC+5', 'UTC+6', 'UTC+8', 'UTC-5', 'UTC-8'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mb-2">
                        <label className={`block text-[11px] font-semibold mb-1.5 ${lbl}`}>Bio</label>
                        <textarea rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                            className={`w-full text-xs px-3 py-2.5 rounded-xl border outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none ${inp}`} />
                    </div>
                </div>

                {/* Footer with Save */}
                <div className={`px-6 py-4 border-t flex items-center justify-between ${sec}`}>
                    <button onClick={onClose} className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        Cancel
                    </button>
                    <button onClick={handleSave}
                        className={`flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm ${saved ? 'bg-emerald-500 shadow-emerald-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} text-white`}>
                        {saved ? <>{Ico.check} Saved!</> : <>{Ico.save} Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ BILLING PANEL ═══════════════════════════════ */
function BillingPanel({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const inp = dark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800';
    const [plan, setPlan] = useState('pro');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-[480px] max-h-[88vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${bg}`}
                style={{ animation: 'fadeUp 0.3s ease' }}>
                <div className={`flex items-center justify-between px-6 py-4 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-blue-600">{Ico.credit}</span><span className={`font-bold text-base ${tp}`}>Billing & Plan</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">{Ico.x}</button>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Current Plan</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[{ id: 'starter', label: 'Starter', price: 'TK 0', desc: 'Up to 3 books' }, { id: 'pro', label: 'Pro', price: 'TK 3500', desc: 'Up to 50 books' }, { id: 'enterprise', label: 'Enterprise', price: 'TK 12000', desc: 'Unlimited' }].map(p => (
                                <button key={p.id} onClick={() => setPlan(p.id)}
                                    className={`p-3 rounded-xl border text-left transition-all ${plan === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <p className={`text-xs font-bold ${plan === p.id ? 'text-blue-700' : 'text-gray-700'}`}>{p.label}</p>
                                    <p className={`text-lg font-black font-mono ${plan === p.id ? 'text-blue-600' : 'text-gray-800'}`}>{p.price}<span className="text-[10px] font-normal">/mo</span></p>
                                    <p className="text-[9px] text-gray-400 mt-0.5">{p.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Payment Method</p>
                        <div className={`flex items-center justify-between p-3 rounded-xl border ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-[9px] font-black">VISA</div>
                                <div><p className={`text-xs font-semibold ${tp}`}>•••• •••• •••• 4242</p><p className="text-[10px] text-gray-400">Expires 12/26</p></div>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <button className="mt-2 text-xs font-semibold text-blue-500 hover:text-blue-600 transition">+ Add payment method</button>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Invoice History</p>
                        {[{ date: 'Mar 1, 2025', amt: 'TK 3500.00', st: 'Paid' }, { date: 'Feb 1, 2025', amt: 'TK 3500.00', st: 'Paid' }, { date: 'Jan 1, 2025', amt: 'TK 3500.00', st: 'Paid' }].map((inv, i) => (
                            <div key={i} className={`flex items-center justify-between py-2.5 border-b ${sec}`}>
                                <span className={`text-xs ${ts}`}>{inv.date}</span>
                                <span className={`text-xs font-bold font-mono ${tp}`}>{inv.amt}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{inv.st}</span>
                                <button className="text-[10px] text-blue-500 hover:text-blue-600 font-semibold transition">Download</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`px-6 py-4 border-t ${sec} flex justify-between items-center`}>
                    <button onClick={onClose} className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Close</button>
                    <button className="text-xs font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ TEAM MEMBERS PANEL ═══════════════════════════════ */
function TeamPanel({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const [members, setMembers] = useState([
        { id: 1, name: 'Janson Williams', email: 'williams@mesh.com', role: 'Admin', status: 'active', initials: 'JW', color: 'from-blue-500 to-indigo-600' },
        { id: 2, name: 'Sarah Kim', email: 'sarah@mesh.com', role: 'Editor', status: 'active', initials: 'SK', color: 'from-rose-400 to-pink-600' },
        { id: 3, name: 'Amir Hassan', email: 'amir@mesh.com', role: 'Viewer', status: 'active', initials: 'AH', color: 'from-emerald-400 to-teal-600' },
        { id: 4, name: 'Tommy Adam', email: 'tommy@mesh.com', role: 'Manager', status: 'pending', initials: 'TA', color: 'from-amber-400 to-orange-500' },
    ]);
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const inp = dark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400';
    const roleColors: Record<string, string> = { Admin: 'bg-blue-100 text-blue-700', Editor: 'bg-violet-100 text-violet-700', Viewer: 'bg-gray-100 text-gray-600', Manager: 'bg-emerald-100 text-emerald-700' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-[500px] max-h-[88vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${bg}`}
                style={{ animation: 'fadeUp 0.3s ease' }}>
                <div className={`flex items-center justify-between px-6 py-4 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-blue-600">{Ico.team}</span><span className={`font-bold text-base ${tp}`}>Team Members</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">{Ico.x}</button>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    {/* Invite */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl border mb-5 ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                        <input placeholder="Invite by email address..." className={`flex-1 text-xs bg-transparent outline-none ${ts}`} />
                        <select className={`text-xs border rounded-lg px-2 py-1 outline-none ${dark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                            {['Viewer', 'Editor', 'Manager', 'Admin'].map(r => <option key={r}>{r}</option>)}
                        </select>
                        <button className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 flex-shrink-0">
                            {Ico.plus} Invite
                        </button>
                    </div>
                    {/* Members list */}
                    <p className={`text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3`}>{members.length} Members</p>
                    <div className="space-y-2">
                        {members.map(m => (
                            <div key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border transition ${dark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}>
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white text-[11px] font-black flex-shrink-0`}>{m.initials}</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold ${tp} truncate`}>{m.name}</p>
                                    <p className={`text-[10px] ${ts} truncate`}>{m.email}</p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${roleColors[m.role]}`}>{m.role}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${m.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{m.status}</span>
                                <button onClick={() => setMembers(prev => prev.filter(x => x.id !== m.id))}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition ${dark ? 'text-gray-600 hover:bg-gray-700 hover:text-red-400' : 'text-gray-300 hover:bg-red-50 hover:text-red-500'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`px-6 py-4 border-t ${sec}`}>
                    <button onClick={onClose} className="w-full text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">Done</button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ SETTINGS PANEL ═══════════════════════════════ */
function SettingsPanel({ dark, setDark, onClose }: { dark: boolean; setDark: (v: boolean) => void; onClose: () => void }) {
    const [notifs, setNotifs] = useState(true);
    const [emails, setEmails] = useState(false);
    const [compact, setCompact] = useState(false);
    const [auto, setAuto] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('English');
    const [saved, setSaved] = useState(false);
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const inp = dark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700';

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => { setSaved(false); onClose(); }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-80 shadow-2xl border-l flex flex-col ${bg}`}
                style={{ animation: 'slideInRight 0.3s ease' }}>
                <div className={`flex items-center justify-between p-5 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-blue-600">{Ico.settings}</span><span className={`font-bold ${tp}`}>Settings</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">{Ico.x}</button>
                </div>
                <div className="overflow-y-auto flex-1 p-5 space-y-6">
                    {/* Appearance */}
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Appearance</p>
                        <div className={`flex items-center justify-between py-3 border-b ${sec}`}>
                            <div><p className={`text-xs font-semibold ${tp}`}>Dark Mode</p><p className={`text-[10px] ${ts}`}>Switch to dark theme</p></div>
                            <Toggle v={dark} onChange={setDark} />
                        </div>
                    </div>
                    {/* Notifications */}
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Notifications</p>
                        {[
                            { label: 'Push Notifications', desc: 'Order & stock alerts', v: notifs, fn: setNotifs },
                            { label: 'Email Digest', desc: 'Daily summary', v: emails, fn: setEmails },
                            { label: 'Auto Refresh', desc: 'Live data updates', v: auto, fn: setAuto },
                        ].map(({ label, desc, v, fn }) => (
                            <div key={label} className={`flex items-center justify-between py-3 border-b ${sec}`}>
                                <div><p className={`text-xs font-semibold ${tp}`}>{label}</p><p className={`text-[10px] ${ts}`}>{desc}</p></div>
                                <Toggle v={v} onChange={fn} />
                            </div>
                        ))}
                    </div>
                    {/* Display */}
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Display</p>
                        <div className={`flex items-center justify-between py-3 border-b ${sec}`}>
                            <div><p className={`text-xs font-semibold ${tp}`}>Compact View</p><p className={`text-[10px] ${ts}`}>Dense layout</p></div>
                            <Toggle v={compact} onChange={setCompact} />
                        </div>
                        <div className={`flex items-center justify-between py-3 border-b ${sec}`}>
                            <p className={`text-xs font-semibold ${tp}`}>Currency</p>
                            <select value={currency} onChange={e => setCurrency(e.target.value)} className={`text-xs border rounded-lg px-2 py-1 outline-none ${inp}`}>
                                {['USD', 'EUR', 'GBP', 'BDT', 'JPY'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className={`flex items-center justify-between py-3 border-b ${sec}`}>
                            <p className={`text-xs font-semibold ${tp}`}>Language</p>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className={`text-xs border rounded-lg px-2 py-1 outline-none ${inp}`}>
                                {['English', 'Bangla', 'Spanish', 'French'].map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Security */}
                    <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Security</p>
                        {['Change Password', 'Two-Factor Auth', 'Login History', 'Active Sessions'].map(item => (
                            <button key={item} className={`w-full flex items-center justify-between py-3 border-b text-xs font-medium text-left transition ${sec} ${dark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                {item}<span className="text-gray-300">{Ico.chevR}</span>
                            </button>
                        ))}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Danger Zone</p>
                        <button className="w-full text-xs font-bold text-red-500 border border-red-200 rounded-xl py-2.5 hover:bg-red-50 transition">Delete Account</button>
                    </div>
                </div>
                {/* Save button */}
                <div className={`p-5 border-t ${sec}`}>
                    <button onClick={handleSave}
                        className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all shadow-sm ${saved ? 'bg-emerald-500 shadow-emerald-200 text-white' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 text-white'}`}>
                        {saved ? <>{Ico.check} Settings Saved!</> : <>{Ico.save} Save Settings</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ NOTIFICATION PANEL ═══════════════════════════════ */
function NotifPanel({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const [notifs, setNotifs] = useState(NOTIFICATIONS_INIT);
    const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const row = dark ? 'hover:bg-gray-800 border-gray-800' : 'hover:bg-gray-50 border-gray-100';
    const icons: Record<string, any> = { order: Ico.deals, stock: Ico.warn, system: Ico.refresh };
    const clrs: Record<string, string> = { order: 'text-blue-500', stock: 'text-amber-500', system: 'text-emerald-500' };
    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div className={`absolute right-4 top-14 w-72 rounded-2xl border shadow-2xl overflow-hidden ${bg}`} onClick={e => e.stopPropagation()}>
                <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Notifications</span>
                    <button onClick={markAll} className="text-[10px] font-semibold text-blue-500 hover:text-blue-600 transition">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                    {notifs.map(n => (
                        <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
                            className={`flex gap-3 px-4 py-3 border-b transition cursor-pointer ${row} ${!n.read ? (dark ? 'bg-blue-950' : 'bg-blue-50/60') : ''}`}>
                            <span className={`mt-0.5 flex-shrink-0 ${clrs[n.type]}`}>{icons[n.type]}</span>
                            <div className="flex-1 min-w-0">
                                <p className={`text-[11px] font-medium leading-snug ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{n.msg}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />}
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className={`w-full text-[11px] font-semibold text-blue-500 py-2.5 hover:bg-gray-50 ${dark ? 'hover:bg-gray-800' : ''} transition`}>View all →</button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ HELP CENTER ═══════════════════════════════ */
function HelpPanel({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const articles = [
        { title: 'Getting Started with Dashboard', cat: 'Basics', read: '3 min' },
        { title: 'Managing Orders & Deliveries', cat: 'Orders', read: '5 min' },
        { title: 'Book Inventory Best Practices', cat: 'Inventory', read: '4 min' },
        { title: 'Exporting & Importing Data', cat: 'Data', read: '2 min' },
        { title: 'Setting Up Integrations', cat: 'Advanced', read: '6 min' },
    ];
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-80 shadow-2xl border-l flex flex-col ${bg}`} style={{ animation: 'slideInRight 0.3s ease' }}>
                <div className={`flex items-center justify-between p-5 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-blue-600">{Ico.help}</span><span className={`font-bold ${tp}`}>Help Center</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">{Ico.x}</button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto">
                    <div className="relative mb-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Ico.search}</span>
                        <input placeholder="Search articles..." className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${dark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Popular Articles</p>
                    <div className="space-y-2">
                        {articles.map((a, i) => (
                            <div key={i} className={`p-3 rounded-xl cursor-pointer transition ${dark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-blue-50'}`}>
                                <p className={`text-[11px] font-semibold ${tp}`}>{a.title}</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">{a.cat}</span>
                                    <span className={`text-[9px] ${ts}`}>{a.read} read</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-5 border-t" style={{ borderColor: dark ? '#1f2937' : '#f3f4f6' }}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition">Contact Support →</button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ FAVORITES/PROJECTS MODALS ═══════════════════════════════ */
function FavoritesModal({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const [items, setItems] = useState([
        { id: 1, label: 'Revenue Dashboard', 'color': 'bg-blue-500' },
        { id: 2, label: 'Book Sales Report', 'color': 'bg-violet-500' },
        { id: 3, label: 'Order Pipeline', 'color': 'bg-emerald-500' },
    ]);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const add = () => {
        if (!newName.trim()) return;
        setItems(p => [...p, { id: Date.now(), label: newName, color: 'bg-gray-400' }]);
        setNewName(''); setAdding(false);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-80 rounded-2xl border shadow-2xl overflow-hidden ${bg}`} style={{ animation: 'fadeUp 0.3s ease' }}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-yellow-500">{Ico.star}</span><span className={`font-bold ${tp}`}>Favorites</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">{Ico.x}</button>
                </div>
                <div className="px-5 py-4 space-y-2 max-h-64 overflow-y-auto">
                    {items.map(it => (
                        <div key={it.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition ${dark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <span className={`w-2 h-2 rounded-full ${it.color}`} />
                            <span className={`flex-1 text-xs font-medium ${tp}`}>{it.label}</span>
                            <button onClick={() => setItems(p => p.filter(x => x.id !== it.id))} className="text-gray-300 hover:text-red-400 transition">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    {adding ? (
                        <div className="flex gap-2 mt-1">
                            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') { setAdding(false); setNewName(''); } }}
                                placeholder="Favorite name..." className={`flex-1 text-xs px-2.5 py-2 rounded-xl border outline-none ${dark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} />
                            <button onClick={add} className="text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition">Add</button>
                        </div>
                    ) : (
                        <button onClick={() => setAdding(true)} className={`flex items-center gap-1.5 w-full text-xs font-semibold py-2 text-blue-500 hover:text-blue-600 transition`}>
                            {Ico.plus} Add favorite
                        </button>
                    )}
                </div>
                <div className={`px-5 py-3 border-t ${sec}`}>
                    <button onClick={onClose} className="w-full text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">Done</button>
                </div>
            </div>
        </div>
    );
}

function ProjectsModal({ dark, onClose }: { dark: boolean; onClose: () => void }) {
    const [projects, setProjects] = useState([
        { id: 1, name: 'Bookstore CRM', desc: 'Main CR management', status: 'active', color: 'bg-blue-500' },
        { id: 2, name: 'Inventory Tracker', desc: 'Stock & orders', status: 'active', color: 'bg-emerald-500' },
        { id: 3, name: 'Analytics V2', desc: 'Advanced reporting', status: 'planning', color: 'bg-amber-400' },
    ]);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const bg = dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
    const sec = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';
    const add = () => {
        if (!newName.trim()) return;
        setProjects(p => [...p, { id: Date.now(), name: newName, desc: 'New project', status: 'planning', color: 'bg-gray-400' }]);
        setNewName(''); setAdding(false);
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-80 rounded-2xl border shadow-2xl overflow-hidden ${bg}`} style={{ animation: 'fadeUp 0.3s ease' }}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${sec}`}>
                    <div className="flex items-center gap-2"><span className="text-blue-600">{Ico.folder}</span><span className={`font-bold ${tp}`}>Projects</span></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">{Ico.x}</button>
                </div>
                <div className="px-5 py-4 space-y-2 max-h-72 overflow-y-auto">
                    {projects.map(p => (
                        <div key={p.id} className={`p-3 rounded-xl border transition cursor-pointer ${dark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${p.color}`} />
                                <span className={`flex-1 text-xs font-semibold ${tp}`}>{p.name}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{p.status}</span>
                                <button onClick={() => setProjects(prev => prev.filter(x => x.id !== p.id))} className="text-gray-300 hover:text-red-400 transition">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <p className={`text-[10px] ${ts} ml-4`}>{p.desc}</p>
                        </div>
                    ))}
                    {adding ? (
                        <div className="flex gap-2 mt-1">
                            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') { setAdding(false); setNewName(''); } }}
                                placeholder="Project name..." className={`flex-1 text-xs px-2.5 py-2 rounded-xl border outline-none ${dark ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border-gray-200'}`} />
                            <button onClick={add} className="text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition">Add</button>
                        </div>
                    ) : (
                        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 w-full text-xs font-semibold py-2 text-blue-500 hover:text-blue-600 transition">
                            {Ico.plus} New project
                        </button>
                    )}
                </div>
                <div className={`px-5 py-3 border-t ${sec}`}>
                    <button onClick={onClose} className="w-full text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition">Done</button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ DASHBOARD HOME ═══════════════════════════════ */
function DashboardHome({ dark }: { dark: boolean }) {
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <KpiCard dark={dark} title="Total Leads" value={<AnimCount to={129} />} sub="+24 vs last week" delta="8%" up={true} color="#3b82f6" icon={Ico.users} sparkData={[40, 55, 48, 62, 57, 70, 65, 80, 75, 90, 85, 100]} delay={100} />
                <KpiCard dark={dark} title="Conversion Rate" value={<><AnimCount to={24} />%</>} sub="+8 vs last week" delta="2%" up={true} color="#10b981" icon={Ico.percent} sparkData={[18, 20, 17, 22, 20, 24, 22, 26, 24, 28, 26, 30]} delay={200} />
                <KpiCard dark={dark} title="Customer LTV" value={<><AnimCount to={14} />d</>} sub="+1d vs last week" delta="4%" up={false} color="#f59e0b" icon={Ico.trend} sparkData={[16, 15, 17, 15, 14, 16, 15, 14, 15, 13, 14, 12]} delay={300} />
            </div>
            <div className="flex gap-4">
                <div className="flex-1 min-w-0"><RevenueChart dark={dark} /></div>
                <div className="w-56 flex-shrink-0"><LeadsPanel dark={dark} /></div>
            </div>
            <div className="flex gap-4">
                <div className="w-56 flex-shrink-0"><QuickStats dark={dark} /></div>
                <div className="flex-1 min-w-0"><RetentionChart dark={dark} /></div>
            </div>
            <DeliveryPipeline dark={dark} />
            <div className="grid grid-cols-4 gap-3">
                {[
                    { l: 'Total Books', v: D.total_books, c: '#3b82f6', pct: 100, icon: Ico.book },
                    { l: 'Active', v: D.active_books, c: '#10b981', pct: 100, icon: Ico.check },
                    { l: 'In Stock', v: D.in_stock_books, c: '#8b5cf6', pct: 100, icon: Ico.package },
                    { l: 'Low Stock', v: D.low_stock_books, c: '#f59e0b', pct: 33, icon: Ico.warn },
                ].map((it, i) => (
                    <div key={i} className={`rounded-xl border p-4 flex items-center gap-3 transition-colors ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                        <Ring pct={it.pct} color={it.c} size={44} stroke={5} />
                        <div><div className="text-xl font-black font-mono" style={{ color: it.c }}><AnimCount to={it.v} /></div><p className={`text-[10px] ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{it.l}</p></div>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <div className="w-72 flex-shrink-0"><CalendarWidget dark={dark} /></div>
                <div className={`flex-1 rounded-xl border overflow-hidden ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div style={{ height: 170 }}><WorldMap dark={dark} /></div>
                    <div className="p-4">
                        <h3 className={`text-sm font-bold mb-2 ${tp}`}>Top Customer Locations</h3>
                        <div className="space-y-1.5">
                            {LOCATIONS.map((l, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className={`text-[10px] font-bold w-4 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{i + 1}</span>
                                    <span className="text-base">{l.flag}</span>
                                    <span className={`flex-1 font-medium ${tp}`}>{l.country}</span>
                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-1">
                                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${l.pct}%`, transition: 'width 1s ease' }} />
                                    </div>
                                    <span className={`font-bold text-[11px] ${tp}`}>{l.pct}%</span>
                                </div>
                            ))}
                        </div>
                        <button className={`mt-3 w-full text-[11px] font-semibold border rounded-xl py-1.5 transition ${dark ? 'border-gray-700 text-gray-400 hover:border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-400'}`}>View more →</button>
                    </div>
                </div>
            </div>
            <OrdersTable dark={dark} />
        </div>
    );
}

type Modal = 'settings' | 'help' | 'notifs' | 'profile' | 'billing' | 'team' | 'favorites' | 'projects' | null;

/* ═══════════════════════════════ LOGIN FORM ═══════════════════════════════ */
function LoginForm({ onLogin, dark }: { onLogin: () => void; dark: boolean }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simple mock auth for Super Admin
        setTimeout(() => {
            if (email === 'admin@bookbuybd.com' && password === 'superadmin123') {
                onLogin();
            } else {
                setError('Invalid Super Admin credentials');
            }
            setLoading(false);
        }, 800);
    };

    const bg = dark ? 'bg-gray-950' : 'bg-[#f0f4f8]';
    const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const inp = dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-800';

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${bg} p-4`}>
            <div className={`w-full max-w-sm p-8 rounded-3xl border shadow-2xl ${card} transition-all duration-300`}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 mb-4">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h2 className={`text-xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>Super Admin Login</h2>
                    <p className={`text-xs mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Enter your credentials to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Email Address</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${inp}`} placeholder="admin@bookbuybd.com" />
                    </div>
                    <div>
                        <label className={`block text-[11px] font-bold mb-1.5 uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${inp}`} placeholder="••••••••" />
                    </div>

                    {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2">{error}</p>}

                    <button type="submit" disabled={loading}
                        className={`w-full py-3.5 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className={`text-[10px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Protected by BookBuyBD Security Layer</p>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════ ROOT COMPONENT ═══════════════════════════════ */
export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [dark, setDark] = useState(false);
    const [sidebar, setSidebar] = useState(true);
    const [activeNav, setNav] = useState('dashboard');
    const [modal, setModal] = useState<Modal>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQ, setSearchQ] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const unread = NOTIFICATIONS_INIT.filter(n => !n.read).length;

    useEffect(() => {
        const h = (e: MouseEvent) => { if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const bg = dark ? 'bg-gray-950' : 'bg-[#f0f4f8]';
    const sbBg = dark ? 'bg-gray-900' : 'bg-white';
    const bdr = dark ? 'border-gray-800' : 'border-gray-100';
    const tp = dark ? 'text-gray-100' : 'text-gray-800';
    const ts = dark ? 'text-gray-400' : 'text-gray-500';

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Ico.grid, badge: 0 },
        { id: 'deals', label: 'Deals', icon: Ico.deals, badge: D.total_orders },
        { id: 'books', label: 'Books', icon: Ico.book, badge: 0 },
        { id: 'orders', label: 'Orders', icon: Ico.package, badge: D.pending_orders },
        { id: 'reports', label: 'Reports', icon: Ico.reports, badge: 0 },
        { id: 'workflows', label: 'Workflows', icon: Ico.workflows, badge: 0 },
        { id: 'inbox', label: 'Inbox', icon: Ico.inbox, badge: 3 },
    ];

    const renderPage = () => {
        switch (activeNav) {
            case 'orders': return <div className="space-y-4"><h2 className={`text-lg font-bold ${tp}`}>Orders</h2><DeliveryPipeline dark={dark} /><OrdersTable dark={dark} /></div>;
            case 'books': return <div className="space-y-4"><h2 className={`text-lg font-bold ${tp}`}>Book Inventory</h2><div className="grid grid-cols-4 gap-3">{[{ l: 'Total Books', v: D.total_books, c: '#3b82f6', pct: 100, icon: Ico.book }, { l: 'Active', v: D.active_books, c: '#10b981', pct: 100, icon: Ico.check }, { l: 'In Stock', v: D.in_stock_books, c: '#8b5cf6', pct: 100, icon: Ico.package }, { l: 'Low Stock', v: D.low_stock_books, c: '#f59e0b', pct: 33, icon: Ico.warn }].map((it, i) => <div key={i} className={`rounded-xl border p-4 flex items-center gap-3 ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}><Ring pct={it.pct} color={it.c} size={44} stroke={5} /><div><div className="text-xl font-black font-mono" style={{ color: it.c }}><AnimCount to={it.v} /></div><p className={`text-[10px] ${ts}`}>{it.l}</p></div></div>)}</div><BooksTable dark={dark} /></div>;
            case 'reports': return <div className="space-y-4"><h2 className={`text-lg font-bold ${tp}`}>Reports</h2><RevenueChart dark={dark} /><RetentionChart dark={dark} /></div>;
            case 'deals': return <div className="space-y-4"><h2 className={`text-lg font-bold ${tp}`}>Deals</h2><LeadsPanel dark={dark} /><OrdersTable dark={dark} /></div>;
            case 'inbox': return <div className={`rounded-xl border p-12 text-center ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}><div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-blue-600">{Ico.inbox}</span></div><h3 className={`font-bold ${tp}`}>Inbox</h3><p className={`text-xs mt-1 ${ts}`}>No new messages.</p></div>;
            case 'workflows': return <div className={`rounded-xl border p-12 text-center ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}><div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3"><span className="text-violet-600">{Ico.workflows}</span></div><h3 className={`font-bold ${tp}`}>Workflows</h3><p className={`text-xs mt-1 mb-4 ${ts}`}>Automate your processes.</p><button className="bg-violet-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-violet-700 transition">Create Workflow</button></div>;
            default: return <DashboardHome dark={dark} />;
        }
    };

    return (
        <div className={`flex h-screen ${bg} overflow-hidden transition-colors duration-300`}
            style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
            {!isAuthenticated && <LoginForm onLogin={() => setIsAuthenticated(true)} dark={dark} />}
            <style>{`
        @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .fi{animation:fadeIn 0.25s ease}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
        ::-webkit-scrollbar-track{background:transparent}
      `}</style>

            {/* ── ICON RAIL ── */}
            <div className={`w-11 flex flex-col items-center py-3 gap-2 border-r ${bdr} ${sbBg} flex-shrink-0 z-20 transition-colors duration-300`}>
                <div className="w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center mb-1 shadow-md shadow-blue-200/60">
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                {[Ico.grid, Ico.deals, Ico.book, Ico.reports, Ico.package].map((ic, i) => (
                    <button key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition`}>{ic}</button>
                ))}
                <div className="flex-1" />
                <button onClick={() => setDark(v => !v)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${dark ? 'bg-yellow-100 text-yellow-500' : 'text-gray-400 hover:bg-gray-100'}`}>
                    {dark ? Ico.sun : Ico.moon}
                </button>
            </div>

            {/* ── SIDEBAR ── */}
            <div className={`${sidebar ? 'w-48' : 'w-0'} flex-shrink-0 border-r ${bdr} ${sbBg} overflow-hidden transition-all duration-300 ease-in-out`}>
                <div className="w-48 h-full flex flex-col">
                    {/* Workspace */}
                    <div className="p-3.5 border-b" style={{ borderColor: dark ? '#1f2937' : '#f3f4f6' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-8 flex-shrink-0 overflow-hidden">
                                <img src="/logo.png" alt="BookBuyBD Logo" className="w-full h-12 object-contain object-top" />
                            </div>
                            <span className={ts}>{Ico.chevD}</span>
                        </div>
                        <div className={`flex items-center gap-3 mt-2 text-[9px] ${ts}`}>
                            <span className="flex items-center gap-1">{Ico.users} 24</span>
                            <span className="flex items-center gap-1">{Ico.msg} 83</span>
                            <span className="flex items-center gap-1">{Ico.calendar} 12</span>
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="p-2 flex-1 overflow-y-auto">
                        <div className="space-y-0.5 mb-2">
                            {navItems.map(item => (
                                <button key={item.id} onClick={() => setNav(item.id)}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${activeNav === item.id ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' : `${ts} hover:bg-gray-50 ${dark ? 'hover:bg-gray-800 hover:text-gray-200' : ''}`
                                        }`}>
                                    {item.icon} {item.label}
                                    {item.badge > 0 && <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${activeNav === item.id ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-600'}`}>{item.badge}</span>}
                                </button>
                            ))}
                        </div>

                        <div className={`my-2 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

                        {/* ── FAVORITES ── fully functional */}
                        <button onClick={() => setModal('favorites')}
                            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold ${ts} hover:bg-gray-50 ${dark ? 'hover:bg-gray-800 hover:text-gray-200' : ''} transition group`}>
                            <span className="text-yellow-400">{Ico.star}</span>
                            Favorites
                            <span className={`ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition`}>
                                <span className="hover:text-blue-500">{Ico.plus}</span>
                            </span>
                        </button>

                        {/* ── PROJECTS ── fully functional */}
                        <button onClick={() => setModal('projects')}
                            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold ${ts} hover:bg-gray-50 ${dark ? 'hover:bg-gray-800 hover:text-gray-200' : ''} transition group`}>
                            <span className="text-blue-500">{Ico.folder}</span>
                            Projects
                            <span className={`ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition`}>
                                <span className="hover:text-blue-500">{Ico.plus}</span>
                            </span>
                        </button>
                    </div>

                    {/* Bottom */}
                    <div className="p-2 border-t" style={{ borderColor: dark ? '#1f2937' : '#f3f4f6' }}>
                        <button onClick={() => setModal('settings')}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold ${ts} hover:bg-gray-50 ${dark ? 'hover:bg-gray-800' : ''} transition`}>
                            {Ico.settings} Settings
                        </button>
                        <button onClick={() => setModal('help')}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold ${ts} hover:bg-gray-50 ${dark ? 'hover:bg-gray-800' : ''} transition`}>
                            {Ico.help} Help Center
                        </button>

                        {/* ── PROFILE ── */}
                        <div className="relative mt-1" ref={profileRef}>
                            <button onClick={() => setProfileOpen(v => !v)}
                                className={`w-full flex items-center gap-2 p-2 rounded-xl border transition-all ${dark ? 'border-gray-800 hover:border-blue-700 hover:bg-gray-800' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50'}`}>
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">AD</div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className={`text-[10px] font-bold ${tp} truncate`}>Admin User</p>
                                    <p className={`text-[8px] ${ts} truncate`}>admin@bookbuybd.com</p>
                                </div>
                                <span className={ts}>{Ico.chevD}</span>
                            </button>

                            {/* Profile dropdown — three working buttons */}
                            {profileOpen && (
                                <div className={`absolute bottom-full left-0 right-0 mb-1 rounded-xl border shadow-xl overflow-hidden z-50 fi ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                                    {/* Header */}
                                    <div className={`p-3 border-b flex items-center gap-2 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">AD</div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold ${tp} truncate`}>Admin User</p>
                                            <span className="text-[9px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">Admin</span>
                                        </div>
                                    </div>
                                    {/* Profile Settings */}
                                    <button onClick={() => { setProfileOpen(false); setModal('profile'); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all ${dark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                        <span style={{ color: '#3b82f6' }}>{Ico.edit}</span> Profile Settings
                                    </button>
                                    {/* Billing & Plan */}
                                    <button onClick={() => { setProfileOpen(false); setModal('billing'); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all ${dark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                        <span style={{ color: '#8b5cf6' }}>{Ico.credit}</span> Billing & Plan
                                    </button>
                                    {/* Team Members */}
                                    <button onClick={() => { setProfileOpen(false); setModal('team'); }}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition-all ${dark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                                        <span style={{ color: '#10b981' }}>{Ico.team}</span> Team Members
                                    </button>
                                    {/* Divider + Sign Out */}
                                    <div className={`h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                                    <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className={`h-12 flex items-center justify-between px-5 border-b ${bdr} ${sbBg} flex-shrink-0 z-10 transition-colors duration-300`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebar(v => !v)}
                            className={`w-7 h-7 flex items-center justify-center rounded-lg ${ts} hover:bg-gray-100 ${dark ? 'hover:bg-gray-800' : ''} transition`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                            <span className="text-blue-600">{navItems.find(n => n.id === activeNav)?.icon}</span>
                            <span className={`text-sm font-bold ${tp}`}>{navItems.find(n => n.id === activeNav)?.label ?? 'Dashboard'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[11px] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" style={{ animation: 'pulse 2s infinite' }} />
                            Live
                        </div>
                        {searchOpen ? (
                            <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <span className={ts}>{Ico.search}</span>
                                <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                                    placeholder="Search..." className={`text-xs outline-none bg-transparent w-32 ${dark ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`} />
                                <button onClick={() => { setSearchOpen(false); setSearchQ(''); }} className="text-gray-400 hover:text-gray-600">{Ico.x}</button>
                            </div>
                        ) : (
                            <button onClick={() => setSearchOpen(true)} className={`w-8 h-8 flex items-center justify-center rounded-xl ${ts} hover:bg-gray-100 ${dark ? 'hover:bg-gray-800' : ''} transition`}>{Ico.search}</button>
                        )}
                        <button className={`w-8 h-8 flex items-center justify-center rounded-xl ${ts} hover:bg-gray-100 ${dark ? 'hover:bg-gray-800' : ''} transition`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                        </button>
                        <button onClick={() => setModal('notifs')} className={`relative w-8 h-8 flex items-center justify-center rounded-xl ${ts} hover:bg-gray-100 ${dark ? 'hover:bg-gray-800' : ''} transition`}>
                            {Ico.bell}
                            {unread > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[7px] font-black flex items-center justify-center">{unread}</span>}
                        </button>
                        <button className={`flex items-center gap-1.5 text-[11px] font-semibold border rounded-xl px-3 py-1.5 transition ${dark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                            {Ico.cloud} Import
                        </button>
                        <button className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-blue-600 rounded-xl px-3 py-1.5 hover:bg-blue-700 transition shadow-sm shadow-blue-200">
                            {Ico.export} Export
                        </button>
                    </div>
                </div>

                {/* Page */}
                <div className="flex-1 overflow-y-auto p-4">{renderPage()}</div>
            </div>

            {/* ── MODALS ── */}
            {modal === 'settings' && <SettingsPanel dark={dark} setDark={setDark} onClose={() => setModal(null)} />}
            {modal === 'help' && <HelpPanel dark={dark} onClose={() => setModal(null)} />}
            {modal === 'notifs' && <NotifPanel dark={dark} onClose={() => setModal(null)} />}
            {modal === 'profile' && <ProfileForm dark={dark} onClose={() => setModal(null)} />}
            {modal === 'billing' && <BillingPanel dark={dark} onClose={() => setModal(null)} />}
            {modal === 'team' && <TeamPanel dark={dark} onClose={() => setModal(null)} />}
            {modal === 'favorites' && <FavoritesModal dark={dark} onClose={() => setModal(null)} />}
            {modal === 'projects' && <ProjectsModal dark={dark} onClose={() => setModal(null)} />}
        </div>
    );
}