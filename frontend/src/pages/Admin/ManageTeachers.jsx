import { useState, useEffect } from 'react';
import api from '../../services/api';
import { GraduationCap, UserPlus, Search, X, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        department: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await api.get('/teachers?size=100');
            setTeachers(res.data.content || res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/teachers/${editingId}`, formData);
            } else {
                await api.post('/teachers', formData);
            }
            setModalOpen(false);
            setEditingId(null);
            fetchTeachers();
            setFormData({ name: '', designation: '', department: '', username: '', password: '' });
        } catch (err) {
            console.error(err);
            alert('Error processing request: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                await api.delete(`/teachers/${id}`);
                fetchTeachers();
            } catch (err) {
                alert('Error deleting teacher');
            }
        }
    };

    const handleEdit = (teacher) => {
        setEditingId(teacher.id);
        setFormData({
            name: teacher.name,
            designation: teacher.designation,
            department: teacher.department,
            username: teacher.user.username,
            password: '' // Keep empty for security
        });
        setModalOpen(true);
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.department.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-surface-500">Loading teachers...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Manage Teachers</h1>
                    <p className="text-surface-600">View and manage faculty members</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ name: '', designation: '', department: '', username: '', password: '' }); setModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus size={20} />
                    Add Teacher
                </button>
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or department..."
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
                                <th className="py-4 px-6 font-semibold">Teacher Name</th>
                                <th className="py-4 px-6 font-semibold">Designation</th>
                                <th className="py-4 px-6 font-semibold">Department</th>
                                <th className="py-4 px-6 font-semibold">Username</th>
                                <th className="py-4 px-6 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                {teacher.name[0]}
                                            </div>
                                            <span className="font-medium text-surface-900">{teacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-surface-600">{teacher.designation}</td>
                                    <td className="py-4 px-6 text-surface-600">{teacher.department}</td>
                                    <td className="py-4 px-6 font-mono text-sm text-surface-500">{teacher.user.username}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(teacher)}
                                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(teacher.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
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
                                <h2 className="text-2xl font-bold">{editingId ? 'Edit Faculty' : 'Add New Faculty'}</h2>
                                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Full Name</label>
                                    <input required className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Designation</label>
                                        <input required className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Department</label>
                                        <input required className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Username</label>
                                    <input required disabled={!!editingId} className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                                </div>
                                {!editingId && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold">Password</label>
                                        <input required type="password" className="w-full p-3 rounded-xl bg-surface-50 border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </div>
                                )}
                                <button type="submit" className="w-full btn-primary py-4 rounded-xl mt-4">
                                    {editingId ? 'Save Changes' : 'Confirm Registration'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageTeachers;
