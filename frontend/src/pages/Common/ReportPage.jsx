import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MessageSquare, Send, AlertTriangle, CheckCircle2, Search, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportPage = ({ user }) => {
    const [reports, setReports] = useState([]);
    const [students, setStudents] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        studentId: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // This is a simplified fetch; in a real app would have specific student-reports endpoints
            // For now, let's reuse dashboard data logic if possible or just show empty if no endpoint
            const res = await api.get(user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard');
            // Assuming reports are part of dashboard response (need to add to backend next)
            setReports(res.data.reports || []);

            if (user.role === 'TEACHER') {
                const stdRes = await api.get('/admin/students');
                setStudents(stdRes.data || []);
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
            await api.post(user.role === 'TEACHER' ? '/teacher/reports' : '/student/reports', {
                ...formData,
                student: user.role === 'TEACHER' ? { id: formData.studentId } : null
            });
            setModalOpen(false);
            fetchData();
            setFormData({ studentId: '', description: '' });
        } catch (err) {
            alert('Error submitting report');
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Loading correspondence...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">{user.role === 'TEACHER' ? 'Student Insight Reports' : 'Issue Resolution'}</h1>
                    <p className="text-surface-500 font-medium">{user.role === 'TEACHER' ? 'Flag student concerns or performance issues' : 'Report technical or academic issues'}</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <Send size={20} />
                    {user.role === 'TEACHER' ? 'Quick Report' : 'Submit Issue'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.length > 0 ? reports.map((report, i) => (
                    <div key={i} className="card-premium p-8 flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-2 flex-1">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-surface-900">{user.role === 'TEACHER' ? report.student?.name : 'Report Title'}</h4>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-surface-100 rounded-full">{report.status}</span>
                            </div>
                            <p className="text-sm text-surface-600 leading-relaxed italic">"{report.description}"</p>
                            <div className="pt-4 flex justify-between items-center text-[10px] font-black text-surface-400 uppercase tracking-widest">
                                <span>{new Date(report.reportedAt).toLocaleDateString()}</span>
                                <span className="text-primary-600">ID: #{report.id}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="md:col-span-2 card-premium py-20 text-center">
                        <MessageSquare className="text-surface-200 mx-auto mb-4" size={48} />
                        <p className="text-surface-500 font-medium">No recent reports or pending issues found.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
                            <h2 className="text-2xl font-black mb-8 tracking-tight">Submit Formal Report</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {user.role === 'TEACHER' && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Student</label>
                                        <select required className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}>
                                            <option value="">Select Student...</option>
                                            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>)}
                                        </select>
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-surface-400 tracking-widest pl-1">Narrative Description</label>
                                    <textarea required rows="6" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20 resize-none" placeholder="Provide full details of the issue..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                                <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary-600/20 hover:scale-[1.02] transition-transform">OFFICIAL SUBMISSION</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReportPage;
