import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import GalleryFolder from '@/models/Gallery';

// Ensure data is fresh on every request
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
    await connectDB();
    // Fetch only published folders
    const folders = await GalleryFolder.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

    const getCoverImage = (folder: any) => {
        if (folder.coverImage?.imageUrl) {
            return folder.coverImage.imageUrl;
        }
        // Use first image as cover if no cover image is set
        return folder.images[0]?.imageUrl || '/placeholder.jpg';
    };

    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                {/* Header Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                                Gallery <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Albums</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl font-medium leading-relaxed mb-4">
                                Captured memories from our studio, stage performances, and workshop sessions. Experience the energy of Let's Dance Academy through our photo collections.
                            </p>
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                                {folders.length} Album{folders.length !== 1 ? 's' : ''} Available
                            </p>
                        </div>

                        {folders.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {folders.map((folder: any, i: number) => (
                                    <Link
                                        href={`/gallery/${folder._id.toString()}`}
                                        key={folder._id.toString()}
                                        className="group border border-gray-200 hover:border-blue-600 transition-colors bg-gray-50 flex flex-col h-full cursor-pointer"
                                    >
                                        <div className="relative h-72 overflow-hidden bg-gray-200">
                                            {folder.images.length > 0 && (
                                                <Image
                                                    src={getCoverImage(folder)}
                                                    alt={folder.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                        </div>

                                        <div className="p-8 flex flex-col grow">
                                            <span className="text-xs font-mono text-gray-400 mb-2 block font-bold">0{i + 1}</span>
                                            <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-blue-600 transition-colors">{folder.title}</h3>

                                            {folder.description && (
                                                <p className="text-gray-600 text-sm mb-0 leading-relaxed font-medium grow line-clamp-3">
                                                    {folder.description}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400 font-mono">
                                <p className="text-xl">Gallery is getting ready for the spotlight.</p>
                                <p className="text-sm mt-2">Check back soon for our latest updates.</p>
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
