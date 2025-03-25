from typing import List, Any, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.reservation import Reservation, ReservationCreate, ReservationUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Reservation])
async def read_reservations(
    tenant_id: Optional[UUID] = Query(None),
    restaurant_id: Optional[UUID] = Query(None),
    customer_id: Optional[UUID] = Query(None),
    table_id: Optional[UUID] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    status: Optional[str] = Query(None)
):
    """
    Retrieve all reservations, with optional filters.
    """
    try:
        response = supabase_service.get_reservations(
            tenant_id=str(tenant_id) if tenant_id else None,
            restaurant_id=str(restaurant_id) if restaurant_id else None,
            customer_id=str(customer_id) if customer_id else None,
            table_id=str(table_id) if table_id else None,
            date_from=date_from,
            date_to=date_to,
            status=status
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{reservation_id}", response_model=Reservation)
async def read_reservation(reservation_id: UUID):
    """
    Retrieve a specific reservation by ID.
    """
    try:
        response = supabase_service.get_reservation(str(reservation_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Reservation not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Reservation)
async def create_reservation(reservation: ReservationCreate):
    """
    Create a new reservation.
    """
    try:
        response = supabase_service.create_reservation(reservation.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create reservation")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{reservation_id}", response_model=Reservation)
async def update_reservation(reservation_id: UUID, reservation: ReservationUpdate):
    """
    Update a reservation.
    """
    try:
        # Check if reservation exists
        check_response = supabase_service.get_reservation(str(reservation_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Reservation not found")
        
        # Update reservation
        response = supabase_service.update_reservation(str(reservation_id), reservation.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{reservation_id}")
async def delete_reservation(reservation_id: UUID):
    """
    Delete a reservation.
    """
    try:
        # Check if reservation exists
        check_response = supabase_service.get_reservation(str(reservation_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Reservation not found")
        
        # Delete reservation
        supabase_service.delete_reservation(str(reservation_id))
        return {"message": "Reservation deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
