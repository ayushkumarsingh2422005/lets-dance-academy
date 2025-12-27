import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
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

        // Get all admins (exclude password)
        const admins = await Admin.find({})
            .select('-password -resetPasswordOTP -resetPasswordOTPExpires')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: { admins }
        });

    } catch (error) {
        console.error('List admins error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch admins' },
            { status: 500 }
        );
    }
}
