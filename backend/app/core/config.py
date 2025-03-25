from pydantic_settings import BaseSettings
from typing import Optional, List
import json
from pydantic import validator

class Settings(BaseSettings):
    # FastAPI Configuration
    PROJECT_NAME: str = "Restaurant API"
    VERSION: str = "0.1.0"
    DESCRIPTION: str = "FastAPI backend for Restaurant application"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "default_secret_key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        if isinstance(v, str):
            return json.loads(v)
        return v
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
