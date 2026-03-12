'use client';
import { type FormEvent, type MouseEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CART_UPDATED_EVENT, getStoredCartItems } from '@/components/pages/cartStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get('search')?.trim() ?? '';
  const [cartQty, setCartQty] = useState(0);

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
            <a href="#" className="hover:text-brand-600 font-bold transition-colors">Follow us on Facebook</a>
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

    </header>
  );
}
