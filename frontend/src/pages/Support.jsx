import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export default function Support() {
    const { token, user } = useAuth();
    const [formData, setFormData] = useState({ issueType: 'TRANSACTION', description: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [myTickets, setMyTickets] = useState([]);

    const fetchMyTickets = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/support/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyTickets(res.data);
        } catch (err) {
            console.error("Failed to load tickets");
        }
    };

    useEffect(() => {
        if (token) fetchMyTickets();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await axios.post('http://localhost:8080/api/support', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus({ type: 'success', message: `Ticket #${res.data.ticketId.substring(0, 8)} Created Successfully` });
            setFormData({ issueType: 'TRANSACTION', description: '' });
            fetchMyTickets();
        } catch {
            setStatus({ type: 'error', message: 'Failed to submit ticket. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Support Center</h1>
                <p className="text-gray-500 mt-2">How can we help you today, {user?.username}?</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                        <select
                            value={formData.issueType}
                            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="TRANSACTION">Transaction Issue</option>
                            <option value="ACCOUNT">Account / Security</option>
                            <option value="access">Login / Access</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                            placeholder="Please describe your issue in detail..."
                            required
                        />
                    </div>

                    {status.message && (
                        <div className={`p-4 rounded-xl flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                    </button>
                </form>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <MessageSquare className="text-blue-600 shrink-0 mt-1" size={20} />
                <p className="text-sm text-blue-800">
                    Our support team typically responds within 24 hours. You will receive an email notification when your ticket status updates.
                </p>
            </div>

            {/* Ticket History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">My Support Tickets</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Issue</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {myTickets.length === 0 ? (
                                <tr><td colSpan="4" className="p-6 text-center text-gray-400">No tickets found.</td></tr>
                            ) : (
                                myTickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td className="p-4 text-sm font-mono text-gray-500">#{ticket.ticketId.substring(0, 8)}</td>
                                        <td className="p-4 text-sm font-medium text-gray-900">{ticket.issueType}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 truncate max-w-xs" title={ticket.description}>
                                            {ticket.description}
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
