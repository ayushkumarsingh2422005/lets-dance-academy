
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Batch from '@/models/Batch'; // Ensure Batch is registered
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized - No token' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const enrollments = await Enrollment.find({ user: decoded.id }).populate('batch').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, enrollments });
    } catch (error) {
        console.error('Fetch user enrollments error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
