"use client";
import React from 'react';
import Link from 'next/link';
import WorkshopForm from '@/components/admin/WorkshopForm';

export default function CreateWorkshopPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin/workshops" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase">← Back to Workshops</Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Create New Workshop</h1>
                </div>
            </div>
            <WorkshopForm />
        </div>
    );
}
