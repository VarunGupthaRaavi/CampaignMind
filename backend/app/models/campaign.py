from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=True)
    target_audience = Column(Text, nullable=True)
    budget = Column(String, nullable=True)
    goal = Column(String, nullable=True)
    tone = Column(String, nullable=True)

    # Relationships
    user = relationship("User", back_populates="campaigns")
    output = relationship("CampaignOutput", back_populates="campaign", uselist=False, cascade="all, delete-orphan")
