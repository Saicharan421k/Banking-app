import React from 'react';

export default function ActionCard({ icon: Icon, title, description, colorClass, onClick }) {
    return (
        <div onClick={onClick} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start gap-4 h-full">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
}
