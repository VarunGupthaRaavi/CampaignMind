from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base


class CampaignMetric(Base):
    __tablename__ = "campaign_metrics"

    campaign_id = Column(Base.id.type, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String, nullable=False)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    ctr = Column(Float, default=0.0)
    spend = Column(Float, default=0.0)

    campaign = relationship("Campaign", back_populates="metrics")
