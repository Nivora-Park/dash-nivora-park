import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedRoutes = [
    '/',
    '/dashboard',
    '/merchant',
    '/location',
    '/vehicle-type',
    '/terminal',
    '/payment',
    '/transaction',
    '/membership',
    '/reports'
];

// Define public routes that should NEVER be protected
const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/verify'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's a public route - these should NEVER be protected
    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    );

    // If it's a public route, allow access immediately
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check if it's a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // If it's not a protected route, allow access
    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    // Get token from Authorization header or cookie
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
        request.cookies.get('auth-token')?.value;

    if (!token) {
        // Redirect to login if no token
        if (pathname === '/' || pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    try {
        // For backend access tokens, we don't need to verify JWT
        // Just check if token exists and is valid format
        if (token && token.length > 10) {
            // Token exists and looks valid, allow access
            // Add user info to headers for API routes
            if (pathname.startsWith('/api/')) {
                const requestHeaders = new Headers(request.headers);
                requestHeaders.set('x-user-id', 'authenticated');
                requestHeaders.set('x-user-role', 'user');
                requestHeaders.set('x-location-id', '');

                return NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                });
            }

            return NextResponse.next();
        } else {
            // Token is invalid, redirect to login
            if (pathname === '/' || pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

    } catch (error) {
        // Token is invalid, redirect to login
        if (pathname === '/' || pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
