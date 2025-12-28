"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaTrash, FaBell } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';

interface Lesson {
    title: string;
    videoUrl?: string;
    description?: string;
    isFree: boolean;
}

interface WorkshopFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function WorkshopForm({ initialData, isEdit = false }: WorkshopFormProps) {
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'notifications'>('details');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        instructor: initialData?.instructor || '',
        instructorImage: initialData?.instructorImage || '',
        instructorBio: initialData?.instructorBio || '',
        level: initialData?.level || 'All Levels',
        price: initialData?.price || 0,
        currency: initialData?.currency || 'INR',
        duration: initialData?.duration || '',
        schedule: initialData?.schedule || '',
        coverImage: initialData?.coverImage || '',
        videoPreview: initialData?.videoPreview || '',
        status: initialData?.status || 'draft',
        notifications: initialData?.notifications || [],
    });

    const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info' });

    const addNotification = () => {
        if (!newNotification.title || !newNotification.message) return;
        const note = { ...newNotification, date: new Date() };
        setFormData(prev => ({
            ...prev,
            notifications: [note, ...(prev.notifications || [])]
        }));
        setNewNotification({ title: '', message: '', type: 'info' });
    };

    const removeNotification = (index: number) => {
        if (!confirm('Remove this notification?')) return;
        setFormData(prev => ({
            ...prev,
            notifications: prev.notifications.filter((_: any, i: number) => i !== index)
        }));
    };

    const [lessons, setLessons] = useState<Lesson[]>(initialData?.lessons || []);
    const [imageUploading, setImageUploading] = useState(false);
    const [instructorImageUploading, setInstructorImageUploading] = useState(false);

    // Helper to extract public ID
    const getPublicIdFromUrl = (url: string) => {
        if (!url || !url.includes('/upload/')) return null;
        try {
            const parts = url.split('/upload/');
            const pathParts = parts[1].split('/');
            // Remove version if present
            if (pathParts[0].startsWith('v') && !isNaN(Number(pathParts[0].substring(1)))) {
                pathParts.shift();
            }
            return pathParts.join('/').split('.')[0];
        } catch (error) {
            return null;
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'cover' | 'instructor') => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large (max 5MB)');
            return;
        }

        const setUploading = imageType === 'cover' ? setImageUploading : setInstructorImageUploading;
        setUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            uploadFormData.append('folder', 'lets-dance-academy/workshops');

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadFormData
            });
            const data = await res.json();
            if (data.success) {
                const newUrl = data.data.url;
                const fieldName = imageType === 'cover' ? 'coverImage' : 'instructorImage';
                const oldUrl = formData[fieldName];

                if (oldUrl) {
                    const oldPublicId = getPublicIdFromUrl(oldUrl);
                    if (oldPublicId) {
                        try {
                            await fetch('/api/upload', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ publicId: oldPublicId })
                            });
                        } catch (e) { console.error('Delete old image error', e); }
                    }
                }
                setFormData(prev => ({ ...prev, [fieldName]: newUrl }));
            } else {
                alert(data.message);
            }
        } catch (e) {
            console.error(e);
            alert('Image upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = async (imageType: 'cover' | 'instructor') => {
        const fieldName = imageType === 'cover' ? 'coverImage' : 'instructorImage';
        const imageUrl = formData[fieldName];
        if (!imageUrl) return;
        if (!confirm('Are you sure you want to delete this image?')) return;

        const oldPublicId = getPublicIdFromUrl(imageUrl);
        if (oldPublicId) {
            try {
                await fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ publicId: oldPublicId })
                });
            } catch (e) { console.error(e); }
        }
        setFormData(prev => ({ ...prev, [fieldName]: '' }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addLesson = () => setLessons([...lessons, { title: 'New Lesson', videoUrl: '', description: '', isFree: false }]);
    const removeLesson = (index: number) => setLessons(lessons.filter((_, i) => i !== index));
    const updateLesson = (index: number, field: keyof Lesson, value: any) => {
        const newLessons = [...lessons];
        // @ts-ignore
        newLessons[index][field] = value;
        setLessons(newLessons);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate instructor image
        if (!formData.instructorImage) {
            setError('Instructor image is required');
            setLoading(false);
            return;
        }

        const payload = { ...formData, lessons };

        try {
            const endpoint = isEdit ? `/api/workshops/${initialData._id}` : '/api/workshops';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                router.push('/admin/workshops');
                router.refresh();
            } else {
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-32">
            {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

            {/* Tab Navigation */}
            <div className="flex gap-1 border-b mb-6 sticky top-0 bg-white z-10 pt-4">
                <button type="button" onClick={() => setActiveTab('details')}
                    className={`px-6 py-3 font-bold uppercase text-xs tracking-wide border-b-2 transition-colors ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Details
                </button>
                <button type="button" onClick={() => setActiveTab('lessons')}
                    className={`px-6 py-3 font-bold uppercase text-xs tracking-wide border-b-2 transition-colors ${activeTab === 'lessons' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    Lessons
                </button>
                {isEdit && (
                    <button type="button" onClick={() => setActiveTab('notifications')}
                        className={`px-6 py-3 font-bold uppercase text-xs tracking-wide border-b-2 transition-colors ${activeTab === 'notifications' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                        Notifications
                    </button>
                )}
            </div>

            <div className="space-y-6">

                {/* DETAILS TAB */}
                <div className={activeTab === 'details' ? 'block space-y-6' : 'hidden'}>
                    <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-tight border-b pb-2">Basic Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Instructor Name</label>
                                <input name="instructor" value={formData.instructor} onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border p-2 rounded" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Instructor Bio (Optional)</label>
                                <textarea name="instructorBio" value={formData.instructorBio} onChange={handleChange} rows={3} className="w-full border p-2 rounded" placeholder="Brief bio about the instructor" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Level</label>
                                <select name="level" value={formData.level} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>All Levels</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Duration</label>
                                <input name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 3 Hours or 2 Days" className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-tight border-b pb-2">Pricing & Schedule</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" min="0" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Currency</label>
                                <input name="currency" value={formData.currency} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Schedule</label>
                                <input name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g. Oct 24, 2025 • 5:00 PM" className="w-full border p-2 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                        <h2 className="text-xl font-bold uppercase tracking-tight border-b pb-2">Images & Media</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cover Image */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cover Image (Optional)</label>
                                {formData.coverImage ? (
                                    <div className="mb-3 relative w-full aspect-video bg-gray-100 rounded overflow-hidden group border border-gray-200">
                                        <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('cover')}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                            title="Delete Image"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3 w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm">
                                        No image selected
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'cover')}
                                    disabled={imageUploading}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                                />
                                {imageUploading && <p className="text-xs text-blue-600 mt-2 font-bold animate-pulse">Uploading to Cloudinary...</p>}
                            </div>

                            {/* Instructor Image - REQUIRED */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    Instructor Image <span className="text-red-500">*</span>
                                </label>
                                {formData.instructorImage ? (
                                    <div className="mb-3 relative w-full aspect-video bg-gray-100 rounded overflow-hidden group border border-gray-200">
                                        <img src={formData.instructorImage} alt="Instructor" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage('instructor')}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                            title="Delete Image"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3 w-full aspect-video bg-red-50 border-2 border-dashed border-red-300 rounded flex items-center justify-center text-red-400 text-sm">
                                        Required - No image selected
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'instructor')}
                                    disabled={instructorImageUploading}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                                    required={!formData.instructorImage}
                                />
                                {instructorImageUploading && <p className="text-xs text-blue-600 mt-2 font-bold animate-pulse">Uploading to Cloudinary...</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Video Preview (YouTube URL)</label>
                            <input name="videoPreview" value={formData.videoPreview} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://youtube.com/..." />
                        </div>
                    </div>
                </div>

                {/* LESSONS TAB */}
                <div className={activeTab === 'lessons' ? 'block' : 'hidden'}>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Lessons</h2>
                            <button type="button" onClick={addLesson} className="bg-gray-100 px-4 py-2 text-sm font-bold uppercase hover:bg-gray-200">
                                + Add Lesson
                            </button>
                        </div>

                        {lessons.map((lesson, index) => (
                            <div key={index} className="bg-white p-6 border border-gray-300 shadow-sm rounded-lg relative">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Lesson Title</label>
                                            <input
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                                className="w-full border p-2 rounded font-bold"
                                                placeholder="e.g. Part 1: The Warm Up"
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeLesson(index)} className="text-red-500 hover:text-red-700 p-2 self-end">
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Video URL (Optional)</label>
                                        <input
                                            value={lesson.videoUrl || ''}
                                            onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                            className="w-full border p-2 rounded text-sm font-mono"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description (Optional)</label>
                                        <textarea
                                            value={lesson.description || ''}
                                            onChange={(e) => updateLesson(index, 'description', e.target.value)}
                                            className="w-full border p-2 rounded text-sm"
                                            rows={2}
                                            placeholder="Brief description of this lesson"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={lesson.isFree}
                                                onChange={(e) => updateLesson(index, 'isFree', e.target.checked)}
                                            />
                                            <span className="text-xs font-bold uppercase">Free Preview</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {lessons.length === 0 && (
                            <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-lg">
                                No lessons added yet. Click "Add Lesson" to get started.
                            </div>
                        )}
                    </div>
                </div>

                {/* NOTIFICATIONS TAB */}
                {isEdit && (
                    <div className={activeTab === 'notifications' ? 'block' : 'hidden'}>
                        <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                            <div className="flex items-center gap-2 border-b pb-2">
                                <FaBell className="text-gray-500" />
                                <h2 className="text-xl font-bold uppercase tracking-tight">Notifications</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-bold uppercase text-gray-500">Add New Notification</label>
                                        <input
                                            placeholder="Title"
                                            value={newNotification.title}
                                            onChange={e => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full border p-2 rounded text-sm font-bold"
                                        />
                                        <input
                                            placeholder="Message"
                                            value={newNotification.message}
                                            onChange={e => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full border p-2 rounded text-sm"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs font-bold uppercase text-gray-500">Type</label>
                                        <select
                                            value={newNotification.type}
                                            onChange={e => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                                            className="w-full border p-2 rounded text-sm"
                                        >
                                            <option value="info">Info</option>
                                            <option value="success">Success</option>
                                            <option value="warning">Warning</option>
                                            <option value="error">Error</option>
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addNotification}
                                        className="bg-black text-white px-4 py-2 rounded font-bold uppercase text-xs h-10 hover:bg-gray-800 self-end mb-1"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {formData.notifications?.map((note: any, index: number) => (
                                        <div key={index} className={`p-4 rounded border-l-4 flex justify-between items-start ${note.type === 'error' ? 'border-red-500 bg-red-50' :
                                            note.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                                                note.type === 'success' ? 'border-green-500 bg-green-50' :
                                                    'border-blue-500 bg-blue-50'
                                            }`}>
                                            <div>
                                                <div className="font-bold text-sm flex items-center gap-2">
                                                    {note.title}
                                                    <span className="text-xs font-normal opacity-50 uppercase">
                                                        {note.date ? new Date(note.date).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-sm opacity-80 mt-1">{note.message}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeNotification(index)}
                                                className="text-gray-400 hover:text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.notifications || formData.notifications.length === 0) && (
                                        <p className="text-center text-gray-400 text-sm italic py-4">No notifications yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Save Button Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="w-full flex justify-end px-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 font-bold uppercase text-sm tracking-wide hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <FaSave /> {isEdit ? 'Update Workshop' : 'Create Workshop'}
                            </>
                        )}
                    </button>
                </div>
            </div>

        </form>
    );
}
