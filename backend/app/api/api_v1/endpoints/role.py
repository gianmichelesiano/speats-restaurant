from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Depends, Path, Body
from app.models.role import Role, RoleCreate, RoleUpdate
from app.models.permission import Permission
from app.services.supabase import supabase_service
from app.api.api_v1.endpoints.auth_dependencies import get_current_user, has_permission, has_role, User
router = APIRouter()

@router.get("/", response_model=List[Role])
async def read_roles(
    current_user: User = Depends(has_permission("view_roles"))
):
    """Recupera tutti i ruoli."""
    try:
        response = supabase_service.get_table("roles").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{role_id}", response_model=Role)
async def read_role(
    role_id: UUID,
    current_user: User = Depends(has_permission("view_roles"))
):
    """Recupera un ruolo specifico."""
    try:
        response = supabase_service.get_table("roles").select("*").eq("id", str(role_id)).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Role not found")
            
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Role, status_code=201)
async def create_role(
    role: RoleCreate,
    current_user: User = Depends(has_permission("create_role"))
):
    """Crea un nuovo ruolo."""
    try:
        response = supabase_service.get_table("roles").insert(role.dict()).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{role_id}", response_model=Role)
async def update_role(
    role_id: UUID,
    role: RoleUpdate,
    current_user: User = Depends(has_permission("edit_role"))
):
    """Aggiorna un ruolo esistente."""
    try:
        # Filtra i campi non nulli per l'aggiornamento
        update_data = {k: v for k, v in role.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        response = supabase_service.get_table("roles").update(update_data).eq("id", str(role_id)).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Role not found")
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{role_id}", status_code=204)
async def delete_role(
    role_id: UUID,
    current_user: User = Depends(has_permission("delete_role"))
):
    """Elimina un ruolo."""
    try:
        response = supabase_service.get_table("roles").delete().eq("id", str(role_id)).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Role not found")
            
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{role_id}/permissions", response_model=List[Permission])
async def read_role_permissions(
    role_id: UUID,
    current_user: User = Depends(has_permission("view_permissions"))
):
    """Recupera tutti i permessi associati a un ruolo."""
    try:
        response = supabase_service.get_table("role_permissions") \
            .select("permissions(*)") \
            .eq("role_id", str(role_id)) \
            .execute()
            
        # Estrae i permessi dalla risposta annidata
        permissions = [item["permissions"] for item in response.data]
        
        return permissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{role_id}/permissions/{permission_id}", status_code=201)
async def assign_permission_to_role(
    role_id: UUID,
    permission_id: UUID,
    current_user: User = Depends(has_permission("edit_role"))
):
    """Assegna un permesso a un ruolo."""
    try:
        # Verifica se l'assegnazione esiste già
        check = supabase_service.get_table("role_permissions") \
            .select("*") \
            .eq("role_id", str(role_id)) \
            .eq("permission_id", str(permission_id)) \
            .execute()
        
        if check.data and len(check.data) > 0:
            raise HTTPException(status_code=400, detail="Permission already assigned to role")
        
        # Assegna il permesso
        response = supabase_service.get_table("role_permissions").insert({
            "role_id": str(role_id),
            "permission_id": str(permission_id)
        }).execute()
        
        return {"message": "Permission assigned successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{role_id}/permissions/{permission_id}", status_code=204)
async def remove_permission_from_role(
    role_id: UUID,
    permission_id: UUID,
    current_user: User = Depends(has_permission("edit_role"))
):
    """Rimuove un permesso da un ruolo."""
    try:
        response = supabase_service.get_table("role_permissions") \
            .delete() \
            .eq("role_id", str(role_id)) \
            .eq("permission_id", str(permission_id)) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Permission not assigned to role")
            
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
