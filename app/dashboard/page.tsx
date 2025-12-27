"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    FaBars,
    FaXmark,
    FaChartLine,
    FaUserGroup,
    FaCalendarDays,
    FaCalendarCheck,
    FaBell,
    FaUser,
    FaTriangleExclamation
} from 'react-icons/fa6';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'workshops' | 'attendance' | 'notifications' | 'profile'>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout, token, updateUser } = useAuth();

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    });
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
    const [uploading, setUploading] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [changingPassword, setChangingPassword] = useState(false);


    // Fetch latest user data to check for updates
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const res = await fetch('/api/user/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.data.user) {
                        updateUser(data.data.user);
                    }
                } catch (error) {
                    console.error('Failed to refresh user data', error);
                }
            }
        };
        fetchUserData();
    }, [token]);

    // Sync user data to state when user loads
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                emergencyContactName: user.emergencyContactName || '',
                emergencyContactPhone: user.emergencyContactPhone || '',
            });
            setProfilePicture(user.profilePicture || '');
        }
    }, [user]);

    // Helper to extract public ID from Cloudinary URL
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

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setProfileMessage({ type: 'error', text: 'Image size must be less than 2MB' });
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setProfileMessage({ type: 'error', text: 'Please upload an image file' });
            return;
        }

        setUploading(true);
        setProfileMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'lets-dance-academy/profiles');

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const newImageUrl = data.data.url;

                // Delete old image if exists
                if (user?.profilePicture) {
                    const oldPublicId = getPublicIdFromUrl(user.profilePicture);
                    if (oldPublicId) {
                        try {
                            await fetch('/api/upload', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ publicId: oldPublicId })
                            });
                        } catch (err) {
                            console.error('Failed to delete old image:', err);
                        }
                    }
                }

                setProfilePicture(newImageUrl);

                // Auto-save to DB immediately
                const updateResponse = await fetch('/api/user/profile', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ profilePicture: newImageUrl })
                });

                const updateResult = await updateResponse.json();

                if (updateResult.success) {
                    setProfileMessage({ type: 'success', text: 'Profile picture updated successfully!' });
                    updateUser(updateResult.data.user);
                } else {
                    setProfileMessage({ type: 'error', text: 'Image uploaded but failed to save to profile.' });
                }
            } else {
                setProfileMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Failed to upload image' });
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    // Handle profile update
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setProfileMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...profileData,
                    profilePicture
                })
            });

            const data = await response.json();

            if (data.success) {
                setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update user in context
                updateUser(data.data.user);
            } else {
                setProfileMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Failed to update profile' });
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        // Validate password length
        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setChangingPassword(true);

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setPasswordMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Failed to change password' });
            console.error(error);
        } finally {
            setChangingPassword(false);
        }
    };


    return (
        <ProtectedRoute rejectAdmin={true}>
            <div className="min-h-screen bg-gray-50 flex font-sans text-black">

                {/* Mobile Header */}
                <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white z-50 flex items-center justify-between px-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <FaXmark className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                        <span className="font-bold uppercase tracking-tight">Student Portal</span>
                    </div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </header>

                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`w-64 bg-black text-white shrink-0 flex flex-col fixed h-full z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}>
                    <div className="p-6 border-b border-gray-800 mt-16 md:mt-0">
                        <Link href="/" className="text-xl font-bold tracking-tighter uppercase block">
                            Let's Dance <span className="text-blue-600">.</span>
                        </Link>
                        <span className="text-xs text-gray-500 font-mono mt-1 block">STUDENT PORTAL</span>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <button
                            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaChartLine className="w-4 h-4" /> Overview
                        </button>
                        <button
                            onClick={() => { setActiveTab('courses'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaUserGroup className="w-4 h-4" /> My Batches
                        </button>
                        <button
                            onClick={() => { setActiveTab('workshops'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'workshops' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaCalendarDays className="w-4 h-4" /> Workshops
                        </button>
                        <button
                            onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaCalendarCheck className="w-4 h-4" /> Attendance
                        </button>
                        <button
                            onClick={() => { setActiveTab('notifications'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaBell className="w-4 h-4" /> Notifications
                        </button>
                        <button
                            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wide flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                        >
                            <FaUser className="w-4 h-4" /> My Profile
                        </button>
                    </nav>

                    <div className="p-6 border-t border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                                {user?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{user?.name || 'Student'}</p>
                                <p className="text-xs text-gray-500">Member</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="text-xs text-gray-400 hover:text-white uppercase tracking-wider cursor-pointer"
                        >
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 w-full">

                    {/* Deactivation Warning */}
                    {user?.isActive === false && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 shadow-sm">
                            <div className="flex items-start gap-4">
                                <FaTriangleExclamation className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-red-800 uppercase tracking-wide text-sm mb-2">
                                        Account Notice: Deactivated
                                    </h3>
                                    <p className="text-red-700 text-sm mb-4">
                                        Your account has been deactivated. Access to certain features may be restricted.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 text-xs font-bold uppercase text-red-600 bg-red-100/50 p-3 rounded">
                                        {user?.deactivationReason && (
                                            <span className="flex items-center gap-2">
                                                <span className="text-red-500">Reason:</span>
                                                <span className="text-red-900">{user.deactivationReason}</span>
                                            </span>
                                        )}
                                        {user?.deactivatedAt && (
                                            <>
                                                <span className="hidden sm:inline text-red-300">|</span>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-red-500">Date:</span>
                                                    <span className="text-red-900">
                                                        {new Date(user.deactivatedAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                {activeTab === 'overview' && 'Dashboard Overview'}
                                {activeTab === 'courses' && 'My Active Batches'}
                                {activeTab === 'workshops' && 'Upcoming Workshops'}
                                {activeTab === 'attendance' && 'Attendance Record'}
                                {activeTab === 'notifications' && 'Notifications'}
                                {activeTab === 'profile' && 'My Profile'}
                            </h1>
                            <p className="text-gray-500 text-sm font-bold mt-1">Welcome back, ready to move?</p>
                        </div>
                        <Link href="/batches" className="bg-black text-center text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
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
                            <div className="md:col-span-2 bg-white p-6 md:p-8 border border-gray-200">
                                <h3 className="text-xl font-black uppercase mb-6">Up Next</h3>
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border-l-4 border-blue-600 pl-6 py-2">
                                    <div>
                                        <p className="text-3xl font-black leading-none">TODAY</p>
                                        <p className="text-gray-500 font-bold text-sm">6:00 PM</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold uppercase">Hip Hop Fundamentals</h4>
                                        <p className="text-gray-600 text-sm">Hall A • Instructor: Alex D.</p>
                                    </div>
                                    <button className="md:ml-auto bg-black text-white px-6 py-2 text-xs font-bold uppercase hover:bg-blue-600 transition-colors w-fit">
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
                                        <div className="flex flex-col md:flex-row gap-4 mt-6">
                                            <Link href="/batches/hip-hop" className="bg-black text-center text-white px-6 py-3 text-xs font-bold uppercase hover:bg-blue-600 transition-colors">
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
                        <div className="bg-white border border-gray-200 p-4 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                <h2 className="text-xl font-black uppercase">Attendance History</h2>
                                <div className="flex gap-2 text-sm font-bold">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Present</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Absent</span>
                                </div>
                            </div>

                            {/* Calendar Grid - Mobile Scroll */}
                            <div className="overflow-x-auto pb-4">
                                <div className="min-w-[600px]">
                                    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 mb-6">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="bg-gray-50 p-2 text-center text-xs font-bold uppercase text-gray-500">{day}</div>
                                        ))}
                                        {[...Array(30)].map((_, i) => {
                                            const day = i + 1;
                                            // Mocking status
                                            const isClassDay = [1, 3, 5].includes((i + 1) % 7); // Mon, Wed, Fri roughly
                                            const isPresent = isClassDay && Math.random() > 0.2;

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
                                </div>
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

                    {/* TAB: PROFILE */}
                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="max-w-3xl">
                            <div className="bg-white border border-gray-200 p-6 md:p-8 mb-6">
                                <h2 className="text-xl font-black uppercase mb-6">Personal Information</h2>

                                {profileMessage.text && (
                                    <div className={`mb-6 p-4 text-sm font-bold rounded ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {profileMessage.text}
                                    </div>
                                )}

                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-100 relative">
                                            {profilePicture ? (
                                                <div className="absolute inset-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={profilePicture}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-3xl font-black text-gray-600">
                                                    {user?.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {uploading ? 'Uploading...' : 'Change Photo'}
                                            </button>
                                            <p className="text-xs text-gray-500">JPG or PNG. Max 2MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                                Email Address (Read Only)
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium bg-gray-50 text-gray-500 focus:outline-none cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                placeholder="+91 XXXXX XXXXX"
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                value={profileData.dateOfBirth}
                                                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            Emergency Contact
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Contact Name"
                                                value={profileData.emergencyContactName}
                                                onChange={(e) => setProfileData({ ...profileData, emergencyContactName: e.target.value })}
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Contact Phone"
                                                value={profileData.emergencyContactPhone}
                                                onChange={(e) => setProfileData({ ...profileData, emergencyContactPhone: e.target.value })}
                                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-black text-white px-8 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Change Password Section */}
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h2 className="text-xl font-black uppercase mb-6">Change Password</h2>

                                {passwordMessage.text && (
                                    <div className={`mb-6 p-4 text-sm font-bold rounded ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {passwordMessage.text}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="bg-black text-white px-8 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {changingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
