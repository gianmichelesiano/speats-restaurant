import pytest
from fastapi.testclient import TestClient
from app.main import app
import os
import sys

# Add the parent directory to sys.path to allow imports from the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture
def client():
    """
    Create a test client for the FastAPI application.
    """
    with TestClient(app) as test_client:
        yield test_client

# You can add more fixtures here for mocking Supabase, etc.
# For example:
# @pytest.fixture
# def mock_supabase_service(monkeypatch):
#     """
#     Mock the Supabase service for testing.
#     """
#     class MockSupabaseService:
#         def get_tenants(self):
#             return type('obj', (object,), {
#                 'data': [
#                     {
#                         'id': '11111111-1111-1111-1111-111111111111',
#                         'name': 'Test Tenant',
#                         'description': 'Test Description'
#                     }
#                 ]
#             })
#         
#         # Add more mock methods as needed
#     
#     from app.services.supabase import supabase_service
#     monkeypatch.setattr("app.api.api_v1.endpoints.tenants.supabase_service", MockSupabaseService())
#     monkeypatch.setattr("app.api.api_v1.endpoints.restaurants.supabase_service", MockSupabaseService())
#     return MockSupabaseService()
