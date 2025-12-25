import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[150px] animate-pulse delay-1000"></div>
                </div>

                <div className="text-center relative z-10 px-6">
                    <h1 className="text-[150px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-gray-900 to-gray-200 select-none">
                        404
                    </h1>
                    <div className="transform -translate-y-10 md:-translate-y-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
                            Off Beat
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6">
                            Lost in the Rhythm?
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mx-auto mb-10 leading-relaxed">
                            The page you are looking for seems to have danced off stage. Let's get you back to the groove.
                        </p>
                        <Link href="/" className="inline-block bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30 rounded-none border-2 border-transparent">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
