'use client';
import { useState, useRef, useEffect } from 'react';
import { PrintingDetails } from './printingStore';

/* ══════════════════════════════════════════
   DATA — all printing categories & items
══════════════════════════════════════════ */
const CATEGORIES = [
    {
        id: 'books',
        label: 'Books & Academic',
        icon: '📚',
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
        items: [
            { name: 'Custom Printed Bags', desc: 'Gift bags, tote bags, carry bags with branding', icon: '🛍️' },
            { name: 'Event Backdrops', desc: 'Photo booth, step-and-repeat backdrops', icon: '🎭' },
            { name: 'Table Cards & Menus', desc: 'Wedding/event table cards and menus', icon: '🍽️' },
            { name: 'Invitation Cards', desc: 'Premium invitation & greeting cards', icon: '💌' },
        ],
    },
];

/* ── Upload drop zone ── */
function UploadArea({ label, file, setFile }: { label: string; file: File | null; setFile: (f: File) => void }) {
    const ref = useRef<HTMLInputElement>(null);
    const [drag, setDrag] = useState(false);
    const handle = (f: File) => setFile(f);
    return (
        <div
            onClick={() => ref.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }}
            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-6 px-4 cursor-pointer transition-all select-none ${drag ? 'border-[#3A9AFF] bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-[#3A9AFF] hover:bg-blue-50/30'}`}
        >
            <input ref={ref} type="file" className="hidden" onChange={e => {
                if (e.target.files?.[0]) handle(e.target.files[0]);
            }} />
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xs font-semibold text-gray-600 mb-0.5">{label}</p>
            {file
                ? <p className="text-[11px] text-[#3A9AFF] text-center break-all px-1 font-medium">{file.name}</p>
                : <p className="text-[11px] text-gray-400 text-center leading-relaxed">Drag and drop to upload<br />or <span className="text-[#3A9AFF]">choose file</span></p>
            }
        </div>
    );
}

/* ── Category dropdown button ── */
function CategoryDropdown({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void; }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = CATEGORIES.find(c => c.id === selected);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between gap-2 border rounded-lg px-4 py-3 text-sm transition outline-none focus:ring-2 focus:ring-blue-100 ${open ? 'border-[#3A9AFF] bg-blue-50' : 'border-gray-200 bg-white hover:border-[#3A9AFF]'}`}
            >
                <span className={`flex items-center gap-2 ${current ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {current ? <>{current.icon} {current.label}</> : 'Select printing category...'}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition text-sm ${selected === cat.id ? 'bg-blue-50 text-[#3A9AFF] font-semibold' : 'text-gray-700'}`}
                        >
                            <span className="text-lg">{cat.icon}</span>
                            <span>{cat.label}</span>
                            {selected === cat.id && (
                                <svg className="w-4 h-4 ml-auto text-[#3A9AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
function ItemSelector({ categoryId, selected, onToggle }: { categoryId: string | null; selected: string[]; onToggle: (name: string) => void; }) {
    const cat = CATEGORIES.find(c => c.id === categoryId);
    if (!cat) return (
        <div className="rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center py-8 text-gray-300 text-sm">
            ← Select a category to see available items
        </div>
    );
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {cat.items.map(item => {
                const active = selected.includes(item.name);
                return (
                    <button
                        key={item.name}
                        type="button"
                        onClick={() => onToggle(item.name)}
                        className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${active
                            ? 'border-[#3A9AFF] bg-blue-50 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                            }`}
                    >
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                        <div>
                            <p className={`text-xs font-bold leading-tight ${active ? 'text-[#3A9AFF]' : 'text-gray-800'}`}>{item.name}</p>
                            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{item.desc}</p>
                        </div>
                        {active && (
                            <div className="ml-auto w-4 h-4 rounded-full bg-[#3A9AFF] flex-shrink-0 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

interface EmergencyFormProps {
    details: PrintingDetails;
    onNext: (details: PrintingDetails) => void;
}

export default function EmergencyForm({ details, onNext }: EmergencyFormProps) {
    const [local, setLocal] = useState<PrintingDetails>(details);
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!local.categoryId) {
            setError('Please select a printing category.');
            return;
        }
        if (local.items.length === 0) {
            setError('Please select at least one item to print.');
            return;
        }
        if (!local.file) {
            setError('Please upload the file to be printed.');
            return;
        }
        onNext(local);
    };

    return (
        <div className="max-w-4xl mx-auto px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Lora', serif" }}>
                    Emergency Printing Details
                </h2>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">1. Select Category</label>
                            <CategoryDropdown
                                selected={local.categoryId}
                                onSelect={id => { setLocal({ ...local, categoryId: id, items: [] }); setError(''); }}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">2. Choose Items To Print</label>
                            <ItemSelector
                                categoryId={local.categoryId}
                                selected={local.items}
                                onToggle={name => {
                                    setLocal(prev => ({
                                        ...prev,
                                        items: prev.items.includes(name) ? prev.items.filter(i => i !== name) : [...prev.items, name]
                                    }));
                                    setError('');
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">3. Upload File</label>
                            <UploadArea
                                label="Upload document (PDF, DOCX) or Image"
                                file={local.file}
                                setFile={f => { setLocal({ ...local, file: f }); setError(''); }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Quantity (Copies)</label>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-11">
                                    <button type="button" onClick={() => setLocal({ ...local, quantity: Math.max(1, local.quantity - 1) })} className="w-10 h-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors">-</button>
                                    <input type="text" className="flex-1 w-full text-center h-full text-sm font-semibold outline-none py-0" value={local.quantity} readOnly />
                                    <button type="button" onClick={() => setLocal({ ...local, quantity: local.quantity + 1 })} className="w-10 h-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-[#3A9AFF] font-bold text-lg transition-colors">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Color Scheme</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg h-11">
                                    <button type="button" onClick={() => setLocal({ ...local, color: 'BW' })} className={`flex-1 rounded-md text-sm font-bold transition-all ${local.color === 'BW' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>B&W</button>
                                    <button type="button" onClick={() => setLocal({ ...local, color: 'Color' })} className={`flex-1 rounded-md text-sm font-bold transition-all ${local.color === 'Color' ? 'bg-white text-[#3A9AFF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Color</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 p-4 border border-rose-200 bg-rose-50 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={local.isEmergency}
                                    onChange={e => setLocal({ ...local, isEmergency: e.target.checked })}
                                    className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400"
                                />
                                <div>
                                    <span className="block font-bold text-rose-700 text-sm">Emergency Priority</span>
                                    <span className="block text-xs text-rose-600 opacity-80 mt-0.5">Push this ticket to the front of the queue. Additional charges may apply.</span>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Additional Notes & Instructions</label>
                            <textarea
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#3A9AFF] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y min-h-[90px]"
                                placeholder="Binding instructions, paper quality (gsm), specific page instructions..."
                                value={local.notes}
                                onChange={e => setLocal({ ...local, notes: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-[#3A9AFF] to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-sm"
                    >
                        Continue to Delivery
                    </button>
                </div>
            </div>
        </div>
    );
}
