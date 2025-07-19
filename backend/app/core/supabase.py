import os
from supabase import create_client, Client
from dotenv import load_dotenv
from .database import get_supabase_config

load_dotenv()

# Initialize Supabase client
def get_supabase_client() -> Client:
    """Get Supabase client with anon key"""
    config = get_supabase_config()
    return create_client(config["url"], config["anon_key"])

def get_supabase_admin_client() -> Client:
    """Get Supabase client with service role key for admin operations"""
    config = get_supabase_config()
    if not config["service_role_key"]:
        raise ValueError("SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
    return create_client(config["url"], config["service_role_key"])

def get_supabase_auth_client() -> Client:
    """Get Supabase client for authentication operations"""
    config = get_supabase_config()
    return create_client(config["url"], config["anon_key"]) 