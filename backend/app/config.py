# backend/app/config.py
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache
from pathlib import Path

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=Path(__file__).parent.parent / ".env"
    )

    # Database
    database_url: str

    # Spotify
    spotify_client_id: str
    spotify_client_secret: str
    spotify_redirect_uri: str

    # Auth0
    auth0_domain: str
    auth0_client_id: str
    auth0_client_secret: str
    auth0_audience: str

    # App
    frontend_url: str
    secret_key: str
    cors_origins: str

@lru_cache()
def get_settings():
    return Settings()
