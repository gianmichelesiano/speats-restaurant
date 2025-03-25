from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel

class TenantBase(BaseModel):
    name: str
    description: Optional[str] = None

class TenantCreate(TenantBase):
    pass

class TenantUpdate(TenantBase):
    name: Optional[str] = None

class TenantInDBBase(BaseDBModel, TenantBase):
    id: UUID

class Tenant(TenantInDBBase):
    pass
