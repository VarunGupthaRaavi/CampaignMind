from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud_user import crud_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class AuthService:
    """
    Service for user authentication and Supabase database synchronization.
    """

    async def sync_user_record(
        self,
        db: AsyncSession,
        supabase_uid: str,
        email: str,
        full_name: Optional[str] = None,
        company_name: Optional[str] = None,
    ) -> User:
        """
        Synchronize Supabase authenticated user into local PostgreSQL database.
        Creates record if user does not exist, or updates missing details.
        """
        existing_user = await crud_user.get_by_supabase_uid(db, supabase_uid=supabase_uid)
        if existing_user:
            update_data: Dict[str, Any] = {}
            if email and existing_user.email != email:
                update_data["email"] = email
            if full_name and not existing_user.full_name:
                update_data["full_name"] = full_name
            if company_name and not existing_user.company_name:
                update_data["company_name"] = company_name

            if update_data:
                existing_user = await crud_user.update(
                    db, db_obj=existing_user, obj_in=update_data
                )
            return existing_user

        user_in = UserCreate(
            supabase_uid=supabase_uid,
            email=email,
            full_name=full_name,
            company_name=company_name,
        )
        return await crud_user.create(db, obj_in=user_in)

    async def get_user_by_supabase_uid(
        self, db: AsyncSession, supabase_uid: str
    ) -> Optional[User]:
        """Fetch user entity by Supabase UID."""
        return await crud_user.get_by_supabase_uid(db, supabase_uid=supabase_uid)


auth_service = AuthService()
