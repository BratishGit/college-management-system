import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogIn, GraduationCap, ShieldCheck, UserCircle, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import loginBg from '../assets/login-bg.png';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            navigate('/');
        } catch (err) {
            setError('The credentials provided do not match our secure records.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface-950 font-sans">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={loginBg} 
                    alt="Campus" 
                    className="w-full h-full object-cover object-center opacity-50 scale-105 animate-pulse-slow"
                    style={{ filter: 'blur(4px) brightness(0.5)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/80 to-transparent" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[460px] z-10"
            >
                <div className="glass-card p-10 md:p-12 relative overflow-hidden shadow-2xl shadow-black/40">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-indigo-500 to-violet-500" />
                    
                    <div className="text-center space-y-4 mb-10">
                        <motion.div 
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="inline-flex p-5 bg-surface-50 rounded-3xl text-primary-600 shadow-2xl border border-surface-200"
                        >
                            <GraduationCap size={48} strokeWidth={2.5} />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-surface-900 tracking-tight mb-1">college<span className="text-primary-600">Go</span></h1>
                            <p className="text-surface-500 font-bold text-[10px] uppercase tracking-[0.3em]">Institutional Intelligence</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-600 uppercase tracking-widest ml-1">
                                Secure Identifier
                            </label>
                            <div className="relative group">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 transition-transform group-focus-within:scale-110" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold shadow-sm"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-600 uppercase tracking-widest ml-1">
                                Access Credential
                            </label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 transition-transform group-focus-within:scale-110" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold shadow-sm"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-rose-600 text-xs text-center font-bold bg-rose-50 py-3 rounded-xl border border-rose-100 shadow-sm"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-premium py-5 group/btn overflow-hidden relative shadow-2xl shadow-indigo-500/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            <div className="relative flex items-center justify-center gap-3">
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Zap size={18} className="text-amber-300 fill-amber-300" />
                                        <span className="text-lg font-black tracking-tight">Initialize Session</span>
                                        <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-surface-200 flex flex-col items-center gap-4">
                        <p className="text-[9px] text-surface-400 font-black uppercase tracking-[0.4em]">Encrypted Data Transmission</p>
                    </div>
                </div>
                
                {/* Demo Helper */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-[10px] text-white/40 font-black tracking-widest uppercase">
                        Core Node: <span className="text-primary-400">Active</span> | Protocol: <span className="text-white/60">SRMS-v2</span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
