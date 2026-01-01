import mongoose, { Schema, Document, Model } from 'mongoose';

// Individual Image within a folder
export interface IGalleryImage {
    imageUrl: string;
    publicId: string; // Cloudinary public_id for deletion
    caption?: string;
    width: number;
    height: number;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    caption: { type: String, trim: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
}, { _id: true });

// Gallery Folder/Album
export interface IGalleryFolder extends Document {
    title: string;
    description?: string;
    coverImage?: {
        imageUrl: string;
        publicId: string;
        width: number;
        height: number;
    };
    images: IGalleryImage[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryFolderSchema = new Schema<IGalleryFolder>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        coverImage: {
            imageUrl: { type: String },
            publicId: { type: String },
            width: { type: Number },
            height: { type: Number },
        },
        images: [GalleryImageSchema],
        isPublished: { type: Boolean, default: true },
    },
    {
        timestamps: true
    }
);

const GalleryFolder: Model<IGalleryFolder> = mongoose.models.GalleryFolder || mongoose.model<IGalleryFolder>('GalleryFolder', GalleryFolderSchema);

export default GalleryFolder;
