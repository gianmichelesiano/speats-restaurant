from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel

class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    category: Optional[str] = None

class MenuItemCreate(MenuItemBase):
    tenant_id: UUID
    restaurant_id: UUID

class MenuItemUpdate(MenuItemBase):
    name: Optional[str] = None

class MenuItemInDBBase(BaseDBModel, MenuItemBase):
    id: UUID
    tenant_id: UUID
    restaurant_id: UUID

class MenuItem(MenuItemInDBBase):
    pass
