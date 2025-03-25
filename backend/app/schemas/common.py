from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from pydantic import BaseModel, Field
from uuid import UUID

# Define a generic type variable
T = TypeVar('T')

class ResponseBase(BaseModel):
    """
    Base class for all response models.
    """
    success: bool = True
    message: Optional[str] = None

class DataResponse(ResponseBase, Generic[T]):
    """
    Generic response model with data.
    """
    data: Optional[T] = None

class ListResponse(ResponseBase, Generic[T]):
    """
    Generic response model for lists.
    """
    data: List[T] = []
    total: int = 0
    page: Optional[int] = None
    size: Optional[int] = None

class ErrorResponse(ResponseBase):
    """
    Error response model.
    """
    success: bool = False
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class PaginationParams(BaseModel):
    """
    Pagination parameters.
    """
    page: int = Field(1, ge=1, description="Page number")
    size: int = Field(10, ge=1, le=100, description="Items per page")
