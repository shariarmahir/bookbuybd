'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { books } from '@/lib/data';

function normalizeQuery(q: string) {
  return q.trim().toLowerCase();
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  const results = useMemo(() => {
    const query = normalizeQuery(initialQ);
    if (!query) return [];
    return books.filter(b => {
      const title = b.title.toLowerCase();
      const author = b.author.toLowerCase();
      const category = b.category.toLowerCase();
      return title.includes(query) || author.includes(query) || category.includes(query);
    });
  }, [initialQ]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextQ = q.trim();
    if (!nextQ) {
      router.push('/search');
      return;
    }
    router.push(`/search?q=${encodeURIComponent(nextQ)}`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">Search</h1>
            <p className="text-sm text-gray-500 mt-1">
              {initialQ.trim() ? (
                <>
                  Showing results for <span className="font-bold text-gray-800">&quot;{initialQ.trim()}&quot;</span>
                </>
              ) : (
                'Type a query to find books by title, author, or category.'
              )}
            </p>
          </div>
          <Link href="/categories" className="hidden sm:inline-flex text-sm font-bold text-brand-600 hover:text-brand-700 items-center gap-1">
            Browse categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <form onSubmit={onSubmit} role="search" className="flex items-center gap-2">
          <div className="flex-1 flex items-center border border-gray-200 rounded-full px-4 py-2 bg-white shadow-sm focus-within:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search books..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 font-medium min-w-0 placeholder:text-gray-500 px-2"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q.trim() && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQ('')}
                className="text-gray-400 hover:text-gray-600 shrink-0 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-brand-500 text-white text-sm font-bold shadow-sm hover:bg-brand-600 active:scale-[0.99] transition"
          >
            Search
          </button>
        </form>

        {initialQ.trim() && (
          <div className="text-xs text-gray-500">
            {results.length ? (
              <span>{results.length} result{results.length === 1 ? '' : 's'}</span>
            ) : (
              <span>No results found.</span>
            )}
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((b) => (
              <Link
                key={b.id}
                href="/book"
                className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 uppercase">{b.author}</p>
                        <p className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition">
                          {b.title}
                        </p>
                      </div>
                      {b.discount ? (
                        <span className="text-[10px] font-extrabold text-white bg-brand-500 rounded-full px-2 py-1 shrink-0">
                          -{b.discount}%
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-extrabold text-gray-900">TK {b.price}</span>
                      {b.originalPrice ? (
                        <span className="text-xs text-gray-400 line-through">TK {b.originalPrice}</span>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-gray-500 font-semibold">{b.category}</span>
                      <span className={`text-[11px] font-bold ${b.availableInStore ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {b.availableInStore ? 'In store' : 'Online only'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
