# Prima riga del main.py
from dotenv import load_dotenv
load_dotenv()  # Carica le variabili dal file .env


from supabase import create_client, Client
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class SupabaseService:
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseService, cls).__new__(cls)
            try:
                cls._client = create_client(
                    settings.SUPABASE_URL, 
                    settings.SUPABASE_KEY
                )
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Error initializing Supabase client: {e}")
                cls._client = None
        return cls._instance

    @property
    def client(self) -> Client:
        if self._client is None:
            raise ValueError("Supabase client not initialized")
        return self._client

    def get_table(self, table_name: str):
        return self.client.table(table_name)

    # Tenant operations
    def get_tenants(self):
        return self.get_table("tenant").select("*").execute()

    def get_tenant(self, tenant_id: str):
        return self.get_table("tenant").select("*").eq("id", tenant_id).execute()

    def create_tenant(self, data: dict):
        return self.get_table("tenant").insert(data).execute()

    def update_tenant(self, tenant_id: str, data: dict):
        return self.get_table("tenant").update(data).eq("id", tenant_id).execute()

    def delete_tenant(self, tenant_id: str):
        return self.get_table("tenant").delete().eq("id", tenant_id).execute()

    # Restaurant operations
    def get_restaurants(self, tenant_id: str = None):
        query = self.get_table("restaurants").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        return query.execute()

    def get_restaurant(self, restaurant_id: str):
        return self.get_table("restaurants").select("*").eq("id", restaurant_id).execute()

    def create_restaurant(self, data: dict):
        return self.get_table("restaurants").insert(data).execute()

    def update_restaurant(self, restaurant_id: str, data: dict):
        return self.get_table("restaurants").update(data).eq("id", restaurant_id).execute()

    def delete_restaurant(self, restaurant_id: str):
        return self.get_table("restaurants").delete().eq("id", restaurant_id).execute()
    
    # Customer operations
    def get_customers(self, tenant_id: str = None):
        query = self.get_table("customers").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        return query.execute()

    def get_customer(self, customer_id: str):
        return self.get_table("customers").select("*").eq("id", customer_id).execute()

    def create_customer(self, data: dict):
        return self.get_table("customers").insert(data).execute()

    def update_customer(self, customer_id: str, data: dict):
        return self.get_table("customers").update(data).eq("id", customer_id).execute()

    def delete_customer(self, customer_id: str):
        return self.get_table("customers").delete().eq("id", customer_id).execute()
    
    # Table operations
    def get_tables(self, tenant_id: str = None, restaurant_id: str = None):
        query = self.get_table("tables").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        if restaurant_id:
            query = query.eq("restaurant_id", restaurant_id)
        return query.execute()

    def get_table_by_id(self, table_id: str):
        return self.get_table("tables").select("*").eq("id", table_id).execute()

    def create_table(self, data: dict):
        return self.get_table("tables").insert(data).execute()

    def update_table(self, table_id: str, data: dict):
        return self.get_table("tables").update(data).eq("id", table_id).execute()

    def delete_table(self, table_id: str):
        return self.get_table("tables").delete().eq("id", table_id).execute()
    
    # Reservation operations
    def get_reservations(self, tenant_id: str = None, restaurant_id: str = None, 
                         customer_id: str = None, table_id: str = None, 
                         date_from = None, date_to = None, status: str = None):
        query = self.get_table("reservations").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        if restaurant_id:
            query = query.eq("restaurant_id", restaurant_id)
        if customer_id:
            query = query.eq("customer_id", customer_id)
        if table_id:
            query = query.eq("table_id", table_id)
        if date_from:
            query = query.gte("reservation_datetime", date_from.isoformat())
        if date_to:
            query = query.lte("reservation_datetime", date_to.isoformat())
        if status:
            query = query.eq("status", status)
        return query.execute()

    def get_reservation(self, reservation_id: str):
        return self.get_table("reservations").select("*").eq("id", reservation_id).execute()

    def create_reservation(self, data: dict):
        return self.get_table("reservations").insert(data).execute()

    def update_reservation(self, reservation_id: str, data: dict):
        return self.get_table("reservations").update(data).eq("id", reservation_id).execute()

    def delete_reservation(self, reservation_id: str):
        return self.get_table("reservations").delete().eq("id", reservation_id).execute()
    
    # Menu Item operations
    def get_menu_items(self, tenant_id: str = None, restaurant_id: str = None, category: str = None):
        query = self.get_table("menu_items").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        if restaurant_id:
            query = query.eq("restaurant_id", restaurant_id)
        if category:
            query = query.eq("category", category)
        return query.execute()

    def get_menu_item(self, menu_item_id: str):
        return self.get_table("menu_items").select("*").eq("id", menu_item_id).execute()

    def create_menu_item(self, data: dict):
        return self.get_table("menu_items").insert(data).execute()

    def update_menu_item(self, menu_item_id: str, data: dict):
        return self.get_table("menu_items").update(data).eq("id", menu_item_id).execute()

    def delete_menu_item(self, menu_item_id: str):
        return self.get_table("menu_items").delete().eq("id", menu_item_id).execute()
    
    # Review operations
    def get_reviews(self, tenant_id: str = None, restaurant_id: str = None, customer_id: str = None):
        query = self.get_table("reviews").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        if restaurant_id:
            query = query.eq("restaurant_id", restaurant_id)
        if customer_id:
            query = query.eq("customer_id", customer_id)
        return query.execute()

    def get_review(self, review_id: str):
        return self.get_table("reviews").select("*").eq("id", review_id).execute()

    def create_review(self, data: dict):
        return self.get_table("reviews").insert(data).execute()

    def update_review(self, review_id: str, data: dict):
        return self.get_table("reviews").update(data).eq("id", review_id).execute()

    def delete_review(self, review_id: str):
        return self.get_table("reviews").delete().eq("id", review_id).execute()
    
    # User Restaurant operations
    def get_user_restaurants(self, tenant_id: str = None, restaurant_id: str = None, 
                             user_id: str = None, role: str = None):
        query = self.get_table("user_restaurant").select("*")
        if tenant_id:
            query = query.eq("tenant_id", tenant_id)
        if restaurant_id:
            query = query.eq("restaurant_id", restaurant_id)
        if user_id:
            query = query.eq("user_id", user_id)
        if role:
            query = query.eq("role", role)
        return query.execute()

    def get_user_restaurant(self, user_id: str, restaurant_id: str):
        return self.get_table("user_restaurant").select("*")\
            .eq("user_id", user_id)\
            .eq("restaurant_id", restaurant_id)\
            .execute()

    def create_user_restaurant(self, data: dict):
        return self.get_table("user_restaurant").insert(data).execute()

    def update_user_restaurant(self, user_id: str, restaurant_id: str, data: dict):
        return self.get_table("user_restaurant").update(data)\
            .eq("user_id", user_id)\
            .eq("restaurant_id", restaurant_id)\
            .execute()

    def delete_user_restaurant(self, user_id: str, restaurant_id: str):
        return self.get_table("user_restaurant").delete()\
            .eq("user_id", user_id)\
            .eq("restaurant_id", restaurant_id)\
            .execute()

# Create a singleton instance
supabase_service = SupabaseService()
