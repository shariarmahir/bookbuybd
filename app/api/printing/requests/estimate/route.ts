import { NextResponse } from 'next/server';
import { estimatePrinting, listCategoryItems } from '@/lib/server/printing-store';
import type { PrintingEstimatePayload } from '@/lib/api/contracts/printing';

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function asPositiveInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
  return Math.floor(numeric);
}

function validatePayload(payload: unknown): { valid: true; data: PrintingEstimatePayload } | { valid: false; message: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'Invalid payload.' };
  }

  const record = payload as Record<string, unknown>;
  const categoryId = asString(record.categoryId);
  const rawItemIds = record.itemIds;
  const quantity = asPositiveInt(record.quantity);
  const emergency = asBoolean(record.emergency);

  if (!categoryId) return { valid: false, message: 'categoryId is required.' };
  const categoryItems = listCategoryItems(categoryId);
  if (!categoryItems) return { valid: false, message: 'Invalid categoryId.' };

  if (!Array.isArray(rawItemIds) || rawItemIds.length === 0) {
    return { valid: false, message: 'itemIds must include at least one item.' };
  }

  const itemIds = rawItemIds
    .map((item) => asString(item))
    .filter(Boolean);

  if (itemIds.length === 0) {
    return { valid: false, message: 'itemIds must include at least one valid id.' };
  }

  const allowedIds = new Set(categoryItems.map((item) => item.id));
  const invalidIds = itemIds.filter((id) => !allowedIds.has(id));
  if (invalidIds.length > 0) {
    return { valid: false, message: `Invalid itemIds: ${invalidIds.join(', ')}` };
  }

  return {
    valid: true,
    data: {
      categoryId,
      itemIds,
      ...(quantity ? { quantity } : {}),
      ...(emergency !== undefined ? { emergency } : {}),
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
    return NextResponse.json({ message: validated.message }, { status: 400 });
  }

  return NextResponse.json(estimatePrinting(validated.data));
}
