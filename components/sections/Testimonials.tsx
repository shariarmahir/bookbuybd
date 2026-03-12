'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
    text: 'বইগুলো হতে পাবার পর আমার প্রথম যে জিনিসটা মাথায় আসছে সেটা হলো, পেজটা কই ছিলো এত দিন? নীলক্ষেতে কতো দিন যে ঘুরছি এর জন্য অনেক অনেক ধন্যবাদ Book Buy BD কে এতো অল্প খরচে এরকম সার্ভিসের জন্য',
    name: 'Fayem Hira',
    role: 'Regular Customer',
    image: '/images/review/review1.jpeg',
    initials: 'MJ',
    color: '#0d9488',
    stars: 5,
  },
  {
    id: 2,
    text: 'Excellent printing and binding, reliable professional service.Keep up this quality ',
    name: 'Dip Saha',
    role: 'Regular Customer',
    image: '/images/review/review 2.jpeg',
    initials: 'NE',
    color: '#16a34a',
    stars: 5,
  },
  {
    id: 3,
    text: 'I have printed 150 pages and have bound them as a book from Book Buy BD. For stitching purposes, they made the font smaller, which was not comfortable to read. So I asked them to make another one, and I would pay for that. But they gave the 2nd copy for free. I never expected I would experience something like this in Bangladesh. ',
    name: 'Mishkatul jannat ',
    role: 'Regular Customer',
    image: '/images/review/review3.jpeg',
    initials: 'RH',
    color: '#ea580c',
    stars: 5,
  },
  {
    id: 4,
    text: 'I am super impressed by their quality and service...top-notch...highly recommended. Will order more inshallah.',
    name: 'Ashik Hasan',
    role: 'University Student',
    image: '/images/review/review 4.jpeg',
    initials: 'SA',
    color: '#7c3aed',
    stars: 5,
  },
  {
    id: 5,
    text: 'printed 3 books from them. At first I was not completely satisfied with the printing quality. So they reprinted the books without any charge! Was very surprised to see such customer service in Bangladesh. 100% recommended. ',
    name: 'Yasir Arafat',
    role: 'Teacher',
    image: '/images/review/review 5.jpeg',
    initials: 'KH',
    color: '#0284c7',
    stars: 5,
  },
  {
    id: 6,
    text: 'If any of you want to print any book from PDF, there are many shops for this purpose. Among them, I can suggest Book Buy BD without any doubt. I have also checked some other shops but I have found that this shop gives some advantages over others, likke Printing and binding quality are very good and clear. I have also found that the cost is less than other shops. Also the shopkeepers behavior',
    name: 'Shanjida Jui',
    role: 'Librarian',
    image: '/images/review/review 6.jpeg',
    initials: 'PD',
    color: '#be185d',
    stars: 4,
  },
  {
    id: 7,
    text: 'I am someone who would highlight and underline equations, lines while reading book. So,  Although I downloaded all these books, It seems something was missing, So, I decided to print, as you can not find these books in Nilkhet. I heard about Book Buy BD before and for the first time took service from them. I am satisfied. I really liked the quick response, print quality.  I would definitely recommend them.',
    name: 'Tanvir Rahman',
    role: 'Software Engineer',
    image: '/images/review/review 7.jpeg',
    initials: 'TR',
    color: '#b45309',
    stars: 5,
  },
  {
    id: 8,
    text: 'A few days ago, I used Book Buy BD is pdf printing service for my pdf books. The printing quality and binding exceed my expectation. it is great to see a local business provides their quality service using mainly social media and still reach customer expectations. 👍👍👍',
    name: 'Mahbub khan',
    role: 'PhD Researcher',
    image: '/images/review/review 8.jpeg',
    initials: 'LM',
    color: '#047857',
    stars: 5,
  },
  {
    id: 9,
    text: 'ধন্যবাদ Book Buy BD  কে.যেকোনো পিডিএফ/ওয়ার্ড ডকুমেন্টস সহজেই অত্যন্ত কম খরচে প্রিন্ট করাতে পারেন "Book Buy BD" ফেসবুক পেজ থেকে.অসম্ভব সুন্দর বাধাই,কালার প্রিন্টিং কোয়ালিটি আপনার মন জয় করে নিতে বাধ্য.খরচ:২.৫৯ টাকা উভয় পাশ A4 80 GSM অফসেট পেজ কালার প্রিন্ট.১.৭৯ টাকায় উভয় পাশ A4 80 GSM অফসেট পেজ সাদা কালো প্রিন্ট.এছাড়াও আরো পেজ কোয়ালিটি  প্রিন্ট ও এভেইলএবল.সফটকপি/পিডিএফ কপি এখন হয়ে উঠুক জ্যন্ত বই....  ',
    name: "Fiaz Bin Khaled Pranjal",
    role: 'Parent',
    image: '/images/review/review 9.jpeg',
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
        <Image
          src={image}
          alt={initials}
          width={size}
          height={size}
          unoptimized
          loader={({ src }) => src}
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
            <p className="text-teal-200 text-[7px] uppercase tracking-widest font-bold">A LEADER&apos;S GUIDE TO</p>
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
      <div className="text-yellow-300 text-4xl font-black leading-none mb-1 select-none">&ldquo;</div>
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
  const [visibleCount, setVisibleCount] = useState(VISIBLE);
  const [teacherImageError, setTeacherImageError] = useState(false);
  const total = REVIEWS.length;

  // Get 3 visible reviews (wrapping)
  const visible = Array.from({ length: visibleCount }, (_, i) => REVIEWS[(startIdx + i) % total]);

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

  useEffect(() => {
    const setCountByViewport = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
        return;
      }

      if (window.innerWidth < 1280) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(3);
    };

    setCountByViewport();
    window.addEventListener('resize', setCountByViewport);
    return () => window.removeEventListener('resize', setCountByViewport);
  }, []);

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
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-gray-900">
              Benifits Of Reading Book
            </h2>
            <div className="mb-8">
              <BookStack />
            </div>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-y-5">
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
        </section>

        {/* ══ SECTION 2: Teacher Quote ══ */}
        <section className="w-full overflow-hidden" style={{ background: 'rgba(52, 185, 225, 1)' }}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-0 md:flex-row md:items-end">

              {/* Person photo */}
              <div className="person-block flex flex-shrink-0 items-end md:w-[220px]">
                <div className="relative h-[240px] w-[180px] overflow-hidden sm:h-[250px] sm:w-[200px]">
                  {!teacherImageError && (
                    <Image
                      src="/images/review/teacher.jpeg"
                      alt="Tom Byron"
                      fill
                      sizes="(max-width: 640px) 180px, 200px"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      onError={() => setTeacherImageError(true)}
                    />
                  )}
                  {teacherImageError && (
                    <div className="absolute inset-0 flex items-end justify-center bg-gray-400/30">
                      <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-gray-400" />
                      <div className="absolute bottom-0 left-0 right-0 h-32 rounded-t-[50%] bg-gray-400" />
                      <div className="absolute bottom-0 left-5 right-5 h-28 rounded-t-3xl" style={{ background: 'linear-gradient(180deg,#cbd5e1,#94a3b8)' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Quote */}
              <div className="quote-block flex flex-1 flex-col justify-center px-2 py-8 text-center md:py-10 md:pl-8 md:pr-0 md:text-left">
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Masum Howlader</h3>
                <p className="mb-5 max-w-md text-sm leading-relaxed md:max-w-none" style={{ color: 'hsla(165, 100%, 98%, 0.85)' }}>
                  Books really are your best friends as you can rely on them
                  when you are bored, upset, depressed, lonely or annoyed.
                  They will accompany you anytime you want them and
                  enhance your mood. They share with you information and
                  knowledge any time you need.
                </p>
                <div className="flex items-center justify-center gap-3 md:justify-start">
                  <div className="w-10 h-px bg-teal-400" />
                  <span className="text-teal-300 text-sm font-semibold tracking-wide">Teacher</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 3: Customer Feedback ══ */}
        <section
          className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Header row */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Customer feedback.
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Showing {startIdx + 1}–{((startIdx + visibleCount - 1) % total) + 1} of {total} reviews
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              const isActive = i >= startIdx && i < startIdx + visibleCount
                || (startIdx + visibleCount > total && i < (startIdx + visibleCount) % total);
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
