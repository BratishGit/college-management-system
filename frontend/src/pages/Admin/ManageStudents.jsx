import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, UserPlus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        department: '',
        currentSemester: '1',
        username: '',
        password: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/students', formData);
            setModalOpen(false);
            fetchStudents();
            setFormData({ name: '', rollNumber: '', department: '', currentSemester: '1', username: '', password: '' });
        } catch (err) {
            alert('Error adding student');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-surface-500">Loading students...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Manage Students</h1>
                    <p className="text-surface-600">View and manage all registered students</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Add Student
                </button>
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or roll number..."
                            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-surface-500 text-sm border-b border-surface-100">
                                <th className="py-4 px-6 font-semibold">Roll Number</th>
                                <th className="py-4 px-6 font-semibold">Student Name</th>
                                <th className="py-4 px-6 font-semibold">Department</th>
                                <th className="py-4 px-6 font-semibold">Semester</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="py-4 px-6 font-mono font-medium text-primary-600">{student.rollNumber}</td>
                                    <td className="py-4 px-6">{student.name}</td>
                                    <td className="py-4 px-6 text-surface-600">{student.department}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-surface-100 rounded-full text-xs font-bold text-surface-700">SEM {student.currentSemester}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModalOpen(false)}
                            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Add New Student</h2>
                                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Full Name</label>
                                        <input required name="name" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Roll Number</label>
                                        <input required name="rollNumber" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Department</label>
                                        <input required name="department" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Semester</label>
                                        <select className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.currentSemester} onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Username</label>
                                    <input required name="username" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Password</label>
                                    <input required type="password" name="password" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full btn-primary py-4 rounded-xl mt-4">Confirm Registration</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageStudents;
