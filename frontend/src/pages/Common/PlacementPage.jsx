import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Building2, Calendar, MapPin, CheckCircle2, ChevronRight, Globe, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const PlacementPage = ({ user }) => {
    const [drives, setDrives] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentProfile, setStudentProfile] = useState(null);

    useEffect(() => {
        fetchPlacementData();
    }, []);

    const fetchPlacementData = async () => {
        try {
            const [drivesRes, companiesRes] = await Promise.all([
                api.get('/placements/drives/active'),
                api.get('/placements/companies')
            ]);
            setDrives(drivesRes.data);
            setCompanies(companiesRes.data);

            if (user.role === 'STUDENT') {
                const profileRes = await api.get('/student/profile');
                setStudentProfile(profileRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (driveId) => {
        if (!studentProfile) return;
        try {
            await api.post(`/placements/drives/${driveId}/apply/${studentProfile.id}`);
            alert('Application submitted successfully!');
        } catch (err) {
            alert('Error applying for drive: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) return <div className="p-8 text-center text-surface-400 font-bold uppercase tracking-widest text-xs">Loading placement data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-surface-900 tracking-tight uppercase">Placement Cell</h1>
                    <p className="text-surface-500 font-medium">Corporate relations and career opportunities</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Drives */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-sm font-black text-surface-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Briefcase size={16} /> Active Hiring Drives
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                        {drives.length === 0 ? (
                            <div className="card-premium p-12 text-center border-dashed border-2 border-surface-200">
                                <Info className="mx-auto text-surface-300 mb-4" size={48} />
                                <p className="text-surface-500 font-bold">No active drives found at the moment.</p>
                            </div>
                        ) : (
                            drives.map((drive) => (
                                <div key={drive.id} className="card-premium p-6 hover:translate-x-1 transition-all group flex flex-col md:flex-row gap-6 items-center">
                                    <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center text-primary-600 font-black text-2xl group-hover:scale-110 transition-transform">
                                        {drive.company.name[0]}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-surface-900">{drive.company.name}</h3>
                                            <span className="px-3 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">ACTIVE</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-surface-500 font-medium">
                                            <span className="flex items-center gap-1.5"><Briefcase size={14} /> {drive.jobRole}</span>
                                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {drive.driveDate}</span>
                                            <span className="flex items-center gap-1.5 font-bold text-primary-600 tracking-tight">{drive.packageLpa} LPA</span>
                                        </div>
                                        <p className="text-xs text-surface-400">Min Eligibility: {drive.eligibilityCgpa} CGPA</p>
                                    </div>
                                    {user.role === 'STUDENT' && (
                                        <button 
                                            onClick={() => handleApply(drive.id)}
                                            className="btn-primary py-3 px-8 rounded-2xl whitespace-nowrap"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Partner Companies */}
                <div className="space-y-6">
                    <h2 className="text-sm font-black text-surface-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Building2 size={16} /> Partner Organizations
                    </h2>
                    
                    <div className="space-y-3">
                        {companies.map((company) => (
                            <div key={company.id} className="bg-white/50 backdrop-blur-md border border-surface-200 p-4 rounded-2xl flex items-center gap-4 hover:border-primary-300 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-surface-50 flex items-center justify-center font-bold text-surface-400">
                                    {company.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-surface-900 leading-tight">{company.name}</h4>
                                    <p className="text-[10px] font-black text-surface-400 uppercase">{company.industry}</p>
                                </div>
                                <Globe size={16} className="text-surface-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementPage;
