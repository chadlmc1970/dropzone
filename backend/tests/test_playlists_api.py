# backend/tests/test_playlists_api.py
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.app.main import app
from backend.app.db.models import User
from backend.app.api.auth import create_access_token
from backend.app.db.session import get_db

client = TestClient(app)


@pytest.fixture
def auth_headers(test_db):
    """Create authenticated user and return auth headers"""
    # Override the get_db dependency
    def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    user = User(
        auth0_id="auth0|test123",
        email="test@example.com",
        display_name="Test DJ",
        spotify_id="spotify_user_123"
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)

    token = create_access_token(user.id, user.auth0_id, user.email)

    yield {"Authorization": f"Bearer {token}"}

    # Clean up
    app.dependency_overrides.clear()



@patch('backend.app.api.playlists.spotify_service')
def test_get_playlists_returns_user_playlists(mock_spotify_service, auth_headers):
    """Test GET /api/playlists returns user's Spotify playlists"""
    # Mock Spotify API response
    mock_playlists = [
        {
            "id": "playlist1",
            "name": "Summer Mix",
            "description": "Best summer tracks",
            "tracks": {"total": 25},
            "images": [{"url": "https://image.url/1.jpg"}],
            "owner": {"display_name": "Test DJ"}
        },
        {
            "id": "playlist2",
            "name": "Workout Bangers",
            "description": "High energy workout music",
            "tracks": {"total": 40},
            "images": [{"url": "https://image.url/2.jpg"}],
            "owner": {"display_name": "Test DJ"}
        }
    ]

    mock_spotify_service.get_user_playlists.return_value = mock_playlists

    response = client.get("/api/playlists", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == "playlist1"
    assert data[0]["name"] == "Summer Mix"
    assert data[0]["track_count"] == 25


def test_get_playlists_requires_authentication():
    """Test GET /api/playlists requires authentication"""
    response = client.get("/api/playlists")
    assert response.status_code == 401  # Unauthorized


@patch('backend.app.api.playlists.spotify_service')
def test_get_playlist_by_id_returns_playlist_details(mock_spotify_service, auth_headers):
    """Test GET /api/playlists/{id} returns playlist with tracks"""
    mock_playlist = {
        "id": "playlist1",
        "name": "Summer Mix",
        "description": "Best summer tracks",
        "tracks": {
            "total": 2,
            "items": [
                {
                    "track": {
                        "id": "track1",
                        "name": "Summer Days",
                        "artists": [{"name": "DJ Cool"}],
                        "album": {"name": "Summer Hits"},
                        "duration_ms": 240000,
                        "uri": "spotify:track:track1"
                    }
                },
                {
                    "track": {
                        "id": "track2",
                        "name": "Beach Vibes",
                        "artists": [{"name": "Wave Rider"}],
                        "album": {"name": "Ocean Mix"},
                        "duration_ms": 180000,
                        "uri": "spotify:track:track2"
                    }
                }
            ]
        },
        "images": [{"url": "https://image.url/1.jpg"}],
        "owner": {"display_name": "Test DJ"}
    }

    mock_spotify_service.get_playlist.return_value = mock_playlist

    response = client.get("/api/playlists/playlist1", headers=auth_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "playlist1"
    assert data["name"] == "Summer Mix"
    assert len(data["tracks"]) == 2
    assert data["tracks"][0]["name"] == "Summer Days"


@patch('backend.app.api.playlists.spotify_service')
def test_create_playlist_creates_new_playlist(mock_spotify_service, auth_headers):
    """Test POST /api/playlists creates new Spotify playlist"""
    mock_created_playlist = {
        "id": "new_playlist_123",
        "name": "My New Mix",
        "description": "Created via DropZone",
        "tracks": {"total": 0},
        "images": [],
        "owner": {"display_name": "Test DJ"}
    }

    mock_spotify_service.create_playlist.return_value = mock_created_playlist

    payload = {
        "name": "My New Mix",
        "description": "Created via DropZone",
        "public": True
    }

    response = client.post("/api/playlists", json=payload, headers=auth_headers)

    assert response.status_code == 201
    data = response.json()
    assert data["id"] == "new_playlist_123"
    assert data["name"] == "My New Mix"


def test_create_playlist_requires_authentication():
    """Test POST /api/playlists requires authentication"""
    payload = {"name": "Test Playlist"}
    response = client.post("/api/playlists", json=payload)
    assert response.status_code == 401
