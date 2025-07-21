from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Cost Optimizer"),
    description="A vendor-neutral SaaS platform for tracking and optimizing AI API usage and costs",
    version="1.0.0",
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Cost Optimizer API",
        "status": "healthy",
        "version": "1.0.0",
        "database_url_set": bool(os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL"))
    }

@app.get("/health")
async def health_check():
    """Simple health check"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "database_url_set": bool(os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL"))
    } 