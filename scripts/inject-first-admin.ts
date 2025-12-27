/**
 * Script to inject the first admin into the database
 * Run this script using: node scripts/inject-first-admin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://digicraftone_db_user:KefZwXEoXtWCRAFh@cluster0.grmtkyj.mongodb.net/tesing';

// Admin Schema (duplicated here to avoid import issues)
const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: 'admin',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    {
        timestamps: true,
    }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
}

async function injectFirstAdmin() {
    try {
        console.log('🚀 Starting First Admin Injection Script...\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!\n');

        // Check if any admin already exists
        const existingAdminCount = await Admin.countDocuments();

        if (existingAdminCount > 0) {
            console.log('⚠️  Warning: Admins already exist in the database.');
            const proceed = await question('Do you want to create another admin anyway? (yes/no): ');

            if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
                console.log('❌ Admin creation cancelled.');
                rl.close();
                process.exit(0);
            }
        }

        // Get admin details from user
        console.log('\n📝 Please enter the admin details:\n');

        const name = await question('Name: ');
        if (!name.trim()) {
            throw new Error('Name is required');
        }

        const email = await question('Email: ');
        if (!email.trim() || !email.includes('@')) {
            throw new Error('Valid email is required');
        }

        const phone = await question('Phone (optional): ');

        const password = await question('Password (min 6 characters): ');
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Check if admin with this email already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            throw new Error(`Admin with email ${email} already exists`);
        }

        // Hash password
        console.log('\n🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        console.log('👤 Creating admin...');
        const admin = await Admin.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim() || undefined,
            password: hashedPassword,
            role: 'admin',
            isActive: true,
        });

        console.log('\n✅ First Admin created successfully!');
        console.log('\n📋 Admin Details:');
        console.log(`   ID: ${admin._id}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Phone: ${admin.phone || 'N/A'}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Created At: ${admin.createdAt}`);
        console.log('\n🎉 You can now login with these credentials!\n');

        rl.close();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error instanceof Error ? error.message : error);
        rl.close();
        process.exit(1);
    }
}

// Run the script
injectFirstAdmin();
