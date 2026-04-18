import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Users, Save, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherMarksEntry = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

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

            // Initialize marks object
            const initialMarks = {};
            studentsList.forEach(s => {
                initialMarks[s.rollNumber] = { internal: '', external: '' };
            });
            setMarks(initialMarks);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (rollNumber, type, value) => {
        const numValue = parseFloat(value) || 0;
        const maxValue = type === 'internal' ? 40 : 60;

        if (numValue > maxValue) {
            setMessage({ type: 'error', text: `${type === 'internal' ? 'Internal' : 'External'} marks cannot exceed ${maxValue}` });
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        setMarks(prev => ({
            ...prev,
            [rollNumber]: {
                ...prev[rollNumber],
                [type]: value
            }
        }));
    };

    const submitMarks = async (rollNumber) => {
        const studentMarks = marks[rollNumber];
        const internal = parseFloat(studentMarks.internal);
        const external = parseFloat(studentMarks.external);

        if (!studentMarks.internal || !studentMarks.external) {
            setMessage({ type: 'error', text: 'Please enter both internal and external marks' });
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        if (internal > 40 || external > 60) {
            setMessage({ type: 'error', text: 'Marks exceed maximum allowed values' });
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        try {
            await api.post(`/teacher/marks?rollNumber=${rollNumber}&subjectId=${selectedSubject.id}&internal=${internal}&external=${external}`);
            setMessage({ type: 'success', text: `Marks saved for ${rollNumber}` });
            setTimeout(() => setMessage(null), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || 'Error saving marks' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const lockMarks = async (rollNumber) => {
        try {
            await api.post(`/teacher/marks/lock?rollNumber=${rollNumber}&subjectId=${selectedSubject.id}`);
            setMessage({ type: 'success', text: `Result locked for ${rollNumber}` });
            setTimeout(() => setMessage(null), 2000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Error locking marks' });
            setTimeout(() => setMessage(null), 2000);
        }
    };

    if (loading && subjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">Loading Subjects...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Marks Entry System</h1>
                    <p className="text-surface-500 font-medium">Enter and manage student examination marks</p>
                </div>
            </div>

            {!selectedSubject ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <motion.div
                            key={subject.id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => loadStudents(subject)}
                            className="card-premium p-8 cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-indigo-600/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-lg">
                                    <BookOpen size={28} />
                                </div>
                                <span className="text-[10px] font-black px-3 py-1.5 bg-surface-100 text-surface-600 rounded-full uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    SEM {subject.semester}
                                </span>
                            </div>

                            <h3 className="text-xl font-black text-surface-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {subject.name}
                            </h3>
                            <p className="text-surface-400 font-mono text-sm mb-6">{subject.code}</p>

                            <div className="flex items-center justify-between pt-6 border-t border-surface-100">
                                <div className="flex items-center gap-2 text-surface-400">
                                    <Users size={16} />
                                    <span className="text-xs font-bold">Enter Marks</span>
                                </div>
                                <span className="text-indigo-600 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="card-premium p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black mb-1">{selectedSubject.name}</h2>
                                <p className="text-indigo-100 font-mono text-sm">{selectedSubject.code} • Semester {selectedSubject.semester}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedSubject(null);
                                    setStudents([]);
                                    setMarks({});
                                }}
                                className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-bold text-sm transition-all"
                            >
                                ← Back to Subjects
                            </button>
                        </div>
                    </div>

                    <div className="card-premium overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surface-50 border-b border-surface-200">
                                        <th className="py-5 px-8 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Roll Number</span>
                                        </th>
                                        <th className="py-5 px-6 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Student Name</span>
                                        </th>
                                        <th className="py-5 px-6 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Internal (40)</span>
                                        </th>
                                        <th className="py-5 px-6 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">External (60)</span>
                                        </th>
                                        <th className="py-5 px-8 text-right">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-surface-400">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-100">
                                    {students.map((student) => (
                                        <tr key={student.id} className="group hover:bg-surface-50/50 transition-colors">
                                            <td className="py-5 px-8">
                                                <span className="font-mono font-bold text-indigo-600">{student.rollNumber}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                                        {student.name[0]}
                                                    </div>
                                                    <span className="font-bold text-surface-900">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="40"
                                                    step="0.5"
                                                    placeholder="0-40"
                                                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold"
                                                    value={marks[student.rollNumber]?.internal || ''}
                                                    onChange={(e) => handleMarkChange(student.rollNumber, 'internal', e.target.value)}
                                                />
                                            </td>
                                            <td className="py-5 px-6">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="60"
                                                    step="0.5"
                                                    placeholder="0-60"
                                                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-center font-bold"
                                                    value={marks[student.rollNumber]?.external || ''}
                                                    onChange={(e) => handleMarkChange(student.rollNumber, 'external', e.target.value)}
                                                />
                                            </td>
                                            <td className="py-5 px-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => submitMarks(student.rollNumber)}
                                                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                                                        title="Save Marks"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => lockMarks(student.rollNumber)}
                                                        className="p-3 bg-surface-800 text-white rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg"
                                                        title="Lock Result"
                                                    >
                                                        <Lock size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-4 z-[200] font-black text-sm tracking-wide ${message.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherMarksEntry;
