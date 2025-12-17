import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Search, LogOut, User } from 'lucide-react';

export default function TopBar() {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-4 flex-1">
                <span className="font-bold text-gray-800 text-lg">Hello, {user?.username} 👋</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all w-64"
                    />
                </div>

                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                        {user?.username?.[0]?.toUpperCase()}
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 origin-top-right transform transition-all">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                <p className="text-xs text-gray-500">Customer</p>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                <User size={16} />
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowProfileMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
