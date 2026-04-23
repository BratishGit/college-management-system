import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Mail, Plus, X, Calendar, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeavePage = ({ user }) => {
    const [leaves, setLeaves] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        type: 'PERSONAL',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            // If admin, fetch all. If student/teacher, fetch "my-leaves".
            const endpoint = user.role === 'STUDENT' ? '/leaves/my-leaves' : '/leaves/all';
            // Wait, does backend have /leaves/all? Let me check LeaveRequestService.
            const res = await api.get(endpoint);
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', null, {
                params: {
                    reason: formData.reason,
                    type: formData.type,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                }
            });
            setModalOpen(false);
            fetchLeaves();
            setFormData({ startDate: '', endDate: '', type: 'PERSONAL', reason: '' });
        } catch (err) {
            alert('Error submitting leave request');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            // Backend uses action param: APPROVED or REJECTED
            await api.patch(`/leaves/${id}/workflow`, null, {
                params: { action: status }
            });
            fetchLeaves();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Loading requests...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Leave Management</h1>
                    <p className="text-surface-500 font-medium">Submit and track absence requests</p>
                </div>
                {user.role !== 'ADMIN' && (
                    <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        New Request
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaves.map((leave, i) => (
                    <div key={i} className="card-premium p-8 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -translate-y-12 translate-x-12 ${getStatusColor(leave.status)}`}></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${getStatusColor(leave.status, true)}`}>
                                <Clock size={24} />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(leave.status, true)}`}>
                                {leave.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">Type of Leave</p>
                                <h3 className="font-bold text-lg text-surface-900">{leave.type}</h3>
                            </div>

                            <div className="flex items-center gap-4 py-4 border-y border-surface-100">
                                <div>
                                    <p className="text-[10px] font-black text-surface-400 uppercase">From</p>
                                    <p className="text-sm font-bold">{leave.startDate}</p>
                                </div>
                                <ChevronRight className="text-surface-200" size={16} />
                                <div>
                                    <p className="text-[10px] font-black text-surface-400 uppercase">To</p>
                                    <p className="text-sm font-bold">{leave.endDate}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">Reason</p>
                                <p className="text-sm text-surface-600 line-clamp-2 italic">"{leave.reason}"</p>
                            </div>

                            {(user.role === 'ADMIN' || user.role === 'TEACHER') && leave.status === 'PENDING' && (
                                <div className="flex gap-2 pt-4">
                                    <button onClick={() => updateStatus(leave.id, 'APPROVED')} className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20">Approve</button>
                                    <button onClick={() => updateStatus(leave.id, 'REJECTED')} className="flex-1 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20">Reject</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl">
                            <h2 className="text-2xl font-black mb-8">Create Leave Request</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-surface-400">Start Date</label>
                                        <input required type="date" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase text-surface-400">End Date</label>
                                        <input required type="date" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-surface-400">Leave Type</label>
                                    <select className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="PERSONAL">Personal/Casual</option>
                                        <option value="MEDICAL">Medical Emergency</option>
                                        <option value="ACADEMIC">Academic Event</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-black uppercase text-surface-400">Detailed Reason</label>
                                    <textarea required rows="4" className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-600/20 resize-none" placeholder="Explain your absence..." value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}></textarea>
                                </div>
                                <button type="submit" className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary-600/20 hover:scale-[1.02] transition-transform">SUBMIT REQUEST</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const getStatusColor = (status, isText = false) => {
    switch (status) {
        case 'PENDING': return isText ? 'bg-amber-100 text-amber-700' : 'bg-amber-500';
        case 'APPROVED': return isText ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500';
        case 'REJECTED': return isText ? 'bg-rose-100 text-rose-700' : 'bg-rose-500';
        default: return 'bg-surface-500';
    }
};

export default LeavePage;
