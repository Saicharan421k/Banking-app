import React from 'react';

export default function TransactionTable({ transactions }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-3 font-medium">Date</th>
                            <th className="px-6 py-3 font-medium">Description</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Amount</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {tx.description}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {tx.type}
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.type === 'DEBIT' ? '-' : '+'}${tx.amount}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                    No recent transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
