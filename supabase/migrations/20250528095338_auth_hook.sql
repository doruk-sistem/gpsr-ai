/**
 * AUTH HOOKS
 * Create an auth hook to add a custom claim to the access token JWT.
 * This hook adds role information from the users table to the JWT token.
 */

-- Create the auth hook function
-- https://supabase.com/docs/guides/auth/auth-hooks#hook-custom-access-token
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Get user's role from users table
    select role into user_role 
    from public.users 
    where id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Add role information as claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else 
      -- Mark as null if role not found
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the updated event
    return event;
  end;
$$;

-- Grant usage on schema to supabase_auth_admin
grant usage on schema public to supabase_auth_admin;

-- Grant execute permission on function to supabase_auth_admin
grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

-- Revoke execute permission from authenticated and anon users
revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon;

-- Grant access to users table for supabase_auth_admin
grant all
  on table public.users
  to supabase_auth_admin;

-- Revoke users table permissions from authenticated and anon users (RLS policies will take effect)
revoke all
  on table public.users
  from authenticated, anon;

-- Create policy for supabase_auth_admin to read users table for JWT claims
create policy "Auth admin can read users for JWT claims" on public.users
as permissive for select
to supabase_auth_admin
using (true);