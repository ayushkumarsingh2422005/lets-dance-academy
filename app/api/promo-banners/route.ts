import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoBanner from '@/models/PromoBanner';

// GET - List all active promo banners (public)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Get all active banners sorted by order
        const banners = await PromoBanner.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: { banners }
        });

    } catch (error) {
        console.error('List promo banners error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch promo banners' },
            { status: 500 }
        );
    }
}
