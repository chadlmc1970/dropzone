# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt

from backend.app.db.session import get_db
from backend.app.db.models import User
from backend.app.services.auth0 import Auth0Service
from backend.app.config import get_settings

settings = get_settings()
router = APIRouter()

# Initialize Auth0 service
auth0_service = Auth0Service(
    domain=settings.auth0_domain,
    client_id=settings.auth0_client_id,
    client_secret=settings.auth0_client_secret,
    audience=settings.auth0_audience
)

# Pydantic models
class AuthCallbackRequest(BaseModel):
    access_token: str

class UserResponse(BaseModel):
    id: int
    auth0_id: str
    email: str
    display_name: str | None = None
    spotify_id: str | None = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

def create_access_token(user_id: int, auth0_id: str, email: str) -> str:
    """Create JWT access token for user"""
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode = {
        "sub": str(user_id),
        "auth0_id": auth0_id,
        "email": email,
        "exp": expire
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm="HS256")

@router.post("/callback", response_model=AuthResponse)
def auth_callback(
    payload: AuthCallbackRequest,
    db: Session = Depends(get_db)
):
    """
    Handle Auth0 callback after user authentication.
    Creates or updates user in database and returns JWT token.
    """
    try:
        # Verify Auth0 token
        claims = auth0_service.verify_token(payload.access_token)
        auth0_id = claims.get("sub")
        email = claims.get("email")

        if not auth0_id or not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token claims"
            )

        # Check if user exists
        user = db.query(User).filter(User.auth0_id == auth0_id).first()

        if not user:
            # Create new user
            user = User(
                auth0_id=auth0_id,
                email=email,
                display_name=claims.get("name") or email.split("@")[0]
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Create JWT token
        access_token = create_access_token(user.id, user.auth0_id, user.email)

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                auth0_id=user.auth0_id,
                email=user.email,
                display_name=user.display_name,
                spotify_id=user.spotify_id
            )
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_current_user_endpoint(
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user.
    TODO: Add JWT authentication dependency after Task 8
    """
    # Placeholder - will be protected by JWT middleware in Task 8
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Authentication middleware not yet implemented"
    )

@router.post("/logout")
def logout():
    """
    Logout endpoint.
    Client-side should clear JWT token.
    """
    return {"message": "Logged out successfully"}
