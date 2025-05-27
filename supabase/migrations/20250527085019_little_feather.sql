/*
  # Fix Admin Helpers Migration
  
  This migration ensures that the admin-related functions work correctly by:
  
  1. Ensuring the admins table has the correct structure
  2. Adding proper indexes for performance
  3. Updating the is_admin and is_superadmin functions to be more robust
*/

-- Make sure the admins table has the correct structure
DO $$ 
BEGIN
  -- Ensure role column exists with proper constraints
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'role'
  ) THEN
    ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin'));
  END IF;

  -- Ensure unique constraint on user_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Update is_admin function to be more robust
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update is_superadmin function to be more robust
CREATE OR REPLACE FUNCTION is_superadmin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE admins.user_id = $1 AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION is_superadmin TO authenticated;