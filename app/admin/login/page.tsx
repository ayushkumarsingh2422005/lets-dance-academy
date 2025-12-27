'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Admin login only - always true for isAdmin
        const result = await login(email, password, true);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 border-2 border-gray-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">
                        Admin Access
                    </h1>
                    <p className="text-gray-400 text-sm font-bold">
                        Restricted Area - Authorized Personnel Only
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-200 text-sm font-bold rounded">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@letsdanceacademy.com"
                            className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-sm font-bold text-white focus:border-blue-600 focus:outline-none transition-colors rounded-none placeholder:font-normal placeholder:text-gray-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-900 border-2 border-gray-700 p-4 pr-12 text-sm font-bold text-white focus:border-blue-600 focus:outline-none transition-colors rounded-none placeholder:font-normal placeholder:text-gray-600"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end text-xs font-bold">
                        <Link href="/admin/forgot-password" className="text-blue-400 hover:text-blue-300">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Access Admin Panel'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-xs text-gray-500 hover:text-gray-400 uppercase tracking-wider"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </div>
        </div>
    );
}
