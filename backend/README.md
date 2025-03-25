# Restaurant API Backend
Backend API for restaurant management application, built with FastAPI and Supabase.

## Project Structure

```
backend/
├── app/                    # Main application code
│   ├── api/                # API definitions
│   │   └── api_v1/         # API version 1
│   │       ├── endpoints/  # Specific endpoints
│   │       └── api.py      # Main API router
│   ├── core/               # Core configurations and utilities
│   ├── models/             # Pydantic models
│   ├── schemas/            # Validation schemas
│   ├── services/           # Services (Supabase, etc.)
│   └── main.py             # Application entry point
├── migration/              # Database migration scripts
│   ├── initial.sql         # Initial database schema
│   └── seed.sql            # Sample data
├── tests/                  # Unit and integration tests
├── .env                    # Environment variables
├── requirements.txt        # Python dependencies
└── run.py                  # Script to start the application
```

## Version Control

The project includes a `.gitignore` file that excludes the following from version control:

### Python-specific files
- `__pycache__/` directories and Python compiled files (`.pyc`, `.pyo`, `.pyd`)
- Python distribution files (build, dist, eggs, etc.)
- Virtual environments (`venv/`, `.venv/`, `ENV/`)

### Environment and configuration
- `.env` files (including `.env.local`, `.env.development`, `.env.test`, `.env.production`)

### IDE and editor files
- `.idea/` (PyCharm)
- `.vscode/` (Visual Studio Code)
- Vim swap files (`.swp`, `.swo`)

### Logs and testing
- Log files and directories
- Test coverage reports and cache directories

### System files
- `.DS_Store` (macOS)
- `Thumbs.db` (Windows)

## Requirements

- Python 3.8+
- Supabase account and project

## Installation

1. Clone the repository

2. Create and activate a virtual environment:
   ```
   cd backend
   py -3 -m uv venv
   .\.venv\Scripts\Activate.ps1  # For Windows PowerShell
   ```

3. Install dependencies:
   ```
   py -3 -m uv install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update variables with your Supabase data

## Database Configuration

1. Create a new Supabase project
2. Run SQL scripts in `migration/initial.sql` to create tables
3. Optionally, run `migration/seed.sql` to populate the database with sample data

## Starting the applicationdev


```
python run.py
```

The API will be available at: http://localhost:8000

Swagger UI documentation will be available at: http://localhost:8000/docs

## API Endpoints

### Tenants
- `GET /api/v1/tenants` - List of all tenants
- `GET /api/v1/tenants/{tenant_id}` - Details of a specific tenant
- `POST /api/v1/tenants` - Create a new tenant
- `PUT /api/v1/tenants/{tenant_id}` - Update an existing tenant
- `DELETE /api/v1/tenants/{tenant_id}` - Delete a tenant

### Restaurants
- `GET /api/v1/restaurants` - List of all restaurants
- `GET /api/v1/restaurants?tenant_id={tenant_id}` - List of restaurants filtered by tenant
- `GET /api/v1/restaurants/{restaurant_id}` - Details of a specific restaurant
- `POST /api/v1/restaurants` - Create a new restaurant
- `PUT /api/v1/restaurants/{restaurant_id}` - Update an existing restaurant
- `DELETE /api/v1/restaurants/{restaurant_id}` - Delete a restaurant

### Customers
- `GET /api/v1/customers` - List of all customers
- `GET /api/v1/customers?tenant_id={tenant_id}` - List of customers filtered by tenant
- `GET /api/v1/customers/{customer_id}` - Details of a specific customer
- `POST /api/v1/customers` - Create a new customer
- `PUT /api/v1/customers/{customer_id}` - Update an existing customer
- `DELETE /api/v1/customers/{customer_id}` - Delete a customer

### Tables
- `GET /api/v1/tables` - List of all tables
- `GET /api/v1/tables?tenant_id={tenant_id}` - List of tables filtered by tenant
- `GET /api/v1/tables?restaurant_id={restaurant_id}` - List of tables filtered by restaurant
- `GET /api/v1/tables/{table_id}` - Details of a specific table
- `POST /api/v1/tables` - Create a new table
- `PUT /api/v1/tables/{table_id}` - Update an existing table
- `DELETE /api/v1/tables/{table_id}` - Delete a table

### Reservations
- `GET /api/v1/reservations` - List of all reservations
- `GET /api/v1/reservations?tenant_id={tenant_id}` - List of reservations filtered by tenant
- `GET /api/v1/reservations?restaurant_id={restaurant_id}` - List of reservations filtered by restaurant
- `GET /api/v1/reservations?customer_id={customer_id}` - List of reservations filtered by customer
- `GET /api/v1/reservations?table_id={table_id}` - List of reservations filtered by table
- `GET /api/v1/reservations?date_from={date_from}&date_to={date_to}` - List of reservations within a date range
- `GET /api/v1/reservations?status={status}` - List of reservations filtered by status
- `GET /api/v1/reservations/{reservation_id}` - Details of a specific reservation
- `POST /api/v1/reservations` - Create a new reservation
- `PUT /api/v1/reservations/{reservation_id}` - Update an existing reservation
- `DELETE /api/v1/reservations/{reservation_id}` - Delete a reservation

### Menu Items
- `GET /api/v1/menu-items` - List of all menu items
- `GET /api/v1/menu-items?tenant_id={tenant_id}` - List of menu items filtered by tenant
- `GET /api/v1/menu-items?restaurant_id={restaurant_id}` - List of menu items filtered by restaurant
- `GET /api/v1/menu-items?category={category}` - List of menu items filtered by category
- `GET /api/v1/menu-items/{menu_item_id}` - Details of a specific menu item
- `POST /api/v1/menu-items` - Create a new menu item
- `PUT /api/v1/menu-items/{menu_item_id}` - Update an existing menu item
- `DELETE /api/v1/menu-items/{menu_item_id}` - Delete a menu item

### Reviews
- `GET /api/v1/reviews` - List of all reviews
- `GET /api/v1/reviews?tenant_id={tenant_id}` - List of reviews filtered by tenant
- `GET /api/v1/reviews?restaurant_id={restaurant_id}` - List of reviews filtered by restaurant
- `GET /api/v1/reviews?customer_id={customer_id}` - List of reviews filtered by customer
- `GET /api/v1/reviews/{review_id}` - Details of a specific review
- `POST /api/v1/reviews` - Create a new review
- `PUT /api/v1/reviews/{review_id}` - Update an existing review
- `DELETE /api/v1/reviews/{review_id}` - Delete a review

### User Restaurants
- `GET /api/v1/user-restaurants` - List of all user-restaurant associations
- `GET /api/v1/user-restaurants?tenant_id={tenant_id}` - List of user-restaurant associations filtered by tenant
- `GET /api/v1/user-restaurants?restaurant_id={restaurant_id}` - List of user-restaurant associations filtered by restaurant
- `GET /api/v1/user-restaurants?user_id={user_id}` - List of user-restaurant associations filtered by user
- `GET /api/v1/user-restaurants?role={role}` - List of user-restaurant associations filtered by role
- `GET /api/v1/user-restaurants/{user_id}/{restaurant_id}` - Details of a specific user-restaurant association
- `POST /api/v1/user-restaurants` - Create a new user-restaurant association
- `PUT /api/v1/user-restaurants/{user_id}/{restaurant_id}` - Update an existing user-restaurant association
- `DELETE /api/v1/user-restaurants/{user_id}/{restaurant_id}` - Delete a user-restaurant association
