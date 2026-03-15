# backend/tests/test_models.py
from backend.app.db.models import User, Mix, Preset, SpotifyCache, AutopilotSession

def test_user_model_creation(test_db):
    user = User(
        auth0_id="auth0|123",
        spotify_id="spotify123",
        email="test@example.com",
        display_name="Test User"
    )
    test_db.add(user)
    test_db.commit()

    assert user.id is not None
    assert user.email == "test@example.com"

def test_mix_model_creation(test_db):
    user = User(auth0_id="auth0|123", email="test@example.com")
    test_db.add(user)
    test_db.commit()

    mix = Mix(
        user_id=user.id,
        name="Test Mix",
        track_1_uri="spotify:track:123",
        track_2_uri="spotify:track:456",
        transition_type="club_beat",
        transition_point=16,
        settings={"eq": {"high": 0.5, "mid": 0, "low": -0.5}}
    )
    test_db.add(mix)
    test_db.commit()

    assert mix.id is not None
    assert mix.name == "Test Mix"
