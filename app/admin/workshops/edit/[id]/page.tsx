"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import WorkshopForm from '@/components/admin/WorkshopForm';

export default function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
    const { token } = useAuth();
    const [workshop, setWorkshop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [workshopId, setWorkshopId] = useState<string>('');

    useEffect(() => {
        params.then(p => setWorkshopId(p.id));
    }, [params]);

    useEffect(() => {
        if (!workshopId) return;

        const fetchWorkshop = async () => {
            try {
                const response = await fetch(`/api/workshops/${workshopId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setWorkshop(data.data.workshop);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch workshop');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshop();
    }, [workshopId, token]);

    if (loading) return <div className="p-8">Loading workshop...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!workshop) return <div className="p-8">Workshop not found</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin/workshops" className="text-gray-500 hover:text-black mb-2 block font-bold text-sm uppercase">← Back to Workshops</Link>
                    <h1 className="text-3xl font-black uppercase tracking-tight">Edit Workshop</h1>
                    <p className="text-gray-500 text-sm mt-1">{workshop.title}</p>
                </div>
            </div>
            <WorkshopForm initialData={workshop} isEdit={true} />
        </div>
    );
}
