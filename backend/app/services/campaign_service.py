from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate


class CampaignService:
    """
    Service stub for Campaign management and data access.
    """

    async def get_user_campaigns(
        self, db: AsyncSession, user_id: str
    ) -> List[Campaign]:
        """Retrieve all marketing campaigns owned by a specific user."""
        pass

    async def get_campaign_by_id(
        self, db: AsyncSession, campaign_id: UUID, user_id: str
    ) -> Optional[Campaign]:
        """Fetch single campaign by ID ensuring user ownership."""
        pass

    async def create_campaign(
        self, db: AsyncSession, user_id: str, campaign_in: CampaignCreate
    ) -> Campaign:
        """Create new marketing campaign entity."""
        pass

    async def update_campaign(
        self, db: AsyncSession, campaign_id: UUID, user_id: str, campaign_in: CampaignUpdate
    ) -> Optional[Campaign]:
        """Update existing marketing campaign entity."""
        pass

    async def delete_campaign(
        self, db: AsyncSession, campaign_id: UUID, user_id: str
    ) -> bool:
        """Delete campaign by ID."""
        pass


campaign_service = CampaignService()
