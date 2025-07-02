from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base


class ModelPricing(Base):
    """Store pricing information for different AI models"""
    __tablename__ = "model_pricing"

    id = Column(Integer, primary_key=True, index=True)
    provider = Column(String(50), nullable=False, index=True)  # openai, anthropic, etc.
    model_name = Column(String(100), nullable=False, index=True)  # gpt-4, gpt-3.5-turbo, etc.
    
    # Pricing structure
    prompt_price_per_1k_tokens = Column(Float, nullable=False)
    completion_price_per_1k_tokens = Column(Float, nullable=False)
    
    # Additional pricing info (for different model types)
    price_per_request = Column(Float, nullable=True)  # For models with per-request pricing
    price_per_image = Column(Float, nullable=True)    # For image generation models
    price_per_minute = Column(Float, nullable=True)   # For voice/audio models
    
    # Model metadata
    description = Column(Text, nullable=True)
    max_tokens = Column(Integer, nullable=True)       # Max context length
    supports_streaming = Column(Boolean, default=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # For versioning pricing changes
    effective_date = Column(DateTime(timezone=True), nullable=True)
    deprecated_date = Column(DateTime(timezone=True), nullable=True) 