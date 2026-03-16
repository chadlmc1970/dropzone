# backend/tests/test_spotify_service.py
import pytest
from unittest.mock import Mock, patch
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


def test_search_tracks_returns_formatted_results():
    """Test that search_tracks returns properly formatted track data"""
    # Mock Spotify API client
    mock_sp = Mock()

    mock_sp.search.return_value = {
        'tracks': {
            'items': [
                {
                    'id': 'track123',
                    'name': 'Test Track',
                    'artists': [{'name': 'Test Artist'}],
                    'album': {'name': 'Test Album'},
                    'duration_ms': 180000,
                    'preview_url': 'https://preview.url',
                    'uri': 'spotify:track:track123'
                }
            ]
        }
    }

    mock_sp.audio_features.return_value = [
        {
            'tempo': 120.5,
            'key': 5,
            'energy': 0.8,
            'danceability': 0.7
        }
    ]

    service = SpotifyService(
        client_id="test_client_id",
        client_secret="test_client_secret"
    )
    service.sp = mock_sp  # Inject mock

    results = service.search_tracks("test query")

    assert len(results) == 1
    assert results[0]['id'] == 'track123'
    assert results[0]['name'] == 'Test Track'
    assert results[0]['artist'] == 'Test Artist'
    assert results[0]['bpm'] == 120  # rounded from 120.5
    assert results[0]['energy'] == 0.8
