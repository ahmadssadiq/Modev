from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from dotenv import load_dotenv

from app.routers import auth, proxy, analytics, admin, storage
from app.core.database import engine, Base

load_dotenv()

# Create tables (if they don't exist)
Base.metadata.create_all(bind=engine)

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
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for production
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
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
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "environment": os.getenv("ENVIRONMENT", "development")
    } 