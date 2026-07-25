import os
import uuid
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

logger = logging.getLogger(__name__)


async def seed_admin_user(db: AsyncSession) -> None:
    """
    Automated seed function that provisions an Administrator account.
    Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
    """
    admin_email = os.getenv("ADMIN_EMAIL", "admin@campaignmind.com")
    admin_name = os.getenv("ADMIN_NAME", "System Administrator")

    if not admin_email:
        logger.info("ADMIN_EMAIL not set. Skipping admin user seed.")
        return

    try:
        result = await db.execute(select(User).where(User.email == admin_email))
        admin_user = result.scalars().first()

        if admin_user:
            if admin_user.role != "admin":
                admin_user.role = "admin"
                db.add(admin_user)
                await db.commit()
                logger.info(f"Updated user '{admin_email}' role to 'admin'.")
            else:
                logger.info(f"Admin account '{admin_email}' already exists with admin role.")
        else:
            new_admin = User(
                supabase_uid=f"admin-seed-{uuid.uuid4()}",
                email=admin_email,
                full_name=admin_name,
                company_name="CampaignMind Enterprise",
                role="admin",
                is_active=True,
            )
            db.add(new_admin)
            await db.commit()
            logger.info(f"Successfully created initial admin account '{admin_email}' with role='admin'.")
    except Exception as e:
        logger.error(f"Error seeding admin user: {str(e)}")
        await db.rollback()
