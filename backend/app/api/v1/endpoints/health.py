from typing import Dict, Any
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", response_model=Dict[str, Any])
async def health_check() -> Dict[str, Any]:
    """
    Service health check endpoint.
    """
    return {
        "status": "healthy",
        "service": "CampaignMind API",
        "version": "1.0.0"
    }
