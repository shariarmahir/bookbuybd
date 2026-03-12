import { Suspense } from 'react';
import CategoryDetails from '@/components/pages/categorydetails';

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CategoryDetails />
        </Suspense>
    );
}
