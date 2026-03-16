# backend/tests/test_spotify_service.py
import pytest
from backend.app.services.spotify import SpotifyService

def test_spotify_service_initialization():
    """Test that SpotifyService can be initialized with valid credentials"""
    service = SpotifyService(
        client_id="test_client_id",
        client_secret="test_client_secret"
    )

    assert service is not None
    assert service.client_id == "test_client_id"
    assert service.client_secret == "test_client_secret"
