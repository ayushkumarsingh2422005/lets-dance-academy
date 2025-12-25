
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import PromoBanner from '@/components/PromoBanner';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
      <Header />

      <main>
        {/* HERO SECTION - Imporved with Split Layout */}
        <section className="relative min-h-screen pt-20 grid grid-cols-1 md:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col justify-center px-6 md:pl-20 py-20 bg-white z-10">
            <span className="inline-block text-blue-600 font-bold tracking-widest uppercase mb-4 text-sm">Welcome to the movement</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.9] text-black">
              Let's <br />
              Dance <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">Academy</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-md mb-12 font-medium leading-relaxed">
              Join the premier dance academy where passion meets precision. Regular batches and exclusive workshops for every mover.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/batches" className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors border-2 border-transparent text-center">
                Explore Batches
              </Link>
              <Link href="/workshops" className="bg-transparent text-black border-2 border-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors text-center">
                View Workshops
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[50vh] md:h-auto bg-gray-100 overflow-hidden">
            <Image
              src="/hero.png"
              alt="Dance Class"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent md:hidden"></div>
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent md:hidden"></div>
          </div>
        </section>

        <PromoBanner />

        {/* BENTO GRID SECTION - Short preview still good on home */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">Why Choose Us</h2>
              <div className="h-1 w-20 bg-blue-600"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1200px] md:h-[600px]">
              {/* Feature 1 - Regular Batches */}
              <div className="col-span-1 md:col-span-2 md:row-span-2 group relative border border-gray-200 bg-white overflow-hidden">
                <Link href="/batches" className="block w-full h-full relative">
                  <Image src="/batches.png" alt="Regular Batches" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full z-10 text-white">
                    <h3 className="text-3xl font-black uppercase mb-2">Regular Batches</h3>
                    <p className="text-gray-200 text-sm mb-6 font-medium">Consistent weekly classes designed to build your foundation.</p>
                    <span className="inline-block border-b-2 border-white pb-1 text-xs font-bold uppercase tracking-widest group-hover:border-blue-400 group-hover:text-blue-400 transition-colors">Explore All Batches</span>
                  </div>
                </Link>
              </div>

              {/* Feature 2 - Workshops */}
              <div className="col-span-1 md:col-span-2 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Link href="/workshops" className="block w-full h-full relative">
                  <Image src="/workshop.png" alt="Workshops" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 p-8 z-10 text-white">
                    <h3 className="text-2xl font-black uppercase mb-2">Exclusive Workshops</h3>
                    <p className="text-gray-200 text-sm font-medium">Intensive weekend sessions.</p>
                  </div>
                </Link>
              </div>

              {/* Feature 3 - Private */}
              <div className="col-span-1 md:col-span-1 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Image src="/private.png" alt="Private Classes" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6 z-10 text-white">
                  <h3 className="text-xl font-black uppercase mb-1">Private Classes</h3>
                  <p className="text-gray-300 text-xs font-bold">1-on-1 Attention</p>
                </div>
              </div>

              {/* Feature 4 - Showcase */}
              <div className="col-span-1 md:col-span-1 md:row-span-1 group relative border border-gray-200 bg-white overflow-hidden">
                <Image src="/showcase.png" alt="Showcase" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6 z-10 text-white">
                  <h3 className="text-xl font-black uppercase mb-1">Showcase</h3>
                  <p className="text-gray-300 text-xs font-bold">Stage Performance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Removed Detailed Batches and Workshops sections from Home as they now have their own pages. 
            Kept Bento grid as a navigation/preview element. */}

        <Achievements />



        <section className="py-24 bg-black text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Ready to Start?</h2>
            <p className="text-xl text-gray-400 mb-12">Don't wait for the perfect moment. Take the moment and make it perfect.</p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors rounded-none">
                Book a Free Trial
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
