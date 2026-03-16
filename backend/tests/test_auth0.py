# backend/tests/test_auth0.py
import pytest
from unittest.mock import Mock, patch
from backend.app.services.auth0 import Auth0Service

@pytest.fixture
def auth0_service():
    return Auth0Service(
        domain="test.auth0.com",
        client_id="test_client_id",
        client_secret="test_client_secret",
        audience="https://test-api.com"
    )

def test_verify_token_success(auth0_service):
    """Test successful token verification returns user claims"""
    with patch('jose.jwt.decode') as mock_decode:
        mock_decode.return_value = {
            'sub': 'auth0|123456',
            'email': 'user@example.com'
        }

        result = auth0_service.verify_token('valid.jwt.token')

        assert result['sub'] == 'auth0|123456'
        assert result['email'] == 'user@example.com'

def test_verify_token_invalid(auth0_service):
    """Test invalid token raises exception"""
    from jose import JWTError

    with patch('jose.jwt.decode') as mock_decode:
        mock_decode.side_effect = JWTError('Invalid token')

        with pytest.raises(Exception) as exc_info:
            auth0_service.verify_token('invalid.token')

        assert 'Invalid token' in str(exc_info.value)
