# 🚀 Production Deployment Guide

This guide covers deploying the AI Cost Optimizer to production platforms like Vercel, Netlify, Railway, or your own server.

## 🌐 Frontend Deployment (Vercel/Netlify)

### Step 1: Environment Configuration

Create environment variables in your deployment platform:

**For Vercel:**
```bash
# In Vercel Dashboard → Project Settings → Environment Variables
VITE_API_URL=https://your-backend-api.com
VITE_NODE_ENV=production
VITE_APP_NAME=AI Cost Optimizer
VITE_APP_VERSION=1.0.0
```

**For Netlify:**
```bash
# In Netlify Dashboard → Site Settings → Environment Variables
VITE_API_URL=https://your-backend-api.com
VITE_NODE_ENV=production
```

### Step 2: Deploy Frontend

**Vercel Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# In the frontend directory
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Your team/personal
# - Link to existing project: No
# - What's your project's name: ai-cost-optimizer-frontend
# - In which directory is your code located: ./
# - Want to override settings: No
```

**Netlify Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# In the frontend directory
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

1. **Create account** at https://railway.app
2. **Connect GitHub** repository
3. **Deploy from GitHub**:
   ```bash
   # Railway will auto-detect your backend
   # Set environment variables in Railway dashboard:
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   JWT_SECRET_KEY=your-production-secret-key
   SENDGRID_API_KEY=your-sendgrid-key
   ENVIRONMENT=production
   ```

### Option 2: Render

1. **Create account** at https://render.com
2. **Create Web Service** from GitHub
3. **Configure**:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables: (same as Railway)

### Option 3: AWS/Google Cloud

Deploy using Docker:

```dockerfile
# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🗄️ Database Setup

### Option 1: Managed PostgreSQL

**Supabase (Recommended):**
```bash
# 1. Create project at https://supabase.com
# 2. Get connection string from Settings → Database
# 3. Update DATABASE_URL in your backend environment
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

**PlanetScale:**
```bash
# 1. Create database at https://planetscale.com
# 2. Get connection string
# 3. Update DATABASE_URL
```

### Option 2: Railway PostgreSQL

```bash
# In Railway dashboard:
# 1. Add PostgreSQL service
# 2. Connect to your backend service
# 3. Use the provided DATABASE_URL
```

## 🔐 Production Environment Variables

### Backend (.env for production)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Authentication
JWT_SECRET_KEY=your-super-secure-production-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Email
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com

# Environment
ENVIRONMENT=production
APP_NAME=AI Cost Optimizer

# CORS (if needed)
CORS_ORIGINS=["https://your-frontend-domain.com"]
```

### Frontend (.env.production)

```bash
VITE_API_URL=https://your-backend-api.com
VITE_NODE_ENV=production
VITE_APP_NAME=AI Cost Optimizer
VITE_APP_VERSION=1.0.0
```

## 🔒 Security Checklist

### Backend Security

- [ ] **Strong JWT Secret**: Use a cryptographically secure random string
- [ ] **Database Security**: Enable SSL, use strong passwords
- [ ] **CORS Configuration**: Only allow your frontend domain
- [ ] **Rate Limiting**: Implement rate limiting on API endpoints
- [ ] **HTTPS Only**: Ensure all API traffic uses HTTPS
- [ ] **Environment Variables**: Never commit secrets to git

### Frontend Security

- [ ] **Environment Variables**: Use `VITE_` prefix only for non-sensitive data
- [ ] **API Token Storage**: Store JWT tokens securely (httpOnly cookies recommended)
- [ ] **HTTPS**: Serve frontend over HTTPS
- [ ] **CSP Headers**: Configure Content Security Policy

## 🚀 Deployment Scripts

### Automated Deployment Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying AI Cost Optimizer to Production"

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

# Deploy frontend to Vercel
echo "🌐 Deploying frontend..."
vercel --prod

# Deploy backend to Railway (if using Railway)
echo "🖥️ Deploying backend..."
cd ../backend
railway deploy

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://your-frontend-domain.com"
echo "🖥️ Backend: https://your-backend-domain.com"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## 🧪 Testing Production Deployment

### Health Checks

1. **Backend Health**:
   ```bash
   curl https://your-backend-api.com/health
   ```

2. **Frontend Access**:
   - Visit your frontend URL
   - Test registration/login
   - Add API keys
   - Test proxy endpoints

### Integration Test

```python
import requests

# Test production API
API_BASE = "https://your-backend-api.com"
TOKEN = "your-jwt-token"

# Test proxy endpoint
response = requests.post(
    f"{API_BASE}/proxy/openai/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello production!"}],
        "max_tokens": 50
    }
)

print("Status:", response.status_code)
print("Response:", response.json())
```

## 🔧 Domain Configuration

### Custom Domain Setup

1. **Frontend (Vercel)**:
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain (e.g., `app.yourdomain.com`)
   - Configure DNS records as instructed

2. **Backend (Railway)**:
   - Go to Railway Dashboard → Service → Settings → Domains
   - Add custom domain (e.g., `api.yourdomain.com`)
   - Configure DNS records

3. **Update Environment Variables**:
   ```bash
   # Update frontend environment
   VITE_API_URL=https://api.yourdomain.com
   
   # Update backend CORS
   CORS_ORIGINS=["https://app.yourdomain.com"]
   ```

## 📊 Monitoring & Analytics

### Application Monitoring

1. **Backend Monitoring**:
   - Use Railway/Render built-in monitoring
   - Set up Sentry for error tracking
   - Configure log aggregation

2. **Database Monitoring**:
   - Monitor database performance
   - Set up backup schedules
   - Configure alerts for high usage

3. **User Analytics**:
   - Track user registrations
   - Monitor API usage patterns
   - Set up business metrics dashboards

## 💰 Cost Optimization

### Infrastructure Costs

1. **Database**: Start with managed services (Supabase free tier)
2. **Backend**: Railway/Render free tiers for MVP
3. **Frontend**: Vercel/Netlify free tiers
4. **Monitoring**: Use free tiers of monitoring services

### Scaling Strategy

1. **Phase 1** (0-100 users): Free tiers
2. **Phase 2** (100-1K users): Upgrade database, keep others free
3. **Phase 3** (1K+ users): Scale all services as needed

## 🆘 Support & Troubleshooting

### Common Production Issues

1. **CORS Errors**:
   - Check `CORS_ORIGINS` environment variable
   - Ensure frontend domain is whitelisted

2. **Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Check database service status

3. **API Token Issues**:
   - Ensure JWT secret is consistent across deploys
   - Check token expiration settings

### Getting Help

- Check deployment platform documentation
- Review application logs
- Test API endpoints individually
- Verify environment variable configuration

---

**🎉 You're now ready for production deployment!**

Your customers will have a professional SaaS experience with:
- ✅ Easy token access via Integration page
- ✅ Environment-aware URLs
- ✅ Secure, scalable infrastructure
- ✅ Professional domain and HTTPS 