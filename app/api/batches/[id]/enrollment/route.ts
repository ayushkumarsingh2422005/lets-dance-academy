
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });

        // Find relevant enrollment
        // We want the latest one? Or any active one?
        // If multiple, check if any is active and valid.
        const enrollments = await Enrollment.find({
            user: decoded.id,
            batch: id
        }).sort({ createdAt: -1 });

        if (!enrollments || enrollments.length === 0) {
            return NextResponse.json({ success: true, enrolled: false, status: null });
        }

        // Check if any active and valid
        const activeEnrollment = enrollments.find(e => {
            if (e.status !== 'active') return false;
            // Check expiry
            if (e.validUntil && new Date(e.validUntil) < new Date()) return false;
            return true;
        });

        // Also check pending
        const pendingEnrollment = enrollments.find(e => e.status === 'pending');

        if (activeEnrollment) {
            return NextResponse.json({ success: true, enrolled: true, status: 'active', validUntil: activeEnrollment.validUntil });
        } else if (pendingEnrollment) {
            return NextResponse.json({ success: true, enrolled: false, status: 'pending' });
        } else {
            return NextResponse.json({ success: true, enrolled: false, status: 'expired' }); // or rejected
        }

    } catch (error) {
        console.error('Enrollment status check error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
