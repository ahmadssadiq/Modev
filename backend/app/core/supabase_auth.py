import os
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
from supabase import Client
from .supabase import get_supabase_auth_client, get_supabase_admin_client
from .database import get_db
from sqlalchemy.orm import Session
from ..models.user import User
import uuid

class SupabaseAuthService:
    """Service for handling Supabase authentication"""
    
    def __init__(self):
        self.auth_client = get_supabase_auth_client()
        self.admin_client = get_supabase_admin_client()
    
    async def sign_up(self, email: str, password: str, full_name: str = None) -> Dict[str, Any]:
        """Sign up a new user with Supabase Auth"""
        try:
            # Create user in Supabase Auth
            auth_response = self.auth_client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": full_name,
                        "plan": "free"
                    }
                }
            })
            
            if auth_response.user:
                # Create user record in our database
                db = next(get_db())
                try:
                    user = User(
                        id=uuid.UUID(auth_response.user.id),
                        email=email,
                        hashed_password="",  # Password is handled by Supabase Auth
                        full_name=full_name,
                        is_active=True,
                        is_verified=auth_response.user.email_confirmed_at is not None,
                        plan="free"
                    )
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    
                    return {
                        "user": user,
                        "session": auth_response.session,
                        "message": "User created successfully"
                    }
                except Exception as e:
                    db.rollback()
                    # Delete the auth user if database creation fails
                    if auth_response.user:
                        self.admin_client.auth.admin.delete_user(auth_response.user.id)
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Failed to create user record: {str(e)}"
                    )
                finally:
                    db.close()
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user"
                )
                
        except Exception as e:
            if "User already registered" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User with this email already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Authentication error: {str(e)}"
            )
    
    async def sign_in(self, email: str, password: str) -> Dict[str, Any]:
        """Sign in user with Supabase Auth"""
        try:
            auth_response = self.auth_client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if auth_response.user and auth_response.session:
                # Get user from our database
                db = next(get_db())
                try:
                    user = db.query(User).filter(User.id == uuid.UUID(auth_response.user.id)).first()
                    if not user:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found in database"
                        )
                    
                    return {
                        "user": user,
                        "session": auth_response.session,
                        "access_token": auth_response.session.access_token,
                        "refresh_token": auth_response.session.refresh_token
                    }
                finally:
                    db.close()
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
                
        except Exception as e:
            if "Invalid login credentials" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Authentication error: {str(e)}"
            )
    
    async def sign_out(self, access_token: str) -> Dict[str, str]:
        """Sign out user"""
        try:
            self.auth_client.auth.sign_out()
            return {"message": "Successfully signed out"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Sign out error: {str(e)}"
            )
    
    async def get_user_by_token(self, access_token: str) -> Optional[User]:
        """Get user from access token"""
        try:
            # Set the session with the access token
            self.auth_client.auth.set_session(access_token, None)
            
            # Get the current user
            user_response = self.auth_client.auth.get_user()
            
            if user_response.user:
                # Get user from our database
                db = next(get_db())
                try:
                    user = db.query(User).filter(User.id == uuid.UUID(user_response.user.id)).first()
                    return user
                finally:
                    db.close()
            return None
            
        except Exception as e:
            return None
    
    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh access token"""
        try:
            auth_response = self.auth_client.auth.refresh_session(refresh_token)
            
            if auth_response.session:
                return {
                    "access_token": auth_response.session.access_token,
                    "refresh_token": auth_response.session.refresh_token
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token"
                )
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token refresh failed: {str(e)}"
            )
    
    async def reset_password(self, email: str) -> Dict[str, str]:
        """Send password reset email"""
        try:
            self.auth_client.auth.reset_password_email(email)
            return {"message": "Password reset email sent"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Password reset error: {str(e)}"
            )
    
    async def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> User:
        """Update user profile"""
        try:
            # Update in Supabase Auth
            self.admin_client.auth.admin.update_user_by_id(
                user_id,
                {"user_metadata": updates}
            )
            
            # Update in our database
            db = next(get_db())
            try:
                user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
                if not user:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="User not found"
                    )
                
                for key, value in updates.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
                
                db.commit()
                db.refresh(user)
                return user
            finally:
                db.close()
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Profile update error: {str(e)}"
            )

# Global instance
supabase_auth_service = SupabaseAuthService() 