from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse, CampaignDetailResponse
from app.schemas.campaign_output import CampaignOutputCreate
from app.schemas.ai import CampaignGenerationRequest
from app.crud.crud_campaign import crud_campaign
from app.crud.crud_campaign_output import crud_campaign_output
from app.services.ai_service import ai_service

router = APIRouter()


class GenerateAndSaveCampaignRequest(BaseModel):
    title: str = Field(..., min_length=3, description="Campaign Name")
    description: str = Field(..., min_length=10, description="Product Description")
    industry: Optional[str] = "Technology & SaaS"
    target_audience: Optional[str] = "B2B Decision Makers"
    budget: Optional[str] = "₹2,00,000 - ₹10,00,000 / month"
    goal: Optional[str] = "Lead Generation & Registrations"
    tone: Optional[str] = "Professional & Authoritative"
    channels: List[str] = Field(default_factory=lambda: ["Google", "Facebook", "Instagram", "LinkedIn"])


@router.post("/generate-and-save", response_model=APIResponse[CampaignDetailResponse], status_code=status.HTTP_201_CREATED)
async def generate_and_save_campaign(
    request: GenerateAndSaveCampaignRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[CampaignDetailResponse]:
    """
    Orchestrated endpoint:
    1. Enforces 1 Free Campaign Limit for non-admin users.
    2. Creates Campaign entity for authenticated user in PostgreSQL.
    3. Calls Gemini 2.5 Flash API to generate structured marketing plan deliverables.
    4. Persists AI generated outputs to campaign_outputs PostgreSQL table.
    5. Returns complete CampaignDetailResponse.
    """
    # 0. Check Free Campaign Credit Limit
    if current_user.role != "admin":
        user_campaigns = await crud_campaign.get_by_user_id(db, user_id=current_user.id)
        if len(user_campaigns) >= 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Free Plan Campaign Limit Reached (1/1 free campaign used). Upgrade to Pro for unlimited AI campaign generation."
            )

    # 1. Create Campaign record
    campaign_in = CampaignCreate(
        title=request.title,
        description=request.description,
        industry=request.industry,
        target_audience=request.target_audience,
        budget=request.budget,
        goal=request.goal,
        tone=request.tone,
    )
    campaign = await crud_campaign.create_with_owner(db, obj_in=campaign_in, user_id=current_user.id)

    # 2. Call Gemini 2.5 Flash API
    ai_request = CampaignGenerationRequest(
        campaign_id=campaign.id,
        product_name=request.title,
        product_description=request.description,
        industry=request.industry,
        target_audience=request.target_audience,
        budget=request.budget,
        goal=request.goal,
        tone=request.tone,
        target_channels=request.channels,
    )
    ai_response = await ai_service.generate_campaign_plan(ai_request)

    # 3. Persist output to campaign_outputs table
    persona_val = ai_response.buyer_persona if isinstance(ai_response.buyer_persona, dict) else {"description": str(ai_response.buyer_persona)}
    strategy_val = ai_response.marketing_strategy if isinstance(ai_response.marketing_strategy, dict) else {"description": str(ai_response.marketing_strategy)}
    budget_val = ai_response.budget_breakdown if isinstance(ai_response.budget_breakdown, dict) else ai_response.budget_breakdown.model_dump()

    output_in = CampaignOutputCreate(
        campaign_id=campaign.id,
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
    output = await crud_campaign_output.upsert_output(db, campaign_id=campaign.id, obj_in=output_in)

    # 4. Fetch detail with relationship loaded
    campaign_detail = await crud_campaign.get_with_output(db, id=campaign.id)

    return APIResponse(
        success=True,
        message="Campaign created and AI strategy generated successfully",
        data=CampaignDetailResponse.model_validate(campaign_detail)
    )


@router.get("", response_model=APIResponse[List[CampaignResponse]])
async def list_user_campaigns(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[List[CampaignResponse]]:
    """
    List all marketing campaigns owned by the current authenticated user.
    """
    campaigns = await crud_campaign.get_by_user_id(db, user_id=current_user.id)
    return APIResponse(
        success=True,
        message="User campaigns retrieved successfully",
        data=[CampaignResponse.model_validate(c) for c in campaigns]
    )


@router.get("/{campaign_id}", response_model=APIResponse[CampaignDetailResponse])
async def get_campaign_detail(
    campaign_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[CampaignDetailResponse]:
    """
    Get detailed campaign with joined AI outputs.
    Enforces user ownership authorization (user_id == current_user.id).
    """
    campaign = await crud_campaign.get_with_output(db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    if campaign.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this campaign"
        )
    return APIResponse(
        success=True,
        message="Campaign detail retrieved successfully",
        data=CampaignDetailResponse.model_validate(campaign)
    )


@router.put("/{campaign_id}", response_model=APIResponse[CampaignDetailResponse])
@router.patch("/{campaign_id}", response_model=APIResponse[CampaignDetailResponse])
async def update_campaign(
    campaign_id: UUID,
    obj_in: CampaignUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[CampaignDetailResponse]:
    """
    Update existing campaign parameters.
    """
    campaign = await crud_campaign.get(db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    if campaign.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this campaign"
        )

    updated_campaign = await crud_campaign.update(db, db_obj=campaign, obj_in=obj_in)
    campaign_detail = await crud_campaign.get_with_output(db, id=updated_campaign.id)

    return APIResponse(
        success=True,
        message="Campaign updated successfully",
        data=CampaignDetailResponse.model_validate(campaign_detail)
    )


@router.delete("/{campaign_id}", response_model=APIResponse[dict])
async def delete_campaign(
    campaign_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[dict]:
    """
    Delete campaign.
    """
    campaign = await crud_campaign.get(db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    if campaign.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this campaign"
        )

    await crud_campaign.delete(db, id=campaign_id)
    return APIResponse(
        success=True,
        message="Campaign deleted successfully",
        data={"id": str(campaign_id)}
    )
