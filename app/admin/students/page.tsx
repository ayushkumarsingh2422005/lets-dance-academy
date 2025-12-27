'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaPlus, FaTrash, FaEye, FaEyeSlash, FaToggleOn, FaToggleOff } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';

interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    profilePicture?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    role: string;
    isEmailVerified: boolean;
    isActive: boolean;
    deactivationReason?: string;
    deactivatedAt?: string;
    createdAt: string;
}

export default function ManageStudentsPage() {
    const { token } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Add student form state
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentPhone, setNewStudentPhone] = useState('');
    const [newStudentPassword, setNewStudentPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [addingStudent, setAddingStudent] = useState(false);

    // Deactivation modal state
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [studentToDeactivate, setStudentToDeactivate] = useState<Student | null>(null);
    const [deactivationReason, setDeactivationReason] = useState('');
    const [useCustomReason, setUseCustomReason] = useState(false);

    // View Student Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Predefined deactivation reasons
    const deactivationReasons = [
        'Non-payment of fees',
        'Lack of attendance',
        'Student request',
        'Disciplinary issues',
        'Course completed',
        'Transferred to another academy',
        'Medical reasons',
        'Other (specify below)'
    ];

    // Fetch all students
    const fetchStudents = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                ...(search && { search })
            });

            const response = await fetch(`/api/students?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setStudents(data.data.students);
                setTotalPages(data.data.pagination.totalPages);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to load students');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [token, currentPage, search]);

    // Add new student
    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setAddingStudent(true);

        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newStudentName,
                    email: newStudentEmail,
                    password: newStudentPassword,
                    phone: newStudentPhone
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Student created successfully!');
                setNewStudentName('');
                setNewStudentEmail('');
                setNewStudentPassword('');
                setNewStudentPhone('');
                setShowAddForm(false);
                fetchStudents(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to create student');
            console.error(err);
        } finally {
            setAddingStudent(false);
        }
    };

    // Delete student
    const handleDeleteStudent = async (studentId: string, studentName: string) => {
        if (!confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/students/${studentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('Student deleted successfully');
                fetchStudents(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to delete student');
            console.error(err);
        }
    };

    // Open deactivation modal
    const handleOpenDeactivateModal = (student: Student) => {
        setStudentToDeactivate(student);
        setDeactivationReason('');
        setUseCustomReason(false);
        setShowDeactivateModal(true);
    };

    // Handle status toggle (activate or deactivate)
    const handleToggleStatus = async (student: Student, activate: boolean) => {
        if (activate) {
            // Activating - no modal needed
            await toggleStudentStatus(student._id, true, '');
        } else {
            // Deactivating - open modal for reason
            handleOpenDeactivateModal(student);
        }
    };

    // Actual API call to toggle student status
    const toggleStudentStatus = async (studentId: string, isActive: boolean, reason: string) => {
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/students/${studentId}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    isActive,
                    ...(reason && { deactivationReason: reason })
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message);
                setShowDeactivateModal(false);
                setStudentToDeactivate(null);
                fetchStudents(); // Refresh list
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to update student status');
            console.error(err);
        }
    };

    // Submit deactivation with reason
    const handleSubmitDeactivation = () => {
        const finalReason = useCustomReason || deactivationReason === 'Other (specify below)'
            ? (document.getElementById('customReason') as HTMLTextAreaElement)?.value || deactivationReason
            : deactivationReason;

        if (!finalReason || finalReason === 'Other (specify below)') {
            setError('Please select or enter a reason for deactivation');
            return;
        }

        if (studentToDeactivate) {
            toggleStudentStatus(studentToDeactivate._id, false, finalReason);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Students Management</h1>
                    <p className="text-gray-600 text-sm font-medium">View, add, and manage student accounts</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add Student
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-blue-600 focus:outline-none text-sm font-medium"
                    />
                </div>
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

            {/* Add Student Form */}
            {showAddForm && (
                <div className="mb-8 p-6 bg-white border-2 border-gray-200 shadow-lg">
                    <h2 className="text-xl font-black uppercase mb-6">Add New Student</h2>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
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
                                    value={newStudentEmail}
                                    onChange={(e) => setNewStudentEmail(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={newStudentPhone}
                                    onChange={(e) => setNewStudentPhone(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newStudentPassword}
                                        onChange={(e) => setNewStudentPassword(e.target.value)}
                                        className="w-full border-2 border-gray-200 p-3 pr-12 text-sm font-medium focus:border-blue-600 focus:outline-none"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={addingStudent}
                                className="bg-blue-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {addingStudent ? 'Creating...' : 'Create Student'}
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

            {/* Students Table */}
            <div className="bg-white border border-gray-200 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-600">Joined</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student._id} className={`hover:bg-gray-50 ${!student.isActive ? 'bg-red-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {student.profilePicture ? (
                                                <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-gray-500 text-xs">{student.name.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{student.name}</div>
                                            {student.deactivationReason && (
                                                <div className="text-xs text-red-600 mt-1">
                                                    Reason: {student.deactivationReason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{student.phone || '—'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase ${student.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {student.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(student.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* View Button */}
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye className="w-4 h-4 text-blue-600" />
                                        </button>

                                        {/* Toggle Status Button */}
                                        <button
                                            onClick={() => handleToggleStatus(student, !student.isActive)}
                                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                                            title={student.isActive ? 'Deactivate' : 'Activate'}
                                        >
                                            {student.isActive ? (
                                                <FaToggleOn className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <FaToggleOff className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteStudent(student._id, student.name)}
                                            className="p-2 rounded hover:bg-red-50 transition-colors"
                                            title="Delete Student"
                                        >
                                            <FaTrash className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {students.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-bold">No students found</p>
                        <p className="text-sm mt-2">
                            {search ? 'Try a different search term' : 'Add your first student to get started'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border-2 border-gray-300 font-bold text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 font-bold text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border-2 border-gray-300 font-bold text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Deactivation Modal */}
            {showDeactivateModal && studentToDeactivate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black uppercase mb-4">Deactivate Student</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            You are about to deactivate <strong>{studentToDeactivate.name}</strong>.
                            Please select a reason:
                        </p>

                        <div className="space-y-3 mb-6">
                            {deactivationReasons.map((reason) => (
                                <label key={reason} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded border-2 border-transparent hover:border-gray-200 transition-all">
                                    <input
                                        type="radio"
                                        name="deactivationReason"
                                        value={reason}
                                        checked={deactivationReason === reason}
                                        onChange={(e) => {
                                            setDeactivationReason(e.target.value);
                                            setUseCustomReason(e.target.value === 'Other (specify below)');
                                        }}
                                        className="mt-1"
                                    />
                                    <span className="text-sm font-medium">{reason}</span>
                                </label>
                            ))}
                        </div>

                        {(useCustomReason || deactivationReason === 'Other (specify below)') && (
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    Custom Reason
                                </label>
                                <textarea
                                    id="customReason"
                                    rows={3}
                                    placeholder="Enter custom reason for deactivation..."
                                    className="w-full border-2 border-gray-200 p-3 text-sm font-medium focus:border-blue-600 focus:outline-none resize-none"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitDeactivation}
                                className="flex-1 bg-red-600 text-white px-6 py-3 font-bold uppercase text-sm tracking-wide hover:bg-red-700 transition-colors"
                            >
                                Deactivate
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeactivateModal(false);
                                    setStudentToDeactivate(null);
                                    setDeactivationReason('');
                                    setUseCustomReason(false);
                                }}
                                className="flex-1 border-2 border-gray-300 px-6 py-3 font-bold uppercase text-sm tracking-wide hover:border-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Student Modal */}
            {showViewModal && selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto rounded-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight">Student Profile</h2>
                            <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <FaEyeSlash className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Left Column: Photo & Status */}
                            <div className="w-full md:w-1/3 flex flex-col items-center">
                                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4 border-4 border-gray-100 shadow-inner relative">
                                    {selectedStudent.profilePicture ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={selectedStudent.profilePicture} alt={selectedStudent.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-black text-gray-400">
                                            {selectedStudent.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedStudent.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {selectedStudent.isActive ? 'Active Student' : 'Inactive'}
                                </span>
                            </div>

                            {/* Right Column: Details */}
                            <div className="w-full md:w-2/3 space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Full Name</h3>
                                    <p className="text-xl font-bold">{selectedStudent.name}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Email Address</h3>
                                        <p className="font-medium break-all">{selectedStudent.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Phone Number</h3>
                                        <p className="font-medium">{selectedStudent.phone || '—'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Date of Birth</h3>
                                        <p className="font-medium">
                                            {selectedStudent.dateOfBirth
                                                ? new Date(selectedStudent.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Joined On</h3>
                                        <p className="font-medium">{new Date(selectedStudent.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-black uppercase mb-4 flex items-center gap-2">
                                        <span className="text-red-500">🚑</span> Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div>
                                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Name</h3>
                                            <p className="font-medium">{selectedStudent.emergencyContactName || '—'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Phone</h3>
                                            <p className="font-medium">{selectedStudent.emergencyContactPhone || '—'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="bg-black text-white px-8 py-3 font-bold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors rounded shadow-lg"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
