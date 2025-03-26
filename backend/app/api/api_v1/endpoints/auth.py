from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.api.api_v1.endpoints.auth_dependencies import get_current_user, User
from app.models.permission import UserPermission
from app.services.supabase import supabase_service
from pydantic import BaseModel
import os
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    # Convert to integer timestamp to ensure compatibility
    # JWT standard expects exp to be seconds since epoch as an integer
    to_encode.update({"exp": int(expire.timestamp())})
    
    # Use a default value for SUPABASE_JWT_SECRET if it's not set
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "your_jwt_secret")
    encoded_jwt = jwt.encode(to_encode, jwt_secret, algorithm="HS256")
    
    # Print debug information
    print(f"Token created with payload: {to_encode}")
    return encoded_jwt

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Endpoint per ottenere un token JWT."""
    try:
        # Per ora, simuliamo l'autenticazione con i dati forniti dall'utente
        # In un'implementazione reale, dovresti verificare le credenziali con Supabase
        
        # Print the received credentials for debugging
        print(f"Received login attempt for username: {form_data.username}")
        
        # Verifica se le credenziali corrispondono a quelle fornite
        if form_data.username == "bandigare@gmail.com" and form_data.password == "Wolfgang-75":
            # Crea un token JWT
            access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")))
            
            # Use a UUID string format for the user ID to match what get_current_user expects
            user_id = "00000000-0000-0000-0000-000000000000"
            
            access_token = create_access_token(
                data={"sub": user_id},
                expires_delta=access_token_expires
            )
            
            print(f"Login successful for user: {form_data.username}")
            return {"access_token": access_token, "token_type": "bearer"}
        else:
            print(f"Login failed for user: {form_data.username}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Recupera informazioni sull'utente corrente."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "roles": current_user.roles
    }

@router.get("/me/permissions", response_model=List[UserPermission])
async def get_current_user_permissions(current_user: User = Depends(get_current_user)):
    """Recupera i permessi dell'utente corrente."""
    return current_user.permissions

@router.get("/me/has-permission/{permission_name}", response_model=Dict[str, bool])
async def check_user_permission(
    permission_name: str,
    restaurant_id: str = None,
    current_user: User = Depends(get_current_user)
):
    """Verifica se l'utente ha un permesso specifico."""
    # Permesso globale
    has_global_permission = any(
        p.permission_name == permission_name and p.restaurant_id is None
        for p in current_user.permissions
    )
    
    # Permesso specifico per ristorante
    has_restaurant_permission = False
    if restaurant_id:
        has_restaurant_permission = any(
            p.permission_name == permission_name and str(p.restaurant_id) == restaurant_id
            for p in current_user.permissions
        )
    
    return {
        "has_permission": has_global_permission or has_restaurant_permission
    }
