import time
from collections import defaultdict, deque

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.database import get_db
from backend.schemas.consultant import AvatarSessionResponse, ConsultantRequest, ConsultantResponse
from backend.services.avatar_service import create_session_token
from backend.services.llm_service import consult

router = APIRouter(prefix="/ai", tags=["AI Consultant"])


def rate_limiter(max_requests: int, window_seconds: int, message: str):
    """Per-client-IP limit for public endpoints that cost money (LLM tokens, avatar minutes).

    In-memory only: fine for a single server process, use Redis or similar if the API is scaled out.
    """
    requests_by_ip: dict[str, deque[float]] = defaultdict(deque)

    def check(request: Request) -> None:
        ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        timestamps = requests_by_ip[ip]
        while timestamps and now - timestamps[0] > window_seconds:
            timestamps.popleft()
        if len(timestamps) >= max_requests:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=message)
        timestamps.append(now)

    return check


consult_limit = rate_limiter(
    20, 600, "You've asked a lot of questions in a short time. Please wait a few minutes and try again."
)
avatar_limit = rate_limiter(
    settings.avatar_sessions_per_hour,
    3600,
    "The video consultant has been started several times recently. You can keep chatting by text.",
)


@router.post("/consult", response_model=ConsultantResponse, dependencies=[Depends(consult_limit)])
def consult_route(req: ConsultantRequest, db: Session = Depends(get_db)):
    return consult(db, req)


@router.get("/avatar/status")
def avatar_status_route():
    # Lets the frontend hide the video option entirely when no LiveAvatar key is configured.
    return {"enabled": bool(settings.liveavatar_api_key)}


@router.post("/avatar/session", response_model=AvatarSessionResponse, dependencies=[Depends(avatar_limit)])
def avatar_session_route():
    return create_session_token()
