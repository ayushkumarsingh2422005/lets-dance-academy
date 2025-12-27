import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password, name, phone } = body;

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, message: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create new user
        const user = await User.create({
            email: email.toLowerCase(),
            password,
            name,
            phone,
            role: 'user',
        });

        // Generate JWT token
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch((error) => {
            console.error('Failed to send welcome email:', error);
        });

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        phone: user.phone,
                        role: user.role,
                    },
                    token,
                },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('User registration error:', error);
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
