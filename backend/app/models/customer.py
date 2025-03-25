from uuid import UUID
from typing import Optional
from pydantic import BaseModel, EmailStr
from .base import BaseDBModel

class CustomerBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    tenant_id: UUID

class CustomerUpdate(CustomerBase):
    pass

class CustomerInDBBase(BaseDBModel, CustomerBase):
    id: UUID
    tenant_id: UUID

class Customer(CustomerInDBBase):
    pass
