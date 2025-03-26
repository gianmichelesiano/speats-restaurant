export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  restaurant_id?: string;
  created_at: string;
  roles?: {
    name: string;
    description?: string;
  };
  restaurants?: {
    name: string;
  };
}
