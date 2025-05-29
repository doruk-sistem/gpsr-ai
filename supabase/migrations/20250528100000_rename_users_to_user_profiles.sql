/**
 * RENAME USERS TABLE TO USER_PROFILES
 * This migration renames the users table to user_profiles to avoid confusion with auth.users
 * and updates all related functions, policies, and references.
 */

-- Step 1: Rename the table
ALTER TABLE public.users RENAME TO user_profiles;

-- Step 2: Update table comments
COMMENT ON TABLE public.user_profiles IS 'User profile information and roles.';
COMMENT ON COLUMN public.user_profiles.id IS 'Supabase Auth user reference.';
COMMENT ON COLUMN public.user_profiles.role IS 'User role: user, admin, superadmin.';

-- Step 3: Update the authorize function to use new table name
CREATE OR REPLACE FUNCTION public.authorize(
  requested_permission app_permission
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_var app_role;
  bind_permissions int;
BEGIN
  -- Get user's role from user_profiles table
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

-- Step 4: Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE 
  is_first_user boolean;
BEGIN
  -- Check if this is the first user
  SELECT count(*) = 0 FROM auth.users INTO is_first_user;
  
  -- Insert into user_profiles table
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

-- Step 5: Update the custom_access_token_hook function
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_role public.app_role;
BEGIN
  -- Get user's role from user_profiles table
  SELECT role INTO user_role 
  FROM public.user_profiles 
  WHERE id = (event->>'user_id')::uuid;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    -- Add role information as claim
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  ELSE 
    -- Mark as null if role not found
    claims := jsonb_set(claims, '{user_role}', 'null');
  END IF;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Return the updated event
  RETURN event;
END;
$$;

-- Step 6: Update grants for supabase_auth_admin
GRANT ALL ON TABLE public.user_profiles TO supabase_auth_admin;

-- Step 7: Drop old policy and create new one for auth admin
DROP POLICY IF EXISTS "Auth admin can read users for JWT claims" ON public.user_profiles;
CREATE POLICY "Auth admin can read user profiles for JWT claims" ON public.user_profiles
AS PERMISSIVE FOR SELECT
TO supabase_auth_admin
USING (true);

-- Step 8: Update realtime publication
-- Remove old table from publication (if it exists) and add new one
DO $$
BEGIN
  -- Try to remove the old table from publication
  BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.users;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore error if table is not in publication
    NULL;
  END;
  
  -- Try to add new table to publication (if not already there)
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore error if table is already in publication
    NULL;
  END;
END $$;

-- Step 9: Update replica identity
ALTER TABLE public.user_profiles REPLICA IDENTITY FULL; 