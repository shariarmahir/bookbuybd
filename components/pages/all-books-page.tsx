'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ApiError, apiClient, endpoints } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '/api';
const BACKEND_ORIGIN = (() => {
  const explicitOrigin = process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.trim();
  if (explicitOrigin) {
    return explicitOrigin.replace(/\/$/, '');
  }

  try {
    return API_BASE_URL ? new URL(API_BASE_URL).origin.replace(/\/$/, '') : '';
  } catch {
    return '';
  }
})();

const MAX_BOOK_PAGES = 80;
type BookVariant = 'paperback' | 'hardcover';

interface AllBookItem {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  paperbackPrice: string;
  hardcoverPrice: string;
  paperbackQuality: string;
  hardcoverQuality: string;
  defaultVariant: BookVariant;
  image: string;
  inStock: boolean;
  isComingSoon: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return fallback;
}

function resolveImageSrc(image: string): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:') || image.startsWith('blob:')) {
    return image;
  }
  if (image.startsWith('/')) {
    return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}${image}` : image;
  }

  return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/${image}` : `/${image}`;
}

function formatPrice(value: string): string {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return `TK ${numeric.toFixed(2)}`;
  return value ? `TK ${value}` : 'TK 0.00';
}

function normalizeVariant(value: unknown): BookVariant | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'paperback' || normalized === 'hardcover') return normalized;
  return null;
}

function readVariantField(source: Record<string, unknown>, variant: BookVariant, field: 'price' | 'quality'): string {
  const variantsObj = isRecord(source.variants) ? source.variants : null;
  const selectedVariantObj = variantsObj && isRecord(variantsObj[variant]) ? variantsObj[variant] : null;
  const directKey = `${variant}_${field}`;
  const value = toText(
    (selectedVariantObj?.[field] ?? source[directKey]) as unknown,
  );
  if (value) return value;

  if (field === 'price' && variant === 'paperback') {
    return toText(source.price);
  }

  if (field === 'quality') {
    return variant === 'paperback' ? 'Standard' : 'Premium';
  }

  return '';
}

function parseNextPage(nextValue: unknown, currentPage: number): number | null {
  if (typeof nextValue !== 'string' || !nextValue.trim()) return null;

  try {
    const parsed = new URL(nextValue, 'http://local.invalid');
    const rawPage = parsed.searchParams.get('page');
    if (!rawPage) return null;
    const page = Number(rawPage);
    if (!Number.isFinite(page) || page <= currentPage) return null;
    return Math.floor(page);
  } catch {
    return null;
  }
}

function extractPageRows(payload: unknown, currentPage: number): { rows: unknown[]; nextPage: number | null } {
  if (Array.isArray(payload)) {
    return { rows: payload, nextPage: null };
  }

  if (!isRecord(payload)) {
    return { rows: [], nextPage: null };
  }

  const rows = Array.isArray(payload.results)
    ? payload.results
    : Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  const nextPageFromUrl = parseNextPage(payload.next, currentPage);
  if (nextPageFromUrl !== null) {
    return { rows, nextPage: nextPageFromUrl };
  }

  const total = Number(payload.total);
  const limit = Number(payload.limit);
  const offset = Number(payload.offset);
  if (Number.isFinite(total) && Number.isFinite(limit) && Number.isFinite(offset)) {
    const hasMore = offset + limit < total;
    return { rows, nextPage: hasMore ? currentPage + 1 : null };
  }

  return { rows, nextPage: null };
}

