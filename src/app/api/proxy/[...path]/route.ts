import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const url = `https://api-nivora.nahsbyte.my.id/api/v1/${pathString}`;

        console.log('🌐 Proxy request to:', url);

        // Forward Authorization header if present
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const authHeader = request.headers.get('authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔐 Forwarding Authorization header:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No Authorization header found in request');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed' },
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
        const url = `https://api-nivora.nahsbyte.my.id/api/v1/${pathString}`;
        const body = await request.json();

        console.log('🌐 Proxy POST request to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed' },
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
        const url = `https://api-nivora.nahsbyte.my.id/api/v1/${pathString}`;
        const body = await request.json();

        console.log('🌐 Proxy PUT request to:', url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed' },
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
        const url = `https://api-nivora.nahsbyte.my.id/api/v1/${pathString}`;

        console.log('🌐 Proxy DELETE request to:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy request failed' },
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