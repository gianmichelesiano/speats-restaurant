from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel

class UserRestaurantBase(BaseModel):
    user_id: UUID
    restaurant_id: UUID
    tenant_id: UUID
    role: Optional[str] = None

class UserRestaurantCreate(UserRestaurantBase):
    pass

class UserRestaurantUpdate(BaseModel):
    role: Optional[str] = None

class UserRestaurantInDBBase(UserRestaurantBase):
    class Config:
        from_attributes = True

class UserRestaurant(UserRestaurantInDBBase):
    pass
