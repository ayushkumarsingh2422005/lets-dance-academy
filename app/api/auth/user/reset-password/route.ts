import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

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

        // Find user with OTP fields
        const user = await User.findOne({ email: email.toLowerCase() })
            .select('+resetPasswordOTP +resetPasswordOTPExpires');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or OTP' },
                { status: 400 }
            );
        }

        // Check if OTP exists and is not expired
        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
            return NextResponse.json(
                { success: false, message: 'No OTP found. Please request a new one' },
                { status: 400 }
            );
        }

        if (user.resetPasswordOTPExpires < new Date()) {
            return NextResponse.json(
                { success: false, message: 'OTP has expired. Please request a new one' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (user.resetPasswordOTP !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Password reset successfully',
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Reset password error:', error);
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
