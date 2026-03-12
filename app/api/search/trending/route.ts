import { NextResponse } from 'next/server';
import { buildHomeSummaryFallback } from '@/lib/api/fallback/home';

const DEFAULT_BACKEND_ORIGIN = 'http://127.0.0.1:8000';
const FALLBACK_TRENDING_SEARCHES = buildHomeSummaryFallback().trendingSearches;

function normalizeBackendOrigin(rawOrigin: string | undefined): string {
  const trimmed = rawOrigin?.trim();
  if (!trimmed) return DEFAULT_BACKEND_ORIGIN;
  return trimmed.replace(/\/api\/?$/i, '').replace(/\/$/, '');
}

function buildBackendApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const origin = normalizeBackendOrigin(process.env.BACKEND_ORIGIN);
  return `${origin}/api${normalizedPath}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function getListPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [
    record.results,
    record.items,
    record.data,
    record.trendingSearches,
    record.trending,
    record.searches,
  ];

  for (const item of candidates) {
    if (Array.isArray(item)) return item;
  }

  return [];
}

function toTrendingTerm(item: unknown): string {
  if (typeof item === 'string') return item.trim();

  const record = asRecord(item);
  if (!record) return '';

  const candidates = [
    record.term,
    record.query,
    record.keyword,
    record.name,
    record.title,
    record.value,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return '';
}

function normalizeTrendingPayload(payload: unknown): string[] {
  const items = getListPayload(payload);
  const unique = new Set<string>();

  for (const item of items) {
    const term = toTrendingTerm(item);
    if (!term) continue;
    unique.add(term);
    if (unique.size >= 12) break;
  }

  return Array.from(unique);
}

async function readJsonOrNull(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const upstream = await fetch(buildBackendApiUrl('/search/trending'), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    const body = await readJsonOrNull(upstream);
    const trending = normalizeTrendingPayload(body);

    if (trending.length > 0) {
      return NextResponse.json(trending, { status: 200 });
    }
  } catch {
    // Fall through to local fallback list.
  }

  return NextResponse.json(FALLBACK_TRENDING_SEARCHES, { status: 200 });
}
