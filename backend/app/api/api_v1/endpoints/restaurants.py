from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.restaurant import Restaurant, RestaurantCreate, RestaurantUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Restaurant])
async def read_restaurants(tenant_id: Optional[UUID] = Query(None)):
    """
    Retrieve all restaurants, optionally filtered by tenant_id.
    """
    try:
        response = supabase_service.get_restaurants(str(tenant_id) if tenant_id else None)
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{restaurant_id}", response_model=Restaurant)
async def read_restaurant(restaurant_id: UUID):
    """
    Retrieve a specific restaurant by ID.
    """
    try:
        response = supabase_service.get_restaurant(str(restaurant_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Restaurant)
async def create_restaurant(restaurant: RestaurantCreate):
    """
    Create a new restaurant.
    """
    try:
        response = supabase_service.create_restaurant(restaurant.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create restaurant")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{restaurant_id}", response_model=Restaurant)
async def update_restaurant(restaurant_id: UUID, restaurant: RestaurantUpdate):
    """
    Update a restaurant.
    """
    try:
        # Check if restaurant exists
        check_response = supabase_service.get_restaurant(str(restaurant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Update restaurant
        response = supabase_service.update_restaurant(str(restaurant_id), restaurant.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{restaurant_id}")
async def delete_restaurant(restaurant_id: UUID):
    """
    Delete a restaurant.
    """
    try:
        # Check if restaurant exists
        check_response = supabase_service.get_restaurant(str(restaurant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Delete restaurant
        supabase_service.delete_restaurant(str(restaurant_id))
        return {"message": "Restaurant deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
