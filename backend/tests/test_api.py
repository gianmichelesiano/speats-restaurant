from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)

def test_read_main():
    """
    Test the root endpoint.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Welcome to Restaurant API" in response.json()["message"]

# Tenant API tests
def test_read_tenants():
    """
    Test getting all tenants.
    Note: This test assumes Supabase is configured and accessible.
    For real tests, you would use mocks or a test database.
    """
    response = client.get("/api/v1/tenants/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Restaurant API tests
def test_read_restaurants():
    """
    Test getting all restaurants.
    Note: This test assumes Supabase is configured and accessible.
    For real tests, you would use mocks or a test database.
    """
    response = client.get("/api/v1/restaurants/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Example of a test with mocked Supabase service
# def test_create_tenant_mocked(monkeypatch):
#     """
#     Test creating a tenant with a mocked Supabase service.
#     """
#     # Mock the Supabase service
#     class MockSupabaseService:
#         def create_tenant(self, data):
#             return type('obj', (object,), {
#                 'data': [{
#                     'id': '11111111-1111-1111-1111-111111111111',
#                     'name': data['name'],
#                     'description': data.get('description')
#                 }]
#             })
#     
#     # Apply the mock
#     from app.services.supabase import supabase_service
#     monkeypatch.setattr("app.api.api_v1.endpoints.tenants.supabase_service", MockSupabaseService())
#     
#     # Test the endpoint
#     response = client.post(
#         "/api/v1/tenants/",
#         json={"name": "Test Tenant", "description": "Test Description"}
#     )
#     assert response.status_code == 200
#     assert response.json()["name"] == "Test Tenant"
#     assert response.json()["description"] == "Test Description"
