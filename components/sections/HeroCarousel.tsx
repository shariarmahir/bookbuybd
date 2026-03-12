'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/lib/api/contracts/home';
import { booksService, type BestSellingBook } from '@/lib/api';

interface HeroSlideViewModel {
  id: string;
  tag: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
  backgroundFrom: string;
  backgroundTo: string;
}

interface GenreOption {
  name: string;
  slug: string;
}

const COLOR_TOKEN_MAP: Record<string, string> = {
  'amber-50': '#fffbeb',
  'orange-100': '#ffedd5',
  'blue-50': '#eff6ff',
  'indigo-100': '#e0e7ff',
  'green-50': '#f0fdf4',
  'emerald-100': '#d1fae5',
  'purple-50': '#faf5ff',
  'fuchsia-100': '#fae8ff',
  'rose-50': '#fff1f2',
  'pink-100': '#fce7f3',
};

const FALLBACK_GRADIENT_FROM = '#eff6ff';
const FALLBACK_GRADIENT_TO = '#e0e7ff';
const RECOMMENDED_BESTSELLER_LIMIT = 10;
const RECOMMENDED_ROTATE_MS = 3000;
const FICTION_CATEGORY_SLUG = 'fiction';
const FICTION_STORIES_PER_SLIDE = 4;
const FICTION_ROTATE_MS = 3500;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '';
const BACKEND_ORIGIN = (() => {
  try {
    return API_BASE_URL ? new URL(API_BASE_URL).origin : 'http://127.0.0.1:8000';
  } catch {
    return 'http://127.0.0.1:8000';
  }
})();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
}

function toNonEmptyString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function resolveGradientColor(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const normalized = value.trim().replace(/^(from-|to-)/, '');

  if (!normalized) return fallback;
  if (normalized.startsWith('#')) return normalized;
  if (normalized.startsWith('rgb(') || normalized.startsWith('rgba(')) return normalized;
  if (normalized.startsWith('hsl(') || normalized.startsWith('hsla(')) return normalized;
  if (normalized.startsWith('var(')) return normalized;

  return COLOR_TOKEN_MAP[normalized] || fallback;
}

function resolveImageSrc(image: unknown): string {
  if (typeof image !== 'string') return '';
  const trimmed = image.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }
  return trimmed.startsWith('/') ? `${BACKEND_ORIGIN}${trimmed}` : `${BACKEND_ORIGIN}/${trimmed}`;
}

function mapHeroSlides(payload: unknown): HeroSlideViewModel[] {
  const rawSlides = getListPayload(payload);

  return rawSlides
    .map((item) => {
      if (!isRecord(item)) return null;

      const raw = item as unknown as HeroSlide;
      const id = toNonEmptyString(raw.id) || toNonEmptyString(item.id);
      const title = toNonEmptyString(raw.title) || toNonEmptyString(item.title);
      const imageUrl = resolveImageSrc(
        toNonEmptyString(raw.imageUrl)
        || toNonEmptyString(item.image_url)
        || toNonEmptyString(item.image),
      );

      if (!id || !title || !imageUrl) return null;

      return {
        id,
        title,
        imageUrl,
        tag: toNonEmptyString(raw.tag) || toNonEmptyString(item.tag),
        ctaLabel: toNonEmptyString(raw.ctaLabel) || toNonEmptyString(item.cta_label),
        ctaHref: toNonEmptyString(raw.ctaHref) || toNonEmptyString(item.cta_href),
        backgroundFrom: resolveGradientColor(
          raw.backgroundFrom || toNonEmptyString(item.background_from),
          FALLBACK_GRADIENT_FROM,
        ),
        backgroundTo: resolveGradientColor(
          raw.backgroundTo || toNonEmptyString(item.background_to),
          FALLBACK_GRADIENT_TO,
        ),
      };
    })
    .filter((slide): slide is HeroSlideViewModel => slide !== null);
}

