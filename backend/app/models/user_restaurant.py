from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel
from datetime import datetime

class UserRestaurantBase(BaseModel):
    user_id: UUID
    restaurant_id: UUID
    tenant_id: UUID
    role: Optional[str] = None

class UserRestaurantCreate(UserRestaurantBase):
    pass

class UserRestaurantUpdate(BaseModel):
    role: Optional[str] = None

class UserRestaurantUpdate(BaseModel):
    role: Optional[str] = None
    
class UserRestaurant(UserRestaurantBase):
    id: UUID
    created_at: datetime
    
    class Config:
        orm_mode = True