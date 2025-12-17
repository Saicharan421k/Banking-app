
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, HelpCircle } from 'lucide-react';
import PublicSupport from '../components/PublicSupport';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSupport, setShowSupport] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await login(username, password);
        if (user) {
            if (user.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">
                        IO
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to access your banking dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={20} />
                            </span>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={20} />
                            </span>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg"
                        >
                            Sign In <ArrowRight className="ml-2" size={18} />
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Register now
                            </Link>
                        </p>
                        <button
                            onClick={() => setShowSupport(true)}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 w-full"
                        >
                            <HelpCircle size={14} />
                            Need Help? / Account Blocked?
                        </button>
                    </div>
                </form>
            </div>

            <PublicSupport isOpen={showSupport} onClose={() => setShowSupport(false)} />
        </div>
    );
}

