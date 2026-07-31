from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.core.security import create_access_token, hash_password
from backend.crud.admin import authenticate_user, create_admin, get_admin_by_username
from backend.database import get_db
from backend.schemas.admin import AdminCreate, AdminResponse
from backend.schemas.auth import LoginRequest, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AdminResponse)
def register(admin: AdminCreate, db: Session = Depends(get_db)):
    # Check for duplicate username
    existing = get_admin_by_username(db, admin.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    password_hashed = hash_password(admin.password)
    created_admin = create_admin(db, admin, password_hashed)
    return created_admin


@router.post("/login", response_model=Token)
def login(admin: LoginRequest, db: Session = Depends(get_db)):
    db_admin = authenticate_user(db, admin.username, admin.password)

    if not db_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    # Use username as subject so get_current_admin can look up by username
    access_token = create_access_token({"sub": db_admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

