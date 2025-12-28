import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workshop from '@/models/Workshop';
import { verifyToken } from '@/lib/jwt';

// Helper to generate slug
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// GET - List all workshops (Public can see published, Admin can see all)
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.headers.get('authorization')?.split(' ')[1];
        let isAdmin = false;

        if (token) {
            const decoded = verifyToken(token);
            if (decoded && decoded.role === 'admin') {
                isAdmin = true;
            }
        }

        const query: any = {};
        if (!isAdmin) {
            query.status = 'published';
        }

        // Support pagination
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const workshops = await Workshop.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Workshop.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: {
                workshops,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Fetch workshops error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch workshops' }, { status: 500 });
    }
}

// POST - Create a new workshop (Admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Auth check
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const body = await req.json();

        // Check if slug exists or generate
        if (!body.slug && body.title) {
            body.slug = slugify(body.title);
        }

        // Validate uniqueness of slug
        const existingWorkshop = await Workshop.findOne({ slug: body.slug });
        if (existingWorkshop) {
            // Append random string to make unique
            body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
        }

        const newWorkshop = await Workshop.create(body);

        return NextResponse.json({
            success: true,
            message: 'Workshop created successfully',
            data: { workshop: newWorkshop }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create workshop error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to create workshop'
        }, { status: 500 });
    }
}
