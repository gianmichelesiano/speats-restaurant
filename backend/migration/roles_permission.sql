-- Schema completo per sistema di ruoli e permessi
-- Tabella ruoli
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella permessi
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource, action)
);

-- Tabella associazione ruoli-permessi
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- Tabella associazione utenti-ruoli con scope opzionale per ristorante
-- Tabella associazione utenti-ruoli con scope opzionale per ristorante
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice per garantire unicità dei ruoli globali (restaurant_id IS NULL)
CREATE UNIQUE INDEX user_global_roles ON user_roles (user_id, role_id) 
WHERE restaurant_id IS NULL;

-- Indice per garantire unicità dei ruoli specifici per ristorante
CREATE UNIQUE INDEX user_restaurant_roles ON user_roles (user_id, role_id, restaurant_id) 
WHERE restaurant_id IS NOT NULL;

-- Trigger per aggiornare il campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roles_modtime
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_permissions_modtime
BEFORE UPDATE ON permissions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Funzione per ottenere tutti i permessi di un utente
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
    permission_name TEXT,
    resource TEXT,
    action TEXT,
    restaurant_id UUID
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.name AS permission_name,
        p.resource,
        p.action,
        ur.restaurant_id
    FROM 
        user_roles ur
    JOIN 
        roles r ON ur.role_id = r.id
    JOIN 
        role_permissions rp ON r.id = rp.role_id
    JOIN 
        permissions p ON rp.permission_id = p.id
    WHERE 
        ur.user_id = p_user_id;
END;
$$;

-- Funzione per verificare se un utente ha un permesso specifico
CREATE OR REPLACE FUNCTION user_has_permission(
    p_user_id UUID,
    p_permission_name TEXT,
    p_restaurant_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM get_user_permissions(p_user_id) up
        WHERE 
            up.permission_name = p_permission_name
            AND (
                -- Ha il permesso a livello globale
                up.restaurant_id IS NULL
                OR
                -- Ha il permesso per il ristorante specifico
                (p_restaurant_id IS NOT NULL AND up.restaurant_id = p_restaurant_id)
            )
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$;

-- Inserimento di ruoli predefiniti
INSERT INTO roles (name, description) VALUES
('admin', 'Amministratore con accesso completo'),
('manager', 'Gestore di ristorante'),
('staff', 'Staff del ristorante'),
('customer', 'Cliente normale');

-- Inserimento di permessi predefiniti
INSERT INTO permissions (name, resource, action, description) VALUES
-- Permessi per ristoranti
('view_restaurants', 'restaurants', 'read', 'Visualizzare ristoranti'),
('create_restaurant', 'restaurants', 'create', 'Creare ristoranti'),
('edit_restaurant', 'restaurants', 'update', 'Modificare ristoranti'),
('delete_restaurant', 'restaurants', 'delete', 'Eliminare ristoranti'),

-- Permessi per menu
('view_menu', 'menu_items', 'read', 'Visualizzare menu'),
('create_menu_item', 'menu_items', 'create', 'Creare elementi menu'),
('edit_menu_item', 'menu_items', 'update', 'Modificare elementi menu'),
('delete_menu_item', 'menu_items', 'delete', 'Eliminare elementi menu'),

-- Permessi per prenotazioni
('view_all_reservations', 'reservations', 'read_all', 'Visualizzare tutte le prenotazioni'),
('view_own_reservations', 'reservations', 'read_own', 'Visualizzare proprie prenotazioni'),
('create_reservation', 'reservations', 'create', 'Creare prenotazioni'),
('edit_reservation', 'reservations', 'update', 'Modificare prenotazioni'),
('cancel_reservation', 'reservations', 'cancel', 'Cancellare prenotazioni'),

-- Permessi per utenti
('view_users', 'users', 'read', 'Visualizzare utenti'),
('create_user', 'users', 'create', 'Creare utenti'),
('edit_user', 'users', 'update', 'Modificare utenti'),
('delete_user', 'users', 'delete', 'Eliminare utenti'),

-- Permessi per tavoli
('view_tables', 'tables', 'read', 'Visualizzare tavoli'),
('create_table', 'tables', 'create', 'Creare tavoli'),
('edit_table', 'tables', 'update', 'Modificare tavoli'),
('delete_table', 'tables', 'delete', 'Eliminare tavoli');

-- Associazione dei permessi ai ruoli
-- Admin (tutti i permessi)
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'admin'), id FROM permissions;

-- Manager (tutti tranne gestione utenti admin)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'manager'), 
  id 
FROM permissions 
WHERE name NOT IN ('delete_user', 'create_user');

-- Staff (visualizzazione e operazioni di base)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'staff'), 
  id 
FROM permissions 
WHERE name IN (
  'view_restaurants', 'view_menu', 'view_all_reservations',
  'create_reservation', 'edit_reservation', 'cancel_reservation',
  'view_tables'
);

-- Cliente (solo operazioni relative alle proprie prenotazioni)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'customer'), 
  id 
FROM permissions 
WHERE name IN (
  'view_restaurants', 'view_menu', 'view_own_reservations',
  'create_reservation', 'cancel_reservation'
);