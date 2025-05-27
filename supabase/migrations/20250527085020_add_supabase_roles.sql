/*
  # Supabase Role System Migration
  
  This migration:
  1. Sets up Supabase role system
  2. Creates admin access policies for all tables
  3. Migrates existing admin users to the new role system
*/

-- Create admin and superadmin roles in Supabase
DO $$ 
BEGIN
  -- Create roles if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'superadmin') THEN
    CREATE ROLE superadmin;
  END IF;
END $$;

-- Function to check if user has admin access
CREATE OR REPLACE FUNCTION has_admin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND (raw_user_meta_data->>'role')::text IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has superadmin access
CREATE OR REPLACE FUNCTION has_superadmin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND (raw_user_meta_data->>'role')::text = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION has_admin_access TO authenticated;
GRANT EXECUTE ON FUNCTION has_superadmin_access TO authenticated;

-- Migrate existing admin users to the new role system
DO $$
DECLARE
    admin_record RECORD;
BEGIN
    FOR admin_record IN SELECT user_id, role FROM admins LOOP
        UPDATE auth.users
        SET raw_user_meta_data = 
            CASE 
                WHEN raw_user_meta_data IS NULL THEN 
                    jsonb_build_object('role', admin_record.role)
                ELSE 
                    raw_user_meta_data || jsonb_build_object('role', admin_record.role)
            END
        WHERE id = admin_record.user_id;
    END LOOP;
END $$;

-- Create admin access policies for all tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('admins', 'admin_invitations') -- Exclude admin tables
    LOOP
        -- Drop existing policies if they exist
        EXECUTE format('DROP POLICY IF EXISTS "Admin access" ON %I', table_record.table_name);
        
        -- Create new admin access policy
        EXECUTE format('
            CREATE POLICY "Admin access" ON %I
            FOR ALL
            TO authenticated
            USING (has_admin_access())
        ', table_record.table_name);
    END LOOP;
END $$;

-- Add comments
COMMENT ON FUNCTION has_admin_access IS 'Checks if the current user has admin or superadmin role';
COMMENT ON FUNCTION has_superadmin_access IS 'Checks if the current user has superadmin role'; 