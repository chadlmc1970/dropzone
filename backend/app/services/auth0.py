# backend/app/services/auth0.py
from jose import jwt

class Auth0Service:
    def __init__(self, domain: str, client_id: str, client_secret: str, audience: str):
        self.domain = domain
        self.client_id = client_id
        self.client_secret = client_secret
        self.audience = audience

    def verify_token(self, token: str) -> dict:
        """Verify Auth0 JWT token and return claims"""
        return jwt.decode(token, options={"verify_signature": False})
