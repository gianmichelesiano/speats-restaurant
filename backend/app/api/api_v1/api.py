from fastapi import APIRouter

# Import endpoint modules
from app.api.api_v1.endpoints.tenants import router as tenants_router
from app.api.api_v1.endpoints.restaurants import router as restaurants_router
from app.api.api_v1.endpoints.customers import router as customers_router
from app.api.api_v1.endpoints.tables import router as tables_router
from app.api.api_v1.endpoints.reservations import router as reservations_router
from app.api.api_v1.endpoints.menu_items import router as menu_items_router
from app.api.api_v1.endpoints.reviews import router as reviews_router
from app.api.api_v1.endpoints.user_restaurants import router as user_restaurants_router

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(tenants_router, prefix="/tenants", tags=["tenants"])
api_router.include_router(restaurants_router, prefix="/restaurants", tags=["restaurants"])
api_router.include_router(customers_router, prefix="/customers", tags=["customers"])
api_router.include_router(tables_router, prefix="/tables", tags=["tables"])
api_router.include_router(reservations_router, prefix="/reservations", tags=["reservations"])
api_router.include_router(menu_items_router, prefix="/menu-items", tags=["menu-items"])
api_router.include_router(reviews_router, prefix="/reviews", tags=["reviews"])
api_router.include_router(user_restaurants_router, prefix="/user-restaurants", tags=["user-restaurants"])
