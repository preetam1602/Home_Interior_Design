from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.core.security import decode_access_token
from backend.crud.admin import get_admin_by_username

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    admin = get_admin_by_username(db, payload.get("sub"))
    if admin is None:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin