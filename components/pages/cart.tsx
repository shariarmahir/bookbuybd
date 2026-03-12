'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CartItem,
  DEFAULT_DELIVERY_SETTINGS,
  DeliverySettings,
  calculateDeliveryCharge,
  getCartItemKey,
} from './cartStore';

/* ── Fallback image ── */
function Img({ src, alt = '', className = '', fallback = '#e2e8f0' }: { src?: string | null; alt?: string; className?: string; fallback?: string }) {
  const [err, setErr] = useState(false);
  const safeSrc = typeof src === 'string' ? src.trim() : '';
  if (err || !safeSrc) return <div className={className} style={{ background: fallback }} />;
  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={600}
      height={900}
      unoptimized
      loader={({ src: imageSrc }) => imageSrc}
      className={className}
      onError={() => setErr(true)}
    />
  );
}

interface CartProps {
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: () => void;
  deliverySettings?: DeliverySettings;
}

export default function Cart({
  items,
  setItems,
  onCheckout,
  deliverySettings = DEFAULT_DELIVERY_SETTINGS,
}: CartProps) {
  const [removing, setRemoving] = useState<string | null>(null);

  const updateQty = (itemKey: string, delta: number) => {
    const item = items.find((it) => getCartItemKey(it) === itemKey);
    if (!item) return;
    const maxQty = typeof item.stockQuantity === 'number' ? Math.max(1, Math.trunc(item.stockQuantity)) : Infinity;
    const nextQty = item.qty + delta;
    const boundedQty = Math.max(1, Math.min(nextQty, maxQty));
    if (boundedQty === item.qty) return;
    setItems((prev) => prev.map((it) => (getCartItemKey(it) === itemKey ? { ...it, qty: boundedQty } : it)));
  };

  const removeItem = (itemKey: string) => {
    setRemoving(itemKey);
    setTimeout(() => { setItems((prev) => prev.filter((it) => getCartItemKey(it) !== itemKey)); setRemoving(null); }, 400);
  };

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const discount = 0;
  const delivery = calculateDeliveryCharge(subtotal, deliverySettings);
  const total = subtotal - discount + delivery;
  const savings = items.reduce((s, it) => s + ((it.originalPrice ?? it.price) - it.price) * it.qty, 0);
  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const threshold = Math.max(0, deliverySettings.freeDeliveryThreshold);
  const freeProgress = threshold > 0 ? Math.min(100, (subtotal / threshold) * 100) : 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .cart-root { font-family:'Plus Jakarta Sans',sans-serif; background:#f4f6f9; min-height:100vh; }
        @keyframes slideRight { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideLeft  { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px);max-height:0;margin:0;padding:0;overflow:hidden} }
        @keyframes numPop { 0%{transform:scale(0.7)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
        .item-in   { animation: slideRight .4s cubic-bezier(.22,1,.36,1) both; }
        .item-out  { animation: slideLeft  .4s cubic-bezier(.22,1,.36,1) both; overflow:hidden; }
        .num-pop   { animation: numPop .25s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div className="cart-root">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">My Cart</h1>
              <p className="text-sm text-gray-400 font-semibold mt-1">{totalQty} {totalQty === 1 ? 'item' : 'items'} ready for checkout</p>
            </div>

            {/* Free delivery progress */}
            <div className="flex w-full flex-col gap-2 sm:min-w-[240px] sm:w-auto">
              {subtotal >= threshold ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-wide">Free Delivery Unlocked!</span>
                </div>
              ) : (
                <p className="text-xs font-semibold text-gray-500 sm:text-right">
                  Add <span className="text-blue-600 font-black">৳{Math.max(0, threshold - subtotal).toLocaleString()}</span> more for free delivery
                </p>
              )}
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${freeProgress}%`, background: 'linear-gradient(90deg,#3b82f6,#1d4ed8)' }}
                />
              </div>
            </div>
          </div>

          {/* ── Empty state ── */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-6 py-20 sm:py-32">
              <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center bg-blue-50 border border-blue-100 shadow-xl shadow-blue-100/50">
                <svg className="w-14 h-14 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-900 sm:text-2xl">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Discover thousands of books and add them here!</p>
              </div>
              <Link
                href="/"
                className="px-8 py-4 rounded-2xl font-black text-white text-sm transition-all hover:-translate-y-1 shadow-xl shadow-blue-200/50"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
              >
                Browse Books
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">

              {/* ── LEFT: Cart Items ── */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Books</h3>
                    <span className="text-xs font-bold text-gray-400">{items.length} items</span>
                  </div>
                  {items.map((item, idx) => {
                    const itemKey = getCartItemKey(item);
                    return (
                    <div
                      key={itemKey}
                      className={`group rounded-[1.75rem] border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/80 sm:p-5 ${removing === itemKey ? 'item-out' : 'item-in'}`}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="flex gap-3 sm:gap-5">
                        <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-28 sm:w-20">
                          <Img src={item.cover} alt={item.title} className="w-full h-full object-cover" fallback={item.coverFallback} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-gray-900 text-base leading-snug">{item.title}</p>
                              <p className="text-sm text-gray-400 font-semibold mt-1">{item.author}</p>
                              <span className="inline-block mt-2 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 rounded-full">{item.edition}</span>
                            </div>
                            <button
                              onClick={() => removeItem(itemKey)}
                              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-500 border border-gray-100 hover:border-rose-100"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-black text-gray-900 sm:text-xl">৳{(item.price * item.qty).toLocaleString()}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-300 line-through font-semibold">৳{(item.originalPrice * item.qty).toLocaleString()}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-50 border border-gray-100">
                              <button
                                onClick={() => updateQty(itemKey, -1)}
                                disabled={item.qty <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-xl font-black text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm text-gray-600"
                              >−</button>
                              <span key={item.qty} className="num-pop min-w-[2rem] text-center text-sm font-black text-gray-900">{item.qty}</span>
                              <button
                                onClick={() => updateQty(itemKey, 1)}
                                disabled={typeof item.stockQuantity === 'number' && item.qty >= Math.max(1, Math.trunc(item.stockQuantity))}
                                className="w-8 h-8 flex items-center justify-center rounded-xl font-black text-sm transition-all hover:bg-white hover:shadow-sm text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT: Dark Order Summary ── */}
              <div className="w-full flex-shrink-0 lg:w-[340px]">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-6 text-white shadow-2xl shadow-gray-900/30 sm:p-8 lg:sticky lg:top-6">
                  {/* Glow accent */}
                  <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-blue-600 rounded-full blur-[72px] opacity-30" />

                  <div className="relative z-10">
                    <h2 className="text-xl font-black tracking-tight mb-8">Order Summary</h2>

                    {/* Savings callout */}
                    {savings > 0 && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xs font-black text-emerald-400">You&apos;re saving <span className="text-emerald-300">৳{savings.toLocaleString()}</span> on this order!</p>
                      </div>
                    )}

                    {/* Line items */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-semibold">Subtotal ({totalQty} items)</span>
                        <span className="font-black">৳{subtotal.toLocaleString()}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-400 font-semibold">Coupon Discount</span>
                          <span className="font-black text-purple-400">−৳{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-semibold">Delivery</span>
                        {delivery === 0
                          ? <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">FREE</span>
                          : <span className="font-black">৳{delivery}</span>
                        }
                      </div>
                    </div>

                    <div className="h-px bg-white/10 mb-6" />

                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-black tracking-tighter sm:text-4xl">৳{total.toLocaleString()}</p>
                      </div>
                      {delivery === 0 && <span className="text-[10px] text-emerald-400 font-black uppercase">Free Shipping</span>}
                    </div>

                    <button
                      onClick={() => onCheckout()}
                      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-3xl py-4 text-sm font-black transition-all active:scale-95 hover:-translate-y-1 sm:py-5"
                      style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow: '0 6px 24px rgba(59,130,246,0.35)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      Proceed to Checkout
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <p className="text-[11px] text-gray-500 font-semibold">Secure checkout · Cash on Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}
