from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


# Usage Log schemas
class UsageLogBase(BaseModel):
    provider: str
    model: str
    endpoint: str
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    cost: float = 0.0
    latency_ms: Optional[int] = None
    status_code: int
    request_size_bytes: Optional[int] = None
    response_size_bytes: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None


class UsageLogCreate(UsageLogBase):
    api_key_id: int


class UsageLog(UsageLogBase):
    id: int
    user_id: int
    api_key_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Budget Setting schemas
class BudgetSettingBase(BaseModel):
    period_type: str  # daily, weekly, monthly
    limit_amount: float
    alert_threshold: float = 0.8
    enable_alerts: bool = True
    enable_auto_cutoff: bool = False


class BudgetSettingCreate(BudgetSettingBase):
    scope_type: str = "user"
    scope_id: Optional[int] = None


class BudgetSettingUpdate(BaseModel):
    period_type: Optional[str] = None
    limit_amount: Optional[float] = None
    alert_threshold: Optional[float] = None
    enable_alerts: Optional[bool] = None
    enable_auto_cutoff: Optional[bool] = None
    is_active: Optional[bool] = None


class BudgetSetting(BudgetSettingBase):
    id: int
    user_id: int
    scope_type: str
    scope_id: Optional[int]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# Analytics schemas
class UsageSummary(BaseModel):
    total_requests: int
    total_tokens: int
    total_cost: float
    period_start: datetime
    period_end: datetime


class ModelBreakdown(BaseModel):
    model: str
    provider: str
    requests: int
    tokens: int
    cost: float
    percentage: float


class ProviderBreakdown(BaseModel):
    provider: str
    requests: int
    tokens: int
    cost: float
    percentage: float


class DailyUsage(BaseModel):
    date: str
    requests: int
    tokens: int
    cost: float


class AnalyticsResponse(BaseModel):
    summary: UsageSummary
    daily_usage: List[DailyUsage]
    model_breakdown: List[ModelBreakdown]
    provider_breakdown: List[ProviderBreakdown]


class BudgetStatus(BaseModel):
    current_spend: float
    budget_limit: float
    percentage_used: float
    period_type: str
    period_start: datetime
    period_end: datetime
    is_over_budget: bool
    alerts_enabled: bool


# Recommendation schemas
class Recommendation(BaseModel):
    type: str  # cost_saving, performance, security, etc.
    title: str
    description: str
    potential_savings: Optional[float] = None
    confidence: float  # 0.0 to 1.0
    action_required: str
    priority: str  # low, medium, high, critical


class RecommendationsResponse(BaseModel):
    recommendations: List[Recommendation]
    total_potential_savings: float


# Model Pricing schemas
class ModelPricingBase(BaseModel):
    provider: str
    model_name: str
    prompt_price_per_1k_tokens: float
    completion_price_per_1k_tokens: float
    price_per_request: Optional[float] = None
    price_per_image: Optional[float] = None
    price_per_minute: Optional[float] = None
    description: Optional[str] = None
    max_tokens: Optional[int] = None
    supports_streaming: bool = True


class ModelPricingCreate(ModelPricingBase):
    effective_date: Optional[datetime] = None


class ModelPricingUpdate(BaseModel):
    prompt_price_per_1k_tokens: Optional[float] = None
    completion_price_per_1k_tokens: Optional[float] = None
    price_per_request: Optional[float] = None
    price_per_image: Optional[float] = None
    price_per_minute: Optional[float] = None
    description: Optional[str] = None
    max_tokens: Optional[int] = None
    supports_streaming: Optional[bool] = None
    is_active: Optional[bool] = None


class ModelPricing(ModelPricingBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    effective_date: Optional[datetime]
    deprecated_date: Optional[datetime]

    class Config:
        from_attributes = True 