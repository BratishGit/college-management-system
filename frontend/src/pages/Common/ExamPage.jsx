import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, MapPin, AlertCircle, Plus, Info, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamPage = ({ user }) => {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('schedule');
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        subjectId: '',
        examDate: '',
        room: '',
        durationMinutes: 180
    });

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const endpoint = user.role === 'ADMIN' ? '/admin/exams' : '/student/dashboard';
            const res = await api.get(endpoint);

            if (user.role === 'ADMIN') {
                setExams(res.data || []);
                const subRes = await api.get('/courses?size=100');
                setSubjects(subRes.data.content || subRes.data || []);
            } else {
                setExams(res.data.examSchedules || []);
                setResults(res.data.results || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/exams', {
                ...formData,
                course: { id: formData.subjectId },
                examDate: new Date(formData.examDate).toISOString()
            });
            setModalOpen(false);
            fetchExams();
        } catch (err) {
            alert('Error creating exam schedule');
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Accessing Schedule...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Examination Hub</h1>
                    <p className="text-surface-500 font-medium">Verify your upcoming assessment timelines</p>
                </div>
                {user.role === 'ADMIN' ? (
                    <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Schedule Exam
                    </button>
                ) : (
                    <div className="flex bg-surface-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setActiveTab('schedule')}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
                        >
                            Schedule
                        </button>
                        <button 
                            onClick={() => setActiveTab('results')}
                            className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
                        >
                            Results
                        </button>
                    </div>
                )}
            </div>

            {activeTab === 'results' ? (
                <div className="card-premium overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                <th className="py-4 px-8">Course</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6">Marks</th>
                                <th className="py-4 px-6">Grade</th>
                                <th className="py-4 px-8 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {results.length === 0 ? (
                                <tr><td colSpan="5" className="py-10 text-center text-surface-400 font-bold">No results published yet.</td></tr>
                            ) : (
                                results.map((res, i) => (
                                    <tr key={i} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-4 px-8 font-bold text-surface-900">{res.course?.name}</td>
                                        <td className="py-4 px-6 text-xs font-black text-surface-500 uppercase">Sem {res.semester || res.course?.semester}</td>
                                        <td className="py-4 px-6 font-mono font-bold text-primary-600">{res.totalMarks} / 100</td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-black text-xs">{res.grade}</span>
                                        </td>
                                        <td className="py-4 px-8 text-right">
                                            {res.grade !== 'F' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">PASSED</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest">FAILED</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((exam, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -8 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-surface-200 shadow-sm relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-primary-600/10 transition-colors"></div>

                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                                    <Bell size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Duration</p>
                                    <p className="text-sm font-bold">{exam.durationMinutes} Mins</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-surface-900 mb-1">{exam.course?.name}</h3>
                                    <p className="text-xs font-black text-primary-600 tracking-[0.2em]">{exam.course?.code}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-surface-100">
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase"><Calendar size={12} /> Date</p>
                                        <p className="text-xs font-black">{new Date(exam.examDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="flex items-center gap-2 text-[10px] font-black text-surface-400 uppercase"><Clock size={12} /> Time</p>
                                        <p className="text-xs font-black">{new Date(exam.examDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-surface-50 flex items-center justify-center text-surface-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-xs font-black text-surface-700 uppercase tracking-widest">{exam.room}</span>
                                    </div>
                                    <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full tracking-tighter">CONFIRMED</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="card-premium py-20 text-center">
                    <AlertCircle className="text-surface-200 mx-auto mb-6" size={64} />
                    <h3 className="text-2xl font-black text-surface-900">No Exams Scheduled</h3>
                    <p className="text-surface-500 max-w-md mx-auto mt-2">The university hasn't published the assessment schedule for current semester subjects yet.</p>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[3rem] p-12 w-full max-w-xl shadow-2xl">
                            <h2 className="text-2xl font-black mb-10 tracking-tight">Schedule Examination</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Subject Selection</label>
                                    <select required className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}>
                                        <option value="">Select a Course...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Date & Time</label>
                                        <input required type="datetime-local" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.examDate} onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Exam Venue</label>
                                        <input required placeholder="e.g. LAB 4, BLOCK A" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Duration (Minutes)</label>
                                    <input required type="number" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.durationMinutes} onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-primary-600/30 hover:scale-[1.03] transition-transform active:scale-95 mt-4">PUBLISH EXAM SCHEDULE</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExamPage;
