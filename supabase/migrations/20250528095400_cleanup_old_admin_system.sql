/**
 * CLEANUP OLD ADMIN SYSTEM
 * This migration completely cleans up the old admin system and prevents conflicts with the new role-based system.
 */

-- Clean up everything related to old admin table (if it still exists)
drop table if exists admins cascade;
drop table if exists admin_invitations cascade;

-- Clean up old admin functions
drop function if exists is_admin(uuid) cascade;
drop function if exists is_superadmin(uuid) cascade;
drop function if exists has_admin_access() cascade;
drop function if exists has_superadmin_access() cascade;

-- Clean up old raw_user_meta_data based functions (from previous migrations)
do $$
declare
    func_record record;
begin
    for func_record in 
        select routine_name, routine_schema
        from information_schema.routines
        where routine_schema = 'public'
        and routine_name like '%admin%'
        and routine_name not in ('has_admin_access', 'has_superadmin_access', 'custom_access_token_hook')
    loop
        execute format('drop function if exists %I.%I cascade', func_record.routine_schema, func_record.routine_name);
    end loop;
end $$;

-- Clean up old policies and keep only the new system policies
do $$
declare
    table_record record;
    policy_record record;
begin
    for table_record in 
        select table_name 
        from information_schema.tables 
        where table_schema = 'public' 
        and table_type = 'BASE TABLE'
    loop
        -- Remove old admin policies
        for policy_record in 
            select policyname
            from pg_policies
            where tablename = table_record.table_name
            and schemaname = 'public'
            and policyname in ('Admin access', 'Users can view their own admin record')
        loop
            execute format('drop policy if exists "%s" on %I', policy_record.policyname, table_record.table_name);
        end loop;
    end loop;
end $$;

-- Clean up Supabase roles (if they were created)
do $$
begin
    if exists (select 1 from pg_roles where rolname = 'admin') then
        drop role admin;
    end if;
    
    if exists (select 1 from pg_roles where rolname = 'superadmin') then
        drop role superadmin;
    end if;
exception when others then
    -- Role might be in use, ignore errors
    null;
end $$; 