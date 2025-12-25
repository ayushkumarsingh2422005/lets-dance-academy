'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaXmark } from 'react-icons/fa6';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

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
                    <Link href="/login" className="hidden md:block text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide">
                        Login
                    </Link>
                    <Link href="/register" className="hidden md:block bg-black text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors rounded-none">
                        Join Now
                    </Link>

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
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
