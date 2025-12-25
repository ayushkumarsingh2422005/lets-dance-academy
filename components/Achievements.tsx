import { FaTrophy, FaStar, FaAward, FaCrown, FaMedal } from 'react-icons/fa6';

const achievements = [
    { title: "Maharashtra Best Dancer", status: "Winner", icon: FaTrophy, color: "from-amber-400 to-orange-600", shadow: "shadow-amber-500/20", border: "group-hover:border-amber-500/50" },
    { title: "Marathi Tarka", status: "Award Winner", icon: FaAward, color: "from-amber-400 to-orange-600", shadow: "shadow-amber-500/20", border: "group-hover:border-amber-500/50" },
    { title: "Me Honar Superstar", status: "Semifinalist", icon: FaStar, color: "from-blue-400 to-indigo-600", shadow: "shadow-blue-500/20", border: "group-hover:border-blue-500/50" },
    { title: "DID (Dance India Dance)", status: "Top Contestant", icon: FaCrown, color: "from-purple-400 to-pink-600", shadow: "shadow-purple-500/20", border: "group-hover:border-purple-500/50" },
    { title: "IBD (India's Best Dancer)", status: "Top Contestant", icon: FaCrown, color: "from-purple-400 to-pink-600", shadow: "shadow-purple-500/20", border: "group-hover:border-purple-500/50" },
    { title: "Award Functions", status: "Choreographer", icon: FaMedal, color: "from-emerald-400 to-cyan-600", shadow: "shadow-emerald-500/20", border: "group-hover:border-emerald-500/50" },
];

export default function Achievements() {
    return (
        <section className="py-16 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
            {/* Background Decorative Elements - Subtle Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 gap-6">
                    <div className="text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-3 backdrop-blur-md">
                            Hall of Fame
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">
                            Achievements
                        </h2>
                    </div>
                    <div className="hidden md:block w-32 h-px bg-linear-to-r from-gray-800 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((item, index) => (
                        <div
                            key={index}
                            className={`group flex items-center gap-5 bg-neutral-900/50 border border-white/5 p-4 rounded-lg transition-all duration-300 hover:bg-neutral-900 hover:border-white/10 hover:shadow-xl hover:-translate-y-1 ${item.border}`}
                        >
                            <div className={`w-12 h-12 shrink-0 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center text-white shadow-lg ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className="w-5 h-5" />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-base font-bold uppercase text-white truncate group-hover:text-blue-200 transition-colors">
                                    {item.title}
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 bg-clip-text text-transparent bg-linear-to-r ${item.color}`}>
                                    {item.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
