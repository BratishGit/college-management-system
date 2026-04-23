import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Calendar, AlertCircle, Briefcase, GraduationCap, FileText } from 'lucide-react';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/student/dashboard');
                setDashboardData(res.data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div>Loading...</div>;

    const student = dashboardData?.student || {};
    const subjects = dashboardData?.subjects || [];
    const attendance = dashboardData?.attendance || [];
    
    // Calculate CGPA if results exist
    let cgpa = "0.00";
    if (dashboardData?.results && dashboardData.results.length > 0) {
        const totalPoints = dashboardData.results.reduce((acc, curr) => acc + (curr.gradePoints || 0), 0);
        cgpa = (totalPoints / dashboardData.results.length).toFixed(2);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-primary-600 to-indigo-700 text-white flex flex-col md:flex-row justify-between items-center rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #3730a3 100%)' }}>
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl font-bold border border-white/30 shadow-inner text-white">
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-1 text-white">Welcome back, {student.name || user?.username}!</h1>
                        <p className="text-indigo-200 text-lg flex items-center gap-2">
                            <GraduationCap size={20} /> Semester {student.currentSemester || 1} | {student.department || 'Department'}
                        </p>
                    </div>
                </div>
                <div className="mt-6 md:mt-0 bg-white/15 p-4 rounded-xl border border-white/20 text-center min-w-[200px]">
                    <p className="text-sm text-indigo-200 uppercase tracking-widest font-semibold mb-1">Current CGPA</p>
                    <p className="text-4xl font-bold text-white">{cgpa}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Courses */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-surface-900 flex items-center gap-2">
                                <BookOpen className="text-primary-600" /> My Enrolled Courses
                            </h3>
                            <button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subjects.length > 0 ? subjects.map((course, i) => {
                                const courseAttendance = attendance.filter(a => a.course.id === course.id);
                                const presentCount = courseAttendance.filter(a => a.isPresent).length;
                                const attendancePercent = courseAttendance.length > 0 
                                    ? Math.round((presentCount / courseAttendance.length) * 100) : 0;
                                
                                return (
                                    <div key={i} className="p-4 border border-surface-200 rounded-xl hover:border-primary-300 transition-colors bg-surface-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">{course.code}</span>
                                            <span className="text-surface-500 text-xs font-semibold">{course.credits} Credits</span>
                                        </div>
                                        <h4 className="font-semibold text-surface-800">{course.name}</h4>
                                        <div className="w-full bg-surface-200 rounded-full h-1.5 mt-4">
                                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${attendancePercent}%` }}></div>
                                        </div>
                                        <p className="text-xs text-surface-500 mt-2 text-right">{attendancePercent}% Attendance</p>
                                    </div>
                                )
                            }) : (
                                <p className="text-surface-500 text-sm">No courses enrolled for this semester.</p>
                            )}
                        </div>
                    </div>

                    {/* Placements */}
                    <div className="card p-6 border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                                <Briefcase className="text-purple-600" /> Upcoming Placement Drives
                            </h3>
                        </div>
                        <div className="bg-surface-50 p-4 rounded-xl border border-surface-200 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg text-surface-900">Infosys</h4>
                                <p className="text-sm text-surface-500">Software Engineer • 6.5 LPA</p>
                            </div>
                            <button className="button-primary bg-purple-600 hover:bg-purple-700">Apply Now</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Alerts/Upcoming */}
                    <div className="card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-100 dark:border-orange-900/40">
                        <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="text-orange-500" /> Reminders
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-surface-50 p-3 rounded-lg shadow-sm border border-orange-200 dark:border-orange-800/40 flex items-start gap-3">
                                <Calendar className="text-orange-400" size={16} />
                                <div>
                                    <p className="text-sm font-semibold text-surface-800">Fee Payment Due</p>
                                    <p className="text-xs text-surface-500">₹25,000 pending by 30th May</p>
                                </div>
                            </div>
                            <div className="bg-surface-50 p-3 rounded-lg shadow-sm border border-red-200 dark:border-red-800/40 flex items-start gap-3">
                                <FileText className="text-red-400" size={16} />
                                <div>
                                    <p className="text-sm font-semibold text-surface-800">DBMS Assignment</p>
                                    <p className="text-xs text-surface-500">Submission tomorrow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
