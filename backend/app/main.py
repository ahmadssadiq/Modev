from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from dotenv import load_dotenv

from app.routers import auth, proxy, analytics, admin, storage
from app.core.database import engine, Base, get_db

load_dotenv()

# Create tables (if they don't exist) - only if database URL is available
if os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL"):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Cost Optimizer"),
    description="A vendor-neutral SaaS platform for tracking and optimizing AI API usage and costs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "https://modev-ahmad.vercel.app"],  # React dev servers + production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for production
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["modev-ahmad.vercel.app", "*.vercel.app"]
    )

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(storage.router, prefix="/storage", tags=["storage"])
app.include_router(proxy.router, prefix="/proxy", tags=["ai-proxy"])
app.include_router(proxy.router, tags=["simplified-proxy"])  # Include proxy router at root for /v1/ routes LAST

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Cost Optimizer API",
        "status": "healthy",
        "version": "1.0.0",
        "features": [
            "API Gateway/Proxy for AI Calls",
            "Usage Logging & Analytics", 
            "Cost Calculation",
            "Budget Limits & Alerts",
            "Secure Key Management"
        ]
    }

@app.get("/health")
async def health_check():
    """Detailed health check with database connection test"""
    database_url_set = bool(os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL"))
    
    if not database_url_set:
        return {
            "status": "unhealthy",
            "database": "no_url_set",
            "error": "SUPABASE_DATABASE_URL or DATABASE_URL not set",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database_url_set": False
        }
    
    try:
        # Test database connection
        db = next(get_db())
        result = db.execute("SELECT 1").scalar()
        db.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database_url_set": True,
            "features": [
                "API Gateway/Proxy for AI Calls",
                "Usage Logging & Analytics", 
                "Cost Calculation",
                "Budget Limits & Alerts",
                "Secure Key Management"
            ]
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "environment": os.getenv("ENVIRONMENT", "development"),
            "database_url_set": True
        } 