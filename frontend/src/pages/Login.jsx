import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogIn, GraduationCap, ShieldCheck, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 rounded-3xl space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-4 bg-primary-100 rounded-2xl text-primary-600 mb-2">
                            <GraduationCap size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-surface-900">SRMS Portal</h1>
                        <p className="text-surface-600">Student Result Management System</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-surface-700 ml-1">Username</label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-3 text-surface-400" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-surface-700 ml-1">Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 text-surface-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-600/30"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Login to Portal
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-sm text-surface-500">
                            Demo Credentials: admin/admin123, teacher/teacher123
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
