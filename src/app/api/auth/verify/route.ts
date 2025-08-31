import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'nivora-park-super-secret-key-2024'; // Hardcode untuk test

// Debug: Log JWT secret (remove in production)
console.log('Verify Route - JWT_SECRET loaded:', JWT_SECRET ? 'YES' : 'NO');
console.log('Verify Route - JWT_SECRET length:', JWT_SECRET?.length || 0);

export async function GET(request: NextRequest) {
    try {
        // Get token from cookie
        const token = request.cookies.get('auth-token')?.value;

        console.log('Verify Route - Token found:', !!token);
        console.log('Verify Route - Token length:', token?.length || 0);

        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        // For backend access tokens, we don't need to verify JWT
        // Just check if token exists and return user info
        // In production, you might want to validate the token with backend

        // Extract user info from token payload (if it's a JWT)
        try {
            // Try to decode token to get user info
            const decoded = jwt.decode(token);
            console.log('Verify Route - Token decoded:', decoded);

            if (decoded && typeof decoded === 'object' && 'sub' in decoded) {
                // This is a backend JWT token
                const user = {
                    id: decoded.sub as string,
                    username: decoded.email || decoded.username || 'user',
                    role: decoded.role || 'user',
                    location_id: decoded.location_id || null,
                };

                return NextResponse.json({
                    success: true,
                    user,
                    token, // Return the same token
                });
            } else {
                // This is a backend access token, return basic info
                return NextResponse.json({
                    success: true,
                    user: {
                        id: 'unknown',
                        username: 'user',
                        role: 'user',
                        location_id: null,
                    },
                    token, // Return the same token
                });
            }
        } catch (decodeError) {
            console.log('Verify Route - Token decode failed, treating as access token');
            // Token is not a JWT, treat as access token
            return NextResponse.json({
                success: true,
                user: {
                    id: 'unknown',
                    username: 'user',
                    role: 'user',
                    location_id: null,
                },
                token, // Return the same token
            });
        }

    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { error: 'Token verification failed' },
            { status: 401 }
        );
    }
}
