'use client';
import { useState } from 'react';
import { PrintingCheckoutForm } from './printingStore';

// Optional static dataset - you could sync this with the main store in reality
const DISTRICTS = [
    'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
    'Cumilla', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Bogura', 'Pabna', 'Noakhali'
];

interface EmergencyCheckoutProps {
    form: PrintingCheckoutForm;
    onBack: () => void;
    onNext: (form: PrintingCheckoutForm) => void;
}

type Errors = Partial<Record<keyof PrintingCheckoutForm, string>>;
const REQUIRED: (keyof PrintingCheckoutForm)[] = ['fullName', 'phone', 'address', 'city', 'division'];

function validate(f: PrintingCheckoutForm): Errors {
    const e: Errors = {};
    if (!f.fullName.trim()) e.fullName = 'Full name is required';
    if (!f.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^(\+8801|01)[0-9]{9}$/.test(f.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid BD phone number';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email';
    if (!f.address.trim()) e.address = 'Delivery address is required';
    if (!f.city.trim()) e.city = 'City / Thana is required';
    if (!f.division) e.division = 'Please select a district/division';
    return e;
}

export default function EmergencyCheckout({ form, onBack, onNext }: EmergencyCheckoutProps) {
    const [local, setLocal] = useState<PrintingCheckoutForm>(form);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());

    const set = (k: keyof PrintingCheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.target.value;
        setLocal(f => ({ ...f, [k]: val }));
        setTouched(t => new Set([...t, k]));
        if (touched.has(k)) {
            setErrors(prev => ({ ...prev, [k]: validate({ ...local, [k]: val })[k] }));
        }
    };

    const handleNext = () => {
        const errs = validate(local);
        setErrors(errs);
        setTouched(new Set(Object.keys(local)));
        if (Object.keys(errs).length === 0) onNext(local);
    };

    const INPUT_BASE = 'w-full px-4 py-3 text-sm rounded-xl border transition-all bg-white outline-none';
    const INPUT_OK = `${INPUT_BASE} border-gray-200 focus:border-[#3A9AFF] focus:ring-2 focus:ring-blue-100`;
    const INPUT_ERR = `${INPUT_BASE} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50`;
    const fieldCls = (k: keyof PrintingCheckoutForm) => touched.has(k) && errors[k] ? INPUT_ERR : INPUT_OK;

    return (
        <div className="max-w-3xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl transition bg-white border border-gray-200 cursor-pointer hover:border-gray-300">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Lora', serif" }}>Delivery Information</span>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                        <input type="text" className={fieldCls('fullName')} placeholder="Jamiul Alam" value={local.fullName} onChange={set('fullName')} />
                        {touched.has('fullName') && errors.fullName && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number *</label>
                        <input type="tel" className={fieldCls('phone')} placeholder="017xxxxxxxx" value={local.phone} onChange={set('phone')} />
                        {touched.has('phone') && errors.phone && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input type="email" className={fieldCls('email')} placeholder="jamiul@example.com" value={local.email} onChange={set('email')} />
                        {touched.has('email') && errors.email && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>}
                    </div>
                </div>

                <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Detailed Address *</label>
                        <input type="text" className={fieldCls('address')} placeholder="House, Road, Block, Area..." value={local.address} onChange={set('address')} />
                        {touched.has('address') && errors.address && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.address}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">District / Division *</label>
                        <div className="relative">
                            <select className={fieldCls('division')} style={{ appearance: 'none' }} value={local.division} onChange={set('division')}>
                                <option value="">Select District</option>
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                        {touched.has('division') && errors.division && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.division}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">City / Thana *</label>
                        <input type="text" className={fieldCls('city')} placeholder="e.g. Dhanmondi / Mirpur" value={local.city} onChange={set('city')} />
                        {touched.has('city') && errors.city && <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.city}</p>}
                    </div>
                </div>

                <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${local.paymentMethod === 'cod' ? 'border-[#3A9AFF] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="w-5 h-5 rounded-full border-2 border-[#3A9AFF] flex items-center justify-center">
                            {local.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#3A9AFF] rounded-full" />}
                        </div>
                        <input type="radio" className="hidden" checked={local.paymentMethod === 'cod'} onChange={() => setLocal({ ...local, paymentMethod: 'cod' })} />
                        <div className="font-bold text-sm text-gray-800">Cash on Delivery</div>
                    </label>

                    <label className={`border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${local.paymentMethod === 'bkash' ? 'border-[#e2136e] bg-pink-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors" style={{ borderColor: local.paymentMethod === 'bkash' ? '#e2136e' : '#e2e8f0' }}>
                            {local.paymentMethod === 'bkash' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e2136e' }} />}
                        </div>
                        <input type="radio" className="hidden" checked={local.paymentMethod === 'bkash'} onChange={() => setLocal({ ...local, paymentMethod: 'bkash' })} />
                        <div className="font-bold text-sm text-gray-800">bKash Payment</div>
                    </label>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-[#3A9AFF] to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all w-full text-sm"
                    >
                        Review Order
                    </button>
                </div>
            </div>
        </div>
    );
}
