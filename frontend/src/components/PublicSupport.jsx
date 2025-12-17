import React, { useState } from 'react';
import axios from 'axios';
import { X, MessageSquare, AlertCircle } from 'lucide-react';

export default function PublicSupport({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [issueType, setIssueType] = useState('LOGIN_ISSUE');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8080/api/public/support', {
                email,
                issueType,
                description
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setEmail('');
                setDescription('');
            }, 2000);
        } catch (err) {
            setError('Failed to submit ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare size={20} className="text-indigo-600" />
                        Contact Support
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8 text-green-600">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h4 className="font-bold text-lg">Ticket Submitted!</h4>
                            <p className="text-gray-500 mt-2">Our team will contact you via email shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email for Contact</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                                <select
                                    value={issueType}
                                    onChange={e => setIssueType(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="LOGIN_ISSUE">Login Issue (Blocked/Forgot Password)</option>
                                    <option value="ACCOUNT_ACCESS">Cannot Access Account</option>
                                    <option value="OTHER">Other Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows="4"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Please describe your issue..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Submitting...' : 'Submit Support Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
