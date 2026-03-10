'use client';
import { Suspense } from 'react';
import EmergencyPrintingFlow from '@/components/pages/printing/EmergencyPrintingFlow';

export default function EmergencyPrintingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading printing service...</div>}>
            <EmergencyPrintingFlow />
        </Suspense>
    );
}
