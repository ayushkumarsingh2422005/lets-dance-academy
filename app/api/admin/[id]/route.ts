import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';

// DELETE - Delete admin
export async function DELETE(
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

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Await params
        const { id } = await params;

        // Check if trying to delete self
        if (decoded.id === id) {
            return NextResponse.json(
                { success: false, message: 'You cannot delete your own account' },
                { status: 400 }
            );
        }

        // Check total active admins count
        const activeAdminCount = await Admin.countDocuments({ isActive: true });

        if (activeAdminCount <= 1) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete the last admin. System must have at least one active admin.' },
                { status: 400 }
            );
        }

        // Find and delete the admin
        const adminToDelete = await Admin.findById(id);

        if (!adminToDelete) {
            return NextResponse.json(
                { success: false, message: 'Admin not found' },
                { status: 404 }
            );
        }

        // Delete the admin
        await Admin.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully'
        });

    } catch (error) {
        console.error('Delete admin error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete admin' },
            { status: 500 }
        );
    }
}

// PATCH - Toggle admin status
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

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Await params
        const { id } = await params;

        // Get status from request body
        const { isActive } = await req.json();

        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, message: 'Status is required' },
                { status: 400 }
            );
        }

        // Check if trying to deactivate self
        if (decoded.id === id && !isActive) {
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
            id,
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
