import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// PATCH - Change user password
export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        // Get token from Authorization header
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'user') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - User access required' },
                { status: 403 }
            );
        }

        const { currentPassword, newPassword } = await req.json();

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: 'New password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Get user with password
        const user = await User.findById(decoded.id).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to change password' },
            { status: 500 }
        );
    }
}
