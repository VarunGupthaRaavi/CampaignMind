from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CampaignMind Backend API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:AIproject%4016%24%2B@db.jqqthrmlwgwydsrtyomv.supabase.co:5432/postgres"

    # Supabase Auth Secrets
    SUPABASE_URL: str = "https://jqqthrmlwgwydsrtyomv.supabase.co"
    SUPABASE_ANON_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXRocm1sd2d3eWRzcnR5b212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NjgxOTYsImV4cCI6MjEwMDU0NDE5Nn0.1npvOz9btcxvYLFocI4jONxOhqAGW7up-iIIY443o2o"
    SUPABASE_SERVICE_ROLE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxcXRocm1sd2d3eWRzcnR5b212Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDk2ODE5NiwiZXhwIjoyMTAwNTQ0MTk2fQ.qxq1Z_W5wasFQlpaiEfplO87poph8FvDiR6p6hXT56w"
    SUPABASE_JWT_SECRET: str = "7df43c24-1766-4e6f-85eb-929dfafdb0fd"

    # AI Integration (Gemini 2.5 Flash)
    GEMINI_API_KEY: str = "[ENCRYPTION_KEY]"
    GEMINI_MODEL_NAME: str = "gemini-2.5-flash"

    # Security
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
