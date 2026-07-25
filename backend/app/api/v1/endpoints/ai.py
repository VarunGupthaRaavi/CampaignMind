from typing import Dict, Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.ai import (
    CampaignGenerationRequest,
    CampaignGenerationResponse,
    ContentRefinementRequest,
)
from app.schemas.campaign_output import CampaignOutputCreate
from app.services.ai_service import ai_service
from app.crud.crud_campaign_output import crud_campaign_output

router = APIRouter()


@router.post("/generate-campaign", response_model=APIResponse[CampaignGenerationResponse], status_code=status.HTTP_200_OK)
async def generate_campaign_with_ai(
    request: CampaignGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[CampaignGenerationResponse]:
    """
    Generate a complete, structured multi-channel marketing campaign using Gemini 2.5 Flash API.
    Saves generated deliverables (Buyer Persona, Strategy, Ads, Keywords, Hashtags, Budget Allocation)
    to PostgreSQL database if campaign_id is provided.
    """
    ai_response = await ai_service.generate_campaign_plan(request)

    # Persist generated output to PostgreSQL if campaign_id is provided
    if request.campaign_id:
        persona_val = ai_response.buyer_persona if isinstance(ai_response.buyer_persona, dict) else {"description": str(ai_response.buyer_persona)}
        strategy_val = ai_response.marketing_strategy if isinstance(ai_response.marketing_strategy, dict) else {"description": str(ai_response.marketing_strategy)}
        budget_val = ai_response.budget_breakdown if isinstance(ai_response.budget_breakdown, dict) else ai_response.budget_breakdown.model_dump()

        output_in = CampaignOutputCreate(
            campaign_id=request.campaign_id,
            persona=persona_val,
            marketing_strategy=strategy_val,
            google_ads=ai_response.google_ads,
            facebook_ads=ai_response.facebook_ads,
            instagram_ads=ai_response.instagram_ads,
            linkedin_ads=ai_response.linkedin_ads,
            keywords=ai_response.keywords,
            hashtags=ai_response.hashtags,
            budget_breakdown=budget_val,
            status=ai_response.status,
        )
        await crud_campaign_output.upsert_output(db, campaign_id=request.campaign_id, obj_in=output_in)

    return APIResponse(
        success=True,
        message="AI marketing campaign generated successfully with Gemini 2.5 Flash",
        data=ai_response
    )


@router.post("/refine-content", response_model=APIResponse[Dict[str, Any]])
async def refine_campaign_content(
    request: ContentRefinementRequest,
    current_user: User = Depends(get_current_user)
) -> APIResponse[Dict[str, Any]]:
    """
    Refine, translate, or rewrite specific content pieces using Gemini 2.5 Flash API.
    """
    refined_result = await ai_service.refine_content_piece(request)
    return APIResponse(
        success=True,
        message="Content refined successfully",
        data=refined_result
    )
