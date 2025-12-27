'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEye, FaEyeSlash } from 'react-icons/fa6';

interface Admin {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    createdBy?: string;
}

export default function ManageAdminsPage() {
    const { token, user } = useAuth();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Add admin form state
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPhone, setNewAdminPhone] = useState('');
    const [addingAdmin, setAddingAdmin] = useState(false);

    // Fetch all admins
    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setAdmins(data.data.admins);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load admins');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [token]);

    // Add new admin
    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setAddingAdmin(true);

        try {
            const response = await fetch('/api/auth/admin/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newAdminName,
                    email: newAdminEmail,
                    phone: newAdminPhone
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Admin created successfully! Credentials sent via email.');
                setNewAdminName('');
                setNewAdminEmail('');
                setNewAdminPhone('');
                setShowAddForm(false);
                fetchAdmins(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to create admin');
            console.error(err);
        } finally {
            setAddingAdmin(false);
        }
    };

    // Delete admin
    const handleDeleteAdmin = async (adminId: string, adminName: string) => {
        if (!confirm(`Are you sure you want to delete admin "${adminName}"? This action cannot be undone.`)) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/admin/${adminId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Admin deleted successfully');
                fetchAdmins(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete admin');
            console.error(err);
        }
    };

    // Toggle admin status
    const handleToggleStatus = async (adminId: string, currentStatus: boolean) => {
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/admin/${adminId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message);
                fetchAdmins(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update admin status');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold">Loading admins...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Manage Admins</h1>
                    <p className="text-gray-600 text-sm font-medium">Add, remove, and manage administrator accounts</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Admin
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded">
                    {success}
                </div>
            )}

            {/* Add Admin Form */}
            {showAddForm && (
                <div className="mb-8 p-6 bg-white border-2 border-gray-200 shadow-lg">
                    <h2 className="text-xl font-black uppercase mb-6">Add New Admin</h2>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={newAdminName}
                                    onChange={(e) => setNewAdminName(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={newAdminEmail}
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={newAdminPhone}
                                onChange={(e) => setNewAdminPhone(e.target.value)}
                                className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={addingAdmin}
                                className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {addingAdmin ? 'Creating...' : 'Create Admin'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="border-2 border-gray-300 px-6 py-3 font-bold uppercase text-sm tracking-wide hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admins List */}
            <div className="bg-white border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Added</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {admins.map((admin) => {
                            const isCurrentUser = user?.id === admin._id;
                            return (
                                <tr key={admin._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-sm">
                                            {admin.name}
                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{admin.phone || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-bold uppercase ${admin.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Toggle Status Button */}
                                            <button
                                                onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                                                disabled={isCurrentUser}
                                                className={`p-2 rounded hover:bg-gray-100 transition-colors ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                title={admin.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {admin.isActive ? (
                                                    <FaToggleOn className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <FaToggleOff className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                                                disabled={isCurrentUser}
                                                className={`p-2 rounded hover:bg-red-50 transition-colors ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                title="Delete Admin"
                                            >
                                                <FaTrash className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {admins.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-bold">No admins found</p>
                        <p className="text-sm mt-2">Add your first admin to get started</p>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-bold text-yellow-800">
                    ⚠️ <strong>Important:</strong> You cannot delete or deactivate your own account. The system must always have at least one active admin.
                </p>
            </div>
        </div>
    );
}