function mapTrendingSearches(payload: unknown): string[] {
  const rawItems = getListPayload(payload);

  return rawItems
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractGenreOptions(payload: unknown): GenreOption[] {
  const list = getListPayload(payload);

  const options = list
    .map((item) => {
      if (typeof item === 'string') {
        const name = item.trim();
        if (!name) return null;
        return { name, slug: slugifyCategory(name) };
      }

      if (!isRecord(item)) return null;

      const name = toNonEmptyString(item.name) || toNonEmptyString(item.title);
      if (!name) return null;

      const slug = toNonEmptyString(item.slug) || slugifyCategory(name);
      if (!slug) return null;

      return { name, slug };
    })
    .filter((item): item is GenreOption => item !== null);

  const unique = new Map<string, GenreOption>();
  options.forEach((item) => {
    const key = slugifyCategory(item.slug) || slugifyCategory(item.name);
    if (key && !unique.has(key)) {
      unique.set(key, item);
    }
  });

  return Array.from(unique.values());
}

function sanitizeBestSellingBook(book: BestSellingBook): BestSellingBook | null {
  const title = toNonEmptyString((book as { title?: unknown }).title);
  const slug = toNonEmptyString((book as { slug?: unknown }).slug);

  if (!title || !slug) return null;

  const author = toNonEmptyString((book as { author?: unknown }).author) || 'Unknown Author';
  const image = toNonEmptyString((book as { image?: unknown }).image);
  const price = toNonEmptyString((book as { price?: unknown }).price) || '0';
  const categoryName = toNonEmptyString((book as { category_name?: unknown }).category_name);
  const totalSoldRaw = (book as { total_sold?: unknown }).total_sold;
  const totalSold = typeof totalSoldRaw === 'number' && Number.isFinite(totalSoldRaw) ? totalSoldRaw : 0;

  return {
    id: Number((book as { id?: unknown }).id) || 0,
    title,
    slug,
    author,
    image,
    price,
    category_name: categoryName,
    total_sold: totalSold,
  };
}

interface FictionStoryBook {
  id: number;
  slug: string;
  title: string;
  author: string;
  price: string;
  image: string;
}

function sanitizeFictionStoryBook(value: unknown): FictionStoryBook | null {
  if (!isRecord(value)) return null;

  const title = toNonEmptyString(value.title);
  const slug = toNonEmptyString(value.slug);
  if (!title || !slug) return null;

  const image =
    toNonEmptyString(value.image) ||
    toNonEmptyString(value.cover_image) ||
    toNonEmptyString(value.coverImage);
  const authorObj = isRecord(value.author) ? value.author : null;
  const author =
    toNonEmptyString(value.author_name) ||
    (typeof value.author === 'string' ? toNonEmptyString(value.author) : '') ||
    toNonEmptyString(authorObj?.name) ||
    toNonEmptyString(authorObj?.full_name) ||
    'Unknown Author';
  const price = normalizePriceValue(
    value.price
    ?? value.sale_price
    ?? value.selling_price
    ?? value.discount_price
    ?? value.discounted_price,
  );

  return {
    id: Number(value.id) || 0,
    slug,
    title,
    author,
    price,
    image,
  };
}

function normalizePriceValue(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '0';

    const normalized = trimmed.toLowerCase();
    if (normalized === 'undefined' || normalized === 'null' || normalized === 'nan') {
      return '0';
    }

    return trimmed;
  }

  return '0';
}

function formatBookPrice(price: string): string {
  const numeric = Number(price);
  if (Number.isFinite(numeric)) return `TK ${numeric.toFixed(2)}`;
  return 'TK 0.00';
}

