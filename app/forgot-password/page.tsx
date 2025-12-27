'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // User endpoint only
            const response = await fetch('/api/auth/user/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setStep('otp');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }

        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // User endpoint only
            const response = await fetch('/api/auth/user/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setStep('success');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <Header />

            <main className="pt-20 flex items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-lg">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">
                        {step === 'success' ? 'Success!' : 'Reset Password'}
                    </h1>
                    <p className="text-gray-500 text-center mb-8 text-sm font-bold">
                        {step === 'email' && 'Enter your email to receive OTP'}
                        {step === 'otp' && 'Enter the OTP sent to your email'}
                        {step === 'success' && 'Your password has been reset'}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded">
                            {message}
                        </div>
                    )}

                    {step === 'email' && (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    OTP Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 characters)"
                                    className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep('email')}
                                className="w-full text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide"
                            >
                                ← Back to Email
                            </button>
                        </form>
                    )}

                    {step === 'success' && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-600">
                                You can now login with your new password
                            </p>
                            <Link
                                href="/login"
                                className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {step !== 'success' && (
                        <div className="mt-8 text-center text-xs font-bold text-gray-500">
                            <p>
                                Remember your password?{' '}
                                <Link href="/login" className="text-black underline hover:text-blue-600">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
