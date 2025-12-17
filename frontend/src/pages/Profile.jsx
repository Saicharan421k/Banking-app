import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, LogOut, Mail, Phone, Shield } from 'lucide-react';

export default function Profile() {
    const { logout, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false); // 'profile' or 'security' or null
    const [loading, setLoading] = useState(false);

    // Form States
    const [editForm, setEditForm] = useState({ email: '', phone: '' });
    const [securityForm, setSecurityForm] = useState({ password: '', securityQuestion: '', securityAnswer: '' });

    const fetchProfile = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            setEditForm({ email: res.data.email || '', phone: res.data.phone || '' });
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchProfile();
    }, [token, fetchProfile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('http://localhost:8080/api/auth/profile', editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile Updated Successfully!");
            setEditing(null);
            fetchProfile();
        } catch (err) {
            alert("Failed to update profile: " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSecurity = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('http://localhost:8080/api/auth/security-settings', securityForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Security Settings Updated!");
            setEditing(null);
            setSecurityForm({ password: '', securityQuestion: '', securityAnswer: '' });
        } catch (err) {
            alert("Failed to update security settings: " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="p-10 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-10">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 flex flex-col md:flex-row items-center gap-8 border-b border-gray-100">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-3xl font-bold border-4 border-white shadow-lg">
                        {profile.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">{profile.name || profile.username}</h2>
                        <p className="text-gray-500 flex items-center gap-2 justify-center md:justify-start">
                            <Shield size={16} /> {profile.role || 'Customer'} Account
                        </p>
                    </div>
                    <div className="md:ml-auto">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-semibold text-gray-900">Personal Information</h3>
                            <button onClick={() => setEditing(editing === 'profile' ? null : 'profile')} className="text-sm text-indigo-600 hover:text-indigo-800">
                                {editing === 'profile' ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {editing === 'profile' ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500">Email</label>
                                    <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full border p-2 rounded text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">Phone</label>
                                    <input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full border p-2 rounded text-sm" />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded text-sm">Save Changes</button>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <User size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-400">Username</p>
                                        <p className="font-medium">{profile.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Mail size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-400">Email Address</p>
                                        <p className="font-medium">{profile.email || 'Not provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <Phone size={20} className="text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="font-medium">{profile.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Security Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-semibold text-gray-900">Security Settings</h3>
                            <button onClick={() => setEditing(editing === 'security' ? null : 'security')} className="text-sm text-indigo-600 hover:text-indigo-800">
                                {editing === 'security' ? 'Cancel' : 'Update'}
                            </button>
                        </div>

                        {editing === 'security' ? (
                            <form onSubmit={handleUpdateSecurity} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500">New Security Question</label>
                                    <select
                                        value={securityForm.securityQuestion}
                                        onChange={(e) => setSecurityForm({ ...securityForm, securityQuestion: e.target.value })}
                                        className="w-full border p-2 rounded text-sm"
                                        required
                                    >
                                        <option value="">Select a question</option>
                                        <option value="pet">What was the name of your first pet?</option>
                                        <option value="school">What was the name of your first school?</option>
                                        <option value="city">In what city were you born?</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500">New Security Answer</label>
                                    <input type="text" value={securityForm.securityAnswer} onChange={e => setSecurityForm({ ...securityForm, securityAnswer: e.target.value })} className="w-full border p-2 rounded text-sm" required />
                                </div>
                                <div className="pt-2 border-t">
                                    <label className="block text-xs text-red-500 font-bold mb-1">Confirm with Password</label>
                                    <input type="password" placeholder="Current Password" value={securityForm.password} onChange={e => setSecurityForm({ ...securityForm, password: e.target.value })} className="w-full border p-2 rounded text-sm" required />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded text-sm">Update Security</button>
                            </form>
                        ) : (
                            <div className="text-sm text-gray-500">
                                <p className="mb-2">Update your security question and answer to ensure you can recover your account if you lose access.</p>
                                <p className="italic">Click "Update" to change settings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
