from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class BaseDBModel(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    
    class Config:
        from_attributes = True
