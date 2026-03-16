# backend/tests/test_tracks_api.py
from fastapi.testclient import TestClient
from unittest.mock import Mock
from backend.app.main import app
from backend.app.api.tracks import get_spotify_service

client = TestClient(app)


def test_search_tracks_endpoint():
    """Test GET /api/tracks/search endpoint"""
    mock_service = Mock()
    mock_service.search_tracks.return_value = [
        {
            'id': '123',
            'name': 'Around the World',
            'artist': 'Daft Punk',
            'album': 'Homework',
            'duration_ms': 429080,
            'preview_url': 'https://preview.url',
            'spotify_uri': 'spotify:track:123',
            'bpm': 121,
            'key': 1,
            'energy': 0.82,
            'danceability': 0.76
        }
    ]

    # Override the dependency
    app.dependency_overrides[get_spotify_service] = lambda: mock_service

    response = client.get("/api/tracks/search?q=daft punk")

    assert response.status_code == 200
    data = response.json()
    assert 'tracks' in data
    assert len(data['tracks']) == 1
    assert data['tracks'][0]['name'] == 'Around the World'
    assert data['tracks'][0]['bpm'] == 121

    # Clean up
    app.dependency_overrides.clear()


def test_get_track_details_endpoint():
    """Test GET /api/tracks/{track_id} endpoint"""
    mock_service = Mock()
    mock_service.get_track.return_value = {
        'id': '123',
        'name': 'Around the World',
        'artist': 'Daft Punk',
        'album': 'Homework',
        'duration_ms': 429080,
        'preview_url': 'https://preview.url',
        'spotify_uri': 'spotify:track:123',
        'bpm': 121,
        'key': 1,
        'energy': 0.82,
        'danceability': 0.76
    }

    # Override the dependency
    app.dependency_overrides[get_spotify_service] = lambda: mock_service

    response = client.get("/api/tracks/123")

    assert response.status_code == 200
    track = response.json()
    assert track['name'] == 'Around the World'
    assert track['bpm'] == 121
    assert track['energy'] == 0.82

    # Clean up
    app.dependency_overrides.clear()
