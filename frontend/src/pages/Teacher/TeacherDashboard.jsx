import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Users, Edit3, Save, CheckCircle2, AlertCircle, Calendar, PlusCircle, Search, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherDashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendanceMode, setAttendanceMode] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/teacher/dashboard');
            setDashData(res.data);
            setSubjects(res.data.subjects || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async (sub) => {
        setSelectedSubject(sub);
        setAttendanceMode(true);
        try {
            const res = await api.get(`/teacher/students/${sub.semester}`);
            const studentsList = Array.isArray(res.data) ? res.data : [];
            setStudents(studentsList);
            // Default all to present
            const initial = {};
            studentsList.forEach(s => initial[s.rollNumber] = true);
            setAttendanceData(initial);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleAttendance = (roll) => {
        setAttendanceData(prev => ({ ...prev, [roll]: !prev[roll] }));
    };

    const submitAttendance = async () => {
        const payload = students.map(s => ({
            student: { id: s.id },
            subject: { id: selectedSubject.id },
            date: new Date().toISOString().split('T')[0],
            isPresent: attendanceData[s.rollNumber]
        }));

        try {
            await api.post('/teacher/attendance', payload);
            setMsg({ type: 'success', text: 'Attendance recorded successfully!' });
            setAttendanceMode(false);
            setSelectedSubject(null);
        } catch (err) {
            setMsg({ type: 'error', text: 'Roll-back error: Unable to sync attendance.' });
        }
        setTimeout(() => setMsg(null), 3000);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-surface-600 font-bold tracking-widest text-xs uppercase">Initializing Faculty Portal...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Faculty Welcome */}
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-surface-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl translate-x-20 -translate-y-20"></div>
                <div className="z-10">
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">System Portal: Academic Faculty</h1>
                    <p className="text-surface-500 font-medium mt-1">Logged in as Prof. {dashData?.teacher?.name} ({dashData?.teacher?.department})</p>
                </div>
                <div className="flex gap-4 z-10">
                    <button className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary-600/20 hover:scale-105 transition-transform flex items-center gap-2">
                        <PlusCircle size={18} />
                        Publish Result
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Subjects List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-surface-900 flex items-center gap-2">
                            <BookOpen size={24} className="text-primary-600" />
                            Assigned Courses
                        </h2>
                        <span className="text-xs font-black px-3 py-1 bg-primary-50 text-primary-600 rounded-full">{subjects.length} ACTIVE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {subjects.map(sub => (
                            <motion.div
                                key={sub.id}
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                                onClick={() => loadStudents(sub)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                                        <ClipboardList size={24} />
                                    </div>
                                    <span className="text-[10px] font-black tracking-widest text-surface-400 bg-surface-50 px-3 py-1 rounded-full uppercase group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">Semester {sub.semester}</span>
                                </div>
                                <h3 className="font-bold text-lg text-surface-900 group-hover:text-primary-600 transition-colors">{sub.name}</h3>
                                <p className="text-surface-400 font-mono text-xs mt-1 mb-6">{sub.code}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-surface-100">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-surface-200"></div>)}
                                        <div className="w-6 h-6 rounded-full border-2 border-white bg-primary-100 text-[8px] flex items-center justify-center font-bold text-primary-600">+45</div>
                                    </div>
                                    <span className="text-xs font-bold text-surface-400 group-hover:text-primary-600 transition-colors">Manage &rarr;</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Quick Insights */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-xl font-black text-surface-900 flex items-center gap-2">
                        <Calendar size={24} className="text-primary-600" />
                        Activity
                    </h2>
                    <div className="bg-white rounded-[2rem] border border-surface-200 shadow-sm p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-surface-400 font-bold uppercase tracking-tighter">Attendance Delta</p>
                                    <p className="text-sm font-bold text-surface-900">4 Students below 75%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-surface-400 font-bold uppercase tracking-tighter">Leave Notices</p>
                                    <p className="text-sm font-bold text-surface-900">2 New pending requests</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-surface-900 rounded-2xl text-white">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Next Scheduled Lecture</p>
                            <h4 className="font-bold text-lg leading-tight mb-4">CS401: Cloud Computing Architecture</h4>
                            <div className="flex justify-between items-center text-[10px] font-black opacity-80 border-t border-white/10 pt-4">
                                <span>10:30 AM - 12:00 PM</span>
                                <span className="bg-primary-500 px-2 py-1 rounded">ROOM 412</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Overlay Modal */}
            <AnimatePresence>
                {attendanceMode && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setAttendanceMode(false)}
                            className="absolute inset-0 bg-surface-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[3rem] p-8 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.2)]"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-surface-900">{selectedSubject?.name}</h2>
                                    <p className="text-surface-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest mt-1">
                                        <Calendar size={14} /> Marking Attendance for Today
                                    </p>
                                </div>
                                <button onClick={() => setAttendanceMode(false)} className="p-4 hover:bg-surface-50 rounded-3xl transition-colors">
                                    <X size={24} className="text-surface-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {students.map(s => (
                                        <div
                                            key={s.rollNumber}
                                            onClick={() => toggleAttendance(s.rollNumber)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between group ${attendanceData[s.rollNumber] ? 'bg-emerald-50 border-emerald-500/30' : 'bg-rose-50 border-rose-500/30'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${attendanceData[s.rollNumber] ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                    {s.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors truncate w-32">{s.name}</p>
                                                    <p className="text-[10px] font-mono text-surface-400">{s.rollNumber}</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${attendanceData[s.rollNumber] ? 'bg-emerald-500 border-emerald-500' : 'border-rose-300 bg-white'}`}>
                                                {attendanceData[s.rollNumber] && <CheckCircle2 size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-surface-100">
                                <button onClick={submitAttendance} className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-600/30 hover:scale-[1.02] transition-transform active:scale-95">CONFIRM & SAVE ATTENDANCE</button>
                                <button onClick={() => setAttendanceMode(false)} className="px-8 py-4 bg-surface-50 text-surface-600 rounded-2xl font-black text-sm hover:bg-surface-100 transition-colors">CANCEL</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Global Feedbacks */}
            {msg && (
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-4 z-[200] font-black text-sm tracking-wide ${msg.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    <CheckCircle2 size={24} />
                    {msg.text}
                </motion.div>
            )}
        </div>
    );
};

const X = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default TeacherDashboard;
