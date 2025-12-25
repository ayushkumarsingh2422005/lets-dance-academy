
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function WorkshopsPage() {
    const workshops = [
        { title: "Urban Choreography", date: "Oct 24", time: "5 PM - 8 PM", instructor: "Alex D.", image: "/workshop.png" },
        { title: "Heels Intensive", date: "Oct 26", time: "11 AM - 2 PM", instructor: "Sarah J.", image: "/workshop.png" },
        { title: "Afro Fusion", date: "Nov 02", time: "6 PM - 9 PM", instructor: "Mike T.", image: "/workshop.png" },
        { title: "Contemporary Flow", date: "Nov 15", time: "4 PM - 7 PM", instructor: "Emily R.", image: "/workshop.png" },
        { title: "Hip Hop Foundations", date: "Nov 22", time: "1 PM - 4 PM", instructor: "Chris B.", image: "/workshop.png" }
    ];

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
                        <div className="grid grid-cols-1 gap-8">
                            {workshops.map((ws, i) => (
                                <Link href={`/workshops/${ws.title.toLowerCase().replace(/ /g, '-')}`} key={i} className="flex flex-col md:flex-row border border-gray-200 hover:border-blue-600 transition-colors group bg-white hover:shadow-xl duration-300 cursor-pointer">
                                    {/* Date Box */}
                                    <div className="bg-gray-100 p-8 md:w-48 flex flex-col justify-center items-center text-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <span className="block text-5xl font-black leading-none mb-2">{ws.date.split(' ')[1]}</span>
                                        <span className="text-sm uppercase font-bold tracking-widest">{ws.date.split(' ')[0]}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-3xl font-black uppercase mb-2 group-hover:text-blue-600 transition-colors">{ws.title}</h3>
                                            <p className="text-gray-600 font-bold text-sm mb-4 md:mb-0">
                                                Instructor: <span className="text-black">{ws.instructor}</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-4 min-w-[200px]">
                                            <div className="flex items-center gap-2 text-gray-500 font-mono text-sm font-bold">
                                                <span>🕒</span>
                                                <span>{ws.time}</span>
                                            </div>
                                            <button className="bg-black text-white px-8 py-3 text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-colors w-full md:w-auto">
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
