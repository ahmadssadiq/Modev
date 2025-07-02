from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    plan: Optional[str] = None


class UserInDB(UserBase):
    id: int
    hashed_password: str
    is_verified: bool
    plan: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class User(UserBase):
    id: int
    is_verified: bool
    plan: str
    created_at: datetime

    class Config:
        from_attributes = True


# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# API Key schemas
class APIKeyBase(BaseModel):
    name: str
    provider: str


class APIKeyCreate(APIKeyBase):
    api_key: str  # The actual API key (will be encrypted before storage)
    team_id: Optional[int] = None


class APIKeyUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class APIKey(APIKeyBase):
    id: int
    user_id: int
    team_id: Optional[int]
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]
    # Note: We don't expose the encrypted_key

    class Config:
        from_attributes = True


# Team schemas
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Team(TeamBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TeamMemberBase(BaseModel):
    role: str = "member"


class TeamMemberCreate(TeamMemberBase):
    user_id: int
    team_id: int


class TeamMember(TeamMemberBase):
    id: int
    user_id: int
    team_id: int
    joined_at: datetime
    user: User

    class Config:
        from_attributes = True 