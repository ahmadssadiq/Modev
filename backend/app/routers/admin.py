from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import get_current_active_user, require_plan
from app.models.user import User
from app.models.usage import BudgetSetting
from app.models.pricing import ModelPricing
from app.schemas.usage import (
    BudgetSettingCreate, BudgetSettingUpdate, BudgetSetting as BudgetSettingSchema,
    ModelPricingCreate, ModelPricingUpdate, ModelPricing as ModelPricingSchema
)

router = APIRouter()


# Budget Settings Management
@router.post("/budget-settings", response_model=BudgetSettingSchema)
async def create_budget_setting(
    budget_data: BudgetSettingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new budget setting"""
    
    # Check if user already has a budget setting for this period type
    existing_budget = db.query(BudgetSetting).filter(
        BudgetSetting.user_id == current_user.id,
        BudgetSetting.period_type == budget_data.period_type,
        BudgetSetting.is_active == True
    ).first()
    
    if existing_budget:
        raise HTTPException(
            status_code=400,
            detail=f"Budget setting for {budget_data.period_type} period already exists"
        )
    
    budget_setting = BudgetSetting(
        user_id=current_user.id,
        period_type=budget_data.period_type,
        limit_amount=budget_data.limit_amount,
        alert_threshold=budget_data.alert_threshold,
        enable_alerts=budget_data.enable_alerts,
        enable_auto_cutoff=budget_data.enable_auto_cutoff,
        scope_type=budget_data.scope_type,
        scope_id=budget_data.scope_id
    )
    
    db.add(budget_setting)
    db.commit()
    db.refresh(budget_setting)
    
    return budget_setting


@router.get("/budget-settings", response_model=List[BudgetSettingSchema])
async def get_budget_settings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all budget settings for the current user"""
    
    budget_settings = db.query(BudgetSetting).filter(
        BudgetSetting.user_id == current_user.id
    ).all()
    
    return budget_settings


@router.put("/budget-settings/{budget_id}", response_model=BudgetSettingSchema)
async def update_budget_setting(
    budget_id: int,
    budget_update: BudgetSettingUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a budget setting"""
    
    budget_setting = db.query(BudgetSetting).filter(
        BudgetSetting.id == budget_id,
        BudgetSetting.user_id == current_user.id
    ).first()
    
    if not budget_setting:
        raise HTTPException(status_code=404, detail="Budget setting not found")
    
    # Update fields
    update_data = budget_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(budget_setting, field, value)
    
    db.commit()
    db.refresh(budget_setting)
    
    return budget_setting


@router.delete("/budget-settings/{budget_id}")
async def delete_budget_setting(
    budget_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a budget setting"""
    
    budget_setting = db.query(BudgetSetting).filter(
        BudgetSetting.id == budget_id,
        BudgetSetting.user_id == current_user.id
    ).first()
    
    if not budget_setting:
        raise HTTPException(status_code=404, detail="Budget setting not found")
    
    db.delete(budget_setting)
    db.commit()
    
    return {"message": "Budget setting deleted successfully"}


# Model Pricing Management (Premium feature)
@router.post("/model-pricing", response_model=ModelPricingSchema)
async def create_model_pricing(
    pricing_data: ModelPricingCreate,
    current_user: User = Depends(require_plan("premium")),
    db: Session = Depends(get_db)
):
    """Create custom model pricing (Premium feature)"""
    
    # Check if pricing already exists for this provider/model
    existing_pricing = db.query(ModelPricing).filter(
        ModelPricing.provider == pricing_data.provider,
        ModelPricing.model_name == pricing_data.model_name,
        ModelPricing.is_active == True
    ).first()
    
    if existing_pricing:
        raise HTTPException(
            status_code=400,
            detail=f"Pricing for {pricing_data.provider}/{pricing_data.model_name} already exists"
        )
    
    model_pricing = ModelPricing(
        provider=pricing_data.provider,
        model_name=pricing_data.model_name,
        prompt_price_per_1k_tokens=pricing_data.prompt_price_per_1k_tokens,
        completion_price_per_1k_tokens=pricing_data.completion_price_per_1k_tokens,
        price_per_request=pricing_data.price_per_request,
        price_per_image=pricing_data.price_per_image,
        price_per_minute=pricing_data.price_per_minute,
        description=pricing_data.description,
        max_tokens=pricing_data.max_tokens,
        supports_streaming=pricing_data.supports_streaming,
        effective_date=pricing_data.effective_date
    )
    
    db.add(model_pricing)
    db.commit()
    db.refresh(model_pricing)
    
    return model_pricing


@router.get("/model-pricing", response_model=List[ModelPricingSchema])
async def get_model_pricing(
    provider: str = None,
    active_only: bool = True,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get model pricing information"""
    
    query = db.query(ModelPricing)
    
    if provider:
        query = query.filter(ModelPricing.provider == provider)
    
    if active_only:
        query = query.filter(ModelPricing.is_active == True)
    
    pricing_list = query.all()
    return pricing_list


@router.put("/model-pricing/{pricing_id}", response_model=ModelPricingSchema)
async def update_model_pricing(
    pricing_id: int,
    pricing_update: ModelPricingUpdate,
    current_user: User = Depends(require_plan("premium")),
    db: Session = Depends(get_db)
):
    """Update model pricing (Premium feature)"""
    
    model_pricing = db.query(ModelPricing).filter(
        ModelPricing.id == pricing_id
    ).first()
    
    if not model_pricing:
        raise HTTPException(status_code=404, detail="Model pricing not found")
    
    # Update fields
    update_data = pricing_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(model_pricing, field, value)
    
    db.commit()
    db.refresh(model_pricing)
    
    return model_pricing


@router.delete("/model-pricing/{pricing_id}")
async def delete_model_pricing(
    pricing_id: int,
    current_user: User = Depends(require_plan("premium")),
    db: Session = Depends(get_db)
):
    """Delete model pricing (Premium feature)"""
    
    model_pricing = db.query(ModelPricing).filter(
        ModelPricing.id == pricing_id
    ).first()
    
    if not model_pricing:
        raise HTTPException(status_code=404, detail="Model pricing not found")
    
    db.delete(model_pricing)
    db.commit()
    
    return {"message": "Model pricing deleted successfully"}


# User Account Management
@router.get("/account/usage-stats")
async def get_account_usage_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get account usage statistics"""
    
    from app.models.usage import UsageLog
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Current month stats
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    current_month_stats = db.query(
        func.count(UsageLog.id).label('requests'),
        func.sum(UsageLog.total_tokens).label('tokens'),
        func.sum(UsageLog.cost).label('cost')
    ).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.created_at >= month_start
    ).first()
    
    # All time stats
    all_time_stats = db.query(
        func.count(UsageLog.id).label('requests'),
        func.sum(UsageLog.total_tokens).label('tokens'),
        func.sum(UsageLog.cost).label('cost')
    ).filter(
        UsageLog.user_id == current_user.id
    ).first()
    
    # Active API keys count
    from app.models.user import APIKey
    active_api_keys = db.query(func.count(APIKey.id)).filter(
        APIKey.user_id == current_user.id,
        APIKey.is_active == True
    ).scalar()
    
    return {
        "current_month": {
            "requests": current_month_stats.requests or 0,
            "tokens": current_month_stats.tokens or 0,
            "cost": float(current_month_stats.cost or 0)
        },
        "all_time": {
            "requests": all_time_stats.requests or 0,
            "tokens": all_time_stats.tokens or 0,
            "cost": float(all_time_stats.cost or 0)
        },
        "active_api_keys": active_api_keys or 0,
        "plan": current_user.plan,
        "member_since": current_user.created_at.isoformat()
    }


@router.post("/account/upgrade-plan")
async def upgrade_plan(
    target_plan: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Upgrade user plan (placeholder for payment integration)"""
    
    valid_plans = ["free", "basic", "premium", "enterprise"]
    if target_plan not in valid_plans:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid plan. Choose from: {valid_plans}"
        )
    
    current_plan_index = valid_plans.index(current_user.plan)
    target_plan_index = valid_plans.index(target_plan)
    
    if target_plan_index <= current_plan_index:
        raise HTTPException(
            status_code=400,
            detail="Can only upgrade to a higher plan"
        )
    
    # In a real implementation, this would integrate with a payment processor
    # For now, we'll just update the plan directly
    current_user.plan = target_plan
    db.commit()
    
    return {
        "message": f"Plan upgraded to {target_plan}",
        "new_plan": target_plan,
        "note": "This is a demo upgrade. In production, payment processing would be required."
    }


@router.get("/account/export-data")
async def export_account_data(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export user's account data (GDPR compliance)"""
    
    from app.models.usage import UsageLog
    from app.models.user import APIKey
    
    # Get user's usage logs
    usage_logs = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id
    ).all()
    
    # Get user's API keys (without the actual keys)
    api_keys = db.query(APIKey).filter(
        APIKey.user_id == current_user.id
    ).all()
    
    # Get budget settings
    budget_settings = db.query(BudgetSetting).filter(
        BudgetSetting.user_id == current_user.id
    ).all()
    
    export_data = {
        "user_info": {
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "plan": current_user.plan,
            "created_at": current_user.created_at.isoformat(),
            "is_active": current_user.is_active,
            "is_verified": current_user.is_verified
        },
        "usage_logs": [
            {
                "id": log.id,
                "provider": log.provider,
                "model": log.model,
                "endpoint": log.endpoint,
                "prompt_tokens": log.prompt_tokens,
                "completion_tokens": log.completion_tokens,
                "total_tokens": log.total_tokens,
                "cost": log.cost,
                "latency_ms": log.latency_ms,
                "status_code": log.status_code,
                "created_at": log.created_at.isoformat()
            }
            for log in usage_logs
        ],
        "api_keys": [
            {
                "id": key.id,
                "name": key.name,
                "provider": key.provider,
                "is_active": key.is_active,
                "created_at": key.created_at.isoformat(),
                "last_used_at": key.last_used_at.isoformat() if key.last_used_at else None
            }
            for key in api_keys
        ],
        "budget_settings": [
            {
                "id": budget.id,
                "period_type": budget.period_type,
                "limit_amount": budget.limit_amount,
                "alert_threshold": budget.alert_threshold,
                "enable_alerts": budget.enable_alerts,
                "enable_auto_cutoff": budget.enable_auto_cutoff,
                "is_active": budget.is_active,
                "created_at": budget.created_at.isoformat()
            }
            for budget in budget_settings
        ]
    }
    
    return export_data 