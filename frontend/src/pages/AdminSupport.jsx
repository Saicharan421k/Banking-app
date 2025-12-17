import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function AdminSupport() {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/support', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
        } catch {
            console.error("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleResolve = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/support/${id}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTickets();
        } catch {
            alert("Failed to resolve ticket");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Support Requests</h1>
                <p className="text-gray-500">Manage and resolve user issues</p>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Open Tickets</h3>
                        <p className="text-gray-500">All support requests have been resolved.</p>
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <div key={ticket.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">#{ticket.ticketId?.substring(0, 8)}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{ticket.issueType}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{ticket.description}</p>
                                {ticket.email && <p className="mt-2 text-xs text-blue-600 font-medium">Contact: {ticket.email}</p>}
                            </div>

                            <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                                {ticket.status === 'OPEN' && (
                                    <button
                                        onClick={() => handleResolve(ticket.id)}
                                        className="w-full py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
