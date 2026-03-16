# backend/app/db/models.py
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, DECIMAL, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    auth0_id = Column(String(255), unique=True, nullable=False, index=True)
    spotify_id = Column(String(255), unique=True)
    email = Column(String(255), nullable=False)
    display_name = Column(String(255))
    spotify_access_token = Column(Text)
    spotify_refresh_token = Column(Text)
    token_expires_at = Column(TIMESTAMP)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    mixes = relationship("Mix", back_populates="user", cascade="all, delete-orphan")
    presets = relationship("Preset", back_populates="user", cascade="all, delete-orphan")
    autopilot_sessions = relationship("AutopilotSession", back_populates="user", cascade="all, delete-orphan")

class Mix(Base):
    __tablename__ = "mixes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    track_1_uri = Column(String(255), nullable=False)
    track_2_uri = Column(String(255), nullable=False)
    transition_type = Column(String(50), nullable=False)  # 'club_beat', 'hip_hop_flow', etc.
    transition_point = Column(Integer)  # Beat number
    settings = Column(JSON)  # EQ, effects, crossfader curve
    duration_seconds = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="mixes")

class Preset(Base):
    __tablename__ = "presets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    eq_high = Column(DECIMAL(3, 2))  # -1.0 to 1.0
    eq_mid = Column(DECIMAL(3, 2))
    eq_low = Column(DECIMAL(3, 2))
    filter_freq = Column(Integer)  # Hz
    filter_resonance = Column(DECIMAL(3, 2))
    reverb_mix = Column(DECIMAL(3, 2))
    delay_time = Column(Integer)  # milliseconds
    delay_feedback = Column(DECIMAL(3, 2))
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="presets")

class SpotifyCache(Base):
    __tablename__ = "spotify_cache"

    track_uri = Column(String(255), primary_key=True)
    track_name = Column(String(255))
    artist_name = Column(String(255))
    analysis_data = Column(JSON, nullable=False)  # Full Spotify Audio Analysis
    bpm = Column(Integer)
    key = Column(Integer)  # 0-11
    mode = Column(Integer)  # 0=minor, 1=major
    energy = Column(DECIMAL(3, 2))
    danceability = Column(DECIMAL(3, 2))
    valence = Column(DECIMAL(3, 2))
    duration_ms = Column(Integer)
    cached_at = Column(TIMESTAMP, server_default=func.now())

class AutopilotSession(Base):
    __tablename__ = "autopilot_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    genres = Column(JSON)  # ["house", "techno"]
    duration_minutes = Column(Integer)
    transition_style = Column(String(50))  # "smooth", "quick", "dynamic"
    tracks_played = Column(JSON)  # [{ track_uri, played_at, transition_used }]
    started_at = Column(TIMESTAMP, server_default=func.now())
    ended_at = Column(TIMESTAMP)
    status = Column(String(20), server_default="active")  # 'active', 'completed', 'stopped'

    # Relationships
    user = relationship("User", back_populates="autopilot_sessions")

# Create indexes
Index('idx_autopilot_status', AutopilotSession.status)
