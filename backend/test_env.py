#!/usr/bin/env python3
"""Test script to check environment variables"""

import os
from dotenv import load_dotenv

load_dotenv()

print("🔍 Environment Variables Check:")
print("=" * 50)

# Check required environment variables
required_vars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET_KEY"
]

for var in required_vars:
    value = os.getenv(var)
    if value:
        print(f"✅ {var}: {'*' * 10} (set)")
    else:
        print(f"❌ {var}: NOT SET")

print("\n🔧 Database Configuration:")
database_url = os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL")
if database_url:
    print(f"✅ Database URL: {'*' * 20} (set)")
else:
    print("❌ Database URL: NOT SET")
    print("💡 You may need to add SUPABASE_DATABASE_URL to your environment variables")

print("\n🌐 CORS Configuration:")
cors_origins = os.getenv("CORS_ORIGINS")
if cors_origins:
    print(f"✅ CORS_ORIGINS: {cors_origins}")
else:
    print("❌ CORS_ORIGINS: NOT SET")

print("\n" + "=" * 50)
print("✅ Environment check complete!") 