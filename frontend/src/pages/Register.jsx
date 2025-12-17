import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', password: '', name: '', email: '', phone: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) {
            navigate('/login');
        } else {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Join IO-BANK today
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={20} />
                            </span>
                            <input name="username" type="text" required placeholder="Username" onChange={handleChange} className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={20} />
                            </span>
                            <input name="password" type="password" required placeholder="Password" onChange={handleChange} className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={20} />
                            </span>
                            <input name="name" type="text" required placeholder="Full Name" onChange={handleChange} className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={20} />
                            </span>
                            <input name="email" type="email" required placeholder="Email" onChange={handleChange} className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Phone size={20} />
                            </span>
                            <input name="phone" type="text" required placeholder="Phone" onChange={handleChange} className="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>

                        <div className="relative">
                            <select name="securityQuestion" required onChange={handleChange} className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white text-gray-500">
                                <option value="">Select Security Question</option>
                                <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                                <option value="What is your favorite hero?">What is your favorite hero?</option>
                                <option value="What city were you born in?">What city were you born in?</option>
                                <option value="What is your favorite food?">What is your favorite food?</option>
                            </select>
                        </div>
                        <div className="relative">
                            <input name="securityAnswer" type="text" required placeholder="Security Answer" onChange={handleChange} className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                    </div>

                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 mt-6 hover:shadow-lg transition-all">
                        Register Account <ArrowRight className="ml-2" size={18} />
                    </button>

                    <div className="text-center text-sm mt-4">
                        <span className="text-gray-500">Already have an account? </span>
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
