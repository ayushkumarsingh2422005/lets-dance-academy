import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PromoBanner from '@/models/PromoBanner';
import { verifyToken } from '@/lib/jwt';

// GET - Get single promo banner
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const banner = await PromoBanner.findById(id);

        if (!banner) {
            return NextResponse.json(
                { success: false, message: 'Promo banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { banner }
        });

    } catch (error) {
        console.error('Get promo banner error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch promo banner' },
            { status: 500 }
        );
    }
}

// PATCH - Update promo banner
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const updateData = await req.json();

        const banner = await PromoBanner.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!banner) {
            return NextResponse.json(
                { success: false, message: 'Promo banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Promo banner updated successfully',
            data: { banner }
        });

    } catch (error) {
        console.error('Update promo banner error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update promo banner' },
            { status: 500 }
        );
    }
}

// DELETE - Delete promo banner
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const banner = await PromoBanner.findByIdAndDelete(id);

        if (!banner) {
            return NextResponse.json(
                { success: false, message: 'Promo banner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Promo banner deleted successfully'
        });

    } catch (error) {
        console.error('Delete promo banner error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete promo banner' },
            { status: 500 }
        );
    }
}
