'use client';
import { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════════
   BENEFITS DATA
══════════════════════════════════════════════ */
const BENEFITS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'Mental Stimulation',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: 'Improve Your Skill',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    label: 'Improve Your Memory',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Excercise Your Brain',
  },
];

/* ══════════════════════════════════════════════
   ALL REVIEWS — images use public/images/review/
══════════════════════════════════════════════ */
const REVIEWS = [
  {
    id: 1,
    text: 'I have seen a very good online bookstore. I have not found anywhere else such a facility — they are able to deliver the product on time. I invite you all to book.com!',
    name: 'Mr. Jhonsan',
    role: 'Regular Customer',
    image: '/images/review/review1.jpg',
    initials: 'MJ',
    color: '#0d9488',
    stars: 5,
  },
  {
    id: 2,
    text: 'I have bought a lot of books in online bookstores but nowhere else have I found a facility like book.com. They are very careful about their customers.',
    name: 'Nir Eyal',
    role: 'Author & Reader',
    image: '/images/review/review2.jpg',
    initials: 'NE',
    color: '#16a34a',
    stars: 5,
  },
  {
    id: 3,
    text: 'book.com has given me a new experience. They handle their customers in a very beautiful way and are able to deliver very fast. Thank you book.com!',
    name: 'Ryan Hoover',
    role: 'Product Designer',
    image: '/images/review/review3.jpg',
    initials: 'RH',
    color: '#ea580c',
    stars: 5,
  },
  {
    id: 4,
    text: 'Excellent selection of books and super-fast delivery. I found rare titles here that I could not get anywhere else. The packaging was also very careful and neat.',
    name: 'Sarah Ahmed',
    role: 'University Student',
    image: '/images/review/review4.jpg',
    initials: 'SA',
    color: '#7c3aed',
    stars: 5,
  },
  {
    id: 5,
    text: 'The website is very easy to use and the customer support team is incredibly helpful. I had an issue with my order and it was resolved within hours!',
    name: 'Karim Hassan',
    role: 'Teacher',
    image: '/images/review/review5.jpg',
    initials: 'KH',
    color: '#0284c7',
    stars: 5,
  },
  {
    id: 6,
    text: 'I have been shopping here for over two years and the experience keeps getting better. The new arrivals section helped me discover some amazing authors.',
    name: 'Priya Das',
    role: 'Librarian',
    image: '/images/review/review6.jpg',
    initials: 'PD',
    color: '#be185d',
    stars: 4,
  },
  {
    id: 7,
    text: 'Best online bookstore in Bangladesh by far. The prices are very reasonable and the delivery is always on time. Highly recommended to every book lover.',
    name: 'Tanvir Rahman',
    role: 'Software Engineer',
    image: '/images/review/review7.jpg',
    initials: 'TR',
    color: '#b45309',
    stars: 5,
  },
  {
    id: 8,
    text: 'I ordered a customised printed book for my thesis and the quality was outstanding. The team was very professional and delivered exactly what I needed.',
    name: 'Lena Müller',
    role: 'PhD Researcher',
    image: '/images/review/review8.jpg',
    initials: 'LM',
    color: '#047857',
    stars: 5,
  },
  {
    id: 9,
    text: 'Gifted a set of books to my nephew and he was so happy! The gift-wrap option was a lovely touch. book.com made the whole experience truly special.',
    name: 'James O\'Brien',
    role: 'Parent',
    image: '/images/review/review9.jpg',
    initials: 'JO',
    color: '#4338ca',
    stars: 5,
  },
];

