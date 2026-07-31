from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.crud.admin import create_admin, get_admin_by_username, hash_password
from backend.models.admin import Admin
from backend.schemas.admin import AdminCreate


def create(db: Session, admin: AdminCreate) -> Admin:
      existing_admin = get_admin_by_username(db, admin.username)
      if existing_admin:
            raise HTTPException(
                  status_code=status.HTTP_400_BAD_REQUEST,
                  detail="Username already registered",
            )

      password_hash = hash_password(admin.password)
      return create_admin(db, admin, password_hash)
