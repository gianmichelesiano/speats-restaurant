from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from typing import List, Optional, Dict, Any
from uuid import UUID
from dotenv import load_dotenv
from jose import JWTError, jwt
from pydantic import BaseModel
from app.core.config import settings
import os

load_dotenv()

# Inizializzazione client Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# The tokenUrl should be the full path relative to the API base URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

class TokenData(BaseModel):
    sub: str
    exp: int

class UserPermission(BaseModel):
    permission_name: str
    resource: str
    action: str
    restaurant_id: Optional[UUID] = None

class User(BaseModel):
    id: UUID
    email: str
    roles: List[Dict[str, Any]] = []
    permissions: List[UserPermission] = []

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Stampa informazioni di debug sul token
    print(f"Received token: {token[:10]}...")
    
    # Stampa informazioni sul JWT secret
    jwt_secret = settings.SUPABASE_JWT_SECRET
    print(f"Using JWT secret: {jwt_secret[:5]}...")
    
    # Decodifica il token senza verificare l'audience
    try:
        # Decodifica il token senza verificare l'audience
        payload = jwt.decode(
            token, 
            jwt_secret, 
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}  # Disabilita la verifica dell'audience
        )
        
        # Estrai l'ID utente dal payload
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # Stampa informazioni di debug sul payload
        print(f"Decoded token payload: {payload}")
        
    except JWTError as e:
        print(f"JWT Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Per ora, restituiamo un utente fittizio con alcuni permessi
    # In un'implementazione reale, dovresti recuperare questi dati da Supabase
    
    # Crea alcuni ruoli di esempio
    roles = [
        {
            "id": "role-1",
            "name": "admin",
            "description": "Administrator",
            "restaurant_id": None
        },
        {
            "id": "role-2",
            "name": "manager",
            "description": "Restaurant Manager",
            "restaurant_id": "restaurant-1"
        }
    ]
    
    # Crea permessi per tutte le risorse dell'applicazione
    permissions = [
        # Permessi utenti
        UserPermission(
            permission_name="view_users",
            resource="users",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_user",
            resource="users",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_user",
            resource="users",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_user",
            resource="users",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi ruoli
        UserPermission(
            permission_name="view_roles",
            resource="roles",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_role",
            resource="roles",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_role",
            resource="roles",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_role",
            resource="roles",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi per i permessi stessi
        UserPermission(
            permission_name="view_permissions",
            resource="permissions",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_permission",
            resource="permissions",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_permission",
            resource="permissions",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_permission",
            resource="permissions",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi ristoranti
        UserPermission(
            permission_name="view_restaurants",
            resource="restaurants",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_restaurant",
            resource="restaurants",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_restaurant",
            resource="restaurants",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_restaurant",
            resource="restaurants",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi menu
        UserPermission(
            permission_name="view_menu_items",
            resource="menu_items",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_menu_item",
            resource="menu_items",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_menu_item",
            resource="menu_items",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_menu_item",
            resource="menu_items",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi prenotazioni
        UserPermission(
            permission_name="view_reservations",
            resource="reservations",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_reservation",
            resource="reservations",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_reservation",
            resource="reservations",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_reservation",
            resource="reservations",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi tavoli
        UserPermission(
            permission_name="view_tables",
            resource="tables",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_table",
            resource="tables",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_table",
            resource="tables",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_table",
            resource="tables",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi recensioni
        UserPermission(
            permission_name="view_reviews",
            resource="reviews",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_review",
            resource="reviews",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_review",
            resource="reviews",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_review",
            resource="reviews",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi clienti
        UserPermission(
            permission_name="view_customers",
            resource="customers",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_customer",
            resource="customers",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_customer",
            resource="customers",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_customer",
            resource="customers",
            action="delete",
            restaurant_id=None
        ),
        
        # Permessi tenant
        UserPermission(
            permission_name="view_tenants",
            resource="tenants",
            action="view",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="edit_tenant",
            resource="tenants",
            action="edit",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="create_tenant",
            resource="tenants",
            action="create",
            restaurant_id=None
        ),
        UserPermission(
            permission_name="delete_tenant",
            resource="tenants",
            action="delete",
            restaurant_id=None
        )
    ]
    
    return User(
        id=UUID("00000000-0000-0000-0000-000000000000"),
        email="bandigare@gmail.com",
        roles=roles,
        permissions=permissions
    )

def has_role(required_roles: List[str]):
    """
    Dependency per verificare se un utente ha almeno uno dei ruoli richiesti.
    """
    async def role_checker(current_user: User = Depends(get_current_user)):
        user_role_names = [role["name"] for role in current_user.roles]
        for role in required_roles:
            if role in user_role_names:
                return current_user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions: required role not found"
        )
    return role_checker

def has_restaurant_role(required_roles: List[str], restaurant_id_param: str = "restaurant_id"):
    """
    Dependency per verificare se un utente ha almeno uno dei ruoli richiesti
    per un ristorante specifico.
    """
    async def role_checker(
        current_user: User = Depends(get_current_user),
        **path_params
    ):
        restaurant_id = path_params.get(restaurant_id_param)
        if not restaurant_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing restaurant ID parameter: {restaurant_id_param}"
            )
        
        # Controlla ruoli globali
        global_roles = [
            role["name"] for role in current_user.roles 
            if role["restaurant_id"] is None
        ]
        
        # Controlla ruoli specifici per il ristorante
        restaurant_specific_roles = [
            role["name"] for role in current_user.roles 
            if role["restaurant_id"] == restaurant_id
        ]
        
        # Verifica se l'utente ha almeno uno dei ruoli richiesti
        for role in required_roles:
            if role in global_roles or role in restaurant_specific_roles:
                return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for this restaurant"
        )
    
    return role_checker

def has_permission(required_permission: str):
    """
    Dependency per verificare se un utente ha un permesso specifico.
    """
    async def permission_checker(current_user: User = Depends(get_current_user)):
        # Verifica permesso globale
        has_global_permission = any(
            p.permission_name == required_permission and p.restaurant_id is None
            for p in current_user.permissions
        )
        
        if has_global_permission:
            return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions: {required_permission} required"
        )
    
    return permission_checker

def has_restaurant_permission(required_permission: str, restaurant_id_param: str = "restaurant_id"):
    """
    Dependency per verificare se un utente ha un permesso per un ristorante specifico.
    """
    async def permission_checker(
        current_user: User = Depends(get_current_user),
        **path_params
    ):
        restaurant_id = path_params.get(restaurant_id_param)
        if not restaurant_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing restaurant ID parameter: {restaurant_id_param}"
            )
        
        # Verifica permesso globale
        has_global_permission = any(
            p.permission_name == required_permission and p.restaurant_id is None
            for p in current_user.permissions
        )
        
        # Verifica permesso specifico per ristorante
        has_specific_permission = any(
            p.permission_name == required_permission and str(p.restaurant_id) == restaurant_id
            for p in current_user.permissions
        )
        
        if has_global_permission or has_specific_permission:
            return current_user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Insufficient permissions for restaurant {restaurant_id}"
        )
    
    return permission_checker

class PermissionChecker:
    """
    Classe helper per verificare permessi all'interno delle funzioni.
    """
    def __init__(self, user: User):
        self.user = user
    
    def has_permission(self, permission_name: str, restaurant_id: Optional[UUID] = None) -> bool:
        """Verifica se l'utente ha un permesso specifico."""
        # Permesso globale
        global_permission = any(
            p.permission_name == permission_name and p.restaurant_id is None
            for p in self.user.permissions
        )
        
        # Permesso specifico per ristorante
        restaurant_specific_permission = False
        if restaurant_id:
            restaurant_specific_permission = any(
                p.permission_name == permission_name and p.restaurant_id == restaurant_id
                for p in self.user.permissions
            )
        
        return global_permission or restaurant_specific_permission
    
    def has_any_permission(self, permission_names: List[str], restaurant_id: Optional[UUID] = None) -> bool:
        """Verifica se l'utente ha almeno uno dei permessi specificati."""
        return any(self.has_permission(perm, restaurant_id) for perm in permission_names)
    
    def has_all_permissions(self, permission_names: List[str], restaurant_id: Optional[UUID] = None) -> bool:
        """Verifica se l'utente ha tutti i permessi specificati."""
        return all(self.has_permission(perm, restaurant_id) for perm in permission_names)

async def get_permission_checker(current_user: User = Depends(get_current_user)) -> PermissionChecker:
    """Dependency che fornisce un checker di permessi."""
    return PermissionChecker(current_user)
