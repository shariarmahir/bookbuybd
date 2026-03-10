'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ══════════════════════════════════════════
   DATA — all printing categories & items
══════════════════════════════════════════ */

const CATEGORIES = [
  {
    id: 'books',
    label: 'Books & Academic',
    icon: '📚',
    color: 'from-blue-500 to-blue-700',
    light: 'bg-blue-50 border-blue-200 text-blue-700',
    items: [
      { name: 'Custom Printed Books', desc: 'Full-color or B&W book printing, any size', icon: '📖' },
      { name: 'Thesis & Dissertations', desc: 'Hard/soft cover thesis binding & printing', icon: '🎓' },
      { name: 'Notebooks & Journals', desc: 'Custom branded notebooks with logo', icon: '📓' },
      { name: 'Calendars', desc: 'Wall and desk calendars, custom design', icon: '📅' },
    ],
  },
  {
    id: 'office',
    label: 'Office & Corporate',
    icon: '🏢',
    color: 'from-indigo-500 to-indigo-700',
    light: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    items: [
      { name: 'ID Cards', desc: 'PVC, laminated ID cards with lanyards', icon: '🪪' },
      { name: 'Visiting Cards', desc: 'Matte, gloss, spot UV business cards', icon: '💳' },
      { name: 'Brochures & Leaflets', desc: 'Bi-fold, tri-fold, DL brochures', icon: '📋' },
      { name: 'Invoices & Forms', desc: 'Carbonless NCR pads, custom forms', icon: '🧾' },
      { name: 'Certificates', desc: 'A4/A3 certificates, gold foil borders', icon: '📜' },
      { name: 'Letterheads', desc: 'Branded company letterhead pads', icon: '✉️' },
    ],
  },
  {
    id: 'display',
    label: 'Banners & Display',
    icon: '🏳️',
    color: 'from-orange-500 to-orange-700',
    light: 'bg-orange-50 border-orange-200 text-orange-700',
    items: [
      { name: 'Banners', desc: 'Vinyl, fabric, retractable roll-up banners', icon: '🏷️' },
      { name: 'Posters', desc: 'A0–A3 glossy/matte large-format posters', icon: '🖼️' },
      { name: 'Stickers & Labels', desc: 'Die-cut, roll, sheet stickers', icon: '🔖' },
      { name: 'Prize Cards', desc: 'Custom award & prize cards, foil finish', icon: '🏅' },
    ],
  },
  {
    id: 'ceremony',
    label: 'Ceremony & Events',
    icon: '🎉',
    color: 'from-pink-500 to-rose-600',
    light: 'bg-pink-50 border-pink-200 text-pink-700',
    items: [
      { name: 'Custom Printed Bags', desc: 'Gift bags, tote bags, carry bags with branding', icon: '🛍️' },
      { name: 'Event Backdrops', desc: 'Photo booth, step-and-repeat backdrops', icon: '🎭' },
      { name: 'Table Cards & Menus', desc: 'Wedding/event table cards and menus', icon: '🍽️' },
      { name: 'Invitation Cards', desc: 'Premium invitation & greeting cards', icon: '💌' },
    ],
  },
  {
    id: 'stationery',
    label: 'Stationery & Gifts',
    icon: '✏️',
    color: 'from-green-500 to-emerald-700',
    light: 'bg-green-50 border-green-200 text-green-700',
    items: [
      { name: 'Keyrings', desc: 'Acrylic, metal, rubber custom keyrings', icon: '🔑' },
      { name: 'Mugs & Cups', desc: 'Ceramic & travel mugs with print', icon: '☕' },
      { name: 'Trophies & Awards', desc: 'Crystal, acrylic, metal trophies', icon: '🏆' },
      { name: 'Pens & Stationery Sets', desc: 'Branded pens, rulers, sticky notes', icon: '🖊️' },
      { name: 'Custom Gifts', desc: 'Photo frames, pillows, phone cases', icon: '🎁' },
      { name: 'T-Shirts & Apparel', desc: 'Custom printed t-shirts, caps, jackets', icon: '👕' },
    ],
  },
];

/* ── Upload drop zone ── */
function UploadArea({ label }: { label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const handle = (f: File) => setFile(f.name);
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }}
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-6 px-4 cursor-pointer transition-all select-none ${drag ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'}`}
    >
      <input ref={ref} type="file" className="hidden" onChange={e => { if (e.target.files?.[0]) handle(e.target.files[0]); }} />
      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <p className="text-xs font-semibold text-gray-600 mb-0.5">{label}</p>
      {file
        ? <p className="text-[11px] text-blue-500 text-center break-all px-1 font-medium">{file}</p>
        : <p className="text-[11px] text-gray-400 text-center leading-relaxed">Drag and drop to upload<br />or <span className="text-blue-500">choose file</span></p>
      }
    </div>
  );
}

