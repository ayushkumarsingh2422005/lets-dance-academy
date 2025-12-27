import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';

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
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Get admin ID and status from request body
        const { adminId, isActive } = await req.json();

        if (!adminId || typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, message: 'Admin ID and status are required' },
                { status: 400 }
            );
        }

        // Check if trying to deactivate self
        if (decoded.id === adminId && !isActive) {
            return NextResponse.json(
                { success: false, message: 'You cannot deactivate your own account' },
                { status: 400 }
            );
        }

        // If deactivating, check if this is the last active admin
        if (!isActive) {
            const activeAdminCount = await Admin.countDocuments({ isActive: true });

            if (activeAdminCount <= 1) {
                return NextResponse.json(
                    { success: false, message: 'Cannot deactivate the last active admin' },
                    { status: 400 }
                );
            }
        }

        // Update admin status
        const admin = await Admin.findByIdAndUpdate(
            adminId,
            { isActive },
            { new: true }
        ).select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: { admin }
        });

    } catch (error) {
        console.error('Toggle admin status error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update admin status' },
            { status: 500 }
        );
    }
}
