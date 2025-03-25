from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from .base import BaseDBModel

class TableBase(BaseModel):
    table_number: int
    capacity: Optional[int] = None
    position: Optional[str] = None

class TableCreate(TableBase):
    tenant_id: UUID
    restaurant_id: UUID

class TableUpdate(TableBase):
    table_number: Optional[int] = None
    capacity: Optional[int] = None
    position: Optional[str] = None

class TableInDBBase(BaseDBModel, TableBase):
    id: UUID
    tenant_id: UUID
    restaurant_id: UUID

class Table(TableInDBBase):
    pass
