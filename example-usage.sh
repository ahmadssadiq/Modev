#!/bin/bash

# AI Cost Optimizer - Example API Usage
# This script demonstrates how to use the AI Cost Optimizer proxy

echo "🤖 AI Cost Optimizer - Example API Usage"
echo "========================================"

# Check if JWT token is provided
if [ -z "$1" ]; then
    echo "❌ Missing JWT token!"
    echo ""
    echo "Usage: ./example-usage.sh YOUR_JWT_TOKEN"
    echo ""
    echo "To get your JWT token:"
    echo "1. Register/Login at http://localhost:5173"
    echo "2. Add your OpenAI API key in the dashboard"
    echo "3. Copy your JWT token from browser dev tools or login response"
    echo ""
    exit 1
fi

JWT_TOKEN="$1"
API_BASE="http://localhost:8000"

echo "🔑 Using JWT Token: ${JWT_TOKEN:0:20}..."
echo ""

# Test 1: Health Check
echo "📡 Testing Health Check..."
curl -s "$API_BASE/health" | jq '.' 2>/dev/null || curl -s "$API_BASE/health"
echo ""

# Test 2: Get User Profile
echo "👤 Testing User Profile..."
curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/auth/me" | jq '.' 2>/dev/null || curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/auth/me"
echo ""

# Test 3: List API Keys
echo "🔑 Testing API Keys List..."
curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/proxy/api-keys" | jq '.' 2>/dev/null || curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/proxy/api-keys"
echo ""

# Test 4: OpenAI Proxy Example (if API key is configured)
echo "🤖 Testing OpenAI Proxy..."
echo "Making a simple chat completion request through the proxy..."

OPENAI_REQUEST='{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello! This is a test from AI Cost Optimizer. Please respond with just \"Hello from OpenAI!\""
    }
  ],
  "max_tokens": 50
}'

echo "Request:"
echo "$OPENAI_REQUEST" | jq '.' 2>/dev/null || echo "$OPENAI_REQUEST"
echo ""

echo "Response:"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "$OPENAI_REQUEST" \
  "$API_BASE/proxy/openai/v1/chat/completions" | jq '.' 2>/dev/null || curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "$OPENAI_REQUEST" \
  "$API_BASE/proxy/openai/v1/chat/completions"
echo ""

# Test 5: Usage Analytics
echo "📊 Testing Usage Analytics..."
curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/analytics/usage-summary?period_days=7" | jq '.' 2>/dev/null || curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/analytics/usage-summary?period_days=7"
echo ""

# Test 6: Budget Status
echo "💰 Testing Budget Status..."
curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/analytics/budget-status" | jq '.' 2>/dev/null || curl -s -H "Authorization: Bearer $JWT_TOKEN" "$API_BASE/analytics/budget-status"
echo ""

echo "✅ Testing Complete!"
echo ""
echo "📈 Next Steps:"
echo "• Check your dashboard at http://localhost:5173 to see usage analytics"
echo "• Set up budget limits to control spending"
echo "• View API documentation at http://localhost:8000/docs"
echo "• Replace your existing OpenAI endpoint with: $API_BASE/proxy/openai/v1/..."
echo "" 