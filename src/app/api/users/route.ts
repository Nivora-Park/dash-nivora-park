import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { mockUsers, findUserByUsername, findUserByEmail, addUser } from './mockData';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
    try {
        // Extract user info from headers (set by middleware)
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');
        const userLocationId = request.headers.get('x-location-id');

        if (!userId || !userRole) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Filter users based on role and location
        let filteredUsers = [...mockUsers];

        if (userRole === 'operator') {
            // Operators can only see users from their location
            filteredUsers = mockUsers.filter(user =>
                user.location_id === userLocationId || user.role === 'admin'
            );
        }
        // Admin can see all users

        // Remove password from response
        const safeUsers = filteredUsers.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        return NextResponse.json({
            success: true,
            data: safeUsers,
            total: safeUsers.length
        });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
    try {
        // Extract user info from headers
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');

        if (!userId || !userRole) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Only admin can create users
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        const { username, email, name, password, role, location_id, terminal, permissions } = await request.json();

        // Validation
        if (!username || !email || !name || !password || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if username already exists
        if (findUserByUsername(username)) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 409 }
            );
        }

        // Check if email already exists
        if (findUserByEmail(email)) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: (mockUsers.length + 1).toString(),
            username,
            email,
            name,
            password: hashedPassword,
            role,
            location_id: location_id || null,
            status: 'active',
            lastLogin: null,
            permissions: permissions || [],
            terminal: terminal || 'None',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Add to mock database
        addUser(newUser);

        // Return user without password
        const { password: _, ...safeUser } = newUser;

        return NextResponse.json({
            success: true,
            data: safeUser,
            message: 'User created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