/* ── Category dropdown button ── */
function CategoryDropdown({
  selected, onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = CATEGORIES.find(c => c.id === selected);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 border rounded-lg px-4 py-2.5 text-sm transition outline-none focus:ring-2 focus:ring-blue-100 ${open ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
          }`}
      >
        <span className={`flex items-center gap-2 ${current ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {current ? <>{current.icon} {current.label}</> : 'Select printing category…'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onSelect(cat.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition text-sm ${selected === cat.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'}`}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.label}</span>
              {selected === cat.id && (
                <svg className="w-4 h-4 ml-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Item selector chips ── */
function ItemSelector({ categoryId, selected, onToggle }: {
  categoryId: string | null;
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center py-8 text-gray-300 text-sm">
      ← Select a category to see available items
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      {cat.items.map(item => {
        const active = selected.includes(item.name);
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onToggle(item.name)}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${active
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
              }`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className={`text-xs font-bold leading-tight ${active ? 'text-blue-700' : 'text-gray-800'}`}>{item.name}</p>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{item.desc}</p>
            </div>
            {active && (
              <svg className="w-3.5 h-3.5 text-blue-500 ml-auto flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */

export default function PrintingHub() {
  const router = useRouter();
  const [category, setCategory] = useState<string | null>(null);
  const [selectedItems, setItems] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const toggleItem = (name: string) =>
    setItems(p => p.includes(name) ? p.filter((i: string) => i !== name) : [...p, name]);

  const handleSubmit = (isEmergency: boolean) => {
    router.push(`/emergency-printing?emergency=${isEmergency}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-start justify-center py-12 px-4">
      <div className="w-full" style={{ maxWidth: 900 }}>

        {/* ── Page header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <span>🖨️</span> CUSTOM PRINTING SERVICES
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            What would you like to print?
          </h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            From books and ID cards to trophies and event bags — we print it all.
            Configure your order below.
          </p>

          {/* Hero CTA buttons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => handleSubmit(false)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-md shadow-blue-200 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Create Printing
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-md shadow-red-200 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Emergency Printing
            </button>
          </div>
        </div>

        {/* ── Category browsing pills (scrollable horizontal) ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setItems([]); }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition whitespace-nowrap ${category === cat.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Main card ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="flex flex-col md:flex-row gap-0">

            {/* ── LEFT: Your Order ── */}
            <div className="flex flex-col border-b md:border-b-0 md:border-r border-gray-100 w-full md:w-[230px]">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-extrabold text-gray-800">Your Order</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Selected items appear here</p>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-none">
                {selectedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-300 px-4 text-center">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-[11px] leading-tight">No items yet.<br />Select from the right →</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {selectedItems.map((name: string) => {
                      const cat = CATEGORIES.find(c => c.items.some(i => i.name === name));
                      const item = cat?.items.find(i => i.name === name);
                      return (
                        <div key={name} className="flex items-start gap-2 px-4 py-3 group">
                          <span className="text-base mt-0.5">{item?.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 leading-tight">{name}</p>
                            <p className="text-[10px] text-gray-400">{cat?.label}</p>
                          </div>
                          <button
                            onClick={() => toggleItem(name)}
                            className="text-gray-200 hover:text-red-400 transition text-base leading-none flex-shrink-0"
                          >×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-4 py-4 border-t border-gray-100 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-500 font-medium">Quantity</span>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    min={1}
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-800 outline-none focus:border-blue-400 text-right"
                  />
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                  <span className="text-[10px] text-gray-500">Items selected</span>
                  <span className="text-xs font-bold text-blue-600">{selectedItems.length}</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="flex-1 px-6 py-5 flex flex-col gap-4">
              <h2 className="text-lg font-extrabold text-gray-900 border-b border-gray-100 pb-2 mb-1">Configure Your Print Order</h2>

              <div>
                <label className="block text-sm text-gray-800 font-bold mb-1.5">Printing Category</label>
                <CategoryDropdown selected={category} onSelect={id => { setCategory(id); setItems([]); }} />
              </div>

              <div>
                <label className="block text-sm text-gray-800 font-bold mb-1.5">
                  Select Items
                  {selectedItems.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {selectedItems.length} selected
                    </span>
                  )}
                </label>
                <ItemSelector categoryId={category} selected={selectedItems} onToggle={toggleItem} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-800 font-bold mb-1.5">Budget (BDT)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-800 font-bold mb-1.5">Required By</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-800 font-bold mb-1.5">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Paper type, finish (matte/gloss), size, colours, binding style, delivery address…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none placeholder-gray-300"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-semibold text-xs transition px-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Design File
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mb-3">Accepted: .pdf, .ai, .psd, .png, .jpg</p>
                <div className="grid grid-cols-2 gap-3">
                  <UploadArea label="Logo / Design" />
                  <UploadArea label="Brand Guide" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => handleSubmit(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl shadow shadow-blue-200 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Create Printing
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm py-3 rounded-xl shadow shadow-red-200 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Emergency Printing
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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