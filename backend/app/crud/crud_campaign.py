from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.crud.base import CRUDBase
from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate, CampaignUpdate


class CRUDCampaign(CRUDBase[Campaign, CampaignCreate, CampaignUpdate]):

    async def get_by_user_id(
        self, db: AsyncSession, *, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Campaign]:
        result = await db.execute(
            select(Campaign)
            .where(Campaign.user_id == user_id)
            .order_by(Campaign.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_with_output(self, db: AsyncSession, *, id: UUID) -> Optional[Campaign]:
        result = await db.execute(
            select(Campaign)
            .options(selectinload(Campaign.output))
            .where(Campaign.id == id)
        )
        return result.scalars().first()

    async def create_with_owner(
        self, db: AsyncSession, *, obj_in: CampaignCreate, user_id: UUID
    ) -> Campaign:
        obj_in_data = obj_in.model_dump()
        db_obj = Campaign(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj


crud_campaign = CRUDCampaign(Campaign)
