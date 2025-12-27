'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

export default function LoginPage() {
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

        // User login only - no admin option
        const result = await login(email, password, false);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <Header />

            <main className="pt-20 flex items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-lg">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">Welcome Back</h1>
                    <p className="text-gray-500 text-center mb-8 text-sm font-bold">
                        Sign in to your account
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border-2 border-gray-200 p-4 pr-12 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end text-xs font-bold">
                            <Link href="/forgot-password" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold text-gray-500">
                        <p>
                            Don't have an account?{' '}
                            <Link href="/register" className="text-black underline hover:text-blue-600">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
