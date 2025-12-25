import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />
            <main className="pt-24 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Privacy Policy</h1>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p className="lead">
                            At Let's Dance Academy, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">1. Information We Collect</h3>
                        <p>
                            We collect information you provide directly to us when you register for classes, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, and payment information.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">2. How We Use Your Information</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To process your class registrations and payments.</li>
                            <li>To communicate with you about your classes, schedule changes, and studio updates.</li>
                            <li>To send you promotional emails about workshops and events (you can opt-out at any time).</li>
                            <li>To improve our studio services and website experience.</li>
                        </ul>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">3. Data Security</h3>
                        <p>
                            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">4. Sharing of Information</h3>
                        <p>
                            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except to trust third parties who assist us in operating our website and conducting our business (e.g., payment processors), so long as those parties agree to keep this information confidential.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">5. Contact Us</h3>
                        <p>
                            If you have any questions regarding this Privacy Policy, please contact us at <a href="mailto:letsdanceacademy5678@gmail.com" className="text-blue-600 underline">letsdanceacademy5678@gmail.com</a>.
                        </p>

                        <p className="text-sm mt-12 pt-8 border-t border-gray-200">
                            Last Updated: {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
