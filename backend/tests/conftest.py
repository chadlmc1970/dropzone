# backend/tests/conftest.py
import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set test environment variables before importing any app code
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("SPOTIFY_CLIENT_ID", "test_client_id")
os.environ.setdefault("SPOTIFY_CLIENT_SECRET", "test_client_secret")
os.environ.setdefault("SPOTIFY_REDIRECT_URI", "http://localhost:3000/callback")
os.environ.setdefault("AUTH0_DOMAIN", "test.auth0.com")
os.environ.setdefault("AUTH0_CLIENT_ID", "test_auth0_client_id")
os.environ.setdefault("AUTH0_CLIENT_SECRET", "test_auth0_client_secret")
os.environ.setdefault("AUTH0_AUDIENCE", "test_audience")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")
os.environ.setdefault("SECRET_KEY", "test_secret_key")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")

from backend.app.db.models import Base

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
