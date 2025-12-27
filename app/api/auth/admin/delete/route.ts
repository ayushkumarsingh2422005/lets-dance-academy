import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';

export async function DELETE(req: NextRequest) {
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

        // Get admin ID from request body
        const { adminId } = await req.json();

        if (!adminId) {
            return NextResponse.json(
                { success: false, message: 'Admin ID is required' },
                { status: 400 }
            );
        }

        // Check if trying to delete self
        if (decoded.id === adminId) {
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
        const adminToDelete = await Admin.findById(adminId);

        if (!adminToDelete) {
            return NextResponse.json(
                { success: false, message: 'Admin not found' },
                { status: 404 }
            );
        }

        // Delete the admin
        await Admin.findByIdAndDelete(adminId);

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
