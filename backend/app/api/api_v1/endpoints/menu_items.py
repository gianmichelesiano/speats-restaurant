from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.menu_item import MenuItem, MenuItemCreate, MenuItemUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[MenuItem])
async def read_menu_items(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None),
    category: Optional[str] = Query(None)
):
    """
    Retrieve all menu items, optionally filtered by tenant_id, restaurant_id, and/or category.
    """
    try:
        response = supabase_service.get_menu_items(
            tenant_id=str(tenant_id) if tenant_id else None,
            restaurant_id=str(restaurant_id) if restaurant_id else None,
            category=category
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{menu_item_id}", response_model=MenuItem)
async def read_menu_item(menu_item_id: UUID):
    """
    Retrieve a specific menu item by ID.
    """
    try:
        response = supabase_service.get_menu_item(str(menu_item_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Menu item not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=MenuItem)
async def create_menu_item(menu_item: MenuItemCreate):
    """
    Create a new menu item.
    """
    try:
        response = supabase_service.create_menu_item(menu_item.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create menu item")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{menu_item_id}", response_model=MenuItem)
async def update_menu_item(menu_item_id: UUID, menu_item: MenuItemUpdate):
    """
    Update a menu item.
    """
    try:
        # Check if menu item exists
        check_response = supabase_service.get_menu_item(str(menu_item_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        # Update menu item
        response = supabase_service.update_menu_item(str(menu_item_id), menu_item.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{menu_item_id}")
async def delete_menu_item(menu_item_id: UUID):
    """
    Delete a menu item.
    """
    try:
        # Check if menu item exists
        check_response = supabase_service.get_menu_item(str(menu_item_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Menu item not found")
        
        # Delete menu item
        supabase_service.delete_menu_item(str(menu_item_id))
        return {"message": "Menu item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
