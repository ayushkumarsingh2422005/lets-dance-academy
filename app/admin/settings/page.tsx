'use client';

import { FaUserShield, FaBell, FaDatabase, FaLock } from 'react-icons/fa6';

export default function AdminSettings() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Settings</h1>
                    <p className="text-gray-500 font-medium">Configure administrator preferences.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors rounded-lg">
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Settings */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <FaUserShield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-wide">Admin Profile</h3>
                            <p className="text-xs text-gray-500 font-bold">Manage your account</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Display Name</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-bold" defaultValue="Admin User" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                            <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-bold" defaultValue="admin@letsdance.com" />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                            <FaBell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-wide">Notifications</h3>
                            <p className="text-xs text-gray-500 font-bold">Control email alerts</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            'New Registration Alerts',
                            'Payment Received Notifications',
                            'Daily Attendance Summary',
                            'System Updates'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="font-bold text-gray-700 text-sm">{item}</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <FaLock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-wide">Security</h3>
                            <p className="text-xs text-gray-500 font-bold">Password & Access</p>
                        </div>
                    </div>
                    <button className="w-full border border-gray-200 bg-gray-50 text-black p-4 rounded-lg font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors mb-4">
                        Change Password
                    </button>
                    <button className="w-full border border-gray-200 bg-gray-50 text-black p-4 rounded-lg font-bold uppercase tracking-wide hover:bg-red-600 hover:text-white transition-colors">
                        Enable 2-Factor Auth
                    </button>
                </div>

                {/* Data Management */}
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <FaDatabase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-wide">Data</h3>
                            <p className="text-xs text-gray-500 font-bold">Backup & Export</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full border border-gray-200 bg-gray-50 text-black p-4 rounded-lg font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors flex justify-between items-center group">
                            <span>Export Student Data (CSV)</span>
                            <span className="text-gray-400 group-hover:text-white">↓</span>
                        </button>
                        <button className="w-full border border-gray-200 bg-gray-50 text-black p-4 rounded-lg font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors flex justify-between items-center group">
                            <span>Export Payment History (XLS)</span>
                            <span className="text-gray-400 group-hover:text-white">↓</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
