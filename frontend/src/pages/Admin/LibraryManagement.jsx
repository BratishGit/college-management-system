import { useState } from 'react';
import { BookOpen, Search, Plus, Download, Upload, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LibraryManagement = () => {
    const [activeTab, setActiveTab] = useState('books'); // books, issued, overdue

    // Mock library data (would come from backend in production)
    const books = [
        { id: 1, title: 'Data Structures and Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', totalCopies: 10, availableCopies: 7, location: 'CS-A-101' },
        { id: 2, title: 'Introduction to Algorithms', author: 'CLRS', isbn: '978-0262046305', category: 'Computer Science', totalCopies: 8, availableCopies: 5, location: 'CS-A-102' },
        { id: 3, title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: 'Computer Science', totalCopies: 12, availableCopies: 9, location: 'CS-B-201' },
        { id: 4, title: 'Operating System Concepts', author: 'Silberschatz', isbn: '978-1118063330', category: 'Computer Science', totalCopies: 10, availableCopies: 6, location: 'CS-B-202' },
        { id: 5, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', category: 'Computer Science', totalCopies: 9, availableCopies: 7, location: 'CS-C-301' },
        { id: 6, title: 'Discrete Mathematics', author: 'Kenneth H. Rosen', isbn: '978-0073383095', category: 'Mathematics', totalCopies: 15, availableCopies: 12, location: 'MATH-A-101' },
        { id: 7, title: 'Engineering Physics', author: 'R.K. Gaur', isbn: '978-8177002584', category: 'Physics', totalCopies: 20, availableCopies: 15, location: 'PHY-A-101' },
        { id: 8, title: 'Digital Electronics', author: 'Morris Mano', isbn: '978-0132145367', category: 'Electronics', totalCopies: 8, availableCopies: 4, location: 'EC-A-101' },
    ];

    const issuedBooks = [
        { id: 1, bookTitle: 'Data Structures and Algorithms', studentName: 'Amit Sharma', rollNumber: '2024CS001', issueDate: '2026-01-15', dueDate: '2026-01-29', status: 'ISSUED' },
        { id: 2, bookTitle: 'Database System Concepts', studentName: 'Priya Singh', rollNumber: '2024CS002', issueDate: '2026-01-18', dueDate: '2026-02-01', status: 'ISSUED' },
        { id: 3, bookTitle: 'Operating System Concepts', studentName: 'Rahul Verma', rollNumber: '2024CS003', issueDate: '2026-01-10', dueDate: '2026-01-24', status: 'OVERDUE' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight">Library Management</h1>
                    <p className="text-surface-500 font-medium">Manage books, issues, and returns</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-surface-100 text-surface-600 rounded-xl font-bold text-sm hover:bg-surface-200 transition-colors flex items-center gap-2">
                        <Upload size={18} />
                        Import Books
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Add New Book
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="Total Books"
                    value={books.reduce((acc, book) => acc + book.totalCopies, 0)}
                    color="bg-primary-600"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Available"
                    value={books.reduce((acc, book) => acc + book.availableCopies, 0)}
                    color="bg-emerald-600"
                />
                <StatCard
                    icon={Download}
                    label="Issued"
                    value={issuedBooks.filter(b => b.status === 'ISSUED').length}
                    color="bg-indigo-600"
                />
                <StatCard
                    icon={Clock}
                    label="Overdue"
                    value={issuedBooks.filter(b => b.status === 'OVERDUE').length}
                    color="bg-rose-600"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-surface-200">
                <TabButton
                    active={activeTab === 'books'}
                    onClick={() => setActiveTab('books')}
                    label="Book Catalog"
                    count={books.length}
                />
                <TabButton
                    active={activeTab === 'issued'}
                    onClick={() => setActiveTab('issued')}
                    label="Issued Books"
                    count={issuedBooks.filter(b => b.status === 'ISSUED').length}
                />
                <TabButton
                    active={activeTab === 'overdue'}
                    onClick={() => setActiveTab('overdue')}
                    label="Overdue"
                    count={issuedBooks.filter(b => b.status === 'OVERDUE').length}
                />
            </div>

            {/* Content */}
            {activeTab === 'books' && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Book Catalog</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-surface-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search books..."
                                className="pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                    <th className="py-4 px-8 text-left">Title</th>
                                    <th className="py-4 px-6 text-left">Author</th>
                                    <th className="py-4 px-6 text-left">ISBN</th>
                                    <th className="py-4 px-6 text-left">Category</th>
                                    <th className="py-4 px-6 text-center">Total</th>
                                    <th className="py-4 px-6 text-center">Available</th>
                                    <th className="py-4 px-8 text-left">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {books.map((book) => (
                                    <tr key={book.id} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-4 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                                                    <BookOpen size={20} />
                                                </div>
                                                <span className="font-bold text-surface-900">{book.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-surface-600">{book.author}</td>
                                        <td className="py-4 px-6 font-mono text-sm text-surface-500">{book.isbn}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-surface-900">{book.totalCopies}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {book.availableCopies}
                                            </span>
                                        </td>
                                        <td className="py-4 px-8 font-mono text-sm text-surface-600">{book.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'issued' && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-surface-50">
                        <h3 className="font-bold text-lg">Currently Issued Books</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                    <th className="py-4 px-8 text-left">Book Title</th>
                                    <th className="py-4 px-6 text-left">Student</th>
                                    <th className="py-4 px-6 text-left">Roll Number</th>
                                    <th className="py-4 px-6 text-left">Issue Date</th>
                                    <th className="py-4 px-6 text-left">Due Date</th>
                                    <th className="py-4 px-8 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {issuedBooks.filter(b => b.status === 'ISSUED').map((issue) => (
                                    <tr key={issue.id} className="hover:bg-surface-50 transition-colors">
                                        <td className="py-4 px-8 font-semibold text-surface-900">{issue.bookTitle}</td>
                                        <td className="py-4 px-6 text-surface-600">{issue.studentName}</td>
                                        <td className="py-4 px-6 font-mono text-primary-600 font-bold">{issue.rollNumber}</td>
                                        <td className="py-4 px-6 text-surface-500 text-sm">{issue.issueDate}</td>
                                        <td className="py-4 px-6 text-surface-500 text-sm">{issue.dueDate}</td>
                                        <td className="py-4 px-8 text-right">
                                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700">
                                                Mark Returned
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'overdue' && (
                <div className="card-premium overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-rose-50">
                        <h3 className="font-bold text-lg text-rose-900">Overdue Books</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-50 text-[10px] font-black uppercase tracking-widest text-surface-400">
                                    <th className="py-4 px-8 text-left">Book Title</th>
                                    <th className="py-4 px-6 text-left">Student</th>
                                    <th className="py-4 px-6 text-left">Roll Number</th>
                                    <th className="py-4 px-6 text-left">Due Date</th>
                                    <th className="py-4 px-6 text-left">Days Overdue</th>
                                    <th className="py-4 px-8 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {issuedBooks.filter(b => b.status === 'OVERDUE').map((issue) => {
                                    const daysOverdue = Math.floor((new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24));
                                    return (
                                        <tr key={issue.id} className="hover:bg-rose-50/30 transition-colors">
                                            <td className="py-4 px-8 font-semibold text-surface-900">{issue.bookTitle}</td>
                                            <td className="py-4 px-6 text-surface-600">{issue.studentName}</td>
                                            <td className="py-4 px-6 font-mono text-rose-600 font-bold">{issue.rollNumber}</td>
                                            <td className="py-4 px-6 text-surface-500 text-sm">{issue.dueDate}</td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                                                    {daysOverdue} days
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 text-right">
                                                <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700">
                                                    Send Reminder
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
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

const TabButton = ({ active, onClick, label, count }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-bold text-sm transition-all relative ${active ? 'text-primary-600' : 'text-surface-400 hover:text-surface-600'
            }`}
    >
        <div className="flex items-center gap-2">
            {label}
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${active ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-400'
                }`}>
                {count}
            </span>
        </div>
        {active && (
            <motion.div
                layoutId="activeLibTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
        )}
    </button>
);

export default LibraryManagement;
