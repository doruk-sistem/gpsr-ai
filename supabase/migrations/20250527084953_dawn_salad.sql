/*
  # Admin Users Table
  
  This migration creates a table for storing admin users, allowing role-based access control
  for the admin panel. It also adds a policy to control access to the table.
*/

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Set up RLS policy for admin authentication
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' 
    AND policyname = 'Users can view their own admin record'
  ) THEN
    CREATE POLICY "Users can view their own admin record"
      ON admins
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users
GRANT SELECT ON admins TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;