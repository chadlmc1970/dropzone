# backend/app/services/spotify.py
from typing import List, Dict, Any

class SpotifyService:
    """Service for interacting with Spotify API"""

    def __init__(self, client_id: str, client_secret: str):
        """Initialize Spotify service with credentials"""
        self.client_id = client_id
        self.client_secret = client_secret

    def search_tracks(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Search for tracks on Spotify"""
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

    def _format_track(self, track: Dict, features: Dict = None) -> Dict[str, Any]:
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

    def get_user_playlists(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's Spotify playlists"""
        playlists = self.sp.current_user_playlists()
        return playlists['items']

    def get_playlist(self, playlist_id: str) -> Dict[str, Any]:
        """Get playlist details with tracks"""
        playlist = self.sp.playlist(playlist_id)
        return playlist

    def create_playlist(
        self,
        user_id: str,
        name: str,
        description: str = None,
        public: bool = True
    ) -> Dict[str, Any]:
        """Create new Spotify playlist for user"""
        playlist = self.sp.user_playlist_create(
            user_id,
            name,
            public=public,
            description=description
        )
        return playlist
