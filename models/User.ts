import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    phone?: string;
    dateOfBirth?: Date;
    profilePicture?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    role: 'user';
    isEmailVerified: boolean;
    isActive: boolean;
    deactivationReason?: string;
    deactivatedAt?: Date;
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password by default
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        profilePicture: {
            type: String,
            default: '',
        },
        emergencyContactName: {
            type: String,
            trim: true,
        },
        emergencyContactPhone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user'],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        deactivationReason: {
            type: String,
        },
        deactivatedAt: {
            type: Date,
        },
        resetPasswordOTP: {
            type: String,
            select: false,
        },
        resetPasswordOTPExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
