import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { verifyToken } from '@/lib/jwt';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DELETE - Remove gallery image (Admin only)
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Authenticate
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const image = await Gallery.findById(id);
        if (!image) {
            return NextResponse.json(
                { success: false, message: 'Image not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        // Delete from DB
        await Gallery.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Delete gallery image error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
