import { FaUserGroup, FaIndianRupeeSign, FaCircleExclamation, FaUpRightFromSquare } from 'react-icons/fa6';

const stats = [
    { title: 'Total Active Students', value: '428', change: '+12% this month', icon: FaUserGroup, color: 'blue' },
    { title: 'Monthly Revenue', value: '₹ 2.4L', change: '+5% vs last month', icon: FaIndianRupeeSign, color: 'green' },
    { title: 'Pending Dues', value: '₹ 45k', change: '12 Students', icon: FaCircleExclamation, color: 'orange' },
];

const recentActivity = [
    { id: 1, user: 'Rahul Sharma', action: 'Enrolled in', target: 'Hip Hop Regular Batch', time: '2 mins ago', type: 'enrollment' },
    { id: 2, user: 'Sneha Patel', action: 'Paid Fees', target: '₹ 2,500', time: '15 mins ago', type: 'payment' },
    { id: 3, user: 'Amit Verma', action: 'Marked Absent', target: 'Contemporary Batch', time: '1 hour ago', type: 'attendance' },
    { id: 4, user: 'Priya Singh', action: 'Registered for', target: 'Summer Intensive Workshop', time: '3 hours ago', type: 'enrollment' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-black">Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white border border-gray-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">
                        Download Report
                    </button>
                    <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-colors">
                        + New Enrollment
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-black text-black tracking-tight">{stat.value}</span>
                            <span className="text-green-600 text-xs font-bold mb-1.5 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold uppercase tracking-wide text-sm">Recent Activity</h3>
                        <button className="text-blue-600 text-xs font-bold uppercase hover:text-blue-800">View All</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'enrollment' ? 'bg-blue-500' :
                                            activity.type === 'payment' ? 'bg-green-500' : 'bg-orange-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            {activity.user} <span className="font-medium text-gray-500">{activity.action}</span> <span className="text-black">{activity.target}</span>
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Studio Status / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold uppercase tracking-wide text-sm mb-4 opacity-80">Live Now</h3>
                            <p className="text-2xl font-black mb-1">Hip Hop • Intermediate</p>
                            <p className="text-blue-100 text-sm mb-6">Sambhaji Nagar Branch • Started 20m ago</p>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-blue-400 border-2 border-blue-600"></div>
                                    ))}
                                </div>
                                <span className="text-xs font-bold ml-2">18 Students Present</span>
                            </div>
                        </div>
                        {/* Decoration */}
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold uppercase tracking-wide text-sm mb-4">Quick Shortcuts</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 bg-gray-50 hover:bg-black hover:text-white transition-colors rounded-xl flex flex-col items-center justify-center gap-2 text-center group">
                                <FaUserGroup className="text-gray-400 group-hover:text-white" />
                                <span className="text-xs font-bold">Add Student</span>
                            </button>
                            <button className="p-3 bg-gray-50 hover:bg-black hover:text-white transition-colors rounded-xl flex flex-col items-center justify-center gap-2 text-center group">
                                <FaIndianRupeeSign className="text-gray-400 group-hover:text-white" />
                                <span className="text-xs font-bold">Add Payment</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
