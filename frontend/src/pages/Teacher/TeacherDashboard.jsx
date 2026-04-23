import { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardCheck, MessageSquareQuote, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const TeacherDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashRes, leavesRes] = await Promise.all([
                    api.get('/teacher/dashboard'),
                    api.get('/leaves/all').catch(() => ({ data: [] }))
                ]);
                setDashboardData(dashRes.data);
                const allLeaves = Array.isArray(leavesRes.data) ? leavesRes.data : [];
                setPendingLeaves(allLeaves.filter(l => l.status === 'PENDING'));
            } catch (err) {
                console.error("Failed to load teacher dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleLeaveAction = async (leaveId, action) => {
        try {
            await api.patch(`/leaves/${leaveId}/workflow?action=${action}`);
            setPendingLeaves(prev => prev.filter(l => l.id !== leaveId));
        } catch (err) {
            console.error("Failed to process leave", err);
            alert('Failed to process leave request.');
        }
    };

    if (loading) return <div>Loading...</div>;

    const teacher = dashboardData?.teacher || {};
    const courses = dashboardData?.courses || [];
    const totalStudents = dashboardData?.totalStudents || 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Faculty Portal</h1>
                    <p className="text-surface-500 mt-1">Welcome back, {teacher.name || user?.username}!</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'My Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                    { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
                    { label: 'Pending Leaves', value: pendingLeaves.length.toString(), icon: ClipboardCheck, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
                    { label: 'Leave Balance', value: '--', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' }
                ].map((stat, i) => (
                    <div key={i} className="card flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-surface-500 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-surface-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h3 className="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
                            <Calendar className="text-primary-600" /> Today's Schedule
                        </h3>
                        <div className="space-y-4">
                            {courses.length > 0 ? courses.map((course, i) => (
                                <div key={i} className="flex gap-4 p-4 border border-surface-200 rounded-xl bg-surface-50">
                                    <div className="text-center min-w-[100px] border-r border-surface-200 pr-4 flex flex-col justify-center">
                                        <span className="font-bold text-surface-800">Sem {course.semester}</span>
                                        <span className="text-xs text-surface-500">{course.credits} Credits</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-xs font-bold px-2 py-0.5 rounded-md">{course.code}</span>
                                        </div>
                                        <h4 className="font-bold text-surface-900">{course.name}</h4>
                                    </div>
                                    <div className="ml-auto flex items-center">
                                        <button className="button-secondary text-sm">View Details</button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-surface-500 text-sm">No courses assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                            <MessageSquareQuote className="text-indigo-600" /> Pending Actions
                        </h3>
                        <div className="space-y-3">
                            {pendingLeaves.length > 0 ? pendingLeaves.slice(0, 5).map((leave) => (
                                <div key={leave.id} className="p-3 bg-surface-50 rounded-lg border border-surface-200">
                                    <p className="font-semibold text-surface-800">{leave.type || 'Leave'} Request</p>
                                    <p className="text-sm text-surface-500 mb-1">{leave.user?.username || 'Student'} — {leave.reason}</p>
                                    <p className="text-xs text-surface-400 mb-2">
                                        {leave.startDate} → {leave.endDate}
                                    </p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleLeaveAction(leave.id, 'APPROVE')}
                                            className="flex items-center gap-1 text-xs font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/40 transition-colors"
                                        >
                                            <CheckCircle size={14} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleLeaveAction(leave.id, 'REJECT')}
                                            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/40 transition-colors"
                                        >
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6">
                                    <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                                    <p className="text-sm text-surface-500 font-medium">All caught up!</p>
                                    <p className="text-xs text-surface-400">No pending leave requests.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
