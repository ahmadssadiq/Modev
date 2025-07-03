import React, { useState, useEffect } from 'react';
import { PlusIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useNotify } from '../hooks/useNotifications';

const Budget: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const notify = useNotify();

    return (
        <DashboardLayout
            title="Budget Management"
            subtitle="Set spending limits and monitor your AI costs"
            actions={
                <button className="btn-primary flex items-center">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Set Budget
                </button>
            }
        >
            <div className="space-y-6">
                <div className="card p-6">
                    <div className="text-center py-12">
                        <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Budget Management</h3>
                        <p className="text-gray-600 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                            Set up budget limits to control your AI spending and get alerts when approaching limits.
                        </p>
                        <button className="btn-primary">
                            Set Your First Budget
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Budget;
