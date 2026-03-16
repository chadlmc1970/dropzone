# backend/app/services/spotify.py
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from typing import List, Dict, Any, Optional


class SpotifyService:
    """Service for interacting with Spotify API"""

    def __init__(self, client_id: str, client_secret: str):
        """Initialize Spotify service with credentials"""
        self.client_id = client_id
        self.client_secret = client_secret

        auth_manager = SpotifyClientCredentials(
            client_id=client_id,
            client_secret=client_secret
        )
        self.sp = spotipy.Spotify(auth_manager=auth_manager)

    def search_tracks(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Search for tracks on Spotify

        Args:
            query: Search query string
            limit: Maximum number of results (default 20)

        Returns:
            List of formatted track dictionaries
        """
        results = self.sp.search(q=query, type='track', limit=limit)
        tracks = results['tracks']['items']

        # Get audio features for all tracks
        track_ids = [track['id'] for track in tracks]
        audio_features = self.sp.audio_features(track_ids)

        # Format results
        formatted_tracks = []
        for track, features in zip(tracks, audio_features):
            formatted_track = self._format_track(track, features)
            formatted_tracks.append(formatted_track)

        return formatted_tracks

    def get_track(self, track_id: str) -> Dict[str, Any]:
        """
        Get detailed track information including audio features

        Args:
            track_id: Spotify track ID

        Returns:
            Formatted track dictionary
        """
        track = self.sp.track(track_id)
        features = self.sp.audio_features(track_id)[0]

        return self._format_track(track, features)

    def _format_track(self, track: Dict, features: Optional[Dict] = None) -> Dict[str, Any]:
        """Format track data into consistent schema"""
        formatted = {
            'id': track['id'],
            'name': track['name'],
            'artist': track['artists'][0]['name'] if track['artists'] else 'Unknown',
            'album': track['album']['name'],
            'duration_ms': track['duration_ms'],
            'preview_url': track.get('preview_url'),
            'spotify_uri': track['uri'],
        }

        # Add audio features if available
        if features:
            formatted.update({
                'bpm': round(features['tempo']) if features.get('tempo') else None,
                'key': features.get('key'),
                'energy': features.get('energy'),
                'danceability': features.get('danceability'),
            })

        return formatted
