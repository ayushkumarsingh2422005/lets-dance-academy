import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find admin with password field
        const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if admin is active
        if (!admin.isActive) {
            return NextResponse.json(
                { success: false, message: 'Admin account is deactivated' },
                { status: 403 }
            );
        }

        // Compare password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            id: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Admin login successful',
                data: {
                    admin: {
                        id: admin._id,
                        email: admin.email,
                        name: admin.name,
                        phone: admin.phone,
                        role: admin.role,
                    },
                    token,
                },
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('Admin login error:', error);
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
