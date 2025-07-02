#!/bin/bash

# AI Cost Optimizer - Development Startup Script
# This script starts both backend and frontend services

set -e

echo "🚀 Starting AI Cost Optimizer Development Environment"
echo "=================================================="

# Check if required tools are installed
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ Node.js/npm is required but not installed. Aborting." >&2; exit 1; }

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the existing service or use a different port."
        return 1
    fi
    return 0
}

# Check ports
check_port 8000 || exit 1
check_port 5173 || exit 1

echo ""
echo "📋 Setup Requirements Check"
echo "=========================="

# Backend setup
echo "🔧 Setting up Backend..."
cd backend

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Check if dependencies are installed
if [ ! -f ".venv/pyvenv.cfg" ] || [ ! -f ".venv/lib/python*/site-packages/fastapi" 2>/dev/null ]; then
    echo "📦 Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    # Update to use SQLite for easier development
    sed -i '' 's|DATABASE_URL=postgresql://.*|DATABASE_URL=sqlite:///./ai_cost_optimizer.db|' .env
fi

# Run database migrations
echo "🗄️  Setting up database..."
alembic upgrade head

cd ..

# Frontend setup
echo "🔧 Setting up Frontend..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating frontend environment configuration..."
    echo "VITE_API_URL=http://localhost:8000" > .env
fi

cd ..

echo ""
echo "🚀 Starting Services"
echo "==================="

# Function to handle cleanup
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🔄 Starting Backend API (http://localhost:8000)..."
cd backend
source .venv/bin/activate

# Run database migrations if needed
echo "🗄️  Running database migrations..."
alembic upgrade head

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Test backend health
echo "🔍 Testing backend health..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
fi

# Start frontend in background
echo "🔄 Starting Frontend Dashboard (http://localhost:5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services Started Successfully!"
echo "================================"
echo "🌐 Frontend Dashboard: http://localhost:5173"
echo "🔌 Backend API:        http://localhost:8000"
echo "📖 API Documentation:  http://localhost:8000/docs"
echo "❤️  Health Check:       http://localhost:8000/health"
echo ""
echo "📋 Quick Start Guide:"
echo "1. Visit http://localhost:5173/register to create an account"
echo "2. Login and go to 'API Keys' to add your OpenAI/Anthropic keys"
echo "3. Set up budget limits in 'Budget Management'"
echo "4. Use the proxy endpoints to route your AI API calls:"
echo "   • OpenAI: http://localhost:8000/proxy/openai/v1/chat/completions"
echo "   • Anthropic: http://localhost:8000/proxy/anthropic/v1/messages"
echo "5. View your usage analytics in the Dashboard"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID 