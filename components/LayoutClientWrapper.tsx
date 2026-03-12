'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <>
            {!isDashboard && (
                <Suspense fallback={null}>
                    <Navbar />
                </Suspense>
            )}
            {children}
            {!isDashboard && <Footer />}
        </>
    );
}
