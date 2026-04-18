import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    BarChart3,
    GraduationCap,
    Users,
    BookOpen,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Calendar,
    FileText,
    ClipboardCheck,
    MessageSquareQuote,
    UserCircle,
    Info
} from 'lucide-react';

const DashboardLayout = ({ user, setUser, children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const navItems = {
        ADMIN: [
            { icon: BarChart3, label: 'Analytics', path: '/' },
            { icon: Users, label: 'Manage Students', path: '/students' },
            { icon: GraduationCap, label: 'Manage Teachers', path: '/teachers' },
            { icon: BookOpen, label: 'Subjects', path: '/subjects' },
            { icon: Calendar, label: 'Exams', path: '/exams' },
            { icon: ClipboardCheck, label: 'Leaves', path: '/leaves' },
            { icon: BookOpen, label: 'Library', path: '/library' },
            { icon: Info, label: 'Hostel & Day Scholars', path: '/hostel' },
            { icon: Info, label: 'Transport', path: '/transport' },
        ],
        TEACHER: [
            { icon: BookOpen, label: 'Dashboard', path: '/' },
            { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
            { icon: FileText, label: 'Marks Entry', path: '/marks' },
            { icon: MessageSquareQuote, label: 'Reports', path: '/reports' },
            { icon: Calendar, label: 'My Leaves', path: '/leaves' },
        ],
        STUDENT: [
            { icon: BarChart3, label: 'My Overview', path: '/' },
            { icon: ClipboardCheck, label: 'Attendance', path: '/attendance' },
            { icon: BookOpen, label: 'Courses', path: '/courses' },
            { icon: Calendar, label: 'Exams', path: '/exams' },
            { icon: MessageSquareQuote, label: 'Requests', path: '/requests' },
            { icon: UserCircle, label: 'Profile', path: '/profile' },
        ]
    };

    const currentNavItems = navItems[user.role] || [];

    return (
        <div className="flex h-screen bg-surface-50">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-surface-200 transition-all duration-300 flex flex-col z-40 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 flex items-center gap-3 overflow-hidden">
                    <div className="bg-primary-600 p-2 rounded-xl text-white shrink-0">
                        <GraduationCap size={24} />
                    </div>
                    {isSidebarOpen && <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent truncate">CMS Portal</span>}
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                    {currentNavItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-surface-600 hover:bg-primary-50 hover:text-primary-600'}`}
                            >
                                <item.icon size={22} className={`shrink-0 transition-transform ${!isActive && 'group-hover:scale-110'}`} />
                                {isSidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-surface-200">
                    <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors group">
                        <LogOut size={22} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col relative">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-surface-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-surface-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                            <input type="text" placeholder="Quick search..." className="pl-10 pr-4 py-2 bg-surface-100 rounded-lg outline-none focus:ring-2 focus:ring-primary-500/20 transition-all w-64" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-surface-500 hover:bg-surface-100 rounded-lg">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-surface-900">{user.username}</p>
                                <p className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{user.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                {user.username[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
