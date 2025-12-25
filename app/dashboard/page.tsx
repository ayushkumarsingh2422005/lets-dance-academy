
"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'workshops' | 'attendance' | 'notifications'>('overview');

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-black">
            {/* Sidebar - LMS Style */}
            <aside className="w-64 bg-black text-white flex-shrink-0 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-800">
                    <Link href="/" className="text-xl font-bold tracking-tighter uppercase block">
                        Let's Dance <span className="text-blue-600">.</span>
                    </Link>
                    <span className="text-xs text-gray-500 font-mono mt-1 block">STUDENT PORTAL</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        <span>📊</span> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        <span>💃</span> My Batches
                    </button>
                    <button
                        onClick={() => setActiveTab('workshops')}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'workshops' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        <span>🎫</span> Workshops
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        <span>📅</span> Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                        <span>🔔</span> Notifications
                    </button>
                </nav>

                <div className="p-6 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div>
                            <p className="text-sm font-bold">John Doe</p>
                            <p className="text-xs text-gray-500">Pro Member</p>
                        </div>
                    </div>
                    <Link href="/" className="text-xs text-gray-400 hover:text-white uppercase tracking-wider">Sign Out</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'courses' && 'My Active Batches'}
                            {activeTab === 'workshops' && 'Upcoming Workshops'}
                            {activeTab === 'attendance' && 'Attendance Record'}
                            {activeTab === 'notifications' && 'Notifications'}
                        </h1>
                        <p className="text-gray-500 text-sm font-bold mt-1">Welcome back, ready to move?</p>
                    </div>
                    <Link href="/batches" className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                        Browse New Courses
                    </Link>
                </header>

                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stats Cards */}
                        <div className="bg-white p-6 border border-gray-200 hover:border-blue-600 transition-colors">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Active Batches</span>
                            <p className="text-4xl font-black mt-2">02</p>
                        </div>
                        <div className="bg-white p-6 border border-gray-200 hover:border-blue-600 transition-colors">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Workshops Booked</span>
                            <p className="text-4xl font-black mt-2">01</p>
                        </div>
                        <div className="bg-white p-6 border border-gray-200 hover:border-blue-600 transition-colors">
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Attendance</span>
                            <p className="text-4xl font-black mt-2 text-green-600">85%</p>
                        </div>

                        {/* Recent Activity / Next Class */}
                        <div className="md:col-span-2 bg-white p-8 border border-gray-200">
                            <h3 className="text-xl font-black uppercase mb-6">Up Next</h3>
                            <div className="flex items-center gap-6 border-l-4 border-blue-600 pl-6 py-2">
                                <div>
                                    <p className="text-3xl font-black leading-none">TODAY</p>
                                    <p className="text-gray-500 font-bold text-sm">6:00 PM</p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold uppercase">Hip Hop Fundamentals</h4>
                                    <p className="text-gray-600 text-sm">Hall A • Instructor: Alex D.</p>
                                </div>
                                <button className="ml-auto bg-black text-white px-6 py-2 text-xs font-bold uppercase hover:bg-blue-600 transition-colors">
                                    Check In
                                </button>
                            </div>
                        </div>

                        {/* Quick Notices */}
                        <div className="bg-neutral-900 text-white p-8">
                            <h3 className="text-lg font-black uppercase mb-4 text-blue-500">Notice Board</h3>
                            <ul className="space-y-4 text-sm font-medium text-gray-400">
                                <li>•  Studio closed on Public Holiday (Oct 2nd)</li>
                                <li>•  Annual Showcase auditions starting next week.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* TAB: COURSES (Active Batches) */}
                {activeTab === 'courses' && (
                    <div className="space-y-8">
                        {['Hip Hop Fundamentals', 'Contemporary Flow'].map((course, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-0 flex flex-col md:flex-row hover:border-blue-600 transition-colors group">
                                <div className="md:w-64 h-48 bg-gray-200 relative shrink-0">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase">Course Image</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-black uppercase">{course}</h3>
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 uppercase tracking-wider">Active</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">Mon, Wed, Fri • 6:00 PM - 7:30 PM</p>
                                        <div className="w-full bg-gray-100 h-2 mb-2">
                                            <div className="bg-blue-600 h-2" style={{ width: '45%' }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">45% Syllabus Completed</span>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <Link href="/batches/hip-hop" className="bg-black text-white px-6 py-3 text-xs font-bold uppercase hover:bg-blue-600 transition-colors">
                                            Continue Learning
                                        </Link>
                                        <button className="border border-gray-300 px-6 py-3 text-xs font-bold uppercase hover:border-black transition-colors">
                                            View Syllabus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB: WORKSHOPS */}
                {activeTab === 'workshops' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Registered Workshop */}
                        <div className="bg-white border-2 border-blue-600 p-6 relative overflow-hidden">
                            <span className="bg-blue-600 text-white absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase">Registered</span>
                            <span className="text-5xl font-black text-gray-100 absolute -bottom-4 -right-4 z-0">OCT 24</span>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Upcoming Event</p>
                                <h3 className="text-2xl font-black uppercase mb-1">Urban Choreography</h3>
                                <p className="text-gray-600 font-bold text-sm mb-6">Instructor: Alex D.</p>
                                <button className="w-full bg-black text-white py-3 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">
                                    View Ticket
                                </button>
                            </div>
                        </div>

                        {/* Past Workshop */}
                        <div className="bg-gray-50 border border-gray-200 p-6 opacity-75 hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Past Event</span>
                            <h3 className="text-xl font-bold uppercase mb-1">Heels 101</h3>
                            <p className="text-gray-600 text-sm mb-6">September 15, 2025</p>
                            <button className="w-full border border-gray-300 py-3 text-xs font-bold uppercase hover:bg-white transition-colors">
                                View Recording
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB: ATTENDANCE */}
                {activeTab === 'attendance' && (
                    <div className="bg-white border border-gray-200 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black uppercase">Attendance History</h2>
                            <div className="flex gap-2 text-sm font-bold">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Present</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Absent</span>
                            </div>
                        </div>

                        {/* Simple Calendar Grid Mockup */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 mb-6">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="bg-gray-50 p-2 text-center text-xs font-bold uppercase text-gray-500">{day}</div>
                            ))}
                            {[...Array(30)].map((_, i) => {
                                const day = i + 1;
                                // Mocking status
                                const isClassDay = [1, 3, 5].includes((i + 1) % 7); // Mon, Wed, Fri roughly
                                const isPresent = isClassDay && Math.random() > 0.2;
                                const isAbsent = isClassDay && !isPresent;

                                return (
                                    <div key={i} className="bg-white h-24 p-2 relative group hover:bg-gray-50 transition-colors">
                                        <span className="font-bold text-sm">{day}</span>
                                        {isClassDay && (
                                            <div className={`mt-2 text-[10px] font-bold uppercase px-1 py-0.5 ${isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {isPresent ? 'Present' : 'Absent'}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Showing report for <span className="text-black font-bold">October 2025</span></p>
                    </div>
                )}

                {/* TAB: NOTIFICATIONS */}
                {activeTab === 'notifications' && (
                    <div className="max-w-2xl bg-white border border-gray-200">
                        {[
                            { title: "Class Cancelled", msg: "Tonight's Jazz Funk class is responding to next Tuesday.", time: "2 hours ago", type: "alert" },
                            { title: "New Workshop Added", msg: "Heels Intensive with Sarah is now open for registration.", time: "1 day ago", type: "info" },
                            { title: "Payment Successful", msg: "Your monthly subscription has been renewed.", time: "3 days ago", type: "success" }
                        ].map((note, i) => (
                            <div key={i} className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-4">
                                <span className={`text-xl ${note.type === 'alert' ? 'text-red-500' : note.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                                    {note.type === 'alert' ? '⚠️' : note.type === 'success' ? '✓' : 'ℹ️'}
                                </span>
                                <div>
                                    <h3 className="font-bold uppercase text-sm mb-1">{note.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{note.msg}</p>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{note.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
