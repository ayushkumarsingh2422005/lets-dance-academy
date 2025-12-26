'use client';

import { FaIndianRupeeSign, FaFileInvoice, FaCircleExclamation } from 'react-icons/fa6';

const transactions = [
    { id: 1, student: 'Rahul Sharma', amount: 2500, type: 'Monthly Fee', date: '26 Dec 2025', status: 'Paid', method: 'UPI' },
    { id: 2, student: 'Sneha Patel', amount: 1500, type: 'Workshop', date: '25 Dec 2025', status: 'Paid', method: 'Cash' },
    { id: 3, student: 'Vikram Malhotra', amount: 2500, type: 'Monthly Fee', date: '20 Dec 2025', status: 'Pending', method: '-' },
    { id: 4, student: 'Priya Singh', amount: 5000, type: 'Quarterly Fee', date: '18 Dec 2025', status: 'Overdue', method: '-' },
];

export default function AdminPayments() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Payments</h1>
                    <p className="text-gray-500 font-medium">Track revenue and manage fee records.</p>
                </div>
                <button className="bg-green-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-green-700 transition-colors rounded-lg flex items-center gap-2">
                    <FaIndianRupeeSign /> Record Payment
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-6 rounded-2xl shadow-lg">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue (Dec)</p>
                    <h3 className="text-3xl font-black">₹ 1,24,500</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Pending Dues</p>
                    <h3 className="text-3xl font-black text-orange-500">₹ 45,000</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Overdue</p>
                    <h3 className="text-3xl font-black text-red-600">₹ 12,500</h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold uppercase text-sm">Recent Transactions</h3>
                    <button className="text-blue-600 text-xs font-bold uppercase">View All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Student</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Type</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Date</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 text-right">Amount</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Method</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{t.student}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{t.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{t.date}</td>
                                <td className="px-6 py-4 text-sm font-black text-right">₹ {t.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{t.method}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${t.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                            t.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {t.status === 'Paid' && (
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <FaFileInvoice />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
