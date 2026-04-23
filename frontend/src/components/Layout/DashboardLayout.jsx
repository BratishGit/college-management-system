import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    GraduationCap,
    Users,
    BookOpen,
    LogOut,
    Menu,
    Bell,
    Search,
    Calendar,
    Briefcase,
    ClipboardCheck,
    CreditCard,
    Library,
    Building2,
    Bus,
    UserCog,
    FileText,
    FileBarChart,
    Sun,
    Moon,
    ArrowUpRight
} from 'lucide-react';

const DashboardLayout = ({ user, setUser, children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const navItems = {
        ADMIN: [
            { icon: BarChart3, label: 'Analytics Dashboard', path: '/' },
            { icon: Users, label: 'Manage Students', path: '/students' },
            { icon: UserCog, label: 'Manage Teachers', path: '/teachers' },
            { icon: BookOpen, label: 'Course / Subjects', path: '/courses' },
            { icon: Calendar, label: 'Timetable Scheduling', path: '/timetable' },
            { icon: ClipboardCheck, label: 'Leave Workflows', path: '/leaves' },
            { icon: Briefcase, label: 'Placement Cell', path: '/placements' },
            { icon: CreditCard, label: 'Fee Collections', path: '/fees' },
            { icon: Library, label: 'Library Management', path: '/library' },
            { icon: Building2, label: 'Hostel Management', path: '/hostel' },
            { icon: Bus, label: 'Transport Management', path: '/transport' },
        ],
        TEACHER: [
            { icon: BookOpen, label: 'Faculty Portal', path: '/' },
            { icon: ClipboardCheck, label: 'Attendance Register', path: '/attendance' },
            { icon: FileBarChart, label: 'Marks Entry', path: '/marks-entry' },
            { icon: BookOpen, label: 'My Courses', path: '/courses' },
            { icon: Calendar, label: 'Leave Workflows', path: '/leaves' },
            { icon: FileText, label: 'Student Reports', path: '/reports' },
        ],
        STUDENT: [
            { icon: BarChart3, label: 'Student Overview', path: '/' },
            { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
            { icon: BookOpen, label: 'Enrolled Courses', path: '/courses' },
            { icon: GraduationCap, label: 'Exam Results', path: '/exams' },
            { icon: Calendar, label: 'Leave Applications', path: '/leaves' },
            { icon: Briefcase, label: 'Placement Drives', path: '/placements' },
        ]
    };

    const currentNavItems = navItems[user.role] || [];

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            <div className="bg-mesh" />
            
            {/* Sidebar */}
            <aside className={`glass-sidebar transition-all duration-500 ease-in-out flex flex-col z-40 relative ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
                <div className="p-8 flex items-center gap-4 overflow-hidden">
                    <div className="btn-premium p-3 rounded-2xl shrink-0 shadow-indigo-500/30">
                        <GraduationCap size={28} />
                    </div>
                    {isSidebarOpen && (
                        <div className="transition-opacity duration-300">
                            <span className="text-xl font-black text-gradient block leading-tight">collegeGo</span>
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Enterprise Intelligence</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1.5 py-4 overflow-y-auto custom-scrollbar">
                    {currentNavItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                                    isActive 
                                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 translate-x-1' 
                                    : 'text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-200 hover:shadow-lg hover:shadow-surface-200/50 hover:text-primary-600 dark:hover:text-primary-400'
                                }`}
                            >
                                <item.icon size={22} className={`shrink-0 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`} />
                                {isSidebarOpen && <span className="font-bold text-sm tracking-tight truncate">{item.label}</span>}
                                {isActive && (
                                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 group font-bold border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                        <LogOut size={22} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="text-sm">Secure Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col relative">
                {/* Navbar */}
                <header className="glass-navbar px-10 py-6 flex items-center justify-between sticky top-0 z-30 mx-8 my-4 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => setSidebarOpen(!isSidebarOpen)} 
                            className="p-3 text-surface-500 hover:bg-white dark:hover:bg-surface-200 hover:text-primary-600 rounded-2xl transition-all shadow-sm border border-transparent hover:border-surface-200 dark:hover:border-surface-100"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="relative hidden xl:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search modules, students, or records..." 
                                className="pl-12 pr-6 py-3 bg-white/50 dark:bg-surface-100/50 border border-surface-200 dark:border-surface-100 rounded-2xl outline-none focus:bg-white dark:focus:bg-surface-200 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all font-semibold text-sm w-96 text-surface-900 dark:text-white shadow-sm" 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <button 
                            onClick={toggleTheme}
                            className="p-3 text-surface-500 hover:bg-white hover:text-primary-600 dark:hover:bg-surface-200 rounded-2xl transition-all bg-white/50 border border-surface-200 shadow-sm flex items-center justify-center overflow-hidden relative group"
                        >
                            <div className="flex flex-col transition-transform duration-500 group-hover:-translate-y-full">
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                <div className="absolute top-full left-0 w-full h-full flex items-center justify-center">
                                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                </div>
                            </div>
                        </button>

                        <button className="relative p-3 text-surface-500 hover:bg-white hover:text-primary-600 rounded-2xl transition-all bg-white/50 border border-surface-200 shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white dark:border-surface-900 ring-4 ring-accent/20"></span>
                        </button>

                        <div className="flex items-center gap-5 pl-8 border-l border-surface-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-surface-900 leading-none mb-1 dark:text-white">{user.username}</p>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/40 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-primary-700 dark:text-primary-300 font-black uppercase tracking-widest">{user.role}</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-800 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-primary-600/20 border-2 border-white dark:border-surface-700 transform hover:rotate-3 transition-transform cursor-pointer">
                                {user.username[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
