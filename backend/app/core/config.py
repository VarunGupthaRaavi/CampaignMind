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
    DATABASE_URL: str = "postgresql+asyncpg://postgres.jqqthrmlwgwydsrtyomv:AIproject%4016%24%2B@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

    @validator("DATABASE_URL", pre=True)
    def assemble_db_url(cls, v: str) -> str:
        if not v:
            return "postgresql+asyncpg://postgres.jqqthrmlwgwydsrtyomv:AIproject%4016%24%2B@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

        v_str = str(v).strip().strip("'").strip('"')

        # Convert standard postgresql:// or postgres:// to postgresql+asyncpg://
        if v_str.startswith("postgresql://"):
            v_str = v_str.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif v_str.startswith("postgres://"):
            v_str = v_str.replace("postgres://", "postgresql+asyncpg://", 1)

        # Fix empty port strings e.g. ":/postgres"
        if ":/" in v_str:
            v_str = v_str.replace(":/", ":5432/", 1)

        # Sanitize unescaped password special characters
        if "AIproject@16$+" in v_str:
            v_str = v_str.replace("AIproject@16$+", "AIproject%4016%24%2B")

        # Map IPv6 Supabase direct host to IPv4 pooler host for Render compatibility
        if "db.jqqthrmlwgwydsrtyomv.supabase.co:5432" in v_str:
            v_str = v_str.replace("db.jqqthrmlwgwydsrtyomv.supabase.co:5432", "aws-0-ap-northeast-1.pooler.supabase.com:6543")

        return v_str

    # Supabase Auth Secrets
    SUPABASE_URL: str = "https://jqqthrmlwgwydsrtyomv.supabase.co"
    SUPABASE_ANON_KEY: str = "your-supabase-anon-key-here"
    SUPABASE_SERVICE_ROLE_KEY: str = "your-supabase-service-role-key-here"
    SUPABASE_JWT_SECRET: str = "7df43c24-1766-4e6f-85eb-929dfafdb0fd"

    # AI Integration (Gemini 2.5 Flash)
    GEMINI_API_KEY: str = "your-gemini-api-key-here"
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
