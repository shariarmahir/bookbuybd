'use client';
import { useState, useEffect } from 'react';
import { ApiError, contactService, type ContactSubjectOption } from '@/lib/api';

const DEFAULT_SUBJECTS: ContactSubjectOption[] = [{ id: 'general', label: 'General Inquiry' }];

/* ══════════════════════════════════════════
   ANIMATED SEND BUTTON
══════════════════════════════════════════ */
function SendButton({ onClick, sending }: { onClick: () => void; sending: boolean }) {
  return (
    <>
      <style>{`
        @keyframes sendPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        @keyframes sendSlide {
          0%   { transform: translateX(0); opacity: 1; }
          40%  { transform: translateX(60px); opacity: 0; }
          41%  { transform: translateX(-60px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes checkIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .send-btn {
          animation: sendPulse 2s infinite;
          transition: background 0.3s, transform 0.15s;
        }
        .send-btn:hover { transform: translateY(-2px); }
        .send-btn:active { transform: translateY(0) scale(0.97); }
        .send-btn-text { animation: sendSlide 0.6s ease forwards; }
        .check-anim   { animation: checkIn 0.4s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
      <button
        type="button"
        onClick={onClick}
        disabled={sending}
        className="send-btn flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 sm:w-auto"
        style={{ minWidth: 160 }}
      >
        {sending ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Sending…
          </span>
        ) : (
          <>
            Send Messages
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </>
  );
}

/* ══════════════════════════════════════════
   CONTACT INFO CARD
══════════════════════════════════════════ */
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#dbeafe' }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [subjectOptions, setSubjectOptions] = useState<ContactSubjectOption[]>(DEFAULT_SUBJECTS);

  useEffect(() => {
    const run = async () => {
      try {
        const options = await contactService.getSubjects();
        if (options.length > 0) setSubjectOptions(options);
      } catch {
        setSubjectOptions(DEFAULT_SUBJECTS);
      }
    };
    void run();
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => {
      if (sent) setSent(false);
      if (sendError) setSendError(null);
      return { ...f, [k]: e.target.value };
    });

  const handleSend = () => {
    if (sending) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setSendError('Please fill in name, email, subject, and message.');
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);
    if (!emailOk) {
      setSendError('Please enter a valid email address.');
      return;
    }

    setSendError(null);
    setSending(true);
    void contactService.sendMessage(payload)
      .then(() => {
        setSent(true);
        setForm((prev) => ({ ...prev, name: '', email: '', message: '' }));
        setTimeout(() => setSent(false), 3000);
      })
      .catch((error: unknown) => {
        setSendError(error instanceof ApiError ? error.message : 'Failed to send message. Please try again.');
      })
      .finally(() => {
        setSending(false);
      });
  };

  const inputCls = `w-full rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-100 border border-transparent
    placeholder-gray-400 outline-none transition focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100`;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">

      {/* ── Section title ── */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Contact Us</p>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Get In Touch</h2>
        <div className="w-12 h-1 bg-blue-500 rounded-full mx-auto mt-3" />
      </div>

      {/* ── Two-panel card ── */}
      <div className="flex flex-col gap-5 overflow-visible rounded-3xl lg:flex-row">

        {/* ════ LEFT PANEL ════ */}
        <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:w-[280px] lg:min-w-[280px] lg:flex-shrink-0">
          {/* Info rows */}
          <InfoCard
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
            label="Call us"
            value="(645) 325 – 2543"
          />

          <InfoCard
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            label="Email"
            value="Domin@web.com"
          />

          <InfoCard
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Location"
            value="4093 Ascot Drive, Mansfield, IN 47374"
          />

          {/* Google Map embed */}
          <div className="rounded-xl overflow-hidden flex-1" style={{ minHeight: 220 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d58410.109183500055!2d90.38069759999999!3d23.7961216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1773080633091!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: 220 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>
        </div>

        {/* ════ RIGHT PANEL — Form ════ */}
        <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          {/* Name + Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Arifbillah"
                value={form.name}
                onChange={set('name')}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Hey.arifbillah@gmail.com"
                value={form.email}
                onChange={set('email')}
                className={inputCls}
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Subject</label>
            <select
              value={form.subject}
              onChange={set('subject')}
              className={inputCls}
            >
              {subjectOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Leave us messages</label>
            <textarea
              rows={5}
              placeholder="Ai Gen"
              value={form.message}
              onChange={set('message')}
              className={`${inputCls} resize-none leading-relaxed`}
            />
          </div>

          {/* Send button + success */}
          <div className="flex flex-wrap items-center gap-4">
            <SendButton onClick={handleSend} sending={sending} />
            {sent && (
              <span className="check-anim flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Message sent!
              </span>
            )}
            {sendError && <p className="text-sm text-red-600">{sendError}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
