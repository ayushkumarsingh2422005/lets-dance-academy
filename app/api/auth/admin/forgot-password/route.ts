import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
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

        // Find admin
        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            // Don't reveal if admin exists or not for security
            return NextResponse.json(
                { success: true, message: 'If the email exists, an OTP has been sent' },
                { status: 200 }
            );
        }

        // Check if admin is active
        if (!admin.isActive) {
            return NextResponse.json(
                { success: false, message: 'Admin account is deactivated' },
                { status: 403 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Set OTP expiration (10 minutes)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to database
        admin.resetPasswordOTP = otp;
        admin.resetPasswordOTPExpires = otpExpires;
        await admin.save();

        // Send OTP via email
        const emailSent = await sendPasswordResetOTP(admin.email, otp, admin.name);

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
        console.error('Admin forgot password error:', error);
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
