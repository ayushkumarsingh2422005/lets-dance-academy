import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, otp, newPassword } = body;

        // Validation
        if (!email || !otp || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Email, OTP, and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Find admin with OTP fields
        const admin = await Admin.findOne({ email: email.toLowerCase() })
            .select('+resetPasswordOTP +resetPasswordOTPExpires');

        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or OTP' },
                { status: 400 }
            );
        }

        // Check if OTP exists and is not expired
        if (!admin.resetPasswordOTP || !admin.resetPasswordOTPExpires) {
            return NextResponse.json(
                { success: false, message: 'No OTP found. Please request a new one' },
                { status: 400 }
            );
        }

        if (admin.resetPasswordOTPExpires < new Date()) {
            return NextResponse.json(
                { success: false, message: 'OTP has expired. Please request a new one' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (admin.resetPasswordOTP !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Update password
        admin.password = newPassword;
        admin.resetPasswordOTP = undefined;
        admin.resetPasswordOTPExpires = undefined;
        await admin.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Admin password reset successfully',
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Admin reset password error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
