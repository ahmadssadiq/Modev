from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    api_key_id = Column(UUID(as_uuid=True), ForeignKey("api_keys.id"), nullable=False)
    
    # Request details
    provider = Column(String(50), nullable=False)  # openai, anthropic, etc.
    model = Column(String(100), nullable=False)  # gpt-4, gpt-3.5-turbo, claude-3-opus, etc.
    endpoint = Column(String(255), nullable=False)  # /v1/chat/completions, etc.
    
    # Usage metrics
    prompt_tokens = Column(Float, default=0)
    completion_tokens = Column(Float, default=0)
    total_tokens = Column(Float, default=0)
    
    # Cost calculation
    cost = Column(Float, default=0.0)  # Cost in USD
    
    # Performance metrics
    latency_ms = Column(Float, nullable=True)  # Response time in milliseconds
    status_code = Column(Float, nullable=False)  # HTTP status code
    
    # Request/Response metadata (for debugging/analysis)
    request_size_bytes = Column(Float, nullable=True)
    response_size_bytes = Column(Float, nullable=True)
    
    # Additional metadata
    extra_data = Column(JSONB, nullable=True)  # Extra fields for future expansion
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User", back_populates="usage_logs")
    api_key = relationship("APIKey", back_populates="usage_logs")


class BudgetSetting(Base):
    __tablename__ = "budget_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Budget configuration
    period_type = Column(String(20), nullable=False)  # daily, weekly, monthly
    limit_amount = Column(Float, nullable=False)  # Budget limit in USD
    
    # Alert configuration
    alert_threshold = Column(Float, default=0.8)  # Alert when 80% of budget is reached
    enable_alerts = Column(Boolean, default=True)
    enable_auto_cutoff = Column(Boolean, default=False)  # Auto-disable API calls when budget exceeded
    
    # Scope (optional - for future team-level budgets)
    scope_type = Column(String(20), default="user")  # user, team, project
    scope_id = Column(UUID(as_uuid=True), nullable=True)  # ID of the scope (team_id, project_id, etc.)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="budget_settings")


class DailyUsageSummary(Base):
    """Pre-aggregated daily usage for faster dashboard queries"""
    __tablename__ = "daily_usage_summaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    
    # Aggregated metrics
    total_requests = Column(Float, default=0)
    total_tokens = Column(Float, default=0)
    total_cost = Column(Float, default=0.0)
    
    # Provider breakdown (stored as JSON for flexibility)
    provider_breakdown = Column(JSONB, nullable=True)  # {"openai": {"cost": 10.5, "tokens": 1000}, ...}
    model_breakdown = Column(JSONB, nullable=True)     # {"gpt-4": {"cost": 8.0, "tokens": 500}, ...}
    
    # Performance metrics
    avg_latency_ms = Column(Float, nullable=True)
    error_count = Column(Float, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 