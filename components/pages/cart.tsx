'use client';
import { useState, useRef } from 'react';
import { CartItem, INITIAL_CART, DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from './cartStore';

/* ── fallback image ── */
function Img({ src, alt = '', className = '', fallback = '#e2e8f0' }: { src: string; alt?: string; className?: string; fallback?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={className} style={{ background: fallback }} />;
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

/* ── qty stepper ── */
function QtyBtn({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold transition-all"
      style={{
        background: disabled ? '#f1f5f9' : '#eff6ff',
        color: disabled ? '#cbd5e1' : '#1E3A8A',
        border: '1px solid',
        borderColor: disabled ? '#e2e8f0' : '#bfdbfe',
      }}
    >
      {children}
    </button>
  );
}

interface CartProps {
  onCheckout: (items: CartItem[]) => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [removing, setRemoving] = useState<number | null>(null);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
    ));
  };

  const removeItem = (id: number) => {
    setRemoving(id);
    setTimeout(() => {
      setItems(prev => prev.filter(it => it.id !== id));
      setRemoving(null);
    }, 350);
  };

  const subtotal  = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery  = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total     = subtotal - discount + delivery;
  const savings   = items.reduce((s, it) => s + ((it.originalPrice ?? it.price) - it.price) * it.qty, 0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'BOOK10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  const INPUT = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .cart-root { font-family:'DM Sans',sans-serif; background:#f8fafc; min-height:100vh; }
        @keyframes fadeSlideIn  { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeSlideOut { from{opacity:1;transform:translateX(0)}    to{opacity:0;transform:translateX(30px);max-height:120px} }
        @keyframes countUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .item-enter { animation: fadeSlideIn .3s cubic-bezier(.22,1,.36,1) both; }
        .item-exit  { animation: fadeSlideOut .35s cubic-bezier(.22,1,.36,1) both; }
        .count-anim { animation: countUp .25s cubic-bezier(.22,1,.36,1) both; }
        .summary-card { background:#fff; border-radius:20px; padding:24px; box-shadow:0 2px 16px rgba(0,0,0,0.06); border:1px solid #e8f0e9; }
        .cart-item { background:#fff; border-radius:16px; padding:16px; border:1px solid #e8f0e9; box-shadow:0 1px 4px rgba(0,0,0,0.04); transition:box-shadow .2s; }
        .cart-item:hover { box-shadow:0 4px 16px rgba(30,58,138,0.10); }
        .badge-free { background:#dbeafe; color:#1E3A8A; font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; }
      `}</style>

      <div className="cart-root">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 style={{ fontFamily: 'Lora,serif', fontSize: 26, fontWeight: 700, color: '#0f172a' }}>
                My Cart
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {/* Progress bar toward free delivery */}
            <div className="hidden md:flex flex-col items-end gap-1" style={{ minWidth: 220 }}>
              <p style={{ fontSize: 12, color: '#64748b' }}>
                {subtotal >= FREE_DELIVERY_THRESHOLD
                  ? <span className="badge-free">🎉 Free delivery unlocked!</span>
                  : <>Add <strong style={{ color: '#1E3A8A' }}>৳{FREE_DELIVERY_THRESHOLD - subtotal}</strong> more for free delivery</>
                }
              </p>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#e8f0e9' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`, background: 'linear-gradient(90deg,#3A9AFF,#60A5FA)' }}
                />
              </div>
            </div>
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: '#eff6ff' }}>
                <svg className="w-12 h-12" fill="none" stroke="#3A9AFF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <p style={{ fontFamily: 'Lora,serif', fontSize: 20, fontWeight: 600, color: '#1e293b' }}>Your cart is empty</p>
              <p style={{ fontSize: 14, color: '#64748b' }}>Add some books to get started!</p>
              <button className="btn-primary mt-2" style={{ background: '#3A9AFF', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 28px', fontWeight: 700, cursor: 'pointer' }}>
                Browse Books
              </button>
            </div>
          )}

          {items.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── ITEMS ── */}
              <div className="flex-1 flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`cart-item ${removing === item.id ? 'item-exit' : 'item-enter'}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex gap-4">
                      {/* Cover */}
                      <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-md" style={{ width: 72, height: 100 }}>
                        <Img src={item.cover} alt={item.title} className="w-full h-full object-cover" fallback={item.coverFallback} />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', lineHeight: 1.3 }}>{item.title}</p>
                            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.author}</p>
                            <span style={{ fontSize: 11, background: '#eff6ff', color: '#1E3A8A', border: '1px solid #bfdbfe', borderRadius: 6, padding: '1px 7px', display: 'inline-block', marginTop: 4, fontWeight: 600 }}>
                              {item.edition}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all"
                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#1E3A8A' }}>৳{(item.price * item.qty).toLocaleString()}</span>
                            {item.originalPrice && (
                              <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>৳{(item.originalPrice * item.qty).toLocaleString()}</span>
                            )}
                          </div>
                          {/* Qty */}
                          <div className="flex items-center gap-2">
                            <QtyBtn onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}>−</QtyBtn>
                            <span key={item.qty} className="count-anim" style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', minWidth: 20, textAlign: 'center' }}>
                              {item.qty}
                            </span>
                            <QtyBtn onClick={() => updateQty(item.id, 1)}>+</QtyBtn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div className="summary-card mt-2">
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>Have a coupon?</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code (try: BOOK10)"
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                      className={INPUT}
                      style={{ borderColor: couponApplied ? '#3A9AFF' : couponError ? '#ef4444' : undefined }}
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0"
                      style={{ background: couponApplied ? '#3A9AFF' : '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                      {couponApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{couponError}</p>}
                  {couponApplied && <p style={{ fontSize: 12, color: '#3A9AFF', marginTop: 6, fontWeight: 600 }}>🎉 10% discount applied!</p>}
                </div>
              </div>

              {/* ── ORDER SUMMARY ── */}
              <div style={{ width: 300, flexShrink: 0 }}>
                <div className="summary-card sticky top-6">
                  <h2 style={{ fontFamily: 'Lora,serif', fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>Order Summary</h2>

                  <div className="flex flex-col gap-3" style={{ fontSize: 13 }}>
                    <div className="flex justify-between">
                      <span style={{ color: '#64748b' }}>Subtotal ({items.reduce((s, it) => s + it.qty, 0)} items)</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>৳{subtotal.toLocaleString()}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between">
                        <span style={{ color: '#3A9AFF' }}>You save</span>
                        <span style={{ fontWeight: 700, color: '#3A9AFF' }}>−৳{savings.toLocaleString()}</span>
                      </div>
                    )}
                    {couponApplied && (
                      <div className="flex justify-between">
                        <span style={{ color: '#3A9AFF' }}>Coupon (BOOK10)</span>
                        <span style={{ fontWeight: 700, color: '#3A9AFF' }}>−৳{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#64748b' }}>Delivery</span>
                      {delivery === 0
                        ? <span className="badge-free">FREE</span>
                        : <span style={{ fontWeight: 600, color: '#1e293b' }}>৳{delivery}</span>
                      }
                    </div>
                  </div>

                  <div className="my-4" style={{ height: 1, background: '#e8f0e9' }} />

                  <div className="flex justify-between items-center mb-5">
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 20, color: '#1E3A8A' }}>৳{total.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => onCheckout(items)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all"
                    style={{ background: 'linear-gradient(135deg,#3A9AFF,#1D4ED8)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(58,154,255,0.35)' }}
                  >
                    Proceed to Checkout
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>

                  <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
                    🔒 Secure checkout · Cash on Delivery available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
