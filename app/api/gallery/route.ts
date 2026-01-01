import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import GalleryFolder from '@/models/Gallery';
import { verifyToken } from '@/lib/jwt';

// GET - Fetch all gallery folders (only published ones for public, all for admin)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

        let query = {};

        // If not requesting unpublished, only show published folders
        if (!includeUnpublished) {
            query = { isPublished: true };
        }

        const folders = await GalleryFolder.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: folders });
    } catch (error) {
        console.error('Gallery fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch gallery folders' },
            { status: 500 }
        );
    }
}

// POST - Create new gallery folder (Admin only)
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
        if (!body.title) {
            return NextResponse.json(
                { success: false, message: 'Title is required' },
                { status: 400 }
            );
        }

        const newFolder = await GalleryFolder.create({
            title: body.title,
            description: body.description || '',
            coverImage: body.coverImage || null,
            images: body.images || [],
            isPublished: body.isPublished !== undefined ? body.isPublished : true
        });

        return NextResponse.json({
            success: true,
            message: 'Gallery folder created',
            data: newFolder
        });

    } catch (error) {
        console.error('Create gallery folder error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create folder' },
            { status: 500 }
        );
    }
}
