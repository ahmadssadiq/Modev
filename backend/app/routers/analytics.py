from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.usage import UsageLog, BudgetSetting
from app.services.budget_checker import BudgetChecker
from app.services.cost_calculator import CostCalculator
from app.schemas.usage import (
    AnalyticsResponse, UsageSummary, ModelBreakdown, ProviderBreakdown,
    DailyUsage, BudgetStatus, RecommendationsResponse, Recommendation
)

router = APIRouter()


@router.get("/usage-summary", response_model=AnalyticsResponse)
async def get_usage_analytics(
    period_days: int = Query(30, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive usage analytics for the dashboard"""
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=period_days)
    
    # Get usage logs for the period
    usage_logs = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.created_at >= start_date,
        UsageLog.created_at <= end_date
    ).all()
    
    if not usage_logs:
        return AnalyticsResponse(
            summary=UsageSummary(
                total_requests=0,
                total_tokens=0,
                total_cost=0.0,
                period_start=start_date,
                period_end=end_date
            ),
            daily_usage=[],
            model_breakdown=[],
            provider_breakdown=[]
        )
    
    # Calculate summary statistics
    total_requests = len(usage_logs)
    total_tokens = sum(log.total_tokens for log in usage_logs)
    total_cost = sum(log.cost for log in usage_logs)
    
    summary = UsageSummary(
        total_requests=total_requests,
        total_tokens=total_tokens,
        total_cost=total_cost,
        period_start=start_date,
        period_end=end_date
    )
    
    # Calculate daily usage
    daily_usage_dict = {}
    for log in usage_logs:
        date_key = log.created_at.date().isoformat()
        if date_key not in daily_usage_dict:
            daily_usage_dict[date_key] = {
                "requests": 0,
                "tokens": 0,
                "cost": 0.0
            }
        daily_usage_dict[date_key]["requests"] += 1
        daily_usage_dict[date_key]["tokens"] += log.total_tokens
        daily_usage_dict[date_key]["cost"] += log.cost
    
    daily_usage = [
        DailyUsage(
            date=date_str,
            requests=data["requests"],
            tokens=data["tokens"],
            cost=data["cost"]
        )
        for date_str, data in sorted(daily_usage_dict.items())
    ]
    
    # Calculate model breakdown
    model_stats = {}
    for log in usage_logs:
        model_key = f"{log.provider}:{log.model}"
        if model_key not in model_stats:
            model_stats[model_key] = {
                "provider": log.provider,
                "model": log.model,
                "requests": 0,
                "tokens": 0,
                "cost": 0.0
            }
        model_stats[model_key]["requests"] += 1
        model_stats[model_key]["tokens"] += log.total_tokens
        model_stats[model_key]["cost"] += log.cost
    
    model_breakdown = [
        ModelBreakdown(
            model=stats["model"],
            provider=stats["provider"],
            requests=stats["requests"],
            tokens=stats["tokens"],
            cost=stats["cost"],
            percentage=(stats["cost"] / total_cost * 100) if total_cost > 0 else 0
        )
        for stats in sorted(model_stats.values(), key=lambda x: x["cost"], reverse=True)
    ]
    
    # Calculate provider breakdown
    provider_stats = {}
    for log in usage_logs:
        provider = log.provider
        if provider not in provider_stats:
            provider_stats[provider] = {
                "requests": 0,
                "tokens": 0,
                "cost": 0.0
            }
        provider_stats[provider]["requests"] += 1
        provider_stats[provider]["tokens"] += log.total_tokens
        provider_stats[provider]["cost"] += log.cost
    
    provider_breakdown = [
        ProviderBreakdown(
            provider=provider,
            requests=stats["requests"],
            tokens=stats["tokens"],
            cost=stats["cost"],
            percentage=(stats["cost"] / total_cost * 100) if total_cost > 0 else 0
        )
        for provider, stats in sorted(provider_stats.items(), key=lambda x: x[1]["cost"], reverse=True)
    ]
    
    return AnalyticsResponse(
        summary=summary,
        daily_usage=daily_usage,
        model_breakdown=model_breakdown,
        provider_breakdown=provider_breakdown
    )


@router.get("/budget-status", response_model=List[BudgetStatus])
async def get_budget_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current budget status for all user's budget settings"""
    
    budget_checker = BudgetChecker(db)
    budget_summary = await budget_checker.get_budget_summary(current_user.id)
    
    if not budget_summary["has_budget"]:
        return []
    
    budget_statuses = []
    for budget in budget_summary["budget_summaries"]:
        status = BudgetStatus(
            current_spend=budget["current_spend"],
            budget_limit=budget["limit_amount"],
            percentage_used=budget["percentage_used"],
            period_type=budget["period_type"],
            period_start=datetime.fromisoformat(budget["period_start"]),
            period_end=datetime.fromisoformat(budget["period_end"]),
            is_over_budget=budget["is_over_budget"],
            alerts_enabled=budget["alerts_enabled"]
        )
        budget_statuses.append(status)
    
    return budget_statuses


@router.get("/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get cost optimization recommendations"""
    
    # Get recent usage data (last 30 days)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    
    usage_logs = db.query(UsageLog).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.created_at >= start_date
    ).all()
    
    recommendations = []
    total_potential_savings = 0.0
    
    if not usage_logs:
        return RecommendationsResponse(
            recommendations=[
                Recommendation(
                    type="getting_started",
                    title="Start Using AI Cost Optimizer",
                    description="Begin tracking your AI usage by adding API keys and making requests through our proxy.",
                    confidence=1.0,
                    action_required="Add your AI provider API keys",
                    priority="high"
                )
            ],
            total_potential_savings=0.0
        )
    
    # Analyze usage patterns
    total_cost = sum(log.cost for log in usage_logs)
    model_costs = {}
    provider_costs = {}
    
    for log in usage_logs:
        model_key = f"{log.provider}:{log.model}"
        if model_key not in model_costs:
            model_costs[model_key] = {"cost": 0, "requests": 0, "tokens": 0}
        model_costs[model_key]["cost"] += log.cost
        model_costs[model_key]["requests"] += 1
        model_costs[model_key]["tokens"] += log.total_tokens
        
        if log.provider not in provider_costs:
            provider_costs[log.provider] = {"cost": 0, "requests": 0}
        provider_costs[log.provider]["cost"] += log.cost
        provider_costs[log.provider]["requests"] += 1
    
    # Recommendation 1: Expensive model usage
    for model_key, stats in model_costs.items():
        provider, model = model_key.split(":", 1)
        
        # Check if using expensive models frequently
        if (stats["cost"] / total_cost > 0.5 and  # More than 50% of cost
            "gpt-4" in model.lower() and stats["requests"] > 10):
            
            # Estimate savings by switching to GPT-3.5-turbo for some requests
            potential_savings = stats["cost"] * 0.4  # Assume 40% could be switched
            
            recommendations.append(Recommendation(
                type="cost_saving",
                title="Consider Using GPT-3.5-turbo for Simple Tasks",
                description=f"You're spending ${stats['cost']:.2f} on {model}. "
                           f"Consider using GPT-3.5-turbo for simpler tasks to save approximately ${potential_savings:.2f}.",
                potential_savings=potential_savings,
                confidence=0.8,
                action_required="Review requests that could use a cheaper model",
                priority="high"
            ))
            total_potential_savings += potential_savings
    
    # Recommendation 2: Budget setup
    budget_settings = db.query(BudgetSetting).filter(
        BudgetSetting.user_id == current_user.id,
        BudgetSetting.is_active == True
    ).first()
    
    if not budget_settings and total_cost > 10:  # If spending more than $10 and no budget
        recommendations.append(Recommendation(
            type="budget_management",
            title="Set Up Budget Limits",
            description=f"You've spent ${total_cost:.2f} in the last 30 days. "
                       "Setting up budget limits can help prevent unexpected costs.",
            confidence=0.9,
            action_required="Configure monthly budget limits",
            priority="medium"
        ))
    
    # Recommendation 3: High latency models
    high_latency_logs = [log for log in usage_logs if log.latency_ms and log.latency_ms > 5000]
    if len(high_latency_logs) > len(usage_logs) * 0.2:  # More than 20% are slow
        recommendations.append(Recommendation(
            type="performance",
            title="Consider Faster Models for Better Performance",
            description=f"{len(high_latency_logs)} of your requests took longer than 5 seconds. "
                       "Consider using faster models or optimizing your prompts.",
            confidence=0.7,
            action_required="Review slow requests and optimize",
            priority="low"
        ))
    
    # Recommendation 4: Single provider dependency
    if len(provider_costs) == 1 and total_cost > 20:
        recommendations.append(Recommendation(
            type="risk_management",
            title="Consider Multi-Provider Strategy",
            description="You're using only one AI provider. Adding alternative providers can improve reliability and potentially reduce costs.",
            confidence=0.6,
            action_required="Add API keys for alternative providers",
            priority="low"
        ))
    
    # Recommendation 5: Token optimization
    avg_tokens_per_request = sum(log.total_tokens for log in usage_logs) / len(usage_logs)
    if avg_tokens_per_request > 2000:  # High token usage
        recommendations.append(Recommendation(
            type="optimization",
            title="Optimize Token Usage",
            description=f"Your average request uses {avg_tokens_per_request:.0f} tokens. "
                       "Shorter prompts and responses can significantly reduce costs.",
            potential_savings=total_cost * 0.2,  # Estimate 20% savings
            confidence=0.7,
            action_required="Review and shorten prompts where possible",
            priority="medium"
        ))
        total_potential_savings += total_cost * 0.2
    
    # Sort recommendations by priority and potential savings
    priority_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
    recommendations.sort(
        key=lambda x: (priority_order.get(x.priority, 0), x.potential_savings or 0),
        reverse=True
    )
    
    return RecommendationsResponse(
        recommendations=recommendations,
        total_potential_savings=total_potential_savings
    )


@router.get("/cost-comparison")
async def get_cost_comparison(
    prompt_tokens: int = Query(..., description="Number of prompt tokens"),
    completion_tokens: int = Query(..., description="Number of completion tokens"),
    providers: Optional[str] = Query(None, description="Comma-separated list of providers"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Compare costs across different models and providers"""
    
    cost_calculator = CostCalculator(db)
    
    if providers:
        provider_list = [p.strip() for p in providers.split(",")]
    else:
        provider_list = ["openai", "anthropic"]
    
    comparison = await cost_calculator.compare_model_costs(
        prompt_tokens, completion_tokens, provider_list
    )
    
    return comparison


@router.get("/usage-trends")
async def get_usage_trends(
    days: int = Query(30, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get usage trends and patterns"""
    
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # Group usage by day and calculate metrics
    daily_stats = db.query(
        func.date(UsageLog.created_at).label('date'),
        func.count(UsageLog.id).label('requests'),
        func.sum(UsageLog.total_tokens).label('tokens'),
        func.sum(UsageLog.cost).label('cost'),
        func.avg(UsageLog.latency_ms).label('avg_latency')
    ).filter(
        UsageLog.user_id == current_user.id,
        UsageLog.created_at >= start_date
    ).group_by(
        func.date(UsageLog.created_at)
    ).order_by('date').all()
    
    trends = []
    for stat in daily_stats:
        trends.append({
            "date": stat.date.isoformat(),
            "requests": stat.requests,
            "tokens": stat.tokens or 0,
            "cost": float(stat.cost or 0),
            "avg_latency_ms": float(stat.avg_latency or 0)
        })
    
    # Calculate trend metrics
    if len(trends) >= 7:
        recent_week = trends[-7:]
        previous_week = trends[-14:-7] if len(trends) >= 14 else []
        
        recent_avg_cost = sum(day["cost"] for day in recent_week) / 7
        previous_avg_cost = sum(day["cost"] for day in previous_week) / len(previous_week) if previous_week else recent_avg_cost
        
        cost_trend = "increasing" if recent_avg_cost > previous_avg_cost else "decreasing"
        cost_change_percent = ((recent_avg_cost - previous_avg_cost) / previous_avg_cost * 100) if previous_avg_cost > 0 else 0
    else:
        cost_trend = "stable"
        cost_change_percent = 0
    
    return {
        "daily_trends": trends,
        "summary": {
            "cost_trend": cost_trend,
            "cost_change_percent": round(cost_change_percent, 2),
            "total_days": len(trends)
        }
    } 