import { NextResponse } from 'next/server';
import { createMockUploadUrl } from '@/lib/server/printing-store';
import type { UploadAssetRequest } from '@/lib/api/contracts/printing';

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function validatePayload(payload: unknown): { valid: true; data: UploadAssetRequest } | { valid: false; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  const pushError = (field: string, message: string) => {
    if (!errors[field]) errors[field] = [];
    errors[field].push(message);
  };

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: { payload: ['Invalid payload.'] } };
  }

  const record = payload as Record<string, unknown>;
  const fileName = asString(record.fileName);
  const contentType = asString(record.contentType);
  const sizeInBytes = Number(record.sizeInBytes);

  if (!fileName) pushError('fileName', 'fileName is required.');
  if (!contentType) pushError('contentType', 'contentType is required.');
  if (!Number.isFinite(sizeInBytes) || sizeInBytes <= 0) pushError('sizeInBytes', 'sizeInBytes must be a positive number.');

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      fileName,
      contentType,
      sizeInBytes: Math.floor(sizeInBytes),
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

  return NextResponse.json(createMockUploadUrl(validated.data), { status: 201 });
}