async function readJsonOrEmpty(response: Response, fallback: unknown): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return fallback;
  }
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlideViewModel[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [genreOptions, setGenreOptions] = useState<GenreOption[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<BestSellingBook[]>([]);
  const [recommendedActive, setRecommendedActive] = useState(0);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [fictionBooks, setFictionBooks] = useState<FictionStoryBook[]>([]);
  const [fictionActiveSlide, setFictionActiveSlide] = useState(0);
  const [fictionLoading, setFictionLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHomeHero = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const [slidesResponse, trendingResponse] = await Promise.all([
          fetch('/api/home/hero-slides', { cache: 'no-store' }),
          fetch('/api/search/trending', { cache: 'no-store' }),
        ]);

        if (!slidesResponse.ok && slidesResponse.status !== 404) {
          throw new Error(`Failed to load hero slides (${slidesResponse.status}).`);
        }

        if (!trendingResponse.ok && trendingResponse.status !== 404) {
          throw new Error(`Failed to load trending searches (${trendingResponse.status}).`);
        }

        const [slidesPayload, trendingPayload] = await Promise.all([
          slidesResponse.status === 404 ? Promise.resolve([]) : readJsonOrEmpty(slidesResponse, []),
          trendingResponse.status === 404 ? Promise.resolve([]) : readJsonOrEmpty(trendingResponse, []),
        ]);

        if (cancelled) return;

        setSlides(mapHeroSlides(slidesPayload));
        setTrendingSearches(mapTrendingSearches(trendingPayload));
      } catch (error) {
        if (cancelled) return;
        setSlides([]);
        setTrendingSearches([]);
        setLoadError(error instanceof Error ? error.message : 'Failed to load hero content.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadHomeHero();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadGenreOptions = async () => {
      try {
        const payload = await booksService.getCategories();
        if (cancelled) return;
        setGenreOptions(extractGenreOptions(payload));
      } catch {
        if (!cancelled) {
          setGenreOptions([]);
        }
      }
    };

    void loadGenreOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFictionStories = async () => {
      setFictionLoading(true);

      try {
        const payload = await booksService.getCatalog({ category: FICTION_CATEGORY_SLUG });
        if (cancelled) return;

        const books = getListPayload(payload)
          .map((book) => sanitizeFictionStoryBook(book))
          .filter((book): book is FictionStoryBook => book !== null);

        setFictionBooks(books);
      } catch {
        if (!cancelled) {
          setFictionBooks([]);
        }
      } finally {
        if (!cancelled) {
          setFictionLoading(false);
        }
      }
    };

    void loadFictionStories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadRecommendedBooks = async () => {
      setRecommendedLoading(true);

      try {
        const books = await booksService.getBestSelling({ limit: RECOMMENDED_BESTSELLER_LIMIT });
        if (!cancelled) {
          const sanitized = books
            .map((book) => sanitizeBestSellingBook(book))
            .filter((book): book is BestSellingBook => book !== null);
          setRecommendedBooks(sanitized);
          setRecommendedActive(0);
        }
      } catch {
        if (!cancelled) {
          setRecommendedBooks([]);
          setRecommendedActive(0);
        }
      } finally {
        if (!cancelled) {
          setRecommendedLoading(false);
        }
      }
    };

    void loadRecommendedBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    if (active < slides.length) return;
    setActive(0);
  }, [active, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (recommendedBooks.length === 0) return;
    if (recommendedActive < recommendedBooks.length) return;
    setRecommendedActive(0);
  }, [recommendedActive, recommendedBooks.length]);

  useEffect(() => {
    if (recommendedBooks.length <= 1) return;

    const timer = setInterval(() => {
      setRecommendedActive((prev) => (prev + 1) % recommendedBooks.length);
    }, RECOMMENDED_ROTATE_MS);

    return () => clearInterval(timer);
  }, [recommendedBooks.length]);

  const fictionSlides = useMemo(() => {
    if (fictionBooks.length === 0) return [] as FictionStoryBook[][];

    const slideCount = Math.ceil(fictionBooks.length / FICTION_STORIES_PER_SLIDE);

    return Array.from({ length: slideCount }, (_, slideIndex) => (
      Array.from({ length: FICTION_STORIES_PER_SLIDE }, (_, offset) => {
        const sourceIndex = (slideIndex * FICTION_STORIES_PER_SLIDE + offset) % fictionBooks.length;
        return fictionBooks[sourceIndex];
      })
    ));
  }, [fictionBooks]);

  useEffect(() => {
    if (fictionSlides.length === 0) {
      if (fictionActiveSlide !== 0) {
        setFictionActiveSlide(0);
      }
      return;
    }

    if (fictionActiveSlide < fictionSlides.length) return;
    setFictionActiveSlide(0);
  }, [fictionActiveSlide, fictionSlides.length]);

  useEffect(() => {
    if (fictionSlides.length <= 1) return;

    const timer = setInterval(() => {
      setFictionActiveSlide((prev) => (prev + 1) % fictionSlides.length);
    }, FICTION_ROTATE_MS);

    return () => clearInterval(timer);
  }, [fictionSlides.length]);

  const genreSlugByTerm = useMemo(() => {
    const map = new Map<string, string>();

    genreOptions.forEach((genre) => {
      const normalizedSlug = slugifyCategory(genre.slug) || slugifyCategory(genre.name);
      if (!normalizedSlug) return;

      const normalizedName = slugifyCategory(genre.name);
      if (normalizedName) {
        map.set(normalizedName, normalizedSlug);
      }

      map.set(normalizedSlug, normalizedSlug);
    });

    return map;
  }, [genreOptions]);

  const fictionCategoryDetailHref = useMemo(() => {
    const fictionGenreOption = genreOptions.find((option) => {
      const optionSlug = slugifyCategory(option.slug);
      const optionName = slugifyCategory(option.name);
      return optionSlug === FICTION_CATEGORY_SLUG || optionName === FICTION_CATEGORY_SLUG;
    });

    const params = new URLSearchParams();
    params.set('genre', fictionGenreOption?.slug || FICTION_CATEGORY_SLUG);
    return `/categories?${params.toString()}`;
  }, [genreOptions]);

  const currentSlide = slides[active] ?? null;
  const currentRecommendedBook = recommendedBooks[recommendedActive] ?? null;
  const currentFictionBooks = fictionSlides[fictionActiveSlide] ?? fictionSlides[0] ?? [];
  const heroBackgroundStyle = currentSlide
    ? { backgroundImage: `linear-gradient(135deg, ${currentSlide.backgroundFrom}, ${currentSlide.backgroundTo})` }
    : { backgroundImage: `linear-gradient(135deg, ${FALLBACK_GRADIENT_FROM}, ${FALLBACK_GRADIENT_TO})` };

  return (
    <section className="w-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
        <div className="flex flex-col items-stretch gap-3 sm:gap-4 lg:flex-row">
          {/* Main hero */}
          <div
            className="relative min-h-[180px] flex-1 overflow-hidden rounded-xl transition-colors duration-500 sm:min-h-[260px] md:min-h-[320px]"
            style={heroBackgroundStyle}
          >

            {/* Banner Images (crossfade) */}
            {slides.map((slide, i) => (
              <Image
                key={slide.id}
                src={slide.imageUrl}
                alt={`Banner ${i + 1}`}
                fill
                unoptimized
                loader={({ src }) => src}
                sizes="(max-width: 1024px) 100vw, 75vw"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${active === i ? 'opacity-100' : 'opacity-0'}`}
                priority={i === 0}
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden';
                }}
              />
            ))}

            <div className="absolute inset-0 bg-black/20 pointer-events-none" aria-hidden />

            <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-8 md:p-10">
              {currentSlide ? (
                <>
                  <h1 className="mb-4 whitespace-pre-line text-xl font-extrabold leading-tight text-white drop-shadow-md transition-all duration-300 sm:text-3xl md:text-4xl">
                    {currentSlide.title}
                  </h1>
                </>
              ) : (
                <p className="text-sm text-white/90 font-semibold">
                  {loading ? 'Loading hero content...' : 'No hero slides available.'}
                </p>
              )}
            </div>
            {/* Dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${active === i ? 'w-5 bg-brand-500' : 'w-2 bg-white/60 hover:bg-white'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side panel - hidden on mobile/tablet */}
          <div className="hidden lg:flex w-56 flex-col gap-3">
            {recommendedLoading ? (
              <div className="rounded-xl bg-white shadow-sm p-3 flex items-center gap-3 border border-gray-100 animate-pulse">
                <div className="w-14 aspect-[2/3] rounded bg-gray-200 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-3 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
              </div>
            ) : currentRecommendedBook ? (
              <div className="rounded-xl bg-white shadow-sm p-3 border border-gray-100">
                <Link
                  href={`/book?slug=${currentRecommendedBook.slug}`}
                  className="flex items-center gap-3 hover:opacity-90 transition cursor-pointer block"
                >
                  <div className="w-14 aspect-[2/3] bg-red-100 rounded flex-shrink-0 overflow-hidden">
                    {(() => {
                      const recommendedImageSrc = resolveImageSrc(currentRecommendedBook.image);
                      return recommendedImageSrc ? (
                        <Image
                          src={recommendedImageSrc}
                          alt={currentRecommendedBook.title || 'Most Read Book'}
                          width={56}
                          height={84}
                          unoptimized
                          loader={({ src }) => src}
                          className="h-full w-full object-cover"
                          onError={(event) => { event.currentTarget.style.display = 'none'; }}
                        />
                      ) : null;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider">RECOMMENDED</span>
                    <p className="text-xs text-gray-800 mt-1 font-bold leading-tight">Most Read Books</p>
                    <p className="text-[11px] text-gray-500 font-semibold leading-tight mt-1 line-clamp-2">{currentRecommendedBook.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{currentRecommendedBook.author}</p>
                  </div>
                </Link>

                {recommendedBooks.length > 1 && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRecommendedActive((prev) => (prev === 0 ? recommendedBooks.length - 1 : prev - 1));
                      }}
                      className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      aria-label="Previous recommended book"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {recommendedBooks.map((book, index) => (
                        <button
                          key={`${book.slug}-${index}`}
                          type="button"
                          onClick={() => setRecommendedActive(index)}
                          className={`h-1.5 rounded-full transition-all ${recommendedActive === index ? 'w-4 bg-red-500' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                          aria-label={`Go to recommended book ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRecommendedActive((prev) => (prev + 1) % recommendedBooks.length);
                      }}
                      className="w-6 h-6 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      aria-label="Next recommended book"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/shop" className="rounded-xl bg-white shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition cursor-pointer border border-gray-100 block">
                <div className="w-14 aspect-[2/3] bg-red-100 rounded flex-shrink-0 overflow-hidden">
                  <Image
                    src="/images/books/book1.jpg"
                    alt="Most Read Book"
                    width={56}
                    height={84}
                    className="h-full w-full object-cover"
                    onError={(event) => { event.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold tracking-wider">RECOMMENDED</span>
                  <p className="text-xs text-gray-800 mt-1 font-bold leading-tight">Most Read Books</p>
                </div>
              </Link>
            )}
            <div className="rounded-xl bg-amber-50 p-3 flex-1 flex flex-col justify-between hover:shadow-md transition border border-amber-100/50">
              <p className="text-xs font-bold text-gray-800">Shop Stories</p>
              {fictionLoading ? (
                <div className="grid grid-cols-2 gap-1.5 my-2 animate-pulse">
                  {Array.from({ length: FICTION_STORIES_PER_SLIDE }).map((_, idx) => (
                    <div key={`fiction-loading-${idx}`} className="aspect-[2/3] bg-white rounded-md shadow-sm" />
                  ))}
                </div>
              ) : currentFictionBooks.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-1.5 my-2">
                    {currentFictionBooks.map((book, index) => (
                      <Link
                        key={`${book.slug || String(book.id)}-${fictionActiveSlide}-${index}`}
                        href={`/book?slug=${book.slug}`}
                        className="bg-white rounded-md shadow-sm overflow-hidden block hover:shadow-md transition"
                        title={book.title}
                      >
                        <div className="relative aspect-[2/3]">
                          {(() => {
                            const fictionBookImageSrc = resolveImageSrc(book.image);
                            return fictionBookImageSrc ? (
                              <Image
                                src={fictionBookImageSrc}
                                alt={book.title}
                                fill
                                unoptimized
                                loader={({ src }) => src}
                                sizes="70px"
                                className="h-full w-full object-cover"
                                onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }}
                              />
                            ) : null;
                          })()}
                        </div>
                        <div className="p-1.5 border-t border-amber-100/70">
                          <p className="text-[9px] font-bold text-gray-800 leading-tight line-clamp-2">{book.title}</p>
                          <p className="text-[9px] text-gray-500 mt-0.5 leading-tight line-clamp-1">{book.author}</p>
                          <p className="text-[9px] font-black text-brand-600 mt-0.5">{formatBookPrice(book.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {fictionSlides.length > 1 && (
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFictionActiveSlide((prev) => (prev === 0 ? fictionSlides.length - 1 : prev - 1));
                        }}
                        className="w-6 h-6 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 hover:border-amber-300 hover:text-amber-800"
                        aria-label="Previous shop stories slide"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {fictionSlides.map((_, index) => (
                          <button
                            key={`fiction-slide-${index}`}
                            type="button"
                            onClick={() => setFictionActiveSlide(index)}
                            className={`h-1.5 rounded-full transition-all ${
                              fictionActiveSlide === index ? 'w-4 bg-amber-500' : 'w-1.5 bg-amber-200 hover:bg-amber-300'
                            }`}
                            aria-label={`Go to shop stories slide ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFictionActiveSlide((prev) => (prev + 1) % fictionSlides.length);
                        }}
                        className="w-6 h-6 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 hover:border-amber-300 hover:text-amber-800"
                        aria-label="Next shop stories slide"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[11px] text-gray-500 font-medium my-2">No fiction books available.</p>
              )}
              <Link
                href={fictionCategoryDetailHref}
                className="block w-full text-xs bg-brand-500 text-white font-bold py-2 rounded-lg hover:bg-brand-600 transition shadow-sm text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Most searched bar */}
        <div className="mt-5">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center mb-3">Most Searched</p>
          <div className="flex flex-wrap justify-start gap-2 overflow-x-auto pb-2 scrollbar-hide sm:justify-center">
            {trendingSearches.map((tag, i) => {
              const normalizedTag = slugifyCategory(tag);
              const genreSlug = normalizedTag ? genreSlugByTerm.get(normalizedTag) : undefined;

              if (genreSlug) {
                return (
                  <Link
                    key={`${tag}-${i}`}
                    href={`/categories?genre=${encodeURIComponent(genreSlug)}`}
                    className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-colors hover:border-brand-500 hover:text-brand-600 sm:px-4"
                  >
                    {tag}
                  </Link>
                );
              }

              return (
                <span
                  key={`${tag}-${i}`}
                  className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 opacity-80 sm:px-4"
                >
                  {tag}
                </span>
              );
            })}
            {!loading && trendingSearches.length === 0 && (
              <p className="text-xs text-gray-400">No trending searches available.</p>
            )}
          </div>
        </div>

        {loadError && (
          <p className="mt-3 text-xs text-amber-600 text-center">
            {loadError}
          </p>
        )}
      </div>
    </section>
  );
}
