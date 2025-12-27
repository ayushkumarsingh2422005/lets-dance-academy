'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    rejectAdmin?: boolean; // For user-only routes
}

export default function ProtectedRoute({ children, requireAdmin = false, rejectAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                // Redirect to appropriate login page based on route type
                router.push(requireAdmin ? '/admin/login' : '/login');
            } else if (requireAdmin && !isAdmin) {
                // User trying to access admin - redirect to user dashboard
                router.push('/dashboard');
            } else if (rejectAdmin && isAdmin) {
                // Admin trying to access user-only route - redirect to admin panel
                router.push('/admin');
            }
        }
    }, [isAuthenticated, isAdmin, loading, requireAdmin, rejectAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requireAdmin && !isAdmin) {
        return null;
    }

    if (rejectAdmin && isAdmin) {
        return null;
    }

    return <>{children}</>;
}
