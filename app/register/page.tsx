
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <Header />

            <main className="pt-24 pb-4 flex items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-lg">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">Join The Movement</h1>
                    <p className="text-gray-500 text-center mb-8 text-sm font-bold">Create your student account</p>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Alex"
                                    className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                            />
                        </div>

                        <Link href="/dashboard" className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                            Create Account
                        </Link>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold text-gray-500">
                        <p>Already have an account? <Link href="/login" className="text-black underline hover:text-blue-600">Sign In</Link></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
