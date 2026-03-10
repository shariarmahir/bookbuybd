import { NextResponse } from 'next/server';
import { getPrintingRequestStatus } from '@/lib/server/printing-store';

interface RouteContext {
  params: Promise<{ requestId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { requestId } = await context.params;
  const status = getPrintingRequestStatus(requestId);

  if (!status) {
    return NextResponse.json({ message: 'Printing request not found.' }, { status: 404 });
  }

  return NextResponse.json(status);
}
