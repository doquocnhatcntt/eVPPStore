from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "pos-backend"
    APP_ENV: str = "dev"
    DATABASE_URL: str
    CORS_ORIGINS: str = "http://localhost:5173"

    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    class Config:
        env_file = ".env"

settings = Settings()
