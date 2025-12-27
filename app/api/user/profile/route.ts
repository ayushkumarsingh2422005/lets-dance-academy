import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET - Fetch user profile
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized - No token provided' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'user') return NextResponse.json({ success: false, message: 'Unauthorized - User access required' }, { status: 403 });

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: { user } });
    } catch (error) {
        console.error('Fetch profile error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch profile' }, { status: 500 });
    }
}

// PATCH - Update user profile
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

        const {
            name,
            phone,
            dateOfBirth,
            emergencyContactName,
            emergencyContactPhone,
            profilePicture
        } = await req.json();

        // Build update object - exclude email and password from this endpoint
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
        if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

        // Update user profile
        const user = await User.findByIdAndUpdate(
            decoded.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
