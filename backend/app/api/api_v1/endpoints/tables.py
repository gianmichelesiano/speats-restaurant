from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.table import Table, TableCreate, TableUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Table])
async def read_tables(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None)
):
    """
    Retrieve all tables, optionally filtered by tenant_id and/or restaurant_id.
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
async def read_table(table_id: UUID):
    """
    Retrieve a specific table by ID.
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
async def create_table(table: TableCreate):
    """
    Create a new table.
    """
    try:
        response = supabase_service.create_table(table.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create table")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{table_id}", response_model=Table)
async def update_table(table_id: UUID, table: TableUpdate):
    """
    Update a table.
    """
    try:
        # Check if table exists
        check_response = supabase_service.get_table_by_id(str(table_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Update table
        response = supabase_service.update_table(str(table_id), table.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{table_id}")
async def delete_table(table_id: UUID):
    """
    Delete a table.
    """
    try:
        # Check if table exists
        check_response = supabase_service.get_table_by_id(str(table_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Table not found")
        
        # Delete table
        supabase_service.delete_table(str(table_id))
        return {"message": "Table deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
