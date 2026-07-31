from fastapi import Request
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from backend.services.logger import logger


async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(
        f"HTTP {exc.status_code} error on {request.method} {request.url.path} "
        f"- detail: {exc.detail}"
    )
    # Preserves FastAPI's default JSON response shape: {"detail": ...}
    return await http_exception_handler(request, exc)


async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(
        f"Validation error on {request.method} {request.url.path} "
        f"- errors: {exc.errors()}"
    )
    # Preserves FastAPI's default 422 response with full error detail
    return await request_validation_exception_handler(request, exc)