function normalizeBook(value: unknown): AllBookItem | null {
  if (!isRecord(value)) return null;

  const id = toText(value.id);
  const slug = toText(value.slug) || id;
  const title = toText(value.title);
  if (!id || !slug || !title) return null;

  const authorObj = isRecord(value.author) ? value.author : null;
  const categoryObj = isRecord(value.category) ? value.category : null;
  const paperbackPrice = readVariantField(value, 'paperback', 'price') || '0';
  const hardcoverPrice = readVariantField(value, 'hardcover', 'price');
  const paperbackQuality = readVariantField(value, 'paperback', 'quality');
  const hardcoverQuality = readVariantField(value, 'hardcover', 'quality');
  const defaultVariant = normalizeVariant(value.default_variant)
    ?? (paperbackPrice ? 'paperback' : 'hardcover');

  return {
    id,
    slug,
    title,
    author: toText(value.author_name) || toText(authorObj?.name) || 'Unknown Author',
    category: toText(value.category_name) || toText(categoryObj?.name) || 'General',
    paperbackPrice,
    hardcoverPrice,
    paperbackQuality,
    hardcoverQuality,
    defaultVariant,
    image: resolveImageSrc(toText(value.image)),
    inStock: toBoolean(value.is_in_stock, false),
    isComingSoon: toBoolean(value.is_coming_soon, false),
  };
}

function BookPreviewImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] font-semibold text-gray-500">
        {title}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      width={500}
      height={750}
      unoptimized
      loader={({ src: imageSrc }) => imageSrc}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function AllBooksPage() {
  const [books, setBooks] = useState<AllBookItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAllBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const aggregate: AllBookItem[] = [];
        const seen = new Set<string>();
        let page = 1;

        for (let pageIndex = 0; pageIndex < MAX_BOOK_PAGES; pageIndex += 1) {
          const payload = await apiClient.get<unknown>(endpoints.books.list, {
            cache: 'no-store',
            query: { page },
          });

          const { rows, nextPage } = extractPageRows(payload, page);
          rows.forEach((row) => {
            const normalized = normalizeBook(row);
            if (!normalized || seen.has(normalized.id)) return;
            seen.add(normalized.id);
            aggregate.push(normalized);
          });

          if (nextPage === null) break;
          page = nextPage;
        }

        if (!cancelled) {
          setBooks(aggregate);
        }
      } catch (loadError) {
        if (!cancelled) {
          setBooks([]);
          setError(loadError instanceof ApiError ? loadError.message : 'Failed to load books.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAllBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) return books;

    return books.filter((book) => (
      `${book.title} ${book.author} ${book.category} ${book.paperbackQuality} ${book.hardcoverQuality}`.toLowerCase().includes(normalizedQuery)
    ));
  }, [books, normalizedQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Books</h1>
          <p className="mt-1 text-sm text-gray-500">Browse the full book collection.</p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, author, or category..."
          className="w-full sm:w-80 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {!loading && !error && (
        <p className="mb-4 text-xs font-semibold text-gray-500">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={`book-skeleton-${idx}`} className="rounded-xl border border-gray-100 bg-white p-2 animate-pulse">
              <div className="aspect-[2/3] rounded-md bg-gray-200" />
              <div className="mt-2 h-3 rounded bg-gray-200" />
              <div className="mt-1 h-3 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && filteredBooks.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">No books found for your search.</p>
        </div>
      )}

      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredBooks.map((book) => (
            <Link
              key={book.id}
              href={`/book?slug=${encodeURIComponent(book.slug)}`}
              className="rounded-xl border border-gray-100 bg-white p-2 hover:shadow-md transition"
            >
              <div className="aspect-[2/3] rounded-md bg-gray-100 overflow-hidden">
                <BookPreviewImage src={book.image} title={book.title} />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">{book.title}</p>
                <p className="mt-1 text-[11px] text-gray-500 line-clamp-1">{book.author}</p>
                <p className="text-[10px] text-gray-400 line-clamp-1">{book.category}</p>
                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-black text-brand-600">
                      PB {formatPrice(book.paperbackPrice)} · {book.paperbackQuality}
                    </p>
                    {book.hardcoverPrice && (
                      <p className="text-[10px] font-black text-slate-700">
                        HC {formatPrice(book.hardcoverPrice)} · {book.hardcoverQuality}
                      </p>
                    )}
                  </div>
                  {book.isComingSoon ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Soon</span>
                  ) : (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${book.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                      {book.inStock ? 'In stock' : 'Out'}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
