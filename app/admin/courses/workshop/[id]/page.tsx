'use client';

import { useState } from 'react';
import { FaPen, FaTrash, FaPlus, FaCalendarDays, FaClock, FaLocationDot } from 'react-icons/fa6';
import Link from 'next/link';

const workshopData = {
    id: 1,
    title: 'K-Pop Revolution',
    description: 'A 2-day intensive workshop covering the latest hits from BTS and Blackpink.',
    instructor: 'Guest Artist: Min-Jae',
    price: '₹ 1500',
    dates: '28-29 Jan 2025',
    sessions: [
        {
            id: 1,
            title: 'Day 1: Foundations & Choreo Part 1',
            date: '28 Jan 2025',
            time: '10:00 AM - 2:00 PM',
            location: 'Sambhaji Nagar Studio',
            topics: ['Isolation Drills', 'Dynamite Chorus', 'Performance Techniques']
        },
        {
            id: 2,
            title: 'Day 2: Choreo Part 2 & Filming',
            date: '29 Jan 2025',
            time: '10:00 AM - 3:00 PM',
            location: 'Sambhaji Nagar Studio',
            topics: ['Formation Changes', 'Camera Work', 'Group Filming']
        }
    ]
};

export default function AdminWorkshopDetails() {
    const [sessions, setSessions] = useState(workshopData.sessions);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase mb-2">
                    <Link href="/admin/courses" className="hover:text-black">Courses</Link>
                    <span>/</span>
                    <span className="text-black">Manage Workshop</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">{workshopData.title}</h1>
                    <div className="flex gap-3">
                        <button className="bg-white border border-gray-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors rounded-lg">
                            Edit Details
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors rounded-lg">
                            View Registrations ({45})
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: Schedule Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase">Schedule & Sessions</h3>
                        <button className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wide hover:text-blue-800">
                            <FaPlus /> Add Session
                        </button>
                    </div>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {sessions.map((session, index) => (
                            <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                {/* Timeline Icon */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 md:-ml-[20px]">
                                    <span className="text-xs font-bold">{index + 1}</span>
                                </div>

                                {/* Content Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-gray-200 shadow-sm ml-16 md:ml-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-lg">{session.title}</h4>
                                        <div className="flex gap-2">
                                            <button className="text-gray-400 hover:text-blue-600"><FaPen className="w-3 h-3" /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaCalendarDays className="text-blue-500 w-4 h-4" />
                                            <span className="font-medium">{session.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaClock className="text-blue-500 w-4 h-4" />
                                            <span className="font-medium">{session.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <FaLocationDot className="text-blue-500 w-4 h-4" />
                                            <span className="font-medium">{session.location}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs font-bold uppercase text-gray-400 mb-2">Topics Covered</p>
                                        <div className="flex flex-wrap gap-2">
                                            {session.topics.map((t, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-gray-200 text-xs font-bold rounded text-gray-600">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Workshop Settings */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase mb-4 text-gray-900 border-b border-gray-100 pb-2">Workshop Info</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Fee</label>
                                <input type="text" defaultValue={workshopData.price} className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Instructor</label>
                                <input type="text" defaultValue={workshopData.instructor} className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Registration Limit</label>
                                <input type="number" defaultValue={50} className="w-full bg-gray-50 border border-gray-200 p-2 rounded font-bold text-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase mb-4 text-gray-900 border-b border-gray-100 pb-2">Promotion</h3>
                        <div className="h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                            <FaPlus className="mb-2" />
                            <span className="text-xs font-bold uppercase">Upload Flyer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
