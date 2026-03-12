import { apiClient } from '@/lib/api/client';
import type {
  AuthorOfWeekResponse,
  BestSellingBook,
  BestSellingQuery,
  BookAuthor,
  CatalogQuery,
  BookDetailResponse,
  BookListItem,
  BookListQuery,
  PaginatedResponse,
} from '@/lib/api/contracts/books';
import { endpoints } from '@/lib/api/endpoints';

const MAX_SEARCH_PAGES = 40;
const MAX_CATEGORY_PAGES = 40;

interface SearchPageEnvelope {
  count?: unknown;
  next?: unknown;
  previous?: unknown;
  results: unknown[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSearchPageEnvelope(value: unknown): value is SearchPageEnvelope {
  return isRecord(value) && Array.isArray(value.results);
}

function extractListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseNextPageNumber(nextValue: unknown): number | null {
  if (typeof nextValue !== 'string' || !nextValue.trim()) {
    return null;
  }

  try {
    const url = new URL(nextValue, 'http://local.invalid');
    const rawPage = url.searchParams.get('page');
    if (!rawPage) return null;
    const parsed = Number(rawPage);
    if (!Number.isFinite(parsed) || parsed < 1) return null;
    return Math.floor(parsed);
  } catch {
    return null;
  }
}

function itemMatchesCategory(item: unknown, categorySlug: string): boolean {
  if (!isRecord(item)) return false;

  const category = isRecord(item.category) ? item.category : null;
  const candidates = [
    typeof item.category_name === 'string' ? item.category_name : '',
    category && typeof category.slug === 'string' ? category.slug : '',
    category && typeof category.name === 'string' ? category.name : '',
    typeof item.genre === 'string' ? item.genre : '',
  ]
    .map((value) => slugifyCategory(value))
    .filter(Boolean);

  return candidates.includes(categorySlug);
}

function filterCatalogByCategory(payload: unknown, category: string): unknown {
  const categorySlug = slugifyCategory(category);
  if (!categorySlug) return payload;

  if (Array.isArray(payload)) {
    return payload.filter((item) => itemMatchesCategory(item, categorySlug));
  }

  if (isSearchPageEnvelope(payload)) {
    const results = payload.results.filter((item) => itemMatchesCategory(item, categorySlug));
    return {
      ...payload,
      count: results.length,
      next: null,
      previous: null,
      results,
    };
  }

  return payload;
}

async function fetchAllSearchCatalogPages(search: string): Promise<unknown> {
  const results: unknown[] = [];
  let page = 1;

  for (let pageIndex = 0; pageIndex < MAX_SEARCH_PAGES; pageIndex += 1) {
    const payload = await apiClient.get<unknown>(endpoints.books.search, {
      query: { q: search, page },
    });

    if (!isSearchPageEnvelope(payload)) {
      return payload;
    }

    results.push(...payload.results);

    if (!payload.next) {
      break;
    }

    const nextPage = parseNextPageNumber(payload.next);
    if (nextPage !== null) {
      if (nextPage <= page) break;
      page = nextPage;
      continue;
    }

    page += 1;
  }

  return {
    count: results.length,
    next: null,
    previous: null,
    results,
  };
}

async function fetchAllCategories(): Promise<unknown> {
  const rows: unknown[] = [];
  let page = 1;

  for (let pageIndex = 0; pageIndex < MAX_CATEGORY_PAGES; pageIndex += 1) {
    const payload = await apiClient.get<unknown>(endpoints.books.categories, {
      query: { page },
    });

    const items = extractListPayload(payload);
    rows.push(...items);

    if (!isRecord(payload) || !('next' in payload)) {
      break;
    }

    const nextPage = parseNextPageNumber(payload.next);
    if (nextPage === null || nextPage <= page) {
      break;
    }
    page = nextPage;
  }

  return rows;
}

function normalizeBestSellingLimit(limit?: number): number | undefined {
  if (typeof limit !== 'number' || Number.isNaN(limit)) return undefined;
  return Math.max(1, Math.min(100, Math.floor(limit)));
}

export const booksService = {
  list(query: BookListQuery = {}) {
    return apiClient.get<PaginatedResponse<BookListItem>>(endpoints.books.list, { query });
  },

  getCatalog(query: CatalogQuery = {}) {
    const category = typeof query.category === 'string' ? query.category.trim() : '';
    const search = typeof query.search === 'string' ? query.search.trim() : '';

    if (search) {
      return fetchAllSearchCatalogPages(search).then((payload) =>
        category ? filterCatalogByCategory(payload, category) : payload,
      );
    }

    return apiClient.get<unknown>(endpoints.books.list, {
      query: category ? { category } : undefined,
    });
  },

  getBestSelling(query: BestSellingQuery = {}) {
    const limit = normalizeBestSellingLimit(query.limit);
    return apiClient.get<BestSellingBook[]>(endpoints.books.bestSelling, {
      query: limit ? { limit } : undefined,
    });
  },

  getComingSoon(query: { limit?: number } = {}) {
    const limit = normalizeBestSellingLimit(query.limit);
    return apiClient.get<unknown>(endpoints.books.list, {
      query: {
        is_coming_soon: true,
        ...(limit ? { limit } : {}),
      },
    });
  },

  getCategories() {
    return apiClient.get<unknown>(endpoints.books.categories);
  },

  getAllCategories() {
    return fetchAllCategories();
  },

  getAuthorOfWeek() {
    return apiClient.get<AuthorOfWeekResponse>(endpoints.books.authorOfWeek);
  },

  getAuthorBySlug(authorSlug: string) {
    return apiClient.get<BookAuthor>(endpoints.books.authorDetail(authorSlug));
  },

  getBooksOfYear(query: { year?: number; limit?: number } = {}) {
    const year =
      typeof query.year === 'number' && Number.isFinite(query.year)
        ? Math.floor(query.year)
        : undefined;
    const limit = normalizeBestSellingLimit(query.limit);

    return apiClient.get<unknown>(endpoints.books.booksOfYear, {
      query: {
        ...(year ? { year } : {}),
        ...(limit ? { limit } : {}),
      },
    });
  },

  getBySlug(bookSlug: string) {
    return apiClient.get<BookDetailResponse>(endpoints.books.detail(bookSlug));
  },

  getById(bookId: string) {
    return apiClient.get<BookDetailResponse>(endpoints.books.detail(bookId));
  },

  like(bookId: string) {
    return apiClient.post<{ liked: true }>(endpoints.books.likes(bookId));
  },

  unlike(bookId: string) {
    return apiClient.delete<{ liked: false }>(endpoints.books.likes(bookId));
  },
};
