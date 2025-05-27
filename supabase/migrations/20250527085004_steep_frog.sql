-- Add role field to admins table and create admin_invitations table

-- Add role field to existing admins table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'role'
  ) THEN
    ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin'));
  END IF;
END $$;

-- We need to commit this change before using it
COMMIT;

-- Create invitations table for new admins
CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NULL,
  UNIQUE(email)
);

-- Enable RLS for admin_invitations
ALTER TABLE admin_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can view invitations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_invitations' 
    AND policyname = 'Admins can view invitations'
  ) THEN
    CREATE POLICY "Admins can view invitations"
      ON admin_invitations
      FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM admins WHERE user_id = auth.uid()
      ));
  END IF;
END $$;

-- Only superadmins can insert/update/delete invitations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_invitations' 
    AND policyname = 'Superadmins can manage invitations'
  ) THEN
    CREATE POLICY "Superadmins can manage invitations"
      ON admin_invitations
      FOR ALL
      USING (EXISTS (
        SELECT 1 FROM admins WHERE user_id = auth.uid() AND role = 'superadmin'
      ));
  END IF;
END $$;

-- Function to check if a user is a superadmin
CREATE OR REPLACE FUNCTION is_superadmin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE user_id = $1 AND role = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and use an invitation token
CREATE OR REPLACE FUNCTION use_admin_invitation(token TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  invitation_record admin_invitations;
BEGIN
  -- Find and lock the invitation record
  SELECT * INTO invitation_record
  FROM admin_invitations
  WHERE admin_invitations.token = token
  AND used_at IS NULL
  AND expires_at > now()
  FOR UPDATE;
  
  -- Check if invitation exists and is valid
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Mark invitation as used
  UPDATE admin_invitations
  SET used_at = now()
  WHERE admin_invitations.token = token;
  
  -- Create admin record
  INSERT INTO admins (user_id, role)
  VALUES (user_id, invitation_record.role);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_invitations TO authenticated;
GRANT EXECUTE ON FUNCTION is_superadmin TO authenticated;
GRANT EXECUTE ON FUNCTION use_admin_invitation TO authenticated;

-- Insert initial superadmin (Furkan Arslan)
-- This is now a separate transaction that will run after the role column is committed
DO $$
DECLARE
  v_user_id UUID;  -- Using a different variable name to avoid ambiguity
BEGIN
  -- First check if the user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'furkan.arslan@doruksistem.com.tr';
  
  -- If user exists, make them superadmin
  IF v_user_id IS NOT NULL THEN
    -- Check if admin record already exists
    IF NOT EXISTS (SELECT 1 FROM admins WHERE user_id = v_user_id) THEN
      INSERT INTO admins (user_id, role) VALUES (v_user_id, 'superadmin');
    ELSE
      -- Update existing record to superadmin
      UPDATE admins SET role = 'superadmin' WHERE user_id = v_user_id;
    END IF;
  END IF;
END $$;