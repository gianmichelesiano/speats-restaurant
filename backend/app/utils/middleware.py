from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from .errors import APIError

logger = logging.getLogger(__name__)

async def exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for the application.
    """
    if isinstance(exc, APIError):
        # Handle custom API errors
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": str(exc.detail),
                "error_code": exc.error_code,
            },
        )
    elif isinstance(exc, RequestValidationError):
        # Handle validation errors
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Validation error",
                "error_code": "VALIDATION_ERROR",
                "details": exc.errors(),
            },
        )
    elif isinstance(exc, StarletteHTTPException):
        # Handle HTTP exceptions
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": str(exc.detail),
                "error_code": "HTTP_ERROR",
            },
        )
    else:
        # Handle unexpected errors
        logger.exception(f"Unexpected error: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_SERVER_ERROR",
            },
        )

def setup_exception_handlers(app):
    """
    Set up exception handlers for the application.
    """
    app.add_exception_handler(APIError, exception_handler)
    app.add_exception_handler(RequestValidationError, exception_handler)
    app.add_exception_handler(StarletteHTTPException, exception_handler)
    app.add_exception_handler(Exception, exception_handler)
