import React, { type ReactNode } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between h-16 px-6">
                {/* Left section - Page title */}
                <div className="flex-1">
                    {title && (
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Center section - Search (if needed) */}
                <div className="flex-1 max-w-lg mx-8">
                    {/* <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div> */}
                </div>

                {/* Right section - Actions and user menu */}
                <div className="flex items-center space-x-4">
                    {/* Custom actions */}
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}

                    {/* Notifications */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <BellIcon className="h-6 w-6" />
                    </button>

                    {/* User info */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                {user?.full_name || user?.email}
                            </div>
                            <div className="text-xs text-gray-500 capitalize" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                {user?.plan} Plan
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 