
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attendance from '@/models/Attendance';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        // verify...

        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId');
        const branch = searchParams.get('branch');
        const dateStr = searchParams.get('date'); // YYYY-MM-DD

        if (!batchId || !branch || !dateStr) {
            return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
        }

        const date = new Date(dateStr);
        // Ensure strictly this date? Simple comparison might fail due to time.
        // Best to store as date at 00:00:00 UTC? Or just match by query range.
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            batch: batchId,
            branch: branch,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        return NextResponse.json({ success: true, attendance });

    } catch (error) {
        console.error('Attendance fetch error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { batchId, branch, date: dateStr, records } = await req.json();

        if (!batchId || !branch || !dateStr || !records) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        const date = new Date(dateStr);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find existing to update
        let attendance = await Attendance.findOne({
            batch: batchId,
            branch: branch,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            attendance.records = records;
            await attendance.save();
        } else {
            attendance = await Attendance.create({
                batch: batchId,
                branch,
                date: startOfDay, // Store normalized
                records
            });
        }

        return NextResponse.json({ success: true, message: 'Attendance saved successfully', attendance });

    } catch (error) {
        console.error('Attendance save error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
