import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // const getPlanColor = (plan: string) => {
    //     switch (plan?.toLowerCase()) {
    //         case 'free':
    //             return 'bg-orange-100 text-orange-600 border border-orange-200';
    //         case 'professional':
    //             return 'bg-green-100 text-green-600 border border-green-200';
    //         case 'enterprise':
    //             return 'bg-purple-100 text-purple-600 border border-purple-200';
    //         default:
    //             return 'bg-gray-100 text-gray-600 border border-gray-200';
    //     }
    // };

    const shouldShowUpgrade = (plan: string) => {
        return plan?.toLowerCase() === 'free';
    };

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

                    {/* Plan Upgrade Button - only show for free plan */}
                    {user && shouldShowUpgrade(user.plan) && (
                        <button
                            onClick={() => navigate('/plan-selection')}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-500 transition-all shadow-sm"
                        >
                            <ArrowUpIcon className="h-4 w-4" />
                            <span style={{ fontFamily: '"Nunito Sans", sans-serif' }}>Upgrade</span>
                        </button>
                    )}

                    {/* Notifications */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <BellIcon className="h-6 w-6" />
                    </button>

                    {/* User info */}
                    {/* <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                {user?.full_name || user?.email}
                            </div>
                            <button
                                onClick={() => navigate('/plan-selection')}
                                className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:shadow-sm transition-all ${getPlanColor(user?.plan || 'free')}`}
                                style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                title="Click to change plan"
                            >
                                {user?.plan || 'Free'} Plan
                            </button>
                        </div>
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        </header>
    );
};

export default Header; 