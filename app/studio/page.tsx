
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Achievements from '@/components/Achievements';
import Link from 'next/link';
import Image from 'next/image';

import { FaInstagram, FaYoutube, FaEnvelope, FaPhone } from 'react-icons/fa6';

export default function StudioPage() {
    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-20">
                {/* Intro Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">The Studio</h1>
                                <p className="text-xl text-gray-600 font-medium leading-relaxed mb-6">
                                    A space designed for creativity and movement. Our state-of-the-art facility provides the perfect environment for dancers of all levels to train, rehearse, and create.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    Located in the heart of the Art District, we offer over 5000 sq. ft. of professional dance floors, high-quality impact sound systems, and a welcoming community atmosphere.
                                </p>
                                <ul className="space-y-4 font-bold text-sm uppercase tracking-wide text-black">
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-blue-600 block"></span> 3 Spacious Dance Halls
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-blue-600 block"></span> Professional Sprung Floors
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-blue-600 block"></span> Premium Sound System
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-2 h-2 bg-blue-600 block"></span> Chill-out Lounge & Changing Rooms
                                    </li>
                                </ul>
                            </div>
                            <div className="relative h-[600px] border border-gray-200">
                                {/* Large Studio Image Placeholder */}
                                <Image src="/hero.png" alt="Main Studio Hall" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery / Space Breakdown */}
                <section className="py-24 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Our Spaces</h2>
                            <div className="h-1 w-20 bg-blue-600"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Hall A: The Main Stage", desc: "For large batches and rehearsals. 2000 sq. ft.", img: "/batches.png" },
                                { title: "Hall B: The Lab", desc: "Perfect for technique classes and workshops.", img: "/workshop.png" },
                                { title: "Hall C: Private Suite", desc: "Intimate space for private coaching.", img: "/private.png" }
                            ].map((space, i) => (
                                <div key={i} className="group bg-white border border-gray-200 flex flex-col hover:border-blue-600 transition-colors">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image src={space.img} alt={space.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-black uppercase mb-2 group-hover:text-blue-600 transition-colors">{space.title}</h3>
                                        <p className="text-gray-600 text-sm font-medium">{space.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Achievements />

                {/* Contact / Map Section */}
                <section className="bg-neutral-900 text-white relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                        <div>
                            <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2 block">Visit Us</span>
                            <h3 className="text-3xl font-black uppercase mb-8">Get In Touch</h3>
                            <p className="text-gray-400 mb-10 leading-relaxed text-lg">
                                Ready to start your journey? Contact us to book a trial class, rent the studio, or just say hi.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <FaPhone className="text-white w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold uppercase text-sm mb-1 text-gray-500">Phone</p>
                                        <p className="text-xl font-bold">+91 7448043738</p>
                                        <p className="text-xl font-bold">+91 7030877138</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <FaEnvelope className="text-white w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold uppercase text-sm mb-1 text-gray-500">Email</p>
                                        <a href="mailto:letsdanceacademy5678@gmail.com" className="text-lg md:text-xl font-bold hover:text-blue-400 transition-colors break-all">letsdanceacademy5678@gmail.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <FaInstagram className="text-white w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold uppercase text-sm mb-1 text-gray-500">Follow Us</p>
                                        <div className="flex flex-col gap-1">
                                            <a href="https://www.instagram.com/letsdanceacademy_5678?igsh=MTA1dnY3cm9vc2sxNA==" target="_blank" className="text-lg font-bold hover:text-blue-400 transition-colors">@letsdanceacademy_5678</a>
                                            <a href="https://www.instagram.com/prathameshmane_did?igsh=cG1xczFwamRncXdz" target="_blank" className="text-lg font-bold hover:text-blue-400 transition-colors">@prathameshmane_did</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Sambhaji Nagar Branch */}
                            <div className="flex-1 border border-gray-800 bg-black/50 p-8 flex flex-col justify-center text-center">
                                <h4 className="text-xl font-black uppercase mb-4 text-blue-500">Sambhaji Nagar Branch</h4>
                                <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed">
                                    Sambhaji Nagar Road, Dhankwadi,<br />
                                    Near Suyog Hospital, Pune 411043
                                </p>
                                <div>
                                    <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-colors">
                                        View on Maps
                                    </button>
                                </div>
                            </div>

                            {/* Balaji Nagar Branch */}
                            <div className="flex-1 border border-gray-800 bg-black/50 p-8 flex flex-col justify-center text-center">
                                <h4 className="text-xl font-black uppercase mb-4 text-blue-500">Balaji Nagar Branch</h4>
                                <p className="text-gray-400 mb-6 font-mono text-sm leading-relaxed">
                                    Balaji Nagar, Dhankawade Patil Township,<br />
                                    Near Siddhi Hospital, Pune 411043
                                </p>
                                <div>
                                    <button className="bg-white text-black px-6 py-2 text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-colors">
                                        View on Maps
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-10 bg-[url('/hero.png')] bg-cover bg-center pointer-events-none"></div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
