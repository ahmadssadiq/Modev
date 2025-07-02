# 🚀 How to Use AI Cost Optimizer Proxy Endpoints

## Overview

The AI Cost Optimizer acts as a **transparent proxy** between your applications and AI providers (OpenAI, Anthropic, etc.). By routing your AI API calls through our platform, we automatically track usage, calculate costs, and provide analytics.

## ✅ Prerequisites

1. **Account Created**: You have registered at http://localhost:5173/register
2. **API Keys Added**: You've added your OpenAI/Anthropic API keys in the dashboard
3. **JWT Token**: You have your platform authentication token

## 🔄 Step 4: Using the Proxy Endpoints

### 1. Get Your Platform JWT Token

After logging in, you can get your JWT token from:
- **Browser Dev Tools**: Check Network tab → Login request → Response
- **Programmatically**: Save the token from your login response

```javascript
// Example login to get token
const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'your-email@example.com',
        password: 'your-password'
    })
});
const { access_token } = await response.json();
```

### 2. Replace Your API Endpoints

Instead of calling AI providers directly, route through our proxy:

#### OpenAI Example

**Before (Direct to OpenAI):**
```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer sk-your-openai-key',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }]
    })
});
```

**After (Through AI Cost Optimizer):**
```javascript
const response = await fetch('http://localhost:8000/proxy/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_PLATFORM_JWT_TOKEN',  // Your platform token
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }]
    })
});
```

#### Anthropic Example

**Before (Direct to Anthropic):**
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer your-anthropic-key',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 100
    })
});
```

**After (Through AI Cost Optimizer):**
```javascript
const response = await fetch('http://localhost:8000/proxy/anthropic/v1/messages', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_PLATFORM_JWT_TOKEN',  // Your platform token
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 100
    })
});
```

## 🛠️ Supported Endpoints

### OpenAI
- **Chat Completions**: `POST /proxy/openai/v1/chat/completions`
- **Completions**: `POST /proxy/openai/v1/completions`
- **Embeddings**: `POST /proxy/openai/v1/embeddings`
- **Models**: `GET /proxy/openai/v1/models`

### Anthropic
- **Messages**: `POST /proxy/anthropic/v1/messages`
- **Models**: `GET /proxy/anthropic/v1/models`

### Azure OpenAI
- **Chat Completions**: `POST /proxy/azure/openai/deployments/{deployment}/chat/completions`

## 📋 Complete Example

Here's a working Python example:

```python
import requests
import json

# Your platform configuration
PLATFORM_BASE_URL = "http://localhost:8000"
JWT_TOKEN = "your-jwt-token-here"

# Headers for all requests
headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",
    "Content-Type": "application/json"
}

# Example: OpenAI Chat Completion
def chat_with_openai(message):
    url = f"{PLATFORM_BASE_URL}/proxy/openai/v1/chat/completions"
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}],
        "max_tokens": 150
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Example usage
result = chat_with_openai("Explain quantum computing in simple terms")
if result:
    print(result['choices'][0]['message']['content'])
```

## 🔍 What Happens When You Use the Proxy

1. **Request Forwarding**: Your request is forwarded to the actual AI provider
2. **Response Passthrough**: The AI provider's response is returned to you unchanged
3. **Usage Logging**: We log the request details (tokens, model, cost) to your account
4. **Cost Calculation**: Real-time cost calculation based on current pricing
5. **Analytics Update**: Your dashboard analytics are updated in real-time

## 📊 Viewing Your Usage

After making requests through the proxy:

1. **Dashboard**: Go to http://localhost:5173/dashboard
2. **View Analytics**: See real-time cost tracking, token usage, and trends
3. **Check Budget**: Monitor your spending against set limits
4. **Get Recommendations**: Receive cost optimization suggestions

## 🧪 Testing Your Setup

Use our example script to test the integration:

```bash
# Replace with your actual JWT token
./example-usage.sh "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

This script will:
- Test the health endpoint
- Check your API keys
- Make a sample OpenAI request
- Show usage analytics

## 🔧 Troubleshooting

### Common Issues

**❌ "Unauthorized" Error**
- Check that you're using your **platform JWT token**, not your OpenAI API key
- Ensure the token hasn't expired (re-login if needed)

**❌ "No API key found for provider"**
- Make sure you've added your OpenAI/Anthropic API key in the dashboard
- Check that the API key is marked as "Active"

**❌ "Failed to connect"**
- Ensure the backend is running on http://localhost:8000
- Check that your API endpoint URL is correct

**❌ "Invalid API key"**
- Verify your original OpenAI/Anthropic API key is valid
- Test it directly with the provider first

### Getting Help

1. **Health Check**: Visit http://localhost:8000/health
2. **API Docs**: Check http://localhost:8000/docs
3. **Dashboard**: Review error messages in http://localhost:5173/dashboard

## 🎯 Next Steps

Once you're successfully using the proxy:

1. **Set Budget Limits**: Configure spending alerts in Budget Management
2. **Monitor Usage**: Check your dashboard regularly for cost insights
3. **Optimize Models**: Use recommendations to switch to cheaper alternatives
4. **Scale Usage**: The proxy handles high-volume requests efficiently

---

**🎉 You're now saving money on AI costs with real-time tracking and optimization!** 