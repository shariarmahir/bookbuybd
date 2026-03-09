'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar - hidden on mobile */}
      <div className="border-b border-gray-100 text-xs text-gray-500 py-1 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 hidden lg:flex">
            <Link href="/book" className="hover:text-brand-600 font-medium">Book Details</Link>
            <Link href="/shop" className="hover:text-brand-600 font-medium">Cart</Link>
            <Link href="/shop" className="hover:text-brand-600 font-medium">Checkout</Link>
            <Link href="/shop" className="hover:text-brand-600 font-medium">Order Flow</Link>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-600">Follow us on Facebook</a>
            <a href="#" className="hover:text-brand-600">Follow us on Instagram</a>
          </div>
        </div>
      </div>

      {/* Main nav - row 1: logo + icons (mobile), logo + search + icons (desktop) */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Hamburger menu button - mobile only */}
          <button
            className="md:hidden text-gray-600 hover:text-brand-600 shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 mr-1 md:mr-2">
            <img src="/logo.png" alt="BookBuyBD Logo" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Search - centered between logo and right icons */}
          <div className="hidden md:flex flex-1 mx-4 items-center border border-gray-200 rounded-full px-4 py-2 bg-gray-50">
            <input
              type="text"
              placeholder="Search books by title, category, author..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-600 min-w-0"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
            <button className="ml-2 text-gray-400 hover:text-brand-600 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Right side: Location + Profile + Cart */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            {/* Location - hidden on mobile/tablet */}
            <button className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-brand-600 font-medium leading-tight">Check<br />Availability</span>
            </button>

            {/* Divider - hidden on mobile */}
            <div className="hidden lg:block w-px h-6 bg-gray-200" />

            {/* Profile */}
            <button className="text-gray-600 hover:text-brand-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/shop" className="text-gray-600 hover:text-brand-600 relative block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-[10px] sm:text-xs flex items-center justify-center font-bold">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile search - full width below logo row */}
        <div className="md:hidden mt-2 flex items-center border border-gray-200 rounded-full px-3 py-2 bg-gray-50">
          <input
            type="text"
            placeholder="Search books..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-600 min-w-0"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <button className="ml-2 text-gray-400 hover:text-brand-600 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category nav - Desktop: always visible & evenly spaced, Mobile: toggled */}
      <nav className={`border-t border-gray-100 bg-white ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:items-center md:justify-between text-sm">
            {['Books', 'Audiobooks', 'Toys', 'Movies', 'Games', 'Coffee', 'Others', 'Gifts & Deals', '...'].map((item, i) => (
              <li key={i} className="md:flex-1 md:text-center">
                <a
                  href="#"
                  className={`block px-3 py-3 whitespace-nowrap font-medium transition-colors ${item === 'Gifts & Deals'
                    ? 'text-brand-600 border-b-2 border-brand-600'
                    : 'text-gray-700 hover:text-brand-600'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}