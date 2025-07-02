import os
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.models.pricing import ModelPricing
from dotenv import load_dotenv

load_dotenv()


class CostCalculator:
    """Calculate costs for AI model usage"""
    
    def __init__(self, db: Session):
        self.db = db
        # Fallback pricing from environment variables
        self.fallback_pricing = {
            "openai": {
                "gpt-4": {
                    "prompt": float(os.getenv("GPT_4_PRICE_PER_1K_PROMPT_TOKENS", "0.03")),
                    "completion": float(os.getenv("GPT_4_PRICE_PER_1K_COMPLETION_TOKENS", "0.06"))
                },
                "gpt-4-turbo": {
                    "prompt": 0.01,
                    "completion": 0.03
                },
                "gpt-3.5-turbo": {
                    "prompt": float(os.getenv("GPT_3_5_TURBO_PRICE_PER_1K_PROMPT_TOKENS", "0.0015")),
                    "completion": float(os.getenv("GPT_3_5_TURBO_PRICE_PER_1K_COMPLETION_TOKENS", "0.002"))
                },
                "gpt-3.5-turbo-16k": {
                    "prompt": 0.003,
                    "completion": 0.004
                }
            },
            "anthropic": {
                "claude-3-opus-20240229": {
                    "prompt": float(os.getenv("CLAUDE_3_OPUS_PRICE_PER_1K_PROMPT_TOKENS", "0.015")),
                    "completion": float(os.getenv("CLAUDE_3_OPUS_PRICE_PER_1K_COMPLETION_TOKENS", "0.075"))
                },
                "claude-3-sonnet-20240229": {
                    "prompt": 0.003,
                    "completion": 0.015
                },
                "claude-3-haiku-20240307": {
                    "prompt": 0.00025,
                    "completion": 0.00125
                }
            }
        }

    async def get_model_pricing(self, provider: str, model: str) -> Optional[Dict[str, float]]:
        """Get pricing for a specific model from database or fallback"""
        # First try to get from database
        pricing = self.db.query(ModelPricing).filter(
            ModelPricing.provider == provider,
            ModelPricing.model_name == model,
            ModelPricing.is_active == True
        ).first()
        
        if pricing:
            return {
                "prompt": pricing.prompt_price_per_1k_tokens,
                "completion": pricing.completion_price_per_1k_tokens
            }
        
        # Fallback to hardcoded pricing
        provider_pricing = self.fallback_pricing.get(provider, {})
        return provider_pricing.get(model)

    async def calculate_cost(
        self, 
        provider: str, 
        model: str, 
        prompt_tokens: int, 
        completion_tokens: int
    ) -> float:
        """Calculate cost for API usage"""
        pricing = await self.get_model_pricing(provider, model)
        
        if not pricing:
            # If no pricing found, return 0 and log a warning
            print(f"Warning: No pricing found for {provider}/{model}")
            return 0.0
        
        # Calculate cost per 1k tokens
        prompt_cost = (prompt_tokens / 1000) * pricing["prompt"]
        completion_cost = (completion_tokens / 1000) * pricing["completion"]
        
        total_cost = prompt_cost + completion_cost
        return round(total_cost, 6)  # Round to 6 decimal places

    async def estimate_cost(
        self, 
        provider: str, 
        model: str, 
        estimated_prompt_tokens: int, 
        estimated_completion_tokens: int
    ) -> Dict[str, float]:
        """Estimate cost before making API call"""
        estimated_cost = await self.calculate_cost(
            provider, model, estimated_prompt_tokens, estimated_completion_tokens
        )
        
        return {
            "estimated_cost": estimated_cost,
            "prompt_tokens": estimated_prompt_tokens,
            "completion_tokens": estimated_completion_tokens,
            "provider": provider,
            "model": model
        }

    async def get_model_list(self, provider: Optional[str] = None) -> Dict[str, Dict]:
        """Get list of available models and their pricing"""
        query = self.db.query(ModelPricing).filter(ModelPricing.is_active == True)
        
        if provider:
            query = query.filter(ModelPricing.provider == provider)
        
        db_models = query.all()
        
        # Convert to dict format
        models = {}
        for model in db_models:
            if model.provider not in models:
                models[model.provider] = {}
            
            models[model.provider][model.model_name] = {
                "prompt_price_per_1k": model.prompt_price_per_1k_tokens,
                "completion_price_per_1k": model.completion_price_per_1k_tokens,
                "description": model.description,
                "max_tokens": model.max_tokens,
                "supports_streaming": model.supports_streaming
            }
        
        # Add fallback models if not in database
        for provider_name, provider_models in self.fallback_pricing.items():
            if provider and provider != provider_name:
                continue
                
            if provider_name not in models:
                models[provider_name] = {}
            
            for model_name, pricing in provider_models.items():
                if model_name not in models[provider_name]:
                    models[provider_name][model_name] = {
                        "prompt_price_per_1k": pricing["prompt"],
                        "completion_price_per_1k": pricing["completion"],
                        "description": "Default pricing",
                        "max_tokens": None,
                        "supports_streaming": True
                    }
        
        return models

    async def compare_model_costs(
        self, 
        prompt_tokens: int, 
        completion_tokens: int,
        providers: Optional[list] = None
    ) -> Dict[str, Dict]:
        """Compare costs across different models"""
        if not providers:
            providers = ["openai", "anthropic"]
        
        comparisons = {}
        
        for provider in providers:
            provider_models = await self.get_model_list(provider)
            
            if provider not in provider_models:
                continue
                
            comparisons[provider] = {}
            
            for model_name in provider_models[provider]:
                cost = await self.calculate_cost(provider, model_name, prompt_tokens, completion_tokens)
                comparisons[provider][model_name] = {
                    "cost": cost,
                    "pricing": provider_models[provider][model_name]
                }
        
        return comparisons 