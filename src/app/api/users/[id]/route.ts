import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { mockUsers, findUserById, findUserIndexById, updateUser, removeUser } from '../mockData';

// GET /api/users/[id] - Get specific user
export async function GET(
    request: NextRequest,
    context: any
) {
    try {
        // Extract user info from headers
        const userId = request.headers.get('x-user-id');
        const userRole = request.headers.get('x-user-role');
        const userLocationId = request.headers.get('x-location-id');

        if (!userId || !userRole) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

    const params = context?.params ?? {};
    const targetUserId = params.id;
        const targetUser = findUserById(targetUserId);

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check permissions
        if (userRole === 'operator') {
            // Operators can only see users from their location or admin users
            if (targetUser.location_id !== userLocationId && targetUser.role !== 'admin') {
                return NextResponse.json(
                    { error: 'Insufficient permissions' },
                    { status: 403 }
                );
            }
        }

        // Return user without password
        const { password, ...safeUser } = targetUser;

        return NextResponse.json({
            success: true,
            data: safeUser
        });

    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/users/[id] - Update user
export async function PUT(
    request: NextRequest,
    context: any
) {
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

        // Only admin can update users
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

    const params = context?.params ?? {};
    const targetUserId = params.id;
    const targetUserIndex = findUserIndexById(targetUserId);

        if (targetUserIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const updateData = await request.json();
        const currentUser = mockUsers[targetUserIndex];

        // Update user data
        const updatedUser = {
            ...currentUser,
            ...updateData,
            updated_at: new Date().toISOString()
        };

        // Hash password if it's being updated
        if (updateData.password) {
            updatedUser.password = await bcrypt.hash(updateData.password, 10);
        }

        // Update in mock database
        updateUser(targetUserIndex, updatedUser);

        // Return updated user without password
        const { password, ...safeUser } = updatedUser;

        return NextResponse.json({
            success: true,
            data: safeUser,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
    request: NextRequest,
    context: any
) {
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

        // Only admin can delete users
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

    const params = context?.params ?? {};
    const targetUserId = params.id;
    const targetUserIndex = findUserIndexById(targetUserId);

        if (targetUserIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent admin from deleting themselves
        if (targetUserId === userId) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        // Remove user from mock database
        const deletedUser = removeUser(targetUserIndex);

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
            data: { id: deletedUser.id, username: deletedUser.username }
        });

    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/users/[id] - Partial update (for status changes)
export async function PATCH(
    request: NextRequest,
    context: any
) {
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

        // Only admin can update user status
        if (userRole !== 'admin') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

    const params = context?.params ?? {};
    const targetUserId = params.id;
    const targetUserIndex = findUserIndexById(targetUserId);

        if (targetUserIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const updateData = await request.json();
        const currentUser = mockUsers[targetUserIndex];

        // Update user data
        const updatedUser = {
            ...currentUser,
            ...updateData,
            updated_at: new Date().toISOString()
        };

        // Update in mock database
        updateUser(targetUserIndex, updatedUser);

        // Return updated user without password
        const { password, ...safeUser } = updatedUser;

        return NextResponse.json({
            success: true,
            data: safeUser,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Patch user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
