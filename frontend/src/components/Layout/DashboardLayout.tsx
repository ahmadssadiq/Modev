import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationToast from '../UI/NotificationToast';

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    title,
    subtitle,
    actions,
}) => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header title={title} subtitle={subtitle} actions={actions} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* Notification Toast Container */}
            <NotificationToast />
        </div>
    );
};

export default DashboardLayout; 