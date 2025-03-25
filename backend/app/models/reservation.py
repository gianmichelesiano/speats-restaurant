from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from .base import BaseDBModel

class ReservationBase(BaseModel):
    reservation_datetime: datetime
    number_of_people: int
    notes: Optional[str] = None
    status: Optional[str] = None

class ReservationCreate(ReservationBase):
    tenant_id: UUID
    restaurant_id: UUID
    table_id: UUID
    customer_id: UUID

class ReservationUpdate(ReservationBase):
    reservation_datetime: Optional[datetime] = None
    number_of_people: Optional[int] = None
    status: Optional[str] = None

class ReservationInDBBase(BaseDBModel, ReservationBase):
    id: UUID
    tenant_id: UUID
    restaurant_id: UUID
    table_id: UUID
    customer_id: UUID

class Reservation(ReservationInDBBase):
    pass
