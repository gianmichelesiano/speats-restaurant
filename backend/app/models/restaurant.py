from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel

class RestaurantBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    logo_image: Optional[str] = None
    description: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    tenant_id: UUID

class RestaurantUpdate(RestaurantBase):
    name: Optional[str] = None
    address: Optional[str] = None

class RestaurantInDBBase(BaseDBModel, RestaurantBase):
    id: UUID
    tenant_id: UUID

class Restaurant(RestaurantInDBBase):
    pass
