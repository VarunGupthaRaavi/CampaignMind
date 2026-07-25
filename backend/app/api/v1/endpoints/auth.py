from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user, verify_supabase_jwt
from app.schemas.common import APIResponse
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import auth_service
from app.models.user import User

router = APIRouter()


class SyncUserRequest(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    company_name: Optional[str] = None


@router.get("/me", response_model=APIResponse[UserResponse])
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
) -> APIResponse[UserResponse]:
    """
    Retrieve authenticated current user profile from PostgreSQL.
    """
    return APIResponse(
        success=True,
        message="User profile retrieved successfully",
        data=UserResponse.model_validate(current_user)
    )


@router.post("/sync", response_model=APIResponse[UserResponse], status_code=status.HTTP_200_OK)
async def sync_supabase_user(
    body: Optional[SyncUserRequest] = None,
    jwt_payload: Dict[str, Any] = Depends(verify_supabase_jwt),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[UserResponse]:
    """
    Synchronize Supabase authenticated user into local PostgreSQL database.
    Called automatically on frontend signup/login.
    """
    supabase_uid = jwt_payload.get("sub")
    token_email = jwt_payload.get("email")
    user_metadata = jwt_payload.get("user_metadata", {})

    email = (body.email if body and body.email else None) or token_email or f"{supabase_uid}@user.supabase"
    full_name = (body.full_name if body and body.full_name else None) or user_metadata.get("full_name") or user_metadata.get("name")
    company_name = body.company_name if body else None

    synced_user = await auth_service.sync_user_record(
        db,
        supabase_uid=supabase_uid,
        email=email,
        full_name=full_name,
        company_name=company_name,
    )

    return APIResponse(
        success=True,
        message="User synchronized successfully",
        data=UserResponse.model_validate(synced_user)
    )


@router.patch("/me", response_model=APIResponse[UserResponse])
async def update_current_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> APIResponse[UserResponse]:
    """
    Update profile details for the authenticated user.
    """
    from app.crud.crud_user import crud_user
    updated_user = await crud_user.update(db, db_obj=current_user, obj_in=update_data)
    return APIResponse(
        success=True,
        message="Profile updated successfully",
        data=UserResponse.model_validate(updated_user)
    )
