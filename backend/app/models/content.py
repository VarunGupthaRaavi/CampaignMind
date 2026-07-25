from sqlalchemy import Column, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base


class ContentPiece(Base):
    __tablename__ = "content_pieces"

    campaign_id = Column(Base.id.type, ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String, nullable=False)  # e.g., 'email', 'linkedin', 'twitter', 'ad_copy'
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    call_to_action = Column(String, nullable=True)
    metadata_info = Column(JSON, default=dict)

    campaign = relationship("Campaign", back_populates="content_pieces")
    assets = relationship("ContentAsset", back_populates="content_piece", cascade="all, delete-orphan")


class ContentAsset(Base):
    __tablename__ = "content_assets"

    content_piece_id = Column(Base.id.type, ForeignKey("content_pieces.id", ondelete="CASCADE"), nullable=False)
    asset_type = Column(String, nullable=False)  # e.g., 'image_prompt', 'video_script', 'link'
    url = Column(String, nullable=True)
    prompt_text = Column(Text, nullable=True)

    content_piece = relationship("ContentPiece", back_populates="assets")
