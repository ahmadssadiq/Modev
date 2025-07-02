# AI Cost Optimization Platform

A vendor-neutral SaaS platform that sits between client applications and AI model providers (OpenAI, Anthropic, etc.) to track and optimize AI API usage and costs in real-time.

## Features

- **Usage & Cost Tracking**: Log every API request to various AI services
- **Budget Controls & Alerts**: Set spending limits and get alerts when approaching limits
- **Performance Benchmarking**: Compare different models' performance vs cost
- **Multi-Provider Support**: Unified dashboard for all AI providers
- **Real-time Analytics**: Comprehensive dashboard with usage insights

## Tech Stack

### Backend
- Python 3.10+, FastAPI, Uvicorn
- SQLAlchemy, Alembic for database ORM and migrations
- PostgreSQL (with TimescaleDB extension)
- Redis for caching
- JWT authentication

### Frontend
- React 17+, TypeScript
- Vite build tool
- Recharts for data visualization
- Tailwind CSS for styling

### Infrastructure
- Docker & Docker Compose
- AWS ECS/EKS for deployment
- RDS for PostgreSQL
- ElastiCache for Redis
- GitHub Actions for CI/CD

## Project Structure

```
ai-cost-optimizer/
├── backend/           # FastAPI backend service
├── frontend/          # React TypeScript dashboard
├── docker-compose.yml # Local development setup
└── .github/           # CI/CD workflows
```

## Getting Started

See individual README files in `backend/` and `frontend/` directories for specific setup instructions.

## Development Workflow

1. **Backend**: FastAPI proxy service with authentication and analytics
2. **Frontend**: React dashboard for usage visualization and management
3. **Database**: PostgreSQL with proper migrations
4. **Deployment**: Containerized deployment to AWS

## MVP Timeline

Target: 6 months to full MVP with all core features implemented. 