import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-nivora.nahsbyte.my.id';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const search = request.nextUrl.search || '';
        const url = `${API_BASE_URL}/${pathString}${search}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            const errorBody = contentType.includes('application/json')
                ? await response.json()
                : await response.text();
            return new NextResponse(
                typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain',
                    },
                }
            );
        }

        const data = contentType.includes('application/json') ? await response.json() : await response.text();
        return new NextResponse(
            typeof data === 'string' ? data : JSON.stringify(data),
            {
                status: response.status,
                headers: { 'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain' },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const url = `${API_BASE_URL}/${pathString}`;
        const body = await request.text();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body,
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            const errorBody = contentType.includes('application/json')
                ? await response.json()
                : await response.text();
            return new NextResponse(
                typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain',
                    },
                }
            );
        }

        const data = contentType.includes('application/json') ? await response.json() : await response.text();
        return new NextResponse(
            typeof data === 'string' ? data : JSON.stringify(data),
            {
                status: response.status,
                headers: { 'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain' },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const url = `${API_BASE_URL}/${pathString}`;
        const body = await request.text();

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body,
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            const errorBody = contentType.includes('application/json')
                ? await response.json()
                : await response.text();
            return new NextResponse(
                typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain',
                    },
                }
            );
        }

        const data = contentType.includes('application/json') ? await response.json() : await response.text();
        return new NextResponse(
            typeof data === 'string' ? data : JSON.stringify(data),
            {
                status: response.status,
                headers: { 'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain' },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const url = `${API_BASE_URL}/${pathString}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            const errorBody = contentType.includes('application/json')
                ? await response.json()
                : await response.text();
            return new NextResponse(
                typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody),
                {
                    status: response.status,
                    headers: {
                        'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain',
                    },
                }
            );
        }

        const data = contentType.includes('application/json') ? await response.json() : await response.text();
        return new NextResponse(
            typeof data === 'string' ? data : JSON.stringify(data),
            {
                status: response.status,
                headers: { 'Content-Type': contentType.includes('application/json') ? 'application/json' : 'text/plain' },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
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