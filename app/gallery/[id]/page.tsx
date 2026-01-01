import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import GalleryFolder from '@/models/Gallery';
import { FaArrowLeft } from 'react-icons/fa6';

export const dynamic = 'force-dynamic';

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectDB();

    const folder = await GalleryFolder.findById(id).lean();

    if (!folder || !folder.isPublished) {
        return (
            <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
                <Header />
                <main className="pt-20 min-h-[60vh] flex items-center justify-center">
                    <div className="text-center px-6">
                        <h1 className="text-4xl font-black uppercase mb-4">Album Not Found</h1>
                        <p className="text-gray-600 mb-8">This album doesn't exist or is no longer available.</p>
                        <Link href="/gallery" className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors inline-block">
                            Back to Gallery
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Back Button */}
                        <Link
                            href="/gallery"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold mb-8 transition-colors text-sm uppercase tracking-widest"
                        >
                            <FaArrowLeft /> Back to Albums
                        </Link>

                        {/* Album Header */}
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                                {folder.title}
                            </h1>
                            {folder.description && (
                                <p className="text-xl text-gray-600 max-w-3xl font-medium leading-relaxed mb-4">
                                    {folder.description}
                                </p>
                            )}
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                {folder.images.length} Photo{folder.images.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Masonry Image Grid */}
                        {folder.images.length > 0 ? (
                            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                {folder.images.map((img: any) => (
                                    <div
                                        key={img._id.toString()}
                                        className="break-inside-avoid relative group overflow-hidden bg-gray-100 border border-gray-200 hover:border-blue-600 transition-all duration-300"
                                    >
                                        <Image
                                            src={img.imageUrl}
                                            alt={img.caption || 'Gallery Image'}
                                            width={img.width}
                                            height={img.height}
                                            className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Overlay with caption */}
                                        {img.caption && (
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                <p className="text-white font-bold text-sm leading-relaxed">{img.caption}</p>
                                            </div>
                                        )}

                                        {/* Subtle overlay */}
                                        <div className="absolute inset-0 bg-black/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400 font-mono">
                                <p className="text-xl">This album is empty.</p>
                                <p className="text-sm mt-2">Photos will be added soon.</p>
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
                            <Link href="/register" className="bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors">
                                Join Now
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
