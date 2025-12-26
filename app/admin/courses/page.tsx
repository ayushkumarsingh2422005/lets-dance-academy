'use client';

import { useState } from 'react';
import { FaPen, FaTrash, FaEye } from 'react-icons/fa6';
import Link from 'next/link';

const batches = [
    { id: 1, title: 'Hip Hop Fundamentals', level: 'Beginner', schedule: 'Mon, Wed, Fri (5 PM)', instructor: 'Prathamesh Mane', students: 18, max: 20 },
    { id: 2, title: 'Contemporary Flow', level: 'Intermediate', schedule: 'Tue, Thu, Sat (6 PM)', instructor: 'Sarah J', students: 12, max: 15 },
];

const workshops = [
    { id: 1, title: 'K-Pop Revolution', date: '28-29 Jan', instructor: 'Guest Artist', registered: 45, price: '₹ 1500' },
    { id: 2, title: 'Summer Intensive', date: 'May 1-30', instructor: 'Various', registered: 120, price: '₹ 8000' },
];

export default function AdminCourses() {
    const [activeTab, setActiveTab] = useState<'batches' | 'workshops'>('batches');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Courses</h1>
                    <p className="text-gray-500 font-medium">Manage regular batches and special workshops.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors rounded-lg">
                    + Create New {activeTab === 'batches' ? 'Batch' : 'Workshop'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('batches')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${activeTab === 'batches' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
                        }`}
                >
                    Regular Batches
                </button>
                <button
                    onClick={() => setActiveTab('workshops')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors border-b-2 ${activeTab === 'workshops' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'
                        }`}
                >
                    Workshops
                </button>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'batches' ? (
                    batches.map((batch) => (
                        <div key={batch.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{batch.level}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/courses/batch/${batch.id}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><FaEye className="w-3 h-3" /></Link>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><FaPen className="w-3 h-3" /></button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"><FaTrash className="w-3 h-3" /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black uppercase mb-1">{batch.title}</h3>
                            <p className="text-sm font-medium text-gray-500 mb-4">{batch.instructor}</p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400 font-medium">Schedule</span>
                                    <span className="font-bold">{batch.schedule}</span>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase mb-1">
                                        <span className="text-gray-400">Capacity</span>
                                        <span>{batch.students} / {batch.max}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-black h-full rounded-full" style={{ width: `${(batch.students / batch.max) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    workshops.map((ws) => (
                        <div key={ws.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{ws.price}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/admin/courses/workshop/${ws.id}`} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><FaEye className="w-3 h-3" /></Link>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"><FaPen className="w-3 h-3" /></button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600"><FaTrash className="w-3 h-3" /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-black uppercase mb-1">{ws.title}</h3>
                            <p className="text-sm font-medium text-gray-500 mb-4">{ws.date}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-sm">
                                    <span className="block text-gray-400 text-xs font-bold uppercase">Registrations</span>
                                    <span className="font-black text-lg">{ws.registered}</span>
                                </div>
                                <div className="text-right text-sm">
                                    <span className="block text-gray-400 text-xs font-bold uppercase">Instructor</span>
                                    <span className="font-bold">{ws.instructor}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
