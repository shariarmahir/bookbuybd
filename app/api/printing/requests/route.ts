import { NextResponse } from 'next/server';
import {
  createPrintingRequest,
  listCategoryItems,
  listPrintingRequests,
} from '@/lib/server/printing-store';
import type { CreatePrintingRequestPayload } from '@/lib/api/contracts/printing';

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return numeric;
}

function asOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function validatePayload(payload: unknown): { valid: true; data: CreatePrintingRequestPayload } | { valid: false; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  const pushError = (field: string, message: string) => {
    if (!errors[field]) errors[field] = [];
    errors[field].push(message);
  };

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: { payload: ['Invalid payload.'] } };
  }

  const record = payload as Record<string, unknown>;
  const categoryId = asString(record.categoryId);
  const rawItemIds = record.itemIds;
  const quantity = asOptionalNumber(record.quantity);
  const budget = asOptionalNumber(record.budget);
  const requiredBy = asString(record.requiredBy);
  const notes = asString(record.notes);
  const emergency = asOptionalBoolean(record.emergency);
  const rawAssetUrls = record.assetUrls;

  if (!categoryId) {
    pushError('categoryId', 'categoryId is required.');
  }

  const categoryItems = categoryId ? listCategoryItems(categoryId) : null;
  if (categoryId && !categoryItems) {
    pushError('categoryId', 'Invalid categoryId.');
  }

  if (!Array.isArray(rawItemIds) || rawItemIds.length === 0) {
    pushError('itemIds', 'itemIds must include at least one item.');
  }

  const itemIds = Array.isArray(rawItemIds)
    ? rawItemIds.map((item) => asString(item)).filter(Boolean)
    : [];

  if (itemIds.length === 0) {
    pushError('itemIds', 'itemIds must include at least one valid id.');
  } else if (categoryItems) {
    const validIds = new Set(categoryItems.map((item) => item.id));
    const invalidIds = itemIds.filter((itemId) => !validIds.has(itemId));
    if (invalidIds.length > 0) {
      pushError('itemIds', `Invalid itemIds for category: ${invalidIds.join(', ')}`);
    }
  }

  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity <= 0)) {
    pushError('quantity', 'quantity must be a positive integer.');
  }

  if (budget !== undefined && budget < 0) {
    pushError('budget', 'budget cannot be negative.');
  }

  if (requiredBy && Number.isNaN(Date.parse(requiredBy))) {
    pushError('requiredBy', 'requiredBy must be a valid date string.');
  }

  const assetUrls = Array.isArray(rawAssetUrls)
    ? rawAssetUrls.map((url) => asString(url)).filter(Boolean)
    : [];

  if (rawAssetUrls !== undefined && !Array.isArray(rawAssetUrls)) {
    pushError('assetUrls', 'assetUrls must be an array of URLs.');
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      categoryId,
      itemIds,
      ...(quantity !== undefined ? { quantity: Math.floor(quantity) } : {}),
      ...(budget !== undefined ? { budget } : {}),
      ...(requiredBy ? { requiredBy } : {}),
      ...(notes ? { notes } : {}),
      ...(emergency !== undefined ? { emergency } : {}),
      ...(assetUrls.length > 0 ? { assetUrls } : {}),
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const validated = validatePayload(body);
  if (!validated.valid) {
    return NextResponse.json({ errors: validated.errors }, { status: 400 });
  }

  return NextResponse.json(createPrintingRequest(validated.data), { status: 201 });
}

export async function GET() {
  return NextResponse.json(listPrintingRequests());
}
