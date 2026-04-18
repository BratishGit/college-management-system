import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalSubjects: 0,
        passRate: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    const data = [
        { name: 'Semester 1', pass: 85, fail: 15 },
        { name: 'Semester 2', pass: 78, fail: 22 },
        { name: 'Semester 3', pass: 92, fail: 8 },
        { name: 'Semester 4', pass: 88, fail: 12 },
    ];

    const pieData = [
        { name: 'O Grade', value: 20 },
        { name: 'A+ Grade', value: 35 },
        { name: 'A Grade', value: 25 },
        { name: 'B Grade', value: 15 },
        { name: 'F Grade', value: 5 },
    ];

    const COLORS = ['#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#ef4444'];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-surface-900">System Analytics</h1>
                <p className="text-surface-600">Executive overview of college academic performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="bg-primary-600" />
                <StatCard icon={GraduationCap} label="Total Faculty" value={stats.totalTeachers} color="bg-indigo-600" />
                <StatCard icon={BookOpen} label="Total Subjects" value={stats.totalSubjects} color="bg-violet-600" />
                <StatCard icon={TrendingUp} label="Avg. Pass Rate" value={`${stats.passRate.toFixed(1)}%`} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card-premium">
                    <h3 className="text-lg font-bold mb-6">Pass vs Fail Ratio (Semester-wise)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="pass" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="fail" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-premium">
                    <h3 className="text-lg font-bold mb-6">Grade Distribution (Total)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-6 border-b border-surface-200">
                    <h3 className="text-lg font-bold">Recent Academic Activity</h3>
                </div>
                <div className="divide-y divide-surface-100">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">JD</div>
                                <div>
                                    <p className="font-semibold">John Doe submitted marks</p>
                                    <p className="text-xs text-surface-500">Subject: Machine Learning (CS401)</p>
                                </div>
                            </div>
                            <span className="text-xs text-surface-400">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200 flex items-center gap-6">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shrink-0`}>
            <Icon size={28} />
        </div>
        <div>
            <p className="text-surface-500 text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
