import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ActionCard from '../components/ActionCard';
import TransactionTable from '../components/TransactionTable';
import MpinModal from '../components/MpinModal';
import { Send, FileText, CreditCard } from 'lucide-react';

export default function Dashboard() {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        if (!token) return;

        // Fetch Accounts
        try {
            const accRes = await axios.get('http://localhost:8080/api/banking/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(accRes.data);
        } catch (err) {
            console.error("Failed to fetch accounts", err);
        }

        // Fetch Transactions
        try {
            const txRes = await axios.get('http://localhost:8080/api/banking/transactions/recent', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(txRes.data);
        } catch (err) {
            console.error("Failed to fetch recent transactions", err);
        }
    }, [token]);

    const [showMpinSetup, setShowMpinSetup] = useState(false);

    useEffect(() => {
        const checkMpin = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/api/auth/mpin-status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.data.isSet) {
                    setShowMpinSetup(true);
                }
            } catch (err) {
                console.error("Failed to check MPIN status", err);
            }
        };
        checkMpin();
        checkMpin();
        fetchDashboardData();
    }, [token, fetchDashboardData]);

    const [loading, setLoading] = useState(false);

    const [createType, setCreateType] = useState(null); // 'SAVINGS' or 'CURRENT'

    const initiateCreateAccount = (type) => {
        // Check for existing
        const exists = accounts.some(a => a.type === type);
        if (exists) {
            // User requested to contact admin if they need 3rd account
            const confirm = window.confirm(`You already have a ${type} account. Limit is 1 per type.\n\nWould you like to contact support to request an additional account?`);
            if (confirm) {
                navigate('/support');
            }
            return;
        }

        setCreateType(type);
        setShowMpinSetup(true);
    };

    const handleCreateAccount = async (mpin) => {
        if (!token) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            console.log("Sending request for:", createType);
            const res = await axios.post(`http://localhost:8080/api/banking/accounts`, {
                type: createType,
                mpin: mpin
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Account Created Successfully! ID: " + res.data.id);
            await fetchDashboardData();
        } catch (e) {
            console.error("Account creation failed full error:", e);
            const msg = e.response ? `Status: ${e.response.status}, Data: ${JSON.stringify(e.response.data)}` : e.message;
            alert("Failed to create account. " + msg);
        } finally {
            setLoading(false);
            setCreateType(null);
        }
    }

    return (
        <div className="space-y-8">
            {/* Accounts Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Accounts & Balances</h2>
                    <div className="flex gap-2">
                        <div className="flex gap-2">
                            <button
                                onClick={() => initiateCreateAccount('SAVINGS')}
                                disabled={loading}
                                className={`text-sm text-white px-3 py-1 rounded transition-colors ${accounts.some(a => a.type === 'SAVINGS')
                                        ? 'bg-gray-400 hover:bg-gray-500' // Visual cue it's restricted
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating...' : (accounts.some(a => a.type === 'SAVINGS') ? 'SAVINGS (Max Limit)' : '+ New Savings')}
                            </button>
                            <button
                                onClick={() => initiateCreateAccount('CURRENT')}
                                disabled={loading}
                                className={`text-sm text-white px-3 py-1 rounded transition-colors ${accounts.some(a => a.type === 'CURRENT')
                                        ? 'bg-gray-400 hover:bg-gray-500'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating...' : (accounts.some(a => a.type === 'CURRENT') ? 'CURRENT (Max Limit)' : '+ New Current')}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {accounts.map(acc => (
                        <StatCard
                            key={acc.id}
                            title={`${acc.type} Account`}
                            value={acc.balance}
                            type={acc.type}
                            onClick={() => navigate(`/transactions/${acc.accountNumber}`)}
                        />
                    ))}
                    {accounts.length === 0 && (
                        <div className="col-span-4 p-8 bg-white rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
                            No accounts found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Payments */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Payments</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionCard
                        icon={Send}
                        title="Bills Payment"
                        description="Pay all your bills, subscriptions, utility bills and more"
                        colorClass="bg-blue-600"
                        onClick={() => navigate('/transfer')}
                    />
                    <ActionCard
                        icon={FileText}
                        title="Invoice"
                        description="Pay all your bills, subscriptions, utility bills and more"
                        colorClass="bg-indigo-600"
                        onClick={() => { }}
                    />
                    <ActionCard
                        icon={CreditCard}
                        title="Cards"
                        description="Make Payments across all platforms using your card"
                        colorClass="bg-blue-600"
                        onClick={() => { }}
                    />
                </div>
            </div>

            {/* Recent Transactions */}
            <TransactionTable transactions={transactions} />

            <MpinModal
                mode="create"
                isOpen={showMpinSetup}
                onClose={() => setShowMpinSetup(false)}
                onSuccess={handleCreateAccount}
            />
        </div>
    );
}
