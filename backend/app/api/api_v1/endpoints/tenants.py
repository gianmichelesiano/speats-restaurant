from typing import List, Any
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends
from app.models.tenant import Tenant, TenantCreate, TenantUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Tenant])
async def read_tenants():
    """
    Retrieve all tenants.
    """
    try:
        response = supabase_service.get_tenants()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{tenant_id}", response_model=Tenant)
async def read_tenant(tenant_id: UUID):
    """
    Retrieve a specific tenant by ID.
    """
    try:
        response = supabase_service.get_tenant(str(tenant_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Tenant not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Tenant)
async def create_tenant(tenant: TenantCreate):
    """
    Create a new tenant.
    """
    try:
        response = supabase_service.create_tenant(tenant.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create tenant")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{tenant_id}", response_model=Tenant)
async def update_tenant(tenant_id: UUID, tenant: TenantUpdate):
    """
    Update a tenant.
    """
    try:
        # Check if tenant exists
        check_response = supabase_service.get_tenant(str(tenant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        # Update tenant
        response = supabase_service.update_tenant(str(tenant_id), tenant.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{tenant_id}")
async def delete_tenant(tenant_id: UUID):
    """
    Delete a tenant.
    """
    try:
        # Check if tenant exists
        check_response = supabase_service.get_tenant(str(tenant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Tenant not found")
        
        # Delete tenant
        supabase_service.delete_tenant(str(tenant_id))
        return {"message": "Tenant deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
