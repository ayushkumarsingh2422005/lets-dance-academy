'use client';

import { useState } from 'react';
import { FaCheck, FaXmark, FaClock } from 'react-icons/fa6';

const initialStudents = [
    { id: 1, name: 'Rahul Sharma', status: 'present' },
    { id: 2, name: 'Sneha Patel', status: 'present' },
    { id: 3, name: 'Amit Verma', status: 'absent' },
    { id: 4, name: 'Priya Singh', status: 'pending' },
    { id: 5, name: 'Vikram Malhotra', status: 'late' },
];

export default function AdminAttendance() {
    const [students, setStudents] = useState(initialStudents);

    const updateStatus = (id: number, status: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Attendance</h1>
                    <p className="text-gray-500 font-medium">Mark daily attendance for batches.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-500 uppercase">Current Date</p>
                    <p className="text-xl font-black">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Branch</label>
                    <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-bold">
                        <option>Sambhaji Nagar</option>
                        <option>Balaji Nagar</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Batch</label>
                    <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-bold">
                        <option>Hip Hop Regular (5:00 PM)</option>
                        <option>Contemporary (6:30 PM)</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors">
                        Load Student List
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold uppercase text-sm">Student List (5 Students)</h3>
                    <div className="flex gap-4 text-xs font-bold">
                        <span className="text-green-600">Present: {students.filter(s => s.status === 'present').length}</span>
                        <span className="text-red-600">Absent: {students.filter(s => s.status === 'absent').length}</span>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {students.map((student) => (
                        <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <span className="font-bold text-gray-900">{student.name}</span>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStatus(student.id, 'present')}
                                    className={`p-2 rounded-lg border transition-all ${student.status === 'present' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-300 border-gray-200 hover:border-gray-300'
                                        }`}
                                    title="Present"
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => updateStatus(student.id, 'absent')}
                                    className={`p-2 rounded-lg border transition-all ${student.status === 'absent' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-300 border-gray-200 hover:border-gray-300'
                                        }`}
                                    title="Absent"
                                >
                                    <FaXmark />
                                </button>
                                <button
                                    onClick={() => updateStatus(student.id, 'late')}
                                    className={`p-2 rounded-lg border transition-all ${student.status === 'late' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-300 border-gray-200 hover:border-gray-300'
                                        }`}
                                    title="Late"
                                >
                                    <FaClock />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t border-gray-200 bg-gray-50 text-right">
                    <button className="bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:opacity-80">
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
}
