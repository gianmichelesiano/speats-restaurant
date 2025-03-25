from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .base import BaseDBModel

class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None
    review_datetime: Optional[datetime] = None

class ReviewCreate(ReviewBase):
    tenant_id: UUID
    restaurant_id: UUID
    customer_id: UUID

class ReviewUpdate(ReviewBase):
    rating: Optional[int] = None

class ReviewInDBBase(BaseDBModel, ReviewBase):
    id: UUID
    tenant_id: UUID
    restaurant_id: UUID
    customer_id: UUID

class Review(ReviewInDBBase):
    pass
