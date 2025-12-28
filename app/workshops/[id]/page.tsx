import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import WorkshopContent from '@/components/WorkshopContent';
import WorkshopEnrollment from '@/components/WorkshopEnrollment';
import connectDB from '@/lib/db';
import Workshop from '@/models/Workshop';
import User from '@/models/User';
import { notFound } from 'next/navigation';

export default async function WorkshopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();

    let workshop = null;
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            workshop = await Workshop.findOne({ _id: id, status: 'published' }).populate({ path: 'reviews.user', model: User, select: 'name profilePicture' });
        }
        if (!workshop) {
            workshop = await Workshop.findOne({ slug: id, status: 'published' }).populate({ path: 'reviews.user', model: User, select: 'name profilePicture' });
        }
    } catch (e) {
        console.error("Workshop fetch error", e);
    }

    if (!workshop) {
        return notFound();
    }

    // Transform lessons for WorkshopContent component (chapters format)
    const chapters = workshop.lessons?.map((lesson: any) => ({
        title: lesson.title,
        description: lesson.description || 'Workshop lesson content'
    })) || [];

    const reviews = workshop.reviews?.map((r: any, i: number) => ({
        id: r._id ? r._id.toString() : i.toString(),
        userId: r.user?._id ? r.user._id.toString() : (r.user ? r.user.toString() : ''),
        user: r.user?.name || r.userName || 'User',
        userImage: r.user?.profilePicture || '',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toLocaleDateString()
    })) || [];

    const notifications = workshop.notifications?.map((n: any, i: number) => ({
        id: n._id ? n._id.toString() : i.toString(),
        title: n.title,
        message: n.message,
        date: new Date(n.date).toLocaleDateString(),
        type: n.type
    })) || [];

    const embedUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('embed/')) return url;
        if (url.includes('watch?v=')) return `https://www.youtube.com/embed/${url.split('watch?v=')[1].split('&')[0]}`;
        if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
        return url;
    };

    const priceDisplay = workshop.price === 0 ? 'Free' : `₹${workshop.price}`;

    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <Header />
            <main className="pt-20">
                <section className="bg-blue-600 text-white py-24 relative overflow-hidden">
                    {/* Pattern */}
                    <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                        <div className="w-96 h-96 border-8 border-white rounded-full absolute -top-10 -right-10"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <Link href="/workshops" className="text-blue-200 text-sm font-bold uppercase tracking-widest hover:text-white mb-6 block">← Back to Workshops</Link>
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div>
                                <span className="bg-white text-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">{workshop.level}</span>
                                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">{workshop.title}</h1>
                                {workshop.schedule && (
                                    <p className="text-2xl text-blue-100 font-bold max-w-2xl">
                                        {workshop.schedule}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <p className="text-lg text-gray-600 leading-relaxed mb-12 border-b border-gray-100 pb-8">
                                {workshop.description}
                            </p>

                            <WorkshopContent
                                workshopId={workshop._id.toString()}
                                chapters={chapters}
                                isPurchased={false}
                                notifications={notifications}
                                reviews={reviews}
                            />

                            <div className="bg-gray-50 border border-gray-200 p-8 flex items-center justify-between mt-12">
                                <div>
                                    <span className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Registration Status</span>
                                    <span className="text-2xl font-black text-green-600 uppercase">Open</span>
                                </div>
                                <div className="flex-1 ml-8">
                                    <WorkshopEnrollment
                                        workshopId={workshop._id.toString()}
                                        price={priceDisplay}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            {/* Instructor Card */}
                            <div className="border border-gray-200 p-0 overflow-hidden mb-6">
                                <div className="bg-gray-100 h-64 relative">
                                    {workshop.instructorImage ? (
                                        <Image
                                            src={workshop.instructorImage}
                                            alt={workshop.instructor}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase">Instructor Image</div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">Instructor</span>
                                    <h3 className="text-2xl font-black uppercase mb-2">{workshop.instructor}</h3>
                                    {workshop.instructorBio && (
                                        <p className="text-gray-600 text-sm mb-6">{workshop.instructorBio}</p>
                                    )}
                                </div>
                            </div>

                            {/* Workshop Details */}
                            <div className="border border-gray-200 p-6 bg-gray-50">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Workshop Details</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-wide">Duration</span>
                                        <span className="font-bold">{workshop.duration}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-wide">Price</span>
                                        <span className="font-bold">{priceDisplay}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-wide">Lessons</span>
                                        <span className="font-bold">{workshop.lessons?.length || 0}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Video Preview */}
                            {workshop.videoPreview && (
                                <div className="border border-gray-200 mt-6 overflow-hidden">
                                    <div className="bg-gray-100 p-4 border-b border-gray-200">
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Preview</h3>
                                    </div>
                                    <div className="relative aspect-video bg-black">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`${embedUrl(workshop.videoPreview)}?rel=0&modestbranding=1`}
                                            title={workshop.title}
                                            className="absolute inset-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
