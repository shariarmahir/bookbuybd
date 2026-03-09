'use client';
import { useState } from 'react';
import { CartItem, CheckoutForm, EMPTY_FORM, DISTRICTS, DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from './cartStore';

function Img({ src, alt = '', className = '', fallback = '#e2e8f0' }: { src: string; alt?: string; className?: string; fallback?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={className} style={{ background: fallback }} />;
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onConfirm: (form: CheckoutForm) => void;
  onEdit: (form: CheckoutForm) => void;
}

type Step = 'form' | 'review';
type Errors = Partial<Record<keyof CheckoutForm, string>>;

const REQUIRED: (keyof CheckoutForm)[] = ['fullName', 'phone', 'address', 'city', 'district'];

function validate(f: CheckoutForm): Errors {
  const e: Errors = {};
  if (!f.fullName.trim())  e.fullName  = 'Full name is required';
  if (!f.phone.trim())     e.phone     = 'Phone number is required';
  else if (!/^(\+8801|01)[0-9]{9}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid BD phone number';
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email';
  if (!f.address.trim())   e.address   = 'Delivery address is required';
  if (!f.city.trim())      e.city      = 'City / Thana is required';
  if (!f.district)         e.district  = 'Please select a district';
  return e;
}

export default function Checkout({ items, onBack, onConfirm, onEdit }: CheckoutProps) {
  const [step,   setStep]   = useState<Step>('form');
  const [form,   setForm]   = useState<CheckoutForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total    = subtotal + delivery;

  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setTouched(t => new Set([...t, k]));
    if (touched.has(k)) {
      const newErrors = validate({ ...form, [k]: val });
      setErrors(prev => ({ ...prev, [k]: newErrors[k] }));
    }
  };

  const handleNext = () => {
    const errs = validate(form);
    setErrors(errs);
    setTouched(new Set(Object.keys(form)));
    if (Object.keys(errs).length === 0) setStep('review');
  };

  const INPUT_BASE = 'w-full px-4 py-3 text-sm rounded-xl border transition-all bg-white outline-none';
  const INPUT_OK   = `${INPUT_BASE} border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100`;
  const INPUT_ERR  = `${INPUT_BASE} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50`;

  const fieldCls = (k: keyof CheckoutForm) =>
    touched.has(k) && errors[k] ? INPUT_ERR : INPUT_OK;

  const totalItems = items.reduce((s, it) => s + it.qty, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .ck-root { font-family:'DM Sans',sans-serif; background:#f8fafc; min-height:100vh; }
        @keyframes ckUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .ck-a { animation: ckUp .4s cubic-bezier(.22,1,.36,1) both; }
        .ck-a2{ animation: ckUp .4s .08s cubic-bezier(.22,1,.36,1) both; }
        .card  { background:#fff; border-radius:20px; padding:24px; box-shadow:0 2px 16px rgba(0,0,0,0.06); border:1px solid #e8f0e9; }
        label  { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:5px; }
        select { appearance:none; -webkit-appearance:none; cursor:pointer; }
        .step-dot { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; transition:all .25s; }
        .cod-card { border:2px solid #3A9AFF; background:#eff6ff; border-radius:16px; padding:16px; display:flex; align-items:center; gap:12px; cursor:pointer; }
        .note-area { width:100%; padding:14px; border-radius:16px; border:1.5px solid #e2e8f0; font-size:13px; font-family:'DM Sans',sans-serif; resize:vertical; min-height:90px; outline:none; transition:border-color .2s; background:#fff; }
        .note-area:focus { border-color:#3A9AFF; box-shadow:0 0 0 3px rgba(58,154,255,0.12); }
        .review-row { display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid #f1f5f9; }
        .review-row:last-child { border-bottom:none; }
      `}</style>

      <div className="ck-root">
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8 ck-a">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl transition"
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <svg className="w-4 h-4" fill="none" stroke="#64748b" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 style={{ fontFamily: 'Lora,serif', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Checkout</h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{totalItems} item{totalItems !== 1 ? 's' : ''} · ৳{total.toLocaleString()}</p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 ml-auto">
              {(['form', 'review'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="step-dot" style={{
                    background: step === s ? '#3A9AFF' : (step === 'review' && s === 'form') ? '#3A9AFF' : '#e8f0e9',
                    color:      step === s ? '#fff'   : (step === 'review' && s === 'form') ? '#fff'   : '#94a3b8',
                  }}>
                    {(step === 'review' && s === 'form') ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: step === s ? 700 : 500, color: step === s ? '#3A9AFF' : '#94a3b8' }}>
                    {s === 'form' ? 'Delivery Info' : 'Review'}
                  </span>
                  {i === 0 && <div style={{ width: 32, height: 2, background: step === 'review' ? '#3A9AFF' : '#e2e8f0', borderRadius: 2 }} />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── LEFT: FORM or REVIEW ── */}
            <div className="flex-1 min-w-0">
              {step === 'form' ? (
                <div className="flex flex-col gap-5 ck-a">

                  {/* Delivery Info */}
                  <div className="card">
                    <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
                      📦 Delivery Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Full name */}
                      <div className="sm:col-span-2">
                        <label>Full Name *</label>
                        <input type="text" placeholder="e.g. Arifbillah Rahman" value={form.fullName}
                          onChange={set('fullName')} className={fieldCls('fullName')} />
                        {touched.has('fullName') && errors.fullName && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.fullName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label>Phone Number *</label>
                        <input type="tel" placeholder="01XXXXXXXXX" value={form.phone}
                          onChange={set('phone')} className={fieldCls('phone')} />
                        {touched.has('phone') && errors.phone && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label>Email (optional)</label>
                        <input type="email" placeholder="yourname@email.com" value={form.email}
                          onChange={set('email')} className={fieldCls('email')} />
                        {touched.has('email') && errors.email && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label>Full Delivery Address *</label>
                        <input type="text" placeholder="House / Road / Area" value={form.address}
                          onChange={set('address')} className={fieldCls('address')} />
                        {touched.has('address') && errors.address && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.address}</p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label>City / Thana *</label>
                        <input type="text" placeholder="e.g. Gulshan" value={form.city}
                          onChange={set('city')} className={fieldCls('city')} />
                        {touched.has('city') && errors.city && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.city}</p>
                        )}
                      </div>

                      {/* District */}
                      <div>
                        <label>District *</label>
                        <div className="relative">
                          <select value={form.district} onChange={set('district')}
                            className={fieldCls('district')} style={{ paddingRight: 36 }}>
                            <option value="">Select district…</option>
                            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                          </svg>
                        </div>
                        {touched.has('district') && errors.district && (
                          <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.district}</p>
                        )}
                      </div>

                      {/* Postal */}
                      <div>
                        <label>Postal Code (optional)</label>
                        <input type="text" placeholder="e.g. 1212" value={form.postalCode}
                          onChange={set('postalCode')} className={INPUT_OK} />
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="card">
                    <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                      💳 Payment Method
                    </h2>
                    <div className="cod-card">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: '#dbeafe', border: '1.5px solid #3A9AFF' }}>
                        <svg className="w-5 h-5" fill="none" stroke="#3A9AFF" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p style={{ fontWeight: 700, fontSize: 14, color: '#1E3A8A' }}>Cash on Delivery</p>
                        <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Pay when your books arrive at your doorstep</p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: '#3A9AFF', background: '#3A9AFF' }}>
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                    </div>
                    <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 10 }}>
                      ✅ No advance payment required · Pay ৳{total.toLocaleString()} upon delivery
                    </p>
                  </div>

                  {/* Customer Note */}
                  <div className="card">
                    <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                      💬 Customer Note
                    </h2>
                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                      Any special instructions, gift message, or delivery preference? Let us know!
                    </p>
                    <textarea
                      className="note-area"
                      placeholder="e.g. Please call before delivery · This is a gift, please add a note card · Deliver after 6 PM…"
                      value={form.note}
                      onChange={set('note')}
                      maxLength={400}
                    />
                    <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 4 }}>
                      {form.note.length}/400
                    </p>
                  </div>

                  <button onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
                    style={{ background: 'linear-gradient(135deg,#3A9AFF,#1D4ED8)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(58,154,255,0.35)', fontSize: 15 }}>
                    Review Order
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

              ) : (
                /* ── REVIEW STEP ── */
                <div className="flex flex-col gap-5 ck-a">
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        📋 Delivery Details
                      </h2>
                      <button onClick={() => { onEdit(form); setStep('form'); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-700 transition"
                        style={{ background: '#eff6ff', color: '#3A9AFF', border: '1px solid #bfdbfe', cursor: 'pointer', fontWeight: 700 }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                        </svg>
                        Edit
                      </button>
                    </div>

                    {[
                      { label: 'Name',     val: form.fullName },
                      { label: 'Phone',    val: form.phone },
                      { label: 'Email',    val: form.email || '—' },
                      { label: 'Address',  val: form.address },
                      { label: 'City',     val: form.city },
                      { label: 'District', val: form.district },
                      { label: 'Postal',   val: form.postalCode || '—' },
                    ].map(r => (
                      <div key={r.label} className="review-row">
                        <span style={{ color: '#64748b', fontWeight: 500 }}>{r.label}</span>
                        <span style={{ color: '#1e293b', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{r.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
                      💳 Payment
                    </h2>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                      <svg className="w-5 h-5" fill="none" stroke="#3A9AFF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A8A' }}>Cash on Delivery</span>
                    </div>
                  </div>

                  {form.note.trim() && (
                    <div className="card">
                      <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                        💬 Your Note
                      </h2>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, background: '#f8fafc', borderRadius: 12, padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                        "{form.note}"
                      </p>
                    </div>
                  )}

                  <button onClick={() => onConfirm(form)}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg,#3A9AFF,#1D4ED8)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(58,154,255,0.35)', fontSize: 15 }}>
                    ✓ Confirm Order
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: order summary ── */}
            <div style={{ width: 280, flexShrink: 0 }} className="ck-a2">
              <div className="card sticky top-6">
                <h2 style={{ fontFamily: 'Lora,serif', fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
                  Your Order ({items.reduce((s, it) => s + it.qty, 0)})
                </h2>

                <div className="flex flex-col gap-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 42, height: 58 }}>
                        <Img src={item.cover} className="w-full h-full object-cover" fallback={item.coverFallback} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{item.title}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>×{item.qty} · {item.edition}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1E3A8A', marginTop: 2 }}>৳{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: '#e8f0e9', marginBottom: 12 }} />

                <div className="flex flex-col gap-2" style={{ fontSize: 13 }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#64748b' }}>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#64748b' }}>Delivery</span>
                    {delivery === 0
                      ? <span style={{ fontSize: 11, background: '#dbeafe', color: '#1E3A8A', borderRadius: 20, padding: '1px 8px', fontWeight: 700 }}>FREE</span>
                      : <span style={{ fontWeight: 600 }}>৳{delivery}</span>
                    }
                  </div>
                  <div style={{ height: 1, background: '#e8f0e9', margin: '4px 0' }} />
                  <div className="flex justify-between items-center">
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#1E3A8A' }}>৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
