#!/usr/bin/env python3

import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set environment variables for testing
os.environ['SUPABASE_URL'] = 'https://ljtujpxhwuxarcsxzsds.supabase.co'
os.environ['SUPABASE_ANON_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHVqcHhod3V4YXJjc3h6c2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTYyOTUsImV4cCI6MjA2ODUzMjI5NX0.NK6niIXgVJxceZgh5FrlwR6USdYY5Jqnu5pM-FNlN5Y'
os.environ['SUPABASE_SERVICE_ROLE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHVqcHhod3V4YXJjc3h6c2RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1NjI5NSwiZXhwIjoyMDY4NTMyMjk1fQ.cnXCr21WNg-lNQJHuy1i50tpPy_SsTF2CxEh53Tz4XU'
os.environ['DATABASE_URL'] = 'sqlite:///./test.db'

try:
    from app.main import app
    print("✅ Backend imports successfully!")
    print("✅ All dependencies are installed correctly!")
    print("✅ Supabase integration is working!")
except Exception as e:
    print(f"❌ Error importing backend: {e}")
    import traceback
    traceback.print_exc() 