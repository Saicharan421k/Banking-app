import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, Ban, Unlock, Shield, Mail, Phone, MoreVertical } from 'lucide-react';

export default function AdminUsers() {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (id, currentStatus) => {
        // Optimistic UI update could be done here, but let's just wait for API
        const newStatus = currentStatus ? 'BLOCKED' : 'ACTIVE'; // Simple toggle logic simplification
        // Actually, backend needs specific status string or boolean
        // My previous backed logic was a bit fuzzy on this. Let's assume we pass "ACTIVE" or "BLOCKED"
        // And backend handles it. But wait, backend implementation was: user.setLocked(!status.equals("ACTIVE"))

        // Let's assume the user IS active if active=true. So to block, we send "BLOCKED".
        // To Unblock, we send "ACTIVE".

        try {
            await axios.put(`http://localhost:8080/api/admin/users/${id}/status`,
                { status: currentStatus ? 'BLOCKED' : 'ACTIVE' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh
            fetchUsers();
            alert(`User ${currentStatus ? 'Blocked' : 'Activated'} successfully`);
        } catch {
            alert("Action failed");
        }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-500">Manage customer access and accounts</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">User</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Contact</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                                    {user.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name || user.username}</p>
                                                    <p className="text-xs text-gray-400">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-2"><Mail size={14} /> {user.email || 'N/A'}</span>
                                                <span className="flex items-center gap-2"><Phone size={14} /> {user.phone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {user.active ? 'Active' : 'Deactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.active)}
                                                    className={`p-2 rounded-lg transition-colors ${user.active ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={user.active ? "Block User" : "Unblock User"}
                                                >
                                                    {user.active ? <Ban size={18} /> : <Unlock size={18} />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
