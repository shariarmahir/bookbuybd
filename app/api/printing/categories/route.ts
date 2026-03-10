import { NextResponse } from 'next/server';
import { listPrintingCategories } from '@/lib/server/printing-store';

export async function GET() {
  return NextResponse.json(listPrintingCategories());
}
