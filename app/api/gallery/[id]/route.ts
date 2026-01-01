import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import GalleryFolder from '@/models/Gallery';
import { verifyToken } from '@/lib/jwt';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch a single folder by ID
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await connectDB();

        const folder = await GalleryFolder.findById(id);
        if (!folder) {
            return NextResponse.json(
                { success: false, message: 'Folder not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: folder });
    } catch (error) {
        console.error('Fetch folder error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch folder' },
            { status: 500 }
        );
    }
}

// PATCH - Update folder or add/remove images (Admin only)
export async function PATCH(
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
        const body = await req.json();

        const folder = await GalleryFolder.findById(id);
        if (!folder) {
            return NextResponse.json(
                { success: false, message: 'Folder not found' },
                { status: 404 }
            );
        }

        // Update folder fields
        if (body.title !== undefined) folder.title = body.title;
        if (body.description !== undefined) folder.description = body.description;
        if (body.coverImage !== undefined) folder.coverImage = body.coverImage;
        if (body.isPublished !== undefined) folder.isPublished = body.isPublished;

        // Handle image operations
        if (body.addImages) {
            // Add new images to the folder
            folder.images.push(...body.addImages);
        }

        if (body.removeImageId) {
            // Remove image from folder and delete from Cloudinary
            const imageToRemove = folder.images.find(
                (img: any) => img._id.toString() === body.removeImageId
            );

            if (imageToRemove) {
                // Delete from Cloudinary
                if (imageToRemove.publicId) {
                    await cloudinary.uploader.destroy(imageToRemove.publicId);
                }
                // Remove from array
                folder.images = folder.images.filter(
                    (img: any) => img._id.toString() !== body.removeImageId
                );
            }
        }

        if (body.updateImageCaption) {
            // Update caption for a specific image
            const image = folder.images.find(
                (img: any) => img._id.toString() === body.updateImageCaption.imageId
            );
            if (image) {
                image.caption = body.updateImageCaption.caption;
            }
        }

        await folder.save();

        return NextResponse.json({
            success: true,
            message: 'Folder updated successfully',
            data: folder
        });

    } catch (error) {
        console.error('Update folder error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update folder' },
            { status: 500 }
        );
    }
}

// DELETE - Remove entire folder and all its images (Admin only)
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

        const folder = await GalleryFolder.findById(id);
        if (!folder) {
            return NextResponse.json(
                { success: false, message: 'Folder not found' },
                { status: 404 }
            );
        }

        // Delete all images from Cloudinary
        const deletionPromises = [];

        // Delete cover image
        if (folder.coverImage?.publicId) {
            deletionPromises.push(cloudinary.uploader.destroy(folder.coverImage.publicId));
        }

        // Delete all folder images
        for (const image of folder.images) {
            if (image.publicId) {
                deletionPromises.push(cloudinary.uploader.destroy(image.publicId));
            }
        }

        await Promise.all(deletionPromises);

        // Delete folder from DB
        await GalleryFolder.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Folder and all images deleted successfully'
        });

    } catch (error) {
        console.error('Delete folder error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete folder' },
            { status: 500 }
        );
    }
}
