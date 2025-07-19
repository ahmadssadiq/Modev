import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Database URL configuration with Supabase support
def get_database_url():
    """Get database URL with proper fallbacks"""
    # Check for Supabase URL first (production)
    supabase_url = os.getenv("SUPABASE_DATABASE_URL")
    if supabase_url:
        return supabase_url
    
    # Check for direct DATABASE_URL
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url
    
    # Fallback to local SQLite for development
    return "sqlite:///./ai_cost_optimizer.db"

def get_supabase_config():
    """Get Supabase configuration"""
    return {
        "url": os.getenv("SUPABASE_URL", "https://ljtujpxhwuxarcsxzsds.supabase.co"),
        "anon_key": os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHVqcHhod3V4YXJjc3h6c2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTYyOTUsImV4cCI6MjA2ODUzMjI5NX0.NK6niIXgVJxceZgh5FrlwR6USdYY5Jqnu5pM-FNlN5Y"),
        "service_role_key": os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    }

DATABASE_URL = get_database_url()

# Configure engine with proper settings for Supabase
if DATABASE_URL.startswith("postgresql"):
    # Supabase/PostgreSQL configuration
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20
    )
else:
    # SQLite configuration for local development
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 