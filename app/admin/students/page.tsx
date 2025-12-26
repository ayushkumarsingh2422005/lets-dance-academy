'use client';

import { useState } from 'react';
import { FaMagnifyingGlass, FaFilter, FaEllipsisVertical } from 'react-icons/fa6';

const students = [
    { id: 1, name: 'Rahul Sharma', batch: 'Hip Hop Regular', branch: 'Sambhaji Nagar', phone: '+91 98765 43210', status: 'Active', joinDate: '12 Jan 2025' },
    { id: 2, name: 'Sneha Patel', batch: 'Contemporary Weekend', branch: 'Balaji Nagar', phone: '+91 98765 12345', status: 'Active', joinDate: '15 Jan 2025' },
    { id: 3, name: 'Amit Verma', batch: 'Bollywood Kids', branch: 'Sambhaji Nagar', phone: '+91 98765 67890', status: 'Inactive', joinDate: '10 Dec 2024' },
    { id: 4, name: 'Priya Singh', batch: 'K-Pop Workshop', branch: 'Balaji Nagar', phone: '+91 98765 09876', status: 'Active', joinDate: '20 Jan 2025' },
    { id: 5, name: 'Vikram Malhotra', batch: 'Hip Hop Regular', branch: 'Sambhaji Nagar', phone: '+91 88888 77777', status: 'Pending', joinDate: '22 Jan 2025' },
];

export default function AdminStudents() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Students</h1>
                    <p className="text-gray-500 font-medium">Manage all registered students.</p>
                </div>
                <button className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors rounded-lg">
                    + Add Student
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none">
                        <option>All Batches</option>
                        <option>Hip Hop</option>
                        <option>Contemporary</option>
                    </select>
                    <select className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none">
                        <option>All Branches</option>
                        <option>Sambhaji Nagar</option>
                        <option>Balaji Nagar</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Name</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Batch Info</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Contact</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Join Date</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{student.name}</div>
                                    <div className="text-xs text-gray-400 font-mono">ID: #{2025000 + student.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 text-sm">{student.batch}</div>
                                    <div className="text-xs text-gray-500">{student.branch}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                    {student.phone}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${student.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            student.status === 'Inactive' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    {student.joinDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-black p-2">
                                        <FaEllipsisVertical />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
