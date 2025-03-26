from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Path
from app.models.permission import Permission, PermissionCreate, PermissionUpdate
from app.services.supabase import supabase_service
from app.api.api_v1.endpoints.auth_dependencies import get_current_user, has_permission, User

router = APIRouter()

@router.get("/", response_model=List[Permission])
async def read_permissions(
    current_user: User = Depends(has_permission("view_users"))
):
    """Recupera tutti i permessi."""
    try:
        response = supabase_service.get_table("permissions").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{permission_id}", response_model=Permission)
async def read_permission(
    permission_id: UUID,
    current_user: User = Depends(has_permission("view_users"))
):
    """Recupera un permesso specifico."""
    try:
        response = supabase_service.get_table("permissions").select("*").eq("id", str(permission_id)).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Permission not found")
            
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Permission, status_code=201)
async def create_permission(
    permission: PermissionCreate,
    current_user: User = Depends(has_permission("create_user"))
):
    """Crea un nuovo permesso."""
    try:
        response = supabase_service.get_table("permissions").insert(permission.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{permission_id}", response_model=Permission)
async def update_permission(
    permission_id: UUID,
    permission: PermissionUpdate,
    current_user: User = Depends(has_permission("edit_user"))
):
    """Aggiorna un permesso esistente."""
    try:
        # Filtra i campi non nulli per l'aggiornamento
        update_data = {k: v for k, v in permission.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase_service.get_table("permissions").update(update_data).eq("id", str(permission_id)).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Permission not found")
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{permission_id}", status_code=204)
async def delete_permission(
    permission_id: UUID,
    current_user: User = Depends(has_permission("delete_user"))
):
    """Elimina un permesso."""
    try:
        response = supabase_service.get_table("permissions").delete().eq("id", str(permission_id)).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Permission not found")
            
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
