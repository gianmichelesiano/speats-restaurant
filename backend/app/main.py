from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.utils.middleware import setup_exception_handlers
import logging
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        debug=settings.DEBUG
    )

    # Set up CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Set up exception handlers
    setup_exception_handlers(application)

    # Add startup and shutdown events
    @application.on_event("startup")
    async def startup_event():
        logger.info(f"Starting {settings.PROJECT_NAME} in {settings.ENVIRONMENT} mode")
        # You can add startup logic here, like database connections
        pass

    @application.on_event("shutdown")
    async def shutdown_event():
        logger.info(f"Shutting down {settings.PROJECT_NAME}")
        # You can add cleanup logic here
        pass

    # Root endpoint
    @application.get("/")
    async def root():
        return {
            "message": "Welcome to Restaurant API",
            "version": settings.VERSION,
            "docs": "/docs",
            "environment": settings.ENVIRONMENT
        }

    # Import and include routers
    from app.api.api_v1.api import api_router
    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application

app = create_application()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
