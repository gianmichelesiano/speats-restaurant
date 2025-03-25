from typing import List, Any, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Depends, Query
from app.models.customer import Customer, CustomerCreate, CustomerUpdate
from app.services.supabase import supabase_service

router = APIRouter()

@router.get("/", response_model=List[Customer])
async def read_customers(tenant_id: Optional[UUID] = Query(None)):
    """
    Retrieve all customers, optionally filtered by tenant_id.
    """
    try:
        response = supabase_service.get_customers(str(tenant_id) if tenant_id else None)
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{customer_id}", response_model=Customer)
async def read_customer(customer_id: UUID):
    """
    Retrieve a specific customer by ID.
    """
    try:
        response = supabase_service.get_customer(str(customer_id))
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    """
    Create a new customer.
    """
    try:
        response = supabase_service.create_customer(customer.model_dump())
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=400, detail="Failed to create customer")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{customer_id}", response_model=Customer)
async def update_customer(customer_id: UUID, customer: CustomerUpdate):
    """
    Update a customer.
    """
    try:
        # Check if customer exists
        check_response = supabase_service.get_customer(str(customer_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Update customer
        response = supabase_service.update_customer(str(customer_id), customer.model_dump(exclude_unset=True))
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{customer_id}")
async def delete_customer(customer_id: UUID):
    """
    Delete a customer.
    """
    try:
        # Check if customer exists
        check_response = supabase_service.get_customer(str(customer_id))
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        # Delete customer
        supabase_service.delete_customer(str(customer_id))
        return {"message": "Customer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
