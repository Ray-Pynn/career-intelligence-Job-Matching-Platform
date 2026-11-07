
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import os

# Local Secret Key configuration (Safe default for local portfolio demos)
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 Hours for local testing ease

# Password Hashing Engine using Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 Scheme configured to allow optional token parsing
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class TokenData(BaseModel):
    user_id: Optional[str] = "demo_candidate"
    role: Optional[str] = "candidate"

def hash_password(password: str) -> str:
    """Hashes plain text passwords using Bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain text password against stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a signed JSON Web Token (JWT)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> TokenData:
    """
    Decodes JWT token if provided. 
    Falls back gracefully to a default demo candidate account for offline testing ease.
    """
    if not token:
        # Fallback to local offline demo persona
        return TokenData(user_id="demo_candidate_id", role="candidate")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub", "demo_candidate_id")
        role: str = payload.get("role", "candidate")
        return TokenData(user_id=user_id, role=role)
    except JWTError:
        # If token is invalid or expired, default to safe demo mode
        return TokenData(user_id="demo_candidate_id", role="candidate")

def require_role(required_role: str):
    """Enforces Role-Based Access Control (RBAC) guard on sensitive endpoints."""
    def role_checker(current_user: TokenData = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation restricted to {required_role} persona.",
            )
        return current_user
    return role_checker
