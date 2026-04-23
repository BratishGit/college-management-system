import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Users, CheckCircle2, XCircle, Calendar, Save, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherAttendance = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            calculateStats();
        }
    }, [attendance, selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/teacher/subjects');
            setSubjects(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStudents = async (subject) => {
        setSelectedSubject(subject);
        setLoading(true);
        try {
            const res = await api.get(`/teacher/students/${subject.semester}`);
            const studentsList = Array.isArray(res.data) ? res.data : [];
            setStudents(studentsList);

            // Initialize all as present by default
            const initialAttendance = {};
            studentsList.forEach(s => {
                initialAttendance[s.rollNumber] = true;
            });
            setAttendance(initialAttendance);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleAttendance = (rollNumber) => {
        setAttendance(prev => ({
            ...prev,
            [rollNumber]: !prev[rollNumber]
        }));
    };

    const markAll = (status) => {
        const newAttendance = {};
        students.forEach(s => {
            newAttendance[s.rollNumber] = status;
        });
        setAttendance(newAttendance);
    };

    const calculateStats = () => {
        const present = Object.values(attendance).filter(v => v === true).length;
        const total = Object.keys(attendance).length;
        const absent = total - present;
        setStats({ present, absent, total });
    };

    const saveAttendance = async () => {
        setSaving(true);
        const payload = students.map(s => ({
            studentId: s.id,
            courseId: selectedSubject.id,
            date: new Date().toISOString().split('T')[0],
            isPresent: attendance[s.rollNumber]
        }));

        try {
            await api.post('/teacher/attendance', payload);
            setMessage({ type: 'success', text: `Attendance saved! ${stats.present} Present, ${stats.absent} Absent` });
            setTimeout(() => {
                setSelectedSubject(null);
                setStudents([]);
                setAttendance({});
            }, 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save attendance. Please try again.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">Loading Classes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Attendance Management</h1>
                    <p className="text-surface-500 font-medium">Select a class to mark attendance</p>
                </div>
                {selectedSubject && (
                    <div className="flex items-center gap-4">
                        <div className="px-6 py-3 bg-white rounded-2xl border border-surface-200 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Present</p>
                                    <p className="text-2xl font-black text-emerald-600">{stats.present}</p>
                                </div>
                                <div className="w-px h-10 bg-surface-200"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Absent</p>
                                    <p className="text-2xl font-black text-rose-600">{stats.absent}</p>
                                </div>
                                <div className="w-px h-10 bg-surface-200"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Total</p>
                                    <p className="text-2xl font-black text-surface-900">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!selectedSubject ? (
                /* Subject Selection */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <motion.div
                            key={subject.id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => loadStudents(subject)}
                            className="card-premium p-8 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-primary-600/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                    <BookOpen size={28} />
                                </div>
                                <span className="text-[10px] font-black px-3 py-1.5 bg-surface-100 text-surface-600 rounded-full uppercase tracking-widest group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                    SEM {subject.semester}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-surface-900 mb-2 group-hover:text-primary-600 transition-colors">
                                {subject.name}
                            </h3>
                            <p className="text-surface-400 font-mono text-sm mb-6">{subject.code}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-surface-100">
                                <div className="flex items-center gap-2 text-surface-400">
                                    <Users size={16} />
                                    <span className="text-xs font-bold">Mark Attendance</span>
                                </div>
                                <span className="text-primary-600 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Attendance Marking Interface */
                <div className="space-y-6">
                    {/* Class Header */}
                    <div className="card-premium p-8 bg-gradient-to-br from-primary-600 to-indigo-600 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black mb-1">{selectedSubject.name}</h2>
                                <p className="text-primary-100 font-mono text-sm">{selectedSubject.code} • Semester {selectedSubject.semester}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => markAll(true)}
                                    className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <CheckCircle2 size={18} />
                                    Mark All Present
                                </button>
                                <button
                                    onClick={() => markAll(false)}
                                    className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <XCircle size={18} />
                                    Mark All Absent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="card-premium overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 border-b border-surface-200">
                                    <th className="py-5 px-8 text-left">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Roll Number</span>
                                    </th>
                                    <th className="py-5 px-6 text-left">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Student Name</span>
                                    </th>
                                    <th className="py-5 px-6 text-left">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Mentor</span>
                                    </th>
                                    <th className="py-5 px-8 text-center">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Attendance</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {students.map((student, index) => {
                                    const isPresent = attendance[student.rollNumber];
                                    return (
                                        <tr key={student.id} className="group hover:bg-surface-50/50 transition-colors">
                                            <td className="py-5 px-8">
                                                <span className="font-mono font-bold text-primary-600">{student.rollNumber}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                                                        {student.name[0]}
                                                    </div>
                                                    <span className="font-bold text-surface-900">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-sm text-surface-500">{student.mentor?.name || 'Not Assigned'}</span>
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => setAttendance(prev => ({ ...prev, [student.rollNumber]: true }))}
                                                        className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-md ${isPresent
                                                                ? 'bg-emerald-600 text-white scale-105'
                                                                : 'bg-surface-100 text-surface-400 hover:bg-emerald-50 hover:text-emerald-600'
                                                            }`}
                                                    >
                                                        P
                                                    </button>
                                                    <button
                                                        onClick={() => setAttendance(prev => ({ ...prev, [student.rollNumber]: false }))}
                                                        className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-md ${!isPresent
                                                                ? 'bg-rose-600 text-white scale-105'
                                                                : 'bg-surface-100 text-surface-400 hover:bg-rose-50 hover:text-rose-600'
                                                            }`}
                                                    >
                                                        A
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={saveAttendance}
                            disabled={saving}
                            className="flex-1 py-5 bg-primary-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-primary-600/30 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    SAVING...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    SAVE ATTENDANCE
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setSelectedSubject(null);
                                setStudents([]);
                                setAttendance({});
                            }}
                            className="px-12 py-5 bg-surface-100 text-surface-600 rounded-2xl font-black text-sm hover:bg-surface-200 transition-colors"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-4 z-[200] font-black text-sm tracking-wide ${message.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherAttendance;
