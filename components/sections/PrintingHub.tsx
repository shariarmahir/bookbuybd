'use client';
import { useRouter } from 'next/navigation';

export default function PrintingHub() {
  const router = useRouter();

  const handleSubmit = (isEmergency: boolean) => {
    router.push(`/emergency-printing?emergency=${isEmergency}`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <span>🖨️</span> CUSTOM PRINTING SERVICES
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          What would you like to print?
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto mb-8">
          From books and ID cards to trophies and event bags — we print it all.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleSubmit(false)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-blue-200 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Create Printing
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-red-200 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Emergency Printing
          </button>
        </div>

        {/* ── Icon grid ── */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
          {[
            { icon: '📚', label: 'Books & Thesis' },
            { icon: '🪪', label: 'ID Cards' },
            { icon: '📜', label: 'Certificates' },
            { icon: '🏳️', label: 'Banners' },
            { icon: '🛍️', label: 'Bags' },
            { icon: '🏆', label: 'Awards' },
            { icon: '☕', label: 'Mugs' },
            { icon: '🔑', label: 'Keyrings' },
            { icon: '💌', label: 'Invitations' },
            { icon: '🧾', label: 'Invoices' },
          ].map(p => (
            <div key={p.label} className="bg-white rounded-xl border border-gray-100 flex flex-col items-center py-4 px-2 hover:border-blue-200 hover:shadow-sm transition cursor-pointer group">
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">{p.icon}</span>
              <p className="text-[10px] text-gray-500 text-center font-medium leading-tight">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}