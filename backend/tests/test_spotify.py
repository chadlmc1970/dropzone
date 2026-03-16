# backend/tests/test_spotify.py
import pytest
from unittest.mock import Mock, patch
from backend.app.services.spotify import SpotifyService


def test_search_tracks_returns_formatted_results():
    """Test that search_tracks returns properly formatted track data"""
    with patch('backend.app.services.spotify.spotipy.Spotify') as mock_spotify_class:
        mock_sp = Mock()
        mock_spotify_class.return_value = mock_sp

        # Mock Spotify API response
        mock_sp.search.return_value = {
            'tracks': {
                'items': [
                    {
                        'id': '123',
                        'name': 'Around the World',
                        'artists': [{'name': 'Daft Punk'}],
                        'album': {'name': 'Homework'},
                        'uri': 'spotify:track:123',
                        'duration_ms': 429080,
                        'preview_url': 'https://preview.url'
                    }
                ]
            }
        }

        mock_sp.audio_features.return_value = [{
            'tempo': 121.0,
            'key': 1,
            'energy': 0.82,
            'danceability': 0.76
        }]

def test_search_tracks_returns_formatted_results():
    """Test that search_tracks returns properly formatted track data"""
    with patch('backend.app.services.spotify.spotipy.Spotify') as mock_spotify_class:
        mock_sp = Mock()
        mock_spotify_class.return_value = mock_sp

        # Mock Spotify API response
        mock_sp.search.return_value = {
            'tracks': {
                'items': [
                    {
                        'id': '123',
                        'name': 'Around the World',
                        'artists': [{'name': 'Daft Punk'}],
                        'album': {'name': 'Homework'},
                        'uri': 'spotify:track:123',
                        'duration_ms': 429080,
                        'preview_url': 'https://preview.url'
                    }
                ]
            }
        }

        mock_sp.audio_features.return_value = [{
            'tempo': 121.0,
            'key': 1,
            'energy': 0.82,
            'danceability': 0.76
        }]

        spotify_service = SpotifyService(
            client_id="test_client_id",
            client_secret="test_client_secret"
        )
        results = spotify_service.search_tracks("daft punk")

        assert len(results) == 1
        assert results[0]['name'] == 'Around the World'
        assert results[0]['artist'] == 'Daft Punk'
        assert results[0]['bpm'] == 121
        assert results[0]['energy'] == 0.82
        assert results[0]['spotify_uri'] == 'spotify:track:123'

def test_get_track_with_audio_features():
    """Test that get_track returns track with audio features"""
    with patch('backend.app.services.spotify.spotipy.Spotify') as mock_spotify_class:
        mock_sp = Mock()
        mock_spotify_class.return_value = mock_sp

        mock_sp.track.return_value = {
            'id': '123',
            'name': 'Around the World',
            'artists': [{'name': 'Daft Punk'}],
            'album': {'name': 'Homework'},
            'uri': 'spotify:track:123',
            'duration_ms': 429080,
            'preview_url': 'https://preview.url'
        }

        mock_sp.audio_features.return_value = [{
            'tempo': 121.0,
            'key': 1,
            'energy': 0.82,
            'danceability': 0.76
        }]

def test_get_track_with_audio_features():
    """Test that get_track returns track with audio features"""
    with patch('backend.app.services.spotify.spotipy.Spotify') as mock_spotify_class:
        mock_sp = Mock()
        mock_spotify_class.return_value = mock_sp

        mock_sp.track.return_value = {
            'id': '123',
            'name': 'Around the World',
            'artists': [{'name': 'Daft Punk'}],
            'album': {'name': 'Homework'},
            'uri': 'spotify:track:123',
            'duration_ms': 429080,
            'preview_url': 'https://preview.url'
        }

        mock_sp.audio_features.return_value = [{
            'tempo': 121.0,
            'key': 1,
            'energy': 0.82,
            'danceability': 0.76
        }]

        spotify_service = SpotifyService(
            client_id="test_client_id",
            client_secret="test_client_secret"
        )
        track = spotify_service.get_track('123')

        assert track['name'] == 'Around the World'
        assert track['bpm'] == 121
        assert track['energy'] == 0.82
