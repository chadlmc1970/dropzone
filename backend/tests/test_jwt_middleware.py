# backend/tests/test_jwt_middleware.py
import pytest
from fastapi import HTTPException, status
from jose import jwt
from datetime import datetime, timedelta
from backend.app.api.auth import get_current_user
from backend.app.db.models import User
from backend.app.config import get_settings

settings = get_settings()


def test_get_current_user_with_valid_token(test_db):
    """Test get_current_user extracts user from valid JWT token"""
    # Create test user
    user = User(
        auth0_id="auth0|test123",
        email="test@example.com",
        display_name="Test User"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)

    # Create valid JWT token
    expire = datetime.utcnow() + timedelta(days=1)
    token_data = {
        "sub": str(user.id),
        "auth0_id": user.auth0_id,
        "email": user.email,
        "exp": expire
    }
    token = jwt.encode(token_data, settings.secret_key, algorithm="HS256")

    # Test get_current_user (pass token directly for testing)
    result = get_current_user(db=test_db, credentials=None, token=token)

    assert result.id == user.id
    assert result.email == user.email
    assert result.auth0_id == user.auth0_id


def test_get_current_user_with_expired_token(test_db):
    """Test get_current_user rejects expired JWT token"""
    # Create expired token
    expire = datetime.utcnow() - timedelta(days=1)  # Expired yesterday
    token_data = {
        "sub": "1",
        "auth0_id": "auth0|test123",
        "email": "test@example.com",
        "exp": expire
    }
    token = jwt.encode(token_data, settings.secret_key, algorithm="HS256")

    # Should raise HTTPException
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=test_db, credentials=None, token=token)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user_with_invalid_token(test_db):
    """Test get_current_user rejects invalid JWT token"""
    invalid_token = "invalid.jwt.token"

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=test_db, credentials=None, token=invalid_token)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user_with_nonexistent_user(test_db):
    """Test get_current_user rejects token for user that doesn't exist in DB"""
    # Create valid token but user doesn't exist in DB
    expire = datetime.utcnow() + timedelta(days=1)
    token_data = {
        "sub": "99999",  # User ID that doesn't exist
        "auth0_id": "auth0|nonexistent",
        "email": "nonexistent@example.com",
        "exp": expire
    }
    token = jwt.encode(token_data, settings.secret_key, algorithm="HS256")

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=test_db, credentials=None, token=token)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert "User not found" in str(exc_info.value.detail)


def test_get_current_user_missing_token(test_db):
    """Test get_current_user handles missing token"""
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=test_db, credentials=None, token=None)

    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
