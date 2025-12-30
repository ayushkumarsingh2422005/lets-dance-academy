import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
    title?: string;
    imageUrl: string;
    publicId: string; // Cloudinary public_id for deletion
    category: string;
    width: number;
    height: number;
    createdAt: Date;
    updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
    {
        title: { type: String, trim: true },
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        category: { type: String, default: 'general' },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    {
        timestamps: true
    }
);

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
