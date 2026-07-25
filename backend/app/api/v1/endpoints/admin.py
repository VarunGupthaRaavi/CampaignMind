from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update

from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.user import User
from app.models.campaign import Campaign
from app.models.campaign_output import CampaignOutput
from app.schemas.common import APIResponse
from app.schemas.user import UserResponse
from app.schemas.campaign import CampaignDetailResponse, CampaignResponse

router = APIRouter()


class AdminStatsResponse(BaseModel):
    total_users: int
    total_campaigns: int
    todays_campaigns: int
    total_ai_requests: int
    recent_activity: List[Dict[str, Any]]


class UpdateRoleRequest(BaseModel):
    role: str


@router.get("/stats", response_model=APIResponse[AdminStatsResponse])
async def get_admin_dashboard_stats(
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[AdminStatsResponse]:
    """
    Get top metrics: Total Users, Total Campaigns, Today's Campaigns, AI Requests, and Recent Activity.
    """
    # 1. Total users
    users_count_res = await db.execute(select(func.count(User.id)))
    total_users = users_count_res.scalar() or 0

    # 2. Total campaigns
    campaigns_count_res = await db.execute(select(func.count(Campaign.id)))
    total_campaigns = campaigns_count_res.scalar() or 0

    # 3. Today's campaigns
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_count_res = await db.execute(select(func.count(Campaign.id)).where(Campaign.created_at >= today_start))
    todays_campaigns = today_count_res.scalar() or 0

    # 4. Total AI Requests (campaign outputs count)
    ai_requests_res = await db.execute(select(func.count(CampaignOutput.id)))
    total_ai_requests = ai_requests_res.scalar() or 0

    # 5. Recent Activity
    recent_c_res = await db.execute(select(Campaign).order_by(Campaign.created_at.desc()).limit(5))
    recent_campaigns = recent_c_res.scalars().all()

    recent_activity = [
        {
            "id": str(c.id),
            "type": "campaign_created",
            "title": c.title,
            "user_id": str(c.user_id),
            "created_at": c.created_at.isoformat(),
        }
        for c in recent_campaigns
    ]

    return APIResponse(
        success=True,
        message="Admin stats retrieved successfully",
        data=AdminStatsResponse(
            total_users=total_users,
            total_campaigns=total_campaigns,
            todays_campaigns=todays_campaigns,
            total_ai_requests=total_ai_requests,
            recent_activity=recent_activity,
        )
    )


@router.get("/users", response_model=APIResponse[List[UserResponse]])
async def list_all_users(
    query: Optional[str] = Query(None, description="Search by name or email"),
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[List[UserResponse]]:
    """
    List all users with search filtering. Restricted to Admins.
    """
    stmt = select(User).order_by(User.created_at.desc())
    if query:
        term = f"%{query}%"
        stmt = stmt.where((User.email.ilike(term)) | (User.full_name.ilike(term)))

    result = await db.execute(stmt)
    users = result.scalars().all()

    return APIResponse(
        success=True,
        message="Users retrieved successfully",
        data=[UserResponse.model_validate(u) for u in users]
    )


@router.patch("/users/{user_id}/role", response_model=APIResponse[UserResponse])
async def update_user_role(
    user_id: UUID,
    body: UpdateRoleRequest,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[UserResponse]:
    """
    Update user role (e.g. 'user' <-> 'admin').
    """
    if body.role not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'user' or 'admin'",
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.role = body.role
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return APIResponse(
        success=True,
        message=f"User role updated to '{body.role}'",
        data=UserResponse.model_validate(user)
    )


@router.get("/campaigns", response_model=APIResponse[List[CampaignResponse]])
async def list_all_campaigns_admin(
    query: Optional[str] = Query(None, description="Search title or industry"),
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[List[CampaignResponse]]:
    """
    List all campaigns across all users for admin review.
    """
    stmt = select(Campaign).order_by(Campaign.created_at.desc())
    if query:
        term = f"%{query}%"
        stmt = stmt.where((Campaign.title.ilike(term)) | (Campaign.industry.ilike(term)))

    result = await db.execute(stmt)
    campaigns = result.scalars().all()

    return APIResponse(
        success=True,
        message="All campaigns retrieved successfully",
        data=[CampaignResponse.model_validate(c) for c in campaigns]
    )


@router.delete("/campaigns/{campaign_id}", response_model=APIResponse[bool])
async def delete_campaign_admin(
    campaign_id: UUID,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[bool]:
    """
    Admin delete any campaign by ID.
    """
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    campaign = result.scalars().first()
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    await db.delete(campaign)
    await db.commit()

    return APIResponse(
        success=True,
        message="Campaign deleted successfully by admin",
        data=True
    )


@router.get("/analytics", response_model=APIResponse[Dict[str, Any]])
async def get_admin_analytics(
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[Dict[str, Any]]:
    """
    Aggregated platform analytics: popular industries and goals.
    """
    # Industry distribution
    ind_res = await db.execute(
        select(Campaign.industry, func.count(Campaign.id))
        .group_by(Campaign.industry)
        .order_by(func.count(Campaign.id).desc())
    )
    popular_industries = [{"industry": ind or "Unspecified", "count": count} for ind, count in ind_res.all()]

    # Goal distribution
    goal_res = await db.execute(
        select(Campaign.goal, func.count(Campaign.id))
        .group_by(Campaign.goal)
        .order_by(func.count(Campaign.id).desc())
    )
    popular_goals = [{"goal": goal or "General", "count": count} for goal, count in goal_res.all()]

    return APIResponse(
        success=True,
        message="Analytics retrieved successfully",
        data={
            "popular_industries": popular_industries,
            "popular_goals": popular_goals,
        }
    )
