import React, { type ReactNode } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
        period?: string;
    };
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    icon,
    change,
    subtitle,
    color = 'primary',
    size = 'md',
    loading = false,
    onClick,
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'p-4';
            case 'lg':
                return 'p-8';
            default:
                return 'p-6';
        }
    };

    const getIconColor = () => {
        switch (color) {
            case 'success':
                return 'text-success-600 bg-success-100';
            case 'warning':
                return 'text-warning-600 bg-warning-100';
            case 'danger':
                return 'text-danger-600 bg-danger-100';
            case 'gray':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-primary-600 bg-primary-100';
        }
    };

    const getChangeColor = () => {
        if (!change) return '';
        return change.type === 'increase'
            ? 'text-success-600 bg-success-100'
            : 'text-danger-600 bg-danger-100';
    };

    if (loading) {
        return (
            <div className={`metric-card ${getSizeClasses()}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`metric-card ${getSizeClasses()} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {icon && (
                    <div className={`p-2 rounded-lg ${getIconColor()}`}>
                        {icon}
                    </div>
                )}
            </div>

            {/* Main Value */}
            <div className="mb-2">
                <p className={`font-bold text-gray-900 ${size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-2xl' : 'text-3xl'
                    }`}>
                    {value}
                </p>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>

            {/* Change Indicator */}
            {change && (
                <div className="flex items-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
                        {change.type === 'increase' ? (
                            <ArrowUpIcon className="w-3 h-3 mr-1" />
                        ) : (
                            <ArrowDownIcon className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(change.value)}%
                    </span>
                    {change.period && (
                        <span className="text-xs text-gray-500 ml-2">
                            {change.period}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MetricCard; 