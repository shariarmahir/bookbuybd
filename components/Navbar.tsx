'use client';
import { type FormEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CART_UPDATED_EVENT, getStoredCartItems } from '@/components/pages/cartStore';
import { booksService } from '@/lib/api';

interface NavCategory {
  name: string;
  slug: string;
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function toTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractCategories(payload: unknown): NavCategory[] {
  const list = getListPayload(payload);
  const unique = new Map<string, NavCategory>();

  list.forEach((item) => {
    if (typeof item === 'string') {
      const name = item.trim();
      const slug = slugifyCategory(name);
      if (!name || !slug || unique.has(slug)) return;
      unique.set(slug, { name, slug });
      return;
    }

    if (!isRecord(item)) return;

    const name = toTrimmedString(item.name) || toTrimmedString(item.title);
    const rawSlug = toTrimmedString(item.slug);
    const slug = slugifyCategory(rawSlug || name);
    if (!name || !slug || unique.has(slug)) return;
    unique.set(slug, { name, slug });
  });

  return Array.from(unique.values());
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get('search')?.trim() ?? '';
  const activeGenreSlug = slugifyCategory(pathname === '/categories' ? searchParams.get('genre')?.trim() ?? '' : '');
  const [cartQty, setCartQty] = useState(0);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const categoryTrackRef = useRef<HTMLDivElement | null>(null);
  const [desktopCarousel, setDesktopCarousel] = useState(false);

  useEffect(() => {
    const syncCartQty = () => {
      const items = getStoredCartItems();
      const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
      setCartQty(totalQty);
    };

    const onStorage = () => {
      syncCartQty();
    };

    const onCartUpdated = () => {
      syncCartQty();
    };

    syncCartQty();
    window.addEventListener('storage', onStorage);
    window.addEventListener(CART_UPDATED_EVENT, onCartUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(CART_UPDATED_EVENT, onCartUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const payload = await booksService.getAllCategories();
        if (cancelled) return;

        const nextCategories = extractCategories(payload);
        setCategories(nextCategories);
      } catch {
        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(min-width: 768px)');
    const apply = () => setDesktopCarousel(media.matches);
    apply();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
  }, []);

  useEffect(() => {
    const track = categoryTrackRef.current;
    if (!track) return;

    const activeChip = track.querySelector<HTMLElement>('[data-active-category="true"]');
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeGenreSlug, pathname]);

  useEffect(() => {
    if (!desktopCarousel) return;

    const timer = window.setInterval(() => {
      const track = categoryTrackRef.current;
      if (!track) return;

      if (track.scrollWidth <= track.clientWidth + 2) return;

      const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const isAtEnd = track.scrollLeft >= maxScrollLeft - 2;

      if (isAtEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      const distance = Math.max(180, Math.floor(track.clientWidth * 0.72));
      track.scrollBy({ left: distance, behavior: 'smooth' });
    }, 3200);

    return () => window.clearInterval(timer);
  }, [desktopCarousel, categories.length]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const activeGenre = pathname === '/categories' ? searchParams.get('genre')?.trim() ?? '' : '';
    const keywordRaw = formData.get('search');
    const keyword = typeof keywordRaw === 'string' ? keywordRaw.trim() : '';

    if (activeGenre) {
      params.set('genre', activeGenre);
    }
    if (keyword) {
      params.set('search', keyword);
    }

    const query = params.toString();
    const href = query ? `/categories?${query}` : '/categories';
    router.push(href);
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    router.push('/');
    // Fallback hard navigation if client routing is blocked.
    setTimeout(() => {
      if (window.location.pathname !== '/') {
        window.location.assign('/');
      }
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#A7E6FF] shadow-sm">
      {/* Top bar - hidden on mobile */}
      <div className="hidden border-b border-gray-100 py-1 text-xs text-gray-500 md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden gap-4 lg:flex">
            <Link href="/shop" className="hover:text-brand-600 font-bold transition-all hover:translate-y-[-1px]">Cart</Link>
            <Link href="/shop" className="hover:text-brand-600 font-bold transition-all hover:translate-y-[-1px]">Order Flow</Link>
          </div>
          <div className="hidden gap-4 lg:flex">
            <a href="https://www.facebook.com/BookBuyBD5" className="hover:text-brand-600 font-bold transition-colors">Follow us on Facebook</a>
            <a href="#" className="hover:text-brand-600 font-bold transition-colors">Follow us on Instagram</a>
          </div>
        </div>
      </div>

      {/* Main nav - row 1: logo + icons (mobile), logo + search + icons (desktop) */}
      <div className="mx-auto max-w-7xl px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
          {/* Logo */}
          <Link href="/" scroll onClick={handleLogoClick} className="relative z-[60] mr-1 flex shrink-0 items-center md:mr-2">
            <Image src="/logo.png" alt="BookBuyBD Logo" width={144} height={48} className="h-9 w-auto object-contain sm:h-10 md:h-12" />
          </Link>

          {/* Search - centered between logo and right icons */}
          <motion.div
            initial={false}
            animate={{ flex: searchQueryParam ? 1.5 : 1 }}
            className="hidden md:flex flex-1 mx-4 items-center border border-gray-200 rounded-full px-4 py-2 bg-white/50 backdrop-blur-sm focus-within:bg-white focus-within:shadow-md transition-all duration-300"
          >
            <form key={`desktop:${pathname}:${searchQueryParam}`} onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <input
                name="search"
                type="text"
                placeholder="Search books by title, category, author..."
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 font-medium min-w-0 placeholder:text-gray-500"
                defaultValue={searchQueryParam}
              />
              <button type="submit" aria-label="Search books" className="ml-2 text-gray-400 hover:text-brand-600 shrink-0 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </motion.div>

          {/* Right side: Printing + Profile + Cart */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/printing"
              className="inline-flex items-center rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm transition hover:bg-brand-600 sm:px-3 sm:py-1.5 sm:text-xs md:text-sm"
            >
              <span className="sm:hidden">Print</span>
              <span className="hidden sm:inline">Printing Service</span>
            </Link>

            {/* Profile */}
            <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-brand-600">
              <svg className="h-5 w-5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/shop" className="relative block text-gray-600 transition-colors hover:text-brand-600">
              <svg className="h-5 w-5 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-brand-500 rounded-full text-white text-[10px] sm:text-xs flex items-center justify-center font-bold">
                {cartQty > 99 ? '99+' : cartQty}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile search - full width below logo row */}
        <form key={`mobile:${pathname}:${searchQueryParam}`} onSubmit={handleSearchSubmit} className="mt-2 flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-2 md:hidden">
          <input
            name="search"
            type="text"
            placeholder="Search books..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-600 min-w-0"
            defaultValue={searchQueryParam}
          />
          <button type="submit" aria-label="Search books" className="ml-2 text-gray-400 hover:text-brand-600 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      <div className="border-t border-white/30 bg-[#A7E6FF]">
        <div className="relative mx-auto max-w-7xl px-4 py-2">
          <div
            ref={categoryTrackRef}
            className="flex snap-x snap-mandatory flex-nowrap items-center gap-2 overflow-x-auto scroll-smooth px-0 scrollbar-hide md:overflow-x-hidden md:px-10"
          >
            <Link
              href="/categories"
              data-active-category={pathname === '/categories' && !activeGenreSlug ? 'true' : 'false'}
              className={`shrink-0 snap-start rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors sm:text-xs ${
                pathname === '/categories' && !activeGenreSlug
                  ? 'border-brand-600 bg-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-600'
              }`}
            >
              All
            </Link>

            {categories.map((category) => {
              const isActive = pathname === '/categories' && activeGenreSlug === category.slug;
              return (
                <Link
                  key={category.slug}
                  href={`/categories?genre=${encodeURIComponent(category.slug)}`}
                  data-active-category={isActive ? 'true' : 'false'}
                  className={`shrink-0 snap-start rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors sm:text-xs ${
                    isActive
                      ? 'border-brand-600 bg-brand-500 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-500 hover:text-brand-600'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}

            {!categoriesLoading && categories.length === 0 && (
              <span className="shrink-0 text-xs text-gray-500">
                No categories found
              </span>
            )}
          </div>
        </div>
      </div>

    </header>
  );
}
