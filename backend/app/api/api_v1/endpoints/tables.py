from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from app.models.table import Table, TableCreate, TableUpdate
from app.services.supabase import supabase_service
from app.api.api_v1.endpoints.auth_dependencies import (
    get_current_user, 
    has_permission, 
    has_restaurant_permission,
    User
)

router = APIRouter()

@router.get("/", response_model=List[Table])
async def read_tables(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None),
    current_user: User = Depends(has_permission("view_tables"))
):
    """
    Retrieve all tables, optionally filtered by tenant_id and/or restaurant_id.
    Requires 'view_tables' permission.
    """
    try:
        response = supabase_service.get_tables(
            tenant_id=str(tenant_id) if tenant_id else None,
            restaurant_id=str(restaurant_id) if restaurant_id else None
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{table_id}", response_model=Table)
async def read_table(
    table_id: UUID,
    current_user: User = Depends(has_permission("view_table_detail"))
):
    """
    Retrieve a specific table by ID.
    Requires 'view_table_detail' permission.
    """
    try:
        response = supabase_service.get_table_by_id(str(table_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Table)
async def create_table(
    table: TableCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Create a new table.
    Requires 'create_table' permission for the specific restaurant.
    """
    try:
        # Extract restaurant_id from the request body
        restaurant_id = str(table.restaurant_id)
        
        # Check if user has permission for this restaurant
        from app.api.api_v1.endpoints.auth_dependencies import PermissionChecker
        permission_checker = PermissionChecker(current_user)
        
        if not permission_checker.has_permission("create_table", restaurant_id=UUID(restaurant_id)):
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions to create a table for this restaurant"
            )
        
        # Create table
        response = supabase_service.create_table(table.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create table")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{table_id}", response_model=Table)
async def update_table(
    table_id: UUID, 
    table: TableUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    Update a table.
    Requires 'update_table' permission for the specific restaurant.
    """
    try:
        # Check if table exists
        check_response = supabase_service.get_table_by_id(str(table_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Get restaurant_id from the table for permission check
        existing_table = check_response.data[0]
        restaurant_id = existing_table.get("restaurant_id")
        
        # Check if user has permission for this restaurant
        from app.api.api_v1.endpoints.auth_dependencies import PermissionChecker
        permission_checker = PermissionChecker(current_user)
        
        if not permission_checker.has_permission("update_table", restaurant_id=UUID(restaurant_id)):
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions to update a table for this restaurant"
            )
        
        # Update table
        response = supabase_service.update_table(str(table_id), table.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{table_id}")
async def delete_table(
    table_id: UUID,
    current_user: User = Depends(get_current_user)
):
    """
    Delete a table.
    Requires 'delete_table' permission for the specific restaurant.
    """
    try:
        # Check if table exists
        check_response = supabase_service.get_table_by_id(str(table_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Get restaurant_id from the table for permission check
        existing_table = check_response.data[0]
        restaurant_id = existing_table.get("restaurant_id")
        
        # Check if user has permission for this restaurant
        from app.api.api_v1.endpoints.auth_dependencies import PermissionChecker
        permission_checker = PermissionChecker(current_user)
        
        if not permission_checker.has_permission("delete_table", restaurant_id=UUID(restaurant_id)):
            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions to delete a table for this restaurant"
            )
        
        # Delete table
        supabase_service.delete_table(str(table_id))
        return {"message": "Table deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
