'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    dateOfBirth?: string;
    profilePicture?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    isActive?: boolean;
    deactivationReason?: string;
    deactivatedAt?: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string, isAdmin?: boolean) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string, isAdmin: boolean = false): Promise<{ success: boolean; message: string }> => {
        try {
            const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/user/login';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                const userData = isAdmin ? data.data.admin : data.data.user;
                setToken(data.data.token);
                setUser(userData);

                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect based on role
                if (isAdmin) {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }

                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    };

    const register = async (name: string, email: string, password: string, phone?: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch('/api/auth/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await response.json();

            if (data.success) {
                setToken(data.data.token);
                setUser(data.data.user);

                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                router.push('/dashboard');

                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const updateUser = (updatedUser: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUser };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        }
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
