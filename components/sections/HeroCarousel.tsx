'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const bannerSlides = [
  {
    bg: 'from-amber-50 to-orange-100',
    tag: 'NEW ARRIVALS',
    title: 'Discover Your\nNext Great Read',
    cta: 'Shop Now',
    image: '/images/Hero/banner1.jpg',
  },
  {
    bg: 'from-blue-50 to-indigo-100',
    tag: 'BESTSELLERS',
    title: 'Top Rated\nBooks of The Year',
    cta: 'View Collection',
    image: '/images/Hero/banner2.jpg',
  },
  {
    bg: 'from-green-50 to-emerald-100',
    tag: 'SPECIAL OFFER',
    title: 'Get 30% Off\nSelected Titles',
    cta: 'Learn More',
    image: '/images/Hero/banner3.jpg',
  },
  {
    bg: 'from-purple-50 to-fuchsia-100',
    tag: 'PRINTING HUB',
    title: 'Custom Prints\n& Binding',
    cta: 'Explore Services',
    image: '/images/Hero/banner4.jpg',
  },
  {
    bg: 'from-rose-50 to-pink-100',
    tag: 'FICTION',
    title: 'Lose Yourself\nIn A Story',
    cta: 'Browse Fiction',
    image: '/images/Hero/banner5.jpg',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % bannerSlides.length);
    }, 5000); // Auto-replace banner every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const currentSlide = bannerSlides[active];

  return (
    <section className="w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Main hero */}
          <div className={`flex-1 relative rounded-xl overflow-hidden min-h-[200px] sm:min-h-[260px] md:min-h-[320px] bg-gradient-to-br ${currentSlide.bg} transition-colors duration-500`}>

            {/* Banner Images (crossfade) */}
            {bannerSlides.map((slide, i) => (
              <img
                key={i}
                src={slide.image}
                alt={`Banner ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${active === i ? 'opacity-50' : 'opacity-0'}`}
                onError={(e) => {
                  // Fallback transparent if image doesn't exist yet, so the nice gradient still shows.
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="transparent"/></svg>';
                }}
              />
            ))}

            <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-end">
              <span className="inline-block bg-brand-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded mb-3 w-fit tracking-wider transition-all duration-300">
                {currentSlide.tag}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-md mb-4 whitespace-pre-line transition-all duration-300">
                {currentSlide.title}
              </h1>
              <Link href="/categories">
                <button className="bg-white text-gray-800 text-sm font-bold px-5 py-2.5 rounded-full hover:bg-brand-500 hover:text-white transition-all shadow-sm w-fit active:scale-[0.98]">
                  {currentSlide.cta}
                </button>
              </Link>
            </div>
            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {bannerSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-brand-500' : 'w-2 bg-white/60 hover:bg-white'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Side panel - stacks below on mobile/tablet, right side on desktop */}
          <div className="flex flex-col sm:flex-row lg:flex-col lg:w-56 gap-3">
            <Link href="/categories" className="rounded-xl bg-white shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer border border-gray-100 block">
              <div className="w-14 aspect-[2/3] bg-red-100 rounded flex-shrink-0 overflow-hidden">
                <img
                  src="/images/books/book1.jpg"
                  className="w-full h-full object-cover"
                  alt="Most Read Book"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider">RECOMMENDED</span>
                <p className="text-xs text-gray-800 mt-1 font-bold leading-tight">Most Read Books</p>
              </div>
            </Link>
            <div className="rounded-xl bg-amber-50 p-3 flex-1 flex flex-col justify-between hover:shadow-md transition cursor-pointer border border-amber-100/50 min-h-[140px]">
              <p className="text-xs font-bold text-gray-800">Shop Bangladeshi Stories</p>
              <div className="grid grid-cols-2 gap-1.5 my-2">
                {[2, 3, 4, 5].map(i => (
                  <div key={i} className="aspect-[2/3] bg-white rounded-md shadow-sm overflow-hidden mix-blend-multiply">
                    <img
                      src={`/images/books/book${i}.jpg`}
                      className="w-full h-full object-cover"
                      alt={`Story ${i}`}
                      onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
                    />
                  </div>
                ))}
              </div>
              <Link href="/categories" className="block">
                <button className="w-full text-xs bg-brand-500 text-white font-bold py-2 rounded-lg hover:bg-brand-600 transition shadow-sm">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Most searched bar */}
        <div className="mt-5">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center mb-3">Most Searched</p>
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap scrollbar-hide">
            {['Children\'s', 'Audiobooks', 'Romance', 'Fairy Tales', 'Light Reads', 'Humor & Satire', 'Academic', '...'].map((tag, i) => (
              <button key={i} className="text-xs px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-brand-500 hover:text-brand-600 font-medium whitespace-nowrap transition-colors shadow-sm">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}