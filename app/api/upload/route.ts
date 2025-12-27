import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '@/lib/jwt';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Upload image to Cloudinary
export async function POST(req: NextRequest) {
    try {
        // Get token from Authorization header
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token (both admin and user can upload)
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 403 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'lets-dance-academy';

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const uploadResult = result as any;

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                format: uploadResult.format,
                width: uploadResult.width,
                height: uploadResult.height,
            }
        });

    } catch (error) {
        console.error('Upload image error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

// DELETE - Delete image from Cloudinary
export async function DELETE(req: NextRequest) {
    try {
        // Get token from Authorization header
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify token (both admin and user can delete)
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized - Invalid token' },
                { status: 403 }
            );
        }

        const { publicId } = await req.json();

        if (!publicId) {
            return NextResponse.json(
                { success: false, message: 'Public ID is required' },
                { status: 400 }
            );
        }

        // Delete from Cloudinary
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== 'ok') {
            return NextResponse.json(
                { success: false, message: 'Failed to delete image' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete image' },
            { status: 500 }
        );
    }
}
