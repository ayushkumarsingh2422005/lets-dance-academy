import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface for Review
export interface IReview {
    updatedAt: Date;
    user: mongoose.Types.ObjectId;
    userName: string; // Snapshot of user name
    rating: number;
    comment: string;
    createdAt: Date;
}

// Interface for Notification
export interface INotification {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: Date;
}

// Interface for Lesson (simplified - no modules, direct lessons)
export interface ILesson {
    title: string;
    videoUrl?: string; // Optional YouTube video link or iframe src
    description?: string;
    isFree?: boolean; // For preview purposes
}

// Main Workshop Interface
export interface IWorkshop extends Document {
    title: string;
    slug: string; // URL-friendly identifier
    description: string;
    instructor: string; // Name of instructor
    instructorImage: string; // Compulsory instructor image
    instructorBio?: string; // Optional instructor bio
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

    // Pricing - Only one-time payment
    price: number;
    currency: string;

    // Details
    duration: string; // e.g., "3 Hours" or "2 Days"
    schedule?: string; // e.g., "October 24, 2025 • 5:00 PM"
    coverImage?: string;
    videoPreview?: string; // YouTube preview link

    // Content - Direct lessons, no modules
    lessons: ILesson[];

    // Engagement
    reviews: IReview[];
    notifications: INotification[];

    // Status
    status: 'draft' | 'published';

    createdAt: Date;
    updatedAt: Date;
}

// Schemas
const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    videoUrl: { type: String }, // Optional
    description: { type: String },
    isFree: { type: Boolean, default: false }
});

const ReviewSchema = new Schema<IReview>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new Schema<INotification>({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    date: { type: Date, default: Date.now }
});

const WorkshopSchema = new Schema<IWorkshop>(
    {
        title: { type: String, required: [true, 'Title is required'], trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, required: [true, 'Description is required'] },
        instructor: { type: String, required: [true, 'Instructor name is required'] },
        instructorImage: { type: String, required: [true, 'Instructor image is required'] },
        instructorBio: { type: String },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
            default: 'All Levels'
        },
        price: { type: Number, required: true, min: 0 },
        currency: { type: String, default: 'INR' },

        duration: { type: String, required: true }, // e.g. "3 Hours" or "2 Days"
        schedule: { type: String },
        coverImage: { type: String },
        videoPreview: { type: String },

        lessons: [LessonSchema],
        reviews: [ReviewSchema],
        notifications: [NotificationSchema],

        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        }
    },
    {
        timestamps: true
    }
);

// Prevent model recompilation in development
const Workshop: Model<IWorkshop> = mongoose.models.Workshop || mongoose.model<IWorkshop>('Workshop', WorkshopSchema);

export default Workshop;
