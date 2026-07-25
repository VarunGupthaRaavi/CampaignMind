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
    ]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database (Supabase IPv4 Pooler Host default for Render compatibility)
    DATABASE_URL: str = "postgresql+asyncpg://postgres.jqqthrmlwgwydsrtyomv:AIproject%4016%24%2B@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

    @validator("DATABASE_URL", pre=True)
    def assemble_db_url(cls, v: str) -> str:
        if v:
            if v.startswith("postgresql://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql+asyncpg://", 1)
            return v
        return "postgresql+asyncpg://postgres.jqqthrmlwgwydsrtyomv:AIproject%4016%24%2B@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

    # Supabase Auth Secrets
    SUPABASE_URL: str = "https://jqqthrmlwgwydsrtyomv.supabase.co"
    SUPABASE_ANON_KEY: str = "mock-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "mock-service-key"
    SUPABASE_JWT_SECRET: str = "7df43c24-1766-4e6f-85eb-929dfafdb0fd"

    # AI Integration (Gemini 2.5 Flash)
    GEMINI_API_KEY: str = "mock-gemini-api-key"
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
