import { NextResponse } from 'next/server';
import { getContactMessageStatus, updateContactMessageReadState } from '@/lib/server/contact-store';

interface RouteContext {
  params: Promise<{ messageId: string }>;
}

function hasTokenAuth(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? '';
  return /^token\s+\S+/i.test(auth.trim());
}

function toBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
  }
  return null;
}

export async function GET(request: Request, context: RouteContext) {
  if (!hasTokenAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication credentials were not provided.' },
      { status: 401 },
    );
  }

  const { messageId } = await context.params;
  const status = getContactMessageStatus(messageId);

  if (!status) {
    return NextResponse.json({ message: 'Contact message not found.' }, { status: 404 });
  }

  return NextResponse.json(status);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!hasTokenAuth(request)) {
    return NextResponse.json(
      { message: 'Authentication credentials were not provided.' },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const record = (body && typeof body === 'object') ? (body as Record<string, unknown>) : null;
  const readValue = toBoolean(record?.is_read ?? record?.isRead ?? record?.read);

  if (readValue === null) {
    return NextResponse.json({ message: 'is_read boolean is required.' }, { status: 400 });
  }

  const { messageId } = await context.params;
  const updated = updateContactMessageReadState(messageId, readValue);

  if (!updated) {
    return NextResponse.json({ message: 'Contact message not found.' }, { status: 404 });
  }

  return NextResponse.json({
    messageId: updated.messageId,
    status: updated.status,
    updatedAt: updated.updatedAt,
    isRead: updated.isRead,
  });
}
