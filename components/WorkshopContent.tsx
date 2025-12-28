
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Chapter = {
    title: string;
    description: string;
};

type Notification = {
    id: number | string;
    title: string;
    message: string;
    date: string;
    type: 'info' | 'alert' | 'success';
};

type Review = {
    id: number | string;
    userId?: string;
    user: string;
    userImage?: string;
    rating: number;
    comment: string;
    date: string;
};

interface WorkshopContentProps {
    workshopId?: string;
    chapters: Chapter[];
    isPurchased?: boolean;
    notifications?: Notification[];
    reviews?: Review[];
}

export default function WorkshopContent({ workshopId, chapters, isPurchased = false, notifications = [], reviews = [] }: WorkshopContentProps) {
    const { token, user } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'content' | 'notifications' | 'reviews'>('content');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Review State
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState<string | number | null>(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    // Authorization State
    const [isUserPurchased, setIsUserPurchased] = useState(isPurchased);

    useEffect(() => {
        const checkEnrollment = async () => {
            if (!token || !workshopId) return;
            try {
                const res = await fetch(`/api/workshops/${workshopId}/enrollment`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.enrolled) {
                    setIsUserPurchased(true);
                }
            } catch (e) {
                console.error("Auth check failed", e);
            }
        };
        checkEnrollment();
    }, [token, workshopId]);

    // Mock video URL
    const demoVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&iv_load_policy=3";

    const handlePlayClick = () => {
        if (!isUserPurchased) {
            alert("Please register for this workshop to access the content.");
            return;
        }
        setSelectedVideo(demoVideoUrl);
    };

    const handleEditReview = (review: Review) => {
        setReviewForm({ rating: review.rating, comment: review.comment });
        setEditingReviewId(review.id);
        setIsWritingReview(true);
        setIsEditing(true);
    };

    const handleCancelReview = () => {
        setIsWritingReview(false);
        setIsEditing(false);
        setEditingReviewId(null);
        setReviewForm({ rating: 5, comment: '' });
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert("Please login to submit a review.");
            return;
        }
        if (!workshopId) return;

        setSubmittingReview(true);
        try {
            const method = isEditing ? 'PATCH' : 'POST';
            const body = isEditing ? { ...reviewForm, reviewId: editingReviewId } : reviewForm;

            const res = await fetch(`/api/workshops/${workshopId}/reviews`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.success) {
                alert(isEditing ? "Review updated successfully!" : "Review submitted successfully!");
                handleCancelReview();
                router.refresh();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
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
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 w-fit">Workshop Chapters</h2>
                    {chapters.map((chapter, i) => (
                        <div key={i} className="border border-gray-200 bg-gray-50 flex justify-between items-center p-6 group hover:border-black transition-colors">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1 block">Chapter 0{i + 1}</span>
                                <h3 className="text-lg font-bold uppercase mb-2">{chapter.title}</h3>
                                <p className="text-sm text-gray-600">{chapter.description}</p>
                            </div>
                            <button
                                onClick={handlePlayClick}
                                className={`ml-4 flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wide border transition-all shrink-0 ${isUserPurchased
                                    ? 'border-black text-black hover:bg-black hover:text-white shadow-sm'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed bg-white'
                                    }`}
                            >
                                {isUserPurchased ? (
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

                    {!isUserPurchased ? (
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

                        {!isWritingReview && (
                            <button
                                onClick={() => setIsWritingReview(true)}
                                className="text-sm font-bold text-blue-600 hover:text-black transition-colors uppercase tracking-widest border-b-2 border-blue-600 hover:border-black pb-1"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {isWritingReview && (
                        <div className="bg-gray-50 border border-gray-200 p-8 mb-8 animate-in slide-in-from-top-4 duration-300">
                            <h3 className="font-bold uppercase mb-4">{isEditing ? 'Update Review' : 'Leave your feedback'}</h3>
                            <form onSubmit={submitReview} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                                className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Comment</label>
                                    <textarea
                                        className="w-full border p-3 text-sm focus:outline-none focus:border-black"
                                        rows={4}
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                                        placeholder="Share your experience..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="bg-black text-white px-6 py-3 font-bold uppercase text-xs tracking-wide hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {submittingReview ? 'Saving...' : (isEditing ? 'Update Review' : 'Submit Review')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancelReview}
                                        className="text-gray-500 font-bold uppercase text-xs tracking-wide hover:text-black"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <div key={review.id} className={`border p-8 transition-colors ${review.userId === user?.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-blue-600'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        {/* User Image */}
                                        {review.userImage ? (
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                                <img src={review.userImage} alt={review.user} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 uppercase">
                                                {review.user?.charAt(0) || 'U'}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm uppercase">{review.user || 'Unknown User'}</h4>
                                                {review.userId === user?.id && <button onClick={() => handleEditReview(review)} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase hover:bg-blue-200 transition-colors">Edit</button>}
                                            </div>
                                            <div className="flex text-yellow-500 text-xs mt-1">
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
                        )) : (
                            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                        )}
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
