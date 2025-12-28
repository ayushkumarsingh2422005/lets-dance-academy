import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
import Workshop from '@/models/Workshop';

// Ensure data is fresh on every request
export const dynamic = 'force-dynamic';

export default async function WorkshopsPage() {
    await connectDB();
    // Fetch only published workshops
    const workshops = await Workshop.find({ status: 'published' }).sort({ createdAt: -1 });

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="py-24 bg-blue-600 text-white min-h-[50vh] flex items-center relative overflow-hidden">
                    {/* Abstract Pattern overlay */}
                    <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
                        <div className="w-64 h-64 border-8 border-white rounded-full"></div>
                        <div className="w-96 h-96 border-8 border-white rounded-full absolute -top-10 -right-10"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">Upcoming <br />Workshops</h1>
                        <p className="text-xl text-blue-100 max-w-2xl font-medium leading-relaxed">
                            Intensive sessions with world-class choreographers. Level up your skills in just a few hours.
                        </p>
                    </div>
                </section>

                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {workshops.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8">
                                {workshops.map((workshop: any) => {
                                    const priceDisplay = workshop.price === 0 ? 'Free' : `₹${workshop.price}`;

                                    return (
                                        <Link
                                            href={`/workshops/${workshop._id}`}
                                            key={workshop._id}
                                            className="flex flex-col md:flex-row border border-gray-200 hover:border-blue-600 transition-colors group bg-white hover:shadow-xl duration-300 cursor-pointer overflow-hidden"
                                        >
                                            {/* Image/Instructor Box */}
                                            <div className="bg-gray-100 md:w-64 flex flex-col justify-center items-center text-center group-hover:bg-blue-600 transition-colors relative overflow-hidden">
                                                {workshop.instructorImage ? (
                                                    <div className="relative w-full h-64 md:h-full">
                                                        <Image
                                                            src={workshop.instructorImage}
                                                            alt={workshop.instructor}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                                            <p className="text-xs font-bold uppercase tracking-widest mb-1">Instructor</p>
                                                            <p className="text-lg font-black uppercase">{workshop.instructor}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-8 w-full h-64 md:h-full flex flex-col justify-center items-center group-hover:text-white transition-colors">
                                                        <p className="text-xs font-bold uppercase tracking-widest mb-2">Instructor</p>
                                                        <p className="text-2xl font-black uppercase">{workshop.instructor}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 grow flex flex-col justify-between gap-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
                                                            {workshop.level}
                                                        </span>
                                                        <span className="text-gray-500 text-sm font-bold">
                                                            {workshop.duration}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-3xl md:text-4xl font-black uppercase mb-3 group-hover:text-blue-600 transition-colors">
                                                        {workshop.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                        {workshop.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-gray-200 pt-6">
                                                    <div className="flex items-center gap-6">
                                                        {workshop.schedule && (
                                                            <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                                                <span>🕒</span>
                                                                <span>{workshop.schedule}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                                                            <span>💰</span>
                                                            <span>{priceDisplay}</span>
                                                        </div>
                                                    </div>
                                                    <button className="bg-black text-white px-8 py-3 text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-colors w-full md:w-auto">
                                                        View Details →
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400">
                                <p className="text-xl font-bold uppercase">No workshops available at the moment.</p>
                                <p className="text-sm mt-2">Please check back soon for upcoming workshops.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
