
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attendance from '@/models/Attendance';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized - No token' }, { status: 401 });
        const decoded = verifyToken(token);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');
        const month = parseInt(searchParams.get('month') || '');
        const year = parseInt(searchParams.get('year') || '');

        if (!batchId || isNaN(month) || isNaN(year)) {
            return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const attendanceDocs = await Attendance.find({
            batch: batchId,
            date: { $gte: startDate, $lte: endDate }
        });

        const attendanceMap: Record<number, string> = {};
        attendanceDocs.forEach(doc => {
            const record = doc.records.find((r: any) => r.student.toString() === decoded.id);
            if (record) {
                const day = new Date(doc.date).getDate();
                attendanceMap[day] = record.status;
            }
        });

        return NextResponse.json({ success: true, attendance: attendanceMap });
    } catch (error) {
        console.error('Fetch user attendance error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
