/**
 * ADD ADMIN ACCESS TO ALL EXISTING TABLES
 * This migration automatically adds admin access policies to all existing tables
 * that don't already have admin policies, preserving existing user policies.
 * 
 * By default, adds general admin access (admin + superadmin).
 * For superadmin-only tables, you can manually change the policy later.
 */

-- Function to add admin access to all tables
DO $$
DECLARE
    table_record RECORD;
    policy_exists BOOLEAN;
BEGIN
    -- Loop through all tables in public schema
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN (
            'user_profiles', 
            'role_permissions',
            'schema_migrations'  -- Exclude system tables
        )
    LOOP
        -- Check if table already has an admin policy
        SELECT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = table_record.table_name 
            AND schemaname = 'public'
            AND (
                policyname ILIKE '%admin%' 
                OR policyname ILIKE '%superadmin%'
                OR policyname ILIKE '%full access%'
            )
        ) INTO policy_exists;
        
        -- If no admin policy exists, create one
        IF NOT policy_exists THEN
            -- Enable RLS if not already enabled
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_record.table_name);
            
            -- Add general admin access policy (both admin and superadmin)
            EXECUTE format('
                CREATE POLICY "Admin full access" ON %I
                FOR ALL
                TO authenticated
                USING (has_admin_access())
                WITH CHECK (has_admin_access())
            ', table_record.table_name);
            
            -- Log the action
            RAISE NOTICE 'Added admin policy to table: %', table_record.table_name;
        ELSE
            -- Log that policy already exists
            RAISE NOTICE 'Admin policy already exists for table: %', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- Grant basic permissions to authenticated users for all tables
-- This ensures admin functions can access the tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('schema_migrations')
    LOOP
        -- Grant SELECT permission to authenticated (needed for RLS to work)
        EXECUTE format('GRANT SELECT ON TABLE %I TO authenticated', table_record.table_name);
        
        -- Grant other permissions that might be needed
        EXECUTE format('GRANT INSERT, UPDATE, DELETE ON TABLE %I TO authenticated', table_record.table_name);
    END LOOP;
END $$;

-- Create helper functions for different admin levels
-- (These are already created in previous migration, but ensuring they exist)

-- Function to check if user has admin access (admin OR superadmin)
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN authorize('admin.access');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user has superadmin access (ONLY superadmin)
CREATE OR REPLACE FUNCTION public.has_superadmin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN authorize('superadmin.access');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role app_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_var app_role;
BEGIN
  SELECT role INTO user_role_var
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  RETURN user_role_var = required_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;