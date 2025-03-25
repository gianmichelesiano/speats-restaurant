from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.review import Review, ReviewCreate, ReviewUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Review])
async def read_reviews(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None),
    customer_id: Optional[UUID] = Query(None)
):
    """
    Retrieve all reviews, optionally filtered by tenant_id, restaurant_id, and/or customer_id.
    """
    try:
        response = supabase_service.get_reviews(
            tenant_id=str(tenant_id) if tenant_id else None,
            restaurant_id=str(restaurant_id) if restaurant_id else None,
            customer_id=str(customer_id) if customer_id else None
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{review_id}", response_model=Review)
async def read_review(review_id: UUID):
    """
    Retrieve a specific review by ID.
    """
    try:
        response = supabase_service.get_review(str(review_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Review)
async def create_review(review: ReviewCreate):
    """
    Create a new review.
    """
    try:
        response = supabase_service.create_review(review.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create review")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{review_id}", response_model=Review)
async def update_review(review_id: UUID, review: ReviewUpdate):
    """
    Update a review.
    """
    try:
        # Check if review exists
        check_response = supabase_service.get_review(str(review_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Update review
        response = supabase_service.update_review(str(review_id), review.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{review_id}")
async def delete_review(review_id: UUID):
    """
    Delete a review.
    """
    try:
        # Check if review exists
        check_response = supabase_service.get_review(str(review_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Delete review
        supabase_service.delete_review(str(review_id))
        return {"message": "Review deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
