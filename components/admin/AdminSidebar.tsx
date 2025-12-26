'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaChartPie,
    FaUserGroup,
    FaCalendarCheck,
    FaMoneyBillWave,
    FaLayerGroup,
    FaImages,
    FaGear,
    FaArrowRightFromBracket
} from 'react-icons/fa6';

const menuItems = [
    { icon: FaChartPie, label: 'Dashboard', href: '/admin' },
    { icon: FaUserGroup, label: 'Students', href: '/admin/students' },
    { icon: FaCalendarCheck, label: 'Attendance', href: '/admin/attendance' },
    { icon: FaMoneyBillWave, label: 'Payments & Dues', href: '/admin/payments' },
    { icon: FaLayerGroup, label: 'Courses & Batches', href: '/admin/courses' },
    { icon: FaImages, label: 'Banners & Content', href: '/admin/content' },
    { icon: FaGear, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-neutral-950 text-white flex-shrink-0 flex flex-col fixed h-full z-30 border-r border-neutral-800">
            {/* Logo Area */}
            <div className="p-6 border-b border-neutral-800">
                <Link href="/" className="text-xl font-bold tracking-tighter uppercase block">
                    Let's Dance <span className="text-blue-600">Admin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="text-sm font-bold tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-neutral-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-white hover:bg-red-500/10 transition-colors">
                    <FaArrowRightFromBracket className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wide">Logout</span>
                </button>
            </div>
        </aside>
    );
}
