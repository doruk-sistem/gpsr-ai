/**
 * FIX ALL FUNCTIONS AND POLICIES
 * This migration fixes all function conflicts and ensures proper admin access
 * by updating all functions to use the correct table name (user_profiles)
 */

-- Step 1: Fix the authorize function to use user_profiles table
CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission app_permission
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_var app_role;
  bind_permissions int;
BEGIN
  -- Get user's role from user_profiles table (not users!)
  SELECT role INTO user_role_var
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  -- Return false if user not found
  IF user_role_var IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check permission
  SELECT count(*)
  FROM public.role_permissions
  WHERE role_permissions.permission = authorize.requested_permission
    AND role_permissions.role = user_role_var
  INTO bind_permissions;
  
  RETURN bind_permissions > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 2: Fix has_admin_access to use the authorize function properly
CREATE OR REPLACE FUNCTION public.has_admin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN authorize('admin.access');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 3: Fix has_superadmin_access function
CREATE OR REPLACE FUNCTION public.has_superadmin_access()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN authorize('superadmin.access');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 4: Update handle_new_user function to use user_profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE 
  is_first_user boolean;
BEGIN
  -- Check if this is the first user
  SELECT count(*) = 0 FROM auth.users INTO is_first_user;
  
  -- Insert into user_profiles table (not users!)
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    CASE 
      -- First user becomes superadmin
      WHEN is_first_user THEN 'superadmin'::app_role
      -- Email contains +admin becomes admin
      WHEN position('+admin@' IN new.email) > 0 THEN 'admin'::app_role
      -- Email contains +superadmin becomes superadmin  
      WHEN position('+superadmin@' IN new.email) > 0 THEN 'superadmin'::app_role
      -- Default to user
      ELSE 'user'::app_role
    END
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = auth, public;

-- Step 5: Ensure all necessary policies exist on user_profiles
-- Drop conflicting policies first
DROP POLICY IF EXISTS "Public read access" ON public.user_profiles;
DROP POLICY IF EXISTS "Restricted profile read access" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin full access" ON public.user_profiles;
DROP POLICY IF EXISTS "Own profile update" ON public.user_profiles;

-- Create comprehensive policies
CREATE POLICY "User can read own profile" ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR has_admin_access());

CREATE POLICY "User can update own profile" ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR has_admin_access())
WITH CHECK (auth.uid() = id OR has_admin_access());

CREATE POLICY "Admin full access" ON public.user_profiles
FOR ALL
TO authenticated
USING (has_admin_access())
WITH CHECK (has_admin_access());

-- Step 6: Grant necessary permissions
GRANT ALL ON TABLE public.user_profiles TO authenticated;
GRANT ALL ON TABLE public.role_permissions TO authenticated; 