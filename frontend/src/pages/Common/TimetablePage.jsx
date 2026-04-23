import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock, BookOpen, User, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const TimetablePage = ({ user }) => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState('MONDAY');

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            // For now fetching for semester 3 as default
            const res = await api.get('/timetable/semester/3');
            setTimetable(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const scheduleForDay = timetable.filter(t => t.dayOfWeek === activeDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Loading schedule...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-surface-900 tracking-tight uppercase">Academic Schedule</h1>
                <p className="text-surface-500 font-medium">Weekly timetable and lecture venues</p>
            </div>

            {/* Day Selector */}
            <div className="flex bg-surface-100 p-1.5 rounded-2xl gap-1 overflow-x-auto">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-1 py-3 px-6 rounded-xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
                            activeDay === day 
                            ? 'bg-white text-primary-600 shadow-sm' 
                            : 'text-surface-500 hover:text-surface-700 hover:bg-surface-200/50'
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timeline View */}
            <div className="space-y-4">
                {scheduleForDay.length === 0 ? (
                    <div className="card-premium p-12 text-center border-dashed border-2 border-surface-200">
                        <Calendar className="mx-auto text-surface-200 mb-4" size={48} />
                        <p className="text-surface-400 font-bold">No lectures scheduled for {activeDay}.</p>
                    </div>
                ) : (
                    scheduleForDay.map((slot, index) => (
                        <div key={index} className="card-premium p-0 overflow-hidden flex flex-col md:flex-row hover:border-primary-300 transition-colors group">
                            <div className="md:w-48 bg-surface-50 p-6 flex flex-col justify-center border-r border-surface-100">
                                <div className="flex items-center gap-2 text-primary-600 mb-1">
                                    <Clock size={16} />
                                    <span className="text-sm font-black tracking-tight">{slot.startTime}</span>
                                </div>
                                <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-6">TO {slot.endTime}</div>
                            </div>
                            
                            <div className="flex-1 p-6 flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded uppercase">{slot.course.code}</span>
                                        <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{slot.course.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-surface-500 font-medium">
                                        <span className="flex items-center gap-1.5"><User size={14} className="text-surface-300" /> {slot.course.teacher.name}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-surface-300" /> Room {slot.roomNumber}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className={`p-4 rounded-2xl bg-surface-50 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all`}>
                                        <BookOpen size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TimetablePage;
