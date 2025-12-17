import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleFetchQuestion = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:8080/api/auth/security-question/${username}`);
            setQuestion(res.data.question);
            setStep(2);
        } catch {
            alert('User not found or no security question set.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                username, securityAnswer: answer, newPassword
            });
            alert('Password reset successful! Please login.');
            navigate('/login');
        } catch {
            alert('Password reset failed. Check your answer.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Recovery</h2>
                    <p className="text-sm text-gray-500">Reset your password securely</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleFetchQuestion} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                            Next
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                            <p className="text-xs text-indigo-800 font-bold uppercase">Security Question</p>
                            <p className="text-indigo-900 font-medium">{question}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Answer</label>
                            <input
                                type="text"
                                required
                                placeholder="Your answer"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                required
                                placeholder="New Password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
