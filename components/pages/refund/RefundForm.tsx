'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const requirements = [
    { id: 1, title: 'Original Condition', desc: 'Books must be in their original condition without any marks or damage.' },
    { id: 2, title: 'Time Frame', desc: 'Refund requests must be initiated within 7 days of delivery.' },
    { id: 3, title: 'Proof of Purchase', desc: 'A valid order ID and receipt/invoice are required for all returns.' },
    { id: 4, title: 'Return Type', desc: 'You can choose between a full fund refund or a replacement book.' },
];

export default function RefundForm() {
    const [formData, setFormData] = useState({
        orderId: '',
        email: '',
        reason: '',
        returnType: 'fund'
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto my-10 max-w-2xl rounded-3xl border border-emerald-50 bg-white p-6 text-center shadow-xl sm:my-20 sm:p-12"
            >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Request Submitted</h2>
                <p className="text-gray-600 mb-8">Your refund eligibility request has been received. Our team will review your order <strong>{formData.orderId}</strong> and get back to you via <strong>{formData.email}</strong> within 24-48 hours.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                >
                    Return Home
                </button>
            </motion.div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-20">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Left: Info & Requirements */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="mb-4 text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
                            Refund & Return <br />
                            <span className="text-brand-600 italic">Eligibility</span>
                        </h1>
                        <p className="text-lg text-gray-600">
                            We want you to love every book you buy. If something isn&apos;t right, our simple refund process is here to help.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Requirements
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {requirements.map((req) => (
                                <div key={req.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors group">
                                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">{req.title}</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">{req.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-brand-50 p-6 rounded-3xl border border-brand-100">
                        <p className="text-sm text-brand-800 font-medium">
                            <strong>Note:</strong> Books are eligible for refund only if there is a manufacturing defect or delivery damage.
                        </p>
                    </div>
                </motion.div>

                {/* Right: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-2xl shadow-gray-200/50 sm:rounded-[2.5rem] sm:p-8 md:p-10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Order ID</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="#BK-12345"
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Return Reason</label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all appearance-none"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    <option value="damaged">Damaged on arrival</option>
                                    <option value="wrong">Received wrong book</option>
                                    <option value="quality">Print quality issues</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">What would you prefer?</label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, returnType: 'fund' })}
                                        className={`py-4 rounded-2xl font-bold text-sm transition-all border ${formData.returnType === 'fund' ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-200'}`}
                                    >
                                        Full Fund Refund
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, returnType: 'book' })}
                                        className={`py-4 rounded-2xl font-bold text-sm transition-all border ${formData.returnType === 'book' ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-200'}`}
                                    >
                                        Book Replacement
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-4 text-base font-black text-white shadow-xl shadow-brand-200 transition-all hover:bg-brand-700 sm:py-5 sm:text-lg"
                        >
                            Verify Eligibility
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Securely processed by BookBuyBD
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
