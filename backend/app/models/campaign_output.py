from sqlalchemy import Column, String, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base


class CampaignOutput(Base):
    __tablename__ = "campaign_outputs"

    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    persona = Column(JSON, default=dict, nullable=True)
    marketing_strategy = Column(JSON, default=dict, nullable=True)
    google_ads = Column(JSON, default=list, nullable=True)
    facebook_ads = Column(JSON, default=list, nullable=True)
    instagram_ads = Column(JSON, default=list, nullable=True)
    linkedin_ads = Column(JSON, default=list, nullable=True)
    keywords = Column(JSON, default=list, nullable=True)
    hashtags = Column(JSON, default=list, nullable=True)
    budget_breakdown = Column(JSON, default=dict, nullable=True)
    status = Column(String, default="draft", nullable=False)

    # Relationships
    campaign = relationship("Campaign", back_populates="output")
