
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="bg-white text-black min-h-screen font-sans">
            <Header />

            <main className="pt-20 flex items-center justify-center min-h-[80vh] bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-lg">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">Welcome Back</h1>
                    <p className="text-gray-500 text-center mb-8 text-sm font-bold">Sign in to your account</p>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                            />
                        </div>

                        {/* Assuming 'Login with email only' typically implies no social login, but usually still needs a password. 
                      If strictly 'passwordless/magic link', we would remove this. Keeping password for standard flow. */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-gray-200 p-4 text-sm font-bold focus:border-black focus:outline-none transition-colors rounded-none placeholder:font-normal"
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-black" />
                                <span>Remember me</span>
                            </label>
                            <Link href="#" className="text-blue-600 hover:underline">Forgot Password?</Link>
                        </div>

                        <Link href="/dashboard" className="block w-full bg-black text-white text-center py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors">
                            Sign In
                        </Link>
                    </form>

                    <div className="mt-8 text-center text-xs font-bold text-gray-500">
                        <p>Don't have an account? <Link href="/register" className="text-black underline hover:text-blue-600">Register Now</Link></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
