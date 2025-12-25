
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function BatchesPage() {
    const batches = [
        { title: 'Hip Hop', level: 'Beginner • Intermediate', desc: 'Master the art of hip hop with our expert instructors. Focus on groove, musicality, and performance.', image: '/batches.png' },
        { title: 'Contemporary', level: 'All Levels', desc: 'Express yourself through fluid movements and emotional storytelling.', image: '/batches.png' }, // Using placeholder images for now as I don't have separate ones
        { title: 'Jazz Funk', level: 'Intermediate', desc: 'A high-energy fusion of jazz and hip hop. sassy and powerful.', image: '/batches.png' },
        { title: 'Salsa', level: 'Beginner', desc: 'Learn the basics of this spicy Latin dance form. Partner work and footwork.', image: '/batches.png' },
        { title: 'Ballet', level: 'Beginner • Advanced', desc: 'Build strength, grace, and discipline with classical ballet techniques.', image: '/batches.png' },
        { title: 'K-Pop', level: 'All Levels', desc: 'Learn the trending choreographies from your favorite K-Pop idols.', image: '/batches.png' }
    ];

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Batches</h1>
                            <p className="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed mb-4">
                                Choose from a variety of dance styles tailored to different skill levels. Whether you are stepping on the floor for the first time or looking to refine your technique, we have a class for you.
                            </p>
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                Available at: Sambhaji Nagar & Balaji Nagar Branches
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {batches.map((batch, i) => (
                                <Link href={`/batches/${batch.title.toLowerCase().replace(/ /g, '-')}`} key={batch.title} className="group border border-gray-200 hover:border-blue-600 transition-colors bg-gray-50 flex flex-col h-full cursor-pointer">
                                    <div className="relative h-64 overflow-hidden bg-gray-200">
                                        {/* Ideally specific images for each batch, re-using gen image for now */}
                                        <Image src={batch.image} alt={batch.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    </div>

                                    <div className="p-8 flex flex-col grow">
                                        <span className="text-xs font-mono text-gray-400 mb-2 block font-bold">0{i + 1}</span>
                                        <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-blue-600 transition-colors">{batch.title}</h3>
                                        <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium grow">
                                            {batch.desc}
                                        </p>

                                        <div className="border-t border-gray-200 pt-6 mt-auto">
                                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black mb-4">
                                                <span>{batch.level}</span>
                                            </div>
                                            <button className="w-full bg-transparent border-2 border-black text-black py-3 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
