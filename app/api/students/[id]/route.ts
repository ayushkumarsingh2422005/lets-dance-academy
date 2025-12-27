import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET - Get single student
export async function GET(
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

        const student = await User.findById(id)
            .select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { student }
        });

    } catch (error) {
        console.error('Get student error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch student' },
            { status: 500 }
        );
    }
}

// PATCH - Update student
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

        const { name, email, phone, dateOfBirth, emergencyContactName, emergencyContactPhone, profilePicture } = await req.json();

        // Build update object (exclude password updates here for security)
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
        if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

        const student = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -resetPasswordOTP -resetPasswordOTPExpires');

        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Student updated successfully',
            data: { student }
        });

    } catch (error) {
        console.error('Update student error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update student' },
            { status: 500 }
        );
    }
}

// DELETE - Delete student
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

        const student = await User.findByIdAndDelete(id);

        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete student' },
            { status: 500 }
        );
    }
}
