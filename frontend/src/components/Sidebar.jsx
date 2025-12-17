import React from 'react';
import { Home, CreditCard, Send, Settings, User, LayoutDashboard, History, FileText, Users, ShieldAlert, BadgeDollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth

const customerRoutes = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/accounts', label: 'Accounts', icon: LayoutDashboard },
    { path: '/transfer', label: 'Payments', icon: Send },
    { path: '/transactions', label: 'Transactions', icon: History },
    { path: '/statements', label: 'Statements', icon: FileText },
    { path: '/cards', label: 'Card', icon: CreditCard },
    { path: '/support', label: 'Support', icon: User },
    { path: '/profile', label: 'Settings', icon: Settings },
];

const adminRoutes = [
    { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/accounts', label: 'Account Control', icon: ShieldAlert },
    { path: '/admin/transactions', label: 'Transactions', icon: BadgeDollarSign },
    { path: '/admin/support', label: 'Support Requests', icon: User },
    { path: '/profile', label: 'My Profile', icon: User },
];

export default function Sidebar() {
    const location = useLocation();
    const { user } = useAuth(); // Get user role

    const routes = user?.role === 'ROLE_ADMIN' ? adminRoutes : customerRoutes;
    const title = user?.role === 'ROLE_ADMIN' ? 'IO-ADMIN' : 'IO-BANK';
    const bgClass = user?.role === 'ROLE_ADMIN' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
    const textClass = user?.role === 'ROLE_ADMIN' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700';
    const activeClass = user?.role === 'ROLE_ADMIN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-blue-600 text-white shadow-md';
    const titleTextClass = user?.role === 'ROLE_ADMIN' ? 'text-white' : 'text-gray-800';

    return (
        <div className={`w-64 border-r min-h-screen flex flex-col transition-colors ${bgClass}`}>
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="text-white font-bold text-xl">IO</span>
                </div>
                <span className={`font-bold text-xl ${titleTextClass}`}>{title}</span>
            </div>

            <div className="flex-1 px-4 space-y-2">
                {routes.map((route) => {
                    const Icon = route.icon;
                    const isActive = location.pathname.startsWith(route.path);
                    return (
                        <Link
                            key={route.path}
                            to={route.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? activeClass : textClass}`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{route.label}</span>
                        </Link>
                    )
                })}
            </div>

            {user?.role === 'ROLE_ADMIN' && (
                <div className="p-4 m-4 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-xs text-slate-400 font-medium mb-1">ADMIN MODE</p>
                    <p className="text-xs text-slate-500">You have full system access.</p>
                </div>
            )}
        </div>
    );
}
