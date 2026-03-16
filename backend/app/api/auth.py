# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt, JWTError

from backend.app.db.session import get_db
from backend.app.db.models import User
from backend.app.services.auth0 import Auth0Service
from backend.app.config import get_settings

settings = get_settings()
router = APIRouter()
security = HTTPBearer()

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


def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    token: str | None = None
) -> User:
    """
    JWT middleware dependency to extract and validate current user from token.
    Used to protect endpoints that require authentication.

    Args:
        db: Database session
        credentials: HTTP Authorization header (injected by FastAPI)
        token: Optional direct token param (for testing only)
    """
    # Handle both direct token param (for testing) and credentials from header
    jwt_token = token if token is not None else (credentials.credentials if credentials else None)

    if not jwt_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        # Decode JWT token
        payload = jwt.decode(jwt_token, settings.secret_key, algorithms=["HS256"])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"}
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Get user from database
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user


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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user.
    Protected by JWT authentication middleware.
    """
    return UserResponse(
        id=current_user.id,
        auth0_id=current_user.auth0_id,
        email=current_user.email,
        display_name=current_user.display_name,
        spotify_id=current_user.spotify_id
    )

@router.post("/logout")
def logout():
    """
    Logout endpoint.
    Client-side should clear JWT token.
    """
    return {"message": "Logged out successfully"}
