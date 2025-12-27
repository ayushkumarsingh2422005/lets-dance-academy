import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

// GET - List all students
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

        // Verify admin token
        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Get query parameters for filtering/pagination
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Build search query
        const searchQuery = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ]
        } : {};

        // Get students with pagination
        const students = await User.find(searchQuery)
            .select('-password -resetPasswordOTP -resetPasswordOTPExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalStudents = await User.countDocuments(searchQuery);

        return NextResponse.json({
            success: true,
            data: {
                students,
                pagination: {
                    total: totalStudents,
                    page,
                    limit,
                    totalPages: Math.ceil(totalStudents / limit)
                }
            }
        });

    } catch (error) {
        console.error('List students error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch students' },
            { status: 500 }
        );
    }
}

// POST - Create new student (admin only)
export async function POST(req: NextRequest) {
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

        const { name, email, password, phone } = await req.json();

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if student already exists
        const existingStudent = await User.findOne({ email });
        if (existingStudent) {
            return NextResponse.json(
                { success: false, message: 'A student with this email already exists' },
                { status: 400 }
            );
        }

        // Create new student
        const student = await User.create({
            name,
            email,
            password, // Will be hashed by the pre-save hook
            phone,
            role: 'user',
            isEmailVerified: false
        });

        // Remove password from response using destructuring
        const { password: _, ...studentResponse } = student.toObject();

        return NextResponse.json({
            success: true,
            message: 'Student created successfully',
            data: { student: studentResponse }
        }, { status: 201 });

    } catch (error) {
        console.error('Create student error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create student' },
            { status: 500 }
        );
    }
}
