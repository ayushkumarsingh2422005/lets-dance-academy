import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPromoBanner extends Document {
    tag: string;
    tagIcon: string; // Icon name from react-icons/fa6
    title: string;
    highlight: string;
    description: string;
    link: string;
    ctaText: string;
    ctaSubText: string;
    gradient: string; // Tailwind gradient classes
    bgGlow1: string; // Tailwind background color
    bgGlow2: string; // Tailwind background color
    isActive: boolean;
    order: number; // For custom ordering
    createdAt: Date;
    updatedAt: Date;
}

const PromoBannerSchema = new Schema<IPromoBanner>(
    {
        tag: {
            type: String,
            required: [true, 'Tag is required'],
            trim: true,
        },
        tagIcon: {
            type: String,
            required: [true, 'Tag icon is required'],
            default: 'FaFire',
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        highlight: {
            type: String,
            required: [true, 'Highlight text is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        link: {
            type: String,
            required: [true, 'Link is required'],
            trim: true,
        },
        ctaText: {
            type: String,
            required: [true, 'CTA text is required'],
            default: 'Learn More',
        },
        ctaSubText: {
            type: String,
            default: '',
        },
        gradient: {
            type: String,
            default: 'from-blue-400 to-purple-500',
        },
        bgGlow1: {
            type: String,
            default: 'bg-blue-600/20',
        },
        bgGlow2: {
            type: String,
            default: 'bg-purple-600/20',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
PromoBannerSchema.index({ order: 1, createdAt: -1 });

const PromoBanner: Model<IPromoBanner> =
    mongoose.models.PromoBanner || mongoose.model<IPromoBanner>('PromoBanner', PromoBannerSchema);

export default PromoBanner;
