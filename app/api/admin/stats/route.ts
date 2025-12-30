import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Batch from '@/models/Batch';
import Workshop from '@/models/Workshop';
import { verifyToken } from '@/lib/jwt';

// Helper to get start of current month
const getStartOfMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Helper to get start of last month for comparison
const getStartOfLastMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const getEndOfLastMonth = () => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0);
};

export async function GET(req: NextRequest) {
    try {
        // Authenticate
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const startOfMonth = getStartOfMonth();
        const startOfLastMonth = getStartOfLastMonth();
        const endOfLastMonth = getEndOfLastMonth();

        // 1. Total Active Students (Users)
        const totalStudents = await User.countDocuments({ isActive: true });

        // 2. Monthly Revenue (from Active Enrollments)
        // Current Month
        const currentMonthRevenueAgg = await Enrollment.aggregate([
            {
                $match: {
                    status: 'active',
                    createdAt: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]);
        const currentMonthRevenue = currentMonthRevenueAgg.length > 0 ? currentMonthRevenueAgg[0].total : 0;

        // Last Month (for comparison)
        const lastMonthRevenueAgg = await Enrollment.aggregate([
            {
                $match: {
                    status: 'active',
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]);
        const lastMonthRevenue = lastMonthRevenueAgg.length > 0 ? lastMonthRevenueAgg[0].total : 0;

        // Calculate revenue growth percentage
        let revenueGrowth = 0;
        if (lastMonthRevenue > 0) {
            revenueGrowth = Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
        } else if (currentMonthRevenue > 0) {
            revenueGrowth = 100;
        }

        // 3. Pending Verifications
        const pendingEnrollments = await Enrollment.countDocuments({ status: 'pending' });

        // 4. Recent Activity (Latest 5 Enrollments)
        const recentEnrollments = await Enrollment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('userName type batchTitle workshopTitle price createdAt status')
            .lean();

        // 5. Active Batches Count
        const activeBatches = await Batch.countDocuments({ status: 'published' });

        // 6. Active Workshops Count
        const activeWorkshops = await Workshop.countDocuments({ status: 'published' });

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    currentMonthRevenue,
                    revenueGrowth,
                    pendingEnrollments,
                    activeBatches,
                    activeWorkshops
                },
                recentActivity: recentEnrollments
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
