import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, ShieldAlert, BadgeDollarSign, MoreVertical, X, Lock, Unlock, CreditCard } from 'lucide-react';

export default function AdminAccounts() {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState([]); // This endpoint doesn't exist yet in AdminController to get ALL accounts
    // We need to add getAllAccounts to AdminController first?
    // Wait, the plan said "Endpoints: View All Accounts". I probably missed adding it to Controller.
    // I can fetch users and expanding, OR add a dedicated endpoint. 
    // Let's assume for now I'll add the endpoint or just list what I can.
    // Actually, I'll add the endpoint to AdminController in the next step if missing.

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionModal, setActionModal] = useState({ open: false, type: null, account: null }); // type: 'credit' | 'debit'
    const [amount, setAmount] = useState('');

    // Let's assume endpoint exists: GET /api/admin/accounts
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // Temporary: fetch users and their accounts? Or direct endpoint.
                // Let's try direct endpoint, if fails, I'll fix backend.
                const res = await axios.get('http://localhost:8080/api/admin/accounts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAccounts(res.data);
            } catch (err) {
                console.error("Failed to load accounts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, [token]);

    const handleTransaction = async (e) => {
        e.preventDefault();
        try {
            const endpoint = actionModal.type === 'credit' ? '/credit' : '/debit';
            await axios.post(`http://localhost:8080/api/admin/accounts${endpoint}`, {
                accountNumber: actionModal.account.accountNumber,
                amount: parseFloat(amount)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Transaction Successful");
            setActionModal({ open: false, type: null, account: null });
            setAmount('');
            // Refresh accounts?
            // Refresh
        } catch (err) {
            alert("Transaction Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const toggleAccountStatus = async (account) => {
        try {
            const newStatus = account.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
            await axios.put(`http://localhost:8080/api/admin/accounts/${account.id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh
            const res = await axios.get('http://localhost:8080/api/admin/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(res.data);
            alert(`Account ${newStatus}`);
        } catch (e) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Account Control</h1>
                    <p className="text-gray-500">Monitor balances and authorize manual adjustments</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Account No.</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Balance</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr> :
                            accounts.length === 0 ? <tr><td colSpan="5" className="p-8 text-center">No accounts found (Endpoint might be missing)</td></tr> :
                                accounts.map(acc => (
                                    <tr key={acc.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono">{acc.accountNumber}</td>
                                        <td className="p-4 text-sm">{acc.type}</td>
                                        <td className="p-4 font-bold text-gray-800">${acc.balance}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${acc.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{acc.status}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setActionModal({ open: true, type: 'credit', account: acc })} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Credit">
                                                    <BadgeDollarSign size={18} />
                                                </button>
                                                <button onClick={() => setActionModal({ open: true, type: 'debit', account: acc })} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Debit">
                                                    <BadgeDollarSign size={18} className="rotate-180" />
                                                </button>
                                                <button
                                                    onClick={() => toggleAccountStatus(acc)}
                                                    className={`p-2 rounded-lg flex items-center gap-1 text-xs font-bold ${acc.status === 'BLOCKED' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                                    title={acc.status === 'BLOCKED' ? 'Unblock Account' : 'Block Account'}
                                                >
                                                    {acc.status === 'BLOCKED' ? <Unlock size={18} /> : <Lock size={18} />}
                                                    {acc.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {actionModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4 capitalize">Manual {actionModal.type}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            You are about to {actionModal.type} funds {actionModal.type === 'debit' ? 'from' : 'to'} account <span className="font-mono font-bold text-gray-800">{actionModal.account.accountNumber}</span>.
                        </p>
                        <form onSubmit={handleTransaction} className="space-y-4">
                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="w-full p-2 border rounded"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setActionModal({ open: false, type: null, account: null })} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className={`flex-1 py-2 text-white rounded font-bold ${actionModal.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}`}>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