/* ══════════════════════════════════════════════
   STAR RATING
══════════════════════════════════════════════ */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= count ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   AVATAR — shows image with fallback initials
══════════════════════════════════════════════ */
function Avatar({
  image, initials, color, size = 48,
}: {
  image: string; initials: string; color: string; size?: number;
}) {
  const [err, setErr] = useState(false);
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, background: err ? color : undefined, fontSize: size * 0.3 }}
    >
      {!err ? (
        <img
          src={image}
          alt={initials}
          className="w-full h-full object-cover"
          onError={() => setErr(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BOOK STACK
══════════════════════════════════════════════ */
function BookStack() {
  return (
    <div className="relative flex items-end justify-center" style={{ height: 220, width: 200 }}>
      <div
        className="absolute rounded-md overflow-hidden shadow-xl"
        style={{ width: 120, height: 180, left: 10, bottom: 0, background: 'linear-gradient(135deg,#1e293b,#0f172a)', transform: 'rotate(-5deg)', zIndex: 1 }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
          <p className="text-white text-[9px] font-bold uppercase tracking-wide opacity-70 mb-1">MINDSET</p>
          <p className="text-yellow-400 text-[22px] font-black leading-none">YOU<br />DESE<br />RVE<br />THIS</p>
          <p className="text-white/50 text-[7px] mt-1">THE BEAUTY OF A</p>
        </div>
      </div>
      <div
        className="absolute rounded-md overflow-hidden shadow-2xl"
        style={{ width: 128, height: 192, right: 8, bottom: 0, background: 'linear-gradient(160deg,#0f766e,#134e4a)', transform: 'rotate(3deg)', zIndex: 2 }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/10" />
        <div className="absolute top-2 right-2 w-12 h-12 rounded-full bg-teal-300/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-teal-200/20" />
        </div>
        <div className="absolute inset-0 flex flex-col items-start justify-between p-3">
          <div>
            <p className="text-teal-200 text-[7px] uppercase tracking-widest font-bold">A LEADER'S GUIDE TO</p>
            <p className="text-white text-base font-black leading-tight mt-1">EVOLVING<br />THROUGH<br />ADVERSITY</p>
          </div>
          <div>
            <div className="w-full h-px bg-teal-400/40 mb-2" />
            <p className="text-teal-100 text-[8px] font-semibold">SECONDE NIMENYA</p>
            <p className="text-teal-300/60 text-[7px]">MINDSET DEVELOPMENT</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   REVIEW CARD (single card with fade animation)
══════════════════════════════════════════════ */
function ReviewCard({
  review, animKey,
}: {
  review: typeof REVIEWS[0]; animKey: number;
}) {
  return (
    <div
      key={animKey}
      className="review-card rounded-2xl p-5 flex flex-col justify-between"
      style={{ background: '#fefce8', minHeight: 180 }}
    >
      {/* Quote mark */}
      <div className="text-yellow-300 text-4xl font-black leading-none mb-1 select-none">"</div>
      <p className="text-xs text-gray-700 leading-relaxed flex-1">{review.text}</p>
      <div className="mt-3 pt-3 border-t border-yellow-200">
        <Stars count={review.stars} />
        <div className="flex items-center gap-2 mt-2">
          <Avatar image={review.image} initials={review.initials} color={review.color} size={32} />
          <div>
            <p className="text-xs font-bold text-gray-800 leading-tight">{review.name}</p>
            <p className="text-[10px] text-gray-400">{review.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const VISIBLE = 3;   // cards shown at once
const INTERVAL = 3500; // ms per rotation

export default function Testimonials() {
  const [startIdx, setStartIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = REVIEWS.length;

  // Get 3 visible reviews (wrapping)
  const visible = Array.from({ length: VISIBLE }, (_, i) => REVIEWS[(startIdx + i) % total]);

  const next = useCallback(() => {
    setStartIdx(i => (i + 1) % total);
    setAnimKey(k => k + 1);
  }, [total]);

  const prev = useCallback(() => {
    setStartIdx(i => (i - 1 + total) % total);
    setAnimKey(k => k + 1);
  }, [total]);

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes benefitIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes quoteIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes personIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .review-card {
          animation: fadeSlideIn 0.52s cubic-bezier(.22,1,.36,1) both;
        }
        .benefit-item {
          animation: benefitIn 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        .quote-block {
          animation: quoteIn 0.6s cubic-bezier(.22,1,.36,1) both;
        }
        .person-block {
          animation: personIn 0.7s cubic-bezier(.22,1,.36,1) both;
        }
      `}</style>

      <div className="bg-white">

        {/* ══ SECTION 1: Benefits ══ */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <div className="flex items-center gap-10">
            <div className="flex-shrink-0">
              <BookStack />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Benifits Of Reading Book
              </h2>
              <ul className="space-y-4">
                {BENEFITS.map((b, i) => (
                  <li
                    key={i}
                    className="benefit-item flex items-center gap-3"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0 transition-transform hover:scale-110 hover:bg-teal-50 hover:text-teal-600 duration-200">
                      {b.icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{b.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ══ SECTION 2: Teacher Quote ══ */}
        <section className="w-full overflow-hidden" style={{ background: 'rgba(52, 185, 225, 1)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-end gap-0">

              {/* Person photo */}
              <div className="person-block flex-shrink-0 flex items-end" style={{ width: 220 }}>
                <div className="relative overflow-hidden" style={{ width: 200, height: 250 }}>
                  <img
                    src="/images/review/teacher.jpg"
                    alt="Tom Byron"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={e => {
                      const el = e.currentTarget;
                      el.style.display = 'none';
                      (el.nextSibling as HTMLElement).style.display = 'flex';
                    }}
                  />
                  {/* Silhouette fallback */}
                  <div
                    className="absolute inset-0 bg-gray-400/30 items-end justify-center"
                    style={{ display: 'none' }}
                  >
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-400 rounded-full" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-400 rounded-t-[50%]" />
                    <div className="absolute bottom-0 left-5 right-5 h-28 rounded-t-3xl" style={{ background: 'linear-gradient(180deg,#cbd5e1,#94a3b8)' }} />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="quote-block flex-1 flex flex-col justify-center py-10 pl-8">
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Mahir Shariar Mahin</h3>
                <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'hsla(165, 100%, 98%, 0.85)' }}>
                  Books really are your best friends as you can rely on them
                  when you are bored, upset, depressed, lonely or annoyed.
                  They will accompany you anytime you want them and
                  enhance your mood. They share with you information and
                  knowledge any time you need.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-px bg-teal-400" />
                  <span className="text-teal-300 text-sm font-semibold tracking-wide">Researcher</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 3: Customer Feedback ══ */}
        <section
          className="max-w-5xl mx-auto px-6 py-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Header row */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Customer feedback.
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Showing {startIdx + 1}–{((startIdx + VISIBLE - 1) % total) + 1} of {total} reviews
              </p>
            </div>

            {/* Manual nav arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
                aria-label="Previous review"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
                aria-label="Next review"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Auto-progress bar */}
          <div className="w-full h-0.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div
              key={`bar-${animKey}-${paused}`}
              className="h-full rounded-full bg-teal-500"
              style={{
                animation: paused ? 'none' : `progressBar ${INTERVAL}ms linear forwards`,
              }}
            />
          </div>

          {/* Review cards grid — 3 visible, slide/fade on change */}
          <div className="grid grid-cols-3 gap-4">
            {visible.map((review, i) => (
              <ReviewCard
                key={`${animKey}-${i}`}
                review={review}
                animKey={animKey * 10 + i}
              />
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-6">
            {Array.from({ length: total }).map((_, i) => {
              const isActive = i >= startIdx && i < startIdx + VISIBLE
                || (startIdx + VISIBLE > total && i < (startIdx + VISIBLE) % total);
              return (
                <button
                  key={i}
                  onClick={() => { setStartIdx(i); setAnimKey(k => k + 1); }}
                  className={`rounded-full transition-all duration-300 ${isActive
                    ? 'w-5 h-2 bg-teal-500'
                    : 'w-2 h-2 bg-gray-200 hover:bg-teal-300'
                    }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              );
            })}
          </div>

          {/* Pause hint */}
          <p className="text-center text-[11px] text-gray-300 mt-3">
            {paused ? '⏸ Auto-rotation paused' : '▶ Hover to pause'}
          </p>
        </section>

      </div>
    </>
  );
}