'use client';

import dynamic from 'next/dynamic';

const Books = dynamic(() => import('./Books'), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-sm text-gray-400">Loading books...</div>,
});

export default Books;
