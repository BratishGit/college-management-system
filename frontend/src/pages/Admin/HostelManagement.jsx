import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Home, Users, Plus, X, Bed, Building2, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HostelManagement = () => {
    const [students, setStudents] = useState([]);
    const [hostelStudents, setHostelStudents] = useState([]);
    const [dayScholars, setDayScholars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hostel'); // hostel, day-scholars

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            const allStudents = res.data || [];
            setStudents(allStudents);

            // Separate hostel and day scholars
            const hostel = allStudents.filter(s => s.residentialStatus === 'HOSTEL');
            const dayScholar = allStudents.filter(s => s.residentialStatus === 'DAY_SCHOLAR');

            setHostelStudents(hostel);
            setDayScholars(dayScholar);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-surface-600 font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Residential Management</h1>
                    <p className="text-surface-500 font-medium">Manage hostel and day scholar students</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-surface-200">
                <button
                    onClick={() => setActiveTab('hostel')}
                    className={`px-6 py-3 font-bold text-sm transition-all relative ${activeTab === 'hostel'
                            ? 'text-primary-600'
                            : 'text-surface-400 hover:text-surface-600'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Building2 size={18} />
                        Hostel Students
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full text-xs font-black">
                            {hostelStudents.length}
                        </span>
                    </div>
                    {activeTab === 'hostel' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('day-scholars')}
                    className={`px-6 py-3 font-bold text-sm transition-all relative ${activeTab === 'day-scholars'
                            ? 'text-primary-600'
                            : 'text-surface-400 hover:text-surface-600'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Home size={18} />
                        Day Scholars
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs font-black">
                            {dayScholars.length}
                        </span>
                    </div>
                    {activeTab === 'day-scholars' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                        />
                    )}
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Building2}
                    label="Total Hostel Students"
                    value={hostelStudents.length}
                    color="bg-primary-600"
                />
                <StatCard
                    icon={Home}
                    label="Day Scholars"
                    value={dayScholars.length}
                    color="bg-indigo-600"
                />
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={students.length}
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={Bed}
                    label="Occupancy Rate"
                    value={students.length > 0 ? Math.round((hostelStudents.length / students.length) * 100) + '%' : '0%'}
                    color="bg-amber-600"
                />
            </div>

            {/* Content */}
            {activeTab === 'hostel' && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-surface-50">
                        <h3 className="font-bold text-lg">Hostel Residents</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                    <th className="py-4 px-8 text-left">Roll Number</th>
                                    <th className="py-4 px-6 text-left">Student Name</th>
                                    <th className="py-4 px-6 text-left">Department</th>
                                    <th className="py-4 px-6 text-left">Semester</th>
                                    <th className="py-4 px-6 text-left">Hostel</th>
                                    <th className="py-4 px-6 text-left">Room</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {hostelStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-4 px-8 font-mono font-bold text-primary-600">{student.rollNumber}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                                    {student.name[0]}
                                                </div>
                                                <span className="font-semibold">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-surface-600">{student.department}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 bg-surface-100 rounded-full text-xs font-bold">SEM {student.currentSemester}</span>
                                        </td>
                                        <td className="py-4 px-6 text-surface-600">
                                            {student.hostelAllocation?.room?.hostelName || 'Not Assigned'}
                                        </td>
                                        <td className="py-4 px-6 font-mono text-sm text-surface-600">
                                            {student.hostelAllocation?.room?.roomNumber || '-'}
                                        </td>
                                    </tr>
                                ))}
                                {hostelStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-surface-400">
                                            No hostel students found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'day-scholars' && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-surface-50">
                        <h3 className="font-bold text-lg">Day Scholar Students</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                    <th className="py-4 px-8 text-left">Roll Number</th>
                                    <th className="py-4 px-6 text-left">Student Name</th>
                                    <th className="py-4 px-6 text-left">Department</th>
                                    <th className="py-4 px-6 text-left">Semester</th>
                                    <th className="py-4 px-6 text-left">Transport Mode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {dayScholars.map((student) => (
                                    <tr key={student.id} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-4 px-8 font-mono font-bold text-indigo-600">{student.rollNumber}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                    {student.name[0]}
                                                </div>
                                                <span className="font-semibold">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-surface-600">{student.department}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 bg-surface-100 rounded-full text-xs font-bold">SEM {student.currentSemester}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.transportMode === 'BUS' ? 'bg-emerald-100 text-emerald-700' :
                                                    student.transportMode === 'OWN_VEHICLE' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-surface-100 text-surface-600'
                                                }`}>
                                                {student.transportMode || 'Not Set'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {dayScholars.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-surface-400">
                                            No day scholar students found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-200 transition-all hover:shadow-xl hover:-translate-y-1">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
            <Icon size={24} />
        </div>
        <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-surface-900">{value}</p>
    </div>
);

export default HostelManagement;
