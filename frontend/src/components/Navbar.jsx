import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">SecureBank</span>
                        </div>
                        {user && (
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link to="/transfer" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Transfer
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-700">Hello, {user.username}</span>
                                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-900">Login</Link>
                                <Link to="/register" className="text-indigo-600 hover:text-indigo-900">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
