from fastapi import HTTPException, status
from typing import Any, Dict, Optional

class APIError(HTTPException):
    """
    Custom API error class that extends FastAPI's HTTPException.
    """
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code

# Common API errors
class NotFoundError(APIError):
    """
    404 Not Found error.
    """
    def __init__(
        self,
        detail: str = "Resource not found",
        error_code: Optional[str] = "NOT_FOUND",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
            error_code=error_code,
            headers=headers,
        )

class BadRequestError(APIError):
    """
    400 Bad Request error.
    """
    def __init__(
        self,
        detail: str = "Bad request",
        error_code: Optional[str] = "BAD_REQUEST",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            error_code=error_code,
            headers=headers,
        )

class UnauthorizedError(APIError):
    """
    401 Unauthorized error.
    """
    def __init__(
        self,
        detail: str = "Unauthorized",
        error_code: Optional[str] = "UNAUTHORIZED",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            error_code=error_code,
            headers=headers,
        )

class ForbiddenError(APIError):
    """
    403 Forbidden error.
    """
    def __init__(
        self,
        detail: str = "Forbidden",
        error_code: Optional[str] = "FORBIDDEN",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
            error_code=error_code,
            headers=headers,
        )

class InternalServerError(APIError):
    """
    500 Internal Server Error.
    """
    def __init__(
        self,
        detail: str = "Internal server error",
        error_code: Optional[str] = "INTERNAL_SERVER_ERROR",
        headers: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            error_code=error_code,
            headers=headers,
        )
