import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, Award, BookOpen, Clock, CheckCircle2, AlertCircle, TrendingUp, Calendar, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/student/dashboard');
            console.log('Dashboard data:', response.data);
            setData(response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-surface-600 font-medium font-mono animate-pulse text-sm uppercase tracking-widest">Loading Your Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-2xl mx-auto">
                <AlertCircle className="text-rose-600 mx-auto mb-4" size={48} />
                <h2 className="text-rose-700 font-bold text-xl mb-2">Unable to Load Dashboard</h2>
                <p className="text-rose-600">{error}</p>
                <button onClick={fetchDashboardData} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700">
                    Retry
                </button>
            </div>
        );
    }

    // Process Attendance Data
    const subjects = data?.subjects || [];
    const attendanceRecords = data?.attendance || [];

    const attendanceStats = subjects.map(sub => {
        const subjectAttendance = attendanceRecords.filter(a => a.subject?.id === sub.id);
        const totalClasses = subjectAttendance.length;
        const attended = subjectAttendance.filter(a => a.isPresent).length;
        const percent = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

        // Calculate classes needed to reach 75%
        const classesNeeded = totalClasses === 0 ? 0 : Math.max(0, Math.ceil((0.75 * totalClasses - attended) / 0.25));

        // Calculate classes can miss while maintaining 75%
        const canMiss = totalClasses === 0 ? 0 : Math.max(0, Math.floor((attended - 0.75 * totalClasses) / 0.75));

        return {
            name: sub.code || sub.name.substring(0, 10),
            fullName: sub.name,
            code: sub.code,
            attended,
            total: totalClasses,
            percent,
            classesNeeded,
            canMiss
        };
    });

    const overallAttendance = attendanceStats.length === 0 ? 0 :
        Math.round(attendanceStats.reduce((acc, curr) => acc + curr.percent, 0) / attendanceStats.length);

    const results = data?.results || [];
    const sgpa = data?.sgpa || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Welcome back, {data?.student?.name || 'Student'}!</h1>
                    <p className="text-surface-500 font-medium">Semester {data?.student?.currentSemester} | Roll: {data?.student?.rollNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-surface-200 flex items-center gap-3">
                        <TrendingUp className="text-primary-600" size={20} />
                        <div>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">SGPA</p>
                            <p className="text-lg font-bold text-surface-900">{sgpa.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-surface-200 flex items-center gap-3">
                        <ClipboardCheck className="text-emerald-600" size={20} />
                        <div>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Attendance</p>
                            <p className="text-lg font-bold text-surface-900">{overallAttendance}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Award} label="Current SGPA" value={sgpa.toFixed(2)} desc="Academic Performance" color="bg-primary-600" />
                <StatCard icon={BookOpen} label="Enrolled Courses" value={subjects.length} desc="Active this semester" color="bg-indigo-600" />
                <StatCard icon={Calendar} label="Upcoming Exams" value={data?.examSchedules?.length || 0} desc="Scheduled assessments" color="bg-amber-600" />
                <StatCard icon={Clock} label="Pending Requests" value={data?.leaves?.filter(l => l.status === 'PENDING').length || 0} desc="Leave applications" color="bg-rose-600" />
            </div>

            {attendanceStats.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Attendance Chart */}
                    <div className="lg:col-span-2 card-premium p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <TrendingUp className="text-primary-600" size={22} />
                                Subject-wise Attendance
                            </h3>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} height={50} interval={0} />
                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f8fafc' }}
                                        formatter={(value, name, props) => [
                                            `${value}% (${props.payload.attended}/${props.payload.total})`,
                                            props.payload.fullName
                                        ]}
                                    />
                                    <Bar dataKey="percent" radius={[6, 6, 0, 0]} barSize={40}>
                                        {attendanceStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.percent >= 75 ? '#6366f1' : '#f43f5e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 75% Rule Card */}
                    <div className="card-premium p-6 flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Attendance Insights</h3>
                            <p className="text-surface-500 text-sm mb-6">Maintain your 75% requirement</p>

                            <div className="space-y-6">
                                {attendanceStats.slice(0, 3).map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold text-surface-700">{stat.code}</span>
                                            <span className={`font-mono ${stat.percent >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.percent}%</span>
                                        </div>
                                        <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${stat.percent >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${stat.percent}%` }}></div>
                                        </div>
                                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter">
                                            {stat.percent >= 75
                                                ? `Can miss ${stat.canMiss} more classes`
                                                : `Need ${stat.classesNeeded} classes to reach 75%`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 flex justify-between items-center bg-surface-50/50">
                        <h3 className="font-bold text-xl">Examination Results</h3>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">SEMESTER {data?.student?.currentSemester}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-50/50 text-surface-400 text-[10px] font-black uppercase tracking-[0.15em]">
                                    <th className="py-5 px-8">Course Code</th>
                                    <th className="py-5 px-6">Subject Name</th>
                                    <th className="py-5 px-6">Credits</th>
                                    <th className="py-5 px-6">Internal</th>
                                    <th className="py-5 px-6">External</th>
                                    <th className="py-5 px-6">Total</th>
                                    <th className="py-5 px-6">Grade</th>
                                    <th className="py-5 px-8 text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {results.map((res, i) => (
                                    <tr key={i} className="group hover:bg-primary-50/30 transition-all">
                                        <td className="py-5 px-8 font-mono text-sm font-bold text-primary-600">{res.subject?.code || 'N/A'}</td>
                                        <td className="py-5 px-6 text-sm font-semibold text-surface-900">{res.subject?.name || 'Unknown'}</td>
                                        <td className="py-5 px-6 text-sm text-surface-500">{res.subject?.credits || '-'}</td>
                                        <td className="py-5 px-6 text-sm text-surface-600">{res.internalMarks}</td>
                                        <td className="py-5 px-6 text-sm text-surface-600">{res.externalMarks}</td>
                                        <td className="py-5 px-6 font-bold text-primary-600">{res.totalMarks}</td>
                                        <td className="py-5 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getGradeColor(res.grade)}`}>{res.grade}</span>
                                        </td>
                                        <td className="py-5 px-8 text-right font-black text-surface-900">{res.gradePoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {results.length === 0 && (
                <div className="card-premium text-center py-12">
                    <BookOpen className="text-surface-200 mx-auto mb-4" size={48} />
                    <h3 className="text-lg font-bold text-surface-900">No Results Available</h3>
                    <p className="text-surface-500">Your examination results will appear here once published.</p>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, desc, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-200 transition-all hover:shadow-xl hover:-translate-y-1 group">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-2xl font-black text-surface-900 leading-tight">{value}</p>
        <p className="text-[10px] text-surface-400 mt-1 font-medium italic">{desc}</p>
    </div>
);

const getGradeColor = (grade) => {
    switch (grade) {
        case 'O': return 'bg-emerald-100 text-emerald-700';
        case 'A+': return 'bg-cyan-100 text-cyan-700';
        case 'A': return 'bg-indigo-100 text-indigo-700';
        case 'B': return 'bg-amber-100 text-amber-700';
        case 'C': return 'bg-orange-100 text-orange-700';
        case 'F': return 'bg-rose-100 text-rose-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};

export default StudentDashboard;
