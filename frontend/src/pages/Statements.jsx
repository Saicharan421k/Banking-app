import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Download, Calendar, FileText, FileSpreadsheet } from 'lucide-react';

export default function Statements() {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:8080/api/banking/accounts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAccounts(res.data);
                if (res.data.length > 0) setSelectedAccount(res.data[0].id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAccounts();
    }, [token]);

    const handleDownload = async (format) => {
        if (!selectedAccount) return alert('Please select an account');

        // Build query string
        let query = `?format=${format}`;
        if (startDate) query += `&startDate=${startDate}`;
        if (endDate) query += `&endDate=${endDate}`;

        try {
            const response = await axios.get(`http://localhost:8080/api/statements/${selectedAccount}/download${query}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for handling binary data
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const ext = format === 'pdf' ? 'pdf' : 'csv';
            link.setAttribute('download', `statement_${selectedAccount}.${ext}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            const status = err.response ? err.response.status : 'Unknown';
            alert(`Failed to download statement (Status: ${status}). Please check console/backend logs.`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-800">Account Statements</h2>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Select Account</label>
                    <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>
                                {acc.type} - {acc.accountNumber} (${acc.balance})
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-4 border-l pl-8 border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Select Format to Download</p>

                    <button
                        onClick={() => handleDownload('pdf')}
                        className="flex items-center justify-between w-full p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors border border-red-100 group"
                    >
                        <div className="flex items-center gap-3">
                            <FileText size={24} className="text-red-500" />
                            <span className="font-semibold">Download PDF</span>
                        </div>
                        <Download size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                        onClick={() => handleDownload('csv')}
                        className="flex items-center justify-between w-full p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-100 group"
                    >
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet size={24} className="text-green-500" />
                            <span className="font-semibold">Download CSV</span>
                        </div>
                        <Download size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-blue-800 text-sm">
                <Calendar size={18} className="mt-0.5 shrink-0" />
                <p>By default, statements include transactions from the last 30 days if no date range is selected.</p>
            </div>
        </div>
    );
}
