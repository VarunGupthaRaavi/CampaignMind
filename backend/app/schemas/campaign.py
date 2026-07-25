from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.campaign_output import CampaignOutputResponse


class CampaignBase(BaseModel):
    title: str
    description: Optional[str] = None
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    budget: Optional[str] = None
    goal: Optional[str] = None
    tone: Optional[str] = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    target_audience: Optional[str] = None
    budget: Optional[str] = None
    goal: Optional[str] = None
    tone: Optional[str] = None


class CampaignResponse(CampaignBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CampaignDetailResponse(CampaignResponse):
    output: Optional[CampaignOutputResponse] = None

    model_config = ConfigDict(from_attributes=True)
