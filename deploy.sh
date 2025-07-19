#!/bin/bash

# 🎯 Modev Deployment Script
# This script follows the exact Supabase + Vercel setup steps

echo "🚀 Starting Modev deployment..."

# Step 1: Ensure we're in the right directory
echo "📁 Checking repository structure..."
if [ ! -d "frontend" ] || [ ! -d "backend" ] || [ ! -d "supabase" ]; then
    echo "❌ Error: Missing required directories (frontend, backend, supabase)"
    exit 1
fi

# Step 2: Verify Supabase configuration
echo "🔧 Verifying Supabase configuration..."
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Error: Missing supabase/config.toml"
    exit 1
fi

if [ ! -d "supabase/migrations" ]; then
    echo "❌ Error: Missing supabase/migrations directory"
    exit 1
fi

# Step 3: Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Step 4: Build the application
echo "🔨 Building application..."
npm run build

# Step 5: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "📝 Instructions:"
echo "1. Run: npx vercel --prod"
echo "2. When prompted:"
echo "   - Set up and deploy: Y"
echo "   - Which scope: Choose your account"
echo "   - Link to existing project: N"
echo "   - Project name: modev"
echo "   - Directory: ./"
echo "   - Override settings: N"
echo ""
echo "3. After deployment, your app will be available at: https://modev.vercel.app"
echo ""
echo "4. Configure environment variables in Vercel Dashboard:"
echo "   - SUPABASE_URL: https://ljtujpxhwuxarcsxzsds.supabase.co"
echo "   - SUPABASE_ANON_KEY: [your anon key]"
echo "   - SUPABASE_SERVICE_ROLE_KEY: [your service role key]"
echo "   - JWT_SECRET_KEY: [your jwt secret]"
echo "   - CORS_ORIGINS: [\"https://modev.vercel.app\"]"
echo ""
echo "✅ Ready to deploy! Run: npx vercel --prod" 