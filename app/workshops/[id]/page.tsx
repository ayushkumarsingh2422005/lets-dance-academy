import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

import WorkshopContent from '@/components/WorkshopContent';

export default async function WorkshopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const title = id.replace(/-/g, ' ').toUpperCase();

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
                                <span className="bg-white text-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">Upcoming Workshop</span>
                                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">{title}</h1>
                                <p className="text-2xl text-blue-100 font-bold max-w-2xl">
                                    October 24, 2025 • 5:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <p className="text-lg text-gray-600 leading-relaxed mb-12 border-b border-gray-100 pb-8">
                                Join us for an intensive 3-hour session where we break down the mechanics of movement.
                                This workshop is designed to push your limits and expand your vocabulary.
                            </p>

                            <WorkshopContent
                                chapters={[
                                    { title: 'Part 1: The Warm Up', description: 'Conditioning and isolation drills to prepare the body.' },
                                    { title: 'Part 2: Technique Breakdown', description: 'Detailed study of texture, musicality, and control.' },
                                    { title: 'Part 3: Choreography', description: 'Learning and performing a custom piece.' }
                                ]}
                                isPurchased={false}
                                notifications={[
                                    { id: 1, title: 'Location Update', message: 'Workshop will be held in Hall B due to high capacity.', date: '1 day ago', type: 'info' }
                                ]}
                                reviews={[
                                    { id: 1, user: 'Jamie L.', rating: 5, comment: 'Intense but amazing!', date: 'Oct 25, 2024' }
                                ]}
                            />

                            <div className="bg-gray-50 border border-gray-200 p-8 flex items-center justify-between mt-12">
                                <div>
                                    <span className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Registration Status</span>
                                    <span className="text-2xl font-black text-green-600 uppercase">Open</span>
                                </div>
                                <Link href="/dashboard" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                                    Register Now - $45
                                </Link>
                            </div>
                        </div>

                        <div>
                            <div className="border border-gray-200 p-0 overflow-hidden">
                                <div className="bg-gray-100 h-64 relative">
                                    {/* Placeholder for instructor image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase">Instructor Image</div>
                                </div>
                                <div className="p-8">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 block">Instructor</span>
                                    <h3 className="text-2xl font-black uppercase mb-2">Alex D.</h3>
                                    <p className="text-gray-600 text-sm mb-6">World-renowned choreographer known for his unique fusion of styles.</p>
                                    <Link href="/instructors" className="text-sm font-bold underline hover:text-blue-600">View Full Profile</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
