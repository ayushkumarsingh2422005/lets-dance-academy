
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function InstructorsPage() {
    const instructors = [
        { name: 'Alex D.', role: 'Hip Hop & Urban', bio: 'Alex has over 10 years of experience in the urban dance scene, touring with major artists.', image: '/batches.png' }, // Placeholder image
        { name: 'Sarah J.', role: 'Contemporary & Jazz', bio: 'Former principal dancer at the National Ballet. Sarah brings grace and technical precision.', image: '/batches.png' },
        { name: 'Mike T.', role: 'Afro & Dancehall', bio: 'Mike brings the authentic energy of Afro beats straight from the source.', image: '/batches.png' },
        { name: 'Emily R.', role: 'Ballet', bio: 'Emily focuses on building strong foundations and discipline in young dancers.', image: '/batches.png' },
        { name: 'Chris B.', role: 'Breakin\' (B-Boy)', bio: 'Chris is a competition winner who teaches power moves and style.', image: '/batches.png' },
        { name: 'Jessica K.', role: 'K-Pop Cover', bio: 'Jessica specializes in the latest K-Pop choreographies and performance techniques.', image: '/batches.png' }
    ];

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Instructors</h1>
                            <p className="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
                                Learn from the best. Our diverse team of professional instructors is dedicated to helping you reach your full potential.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {instructors.map((inst, i) => (
                                <div key={i} className="group border border-gray-200 hover:border-blue-600 transition-colors bg-gray-50 flex flex-col h-full">
                                    <div className="relative h-96 overflow-hidden bg-gray-200 grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <Image src={inst.image} alt={inst.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow bg-white border-t border-gray-100">
                                        <h3 className="text-2xl font-black uppercase mb-1 group-hover:text-blue-600 transition-colors">{inst.name}</h3>
                                        <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">{inst.role}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {inst.bio}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
