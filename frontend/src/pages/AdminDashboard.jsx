import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Building2, Activity, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0, todayTransactions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={28} className="text-white" />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
                <p className="text-gray-500">System High-Level Metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Registered Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Funds Held"
                    value={`$${stats.totalBalance?.toLocaleString() || 0}`}
                    icon={Building2}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Transactions Today"
                    value={stats.todayTransactions}
                    icon={Activity}
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Welcome, Administrator</h2>
                    <p className="text-slate-300 mb-6 text-lg">
                        You have full access to manage user accounts, oversee transactions, and intervene in banking operations requiring manual authorization.
                    </p>
                    <Link to="/admin/users" className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors inline-flex">
                        Go to User Management <ArrowUpRight size={18} />
                    </Link>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
            </div>
        </div>
    );
}
