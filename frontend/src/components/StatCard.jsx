import React from 'react';
import { Eye, EyeOff, Wallet, CreditCard } from 'lucide-react';

export default function StatCard({ title, value, type, isVisible, onToggleBalance, onClick, status, onUpdateStatus, onDelete }) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden ${status === 'BLOCKED' ? 'opacity-75 bg-gray-50' : ''}`}>
            {status === 'BLOCKED' && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">BLOCKED</div>}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${type === 'SAVINGS' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                    {type === 'SAVINGS' ? <Wallet size={24} /> : <CreditCard size={24} />}
                </div>
                <div className="flex gap-2">
                    <button onClick={onToggleBalance} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    {/* Management Actions Dropdown or simple buttons */}
                </div>
            </div>
            <div className="cursor-pointer" onClick={onClick} title="Click to view transactions">
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                        {status === 'BLOCKED' ? '---' : (isVisible ? `$${value?.toLocaleString()}` : '••••••')}
                    </span>
                    {status !== 'BLOCKED' && <span className="text-xs text-gray-400">USD</span>}
                </div>
                <p className="text-xs text-indigo-600 mt-2 hover:underline">View Transactions →</p>
            </div>

            {(onUpdateStatus || onDelete) && (
                <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    {onUpdateStatus && (
                        status === 'ACTIVE' ? (
                            <button onClick={() => onUpdateStatus('BLOCKED')} className="text-xs text-amber-600 hover:bg-amber-50 px-2 py-1 rounded">Block</button>
                        ) : (
                            <button onClick={() => onUpdateStatus('ACTIVE')} className="text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded">Unblock</button>
                        )
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded">Delete</button>
                    )}
                </div>
            )}
        </div>
    );
}
