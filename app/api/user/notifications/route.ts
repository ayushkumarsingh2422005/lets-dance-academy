
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Batch from '@/models/Batch';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized - No token' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        // 1. Get active enrollments
        const enrollments = await Enrollment.find({ user: decoded.id, status: 'active' }).select('batch');
        const batchIds = enrollments.map(e => e.batch);

        // 2. Fetch notifications from these batches
        const batches = await Batch.find({ _id: { $in: batchIds } }).select('title notifications');

        // 3. Aggregate notifications
        let allNotifications: any[] = [];
        batches.forEach((batch: any) => {
            if (batch.notifications && Array.isArray(batch.notifications)) {
                // Add batch title to notification for context
                const batchNotes = batch.notifications.map((note: any) => ({
                    ...note.toObject(),
                    batchTitle: batch.title,
                    source: 'batch'
                }));
                allNotifications = [...allNotifications, ...batchNotes];
            }
        });

        // 4. Sort by date (descending)
        allNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ success: true, notifications: allNotifications });
    } catch (error) {
        console.error('Fetch user notifications error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
