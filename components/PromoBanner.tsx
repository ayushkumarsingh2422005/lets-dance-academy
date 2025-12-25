'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFire, FaArrowRight, FaChevronLeft, FaChevronRight, FaStar, FaBolt } from 'react-icons/fa6';

const banners = [
    {
        id: 1,
        tag: "Limited Time Offer",
        tagIcon: FaFire,
        title: "Summer",
        highlight: "Intensive",
        desc: "4 Weeks. 5 Styles. 1 Stage. Join the most comprehensive dance training program of the year.",
        link: "/register",
        cta: "Register Now",
        ctaSub: "Get 20% Off",
        gradient: "from-blue-400 to-purple-500",
        bgGlow1: "bg-blue-600/20",
        bgGlow2: "bg-purple-600/20"
    },
    {
        id: 2,
        tag: "New Batch Alert",
        tagIcon: FaBolt,
        title: "K-Pop",
        highlight: "Revolution",
        desc: "Learn the trending choreographies from BTS, Blackpink, and more. Weekend batches starting soon.",
        link: "/batches",
        cta: "View Schedule",
        ctaSub: "Slots Filling Fast",
        gradient: "from-pink-400 to-rose-500",
        bgGlow1: "bg-pink-600/20",
        bgGlow2: "bg-rose-600/20"
    },
    {
        id: 3,
        tag: "Workshop Special",
        tagIcon: FaStar,
        title: "Masterclass",
        highlight: "Series",
        desc: "Exclusive weekend workshop with celebrity guest instructor. Advance your skills in 2 days.",
        link: "/workshops",
        cta: "Book Seat",
        ctaSub: "Only 10 Spots Left",
        gradient: "from-amber-400 to-orange-500",
        bgGlow1: "bg-amber-600/20",
        bgGlow2: "bg-orange-600/20"
    }
];

export default function PromoBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const currentBanner = banners[currentIndex];

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white p-8 pb-24 md:p-16 border border-neutral-800 shadow-2xl transition-all duration-500">

                    {/* Background Effects - Dynamic based on active slide */}
                    <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-colors duration-1000 ${currentBanner.bgGlow1}`}></div>
                    <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none transition-colors duration-1000 ${currentBanner.bgGlow2}`}></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[200px]">
                        {/* Content */}
                        <div className="flex-1 text-center md:text-left transition-all duration-500 transform key={currentIndex}">
                            <div className="inline-flex items-center gap-2 text-gray-300 font-bold uppercase tracking-widest text-xs mb-4">
                                <currentBanner.tagIcon className="text-white animate-pulse" /> {currentBanner.tag}
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                                {currentBanner.title} <span className={`text-transparent bg-clip-text bg-linear-to-r ${currentBanner.gradient}`}>{currentBanner.highlight}</span>
                            </h2>
                            <p className="text-gray-400 text-lg font-medium max-w-xl leading-relaxed">
                                {currentBanner.desc}
                            </p>
                        </div>

                        {/* Action */}
                        <div className="shrink-0">
                            <Link
                                href={currentBanner.link}
                                className="group flex items-center gap-4 bg-white text-black px-8 py-5 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition-all duration-300"
                            >
                                <span className="flex flex-col text-left leading-none">
                                    <span className="text-xs text-gray-500 font-medium mb-1">{currentBanner.ctaSub}</span>
                                    <span className="text-lg">{currentBanner.cta}</span>
                                </span>
                                <span className={`w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:-rotate-45`}>
                                    <FaArrowRight />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 flex items-center gap-2 z-20">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <FaChevronLeft className="w-3 h-3 text-white" />
                        </button>

                        <div className="flex gap-2 mx-2">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <FaChevronRight className="w-3 h-3 text-white" />
                        </button>
                    </div>

                    {/* Decorative Stroke Text */}
                    <div className="absolute -bottom-6 -right-12 text-9xl font-black text-white/5 uppercase select-none pointer-events-none whitespace-nowrap hidden md:block">
                        LET'S DANCE
                    </div>
                </div>
            </div>
        </section>
    );
}
