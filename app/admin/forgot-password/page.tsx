'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
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
            // Admin endpoint
            const response = await fetch('/api/auth/admin/forgot-password', {
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
            // Admin endpoint
            const response = await fetch('/api/auth/admin/reset-password', {
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 border-2 border-gray-700 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white">
                        {step === 'success' ? 'Password Reset!' : 'Admin Password Reset'}
                    </h1>
                    <p className="text-gray-400 text-sm font-bold">
                        {step === 'email' && 'Enter your admin email to receive OTP'}
                        {step === 'otp' && 'Enter the OTP sent to your email'}
                        {step === 'success' && 'Your admin password has been reset'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-200 text-sm font-bold rounded">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-900/50 border border-green-600 text-green-200 text-sm font-bold rounded">
                        {message}
                    </div>
                )}

                {step === 'email' && (
                    <form className="space-y-6" onSubmit={handleSendOTP}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Admin Email Address
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 'otp' && (
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-sm font-bold text-white focus:border-blue-600 focus:outline-none transition-colors rounded-none placeholder:font-normal placeholder:text-gray-600 text-center text-2xl tracking-widest"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 characters)"
                                className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-sm font-bold text-white focus:border-blue-600 focus:outline-none transition-colors rounded-none placeholder:font-normal placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full bg-gray-900 border-2 border-gray-700 p-4 text-sm font-bold text-white focus:border-blue-600 focus:outline-none transition-colors rounded-none placeholder:font-normal placeholder:text-gray-600"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="w-full text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wide"
                        >
                            ← Back to Email
                        </button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-gray-300">
                            You can now login with your new password
                        </p>
                        <Link
                            href="/admin/login"
                            className="block w-full bg-blue-600 text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors"
                        >
                            Go to Admin Login
                        </Link>
                    </div>
                )}

                {step !== 'success' && (
                    <div className="mt-8 text-center">
                        <Link
                            href="/admin/login"
                            className="text-xs text-gray-500 hover:text-gray-400 uppercase tracking-wider"
                        >
                            ← Back to Admin Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
