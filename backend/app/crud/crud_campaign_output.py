from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.campaign_output import CampaignOutput
from app.schemas.campaign_output import CampaignOutputCreate, CampaignOutputUpdate


class CRUDCampaignOutput(CRUDBase[CampaignOutput, CampaignOutputCreate, CampaignOutputUpdate]):

    async def get_by_campaign_id(
        self, db: AsyncSession, *, campaign_id: UUID
    ) -> Optional[CampaignOutput]:
        result = await db.execute(
            select(CampaignOutput).where(CampaignOutput.campaign_id == campaign_id)
        )
        return result.scalars().first()

    async def upsert_output(
        self, db: AsyncSession, *, campaign_id: UUID, obj_in: CampaignOutputCreate
    ) -> CampaignOutput:
        existing = await self.get_by_campaign_id(db, campaign_id=campaign_id)
        if existing:
            return await self.update(db, db_obj=existing, obj_in=obj_in)
        else:
            return await self.create(db, obj_in=obj_in)


crud_campaign_output = CRUDCampaignOutput(CampaignOutput)
