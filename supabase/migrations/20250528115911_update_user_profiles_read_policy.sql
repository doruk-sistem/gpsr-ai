/**
 * UPDATE USER PROFILES READ POLICY
 * This migration updates the read policy for user_profiles table to restrict access:
 * - Regular users can only read their own profile
 * - Admin and superadmin users can read all profiles
 */

-- Drop the current public read access policy
DROP POLICY IF EXISTS "Public read access" ON public.user_profiles;

-- Create new restricted read policy
-- Users can only read their own profile, unless they are admin/superadmin
CREATE POLICY "Restricted profile read access" ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  -- User can read their own profile
  auth.uid() = id 
  OR 
  -- OR user has admin access (admin/superadmin can read all profiles)
  has_admin_access()
); 