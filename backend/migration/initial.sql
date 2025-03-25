-- Creazione della tabella 'tenant'
CREATE TABLE public.tenant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT
);

-- Creazione della tabella 'restaurants'
CREATE TABLE public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    opening_hours TEXT,
    logo_image TEXT,
    description TEXT
);

-- Creazione della tabella 'customers'
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT
);

-- Creazione della tabella 'tables'
CREATE TABLE public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    table_number INTEGER,
    capacity INTEGER,
    position TEXT
);

-- Creazione della tabella 'reservations'
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    table_id UUID REFERENCES public.tables(id),
    customer_id UUID REFERENCES public.customers(id),
    reservation_datetime TIMESTAMP,
    number_of_people INTEGER,
    notes TEXT,
    status TEXT
);

-- Creazione della tabella 'menu_items'
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    name TEXT,
    description TEXT,
    price NUMERIC,
    image TEXT,
    category TEXT
);

-- Creazione della tabella 'reviews'
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenant(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    customer_id UUID REFERENCES public.customers(id),
    rating INTEGER,
    comment TEXT,
    review_datetime TIMESTAMP
);

-- Creazione della tabella 'user_restaurant'
CREATE TABLE public.user_restaurant (
    user_id UUID REFERENCES auth.users(id),
    restaurant_id UUID REFERENCES public.restaurants(id),
    tenant_id UUID REFERENCES public.tenant(id),
    role TEXT,
    PRIMARY KEY (user_id, restaurant_id)
);