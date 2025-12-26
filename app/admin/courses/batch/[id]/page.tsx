'use client';

import { useState } from 'react';
import { FaPen, FaTrash, FaPlus, FaGripVertical, FaCirclePlay, FaFileLines } from 'react-icons/fa6';
import Link from 'next/link';

// Mock Data for a specific batch
const batchData = {
    id: 1,
    title: 'Hip Hop Fundamentals',
    description: 'Learn the core foundations of Hip Hop dance, including history, basic grooves, and freestyle techniques.',
    level: 'Beginner',
    instructor: 'Prathamesh Mane',
    price: '₹ 2500 / month',
    schedule: 'Mon, Wed, Fri (5:00 PM - 6:30 PM)',
    modules: [
        {
            id: 101,
            title: 'Foundations & Grooves',
            lessons: [
                { id: 1, title: 'History of Hip Hop', type: 'theory', duration: '15 mins' },
                { id: 2, title: 'The Bounce & Rock', type: 'video', duration: '45 mins' },
            ]
        },
        {
            id: 102,
            title: 'Footwork Basics',
            lessons: [
                { id: 3, title: 'Two Step & Variations', type: 'video', duration: '30 mins' },
                { id: 4, title: 'Running Man Drill', type: 'video', duration: '40 mins' },
            ]
        }
    ]
};

export default function AdminBatchDetails() { // params would be used here in real app
    const [modules, setModules] = useState(batchData.modules);
    // In a real app, use params.id to fetch data

    return (
        <div className="space-y-8">
            {/* Header / Breadcrumb */}
            <div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase mb-2">
                    <Link href="/admin/courses" className="hover:text-black">Courses</Link>
                    <span>/</span>
                    <span className="text-black">Manage Batch</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">{batchData.title}</h1>
                    <div className="flex gap-3">
                        <button className="bg-white border border-gray-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors rounded-lg">
                            Edit Details
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors rounded-lg">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Course Structure Management */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase">Syllabus & Modules</h3>
                        <button className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wide hover:text-blue-800">
                            <FaPlus /> Add Module
                        </button>
                    </div>

                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <div key={module.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                {/* Module Header */}
                                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <FaGripVertical className="text-gray-400 cursor-move" />
                                        <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">Module 0{index + 1}</span>
                                        <h4 className="font-bold text-lg">{module.title}</h4>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded"><FaPen className="w-3 h-3" /></button>
                                        <button className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded"><FaTrash className="w-3 h-3" /></button>
                                    </div>
                                </div>

                                {/* Lessons List */}
                                <div className="p-2">
                                    {module.lessons.map((lesson) => (
                                        <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-md ${lesson.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {lesson.type === 'video' ? <FaCirclePlay className="w-3 h-3" /> : <FaFileLines className="w-3 h-3" />}
                                                </div>
                                                <span className="font-bold text-sm text-gray-800">{lesson.title}</span>
                                                <span className="text-xs text-gray-400 font-medium">({lesson.duration})</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-xs font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-3 border-t border-dashed border-gray-200 text-gray-400 hover:text-blue-600 text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 mt-2 hover:bg-blue-50 transition-colors rounded-b-lg">
                                        <FaPlus /> Add Lesson
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* RIGHT: Meta Info & Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase mb-4 text-gray-900 border-b border-gray-100 pb-2">Batch Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Instructor</label>
                                <select className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm">
                                    <option>{batchData.instructor}</option>
                                    <option>Sarah J</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Schedule</label>
                                <input type="text" defaultValue={batchData.schedule} className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pricing</label>
                                <input type="text" defaultValue={batchData.price} className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Difficulty</label>
                                <select className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm">
                                    <option>{batchData.level}</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase mb-4 text-gray-900 border-b border-gray-100 pb-2">Batch Content</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-colors group">
                                <span className="text-xs font-bold uppercase">Manage Video Library</span>
                                <span className="text-gray-400 group-hover:text-white">→</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-colors group">
                                <span className="text-xs font-bold uppercase">Assessment / Tests</span>
                                <span className="text-gray-400 group-hover:text-white">→</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <h3 className="text-sm font-black uppercase mb-2 text-red-900">Danger Zone</h3>
                        <p className="text-xs text-red-700 mb-4">Deleting this batch will remove all student associations and attendance records.</p>
                        <button className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition-colors">
                            Archive Batch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
