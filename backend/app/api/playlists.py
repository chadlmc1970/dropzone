# backend/app/api/playlists.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from backend.app.db.session import get_db
from backend.app.db.models import User
from backend.app.api.auth import get_current_user
from backend.app.services.spotify import SpotifyService
from backend.app.config import get_settings

settings = get_settings()
router = APIRouter()

# Initialize Spotify service
spotify_service = SpotifyService(
    client_id=settings.spotify_client_id,
    client_secret=settings.spotify_client_secret
)


# Pydantic models
class PlaylistTrack(BaseModel):
    id: str
    name: str
    artist: str
    album: str
    duration_ms: int
    spotify_uri: str


class PlaylistSummary(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    track_count: int
    image_url: Optional[str] = None
    owner_name: str


class PlaylistDetail(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    tracks: List[PlaylistTrack]
    image_url: Optional[str] = None
    owner_name: str


class CreatePlaylistRequest(BaseModel):
    name: str
    description: Optional[str] = None
    public: bool = True


@router.get("", response_model=List[PlaylistSummary])
def get_playlists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's Spotify playlists.
    Requires authentication.
    """
    if not current_user.spotify_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has not connected Spotify account"
        )

    try:
        playlists = spotify_service.get_user_playlists(current_user.spotify_id)

        # Format response
        formatted = []
        for playlist in playlists:
            formatted.append(PlaylistSummary(
                id=playlist["id"],
                name=playlist["name"],
                description=playlist.get("description"),
                track_count=playlist["tracks"]["total"],
                image_url=playlist["images"][0]["url"] if playlist.get("images") else None,
                owner_name=playlist["owner"]["display_name"]
            ))

        return formatted

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch playlists: {str(e)}"
        )


@router.get("/{playlist_id}", response_model=PlaylistDetail)
def get_playlist(
    playlist_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get playlist details with tracks.
    Requires authentication.
    """
    try:
        playlist = spotify_service.get_playlist(playlist_id)

        # Format tracks
        tracks = []
        for item in playlist["tracks"]["items"]:
            track = item["track"]
            tracks.append(PlaylistTrack(
                id=track["id"],
                name=track["name"],
                artist=track["artists"][0]["name"] if track["artists"] else "Unknown",
                album=track["album"]["name"],
                duration_ms=track["duration_ms"],
                spotify_uri=track["uri"]
            ))

        return PlaylistDetail(
            id=playlist["id"],
            name=playlist["name"],
            description=playlist.get("description"),
            tracks=tracks,
            image_url=playlist["images"][0]["url"] if playlist.get("images") else None,
            owner_name=playlist["owner"]["display_name"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch playlist: {str(e)}"
        )


@router.post("", response_model=PlaylistSummary, status_code=status.HTTP_201_CREATED)
def create_playlist(
    payload: CreatePlaylistRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create new Spotify playlist.
    Requires authentication.
    """
    if not current_user.spotify_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has not connected Spotify account"
        )

    try:
        playlist = spotify_service.create_playlist(
            user_id=current_user.spotify_id,
            name=payload.name,
            description=payload.description,
            public=payload.public
        )

        return PlaylistSummary(
            id=playlist["id"],
            name=playlist["name"],
            description=playlist.get("description"),
            track_count=playlist["tracks"]["total"],
            image_url=playlist["images"][0]["url"] if playlist.get("images") else None,
            owner_name=playlist["owner"]["display_name"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create playlist: {str(e)}"
        )
