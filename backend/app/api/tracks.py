# backend/app/api/tracks.py
from fastapi import APIRouter, Query, HTTPException, Depends
from backend.app.services.spotify import SpotifyService
from backend.app.config import get_settings
from typing import List, Dict, Any

router = APIRouter()


def get_spotify_service() -> SpotifyService:
    """Dependency to get Spotify service instance"""
    settings = get_settings()
    return SpotifyService(
        client_id=settings.spotify_client_id,
        client_secret=settings.spotify_client_secret
    )


@router.get("/search")
def search_tracks(
    q: str = Query(..., description="Search query"),
    spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """
    Search for tracks on Spotify

    Returns:
        List of tracks with audio features
    """
    try:
        tracks = spotify_service.search_tracks(q)
        return {"tracks": tracks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{track_id}")
def get_track(
    track_id: str,
    spotify_service: SpotifyService = Depends(get_spotify_service)
):
    """
    Get detailed track information including audio features

    Args:
        track_id: Spotify track ID

    Returns:
        Track with audio features
    """
    try:
        track = spotify_service.get_track(track_id)
        return track
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Track not found: {track_id}")
