import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClipboardCheck, Search, Filter, CheckCircle2, XCircle, Calendar, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendancePage = ({ user }) => {
    const [records, setRecords] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const endpoint = user.role === 'ADMIN' ? '/admin/attendance' :
                user.role === 'TEACHER' ? '/teacher/subjects' : '/student/dashboard';
            const res = await api.get(endpoint);

            if (user.role === 'STUDENT') {
                setRecords(res.data.attendance || []);
                setSubjects(res.data.subjects || []);
            } else if (user.role === 'ADMIN') {
                setRecords(res.data || []);
            } else {
                setSubjects(res.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Fetching Logs...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Attendance Ledger</h1>
                    <p className="text-surface-500 font-medium">Digital records for all academic lectures</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className="pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 w-64"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {user.role === 'STUDENT' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(sub => {
                        const subRecords = records.filter(r => r.subject?.id === sub.id);
                        const present = subRecords.filter(r => r.isPresent).length;
                        const percent = subRecords.length === 0 ? 0 : Math.round((present / subRecords.length) * 100);

                        return (
                            <div key={sub.id} className="card-premium p-6 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-bold">
                                        {percent}%
                                    </div>
                                    <span className="text-[10px] font-black bg-surface-50 px-3 py-1 rounded-full uppercase tracking-tighter">Semester {sub.semester}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{sub.name}</h3>
                                <p className="text-xs text-surface-400 font-mono mb-6">{sub.code}</p>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black text-surface-400 uppercase tracking-widest">
                                        <span>Present: {present}</span>
                                        <span>Total: {subRecords.length}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${percent >= 75 ? 'bg-primary-500' : 'bg-rose-500'}`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="card-premium overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                <th className="py-4 px-8">Student / Roll</th>
                                <th className="py-4 px-6">Subject</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Status</th>
                                {user.role === 'ADMIN' && <th className="py-4 px-8 text-right">Verification</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {records.filter(r =>
                                r.student?.name?.toLowerCase().includes(filter.toLowerCase()) ||
                                r.subject?.name?.toLowerCase().includes(filter.toLowerCase())
                            ).map((r, i) => (
                                <tr key={i} className="hover:bg-surface-50 transition-colors">
                                    <td className="py-4 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-[10px] font-bold">ST</div>
                                            <div>
                                                <p className="text-sm font-bold text-surface-900">{r.student?.name}</p>
                                                <p className="text-[10px] text-surface-400 font-mono">{r.student?.rollNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-sm font-semibold">{r.subject?.name}</p>
                                        <p className="text-[10px] text-surface-400 font-mono">{r.subject?.code}</p>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-surface-500 font-medium">
                                        {r.date}
                                    </td>
                                    <td className="py-4 px-6">
                                        {r.isPresent ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 size={12} /> PRESENT
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <XCircle size={12} /> ABSENT
                                            </span>
                                        )}
                                    </td>
                                    {user.role === 'ADMIN' && (
                                        <td className="py-4 px-8 text-right">
                                            <button className="text-primary-600 font-bold text-xs hover:underline">Rectify</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;
