
'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { FaCalendarCheck, FaFilter, FaCheck, FaXmark } from 'react-icons/fa6';
import { FaSave } from 'react-icons/fa';

export default function AttendancePage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('sambhaji-nagar');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await fetch('/api/batches');
                const data = await res.json();
                if (data.success) {
                    setBatches(data.data.batches || []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            fetchData();
        } else {
            setStudents([]);
        }
    }, [selectedBatch, selectedBranch, selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // 1. Fetch Active Students
            const resEnr = await fetch(`/api/enrollments?batchId=${selectedBatch}&branch=${selectedBranch}&status=active`, { headers });
            const dataEnr = await resEnr.json();

            // 2. Fetch Attendance
            const resAtt = await fetch(`/api/attendance?batchId=${selectedBatch}&branch=${selectedBranch}&date=${selectedDate}`, { headers });
            const dataAtt = await resAtt.json();

            const activeEnrollments = dataEnr.enrollments || [];
            const existingRecords = dataAtt.attendance?.records || [];

            // Deduplicate enrollments by user ID
            const uniqueEnrollments = activeEnrollments.reduce((acc: any[], current: any) => {
                if (!acc.find((item: any) => item.user === current.user)) {
                    acc.push(current);
                }
                return acc;
            }, []);

            // Merge Current Active
            const mappedActive = uniqueEnrollments.map((enr: any) => {
                const existing = existingRecords.find((r: any) => r.student === enr.user);
                return {
                    studentId: enr.user,
                    studentName: enr.userName,
                    status: existing ? existing.status : 'absent'
                };
            });

            // Include Historical records (students in attendance but not currently active)
            const historical = existingRecords.filter((r: any) => !uniqueEnrollments.find((e: any) => e.user === r.student));
            const mappedHistorical = historical.map((r: any) => ({
                studentId: r.student,
                studentName: r.studentName,
                status: r.status
            }));

            const allStudents = [...mappedActive, ...mappedHistorical];
            allStudents.sort((a: any, b: any) => a.studentName.localeCompare(b.studentName));

            setStudents(allStudents);

        } catch (e) {
            console.error("Error fetching data", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = (index: number) => {
        const newStudents = [...students];
        newStudents[index].status = newStudents[index].status === 'present' ? 'absent' : 'present';
        setStudents(newStudents);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const records = students.map(s => ({
                student: s.studentId,
                studentName: s.studentName,
                status: s.status
            }));

            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    batchId: selectedBatch,
                    branch: selectedBranch,
                    date: selectedDate,
                    records
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Attendance Saved Successfully');
            } else {
                alert('Failed: ' + data.message);
            }
        } catch (e) {
            alert('Error saving attendance');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Attendance</h1>
                        <p className="text-gray-500 font-medium">Track daily attendance for your batches.</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Batch</label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 font-bold focus:border-black transition-colors"
                        >
                            <option value="">-- Choose Batch --</option>
                            {batches.map((b: any) => (
                                <option key={b._id} value={b._id}>{b.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[200px]">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Branch</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 font-bold focus:border-black transition-colors"
                        >
                            <option value="sambhaji-nagar">Sambhaji Nagar</option>
                            <option value="balaji-nagar">Balaji Nagar</option>
                        </select>
                    </div>

                    <div className="w-[200px]">
                        <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Select Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 font-bold focus:border-black transition-colors"
                        />
                    </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg">Student List</h3>
                        {selectedBatch && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold uppercase text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <FaSave /> {saving ? 'Saving...' : 'Save Attendance'}
                            </button>
                        )}
                    </div>

                    {!selectedBatch ? (
                        <div className="p-12 text-center text-gray-400 italic">Please select a batch to view students.</div>
                    ) : loading ? (
                        <div className="p-12 text-center text-gray-500">Loading students...</div>
                    ) : students.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 italic">No active students found for this batch/branch.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-200 text-xs text-gray-400 uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-8 py-4 w-20">#</th>
                                        <th className="px-8 py-4">Student Name</th>
                                        <th className="px-8 py-4 text-center w-40">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student, index) => (
                                        <tr key={student.studentId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleStatus(index)}>
                                            <td className="px-8 py-4 text-gray-400 font-bold">{index + 1}</td>
                                            <td className="px-8 py-4 font-bold">{student.studentName}</td>
                                            <td className="px-8 py-4 text-center">
                                                <button
                                                    className={`w-full py-2 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 transition-all ${student.status === 'present'
                                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                                        : 'bg-red-50 text-red-400 hover:bg-red-100'
                                                        }`}
                                                >
                                                    {student.status === 'present' ? <><FaCheck /> Present</> : <><FaXmark /> Absent</>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
