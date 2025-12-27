'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaPenToSquare, FaTrash, FaToggleOn, FaToggleOff, FaArrowUp, FaArrowDown } from 'react-icons/fa6';

interface PromoBanner {
    _id: string;
    tag: string;
    tagIcon: string;
    title: string;
    highlight: string;
    description: string;
    link: string;
    ctaText: string;
    ctaSubText: string;
    gradient: string;
    bgGlow1: string;
    bgGlow2: string;
    isActive: boolean;
    order: number;
}

const iconOptions = ['FaFire', 'FaStar', 'FaBolt'];
const gradientOptions = [
    'from-blue-400 to-purple-500',
    'from-pink-400 to-rose-500',
    'from-amber-400 to-orange-500',
    'from-green-400 to-emerald-500',
    'from-red-400 to-orange-500',
    'from-indigo-400 to-purple-500',
];

export default function ManagePromoBannersPage() {
    const { token } = useAuth();
    const [banners, setBanners] = useState<PromoBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        tag: '',
        tagIcon: 'FaFire',
        title: '',
        highlight: '',
        description: '',
        link: '',
        ctaText: 'Learn More',
        ctaSubText: '',
        gradient: 'from-blue-400 to-purple-500',
        bgGlow1: 'bg-blue-600/20',
        bgGlow2: 'bg-purple-600/20',
        order: 0,
    });

    // Fetch all banners
    const fetchBanners = async () => {
        try {
            const response = await fetch('/api/admin/promo-banners', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setBanners(data.data.banners);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load promo banners');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [token]);

    // Reset form
    const resetForm = () => {
        setFormData({
            tag: '',
            tagIcon: 'FaFire',
            title: '',
            highlight: '',
            description: '',
            link: '',
            ctaText: 'Learn More',
            ctaSubText: '',
            gradient: 'from-blue-400 to-purple-500',
            bgGlow1: 'bg-blue-600/20',
            bgGlow2: 'bg-purple-600/20',
            order: 0,
        });
        setEditingBanner(null);
        setShowForm(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const url = editingBanner
                ? `/api/admin/promo-banners/${editingBanner._id}`
                : '/api/admin/promo-banners';

            const method = editingBanner ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!');
                resetForm();
                fetchBanners();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to save banner');
            console.error(err);
        }
    };

    // Edit banner
    const handleEdit = (banner: PromoBanner) => {
        setFormData({
            tag: banner.tag,
            tagIcon: banner.tagIcon,
            title: banner.title,
            highlight: banner.highlight,
            description: banner.description,
            link: banner.link,
            ctaText: banner.ctaText,
            ctaSubText: banner.ctaSubText,
            gradient: banner.gradient,
            bgGlow1: banner.bgGlow1,
            bgGlow2: banner.bgGlow2,
            order: banner.order,
        });
        setEditingBanner(banner);
        setShowForm(true);
    };

    // Delete banner
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/admin/promo-banners/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Banner deleted successfully');
                fetchBanners();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete banner');
            console.error(err);
        }
    };

    // Toggle active status
    const handleToggleStatus = async (banner: PromoBanner) => {
        try {
            const response = await fetch(`/api/admin/promo-banners/${banner._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !banner.isActive })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully`);
                fetchBanners();
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update banner status');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold">Loading banners...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Promo Banners</h1>
                    <p className="text-gray-600 text-sm font-medium">Manage homepage promotional banners</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> {showForm ? 'Cancel' : 'Add Banner'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded">
                    {success}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="mb-8 p-6 bg-white border-2 border-gray-200 shadow-lg">
                    <h2 className="text-xl font-black uppercase mb-6">
                        {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Tag
                                </label>
                                <input
                                    type="text"
                                    value={formData.tag}
                                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="e.g., Limited Time Offer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Tag Icon
                                </label>
                                <select
                                    value={formData.tagIcon}
                                    onChange={(e) => setFormData({ ...formData, tagIcon: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                >
                                    {iconOptions.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="e.g., Summer"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Highlight Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.highlight}
                                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="e.g., Intensive"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none resize-none"
                                rows={3}
                                placeholder="Brief description of the offer..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Link URL
                                </label>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="/register"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    CTA Button Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaText}
                                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="Register Now"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    CTA Sub Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.ctaSubText}
                                    onChange={(e) => setFormData({ ...formData, ctaSubText: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    placeholder="Get 20% Off"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Gradient (Tailwind classes)
                                </label>
                                <select
                                    value={formData.gradient}
                                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                >
                                    {gradientOptions.map(grad => (
                                        <option key={grad} value={grad}>{grad}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors"
                            >
                                {editingBanner ? 'Update Banner' : 'Create Banner'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="border-2 border-gray-300 px-6 py-3 font-bold uppercase text-sm tracking-wide hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Banners List */}
            <div className="bg-white border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Banner</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Order</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {banners.map((banner) => (
                            <tr key={banner._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm">{banner.title} <span className="text-blue-600">{banner.highlight}</span></div>
                                    <div className="text-xs text-gray-500 mt-1">{banner.tag}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 line-clamp-2">{banner.description}</div>
                                    <div className="text-xs text-gray-400 mt-1">→ {banner.link}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{banner.order}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase ${banner.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {banner.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(banner)}
                                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                                            title={banner.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            {banner.isActive ? (
                                                <FaToggleOn className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <FaToggleOff className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 rounded hover:bg-blue-50 transition-colors"
                                            title="Edit Banner"
                                        >
                                            <FaPenToSquare className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="p-2 rounded hover:bg-red-50 transition-colors"
                                            title="Delete Banner"
                                        >
                                            <FaTrash className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {banners.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-bold">No promo banners found</p>
                        <p className="text-sm mt-2">Add your first banner to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}
