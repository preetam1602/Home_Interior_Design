from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.security import hash_password
from backend.crud.admin import create_admin, get_admin_by_username
from backend.models.admin import Admin
from backend.schemas.admin import AdminCreate


def register_admin(db: Session, admin: AdminCreate) -> Admin:
    """Create a new admin after checking for duplicate usernames."""
    existing_admin = get_admin_by_username(db, admin.username)
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    password_hashed = hash_password(admin.password)
    return create_admin(db, admin, password_hashed)
