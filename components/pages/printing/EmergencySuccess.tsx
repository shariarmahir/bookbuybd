'use client';
import { useState, useEffect } from 'react';

/* ── confetti particle ── */
interface Particle { id: number; x: number; size: number; color: string; delay: number; duration: number; }
const CONFETTI_COLORS = ['#3A9AFF', '#60A5FA', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316'];
function makeParticles(n = 60): Particle[] {
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 1.2,
        duration: 2 + Math.random() * 1.5,
    }));
}

interface EmergencySuccessProps {
    orderRef: string;
    onReset: () => void;
}

type Phase = 'animating' | 'done';

export default function EmergencySuccess({ orderRef, onReset }: EmergencySuccessProps) {
    const [phase, setPhase] = useState<Phase>('animating');
    const [textVisible, setTextVisible] = useState(false);
    const [particles] = useState<Particle[]>(makeParticles(70));

    useEffect(() => {
        const t2 = setTimeout(() => setTextVisible(true), 1100);
        const t4 = setTimeout(() => setPhase('done'), 2000);
        return () => { [t2, t4].forEach(clearTimeout); };
    }, []);

    return (
        <>
            <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed; top: -10px; border-radius: 3px;
          animation: confettiFall var(--dur) var(--delay) ease-in forwards;
          pointer-events: none; z-index: 100;
        }

        @keyframes ringDraw { from { stroke-dashoffset: 283; } to { stroke-dashoffset: 0; } }
        @keyframes checkPop {
          0%   { opacity:0; transform:scale(0) rotate(-20deg); }
          70%  { transform:scale(1.15) rotate(5deg); }
          100% { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes ringPulse {
          0%,100% { transform:scale(1);   box-shadow:0 0 0 0   rgba(58,154,255,0.3); }
          50%     { transform:scale(1.04);box-shadow:0 0 0 18px rgba(58,154,255,0);   }
        }
        .ring-svg circle { stroke-dasharray: 283; stroke-dashoffset: 283; animation: ringDraw .65s .2s cubic-bezier(.22,1,.36,1) forwards; }
        .check-icon { opacity: 0; animation: checkPop .4s .85s cubic-bezier(.22,1,.36,1) forwards; }
        .ring-pulse { animation: ringPulse 2.2s 1.5s ease-in-out infinite; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .text-in { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

            {phase === 'animating' && particles.map(p => (
                <div key={p.id} className="confetti-piece"
                    style={{ left: `${p.x}%`, width: p.size, height: p.size * 0.5, background: p.color, '--dur': `${p.duration}s`, '--delay': `${p.delay}s` } as React.CSSProperties}
                />
            ))}

            <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {/* Ring + check */}
                <div className="ring-pulse relative flex items-center justify-center mb-8"
                    style={{ width: 110, height: 110, borderRadius: '50%', background: '#eff6ff', border: '3px solid #dbeafe' }}>
                    <svg className="ring-svg absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#3A9AFF" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    <svg className="check-icon w-12 h-12" fill="none" stroke="#3A9AFF" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {textVisible && (
                    <div className="text-center text-in w-full">
                        <h1 style={{ fontFamily: "'Lora', serif" }} className="text-3xl font-bold text-gray-900 mb-4">
                            Printing Request Submitted! 🎉
                        </h1>
                        <p className="text-[15px] text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            We've received your document and requirements. One of our print experts will review your files and contact you shortly to confirm the timeline.
                        </p>

                        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 max-w-sm mx-auto mb-10 text-left">
                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Reference Ticket</div>
                            <div className="text-2xl font-black text-[#3A9AFF] tracking-wider mb-4 border-b border-gray-100 pb-3">{orderRef}</div>

                            <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-sm font-medium text-gray-700">
                                <svg className="w-5 h-5 text-[#3A9AFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Keep this ticket number handy for tracking your print job status.</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={onReset}
                                className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm"
                            >
                                Submit New Request
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-8 py-3.5 bg-gradient-to-r from-[#3A9AFF] to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-sm"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
