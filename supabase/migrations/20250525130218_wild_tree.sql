/*
  # Fix Admin Table Migration
  
  This migration fixes issues with the admin table structure and adds a unique constraint
  to ensure there's only one admin record per user.
  
  1. Ensures the role column exists with proper constraints
  2. Adds a unique constraint on user_id
  3. Updates the admin_invitations table to handle token usage properly
*/

-- Make sure role column exists with proper constraints
DO $$ 
BEGIN
  -- Check if role column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'role'
  ) THEN
    -- Add role column if it doesn't exist
    ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin'));
  END IF;
END $$;

-- Add unique constraint on user_id if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Fix the use_admin_invitation function to handle the unique constraint properly
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
  
  -- Create admin record, handling the case where the user might already be an admin
  INSERT INTO admins (user_id, role)
  VALUES (user_id, invitation_record.role)
  ON CONFLICT (user_id) 
  DO UPDATE SET role = invitation_record.role, updated_at = now();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial superadmin if not exists
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- First check if the user exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'furkan.arslan@doruksistem.com.tr';
  
  -- If user exists, make them superadmin
  IF v_user_id IS NOT NULL THEN
    -- Insert or update admin record
    INSERT INTO admins (user_id, role)
    VALUES (v_user_id, 'superadmin')
    ON CONFLICT (user_id) 
    DO UPDATE SET role = 'superadmin', updated_at = now();
  END IF;
END $$;