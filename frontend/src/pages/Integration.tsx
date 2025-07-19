import React, { useState, useEffect } from 'react';
import { ClipboardIcon, EyeIcon, EyeSlashIcon, CheckIcon, CodeBracketIcon, KeyIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotifications';
import type { APIKey } from '../types';
import apiService from '../services/api';

const Integration: React.FC = () => {
    const { token } = useAuth();
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotify();

    useEffect(() => {
        // Get the API URL from environment or current domain
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin.replace(':5173', ':8000');
        setApiUrl(baseUrl);
        loadApiKeys();
    }, []);

    const loadApiKeys = async () => {
        try {
            setLoading(true);
            const keys = await apiService.getAPIKeys();
            setApiKeys(keys);
        } catch (error: any) {
            console.error('Failed to load API keys:', error);
            // Don't show error for missing API keys on integration page
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            notify.success('Copied!', `${label} copied to clipboard`);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            notify.error('Copy failed', 'Please copy manually');
        }
    };

    const truncateToken = (token: string) => {
        if (!token) return '';
        return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
    };

    const hasActiveKeys = apiKeys.filter(key => key.is_active).length > 0;
    const setupProgress = {
        hasApiKeys: hasActiveKeys,
        hasToken: !!token,
        isComplete: hasActiveKeys && !!token
    };

    return (
        <DashboardLayout
            title="API Integration"
            subtitle="Get your API credentials and integration details"
        >
            <div className="space-y-6">
                {/* Setup Progress */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: '"Instrument Serif", serif', fontWeight: 400 }}>Setup Progress</h3>
                    <div className="space-y-3">
                        {/* Step 1: API Keys */}
                        <div className="flex items-center space-x-3">
                            {setupProgress.hasApiKeys ? (
                                <CheckIcon className="h-5 w-5 text-green-600" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className={`text-sm ${setupProgress.hasApiKeys ? 'text-green-900' : 'text-gray-700'}`}>
                                Add your AI provider API keys
                            </span>
                            {!setupProgress.hasApiKeys && (
                                <a href="/api-keys" className="text-sm text-blue-600 hover:text-blue-800">
                                    Add API Keys →
                                </a>
                            )}
                        </div>

                        {/* Step 2: Get Token */}
                        <div className="flex items-center space-x-3">
                            {setupProgress.hasToken ? (
                                <CheckIcon className="h-5 w-5 text-green-600" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className={`text-sm ${setupProgress.hasToken ? 'text-green-900' : 'text-gray-700'}`}>
                                Get your API integration token
                            </span>
                        </div>

                        {/* Step 3: Start Using */}
                        <div className="flex items-center space-x-3">
                            {setupProgress.isComplete ? (
                                <CheckIcon className="h-5 w-5 text-green-600" />
                            ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                            )}
                            <span className={`text-sm ${setupProgress.isComplete ? 'text-green-900' : 'text-gray-700'}`}>
                                Start making requests through our proxy
                            </span>
                        </div>
                    </div>

                    {setupProgress.isComplete && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">
                                🎉 Setup complete! You're ready to start tracking AI usage and costs.
                            </p>
                        </div>
                    )}
                </div>

                {/* API Keys Status */}
                {!loading && (
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Connected Providers</h3>
                            <span className="text-sm text-gray-500">
                                {apiKeys.length} {apiKeys.length === 1 ? 'provider' : 'providers'} connected
                            </span>
                        </div>

                        {apiKeys.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No API Keys Added</h4>
                                <p className="text-gray-600 mb-4">
                                    You need to add your OpenAI or Anthropic API keys first.
                                </p>
                                <a href="/api-keys" className="btn-primary inline-flex items-center">
                                    <KeyIcon className="h-5 w-5 mr-2" />
                                    Add Your First API Key
                                </a>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {apiKeys.map((key) => (
                                    <div key={key.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
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
                                                    <CheckIcon className="h-4 w-4 text-green-500 ml-2" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{key.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Warning if no API keys */}
                {!loading && apiKeys.length === 0 && (
                    <div className="card p-6 border-l-4 border-yellow-400 bg-yellow-50">
                        <div className="flex">
                            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                                    Action Required: Add API Keys
                                </h3>
                                <p className="text-sm text-yellow-800 mb-3">
                                    You need to add your AI provider API keys before you can use the integration endpoints.
                                    Without API keys, the proxy won't know how to authenticate with OpenAI, Anthropic, etc.
                                </p>
                                <a
                                    href="/api-keys"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-900 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    <KeyIcon className="h-4 w-4 mr-2" />
                                    Add API Keys Now
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* API Token Section - Only show if user has API keys */}
                {apiKeys.length > 0 && (
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Your API Token</h3>
                                <p className="text-sm text-gray-600">
                                    Use this token to authenticate requests to the AI Cost Optimizer proxy
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Token Display */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bearer Token
                                </label>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type={showToken ? 'text' : 'password'}
                                            value={token || ''}
                                            readOnly
                                            className="input-field pr-20 font-mono text-sm"
                                            placeholder="Your token will appear here"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowToken(!showToken)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                                title={showToken ? 'Hide token' : 'Show token'}
                                            >
                                                {showToken ? (
                                                    <EyeSlashIcon className="h-4 w-4" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(token || '', 'API Token')}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                                title="Copy token"
                                            >
                                                {copied ? (
                                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <ClipboardIcon className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Keep this token secure. It provides access to your AI usage tracking.
                                </p>
                            </div>

                            {/* API Base URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    API Base URL
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={apiUrl}
                                        readOnly
                                        className="input-field font-mono text-sm flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(apiUrl, 'API URL')}
                                        className="btn-secondary p-2"
                                        title="Copy API URL"
                                    >
                                        <ClipboardIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Start Examples - Only show if setup is complete */}
                {setupProgress.isComplete && (
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">🚀 One-Line Integration</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Recommended
                            </span>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Just change your baseURL - no headers, no complex setup. Works with any OpenAI-compatible SDK.
                        </p>

                        <div className="space-y-6">
                            {/* OpenAI SDK (JavaScript) */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded mr-2">JavaScript</span>
                                    OpenAI SDK - One Line Change
                                </h4>
                                <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                        {`import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "${apiUrl}/v1/${token ? truncateToken(token) : 'YOUR_TOKEN'}/${apiKeys[0]?.provider || 'openai'}/"
});

// That's it! Use normally:
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello!" }]
});`}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(
                                            `import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "${apiUrl}/v1/${token}/${apiKeys[0]?.provider || 'openai'}/"
});

// That's it! Use normally:
const response = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello!" }]
});`,
                                            'OpenAI JavaScript SDK'
                                        )}
                                        className="absolute top-2 right-2 btn-secondary p-2 text-xs"
                                    >
                                        <ClipboardIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Python SDK */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">Python</span>
                                    OpenAI SDK - One Line Change
                                </h4>
                                <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                        {`from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="${apiUrl}/v1/${token ? truncateToken(token) : 'YOUR_TOKEN'}/${apiKeys[0]?.provider || 'openai'}/"
)

# That's it! Use normally:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)`}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(
                                            `from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url="${apiUrl}/v1/${token}/${apiKeys[0]?.provider || 'openai'}/"
)

# That's it! Use normally:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}]
)`,
                                            'OpenAI Python SDK'
                                        )}
                                        className="absolute top-2 right-2 btn-secondary p-2 text-xs"
                                    >
                                        <ClipboardIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* LangChain Example */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded mr-2">LangChain</span>
                                    Works with Any Framework
                                </h4>
                                <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                        {`from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    base_url="${apiUrl}/v1/${token ? truncateToken(token) : 'YOUR_TOKEN'}/${apiKeys[0]?.provider || 'openai'}/"
)

# Works with any LangChain chain!
response = llm.invoke("Hello, world!")`}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(
                                            `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    base_url="${apiUrl}/v1/${token}/${apiKeys[0]?.provider || 'openai'}/"
)

# Works with any LangChain chain!
response = llm.invoke("Hello, world!")`,
                                            'LangChain example'
                                        )}
                                        className="absolute top-2 right-2 btn-secondary p-2 text-xs"
                                    >
                                        <ClipboardIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Simple cURL */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded mr-2">cURL</span>
                                    Direct API Testing
                                </h4>
                                <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                        {`curl -X POST "${apiUrl}/v1/${token ? truncateToken(token) : 'YOUR_TOKEN'}/${apiKeys[0]?.provider || 'openai'}/chat/completions" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'`}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(
                                            `curl -X POST "${apiUrl}/v1/${token}/${apiKeys[0]?.provider || 'openai'}/chat/completions" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'`,
                                            'cURL example'
                                        )}
                                        className="absolute top-2 right-2 btn-secondary p-2 text-xs"
                                    >
                                        <ClipboardIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex">
                                <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-green-900 font-medium">Why This is Amazing:</h4>
                                    <ul className="text-sm text-green-800 mt-1 space-y-1">
                                        <li>• <strong>Zero refactoring</strong> - works with existing code</li>
                                        <li>• <strong>Any framework</strong> - OpenAI SDK, LangChain, LiteLLM, etc.</li>
                                        <li>• <strong>Drop-in replacement</strong> - same API, enhanced with analytics</li>
                                        <li>• <strong>Immediate cost tracking</strong> - see usage in your dashboard instantly</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Endpoints - Only show if setup is complete */}
                {setupProgress.isComplete && (
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Endpoints</h3>

                        <div className="space-y-4">
                            {/* OpenAI Endpoints */}
                            {apiKeys.some(key => key.provider === 'openai') && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                        🤖 OpenAI Endpoints
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <code className="text-gray-800">POST /proxy/openai/v1/chat/completions</code>
                                            <span className="text-gray-600">Chat Completions</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <code className="text-gray-800">POST /proxy/openai/v1/completions</code>
                                            <span className="text-gray-600">Text Completions</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <code className="text-gray-800">POST /proxy/openai/v1/embeddings</code>
                                            <span className="text-gray-600">Embeddings</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Anthropic Endpoints */}
                            {apiKeys.some(key => key.provider === 'anthropic') && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                        🧠 Anthropic Endpoints
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <code className="text-gray-800">POST /proxy/anthropic/v1/messages</code>
                                            <span className="text-gray-600">Claude Messages</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Security Notes */}
                {setupProgress.isComplete && (
                    <div className="card p-6 border-l-4 border-yellow-400 bg-yellow-50">
                        <h3 className="text-lg font-semibold text-yellow-900 mb-2">🔒 Security Notes</h3>
                        <ul className="text-sm text-yellow-800 space-y-2">
                            <li>• Keep your API token secure and never expose it in client-side code</li>
                            <li>• Use environment variables to store your token in production</li>
                            <li>• Your token provides access to your usage data and can incur costs</li>
                            <li>• If you believe your token is compromised, re-login to get a new token</li>
                        </ul>
                    </div>
                )}

                {/* Test Integration */}
                {setupProgress.isComplete && (
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Your Integration</h3>
                        <p className="text-gray-600 mb-4">
                            Once you start making requests through our proxy, you'll see real-time analytics in your dashboard.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="/dashboard"
                                className="btn-primary inline-flex items-center"
                            >
                                <CodeBracketIcon className="h-5 w-5 mr-2" />
                                View Dashboard
                            </a>
                            <a
                                href="/api-keys"
                                className="btn-secondary inline-flex items-center"
                            >
                                <KeyIcon className="h-5 w-5 mr-2" />
                                Manage API Keys
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Integration; 