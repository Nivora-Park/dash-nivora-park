import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params;
        const pathString = path.join('/');
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathString}`;

        console.log('🌐 Proxy request to:', url);

        // Forward Authorization header if present
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Check for Authorization header (case insensitive)
        let authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        
        // If no Authorization header, try to get token from cookie
        if (!authHeader) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
                if (authCookie) {
                    const token = authCookie.split('=')[1];
                    authHeader = `Bearer ${token}`;
                    console.log('🔐 Found token in cookie, created Authorization header:', token.substring(0, 20) + '...');
                }
            }
        }
        
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔐 Forwarding Authorization header:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No Authorization header or auth-token cookie found in request');
            console.log('🔍 All request headers:', Object.fromEntries(request.headers.entries()));
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathString}`;
        const body = await request.json();

        console.log('🌐 Proxy POST request to:', url);

        // Forward Authorization header if present
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        let authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        
        // If no Authorization header, try to get token from cookie
        if (!authHeader) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
                if (authCookie) {
                    const token = authCookie.split('=')[1];
                    authHeader = `Bearer ${token}`;
                    console.log('🔐 Found token in cookie, created Authorization header:', token.substring(0, 20) + '...');
                }
            }
        }
        
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔐 Forwarding Authorization header:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No Authorization header or auth-token cookie found in POST request');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathString}`;
        const body = await request.json();

        console.log('🌐 Proxy PUT request to:', url);

        // Forward Authorization header if present
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        let authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        
        // If no Authorization header, try to get token from cookie
        if (!authHeader) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
                if (authCookie) {
                    const token = authCookie.split('=')[1];
                    authHeader = `Bearer ${token}`;
                    console.log('🔐 Found token in cookie, created Authorization header:', token.substring(0, 20) + '...');
                }
            }
        }
        
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔐 Forwarding Authorization header:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No Authorization header or auth-token cookie found in PUT request');
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
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
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${pathString}`;

        console.log('🌐 Proxy DELETE request to:', url);

        // Forward Authorization header if present
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        let authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        
        // If no Authorization header, try to get token from cookie
        if (!authHeader) {
            const cookieHeader = request.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
                if (authCookie) {
                    const token = authCookie.split('=')[1];
                    authHeader = `Bearer ${token}`;
                    console.log('🔐 Found token in cookie, created Authorization header:', token.substring(0, 20) + '...');
                }
            }
        }
        
        if (authHeader) {
            headers['Authorization'] = authHeader;
            console.log('🔐 Forwarding Authorization header:', authHeader.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No Authorization header or auth-token cookie found in DELETE request');
        }

        const response = await fetch(url, {
            method: 'DELETE',
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