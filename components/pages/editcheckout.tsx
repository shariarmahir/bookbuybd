'use client';
import { useState } from 'react';
import { CheckoutForm, DISTRICTS } from './cartStore';

type Errors = Partial<Record<keyof CheckoutForm, string>>;

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

interface EditCheckoutProps {
  initial: CheckoutForm;
  onSave: (form: CheckoutForm) => void;
  onBack: () => void;
}

export default function EditCheckout({ initial, onSave, onBack }: EditCheckoutProps) {
  const [form,    setForm]    = useState<CheckoutForm>(initial);
  const [errors,  setErrors]  = useState<Errors>({});
  const [saved,   setSaved]   = useState(false);

  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    const newErrors = validate({ ...form, [k]: val });
    setErrors(prev => ({ ...prev, [k]: newErrors[k] }));
    setSaved(false);
  };

  const handleSave = () => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSaved(true);
      setTimeout(() => onSave(form), 600);
    }
  };

  const INPUT_BASE = 'w-full px-4 py-3 text-sm rounded-xl border transition-all bg-white outline-none';
  const INPUT_OK   = `${INPUT_BASE} border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100`;
  const INPUT_ERR  = `${INPUT_BASE} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50`;
  const fieldCls = (k: keyof CheckoutForm) => errors[k] ? INPUT_ERR : INPUT_OK;

  const hasChanges = JSON.stringify(form) !== JSON.stringify(initial);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .ec-root { font-family:'DM Sans',sans-serif; background:#f8fafc; min-height:100vh; }
        @keyframes ecUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ecPop { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        .ec-a  { animation: ecUp  .4s cubic-bezier(.22,1,.36,1) both; }
        .ec-pop{ animation: ecPop .35s cubic-bezier(.22,1,.36,1) both; }
        .card  { background:#fff; border-radius:20px; padding:24px; box-shadow:0 2px 16px rgba(0,0,0,0.06); border:1px solid #e8f0e9; }
        label  { display:block; font-size:12px; font-weight:600; color:#374151; margin-bottom:5px; }
        select { appearance:none; -webkit-appearance:none; }
        .change-badge { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; background:#fef3c7; color:#d97706; border:1px solid #fde68a; }
        .note-area { width:100%; padding:14px; border-radius:16px; border:1.5px solid #e2e8f0; font-size:13px; font-family:'DM Sans',sans-serif; resize:vertical; min-height:90px; outline:none; transition:border-color .2s; background:#fff; }
        .note-area:focus { border-color:#3A9AFF; box-shadow:0 0 0 3px rgba(58,154,255,0.12); }
      `}</style>

      <div className="ec-root">
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8 ec-a">
            <button onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl transition"
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <svg className="w-4 h-4" fill="none" stroke="#64748b" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="flex-1">
              <h1 style={{ fontFamily: 'Lora,serif', fontSize: 22, fontWeight: 700, color: '#0f172a' }}>
                Edit Delivery Info
              </h1>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Update your delivery details below</p>
            </div>
            {hasChanges && <span className="change-badge">Unsaved changes</span>}
          </div>

          {/* Form */}
          <div className="card ec-a flex flex-col gap-5">
            <h2 style={{ fontFamily: 'Lora,serif', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              📦 Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <div className="sm:col-span-2">
                <label>Full Name *</label>
                <input type="text" value={form.fullName} onChange={set('fullName')}
                  className={fieldCls('fullName')} placeholder="e.g. Arifbillah Rahman" />
                {errors.fullName && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  className={fieldCls('phone')} placeholder="01XXXXXXXXX" />
                {errors.phone && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label>Email (optional)</label>
                <input type="email" value={form.email} onChange={set('email')}
                  className={fieldCls('email')} placeholder="yourname@email.com" />
                {errors.email && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.email}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label>Full Delivery Address *</label>
                <input type="text" value={form.address} onChange={set('address')}
                  className={fieldCls('address')} placeholder="House / Road / Area" />
                {errors.address && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <label>City / Thana *</label>
                <input type="text" value={form.city} onChange={set('city')}
                  className={fieldCls('city')} placeholder="e.g. Gulshan" />
                {errors.city && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.city}</p>}
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
                  <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
                {errors.district && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{errors.district}</p>}
              </div>

              {/* Postal */}
              <div>
                <label>Postal Code (optional)</label>
                <input type="text" value={form.postalCode} onChange={set('postalCode')}
                  className={INPUT_OK} placeholder="e.g. 1212" />
              </div>
            </div>

            {/* Note */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                💬 Customer Note
              </label>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                Any special instructions or delivery preference?
              </p>
              <textarea
                className="note-area"
                value={form.note}
                onChange={set('note')}
                maxLength={400}
                placeholder="e.g. Please call before delivery…"
              />
              <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 4 }}>
                {form.note.length}/400
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={onBack}
                className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: saved ? '#3A9AFF' : 'linear-gradient(135deg,#3A9AFF,#1D4ED8)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(58,154,255,0.30)',
                }}>
                {saved ? (
                  <span className="ec-pop flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    Saved!
                  </span>
                ) : (
                  <>
                    Save Changes
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
