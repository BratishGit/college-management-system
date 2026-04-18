import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Plus, Search } from 'lucide-react';

const ManageSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/admin/subjects');
            setSubjects(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="p-8 text-center text-surface-500">Loading subjects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900">Manage Subjects</h1>
                    <p className="text-surface-600">Configure curriculum and assign faculty</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Subject
                </button>
            </div>

            <div className="card-premium overflow-hidden">
                <div className="p-4 border-b border-surface-200 bg-surface-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                        <input type="text" placeholder="Search by code or name..." className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-surface-200 outline-none focus:ring-2 focus:ring-primary-500/20" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-surface-500 text-sm border-b border-surface-100">
                                <th className="py-4 px-6 font-semibold">Code</th>
                                <th className="py-4 px-6 font-semibold">Subject Name</th>
                                <th className="py-4 px-6 font-semibold">Credits</th>
                                <th className="py-4 px-6 font-semibold">Semester</th>
                                <th className="py-4 px-6 font-semibold">Assigned Teacher</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="py-4 px-6 font-mono font-medium text-indigo-600">{subject.code}</td>
                                    <td className="py-4 px-6 font-medium">{subject.name}</td>
                                    <td className="py-4 px-6 text-surface-600 font-bold">{subject.credits}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">SEM {subject.semester}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {subject.teacher ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center text-[10px] font-bold">
                                                    {subject.teacher.name[0]}
                                                </div>
                                                <span className="text-sm text-surface-700">{subject.teacher.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-red-500 italic">Not Assigned</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageSubjects;
