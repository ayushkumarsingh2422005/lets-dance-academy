'use client';

import { FaRegImage, FaPen, FaTrash, FaUpload } from 'react-icons/fa6';

const banners = [
    { id: 1, title: 'Summer Intensive', status: 'Active', image: '/hero.png' },
    { id: 2, title: 'K-Pop Workshop', status: 'Scheduled', image: '/workshop.png' },
];

export default function AdminContent() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Content</h1>
                    <p className="text-gray-500 font-medium">Manage website banners and gallery.</p>
                </div>
            </div>

            {/* Banners Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase">Home Banners</h2>
                    <button className="bg-white border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors rounded-lg flex items-center gap-2">
                        <FaUpload /> Upload New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                        <div key={banner.id} className="group relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            {/* Placeholder for image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                <FaRegImage className="w-12 h-12" />
                            </div>

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button className="bg-white text-black p-3 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                                    <FaPen />
                                </button>
                                <button className="bg-white text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${banner.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                    }`}>
                                    {banner.status}
                                </span>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent text-white">
                                <p className="font-bold uppercase tracking-wide text-sm">{banner.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gallery Section */}
            <div className="pt-8 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase">Gallery Images</h2>
                    <button className="bg-white border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors rounded-lg flex items-center gap-2">
                        <FaUpload /> Upload New
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center hover:border-blue-500 cursor-pointer transition-colors relative group">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                <FaRegImage className="w-8 h-8" />
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="bg-red-500 text-white p-1.5 rounded-md text-xs">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
