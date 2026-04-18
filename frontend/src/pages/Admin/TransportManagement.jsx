import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bus, MapPin, Clock, Users, Phone, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const TransportManagement = () => {
    const [students, setStudents] = useState([]);
    const [busStudents, setBusStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            const allStudents = res.data || [];
            setStudents(allStudents);

            // Filter students using bus transport
            const busUsers = allStudents.filter(s => s.transportMode === 'BUS');
            setBusStudents(busUsers);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Mock bus routes data (would come from backend in production)
    const busRoutes = [
        {
            id: 1,
            routeName: 'Route A - North Campus',
            busNumber: 'KA-01-AB-1234',
            driverName: 'Rajesh Kumar',
            driverContact: '+91 98765 43210',
            capacity: 50,
            departureTime: '7:30 AM',
            stops: 'MG Road, Indiranagar, Koramangala, College'
        },
        {
            id: 2,
            routeName: 'Route B - South Campus',
            busNumber: 'KA-01-CD-5678',
            driverName: 'Suresh Patel',
            driverContact: '+91 98765 43211',
            capacity: 45,
            departureTime: '7:45 AM',
            stops: 'Jayanagar, BTM, Banashankari, College'
        },
        {
            id: 3,
            routeName: 'Route C - East Campus',
            busNumber: 'KA-01-EF-9012',
            driverName: 'Amit Sharma',
            driverContact: '+91 98765 43212',
            capacity: 40,
            departureTime: '8:00 AM',
            stops: 'Whitefield, Marathahalli, HSR Layout, College'
        }
    ];

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
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Transport Management</h1>
                    <p className="text-surface-500 font-medium">Manage college bus routes and student transport</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add New Route
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={Bus}
                    label="Active Routes"
                    value={busRoutes.length}
                    color="bg-primary-600"
                />
                <StatCard
                    icon={Users}
                    label="Bus Users"
                    value={busStudents.length}
                    color="bg-indigo-600"
                />
                <StatCard
                    icon={MapPin}
                    label="Total Stops"
                    value={busRoutes.reduce((acc, route) => acc + route.stops.split(',').length, 0)}
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={Clock}
                    label="Daily Trips"
                    value={busRoutes.length * 2}
                    color="bg-amber-600"
                />
            </div>

            {/* Bus Routes */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-surface-900">Bus Routes</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {busRoutes.map((route) => (
                        <motion.div
                            key={route.id}
                            whileHover={{ y: -4 }}
                            className="card-premium p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-lg">
                                        <Bus size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-surface-900">{route.routeName}</h3>
                                        <p className="text-surface-400 font-mono text-sm">{route.busNumber}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">ACTIVE</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="text-surface-400" size={16} />
                                    <span className="text-surface-600">Departure: <span className="font-bold text-surface-900">{route.departureTime}</span></span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <Users className="text-surface-400" size={16} />
                                    <span className="text-surface-600">Capacity: <span className="font-bold text-surface-900">{route.capacity} seats</span></span>
                                </div>

                                <div className="flex items-start gap-3 text-sm">
                                    <MapPin className="text-surface-400 mt-0.5 shrink-0" size={16} />
                                    <span className="text-surface-600 leading-relaxed">{route.stops}</span>
                                </div>

                                <div className="pt-4 border-t border-surface-100">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="text-surface-400" size={16} />
                                        <div>
                                            <p className="text-surface-600">Driver: <span className="font-bold text-surface-900">{route.driverName}</span></p>
                                            <p className="text-surface-400 text-xs font-mono">{route.driverContact}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Students Using Bus */}
            <div className="card-premium overflow-hidden">
                <div className="p-6 border-b border-surface-200 bg-surface-50">
                    <h3 className="font-bold text-lg">Students Using College Transport</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                <th className="py-4 px-8 text-left">Roll Number</th>
                                <th className="py-4 px-6 text-left">Student Name</th>
                                <th className="py-4 px-6 text-left">Department</th>
                                <th className="py-4 px-6 text-left">Semester</th>
                                <th className="py-4 px-6 text-left">Residential Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {busStudents.map((student) => (
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
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.residentialStatus === 'HOSTEL' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {student.residentialStatus || 'Not Set'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {busStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-surface-400">
                                        No students using bus transport
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
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

export default TransportManagement;
