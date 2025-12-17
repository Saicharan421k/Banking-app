import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function AdminTransactions() {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Endpoint might need to be created in AdminController
                const res = await axios.get('http://localhost:8080/api/admin/transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to load transactions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [token]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Global Transactions</h1>
                <p className="text-gray-500">Real-time monitoring of all system transfers</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Account</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Initiator</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr> :
                            transactions.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-gray-500">No transactions found</td></tr> :
                                transactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-xs text-gray-400">#{tx.id}</td>
                                        <td className="p-4 font-mono text-sm">{tx.account ? tx.account.accountNumber : 'SYSTEM'}</td>
                                        <td className="p-4 font-mono text-sm">{tx.initiatedBy ? <span className="text-purple-600 font-bold">{tx.initiatedBy}</span> : '-'}</td>
                                        <td className="p-4 font-bold text-gray-800">${tx.amount}</td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold ${tx.type.includes('CREDIT') ? 'text-green-600' : 'text-blue-600'}`}>
                                                {tx.type.includes('CREDIT') ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
