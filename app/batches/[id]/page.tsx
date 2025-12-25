
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import CourseContent from '@/components/CourseContent';
import BatchEnrollment from '@/components/BatchEnrollment';

// Update type definition to support Sections inside Syllabus
type SyllabusTopic = {
    title: string;
    sections: string[];
};

const batchData: Record<string, any> = {
    'hip-hop': {
        title: 'Hip Hop Fundamentals',
        instructor: 'Alex D.',
        level: 'Beginner',
        schedule: 'Mon, Wed, Fri - 6:00 PM',
        price: '$120/month',
        desc: 'Dive into the world of Hip Hop. This course covers the history, grooves, and foundational moves that every dancer needs. We focus on musicality, texture, and performance.',
        syllabus: [
            {
                title: 'Week 1: Bounce & Rock',
                sections: ['Understanding the beat', 'The 2-step groove', 'Upper body coordination']
            },
            {
                title: 'Week 2: Isolations & Body Control',
                sections: ['Neck & Head isolations', 'Chest pops', 'Hip mechanics']
            },
            {
                title: 'Week 3: Footwork Basics',
                sections: ['The Bart Simpson', 'Reebok', 'Sponge Bob']
            },
            {
                title: 'Week 4: Routine Choreography',
                sections: ['Learning the set', 'Performance texture', 'Formation changes']
            }
        ],
        videoPreview: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
};

export default async function BatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Default to Hip Hop data if ID not found for demo purposes
    const data = batchData[id] || batchData['hip-hop'];
    const title = id.replace(/-/g, ' ').toUpperCase();

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="bg-neutral-900 text-white py-20">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Link href="/batches" className="text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-white mb-6 block">← Back to Batches</Link>
                            <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">{data.level}</span>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none">{data.title || title}</h1>
                            <p className="text-xl text-gray-300 max-w-xl font-medium leading-relaxed mb-8">
                                {data.desc}
                            </p>
                            <div className="flex flex-col gap-4">
                                <BatchEnrollment price={data.price} />
                                <button className="border-2 border-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors w-full">
                                    Watch Preview
                                </button>
                            </div>
                        </div>
                        <div className="relative aspect-video border border-white/20 bg-neutral-800">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`${data.videoPreview}?rel=0&modestbranding=1&iv_load_policy=3`}
                                title="YouTube video player"
                                className="absolute inset-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            {/* Passing isPurchased={false} to demonstrate the locked state. 
                        In a real app, this would come from a user session/DB check. */}
                            <CourseContent
                                syllabus={data.syllabus}
                                isPurchased={false}
                                notifications={[
                                    { id: 1, title: 'Class Rescheduled', message: 'The session for Module 1 has been moved to Friday 6 PM.', date: '2 days ago', type: 'info' },
                                    { id: 2, title: 'New Material Added', message: 'Bonus choreography video is now available in Module 2.', date: '1 day ago', type: 'success' }
                                ]}
                                reviews={[
                                    { id: 1, user: 'Sarah M.', rating: 5, comment: 'Absolutely loved this course! The breakdown of steps was so clear.', date: 'Oct 10, 2025' },
                                    { id: 2, user: 'Mike T.', rating: 4, comment: 'Great energy, learned a lot about texture.', date: 'Oct 15, 2025' }
                                ]}
                            />
                        </div>

                        <div className="border border-gray-200 p-8 h-fit bg-gray-50">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Class Details</h3>
                            <ul className="space-y-6 text-sm font-medium">
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Instructor</span>
                                    <span className="font-bold">{data.instructor}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Schedule</span>
                                    <span className="font-bold text-right max-w-[150px]">{data.schedule}</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Duration</span>
                                    <span className="font-bold">4 Weeks</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500 uppercase tracking-wide">Location</span>
                                    <span className="font-bold">Select Branch</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div >
    );
}
