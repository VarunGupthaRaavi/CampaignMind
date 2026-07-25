from typing import List, Optional, Dict, Any, Union
from uuid import UUID
from pydantic import BaseModel, Field


class CampaignGenerationRequest(BaseModel):
    campaign_id: Optional[UUID] = None
    product_name: Optional[str] = "Product Launch"
    product_description: str = Field(..., description="Detailed description of product or service")
    industry: Optional[str] = "Technology & SaaS"
    target_audience: Optional[str] = "B2B Decision Makers"
    budget: Optional[str] = "$5,000 - $15,000 / month"
    goal: Optional[str] = "Lead Generation & Registrations"
    tone: Optional[str] = "Professional & Authoritative"
    target_channels: Optional[List[str]] = Field(default_factory=lambda: ["Google", "Facebook", "Instagram", "LinkedIn"])


class BudgetBreakdown(BaseModel):
    google: str = Field(default="35%", description="Google Ads budget share")
    facebook: str = Field(default="25%", description="Facebook Ads budget share")
    instagram: str = Field(default="20%", description="Instagram Ads budget share")
    linkedin: str = Field(default="20%", description="LinkedIn Ads budget share")


class CampaignGenerationResponse(BaseModel):
    buyer_persona: Union[str, Dict[str, Any]] = Field(..., description="Buyer persona description or breakdown")
    persona: Optional[Union[str, Dict[str, Any]]] = Field(default=None, description="Alias for buyer persona")
    marketing_strategy: Union[str, Dict[str, Any]] = Field(..., description="Core marketing strategy and messaging")
    google_ads: List[Any] = Field(default_factory=list, description="Google Ads list")
    facebook_ads: List[Any] = Field(default_factory=list, description="Facebook Ads list")
    instagram_ads: List[Any] = Field(default_factory=list, description="Instagram Ads list")
    linkedin_ads: List[Any] = Field(default_factory=list, description="LinkedIn Ads list")
    keywords: List[str] = Field(default_factory=list, description="SEO & PPC Keywords")
    hashtags: List[str] = Field(default_factory=list, description="Social Media Hashtags")
    budget_breakdown: Union[BudgetBreakdown, Dict[str, Any]] = Field(..., description="Budget breakdown across channels")
    status: str = Field(default="completed", description="Generation status")


class ContentRefinementRequest(BaseModel):
    channel: str
    current_text: str
    instructions: str
