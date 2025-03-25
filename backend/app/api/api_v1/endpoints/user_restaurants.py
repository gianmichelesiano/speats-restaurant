from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.user_restaurant import UserRestaurant, UserRestaurantCreate, UserRestaurantUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[UserRestaurant])
async def read_user_restaurants(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None),
    user_id: Optional[UUID] = Query(None),
    role: Optional[str] = Query(None)
):
    """
    Retrieve all user-restaurant associations, optionally filtered by tenant_id, restaurant_id, user_id, and/or role.
    """
    try:
        response = supabase_service.get_user_restaurants(
            tenant_id=str(tenant_id) if tenant_id else None,
            restaurant_id=str(restaurant_id) if restaurant_id else None,
            user_id=str(user_id) if user_id else None,
            role=role
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/{restaurant_id}", response_model=UserRestaurant)
async def read_user_restaurant(user_id: UUID, restaurant_id: UUID):
    """
    Retrieve a specific user-restaurant association by user_id and restaurant_id.
    """
    try:
        response = supabase_service.get_user_restaurant(str(user_id), str(restaurant_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="User-restaurant association not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=UserRestaurant)
async def create_user_restaurant(user_restaurant: UserRestaurantCreate):
    """
    Create a new user-restaurant association.
    """
    try:
        response = supabase_service.create_user_restaurant(user_restaurant.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create user-restaurant association")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}/{restaurant_id}", response_model=UserRestaurant)
async def update_user_restaurant(user_id: UUID, restaurant_id: UUID, user_restaurant: UserRestaurantUpdate):
    """
    Update a user-restaurant association.
    """
    try:
        # Check if user-restaurant association exists
        check_response = supabase_service.get_user_restaurant(str(user_id), str(restaurant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="User-restaurant association not found")
        
        # Update user-restaurant association
        response = supabase_service.update_user_restaurant(
            user_id=str(user_id),
            restaurant_id=str(restaurant_id),
            data=user_restaurant.model_dump(exclude_unset=True)
        )
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{user_id}/{restaurant_id}")
async def delete_user_restaurant(user_id: UUID, restaurant_id: UUID):
    """
    Delete a user-restaurant association.
    """
    try:
        # Check if user-restaurant association exists
        check_response = supabase_service.get_user_restaurant(str(user_id), str(restaurant_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="User-restaurant association not found")
        
        # Delete user-restaurant association
        supabase_service.delete_user_restaurant(str(user_id), str(restaurant_id))
        return {"message": "User-restaurant association deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
