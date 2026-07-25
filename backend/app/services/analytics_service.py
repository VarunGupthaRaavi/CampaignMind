from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.analytics import CampaignMetric


class AnalyticsService:
    """
    Service stub for Campaign Analytics & Performance Metrics.
    """

    async def get_campaign_metrics(
        self, db: AsyncSession, campaign_id: UUID, user_id: str
    ) -> List[CampaignMetric]:
        """Fetch aggregated or channel-wise performance metrics for a campaign."""
        pass


analytics_service = AnalyticsService()
