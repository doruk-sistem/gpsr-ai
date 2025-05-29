/**
 * FIX ADMIN ACCESS POLICY FOR USER_PROFILES
 * This migration adds the missing "Admin full access" policy to user_profiles table
 * that allows admin and superadmin users to perform all operations.
 */

-- Ensure has_admin_access function exists and works correctly
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS BOOLEAN AS $$
DECLARE
  user_role_var app_role;
BEGIN
  -- Get user's role from user_profiles table
  SELECT role INTO user_role_var
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  -- Return true if user is admin or superadmin
  RETURN user_role_var IN ('admin', 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add the missing admin full access policy
CREATE POLICY "Admin full access" ON public.user_profiles
FOR ALL
TO authenticated
USING (has_admin_access())
WITH CHECK (has_admin_access());