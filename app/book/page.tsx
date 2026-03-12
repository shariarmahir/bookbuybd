import { Suspense } from 'react';
import BookDetails from '@/components/pages/Bookdetails';

export default function BookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookDetails />
        </Suspense>
    );
}
