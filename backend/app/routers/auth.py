from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.core.supabase_auth import get_supabase_auth_service
from app.models.user import User as UserModel
from app.schemas.user import (
    User, UserCreate, UserUpdate, LoginRequest, Token
)

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user with Supabase Auth"""
    try:
        result = await get_supabase_auth_service().sign_up(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name
        )
        
        return {
            "access_token": result["session"].access_token,
            "refresh_token": result["session"].refresh_token,
            "token_type": "bearer",
            "user": result["user"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Authenticate user with Supabase Auth and return access token"""
    try:
        result = await get_supabase_auth_service().sign_in(
            email=login_data.email,
            password=login_data.password
        )
        
        return {
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
            "token_type": "bearer",
            "user": result["user"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=User)
async def get_current_user_profile(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=User)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    # Check if email is being changed and if it's already taken
    if user_update.email and user_update.email != current_user.email:
        existing_user = get_user_by_email(db, user_update.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
    
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.post("/verify-token", response_model=User)
async def verify_token_endpoint(
    current_user: UserModel = Depends(get_current_active_user)
):
    """Verify if token is valid and return user info"""
    return current_user


@router.post("/logout")
async def logout():
    """Sign out user"""
    try:
        result = await get_supabase_auth_service().sign_out("")
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )


@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """Refresh access token"""
    try:
        result = await get_supabase_auth_service().refresh_token(refresh_token)
        return {
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.post("/reset-password")
async def reset_password(email: str):
    """Send password reset email"""
    try:
        result = await get_supabase_auth_service().reset_password(email)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password reset failed: {str(e)}"
        ) 