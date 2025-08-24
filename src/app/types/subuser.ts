export interface Subuser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  is_subuser: boolean;
  parent_id: string | null;
} 