import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # AI consultant: any OpenAI-compatible chat completions API (defaults to Groq).
    # Env var names are case-insensitive, so LLM_key in .env maps to llm_key.
    llm_key: str | None = None
    llm_base_url: str = "https://api.groq.com/openai/v1"
    llm_model: str = "openai/gpt-oss-120b"

    # Video avatar (HeyGen LiveAvatar). Keys come from app.liveavatar.com/developers.
    # Sandbox sessions are free but limited to the demo avatar and ~1 minute.
    liveavatar_api_key: str | None = None
    liveavatar_base_url: str = "https://api.liveavatar.com"
    liveavatar_avatar_id: str = "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a"  # sandbox demo avatar
    liveavatar_voice_id: str | None = None  # None = the avatar's default voice
    liveavatar_sandbox: bool = True
    liveavatar_max_session_seconds: int = 300  # caps credit use per visitor session
    avatar_sessions_per_hour: int = 5  # per visitor IP; raise it while testing locally

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH) if ENV_PATH.exists() else ".env",
        extra="ignore"
    )

settings = Settings()
