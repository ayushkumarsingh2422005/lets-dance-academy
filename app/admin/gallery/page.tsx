'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTrash, FaPlus, FaCloudArrowUp, FaImages, FaFolder, FaPencil, FaEye, FaEyeSlash, FaXmark } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthContext';

interface GalleryImage {
    _id?: string;
    imageUrl: string;
    publicId: string;
    caption?: string;
    width: number;
    height: number;
}

interface GalleryFolder {
    _id: string;
    title: string;
    description?: string;
    coverImage?: {
        imageUrl: string;
        publicId: string;
        width: number;
        height: number;
    };
    images: GalleryImage[];
    isPublished: boolean;
    createdAt: string;
}

export default function AdminGalleryPage() {
    const [folders, setFolders] = useState<GalleryFolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<GalleryFolder | null>(null);
    const [newFolderTitle, setNewFolderTitle] = useState('');
    const [newFolderDescription, setNewFolderDescription] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const res = await fetch('/api/gallery?includeUnpublished=true');
            const data = await res.json();
            if (data.success) {
                setFolders(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch folders:', error);
        } finally {
            setLoading(false);
        }
    };

    const createFolder = async () => {
        if (!newFolderTitle.trim()) {
            alert('Please enter a folder title');
            return;
        }

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newFolderTitle,
                    description: newFolderDescription,
                    isPublished: true
                })
            });
            const data = await res.json();

            if (data.success) {
                setFolders([data.data, ...folders]);
                setNewFolderTitle('');
                setNewFolderDescription('');
                setShowCreateModal(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Create folder failed:', error);
            alert('Failed to create folder');
        }
    };

    const deleteFolder = async (id: string) => {
        if (!confirm('Are you sure you want to delete this folder and all its images?')) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setFolders(folders.filter(f => f._id !== id));
                if (selectedFolder?._id === id) {
                    setSelectedFolder(null);
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete folder');
        }
    };

    const togglePublished = async (folder: GalleryFolder) => {
        try {
            const res = await fetch(`/api/gallery/${folder._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    isPublished: !folder.isPublished
                })
            });
            const data = await res.json();

            if (data.success) {
                setFolders(folders.map(f => f._id === folder._id ? data.data : f));
                if (selectedFolder?._id === folder._id) {
                    setSelectedFolder(data.data);
                }
            }
        } catch (error) {
            console.error('Toggle published failed:', error);
        }
    };

    const handleAddImages = async (folderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const uploadedImages: GalleryImage[] = [];

            // Upload each file
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', 'lets-dance-academy/gallery');

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
                const uploadData = await uploadRes.json();

                if (uploadData.success) {
                    uploadedImages.push({
                        imageUrl: uploadData.data.url,
                        publicId: uploadData.data.publicId,
                        width: uploadData.data.width,
                        height: uploadData.data.height,
                        caption: ''
                    });
                }
            }

            // Add images to folder
            const res = await fetch(`/api/gallery/${folderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    addImages: uploadedImages
                })
            });
            const data = await res.json();

            if (data.success) {
                setFolders(folders.map(f => f._id === folderId ? data.data : f));
                if (selectedFolder?._id === folderId) {
                    setSelectedFolder(data.data);
                }
            }
        } catch (error) {
            console.error('Add images failed:', error);
            alert('Failed to add images');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const removeImage = async (folderId: string, imageId: string) => {
        if (!confirm('Delete this image?')) return;

        try {
            const res = await fetch(`/api/gallery/${folderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    removeImageId: imageId
                })
            });
            const data = await res.json();

            if (data.success) {
                setFolders(folders.map(f => f._id === folderId ? data.data : f));
                if (selectedFolder?._id === folderId) {
                    setSelectedFolder(data.data);
                }
            }
        } catch (error) {
            console.error('Remove image failed:', error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Gallery Management</h1>
                    <p className="text-gray-500">Organize photos in folders/albums.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <FaPlus /> New Folder
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading gallery...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Folders List */}
                    <div className="lg:col-span-1">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FaFolder /> Folders ({folders.length})
                        </h2>
                        <div className="space-y-3">
                            {folders.map((folder) => (
                                <div
                                    key={folder._id}
                                    onClick={() => setSelectedFolder(folder)}
                                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedFolder?._id === folder._id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-400 bg-white'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold truncate">{folder.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {folder.images.length} image{folder.images.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePublished(folder);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${folder.isPublished
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                            title={folder.isPublished ? 'Published' : 'Unpublished'}
                                        >
                                            {folder.isPublished ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {folders.length === 0 && (
                                <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <FaFolder size={32} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No folders yet</p>
                                    <p className="text-xs mt-1">Create one to start</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Folder Details */}
                    <div className="lg:col-span-2">
                        {selectedFolder ? (
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-black">{selectedFolder.title}</h2>
                                            {selectedFolder.description && (
                                                <p className="text-gray-600 mt-1">{selectedFolder.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteFolder(selectedFolder._id)}
                                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                    <label className={`cursor-pointer border-2 border-dashed border-blue-300 bg-blue-50 text-blue-600 px-6 py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploading ? <FaCloudArrowUp className="animate-bounce" /> : <FaPlus />}
                                        <span>{uploading ? 'Uploading...' : 'Add Images to Folder'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleAddImages(selectedFolder._id, e)}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedFolder.images.map((img) => (
                                        <div key={img._id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                            <Image
                                                src={img.imageUrl}
                                                alt={img.caption || 'Gallery Image'}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <button
                                                    onClick={() => img._id && removeImage(selectedFolder._id, img._id)}
                                                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {selectedFolder.images.length === 0 && (
                                        <div className="col-span-full py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                                            <FaImages size={32} className="mb-3 opacity-20" />
                                            <p className="text-sm">No images in this folder</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <div className="text-center text-gray-400">
                                    <FaFolder size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-medium">Select a folder to view its contents</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Folder Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black">Create New Folder</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-black p-2"
                            >
                                <FaXmark size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Folder Title *
                                </label>
                                <input
                                    type="text"
                                    value={newFolderTitle}
                                    onChange={(e) => setNewFolderTitle(e.target.value)}
                                    placeholder="e.g., Summer 2024, Workshops, Performances"
                                    className="w-full border-2 border-gray-300 p-3 text-sm font-bold focus:border-blue-600 focus:outline-none transition-colors rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newFolderDescription}
                                    onChange={(e) => setNewFolderDescription(e.target.value)}
                                    placeholder="Brief description of this album..."
                                    rows={3}
                                    className="w-full border-2 border-gray-300 p-3 text-sm focus:border-blue-600 focus:outline-none transition-colors rounded-lg resize-none"
                                />
                            </div>

                            <button
                                onClick={createFolder}
                                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors"
                            >
                                Create Folder
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
