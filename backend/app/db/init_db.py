from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import Base, engine


async def init_db(db: AsyncSession) -> None:
    """
    Initialize database schema tables for development.
    In production environments, Alembic migrations should be used.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
