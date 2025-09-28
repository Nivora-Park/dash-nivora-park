import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.8.100:8080';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Forward to GET ${BASE_URL}/api/v1/file (list files)
  const target = new URL('/api/v1/file', API_BASE_URL);
  target.search = request.nextUrl.search || '';
  const hdr = new Headers(request.headers);
  hdr.delete('host');
  hdr.delete('content-length');
  // Ensure we pass auth when present and request JSON
  const auth = request.headers.get('authorization');
  if (auth) hdr.set('authorization', auth);
  const resp = await fetch(target.toString(), {
    method: 'GET',
  headers: (() => { hdr.set('accept', 'application/json'); return hdr; })(),
  });
  return new Response(resp.body, { status: resp.status, headers: resp.headers });
}

export async function POST(request: NextRequest) {
  // Forward multipart upload to ${BASE_URL}/api/v1/file
  const target = new URL('/api/v1/file', API_BASE_URL);
  target.search = request.nextUrl.search || '';
  const ct = request.headers.get('content-type') || '';
  if (!ct.toLowerCase().startsWith('multipart/form-data')) {
    return new Response(JSON.stringify({ code: 400, message: "request Content-Type isn't multipart/form-data" }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  // Read the entire request body so we can replay it across redirects
  let bodyArrayBuffer: ArrayBuffer;
  try {
    bodyArrayBuffer = await request.arrayBuffer();
  } catch (e) {
    return new Response(JSON.stringify({ code: 500, message: 'failed to read upload body' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }

  // Prepare headers, forwarding auth if present
  const headers = new Headers();
  headers.set('content-type', ct);
  headers.set('accept', 'application/json');
  const auth = request.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  // Helper to POST and manually follow up to 3 redirects with the same body
  const postWithRedirects = async (urlStr: string, maxHops = 3): Promise<Response> => {
    let currentUrl = urlStr;
    for (let i = 0; i <= maxHops; i++) {
      const resp = await fetch(currentUrl, {
        method: 'POST',
        headers,
        body: Buffer.from(bodyArrayBuffer),
        redirect: 'manual',
      } as RequestInit);

      // 2xx -> done
      if (resp.status < 300 || resp.status >= 400) return resp;

      // 30x with Location -> follow
      if ([301, 302, 303, 307, 308].includes(resp.status)) {
        const loc = resp.headers.get('location');
        if (!loc) return resp;
        // Resolve relative redirects against API_BASE_URL
        currentUrl = loc.startsWith('http') ? loc : new URL(loc, API_BASE_URL).toString();
        continue;
      }

      // Other statuses, return as-is
      return resp;
    }
    // Too many redirects
    return new Response('Too many redirects', { status: 508 });
  };

  try {
    const resp = await postWithRedirects(target.toString());
    return new Response(resp.body, { status: resp.status, headers: resp.headers });
  } catch (e: any) {
    const msg = typeof e?.message === 'string' ? e.message : 'upload proxy failed';
    return new Response(JSON.stringify({ code: 502, message: msg }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}
