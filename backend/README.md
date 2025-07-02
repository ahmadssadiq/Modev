# AI Cost Optimizer - Backend API

A FastAPI-based backend service for the AI Cost Optimization Platform. This service acts as a proxy between client applications and AI providers (OpenAI, Anthropic) while tracking usage and costs in real-time.

## Features

- **AI API Proxy**: Route requests to OpenAI, Anthropic, and other providers
- **Usage Tracking**: Log every API request with token usage and cost calculation
- **Budget Management**: Set spending limits with alerts and auto-cutoff
- **Cost Analytics**: Comprehensive dashboard analytics and reporting
- **Authentication**: JWT-based user authentication and authorization
- **Multi-tenant**: Support for teams and organizations

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL/SQLite**: Database for storing usage data
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations
- **JWT**: Authentication and authorization
- **SendGrid**: Email notifications
- **httpx**: Async HTTP client for AI provider requests

## 🚀 Quick Start

### Prerequisites

- Python 3.9+ (3.10+ recommended)
- Git

### Step-by-Step Setup

1. **Clone and setup virtual environment**:
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   source .venv/bin/activate  # On macOS/Linux
   # .venv\Scripts\activate     # On Windows
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment configuration**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # The default configuration uses SQLite (no additional setup needed)
   # For PostgreSQL, update DATABASE_URL in .env
   ```

4. **Database setup**:
   ```bash
   # Run database migrations (creates SQLite database automatically)
   alembic upgrade head
   ```

5. **Start the backend server**:
   ```bash
   # Recommended method
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### ✅ Verify Installation

The server should start with output like:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Test the endpoints:
```bash
# Health check
curl http://localhost:8000/health

# Should return: {"status":"ok","database":"connected","environment":"development"}
```

### 🌐 Access Points

- **API Server**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```
psycopg2.OperationalError: connection to server failed: FATAL: role "username" does not exist
```
**Solution**: Update `.env` file to use SQLite:
```bash
DATABASE_URL=sqlite:///./ai_cost_optimizer.db
```

#### Module Import Error
```
ModuleNotFoundError: No module named 'app'
```
**Solutions**:
- Use uvicorn directly: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- Ensure you're in the `backend` directory
- Check virtual environment is activated

#### Port Already in Use
```
OSError: [Errno 48] Address already in use
```
**Solutions**:
- Kill existing process: `lsof -ti:8000 | xargs kill -9`
- Use different port: `--port 8001`

#### Virtual Environment Issues
**Solutions**:
- Deactivate and reactivate: `deactivate && source .venv/bin/activate`
- Recreate environment: `rm -rf .venv && python -m venv .venv`

### Alternative Startup Methods

```bash
# Method 1: Direct uvicorn (recommended)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Method 2: Python module
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Method 3: Custom server script (if imports work)
python app/server.py
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=sqlite:///./ai_costs.db  # For development
# DATABASE_URL=postgresql://user:pass@localhost:5432/ai_costs  # For production

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourcostoptimizer.com

# AI Provider Pricing (fallback)
GPT_4_PRICE_PER_1K_PROMPT_TOKENS=0.03
GPT_4_PRICE_PER_1K_COMPLETION_TOKENS=0.06
GPT_3_5_TURBO_PRICE_PER_1K_PROMPT_TOKENS=0.0015
GPT_3_5_TURBO_PRICE_PER_1K_COMPLETION_TOKENS=0.002
```

## API Documentation

### Interactive API Docs

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile

#### AI Proxy
- `POST /proxy/{provider}/{path}` - Proxy AI API requests
- `POST /proxy/api-keys` - Add API key for provider
- `GET /proxy/api-keys` - List user's API keys
- `DELETE /proxy/api-keys/{id}` - Delete API key

#### Analytics
- `GET /analytics/usage-summary` - Usage analytics dashboard
- `GET /analytics/budget-status` - Budget status overview
- `GET /analytics/recommendations` - Cost optimization recommendations
- `GET /analytics/cost-comparison` - Compare costs across models
- `GET /analytics/usage-trends` - Usage trends and patterns

#### Admin/Settings
- `POST /admin/budget-settings` - Create budget setting
- `GET /admin/budget-settings` - List budget settings
- `PUT /admin/budget-settings/{id}` - Update budget setting
- `GET /admin/account/usage-stats` - Account statistics

## Usage Examples

### 1. Register and Login

```bash
# Register
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123",
       "full_name": "John Doe"
     }'

# Login
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
```

### 2. Add API Key

```bash
curl -X POST "http://localhost:8000/proxy/api-keys" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My OpenAI Key",
       "provider": "openai",
       "api_key": "sk-your-openai-api-key"
     }'
```

### 3. Use AI Proxy

```bash
# OpenAI Chat Completion
curl -X POST "http://localhost:8000/proxy/openai/v1/chat/completions" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "gpt-3.5-turbo",
       "messages": [{"role": "user", "content": "Hello!"}]
     }'
```

### 4. Set Budget Limit

```bash
curl -X POST "http://localhost:8000/admin/budget-settings" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "period_type": "monthly",
       "limit_amount": 100.0,
       "enable_alerts": true,
       "enable_auto_cutoff": false
     }'
```

## Project Structure

```
backend/
├── app/
│   ├── core/           # Core functionality
│   │   ├── auth.py     # Authentication utilities
│   │   └── database.py # Database configuration
│   ├── models/         # SQLAlchemy models
│   │   ├── user.py     # User, Team, APIKey models
│   │   ├── usage.py    # UsageLog, BudgetSetting models
│   │   └── pricing.py  # ModelPricing model
│   ├── routers/        # API routes
│   │   ├── auth.py     # Authentication endpoints
│   │   ├── proxy.py    # AI proxy endpoints
│   │   ├── analytics.py # Analytics endpoints
│   │   └── admin.py    # Admin/settings endpoints
│   ├── schemas/        # Pydantic schemas
│   │   ├── user.py     # User-related schemas
│   │   └── usage.py    # Usage-related schemas
│   ├── services/       # Business logic
│   │   ├── cost_calculator.py # Cost calculation
│   │   ├── budget_checker.py  # Budget monitoring
│   │   └── email_service.py   # Email notifications
│   ├── main.py         # FastAPI application
│   └── server.py       # Uvicorn server
├── alembic/            # Database migrations
├── requirements.txt
├── .env.example
└── README.md
```

## Database Schema

### Core Tables

- **users**: User accounts and profiles
- **teams**: Team organizations
- **api_keys**: Encrypted AI provider API keys
- **usage_logs**: Detailed usage tracking
- **budget_settings**: Spending limits and alerts
- **model_pricing**: AI model pricing information

## Development

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Testing

```bash
# Run tests (when test suite is implemented)
pytest

# Type checking
mypy app/

# Linting
flake8 app/
```

### Code Style

This project follows:
- PEP 8 style guide
- Type hints for better code documentation
- Async/await for I/O operations
- RESTful API design principles

## Deployment

### Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment-specific Settings

- **Development**: SQLite database, debug mode enabled
- **Production**: PostgreSQL, proper secret management, monitoring

## Security

- JWT token authentication
- API key encryption in database
- Rate limiting on sensitive endpoints
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM

## Monitoring

- Health check endpoint: `/health`
- Usage analytics and alerting
- Error tracking and logging
- Performance monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for the AI Cost Optimizer platform. 