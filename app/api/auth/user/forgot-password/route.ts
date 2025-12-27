import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateOTP, sendPasswordResetOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json(
                { success: true, message: 'If the email exists, an OTP has been sent' },
                { status: 200 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Set OTP expiration (10 minutes)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to database
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = otpExpires;
        await user.save();

        // Send OTP via email
        const emailSent = await sendPasswordResetOTP(user.email, otp, user.name);

        if (!emailSent) {
            return NextResponse.json(
                { success: false, message: 'Failed to send OTP email' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'OTP sent successfully to your email',
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Forgot password error:', error);
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
