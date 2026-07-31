"""Upload route — file upload endpoints."""
from fastapi import APIRouter

router = APIRouter(prefix="/upload", tags=["Upload"])

# TODO: Implement image upload endpoint for product images
# - Accept multipart file uploads
# - Validate file type and size (see core.constants.MAX_UPLOAD_SIZE_MB)
# - Store file and return URL
