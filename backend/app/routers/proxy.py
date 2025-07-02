import time
import json
import os
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import httpx
from typing import Dict, Any

from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.usage import UsageLog
from app.models.user import APIKey as APIKeyModel
from app.services.cost_calculator import CostCalculator
from app.services.budget_checker import BudgetChecker

router = APIRouter()

# API Key management endpoints (Must be defined BEFORE the catch-all proxy route)
@router.post("/api-keys")
async def add_api_key(
    api_key_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a new API key for a provider"""
    import base64
    
    # Basic validation
    required_fields = ["name", "provider", "api_key"]
    for field in required_fields:
        if field not in api_key_data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
    
    # Validate provider
    if api_key_data["provider"] not in ["openai", "anthropic"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported provider: {api_key_data['provider']}"
        )
    
    # Check if user already has an API key for this provider
    existing_key = db.query(APIKeyModel).filter(
        APIKeyModel.user_id == current_user.id,
        APIKeyModel.provider == api_key_data["provider"]
    ).first()
    
    if existing_key:
        # Update existing key
        existing_key.name = api_key_data["name"]
        existing_key.encrypted_key = base64.b64encode(api_key_data["api_key"].encode()).decode()
        existing_key.is_active = True
        db.commit()
        return {"message": "API key updated successfully"}
    else:
        # Create new key
        encrypted_key = base64.b64encode(api_key_data["api_key"].encode()).decode()
        
        new_api_key = APIKeyModel(
            name=api_key_data["name"],
            provider=api_key_data["provider"],
            encrypted_key=encrypted_key,
            user_id=current_user.id,
            team_id=api_key_data.get("team_id")
        )
        
        db.add(new_api_key)
        db.commit()
        
        return {"message": "API key added successfully"}


@router.get("/api-keys")
async def list_api_keys(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List user's API keys (without exposing the actual keys)"""
    api_keys = db.query(APIKeyModel).filter(
        APIKeyModel.user_id == current_user.id
    ).all()
    
    return [
        {
            "id": key.id,
            "name": key.name,
            "provider": key.provider,
            "is_active": key.is_active,
            "created_at": key.created_at,
            "last_used_at": key.last_used_at
        }
        for key in api_keys
    ]


@router.delete("/api-keys/{api_key_id}")
async def delete_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an API key"""
    api_key = db.query(APIKeyModel).filter(
        APIKeyModel.id == api_key_id,
        APIKeyModel.user_id == current_user.id
    ).first()
    
    if not api_key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    db.delete(api_key)
    db.commit()
    
    return {"message": "API key deleted successfully"}

# AI Provider configurations
PROVIDER_CONFIGS = {
    "openai": {
        "base_url": "https://api.openai.com",
        "headers": lambda api_key: {"Authorization": f"Bearer {api_key}"}
    },
    "anthropic": {
        "base_url": "https://api.anthropic.com",
        "headers": lambda api_key: {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01"
        }
    }
}


async def get_user_api_key(
    provider: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> APIKeyModel:
    """Get user's API key for the specified provider"""
    api_key = db.query(APIKeyModel).filter(
        APIKeyModel.user_id == current_user.id,
        APIKeyModel.provider == provider,
        APIKeyModel.is_active == True
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=404,
            detail=f"No active API key found for {provider}. Please add your API key first."
        )
    
    return api_key


def decrypt_api_key(encrypted_key: str) -> str:
    """Decrypt the stored API key"""
    # For now, we'll use a simple base64 encoding
    # In production, use proper encryption like Fernet
    import base64
    try:
        return base64.b64decode(encrypted_key.encode()).decode()
    except Exception:
        raise HTTPException(status_code=500, detail="Invalid API key format")


async def log_usage(
    db: Session,
    user_id: int,
    api_key_id: int,
    provider: str,
    model: str,
    endpoint: str,
    prompt_tokens: int,
    completion_tokens: int,
    cost: float,
    latency_ms: int,
    status_code: int,
    request_size: int = None,
    response_size: int = None,
    extra_data: Dict[str, Any] = None
):
    """Log API usage to database"""
    usage_log = UsageLog(
        user_id=user_id,
        api_key_id=api_key_id,
        provider=provider,
        model=model,
        endpoint=endpoint,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=prompt_tokens + completion_tokens,
        cost=cost,
        latency_ms=latency_ms,
        status_code=status_code,
        request_size_bytes=request_size,
        response_size_bytes=response_size,
        extra_data=extra_data
    )
    
    db.add(usage_log)
    db.commit()


@router.api_route(
    "/{provider}/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"]
)
async def proxy_request(
    provider: str,
    path: str,
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Proxy requests to AI providers with usage logging"""
    
    # Validate provider
    if provider not in PROVIDER_CONFIGS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported provider: {provider}. Supported: {list(PROVIDER_CONFIGS.keys())}"
        )
    
    # Get user's API key for this provider
    user_api_key = await get_user_api_key(provider, current_user, db)
    actual_api_key = decrypt_api_key(user_api_key.encrypted_key)
    
    # Check budget before making the request
    budget_checker = BudgetChecker(db)
    await budget_checker.check_budget_limits(current_user.id)
    
    # Prepare request details
    provider_config = PROVIDER_CONFIGS[provider]
    target_url = f"{provider_config['base_url']}/{path}"
    headers = provider_config["headers"](actual_api_key)
    
    # Get request body
    body = await request.body()
    request_size = len(body) if body else 0
    
    # Parse request body for token counting
    request_data = {}
    if body:
        try:
            request_data = json.loads(body)
        except json.JSONDecodeError:
            pass
    
    # Extract model from request
    model = request_data.get("model", "unknown")
    
    # Prepare headers for forwarding
    forward_headers = {}
    for key, value in request.headers.items():
        if key.lower() not in ["host", "authorization", "x-api-key"]:
            forward_headers[key] = value
    
    # Add provider-specific headers
    forward_headers.update(headers)
    
    # Start timing
    start_time = time.time()
    
    try:
        # Make the request to the AI provider
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=forward_headers,
                content=body,
                params=request.query_params
            )
        
        # Calculate latency
        latency_ms = int((time.time() - start_time) * 1000)
        
        # Get response content
        response_content = response.content
        response_size = len(response_content)
        
        # Parse response for token counting and cost calculation
        prompt_tokens = 0
        completion_tokens = 0
        cost = 0.0
        
        try:
            if response.status_code == 200:
                response_json = json.loads(response_content)
                
                # Extract usage information based on provider
                if provider == "openai":
                    usage = response_json.get("usage", {})
                    prompt_tokens = usage.get("prompt_tokens", 0)
                    completion_tokens = usage.get("completion_tokens", 0)
                elif provider == "anthropic":
                    usage = response_json.get("usage", {})
                    prompt_tokens = usage.get("input_tokens", 0)
                    completion_tokens = usage.get("output_tokens", 0)
                
                # Calculate cost
                cost_calculator = CostCalculator(db)
                cost = await cost_calculator.calculate_cost(
                    provider, model, prompt_tokens, completion_tokens
                )
        
        except (json.JSONDecodeError, KeyError):
            # If we can't parse the response, log with 0 tokens
            pass
        
        # Log the usage
        await log_usage(
            db=db,
            user_id=current_user.id,
            api_key_id=user_api_key.id,
            provider=provider,
            model=model,
            endpoint=f"/{path}",
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            cost=cost,
            latency_ms=latency_ms,
            status_code=response.status_code,
            request_size=request_size,
            response_size=response_size,
            extra_data={
                "method": request.method,
                "query_params": dict(request.query_params)
            }
        )
        
        # Update API key last used timestamp
        user_api_key.last_used_at = db.query(UsageLog).order_by(UsageLog.created_at.desc()).first().created_at
        db.commit()
        
        # Return the response from the AI provider
        return Response(
            content=response_content,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.headers.get("content-type")
        )
        
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Request to AI provider timed out")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"Error connecting to {provider}: {str(e)}")
    except Exception as e:
        # Log error usage
        await log_usage(
            db=db,
            user_id=current_user.id,
            api_key_id=user_api_key.id,
            provider=provider,
            model=model,
            endpoint=f"/{path}",
            prompt_tokens=0,
            completion_tokens=0,
            cost=0.0,
            latency_ms=int((time.time() - start_time) * 1000),
            status_code=500,
            request_size=request_size,
            extra_data={"error": str(e)}
        )
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


 