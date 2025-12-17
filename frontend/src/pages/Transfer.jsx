import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MpinModal from '../components/MpinModal';

export default function Transfer() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [fromAccountISO, setFromAccountISO] = useState('');
    const [myAccounts, setMyAccounts] = useState([]);
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [showMpin, setShowMpin] = useState(false);

    // Fetch user's accounts to populate "From" dropdown
    React.useEffect(() => {
        if (token) {
            axios.get('http://localhost:8080/api/banking/accounts', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setMyAccounts(res.data))
                .catch(err => console.error(err));
        }
    }, [token]);

    const handleTransferClick = (e) => {
        e.preventDefault();
        if (!fromAccountISO) {
            alert("Please select a source account");
            return;
        }
        setShowMpin(true);
    };

    const executeTransfer = async (mpin) => {
        // setShowMpin(false); // Can close modal here or rely on Modal's auto-close/callback flow?
        // MpinModal will stay open if I don't close it, but it handles verification internally if mode='verify'?
        // Wait, MpinModal with mode='verify' calls backend internally. 
        // BUT Transfer API needs the MPIN too now?
        // "Update Transfer logic to verify Account MPIN" - YES.
        // So I can't just rely on MpinModal's internal verification because that only checks validity.
        // I need to send the MPIN to the /transfer endpoint.
        // So I should use MpinModal in a 'create' mode (just return mpin) OR 'verify' mode?
        // If I use 'verify' mode, it calls /verify-mpin. If successful, it calls onSuccess(mpin).
        // Then I call /transfer with that mpin. All good.

        setShowMpin(false);
        try {
            const res = await axios.post('http://localhost:8080/api/banking/transfer', {
                fromAccount: fromAccountISO,
                toAccount,
                amount: parseFloat(amount),
                mpin: mpin // Send verified MPIN
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Transfer Successful! Transaction ID: " + res.data.id);
            navigate('/dashboard');
        } catch (e) {
            console.error("Transfer failed", e);
            alert("Transfer Failed: " + (e.response ? e.response.data : e.message));
        }
    };

    // Find account ID for selected ISO
    const selectedAccount = myAccounts.find(a => a.accountNumber === fromAccountISO);
    const selectedAccountId = selectedAccount ? selectedAccount.id : null;

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-10">
            {/* ... Form UI ... */}
            <h2 className="text-2xl font-bold text-gray-800">Transfer Funds</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleTransferClick} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From Account (My Accounts)</label>
                        <select
                            value={fromAccountISO}
                            onChange={(e) => setFromAccountISO(e.target.value)}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg border"
                        >
                            <option value="">Select Account</option>
                            {myAccounts.map(acc => (
                                <option key={acc.id} value={acc.accountNumber}>
                                    {acc.type} - {acc.accountNumber} (Bal: ${acc.balance})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">To Account Number</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                required
                                value={toAccount}
                                onChange={(e) => setToAccount(e.target.value)}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 py-3 sm:text-sm border-gray-300 rounded-lg border"
                                placeholder="Target Account Number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                required
                                min="1"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 py-3 sm:text-sm border-gray-300 rounded-lg border"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Review & Transfer
                    </button>
                </form>
            </div>

            <MpinModal
                mode="verify"
                accountId={selectedAccountId}
                isOpen={showMpin}
                onClose={() => setShowMpin(false)}
                onSuccess={executeTransfer}
            />
        </div>
    );
}
