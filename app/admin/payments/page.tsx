
'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FaIndianRupeeSign, FaCircleCheck, FaClock, FaRotateRight, FaFilter, FaFileInvoiceDollar } from 'react-icons/fa6';

export default function AdminPaymentsPage() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/enrollments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setEnrollments(data.enrollments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEnrollments = enrollments.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'due') {
            if (e.type !== 'recurring') return false;
            return e.status === 'expired' || (e.validUntil && new Date(e.validUntil) < new Date());
        }
        return e.status === filter;
    });

    const totalRevenue = enrollments
        .filter(e => e.status === 'active')
        .reduce((sum, e) => sum + (e.price || 0), 0);

    const pendingCount = enrollments.filter(e => e.status === 'pending').length;

    const dueCount = enrollments.filter(e =>
        e.type === 'recurring' && (e.status === 'expired' || (e.validUntil && new Date(e.validUntil) < new Date()))
    ).length;

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
                <Icon size={20} />
            </div>
            <div>
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</div>
                <div className="text-2xl font-black">{value}</div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Payments & Dues</h1>
                        <p className="text-gray-500 font-medium">Monitor revenue and verify manual payments.</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`₹${totalRevenue.toLocaleString()}`}
                        icon={FaIndianRupeeSign}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Pending Verification"
                        value={pendingCount}
                        icon={FaClock}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Dues / Expired"
                        value={dueCount}
                        icon={FaFileInvoiceDollar}
                        color="bg-red-500"
                    />
                </div>

                {/* Filters & Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Transaction History</h3>
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-400" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-black"
                            >
                                <option value="all">All Transactions</option>
                                <option value="pending">Pending</option>
                                <option value="active">Active/Paid</option>
                                <option value="due">Dues/Expired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Course/Batch</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Payment Date</th>
                                        <th className="px-6 py-4">Valid Until</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredEnrollments.map((e) => (
                                        <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-black">{e.userName}</div>
                                                <div className="text-xs text-gray-400">{e.userEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{e.batchTitle}</div>
                                                <div className="text-xs text-gray-400 capitalize">{e.branch} Branch</div>
                                                <div className="text-xs text-gray-400 capitalize mt-1">
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${e.type === 'recurring' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {e.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold">₹{e.price}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(e.paymentDate || e.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-600">
                                                {e.validUntil ? (
                                                    <div>
                                                        {new Date(e.validUntil).toLocaleDateString()}
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(e.validUntil).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                ) : <span className="text-xs bg-gray-100 px-2 py-1 rounded">Lifetime</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs uppercase font-bold tracking-wide ${e.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        e.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            e.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {e.status}
                                                </span>
                                                {/* Check if recurring & expired */}
                                                {e.type === 'recurring' && e.status === 'active' && e.validUntil && new Date(e.validUntil) < new Date() && (
                                                    <span className="ml-2 px-2 py-1 rounded text-xs uppercase font-bold bg-red-100 text-red-700">Expired</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredEnrollments.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
