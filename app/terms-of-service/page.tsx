import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfService() {
    return (
        <div className="bg-white text-black min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Header />
            <main className="pt-24 pb-24">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Terms of Service</h1>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p className="lead">
                            Welcome to Let's Dance Academy. By accessing our website and enrolling in our classes, you agree to comply with and be bound by the following terms and conditions.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">1. Class Enrollment & Cancellations</h3>
                        <p>
                            All class enrollments are subject to availability. Cancellations made less than 24 hours before a class may not be eligible for a refund. It is your responsibility to check your schedule before booking.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">2. Code of Conduct</h3>
                        <p>
                            We maintain a safe and respectful environment for all dancers. Any behavior deemed disrespectful, harassing, or dangerous by our instructors or staff will result in immediate termination of your membership without refund.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">3. Health & Safety</h3>
                        <p>
                            Dance involves physical exertion. By participating, you acknowledge that you are in good health and physically capable of performing the exercises. Let's Dance Academy is not liable for any injuries sustained during classes, though we take every precaution to ensure safety.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">4. Media Release</h3>
                        <p>
                            We occasionally photograph or film classes for promotional purposes. By attending, you grant Let's Dance Academy permission to use your likeness in our marketing materials. If you do not wish to be filmed, please inform us in advance.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">5. Intellectual Property</h3>
                        <p>
                            Choreography taught in classes is the intellectual property of the instructor. You may not teach or perform this choreography for commercial gain without express written permission.
                        </p>

                        <h3 className="text-black font-bold uppercase mt-8 mb-4">6. Modification of Terms</h3>
                        <p>
                            We reserve the right to change these terms at any time. Continued use of our services constitutes acceptance of the modified terms.
                        </p>

                        <p className="text-sm mt-12 pt-8 border-t border-gray-200">
                            Effective Date: {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
