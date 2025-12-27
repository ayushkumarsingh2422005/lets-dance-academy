import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoBanner from '@/models/PromoBanner';
import { verifyToken } from '@/lib/jwt';

// GET - List all promo banners (admin only)
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

        // Get all banners (including inactive)
        const banners = await PromoBanner.find({})
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

// POST - Create new promo banner (admin only)
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

        const bannerData = await req.json();

        // Validate required fields
        if (!bannerData.tag || !bannerData.title || !bannerData.highlight || !bannerData.description || !bannerData.link) {
            return NextResponse.json(
                { success: false, message: 'Required fields: tag, title, highlight, description, link' },
                { status: 400 }
            );
        }

        // Create new banner
        const banner = await PromoBanner.create(bannerData);

        return NextResponse.json({
            success: true,
            message: 'Promo banner created successfully',
            data: { banner }
        }, { status: 201 });

    } catch (error) {
        console.error('Create promo banner error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create promo banner' },
            { status: 500 }
        );
    }
}
