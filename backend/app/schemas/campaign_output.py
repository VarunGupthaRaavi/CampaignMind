from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CampaignOutputBase(BaseModel):
    persona: Optional[Dict[str, Any]] = Field(default_factory=dict)
    marketing_strategy: Optional[Dict[str, Any]] = Field(default_factory=dict)
    google_ads: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    facebook_ads: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    instagram_ads: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    linkedin_ads: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    keywords: Optional[List[str]] = Field(default_factory=list)
    hashtags: Optional[List[str]] = Field(default_factory=list)
    budget_breakdown: Optional[Dict[str, Any]] = Field(default_factory=dict)
    status: Optional[str] = "draft"


class CampaignOutputCreate(CampaignOutputBase):
    campaign_id: UUID


class CampaignOutputUpdate(BaseModel):
    persona: Optional[Dict[str, Any]] = None
    marketing_strategy: Optional[Dict[str, Any]] = None
    google_ads: Optional[List[Dict[str, Any]]] = None
    facebook_ads: Optional[List[Dict[str, Any]]] = None
    instagram_ads: Optional[List[Dict[str, Any]]] = None
    linkedin_ads: Optional[List[Dict[str, Any]]] = None
    keywords: Optional[List[str]] = None
    hashtags: Optional[List[str]] = None
    budget_breakdown: Optional[Dict[str, Any]] = None
    status: Optional[str] = None


class CampaignOutputResponse(CampaignOutputBase):
    id: UUID
    campaign_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
