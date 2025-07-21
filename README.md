# 🚀 Modev - AI Cost Optimizer

A vendor-neutral platform for AI cost optimization that helps teams save up to 30% on their AI spending with real-time cost visibility and budget protection.

**🚀 LIVE: https://modev-gs4dd7vcp-ahmads-projects-25952fb4.vercel.app**

## ✨ Features

- **Real-time Cost Tracking** - Monitor AI costs across all providers
- **Budget Protection** - Set limits and get instant alerts
- **Multi-vendor Support** - OpenAI, Anthropic, Azure, Google AI
- **Drop-in Integration** - Zero code changes required
- **Advanced Analytics** - Detailed insights and optimization recommendations

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- Git

### Local Development

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/modev.git
   cd modev
   ```

2. **Install dependencies**
```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   SUPABASE_URL=https://ljtujpxhwuxarcsxzsds.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET_KEY=your-jwt-secret
   CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
   ```

   Create `frontend/.env.local`:
   ```env
   VITE_SUPABASE_URL=https://ljtujpxhwuxarcsxzsds.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://modev-ahmad.vercel.app/api
   ```

4. **Run the development server**
```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: https://modev-ahmad.vercel.app/api

## 🚀 Deployment

### Deploy to Vercel

1. **Run the deployment script**
```bash
   ./deploy.sh
```

2. **Deploy to Vercel**
```bash
   npx vercel --prod
   ```

3. **Configure environment variables in Vercel Dashboard**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET_KEY`
   - `CORS_ORIGINS`

Your app will be available at: `https://modev.vercel.app`

## 📁 Project Structure

```
modev/
├── frontend/          # React frontend
├── backend/           # FastAPI backend
├── supabase/          # Supabase configuration
│   ├── migrations/    # Database migrations
│   ├── config.toml    # Supabase config
│   └── seed.sql       # Initial data
├── vercel.json        # Vercel configuration
├── package.json       # Root package.json
└── deploy.sh          # Deployment script
```

## 🔧 Supabase Setup

The project is configured with Supabase for:
- **Database**: PostgreSQL with migrations
- **Authentication**: User management and JWT tokens
- **Storage**: File uploads and management
- **Real-time**: Live updates and subscriptions

### Storage Buckets

- `ai-cost-optimizer` - Public bucket for general files
- `user-avatars` - Public bucket for user profile pictures
- `usage-reports` - Private bucket for sensitive reports

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build the frontend
- `npm run install:all` - Install all dependencies
- `npm run setup` - Full setup (install + build)

### Backend API

The backend provides RESTful APIs for:
- User authentication and management
- API key management
- Usage tracking and analytics
- Budget management
- Cost optimization recommendations

### Frontend Features

- Modern React with TypeScript
- Material-UI components
- Real-time updates with Supabase
- Responsive design
- Dark/light theme support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@modev.ai or create an issue in this repository.

