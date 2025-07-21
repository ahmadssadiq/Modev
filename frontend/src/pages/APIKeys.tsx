import React, { useState, useEffect } from 'react';
import { PlusIcon, KeyIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/Layout/DashboardLayout';
import type { APIKey, APIKeyCreate } from '../types';
import apiService from '../services/api';
import { useNotify } from '../hooks/useNotifications';

const APIKeys: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newApiKey, setNewApiKey] = useState<APIKeyCreate>({
        name: '',
        provider: 'openai',
        api_key: '',
    });
    const [showApiKey, setShowApiKey] = useState(false);
    const [addingKey, setAddingKey] = useState(false);
    const notify = useNotify();

    useEffect(() => {
        loadApiKeys();
    }, []);

    const loadApiKeys = async () => {
        try {
            setLoading(true);
            const keys = await apiService.getAPIKeys();
            setApiKeys(keys);
        } catch (error: any) {
            console.error('Failed to load API keys:', error);
            notify.error('Failed to load API keys', error.response?.data?.detail || 'Please try again');
        } finally {
            setLoading(false);
        }
    };

    const handleAddApiKey = async () => {
        if (!newApiKey.name || !newApiKey.provider || !newApiKey.api_key) {
            notify.error('All fields are required', 'Please fill in all fields');
            return;
        }

        try {
            setAddingKey(true);
            await apiService.addAPIKey(newApiKey);
            notify.success('API Key Added', 'Your API key has been securely stored');
            setShowAddModal(false);
            setNewApiKey({ name: '', provider: 'openai', api_key: '' });
            await loadApiKeys();
        } catch (error: any) {
            console.error('Failed to add API key:', error);
            notify.error('Failed to add API key', error.response?.data?.detail || 'Please try again');
        } finally {
            setAddingKey(false);
        }
    };

    const handleDeleteApiKey = async (keyId: number, keyName: string) => {
        if (!confirm(`Are you sure you want to delete the API key "${keyName}"?`)) {
            return;
        }

        try {
            await apiService.deleteAPIKey(keyId);
            notify.success('API Key Deleted', 'The API key has been removed');
            await loadApiKeys();
        } catch (error: any) {
            console.error('Failed to delete API key:', error);
            notify.error('Failed to delete API key', error.response?.data?.detail || 'Please try again');
        }
    };

    const getProviderLogo = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'openai':
                return '🤖';
            case 'anthropic':
                return '🧠';
            case 'azure':
                return '☁️';
            default:
                return '🔑';
        }
    };

    const getProviderColor = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'openai':
                return 'bg-green-100 text-green-800';
            case 'anthropic':
                return 'bg-blue-100 text-blue-800';
            case 'azure':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout
            title="API Keys"
            subtitle="Manage your AI provider API keys"
            actions={
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add API Key
                </button>
            }
        >
            <div className="space-y-6">
                {/* API Keys List */}
                <div className="card p-6">
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                                            <div>
                                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                                            </div>
                                        </div>
                                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : apiKeys.length === 0 ? (
                        <div className="text-center py-12">
                            <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>No API Keys</h3>
                            <p className="text-gray-600 mb-6" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                Add your first API key to start tracking your AI usage and costs.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-primary"
                            >
                                Add Your First API Key
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {apiKeys.map((key) => (
                                <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                            <span className="text-lg">{getProviderLogo(key.provider)}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>{key.name}</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(key.provider)}`} style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                                    {key.provider.charAt(0).toUpperCase() + key.provider.slice(1)}
                                                </span>
                                                <span className="text-sm text-gray-500" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                                    Added {apiService.formatDate(key.created_at)}
                                                </span>
                                                {key.last_used_at && (
                                                    <span className="text-sm text-gray-500" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                                        • Last used {apiService.formatDate(key.last_used_at)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                            {key.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteApiKey(key.id, key.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete API Key"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>How to Use Your API Keys</h3>
                    <div className="space-y-4 text-sm text-gray-600" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>1. Update your API endpoint:</h4>
                            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                # Instead of: https://api.openai.com/v1/chat/completions<br />
                                # Use: https://modev-ahmad.vercel.app/api/proxy/openai/v1/chat/completions
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>2. Use your platform token for authentication:</h4>
                            <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                Authorization: Bearer YOUR_PLATFORM_TOKEN
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>3. Supported providers:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>OpenAI:</strong> /proxy/openai/v1/...</li>
                                <li><strong>Anthropic:</strong> /proxy/anthropic/v1/...</li>
                                <li><strong>Azure OpenAI:</strong> /proxy/azure/...</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add API Key Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Add API Key</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        Key Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newApiKey.name}
                                        onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                                        placeholder="e.g., My OpenAI Key"
                                        className="input-field"
                                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        Provider
                                    </label>
                                    <select
                                        value={newApiKey.provider}
                                        onChange={(e) => setNewApiKey({ ...newApiKey, provider: e.target.value })}
                                        className="input-field"
                                        style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                    >
                                        <option value="openai">OpenAI</option>
                                        <option value="anthropic">Anthropic</option>
                                        <option value="azure">Azure OpenAI</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        API Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showApiKey ? 'text' : 'password'}
                                            value={newApiKey.api_key}
                                            onChange={(e) => setNewApiKey({ ...newApiKey, api_key: e.target.value })}
                                            placeholder="sk-..."
                                            className="input-field pr-10"
                                            style={{ fontFamily: '"Nunito Sans", sans-serif' }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                        >
                                            {showApiKey ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: '"Nunito Sans", sans-serif' }}>
                                        Your API key will be encrypted and stored securely.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewApiKey({ name: '', provider: 'openai', api_key: '' });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddApiKey}
                                    disabled={addingKey}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingKey ? 'Adding...' : 'Add API Key'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default APIKeys; 