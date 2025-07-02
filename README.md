# AI Cost Optimizer Platform

A vendor-neutral SaaS platform that sits between client applications and AI providers (OpenAI, Anthropic) to track, monitor, and optimize AI API usage and costs in real-time.

## 🎯 Project Overview

The AI Cost Optimizer helps organizations reduce AI costs by **30-60%** through:

- **Real-time Usage Tracking**: Monitor every AI API request with detailed analytics
- **Budget Controls**: Set spending limits with alerts and auto-cutoff functionality  
- **Cost Optimization**: Get actionable recommendations to reduce expenses
- **Multi-provider Support**: Works with OpenAI, Anthropic, and more
- **Professional Dashboard**: Modern React interface for monitoring and management

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   AI Cost        │───▶│   AI Providers  │
│                 │    │   Optimizer      │    │   (OpenAI,      │
│                 │◀───│   (Proxy)        │◀───│   Anthropic)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────┐
                       │   Database   │
                       │   (Usage &   │
                       │   Analytics) │
                       └──────────────┘
```

## 🛠️ Technology Stack

### Backend (FastAPI)
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM with SQLite/PostgreSQL support
- **JWT Authentication**: Secure user management
- **Pydantic**: Data validation and serialization
- **Alembic**: Database migration management

### Frontend (React + TypeScript)
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Professional design system
- **Recharts**: Beautiful data visualizations
- **Vite**: Fast development and building

## 🚀 Quick Start (Both Services)

### Prerequisites
- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **Git**

### 🎯 One-Command Setup (Recommended)

```bash
# In the project directory
./start-dev.sh
```

This script will:
- Set up both backend and frontend environments
- Install all dependencies automatically
- Configure databases and environment files
- Run database migrations
- Start both services and show access URLs

**The script will show you:**
- Frontend Dashboard: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Complete onboarding instructions

### Manual Setup (Alternative)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Setup database (SQLite - no additional config needed)
cp .env.example .env
alembic upgrade head

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start frontend development server
npm run dev
```

### 3. Access the Application

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🚀 Complete Onboarding Workflow

### Step 1: Create Your Account
1. Go to http://localhost:5173/register
2. Fill in your details and create an account
3. You'll be automatically logged in and redirected to the dashboard

### Step 2: Add Your AI Provider API Keys
1. Navigate to "API Keys" in the sidebar
2. Click "Add API Key"
3. Enter your OpenAI API key (format: `sk-...`)
4. Optionally add Anthropic API keys for Claude models

### Step 3: Set Budget Limits (Recommended)
1. Go to "Budget Management"
2. Click "Set Budget"
3. Configure monthly/daily spending limits
4. Enable alerts to get notified when approaching limits
5. Optionally enable auto-cutoff to stop API calls when budget is exceeded

### Step 4: Start Using the Proxy
Replace your existing AI API endpoints with our proxy:

```bash
# Instead of: https://api.openai.com/v1/chat/completions
# Use: http://localhost:8000/proxy/openai/v1/chat/completions

# Your Authorization header should use your platform JWT token:
# Authorization: Bearer YOUR_PLATFORM_JWT_TOKEN
```

### Step 5: Monitor Your Usage
- View real-time analytics in the Dashboard
- Track costs, token usage, and request counts
- See model-by-model breakdowns
- Get cost optimization recommendations

### Step 6: Test the Integration
Use the provided example script:
```bash
# Get your JWT token from the browser dev tools after login
./example-usage.sh YOUR_JWT_TOKEN
```

## 📱 Features

### Dashboard
- **Real-time Metrics**: Cost, requests, tokens, efficiency tracking
- **Budget Monitoring**: Visual alerts and spending limits
- **Usage Analytics**: Daily trends, model breakdowns, provider comparisons
- **Cost Optimization**: Actionable recommendations for savings

### API Proxy
- **Multi-provider Routing**: OpenAI, Anthropic, extensible architecture  
- **Usage Logging**: Every request tracked with token counts and costs
- **Budget Enforcement**: Real-time spending controls and auto-cutoff
- **Cost Calculation**: Accurate pricing for all supported models

### Authentication & Security
- **JWT-based Authentication**: Secure user sessions
- **API Key Management**: Encrypted storage of provider keys
- **Team Support**: Multi-tenant organization features
- **Role-based Access**: Granular permission controls

## 📊 Sample Usage

### 1. Register and Setup
```bash
# Register new account
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Add OpenAI API key
curl -X POST "http://localhost:8000/proxy/api-keys" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "My OpenAI Key", "provider": "openai", "api_key": "sk-..."}'
```

### 2. Use AI Proxy
```bash
# Route OpenAI request through optimizer
curl -X POST "http://localhost:8000/proxy/openai/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello!"}]}'
```

### 3. Set Budget Limits
```bash
# Set monthly budget
curl -X POST "http://localhost:8000/admin/budget-settings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"period_type": "monthly", "limit_amount": 100.0, "enable_alerts": true}'
```

## 🔧 Troubleshooting

### Common Issues

#### "404 Not Found" when registering
- **Solution**: The register route has been added. Try refreshing the page or restarting the frontend.

#### Database Connection Errors
- **Solution**: The project is configured to use SQLite by default. Check that `backend/.env` has:
  ```
  DATABASE_URL=sqlite:///./ai_cost_optimizer.db
  ```

#### Backend Won't Start
```bash
# Ensure virtual environment is activated and dependencies installed
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

#### Frontend Build Issues
```bash
# Clear dependencies and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Port Conflicts
```bash
# Check if ports are in use
lsof -ti:8000 | xargs kill -9  # Kill backend
lsof -ti:5173 | xargs kill -9  # Kill frontend

# Or use different ports
uvicorn app.main:app --port 8001  # Backend
npm run dev -- --port 3000       # Frontend
```

#### "Failed to load API keys" Error
- **Solution**: Make sure you're logged in and the backend is running. Check browser console for CORS issues.

## 📁 Project Structure

```
AI-Cost-Optimizer/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models/         # Database models
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Business logic
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API integration
│   │   └── types/         # TypeScript definitions
│   ├── package.json       # Node dependencies
│   └── README.md         # Frontend documentation
└── README.md             # This file
```

## 🎯 Value Proposition

### Immediate Benefits
- **Cost Visibility**: See exactly where AI spending goes
- **Budget Protection**: Prevent surprise overages with alerts
- **Usage Insights**: Understand patterns and optimize usage
- **Multi-provider**: Compare costs across different AI services

### Long-term Savings
- **30% First Month**: Immediate optimization from visibility
- **60% At Scale**: Advanced recommendations and automation
- **ROI Tracking**: Measure the platform's cost savings impact
- **Procurement Power**: Better negotiations with usage data

## 🚀 Development

### Backend Development
```bash
cd backend
source .venv/bin/activate

# Database migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Run in development mode
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend

# Development server with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Production build
npm run build
```

## 📈 Production Deployment

### Backend (Docker)
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Static Hosting)
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or AWS S3
```

## 📄 License

This project is proprietary software for the AI Cost Optimizer platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

