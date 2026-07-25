from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class MetricResponse(BaseModel):
    id: UUID
    campaign_id: UUID
    channel: str
    impressions: int
    clicks: int
    conversions: int
    ctr: float
    spend: float
    created_at: datetime

    class Config:
        from_attributes = True
