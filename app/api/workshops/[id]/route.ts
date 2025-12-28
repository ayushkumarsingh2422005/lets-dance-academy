import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workshop from '@/models/Workshop';
import { verifyToken } from '@/lib/jwt';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract public ID
const getPublicIdFromUrl = (url: string) => {
    if (!url || !url.includes('/upload/')) return null;
    try {
        const parts = url.split('/upload/');
        const pathParts = parts[1].split('/');
        // Remove version if present
        if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].substring(1)))) {
            pathParts.shift();
        }
        return pathParts.join('/').split('.')[0];
    } catch (error) {
        return null;
    }
};

// GET - Get single workshop (by ID or Slug)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        let workshop;
        if (mongoose.Types.ObjectId.isValid(id)) {
            workshop = await Workshop.findById(id);
        }

        if (!workshop) {
            workshop = await Workshop.findOne({ slug: id });
        }

        if (!workshop) {
            return NextResponse.json({ success: false, message: 'Workshop not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { workshop } });

    } catch (error) {
        console.error('Fetch workshop error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch workshop' }, { status: 500 });
    }
}

// PATCH - Update workshop (Admin only)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Update logic
        let workshop;
        if (mongoose.Types.ObjectId.isValid(id)) {
            workshop = await Workshop.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        } else {
            workshop = await Workshop.findOneAndUpdate({ slug: id }, body, { new: true, runValidators: true });
        }

        if (!workshop) {
            return NextResponse.json({ success: false, message: 'Workshop not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Workshop updated successfully',
            data: { workshop }
        });

    } catch (error: any) {
        console.error('Update workshop error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Failed to update workshop' }, { status: 500 });
    }
}

// DELETE - Delete workshop (Admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        // Find workshop first to get image URLs
        let workshop;
        if (mongoose.Types.ObjectId.isValid(id)) {
            workshop = await Workshop.findById(id);
        } else {
            workshop = await Workshop.findOne({ slug: id });
        }

        if (!workshop) {
            return NextResponse.json({ success: false, message: 'Workshop not found' }, { status: 404 });
        }

        // Delete images from Cloudinary if they exist
        const imagesToDelete = [];
        if (workshop.coverImage) {
            imagesToDelete.push(workshop.coverImage);
        }
        if (workshop.instructorImage) {
            imagesToDelete.push(workshop.instructorImage);
        }

        for (const imageUrl of imagesToDelete) {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted Cloudinary image: ${publicId}`);
                } catch (err) {
                    console.error('Failed to delete Cloudinary image:', err);
                    // Continue to delete workshop even if image delete fails
                }
            }
        }

        // Delete workshop from DB
        await workshop.deleteOne();

        return NextResponse.json({
            success: true,
            message: 'Workshop deleted successfully'
        });

    } catch (error) {
        console.error('Delete workshop error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete workshop' }, { status: 500 });
    }
}
