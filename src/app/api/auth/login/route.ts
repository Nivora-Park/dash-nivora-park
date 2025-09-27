import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'nivora-park-super-secret-key-2024';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        console.log('🔐 Login attempt for:', username);

        // Forward login request to backend server
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username, // Use 'email' instead of 'username' as per Swagger
                password: password
            }),
        });

        const backendData = await backendResponse.json();
        console.log('🔐 Backend response:', backendData);

        if (backendResponse.ok && backendData.code === 200) {
            // Backend login successful, use backend access token
            const loginData = backendData.data;
            const accessToken = loginData.access_token;
            const userData = loginData.user;

            console.log('🔐 Backend login successful, user:', userData);
            console.log('🔐 Using backend access token for API calls');

            // Create response with user data and backend token
            const response = NextResponse.json({
                success: true,
                message: 'Login successful',
                user: {
                    id: userData.id,
                    username: userData.email, // Use email as username
                    role: userData.role || 'user',
                    location_id: userData.location_id,
                },
                token: accessToken, // Use backend access token directly
            });

            // Set httpOnly cookie for server-side auth
            response.cookies.set('auth-token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60, // 24 hours
                path: '/',
            });

            return response;
        } else {
            // Backend login failed, return error
            const errorMessage = backendData.message || 'Invalid credentials';
            console.log('🔐 Backend login failed:', errorMessage);
            return NextResponse.json(
                { error: errorMessage },
                { status: backendResponse.status }
            );
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
