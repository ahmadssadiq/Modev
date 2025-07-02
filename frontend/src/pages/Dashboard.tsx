import React, { useState, useEffect } from 'react';
import {
    CurrencyDollarIcon,
    ChartBarIcon,
    ClockIcon,
    CpuChipIcon,
    ExclamationTriangleIcon,
    KeyIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

import DashboardLayout from '../components/Layout/DashboardLayout';
import MetricCard from '../components/UI/MetricCard';
import type { AnalyticsResponse, BudgetStatus, APIKey } from '../types';
import apiService from '../services/api';
import { useNotify } from '../hooks/useNotifications';

const Dashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
    const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotify();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [analyticsData, budgetData, apiKeysData] = await Promise.all([
                apiService.getUsageAnalytics(30),
                apiService.getBudgetStatus(),
                apiService.getAPIKeys(),
            ]);

            setAnalytics(analyticsData);
            setBudgetStatus(budgetData);
            setApiKeys(apiKeysData);
        } catch (error: any) {
            console.error('Failed to load dashboard data:', error);
            notify.error('Failed to load dashboard', 'Please try refreshing the page');
        } finally {
            setLoading(false);
        }
    };

    // Chart colors
    const chartColors = {
        primary: '#3B82F6',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        gray: '#6B7280',
    };

    const pieColors = [chartColors.primary, chartColors.success, chartColors.warning, chartColors.danger, chartColors.gray];

    // Format daily usage data for charts
    const dailyUsageData = analytics?.daily_usage.map(day => ({
        ...day,
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cost: Number(day.cost.toFixed(4)),
    })) || [];

    // Get current budget status
    const currentBudget = budgetStatus.find(budget => budget.period_type === 'monthly');

    return (
        <DashboardLayout
            title="Dashboard"
            subtitle="Overview of your AI usage and costs"
        >
            <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Cost"
                        value={analytics ? `$${analytics.summary.total_cost.toFixed(2)}` : '$0.00'}
                        icon={<CurrencyDollarIcon className="h-6 w-6" />}
                        color="primary"
                        subtitle="Last 30 days"
                        loading={loading}
                    />

                    <MetricCard
                        title="Total Requests"
                        value={analytics ? apiService.formatNumber(analytics.summary.total_requests) : '0'}
                        icon={<ChartBarIcon className="h-6 w-6" />}
                        color="success"
                        subtitle="API calls made"
                        loading={loading}
                    />

                    <MetricCard
                        title="Total Tokens"
                        value={analytics ? apiService.formatNumber(analytics.summary.total_tokens) : '0'}
                        icon={<CpuChipIcon className="h-6 w-6" />}
                        color="warning"
                        subtitle="Tokens processed"
                        loading={loading}
                    />

                    <MetricCard
                        title="Connected APIs"
                        value={apiKeys.length.toString()}
                        icon={<KeyIcon className="h-6 w-6" />}
                        color="gray"
                        subtitle={`${apiKeys.filter(key => key.is_active).length} active`}
                        loading={loading}
                    />
                </div>

                {/* Budget Status Alert */}
                {currentBudget && currentBudget.percentage_used > 80 && (
                    <div className={`p-4 rounded-lg border ${currentBudget.is_over_budget
                        ? 'bg-danger-50 border-danger-200'
                        : 'bg-warning-50 border-warning-200'
                        }`}>
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className={`h-6 w-6 mr-3 ${currentBudget.is_over_budget ? 'text-danger-500' : 'text-warning-500'
                                }`} />
                            <div>
                                <h3 className={`font-medium ${currentBudget.is_over_budget ? 'text-danger-800' : 'text-warning-800'
                                    }`}>
                                    {currentBudget.is_over_budget ? 'Budget Exceeded' : 'Budget Alert'}
                                </h3>
                                <p className={`text-sm ${currentBudget.is_over_budget ? 'text-danger-700' : 'text-warning-700'
                                    }`}>
                                    You've used {currentBudget.percentage_used.toFixed(1)}% of your monthly budget
                                    (${currentBudget.current_spend.toFixed(2)} of ${currentBudget.budget_limit.toFixed(2)})
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connected API Keys Status */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Connected AI Providers</h3>
                        <span className="text-sm text-gray-500">
                            {apiKeys.length} {apiKeys.length === 1 ? 'provider' : 'providers'} connected
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                        <div className="h-10 w-10 bg-gray-200 rounded-lg mr-3"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <div className="text-center py-8">
                            <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No API Keys Connected</h4>
                            <p className="text-gray-600 mb-4">
                                Connect your AI provider API keys to start tracking usage and costs.
                            </p>
                            <a
                                href="/api-keys"
                                className="btn-primary inline-flex items-center"
                            >
                                <KeyIcon className="h-5 w-5 mr-2" />
                                Add API Keys
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mr-3">
                                        <span className="text-lg">
                                            {key.provider === 'openai' && '🤖'}
                                            {key.provider === 'anthropic' && '🧠'}
                                            {key.provider === 'azure' && '☁️'}
                                            {!['openai', 'anthropic', 'azure'].includes(key.provider) && '🔑'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <h4 className="font-medium text-gray-900 capitalize">
                                                {key.provider}
                                            </h4>
                                            {key.is_active && (
                                                <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{key.name}</p>
                                        {key.last_used_at && (
                                            <p className="text-xs text-gray-500">
                                                Last used {apiService.formatDate(key.last_used_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {apiKeys.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-blue-800 mb-2">
                                        <strong>Ready to track usage!</strong> Your AI API calls will be logged when you use our proxy endpoints.
                                    </p>
                                    <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono text-blue-900">
                                        {window.location.origin.replace(':5173', ':8000')}/proxy/{apiKeys[0].provider}/...
                                    </code>
                                </div>
                                <a
                                    href="/integration"
                                    className="ml-4 btn-primary text-xs px-3 py-1"
                                >
                                    Get Code Examples
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Cost Trend */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Cost Trend</h3>
                        <div className="h-80">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyUsageData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            stroke="#6B7280"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="#6B7280"
                                        />
                                        <Tooltip
                                            formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Cost']}
                                            labelFormatter={(label) => `Date: ${label}`}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="cost"
                                            stroke={chartColors.primary}
                                            fill={`${chartColors.primary}20`}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Model Usage Breakdown */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Usage by Cost</h3>
                        <div className="h-80">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics?.model_breakdown.slice(0, 5) || []}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            dataKey="cost"
                                            nameKey="model"
                                        >
                                            {analytics?.model_breakdown.slice(0, 5).map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) => [`$${Number(value).toFixed(4)}`, 'Cost']}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Usage Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Models */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Models by Cost</h3>
                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Model
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Cost
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Requests
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <tr key={index}>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        analytics?.model_breakdown.slice(0, 5).map((model, index) => (
                                            <tr key={index}>
                                                <td className="py-3">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {model.model}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {model.provider}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="text-sm text-gray-900">
                                                        ${model.cost.toFixed(4)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {model.percentage.toFixed(1)}%
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="text-sm text-gray-900">
                                                        {apiService.formatNumber(model.requests)}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) ?? []
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Provider Breakdown */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Breakdown</h3>
                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Provider
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Cost
                                        </th>
                                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                                            Share
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <tr key={index}>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        analytics?.provider_breakdown.map((provider, index) => (
                                            <tr key={index}>
                                                <td className="py-3">
                                                    <div className="text-sm font-medium text-gray-900 capitalize">
                                                        {provider.provider}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="text-sm text-gray-900">
                                                        ${provider.cost.toFixed(4)}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="text-sm text-gray-900">
                                                        {provider.percentage.toFixed(1)}%
                                                    </div>
                                                </td>
                                            </tr>
                                        )) ?? []
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard; 