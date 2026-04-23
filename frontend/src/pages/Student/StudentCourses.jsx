import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Book, User, GraduationCap, Clock, Award } from 'lucide-react';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/student/dashboard');
            setCourses(res.data.subjects || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Loading Courses...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-surface-900 tracking-tight uppercase">My Enrolled Courses</h1>
                <p className="text-surface-500 font-medium">Academic curriculum for the current semester</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.length === 0 ? (
                    <div className="col-span-full card-premium p-12 text-center border-dashed border-2">
                        <Book className="mx-auto text-surface-200 mb-4" size={48} />
                        <p className="text-surface-400 font-bold">No courses enrolled for this semester.</p>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div key={course.id} className="card-premium p-8 flex gap-6 hover:border-primary-400 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary-600"></div>
                            
                            <div className="w-16 h-16 bg-surface-50 text-primary-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                {course.code[0]}
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-surface-900">{course.name}</h3>
                                    <p className="text-xs font-black text-surface-400 tracking-widest uppercase">{course.code}</p>
                                </div>

                                <div className="flex flex-wrap gap-6 text-sm text-surface-500 font-medium">
                                    <span className="flex items-center gap-2"><User size={14} /> {course.teacher?.name}</span>
                                    <span className="flex items-center gap-2"><Award size={14} /> {course.credits} Credits</span>
                                    <span className="flex items-center gap-2"><Clock size={14} /> Sem {course.semester}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentCourses;
