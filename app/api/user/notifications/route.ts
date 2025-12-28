
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

        // 1. Get active enrollments (both batches and workshops)
        const enrollments = await Enrollment.find({ user: decoded.id, status: 'active' }).select('batch workshop');
        const batchIds = enrollments.filter(e => e.batch).map(e => e.batch);
        const workshopIds = enrollments.filter(e => e.workshop).map(e => e.workshop);

        let allNotifications: any[] = [];

        // 2. Fetch notifications from batches
        if (batchIds.length > 0) {
            const batches = await Batch.find({ _id: { $in: batchIds } }).select('title notifications');
            batches.forEach((batch: any) => {
                if (batch.notifications && Array.isArray(batch.notifications)) {
                    const batchNotes = batch.notifications.map((note: any) => ({
                        ...note.toObject(),
                        batchTitle: batch.title,
                        source: 'batch'
                    }));
                    allNotifications = [...allNotifications, ...batchNotes];
                }
            });
        }

        // 3. Fetch notifications from workshops
        if (workshopIds.length > 0) {
            const Workshop = (await import('@/models/Workshop')).default;
            const workshops = await Workshop.find({ _id: { $in: workshopIds } }).select('title notifications');
            workshops.forEach((workshop: any) => {
                if (workshop.notifications && Array.isArray(workshop.notifications)) {
                    const workshopNotes = workshop.notifications.map((note: any) => ({
                        ...note.toObject(),
                        workshopTitle: workshop.title,
                        source: 'workshop'
                    }));
                    allNotifications = [...allNotifications, ...workshopNotes];
                }
            });
        }

        // 4. Sort by date (descending)
        allNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ success: true, notifications: allNotifications });
    } catch (error) {
        console.error('Fetch user notifications error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
