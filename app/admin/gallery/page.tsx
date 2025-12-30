'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTrash, FaPlus, FaCloudArrowUp, FaImages } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryImage {
    _id: string;
    imageUrl: string;
    publicId: string;
    title?: string;
    width: number;
    height: number;
}

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/gallery');
            const data = await res.json();
            if (data.success) {
                setImages(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'lets-dance-academy/gallery');

        try {
            // 1. Upload to Cloudinary
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) throw new Error(uploadData.message);

            // 2. Save to DB
            const galleryData = {
                imageUrl: uploadData.data.url,
                publicId: uploadData.data.publicId,
                width: uploadData.data.width,
                height: uploadData.data.height,
                title: file.name.split('.')[0] // Default title from filename
            };

            const dbRes = await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(galleryData)
            });
            const dbData = await dbRes.json();

            if (dbData.success) {
                setImages([dbData.data, ...images]);
            } else {
                throw new Error(dbData.message);
            }

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setImages(images.filter(img => img._id !== id));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete image');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Gallery Management</h1>
                    <p className="text-gray-500">Upload and manage images for the public gallery.</p>
                </div>
                <label className={`cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploading ? <FaCloudArrowUp className="animate-bounce" /> : <FaPlus />}
                    <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {images.map((img) => (
                        <div key={img._id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={img.imageUrl}
                                alt={img.title || 'Gallery Image'}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors transform scale-0 group-hover:scale-100 duration-200"
                                    title="Delete Image"
                                >
                                    <FaTrash size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {img.title}
                            </div>
                        </div>
                    ))}

                    {images.length === 0 && (
                        <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <FaImages size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">No images found in gallery</p>
                            <p className="text-sm">Upload an image to get started</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
