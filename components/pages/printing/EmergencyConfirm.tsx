'use client';
import { PrintingDetails, PrintingCheckoutForm } from './printingStore';

interface EmergencyConfirmProps {
    details: PrintingDetails;
    form: PrintingCheckoutForm;
    onBack: () => void;
    onSubmit: () => void;
}

export default function EmergencyConfirm({ details, form, onBack, onSubmit }: EmergencyConfirmProps) {
    return (
        <div className="max-w-4xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            <div className="flex items-center gap-3 mb-6">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl transition bg-white border border-gray-200 cursor-pointer hover:border-gray-300">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Lora', serif" }}>Review Printing Request</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Printing Details & Form Notes */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Printing Specifications</h2>

                        <div className="flex flex-col gap-4">
                            {/* Selected Items */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">Items Requested</div>
                                <div className="flex flex-wrap gap-2">
                                    {details.items.map(i => (
                                        <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-800">
                                            {i}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* File & Specs grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-gray-100 rounded-xl p-4">
                                    <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">File Attached</div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#3A9AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span className="text-sm font-bold text-gray-800 break-all">{details.file?.name}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="border border-gray-100 rounded-xl p-3 flex flex-col justify-center">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Quantity</div>
                                        <div className="text-lg font-black text-gray-900">{details.quantity} <span className="text-sm font-semibold text-gray-500">copies</span></div>
                                    </div>
                                    <div className="border border-gray-100 rounded-xl p-3 flex flex-col justify-center">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Color Form</div>
                                        <div className={`text-sm font-black ${details.color === 'Color' ? 'text-[#3A9AFF]' : 'text-gray-900'}`}>{details.color}</div>
                                    </div>
                                </div>
                            </div>

                            {details.notes && (
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                    <div className="text-xs text-[#3A9AFF] font-bold mb-1 uppercase tracking-wider">Instructions</div>
                                    <p className="text-sm text-gray-700 italic font-medium">{details.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Delivery & Submit */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Delivery Info</h2>

                        <div className="flex flex-col gap-3 text-sm">
                            <div>
                                <div className="text-[11px] text-gray-500 font-bold uppercase">Customer</div>
                                <div className="font-semibold text-gray-900">{form.fullName}</div>
                                <div className="text-gray-600">{form.phone}</div>
                            </div>
                            <div>
                                <div className="text-[11px] text-gray-500 font-bold uppercase mt-2">Address</div>
                                <div className="font-medium text-gray-800 leading-snug">{form.address}</div>
                                <div className="text-gray-600">{form.city}, {form.division}</div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="text-[11px] text-gray-500 font-bold uppercase mb-1.5">Payment Method</div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="font-bold text-gray-800">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'bKash Payment'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {details.isEmergency && (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3">
                            <svg className="w-6 h-6 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div>
                                <div className="text-sm font-bold text-rose-800">Emergency Request</div>
                                <div className="text-xs text-rose-600 mt-0.5 leading-relaxed">This order is marked as high-priority. A support agent will contact you immediately to process it to the front of the queue.</div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onSubmit}
                        className="w-full px-6 py-4 bg-gradient-to-r from-[#3A9AFF] to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-[15px] flex items-center justify-center gap-2"
                    >
                        Submit Print Order
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
