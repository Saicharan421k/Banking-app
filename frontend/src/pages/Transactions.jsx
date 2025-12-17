import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Transactions() {
    const { accountNumber } = useParams();
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTx = async () => {
            if (!token) return;
            try {
                const url = accountNumber
                    ? `http://localhost:8080/api/banking/transactions/${accountNumber}`
                    : `http://localhost:8080/api/banking/transactions/recent`;

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to fetch transactions", err);
            }
        };
        fetchTx();
    }, [accountNumber, token]);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">
                {accountNumber ? `Transactions for ${accountNumber}` : 'All Recent Transactions'}
            </h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map(tx => (
                            <tr key={tx.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.type}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                    ${tx.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
