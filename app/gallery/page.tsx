import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    await connectDB();
    const galleryImages = await Gallery.find({}).sort({ createdAt: -1 });

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                {/* Header Section */}
                <section className="bg-white pt-24 pb-12 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <span className="text-blue-600 font-bold tracking-widest uppercase mb-4 block">Our Moments</span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">
                            Life in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Motion</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                            Captured memories from our studio, stage performances, and workshop sessions. Experience the energy of Let's Dance Academy.
                        </p>
                    </div>
                </section>

                {/* Masonry Gallery */}
                <section className="pb-24 px-6 bg-white min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {galleryImages.length > 0 ? (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {galleryImages.map((img: any) => (
                                    <div
                                        key={img._id}
                                        className="break-inside-avoid relative group overflow-hidden bg-gray-100 border border-transparent hover:border-blue-600 transition-all duration-300 rounded-lg"
                                    >
                                        <Image
                                            src={img.imageUrl}
                                            alt={img.title || 'Gallery Image'}
                                            width={img.width}
                                            height={img.height}
                                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                            {img.title && (
                                                <h3 className="text-white text-2xl font-black uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    {img.title}
                                                </h3>
                                            )}
                                            <div className="w-12 h-1 bg-blue-600 mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                <p className="text-xl text-gray-400 font-medium">Gallery is getting ready for the spotlight.</p>
                                <p className="text-sm text-gray-400 mt-2">Check back soon for our latest updates.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-black text-white text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Be Part of the Frame</h2>
                        <p className="text-xl text-gray-400 mb-12">Join our classes and start creating your own memories.</p>
                        <div className="flex justify-center gap-4">
                            <a href="/register" className="bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">
                                Join Now
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
