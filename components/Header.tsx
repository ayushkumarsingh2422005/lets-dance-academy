'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    // Don't show header on admin pages
    if (pathname.startsWith('/admin')) {
        return null;
    }

    // Redirect admins to admin panel if they try to access non-admin pages
    // Allow only login/register pages for logged out state
    useEffect(() => {
        if (isAdmin && isAuthenticated) {
            const publicPages = ['/login', '/register', '/forgot-password'];
            if (!publicPages.includes(pathname)) {
                router.push('/admin');
            }
        }
    }, [isAdmin, isAuthenticated, pathname, router]);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/batches', label: 'Batches' },
        { href: '/workshops', label: 'Workshops' },
        { href: '/instructors', label: 'Instructors' },
        { href: '/studio', label: 'Studio' },
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-black tracking-tighter uppercase z-50 relative">
                    <Image src="/logo.jpg" alt="Logo" width={50} height={50} className='rounded-full' />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-bold uppercase tracking-wide transition-colors ${pathname === link.href ? 'text-black' : 'text-gray-600 hover:text-black'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {isAuthenticated && !isAdmin ? (
                        // Regular user is logged in - show Dashboard
                        <>
                            <Link
                                href="/dashboard"
                                className="hidden md:block text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hidden md:block bg-black text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-red-600 transition-colors rounded-none"
                            >
                                Logout
                            </button>
                        </>
                    ) : !isAuthenticated ? (
                        // Not logged in - show Login & Join Now
                        <>
                            <Link href="/login" className="hidden md:block text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide">
                                Login
                            </Link>
                            <Link href="/register" className="hidden md:block bg-black text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors rounded-none">
                                Join Now
                            </Link>
                        </>
                    ) : null}
                    {/* Note: If admin is logged in and browsing public site, show nothing */}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden relative z-50 p-2 text-black"
                    >
                        {isMenuOpen ? <FaXmark size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed top-20 left-0 w-full h-[calc(100vh-5rem)] z-40 bg-white md:hidden overflow-y-auto pb-10 px-6 border-t border-gray-100">
                    <nav className="flex flex-col gap-6 pt-10">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-3xl font-black uppercase tracking-tighter border-b pb-4 transition-colors ${isActive
                                        ? 'text-blue-600 border-blue-100 pl-4 border-l-4 border-l-blue-600'
                                        : 'text-black border-gray-100 hover:text-blue-600'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="flex flex-col gap-4 mt-8">
                            {isAuthenticated && !isAdmin ? (
                                // Regular user logged in
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-xl font-bold uppercase tracking-wide text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 text-white px-6 py-4 text-center text-sm font-bold uppercase tracking-wide rounded-none"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : !isAuthenticated ? (
                                // Not logged in
                                <>
                                    <Link
                                        href="/login"
                                        className="text-xl font-bold uppercase tracking-wide text-gray-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white px-6 py-4 text-center text-sm font-bold uppercase tracking-wide rounded-none"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Join Now
                                    </Link>
                                </>
                            ) : null}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
