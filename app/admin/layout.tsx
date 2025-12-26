import AdminSidebar from '@/components/admin/AdminSidebar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`flex min-h-screen bg-gray-50 ${inter.className}`}>
            <AdminSidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto pt-16 md:pt-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
