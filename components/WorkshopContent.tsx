
"use client";
import { useState } from 'react';

type Chapter = {
    title: string;
    description: string;
};

type Notification = {
    id: number;
    title: string;
    message: string;
    date: string;
    type: 'info' | 'alert' | 'success';
};

type Review = {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
};

export default function WorkshopContent({ chapters, isPurchased = false, notifications = [], reviews = [] }: { chapters: Chapter[], isPurchased?: boolean, notifications?: Notification[], reviews?: Review[] }) {
    const [activeTab, setActiveTab] = useState<'content' | 'notifications' | 'reviews'>('content');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Mock video URL
    const demoVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&iv_load_policy=3";

    const handlePlayClick = () => {
        if (!isPurchased) {
            alert("Please register for this workshop to access the content.");
            return;
        }
        setSelectedVideo(demoVideoUrl);
    };

    return (
        <div className="bg-white">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'content' ? 'border-blue-600 text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                    Workshop Content
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'notifications' ? 'border-blue-600 text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                    Announcements {notifications.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full ml-1 align-top">{notifications.length}</span>}
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-blue-600 text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                >
                    Reviews ({reviews.length})
                </button>
            </div>

            {/* TAB: CONTENT (Chapters) */}
            {activeTab === 'content' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600 w-fit">Workshop Chapters</h2>
                    {chapters.map((chapter, i) => (
                        <div key={i} className="border border-gray-200 bg-gray-50 flex justify-between items-center p-6 group hover:border-black transition-colors">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 block">Chapter 0{i + 1}</span>
                                <h3 className="text-lg font-bold uppercase mb-2">{chapter.title}</h3>
                                <p className="text-sm text-gray-600">{chapter.description}</p>
                            </div>
                            <button
                                onClick={handlePlayClick}
                                className={`ml-4 flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wide border transition-all shrink-0 ${isPurchased
                                        ? 'border-black text-black hover:bg-black hover:text-white shadow-sm'
                                        : 'border-gray-200 text-gray-400 cursor-not-allowed bg-white'
                                    }`}
                            >
                                {isPurchased ? (
                                    <>
                                        <span>Play</span>
                                        <span>▶</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Locked</span>
                                        <span>🔒</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Workshop Updates</h2>

                    {!isPurchased ? (
                        <div className="border border-gray-200 p-12 text-center bg-gray-50">
                            <span className="text-4xl mb-4 block">🔒</span>
                            <h3 className="text-xl font-bold uppercase mb-2">Restricted Content</h3>
                            <p className="text-gray-600 mb-6 font-medium">Register for this workshop to view announcements.</p>
                            <button className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                                Register Now
                            </button>
                        </div>
                    ) : (
                        <>
                            {notifications.length === 0 ? (
                                <p className="text-gray-500 italic">No new announcements.</p>
                            ) : (
                                <div className="border border-gray-200">
                                    {notifications.map((note) => (
                                        <div key={note.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex gap-6 items-start">
                                            <div className={`p-3 rounded-full shrink-0 ${note.type === 'alert' ? 'bg-red-100 text-red-600' : note.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {note.type === 'alert' ? '⚠️' : note.type === 'success' ? '✓' : 'ℹ️'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold uppercase text-base">{note.title}</h3>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{note.date}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{note.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Attendee Reviews</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border border-gray-200 p-8 bg-gray-50 hover:border-blue-600 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm uppercase">{review.user}</h4>
                                            <div className="flex text-yellow-500 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{review.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Restricted Video Player Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-4xl bg-black border border-white/20 shadow-2xl">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-12 right-0 text-white hover:text-blue-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2"
                        >
                            Close [X]
                        </button>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={selectedVideo}
                                title="Use Video Player"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
