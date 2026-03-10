'use client';
import { useState } from 'react';
import EmergencyForm from '@/components/pages/printing/EmergencyForm';
import EmergencyCheckout from '@/components/pages/printing/EmergencyCheckout';
import EmergencyConfirm from '@/components/pages/printing/EmergencyConfirm';
import EmergencySuccess from '@/components/pages/printing/EmergencySuccess';
import { useSearchParams } from 'next/navigation';
import {
    PrintingDetails,
    PrintingCheckoutForm,
    EMPTY_PRINTING_DETAILS,
    EMPTY_PRINTING_FORM
} from '@/components/pages/printing/printingStore';

type Step = 'form' | 'checkout' | 'confirm' | 'success';

export default function EmergencyPrintingFlow() {
    const searchParams = useSearchParams();
    const isEmergencyParam = searchParams.get('emergency') === 'true';

    const [step, setStep] = useState<Step>('form');
    const [details, setDetails] = useState<PrintingDetails>({
        ...EMPTY_PRINTING_DETAILS,
        isEmergency: isEmergencyParam
    });
    const [form, setForm] = useState<PrintingCheckoutForm>(EMPTY_PRINTING_FORM);
    const [orderRef, setOrderRef] = useState<string>('');

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 lg:py-12">
            {/* ── Breadcrumbs Header ── */}
            {step !== 'success' && (
                <div className="max-w-4xl mx-auto px-4 mb-8">
                    <div className="flex items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-medium text-gray-400">
                        {(['form', 'checkout', 'confirm'] as const).map((s, i) => {
                            const isActive = step === s;
                            const isPast = ['form', 'checkout', 'confirm'].indexOf(step) > i;
                            const labels = { form: '1. Print Details', checkout: '2. Delivery Info', confirm: '3. Order Review' };

                            return (
                                <div key={s} className="flex items-center gap-2 sm:gap-6">
                                    <span className={`${isActive ? 'text-[#3A9AFF]' : isPast ? 'text-[#3A9AFF]' : 'text-gray-400'}`}>
                                        {labels[s]}
                                    </span>
                                    {i < 2 && <span className="text-gray-300">›</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Step Router ── */}
            {step === 'form' && (
                <EmergencyForm
                    details={details}
                    onNext={(d: PrintingDetails) => {
                        setDetails(d);
                        setStep('checkout');
                    }}
                />
            )}

            {step === 'checkout' && (
                <EmergencyCheckout
                    form={form}
                    onBack={() => setStep('form')}
                    onNext={(f: PrintingCheckoutForm) => {
                        setForm(f);
                        setStep('confirm');
                    }}
                />
            )}

            {step === 'confirm' && (
                <EmergencyConfirm
                    details={details}
                    form={form}
                    onBack={() => setStep('checkout')}
                    onSubmit={() => {
                        // Mock API submission logic...
                        const refNumber = `EMG-${Math.floor(100000 + Math.random() * 900000)}`;
                        setOrderRef(refNumber);
                        // Complete transition
                        setStep('success');
                    }}
                />
            )}

            {step === 'success' && (
                <EmergencySuccess
                    orderRef={orderRef}
                    onReset={() => {
                        setDetails(EMPTY_PRINTING_DETAILS);
                        setForm(EMPTY_PRINTING_FORM);
                        setStep('form');
                    }}
                />
            )}
        </div>
    );
}
