from datetime import datetime, timedelta
from typing import Dict, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from fastapi import HTTPException

from app.models.usage import UsageLog, BudgetSetting
from app.models.user import User
from app.services.email_service import EmailService


class BudgetChecker:
    """Check and enforce budget limits"""
    
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService()

    def get_period_boundaries(self, period_type: str) -> tuple[datetime, datetime]:
        """Get start and end dates for the current period"""
        now = datetime.utcnow()
        
        if period_type == "daily":
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
        elif period_type == "weekly":
            # Start of week (Monday)
            days_since_monday = now.weekday()
            start = (now - timedelta(days=days_since_monday)).replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(weeks=1)
        elif period_type == "monthly":
            start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            # Next month's first day
            if now.month == 12:
                end = start.replace(year=now.year + 1, month=1)
            else:
                end = start.replace(month=now.month + 1)
        else:
            raise ValueError(f"Unsupported period type: {period_type}")
        
        return start, end

    async def get_current_spend(self, user_id: int, period_type: str) -> float:
        """Get current spending for the specified period"""
        start_date, end_date = self.get_period_boundaries(period_type)
        
        total_cost = self.db.query(func.sum(UsageLog.cost)).filter(
            and_(
                UsageLog.user_id == user_id,
                UsageLog.created_at >= start_date,
                UsageLog.created_at < end_date
            )
        ).scalar()
        
        return total_cost or 0.0

    async def get_user_budget_settings(self, user_id: int) -> List[BudgetSetting]:
        """Get all active budget settings for a user"""
        return self.db.query(BudgetSetting).filter(
            and_(
                BudgetSetting.user_id == user_id,
                BudgetSetting.is_active == True
            )
        ).all()

    async def check_budget_limits(self, user_id: int) -> Dict[str, any]:
        """Check if user is within budget limits"""
        budget_settings = await self.get_user_budget_settings(user_id)
        
        if not budget_settings:
            return {"status": "no_budget_set"}
        
        results = []
        
        for budget in budget_settings:
            current_spend = await self.get_current_spend(user_id, budget.period_type)
            percentage_used = (current_spend / budget.limit_amount) * 100 if budget.limit_amount > 0 else 0
            
            budget_status = {
                "period_type": budget.period_type,
                "limit_amount": budget.limit_amount,
                "current_spend": current_spend,
                "percentage_used": percentage_used,
                "alert_threshold": budget.alert_threshold * 100,
                "auto_cutoff": budget.enable_auto_cutoff
            }
            
            # Check if over budget
            if current_spend >= budget.limit_amount:
                budget_status["status"] = "over_budget"
                
                if budget.enable_auto_cutoff:
                    raise HTTPException(
                        status_code=429,
                        detail=f"Budget limit exceeded for {budget.period_type} period. "
                               f"Spent ${current_spend:.2f} of ${budget.limit_amount:.2f} limit."
                    )
                
                # Send alert if enabled
                if budget.enable_alerts:
                    await self._send_budget_alert(user_id, budget_status, "over_budget")
            
            # Check if approaching threshold
            elif percentage_used >= (budget.alert_threshold * 100):
                budget_status["status"] = "approaching_limit"
                
                if budget.enable_alerts:
                    await self._send_budget_alert(user_id, budget_status, "approaching_limit")
            
            else:
                budget_status["status"] = "within_budget"
            
            results.append(budget_status)
        
        return {"status": "checked", "budgets": results}

    async def _send_budget_alert(self, user_id: int, budget_status: Dict, alert_type: str):
        """Send budget alert email"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return
        
        if alert_type == "over_budget":
            subject = f"🚨 Budget Limit Exceeded - AI Cost Optimizer"
            message = f"""
            Your {budget_status['period_type']} budget limit has been exceeded.
            
            Budget Details:
            - Period: {budget_status['period_type']}
            - Limit: ${budget_status['limit_amount']:.2f}
            - Current Spend: ${budget_status['current_spend']:.2f}
            - Percentage Used: {budget_status['percentage_used']:.1f}%
            
            Please review your usage or adjust your budget settings.
            """
        else:  # approaching_limit
            subject = f"⚠️ Budget Alert - AI Cost Optimizer"
            message = f"""
            You're approaching your {budget_status['period_type']} budget limit.
            
            Budget Details:
            - Period: {budget_status['period_type']}
            - Limit: ${budget_status['limit_amount']:.2f}
            - Current Spend: ${budget_status['current_spend']:.2f}
            - Percentage Used: {budget_status['percentage_used']:.1f}%
            - Alert Threshold: {budget_status['alert_threshold']:.1f}%
            
            Consider monitoring your usage more closely.
            """
        
        await self.email_service.send_email(
            to_email=user.email,
            subject=subject,
            message=message
        )

    async def get_budget_summary(self, user_id: int) -> Dict[str, any]:
        """Get comprehensive budget summary for dashboard"""
        budget_settings = await self.get_user_budget_settings(user_id)
        
        if not budget_settings:
            return {
                "has_budget": False,
                "message": "No budget settings configured"
            }
        
        summaries = []
        
        for budget in budget_settings:
            current_spend = await self.get_current_spend(user_id, budget.period_type)
            start_date, end_date = self.get_period_boundaries(budget.period_type)
            
            remaining_budget = max(0, budget.limit_amount - current_spend)
            days_remaining = (end_date - datetime.utcnow()).days
            
            summary = {
                "period_type": budget.period_type,
                "limit_amount": budget.limit_amount,
                "current_spend": current_spend,
                "remaining_budget": remaining_budget,
                "percentage_used": (current_spend / budget.limit_amount) * 100 if budget.limit_amount > 0 else 0,
                "period_start": start_date.isoformat(),
                "period_end": end_date.isoformat(),
                "days_remaining": days_remaining,
                "alerts_enabled": budget.enable_alerts,
                "auto_cutoff_enabled": budget.enable_auto_cutoff,
                "is_over_budget": current_spend >= budget.limit_amount
            }
            
            summaries.append(summary)
        
        return {
            "has_budget": True,
            "budget_summaries": summaries
        }

    async def project_spending(self, user_id: int, period_type: str) -> Dict[str, float]:
        """Project spending for the rest of the period"""
        current_spend = await self.get_current_spend(user_id, period_type)
        start_date, end_date = self.get_period_boundaries(period_type)
        
        # Calculate daily average spend
        days_elapsed = (datetime.utcnow() - start_date).days + 1
        total_days = (end_date - start_date).days
        
        if days_elapsed <= 0:
            return {"projected_spend": 0.0, "daily_average": 0.0}
        
        daily_average = current_spend / days_elapsed
        projected_spend = daily_average * total_days
        
        return {
            "current_spend": current_spend,
            "daily_average": daily_average,
            "projected_spend": projected_spend,
            "days_elapsed": days_elapsed,
            "total_days": total_days
        } 