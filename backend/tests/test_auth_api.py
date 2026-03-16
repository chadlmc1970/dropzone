# backend/tests/test_auth_api.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch, MagicMock
from backend.app.main import app
from backend.app.db.session import get_db
from backend.app.db.models import User

client = TestClient(app)

def test_auth_callback_creates_user_and_returns_token():
    """Test Auth0 callback creates new user and returns JWT"""
    # Mock database session
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None  # User doesn't exist

    # Mock db.add to assign an id, and db.refresh to be a no-op
    def mock_add(user):
        user.id = 1
    mock_db.add.side_effect = mock_add
    mock_db.refresh.side_effect = lambda user: None

    # Override the get_db dependency
    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with patch('backend.app.api.auth.auth0_service') as mock_auth0:
            # Mock Auth0 token verification
            mock_auth0.verify_token.return_value = {
                'sub': 'auth0|new_user_123',
                'email': 'newuser@example.com',
                'name': 'New User'
            }

            response = client.post(
                '/api/auth/callback',
                json={'access_token': 'auth0.jwt.token'}
            )

            assert response.status_code == 200
            data = response.json()
            assert 'access_token' in data
            assert data['token_type'] == 'bearer'
            assert data['user']['email'] == 'newuser@example.com'
            assert data['user']['auth0_id'] == 'auth0|new_user_123'
    finally:
        app.dependency_overrides.clear()

def test_auth_callback_returns_existing_user():
    """Test Auth0 callback returns existing user without creating new one"""
    mock_user = Mock()
    mock_user.id = 42
    mock_user.auth0_id = 'auth0|existing_123'
    mock_user.email = 'existing@example.com'
    mock_user.display_name = 'Existing DJ'
    mock_user.spotify_id = None

    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user

    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with patch('backend.app.api.auth.auth0_service') as mock_auth0:
            mock_auth0.verify_token.return_value = {
                'sub': 'auth0|existing_123',
                'email': 'existing@example.com',
                'name': 'Existing DJ'
            }

            response = client.post(
                '/api/auth/callback',
                json={'access_token': 'auth0.jwt.token'}
            )

            assert response.status_code == 200
            data = response.json()
            assert data['user']['id'] == 42
            assert data['user']['email'] == 'existing@example.com'
            # Should NOT have called db.add for existing user
            mock_db.add.assert_not_called()
    finally:
        app.dependency_overrides.clear()

def test_auth_callback_invalid_token():
    """Test Auth0 callback with invalid token returns 401"""
    mock_db = MagicMock()

    def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with patch('backend.app.api.auth.auth0_service') as mock_auth0:
            mock_auth0.verify_token.side_effect = Exception("Invalid token")

            response = client.post(
                '/api/auth/callback',
                json={'access_token': 'bad.token.here'}
            )

            assert response.status_code == 401
    finally:
        app.dependency_overrides.clear()

def test_logout():
    """Test logout endpoint"""
    response = client.post('/api/auth/logout')
    assert response.status_code == 200
    assert response.json()['message'] == 'Logged out successfully'
