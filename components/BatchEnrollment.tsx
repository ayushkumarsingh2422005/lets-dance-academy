'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaLocationDot, FaCheck, FaXmark } from 'react-icons/fa6';

const branches = [
    {
        id: 'sambhaji-nagar',
        name: 'Sambhaji Nagar Branch',
        address: 'Sambhaji Nagar Road, Dhankwadi, near by Suyog Hospital, Pune 411043'
    },
    {
        id: 'balaji-nagar',
        name: 'Balaji Nagar Branch',
        address: 'Balaji Nagar, Dhankawade Patil Township, near by Siddhi Hospital, Pune 411043'
    }
];

export default function BatchEnrollment({ price }: { price: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors border-2 border-transparent text-center w-full"
            >
                Enroll Now - {price}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white text-black max-w-lg w-full p-8 rounded-2xl relative shadow-2xl animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-all"
                        >
                            <FaXmark size={20} />
                        </button>

                        <div className="mb-8">
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2 block">Step 1 of 2</span>
                            <h3 className="text-3xl font-black uppercase mb-2">Select Campus</h3>
                            <p className="text-gray-600">Please choose the branch where you'd like to attend classes.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {branches.map((branch) => (
                                <button
                                    key={branch.id}
                                    onClick={() => setSelectedBranch(branch)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 relative group ${selectedBranch.id === branch.id
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedBranch.id === branch.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                                        }`}>
                                        {selectedBranch.id === branch.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <span className={`font-black uppercase tracking-wide block text-sm mb-1 ${selectedBranch.id === branch.id ? 'text-blue-900' : 'text-black'
                                            }`}>{branch.name}</span>
                                        <span className="text-xs text-gray-500 font-medium leading-relaxed block">{branch.address}</span>
                                    </div>
                                    {selectedBranch.id === branch.id && (
                                        <FaCheck className="absolute top-4 right-4 text-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <Link
                                href={`/dashboard?branch=${selectedBranch.id}`}
                                className="block w-full bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors text-center rounded-lg"
                            >
                                Continue to Information
                            </Link>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="block w-full mt-4 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
