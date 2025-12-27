import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// PATCH - Toggle student active status
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        // Verify admin token
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Await params
        const { id } = await params;

        // Get status and reason from request body
        const { isActive, deactivationReason } = await req.json();

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, message: 'Status is required' },
                { status: 400 }
            );
        }

        // If deactivating, reason is required
        if (!isActive && !deactivationReason) {
            return NextResponse.json(
                { success: false, message: 'Deactivation reason is required' },
                { status: 400 }
            );
        }

        // Build update object
        const updateData: any = { isActive };

        if (!isActive) {
            // Deactivating - add reason and timestamp
            updateData.deactivationReason = deactivationReason;
            updateData.deactivatedAt = new Date();
        } else {
            // Activating - clear reason and timestamp
            updateData.deactivationReason = null;
            updateData.deactivatedAt = null;
        }

        // Update student status
        const student = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Student ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: { student }
        });

    } catch (error) {
        console.error('Toggle student status error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update student status' },
            { status: 500 }
        );
    }
}
