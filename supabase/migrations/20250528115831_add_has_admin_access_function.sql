/**
 * ADD HAS_ADMIN_ACCESS FUNCTION
 * This migration adds the has_admin_access function to the public schema
 * This function is used to check if the current user has admin access
 */

-- Ensure has_admin_access function exists (in case previous migrations haven't run)
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