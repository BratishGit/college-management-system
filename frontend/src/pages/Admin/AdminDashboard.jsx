import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, GraduationCap, BookOpen, AlertCircle, TrendingUp, ArrowUpRight, Zap, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [hardestCourses, setHardestCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const metricsRes = await api.get('/analytics/dashboard');
                setMetrics(metricsRes.data);
                
                const coursesRes = await api.get('/analytics/hardest-courses');
                setHardestCourses(coursesRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin shadow-lg" />
            <p className="font-bold text-surface-400 animate-pulse tracking-widest uppercase text-xs">Synchronizing Core...</p>
        </div>
    );

    const kpis = [
        { label: 'Total Students', value: metrics?.totalStudents || 0, icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100/50 dark:bg-indigo-900/30', trend: '+12% this month' },
        { label: 'Pass Rate', value: `${metrics?.passPercentage || 0}%`, icon: Target, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100/50 dark:bg-emerald-900/30', trend: 'Consistent performance' },
        { label: 'Placements', value: `${metrics?.placementRate || 0}%`, icon: Zap, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100/50 dark:bg-amber-900/30', trend: '8 new drives' },
        { label: 'Institution Score', value: '9.4', icon: TrendingUp, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100/50 dark:bg-rose-900/30', trend: 'Global Ranking #42' }
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 dark:text-white mb-2">
                        Institutional <span className="text-gradient">Intelligence</span>
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live system status and analytical overview
                    </p>
                </div>
                <button className="btn-premium py-4 shadow-xl shadow-primary-600/20">
                    <ArrowUpRight size={20} /> Export Core Intelligence
                </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((stat, i) => (
                    <motion.div 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="bento-item flex flex-col justify-between min-h-[180px] group cursor-default dark:hover:border-primary-500/50 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-all group-hover:scale-110`}>
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-surface-400 dark:text-surface-500 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded-md">{stat.trend}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-4xl font-black text-surface-950 dark:text-white transition-colors">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts & Activities Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-8 glass-card p-8 md:p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-surface-950 dark:text-white flex items-center gap-3">
                            <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg"><AlertCircle size={20} /></div>
                            Pedagogical Performance Gap
                        </h3>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-surface-100 dark:bg-surface-800 rounded-full text-[10px] font-bold text-surface-500 uppercase">Avg Marks</div>
                        </div>
                    </div>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hardestCourses} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-primary-500)" />
                                        <stop offset="100%" stopColor="var(--color-primary-800)" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="var(--color-border)" />
                                <XAxis 
                                    dataKey="courseCode" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--color-text-muted)', fontSize: 11, fontWeight: 700}} 
                                    dy={15}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'var(--color-text-muted)', fontSize: 11, fontWeight: 700}}
                                />
                                <Tooltip 
                                    cursor={{fill: 'var(--color-surface-100)', opacity: 0.4, radius: 12}} 
                                    contentStyle={{backgroundColor: 'var(--color-bg-card)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px 16px'}}
                                    itemStyle={{color: 'var(--color-text-main)', fontWeight: 'bold'}}
                                    labelStyle={{color: 'var(--color-primary-500)', fontWeight: 'black', marginBottom: '4px'}}
                                />
                                <Bar dataKey="averageMarks" radius={[12, 12, 4, 4]} barSize={40}>
                                    {hardestCourses.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-4 glass-card p-8 md:p-10 flex flex-col">
                    <h3 className="text-xl font-black text-surface-950 dark:text-white mb-8 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><Zap size={20} /></div>
                        System Pulse
                    </h3>
                    <div className="space-y-8 flex-1 relative">
                        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-surface-100 dark:bg-surface-800" />
                        {[
                            { title: 'Admission Pipeline', desc: 'Aryan Kumar registered', time: '10 mins ago', type: 'info' },
                            { title: 'Academic Update', desc: 'CS102 Midterms processed', time: '1 hour ago', type: 'success' },
                            { title: 'Corporate Relations', desc: 'Infosys drive initialized', time: '2 hours ago', type: 'warning' },
                            { title: 'Faculty Portal', desc: 'Dr. Sharma leave validated', time: '5 hours ago', type: 'info' }
                        ].map((act, i) => (
                            <div key={i} className="flex gap-6 items-start relative z-10 group">
                                <div className={`w-4 h-4 rounded-full border-4 border-white dark:border-surface-900 shadow-md shrink-0 mt-1 transition-transform group-hover:scale-125 ${
                                    act.type === 'success' ? 'bg-emerald-500' : 
                                    act.type === 'warning' ? 'bg-amber-500' : 'bg-primary-500'
                                }`} />
                                <div className="flex-1">
                                    <p className="font-black text-surface-900 dark:text-white text-sm">{act.title}</p>
                                    <p className="text-xs text-surface-500 dark:text-surface-400 font-bold mt-0.5">{act.desc}</p>
                                    <p className="text-[10px] text-primary-600 dark:text-primary-400 mt-2 font-black uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 inline-block px-2 py-0.5 rounded transition-colors">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-10 py-4 rounded-xl border-2 border-surface-100 dark:border-surface-800 text-surface-500 dark:text-surface-400 font-bold text-[10px] uppercase tracking-widest hover:bg-surface-50 dark:hover:bg-surface-800 transition-all">
                        View Audit Log
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
