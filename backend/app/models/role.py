from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class Role(RoleBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True