import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { verifyToken } from '@/lib/jwt';

// GET - Fetch all gallery images
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const images = await Gallery.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: images });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch gallery images' },
            { status: 500 }
        );
    }
}

// POST - Add new gallery image (Admin only)
export async function POST(req: NextRequest) {
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
        const body = await req.json();

        // Validate
        if (!body.imageUrl || !body.publicId || !body.width || !body.height) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newImage = await Gallery.create(body);

        return NextResponse.json({
            success: true,
            message: 'Image added to gallery',
            data: newImage
        });

    } catch (error) {
        console.error('Add gallery image error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add image' },
            { status: 500 }
        );
    }
}
