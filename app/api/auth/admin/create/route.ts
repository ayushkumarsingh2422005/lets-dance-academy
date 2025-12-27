import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken } from '@/lib/jwt';
import { sendAdminCreatedEmail } from '@/lib/email';

function generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token or insufficient permissions' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { email, name, phone } = body;

        // Validation
        if (!email || !name) {
            return NextResponse.json(
                { success: false, message: 'Email and name are required' },
                { status: 400 }
            );
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return NextResponse.json(
                { success: false, message: 'Admin with this email already exists' },
                { status: 409 }
            );
        }

        // Generate temporary password
        const temporaryPassword = generateRandomPassword();

        // Create new admin
        const admin = await Admin.create({
            email: email.toLowerCase(),
            password: temporaryPassword,
            name,
            phone,
            role: 'admin',
            createdBy: decoded.id,
        });

        // Send admin credentials via email
        const emailSent = await sendAdminCreatedEmail(admin.email, admin.name, temporaryPassword);

        if (!emailSent) {
            console.error('Failed to send admin credentials email');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Admin created successfully. Credentials sent via email.',
                data: {
                    admin: {
                        id: admin._id,
                        email: admin.email,
                        name: admin.name,
                        phone: admin.phone,
                        role: admin.role,
                    },
                },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Admin creation error:', error);
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
