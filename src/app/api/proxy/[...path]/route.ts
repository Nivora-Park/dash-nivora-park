import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-nivora.nahsbyte.my.id';

// Ensure Node.js runtime for streaming bodies
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function proxy(request: NextRequest, params: Promise<{ path: string[] }>) {
    try {
        const { path } = await params;
        const pathString = path.join('/');

        const targetUrl = new URL(`${API_BASE_URL}/${pathString}`);
        // Preserve query string for all methods
        const search = request.nextUrl.search || '';
        if (search) {
            targetUrl.search = search;
        }

        // Clone headers and drop hop-by-hop/auto headers
        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('content-length');
        headers.delete('connection');
        headers.delete('accept-encoding');
        // We'll potentially remove content-type for multipart so undici sets boundary

        // Build fetch options; stream body as-is (important for multipart)
        const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
        const fetchOptions: any = { method: request.method, headers };

        if (hasBody) {
            const contentType = request.headers.get('content-type') || '';
            const isMultipart = contentType.includes('multipart/form-data');
            const isJson = contentType.includes('application/json');

            if (isMultipart) {
                // Forward the original stream and headers (keep content-type with boundary)
                fetchOptions.body = request.body;
                fetchOptions.duplex = 'half';
            } else if (isJson) {
                const text = await request.text();
                fetchOptions.body = text;
                // keep content-type header as-is for JSON
            } else {
                // Fallback to streaming the body
                fetchOptions.body = request.body;
                fetchOptions.duplex = 'half';
            }
        }

        const response = await fetch(targetUrl.toString(), fetchOptions);

        // Pass through status and headers safely, stream body back
        const respHeaders = new Headers();
        const passthrough = ['content-type', 'cache-control', 'etag'];
        for (const [k, v] of response.headers.entries()) {
            const key = k.toLowerCase();
            if (passthrough.includes(key)) respHeaders.set(key, v);
        }
        // Return a standard Response (works in Next.js route handlers)
        return new Response(response.body, {
            status: response.status,
            headers: respHeaders,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Proxy request failed', details: message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(request, params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(request, params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxy(request, params);
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}