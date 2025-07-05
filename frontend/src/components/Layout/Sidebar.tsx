import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    KeyIcon,
    CogIcon,
    LightBulbIcon,
    UserIcon,
    DocumentChartBarIcon,
    CodeBracketIcon,
    CpuChipIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Budget', href: '/budget', icon: CurrencyDollarIcon },
    { name: 'API Keys', href: '/api-keys', icon: KeyIcon },
    { name: 'Integration', href: '/integration', icon: CodeBracketIcon },
    { name: 'Recommendations', href: '/recommendations', icon: LightBulbIcon },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActivePath = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
            {/* Logo */}
            <div className="flex items-center justify-start h-16 px-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #FF6127 0%, #FFB99F 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CpuChipIcon style={{ width: 16, height: 16, color: 'white' }} />
                    </div>
                    <span
                        className="text-lg font-medium text-gray-900"
                        style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}
                    >
                        MODEV
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = isActivePath(item.href);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={`sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                                }`}
                            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-400'
                                    }`}
                            />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p
                            className="text-sm font-medium text-gray-900 truncate"
                            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                        >
                            {user?.full_name || user?.email}
                        </p>
                        <p
                            className="text-xs text-gray-500 capitalize"
                            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                        >
                            {user?.plan} Plan
                        </p>
                    </div>
                </div>

                {/* Plan Badge */}
                <div className="mb-4">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.plan === 'enterprise'
                            ? 'bg-purple-100 text-purple-800'
                            : user?.plan === 'premium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : user?.plan === 'basic'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                    >
                        {user?.plan === 'free' ? 'Free Tier' : `${user?.plan} Plan`}
                    </span>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                    <NavLink
                        to="/settings/profile"
                        className="sidebar-link sidebar-link-inactive text-xs"
                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                    >
                        <CogIcon className="mr-2 h-4 w-4 text-gray-400" />
                        Account Settings
                    </NavLink>

                    <button
                        onClick={logout}
                        className="w-full text-left sidebar-link sidebar-link-inactive text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                    >
                        <svg
                            className="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 