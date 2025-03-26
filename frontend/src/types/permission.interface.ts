export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionCreate {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface PermissionUpdate {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}

export interface UserPermission {
  permission_name: string;
  resource: string;
  action: string;
  restaurant_id?: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}
