'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Public admin pages (don't need protection or sidebar)
    const publicAdminPages = ['/admin/login', '/admin/forgot-password'];
    const isPublicPage = publicAdminPages.includes(pathname);

    // For public pages (login, forgot-password), render without protection
    if (isPublicPage) {
        return <div className={inter.className}>{children}</div>;
    }

    // For protected admin pages, wrap with ProtectedRoute and show sidebar
    return (
        <ProtectedRoute requireAdmin={true}>
            <div className={`flex min-h-screen bg-gray-50 ${inter.className}`}>
                <AdminSidebar />
                <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen">
                    <div className="max-w-7xl mx-auto pt-16 md:pt-0">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
