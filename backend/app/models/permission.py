from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

class PermissionBase(BaseModel):
    name: str
    resource: str
    action: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(BaseModel):
    name: Optional[str] = None
    resource: Optional[str] = None
    action: Optional[str] = None
    description: Optional[str] = None

class Permission(PermissionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class UserPermission(BaseModel):
    permission_name: str
    resource: str
    action: str
    restaurant_id: Optional[UUID] = None