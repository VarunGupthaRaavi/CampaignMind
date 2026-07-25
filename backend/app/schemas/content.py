from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class ContentAssetSchema(BaseModel):
    id: UUID
    asset_type: str
    url: Optional[str] = None
    prompt_text: Optional[str] = None

    class Config:
        from_attributes = True


class ContentPieceBase(BaseModel):
    channel: str
    title: str
    body: str
    call_to_action: Optional[str] = None
    metadata_info: Dict[str, Any] = {}


class ContentPieceCreate(ContentPieceBase):
    campaign_id: UUID


class ContentPieceResponse(ContentPieceBase):
    id: UUID
    campaign_id: UUID
    assets: List[ContentAssetSchema] = []
    created_at: datetime

    class Config:
        from_attributes = True
