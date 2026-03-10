import { NextResponse } from 'next/server';
import { listCategoryItems } from '@/lib/server/printing-store';

interface RouteContext {
  params: Promise<{ categoryId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { categoryId } = await context.params;
  const items = listCategoryItems(categoryId);

  if (!items) {
    return NextResponse.json({ message: 'Printing category not found.' }, { status: 404 });
  }

  return NextResponse.json(items);
}
