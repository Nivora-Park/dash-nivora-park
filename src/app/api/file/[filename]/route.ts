import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.8.100:8080';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const target = `${API_BASE_URL}/api/v1/file/${encodeURIComponent(filename)}`;
  // Simple and robust: redirect the browser to the backend file URL.
  // Images can be loaded cross-origin without CORS for display.
  return NextResponse.redirect(target, 302);
}
