import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lock, X } from 'lucide-react';

export default function MpinModal({ mode = 'verify', accountId, isOpen, onClose, onSuccess }) {
    const { token, user } = useAuth();
    const [mpin, setMpin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (mpin.length !== 4) {
            setError('MPIN must be 4 digits');
            return;
        }

        setLoading(true);
        try {
            // Mode: 'create' - Just pass MPIN back to parent (for new account creation)
            if (mode === 'create') {
                await onSuccess(mpin);
                onClose();
                return;
            }

            // Mode: 'setup' or 'verify' - Call Backend API for specific account
            const endpoint = mode === 'setup' ? '/banking/accounts/set-mpin' : '/banking/verify-mpin';
            await axios.post(`http://localhost:8080/api${endpoint}`, {
                username: user.username,
                accountId: accountId, // Required for Account Level
                mpin: mpin
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setLoading(false);
            setMpin('');
            if (onSuccess) onSuccess(mpin); // Pass MPIN back if needed (e.g. for transfer)
            if (mode === 'setup') onClose();
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError(mode === 'verify' ? 'Invalid MPIN' : 'Failed to set MPIN');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fade-in">
                {mode === 'verify' && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                )}

                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                        <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                        {mode === 'setup' ? 'Set Your 4-Digit MPIN' : 'Enter MPIN'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {mode === 'setup'
                            ? 'Secure your account with a PIN for transactions.'
                            : 'Please verify your identity to proceed.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        maxLength="4"
                        pattern="\d{4}"
                        value={mpin}
                        onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-3xl tracking-[1em] font-bold p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••"
                        autoFocus
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || mpin.length !== 4}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Processing...' : (mode === 'setup' ? 'Set MPIN' : 'Verify')}
                    </button>
                </form>
            </div>
        </div>
    );
}
