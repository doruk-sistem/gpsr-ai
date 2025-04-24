import { User as SupabaseUser } from "@supabase/supabase-js";

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

// User API types
export type User = SupabaseUser & {
  user_metadata: {
    first_name?: string;
    last_name?: string;
    company?: string;
    package_id?: string | null;
    avatar_url?: string | null;
  };
};
