import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import MpinModal from '../components/MpinModal';

export default function Accounts() {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState([]);

    const navigate = useNavigate();

    const fetchAccounts = useCallback(async () => {
        if (!token) return;
        try {
            const accRes = await axios.get('http://localhost:8080/api/banking/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(accRes.data);

            // Check for accounts without MPIN and prompt setup
            const missingMpinAccs = accRes.data.filter(acc => !acc.mpin);
            if (missingMpinAccs.length > 0) {
                // Trigger setup for the first one found
                setPendingAccountId(missingMpinAccs[0].id);
                setMpinMode('setup');
                setShowMpinModal(true);
            }
        } catch (err) {
            console.error("Failed to fetch accounts", err);
        }
    }, [token]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);




    const [showMpinModal, setShowMpinModal] = useState(false);
    const [mpinMode, setMpinMode] = useState('verify'); // 'setup' or 'verify'
    const [visibleBalances, setVisibleBalances] = useState({}); // { accountId: boolean }
    const [pendingAccountId, setPendingAccountId] = useState(null);

    const handleToggleBalance = (accId) => {
        if (visibleBalances[accId]) {
            // Hide immediately
            setVisibleBalances(prev => ({ ...prev, [accId]: false }));
        } else {
            // Check if account has MPIN (find account in state)
            const acc = accounts.find(a => a.id === accId);
            if (acc && !acc.mpin) {
                setMpinMode('setup');
            } else {
                setMpinMode('verify');
            }
            setPendingAccountId(accId);
            setShowMpinModal(true);
        }
    };

    const handleMpinSuccess = async () => {
        if (pendingAccountId) {
            if (mpinMode === 'setup') {
                alert("MPIN Setup Successful!");
                await fetchAccounts(); // Refresh to get the updated MPIN status
            }
            setVisibleBalances(prev => ({ ...prev, [pendingAccountId]: true }));
            setPendingAccountId(null);
            setShowMpinModal(false);
        }
    };

    const handleUpdateStatus = async (accountId, newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'BLOCK' : 'UNBLOCK'} this account?`)) return;
        try {
            await axios.put(`http://localhost:8080/api/banking/accounts/${accountId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAccounts();
        } catch (e) {
            alert("Action failed: " + e.message);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        // Double confirmation for delete
        if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this account? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:8080/api/banking/accounts/${accountId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Account Deleted Successfully");
            fetchAccounts();
        } catch (e) {
            alert("Delete failed (Ensure balance is cleared?): " + e.message);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto mt-10">
            {/* ... Header ... */}
            <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Accounts</h2>
                <div className="flex gap-2">
                    {/* Redirecting to Dashboard for unified creation flow */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors hover:bg-indigo-700`}
                    >
                        + Create New Account
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(acc => (
                    <StatCard
                        key={acc.id}
                        title={`${acc.type} Account`}
                        value={acc.balance}
                        type={acc.type}
                        status={acc.status}
                        isVisible={visibleBalances[acc.id]}
                        onToggleBalance={() => handleToggleBalance(acc.id)}
                        onClick={() => navigate(`/transactions/${acc.accountNumber}`)}
                        onUpdateStatus={(status) => handleUpdateStatus(acc.id, status)}
                        onDelete={() => handleDeleteAccount(acc.id)}
                    />
                ))}
            </div>

            <MpinModal
                mode={mpinMode}
                accountId={pendingAccountId}
                isOpen={showMpinModal}
                onClose={() => setShowMpinModal(false)}
                onSuccess={handleMpinSuccess}
            />
        </div>
    );
}
