from typing import List, Optional, Dict, Any
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Path, Query
from pydantic import BaseModel
from datetime import datetime

from app.api.api_v1.endpoints.auth_dependencies import get_current_user, User, has_permission
from app.services.supabase import supabase_service

router = APIRouter()

class UserRoleBase(BaseModel):
    user_id: UUID
    role_id: UUID
    restaurant_id: Optional[UUID] = None

class UserRoleCreate(UserRoleBase):
    pass

class UserRole(UserRoleBase):
    id: UUID
    created_at: datetime
    
    class Config:
        orm_mode = True

@router.post("/", response_model=Dict[str, Any], status_code=201)
async def assign_role_to_user(
    user_role: UserRoleCreate,
    current_user: User = Depends(has_permission("edit_user"))
):
    """Assegna un ruolo a un utente."""
    try:
        # Prepara i dati da inserire
        data = {
            "user_id": str(user_role.user_id),
            "role_id": str(user_role.role_id)
        }
        
        if user_role.restaurant_id:
            data["restaurant_id"] = str(user_role.restaurant_id)
        
        # Inserisci il record
        response = supabase_service.get_table("user_roles").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=List[Dict[str, Any]])
async def get_user_roles(
    user_id: UUID,
    current_user: User = Depends(has_permission("view_users"))
):
    """Recupera tutti i ruoli di un utente."""
    try:
        response = supabase_service.get_table("user_roles") \
            .select("*, roles(name, description), restaurants(name)") \
            .eq("user_id", str(user_id)) \
            .execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/role/{role_id}", response_model=List[Dict[str, Any]])
async def get_users_with_role(
    role_id: UUID,
    restaurant_id: Optional[UUID] = Query(None),
    current_user: User = Depends(has_permission("view_users"))
):
    """Recupera tutti gli utenti con un determinato ruolo."""
    try:
        query = supabase_service.get_table("user_roles") \
            .select("*, users(id, email)") \
            .eq("role_id", str(role_id))
        
        if restaurant_id:
            query = query.eq("restaurant_id", str(restaurant_id))
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_role_id}", status_code=204)
async def remove_role_from_user(
    user_role_id: UUID,
    current_user: User = Depends(has_permission("edit_user"))
):
    """Rimuove un ruolo da un utente."""
    try:
        response = supabase_service.get_table("user_roles") \
            .delete() \
            .eq("id", str(user_role_id)) \
            .execute()
            
        if not response.data:
            raise HTTPException(status_code=404, detail="User role not found")
            
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
