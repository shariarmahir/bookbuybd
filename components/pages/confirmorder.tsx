'use client';
import { useState, useEffect, useRef } from 'react';
import { CartItem, CheckoutForm, DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from './cartStore';

function Img({ src, alt = '', className = '', fallback = '#e2e8f0' }: { src: string; alt?: string; className?: string; fallback?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={className} style={{ background: fallback }} />;
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

/* ── Confetti particle ── */
interface Particle { id: number; x: number; size: number; color: string; delay: number; duration: number; shape: 'rect' | 'circle'; }
const CONFETTI_COLORS = ['#3b82f6', '#60a5fa', '#f59e0b', '#a78bfa', '#ec4899', '#34d399', '#f97316', '#fff'];
function makeParticles(n = 80): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 5 + Math.random() * 9,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 1.4,
    duration: 2.2 + Math.random() * 1.8,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));
}

interface ConfirmOrderProps {
  items: CartItem[];
  form: CheckoutForm;
  onContinueShopping: () => void;
}

const TRACK_STEPS = [
  {
    label: 'Order Placed',
    sub: 'Just now',
    done: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    label: 'Packing',
    sub: 'Within 24h',
    done: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11m0 0L4 7" />
      </svg>
    ),
  },
  {
    label: 'Out for Delivery',
    sub: '2–4 days',
    done: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    label: 'Delivered',
    sub: '3–5 days',
    done: false,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

export default function ConfirmOrder({ items, form, onContinueShopping }: ConfirmOrderProps) {
  const [checkDone, setCheckDone] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [detailsVis, setDetailsVis] = useState(false);
  const [confettiOn, setConfettiOn] = useState(true);
  const [particles] = useState<Particle[]>(makeParticles(80));
  const orderRef = useRef(`BBD-${Date.now().toString(36).toUpperCase().slice(-7)}`);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + delivery;

  useEffect(() => {
    const t1 = setTimeout(() => setCheckDone(true), 700);
    const t2 = setTimeout(() => setTextVisible(true), 1100);
    const t3 = setTimeout(() => setDetailsVis(true), 1600);
    const t4 = setTimeout(() => setConfettiOn(false), 3500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const handleDownload = () => {
    const lines = [
      `============================`,
      `   BookBuyBD – ORDER RECEIPT`,
      `============================`,
      `Order ID   : ${orderRef.current}`,
      `Date       : ${new Date().toLocaleDateString('en-GB')}`,
      ``,
      `DELIVER TO`,
      `----------`,
      `Name       : ${form.fullName}`,
      `Phone      : ${form.phone}`,
      `Email      : ${form.email || '—'}`,
      `Address    : ${form.address}`,
      `City       : ${form.city}, ${form.district}`,
      ``,
      `ITEMS`,
      `-----`,
      ...items.map(it => `${it.title} (×${it.qty})  ৳${(it.price * it.qty).toLocaleString()}`),
      ``,
      `Subtotal   : ৳${subtotal.toLocaleString()}`,
      `Delivery   : ${delivery === 0 ? 'FREE' : '৳' + delivery}`,
      `TOTAL (COD): ৳${total.toLocaleString()}`,
      ``,
      `Thank you for shopping with BookBuyBD!`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderRef.current}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .co-root { font-family:'Plus Jakarta Sans',sans-serif; background:#f4f6f9; min-height:100vh; }

        /* confetti */
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(820deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed; top: -12px; animation: confettiFall var(--dur) var(--delay) ease-in forwards;
          pointer-events: none; z-index: 200;
        }

        /* success ring */
        @keyframes ringDraw {
          from { stroke-dashoffset: 283; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes checkPop {
          0%   { opacity:0; transform:scale(0) rotate(-30deg); }
          70%  { transform:scale(1.2) rotate(8deg); }
          100% { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes ringGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
          50%     { box-shadow: 0 0 0 22px rgba(59,130,246,0); }
        }
        .ring-svg circle {
          stroke-dasharray: 283; stroke-dashoffset: 283;
          animation: ringDraw .7s .15s cubic-bezier(.22,1,.36,1) forwards;
        }
        .check-icon { opacity: 0; animation: checkPop .45s .88s cubic-bezier(.22,1,.36,1) forwards; }
        .ring-glow  { animation: ringGlow 2.4s 1.5s ease-in-out infinite; }

        /* entries */
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .text-in   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
        .detail-in { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }

        /* shimmer CTA */
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        .btn-shimmer::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:translateX(-100%);
          transition: none;
        }
        .btn-shimmer:hover::after { animation: shimmer .75s ease forwards; }
      `}</style>

      {/* ── Confetti ── */}
      {confettiOn && particles.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.shape === 'rect' ? p.size * 0.45 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 3,
            '--dur': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      <div className="co-root">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* ══ HERO – dark banner ══ */}
          <div
            className="relative rounded-[3rem] overflow-hidden mb-10 flex flex-col items-center justify-center py-16 px-6 text-center"
            style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1d4ed8 100%)' }}
          >
            {/* Soft glow blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-[120px] opacity-30" style={{ background: '#3b82f6' }} />
            <div className="absolute bottom-0 right-10 w-56 h-56 rounded-full blur-[100px] opacity-20" style={{ background: '#8b5cf6' }} />

            {/* Animated check ring */}
            <div
              className="ring-glow relative flex items-center justify-center mb-8 z-10"
              style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '3px solid rgba(59,130,246,0.4)' }}
            >
              <svg className="ring-svg absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              </svg>
              {checkDone && (
                <svg className="check-icon w-14 h-14 z-10" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {textVisible && (
              <div className="text-in z-10">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-snug">
                  Order Confirmed! 🎉
                </h1>
                <p className="text-blue-200/80 text-base font-semibold mt-3 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-black">{form.fullName}</span>! Your books are packed and on their way.
                </p>

                {/* Order ID badge */}
                <div className="inline-flex items-center gap-3 mt-6 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Order ID</span>
                  <span className="text-white font-black text-base tracking-tight">{orderRef.current}</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                {/* ETA chips */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                    <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-xs font-bold text-blue-100">3–5 Business Days</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="text-xs font-bold text-emerald-300">Cash on Delivery ৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {detailsVis && (
            <div className="flex flex-col gap-8">

              {/* ══ ORDER TRACKER ══ */}
              <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-xl shadow-gray-100/20 detail-in" style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Live Order Status</h2>
                </div>

                <div className="relative flex items-start justify-between">
                  {/* Background connecting line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" style={{ zIndex: 0 }} />
                  {/* Active segment */}
                  <div className="absolute top-5 left-5 h-0.5 bg-blue-500 transition-all duration-1000" style={{ width: '0%', zIndex: 0 }} />

                  {TRACK_STEPS.map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 shadow-sm transition-all ${step.done ? 'bg-blue-600 border-white text-white shadow-blue-200' : 'bg-white border-gray-100 text-gray-300'}`}>
                        {step.icon}
                      </div>
                      <div className="text-center">
                        <p className={`text-[11px] font-black uppercase tracking-wide ${step.done ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${step.done ? 'text-blue-500' : 'text-gray-200'}`}>{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ══ TWO COLUMNS ══ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Items + Pricing */}
                <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 border border-gray-50 shadow-xl shadow-gray-100/20 detail-in" style={{ animationDelay: '.06s' }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                      Your Books <span className="text-gray-400 font-semibold text-sm">({items.reduce((s, it) => s + it.qty, 0)})</span>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4 items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-all">
                        <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-md" style={{ width: 52, height: 72 }}>
                          <Img src={item.cover} alt={item.title} className="w-full h-full object-cover" fallback={item.coverFallback} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-sm leading-snug">{item.title}</p>
                          <p className="text-xs text-gray-400 font-semibold mt-1">{item.author} · {item.edition}</p>
                          <span className="inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 rounded-full">×{item.qty}</span>
                        </div>
                        <span className="text-base font-black text-gray-900 flex-shrink-0">
                          ৳{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing breakdown */}
                  <div className="mt-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-semibold">Subtotal</span>
                      <span className="font-black text-gray-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-400 font-semibold">Delivery</span>
                      {delivery === 0
                        ? <span className="px-3 py-0.5 text-[10px] font-black uppercase tracking-wide rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">FREE</span>
                        : <span className="font-black text-gray-900">৳{delivery}</span>
                      }
                    </div>
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-black text-gray-900">Total (Cash on Delivery)</span>
                      <span className="text-2xl font-black text-emerald-600">৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* COD reminder */}
                  <div className="mt-5 flex items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <p className="text-sm font-bold text-blue-800 leading-relaxed">
                      No payment now! Pay <span className="font-black">৳{total.toLocaleString()}</span> in cash when your books arrive at your door 🤝
                    </p>
                  </div>
                </div>

                {/* Right: Delivery address + Note */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden detail-in" style={{ animationDelay: '.12s' }}>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[70px] opacity-20" style={{ background: '#3b82f6' }} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-blue-400 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-black tracking-tight">Delivering To</h2>
                      </div>

                      <div className="space-y-4">
                        {[
                          { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />, value: form.fullName },
                          { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />, value: form.phone },
                          ...(form.email ? [{ icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, value: form.email }] : []),
                          { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />, value: form.address },
                          { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />, value: `${form.city}, ${form.district}${form.postalCode ? ' ' + form.postalCode : ''}` },
                        ].map((r, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{r.icon}</svg>
                            <span className="text-sm font-semibold text-gray-200 leading-snug">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customer note */}
                  {form.note.trim() && (
                    <div className="bg-amber-50 rounded-[2rem] p-7 border border-amber-100 shadow-sm detail-in" style={{ animationDelay: '.18s' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h3 className="text-base font-black text-amber-900">Your Note</h3>
                      </div>
                      <p className="text-sm text-amber-800 font-medium italic leading-relaxed">"{form.note}"</p>
                    </div>
                  )}

                  {/* Support note */}
                  <p className="text-[11px] text-gray-400 font-semibold text-center leading-relaxed px-4">
                    Need help? Contact us at <span className="text-blue-500 font-black">support@bookbuybd.com</span>
                    <br />Order ID: <span className="font-black text-gray-600">{orderRef.current}</span>
                  </p>
                </div>
              </div>

              {/* ══ CTA BUTTONS ══ */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 detail-in" style={{ animationDelay: '.22s' }}>
                <button
                  onClick={onContinueShopping}
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                  Continue Shopping
                </button>

                <button
                  onClick={handleDownload}
                  className="btn-shimmer group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white transition-all hover:-translate-y-1"
                  style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}
                >
                  <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Receipt
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
