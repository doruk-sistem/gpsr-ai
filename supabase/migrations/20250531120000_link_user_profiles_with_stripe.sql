/*
  # Link User Profiles with Stripe System
  
  This migration creates relationships between user_profiles and stripe tables
  to allow accessing stripe subscription data through user_profiles.
*/

-- Add foreign key relationship from stripe_customers to user_profiles
-- stripe_customers.user_id already references auth.users(id)
-- user_profiles.id also references auth.users(id)
-- So we have an implicit relationship through auth.users

-- Create a single view that combines user_profiles with stripe subscription data
-- Access control is handled by the underlying table policies (user_profiles has RLS)
-- security_invoker = true means the view uses the current user's permissions
CREATE OR REPLACE VIEW user_profiles_with_stripe WITH (security_invoker = true) AS
SELECT 
    up.*,
    -- Include full stripe_customers data as JSON
    CASE 
        WHEN sc.customer_id IS NOT NULL THEN row_to_json(sc)
        ELSE NULL 
    END as stripe_customer,
    -- Include full stripe_subscriptions data as JSON
    CASE 
        WHEN ss.customer_id IS NOT NULL THEN row_to_json(ss)
        ELSE NULL 
    END as stripe_subscription,
    -- Computed fields for convenience
    CASE
        WHEN ss.status = 'trialing' THEN true
        ELSE false
    END as is_in_trial,
    CASE
        WHEN ss.status IN ('active', 'trialing', 'past_due') THEN true
        ELSE false
    END as has_active_subscription
FROM user_profiles up
LEFT JOIN stripe_customers sc ON up.id = sc.user_id AND sc.deleted_at IS NULL
LEFT JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id AND ss.deleted_at IS NULL;

-- Grant permissions
GRANT SELECT ON user_profiles_with_stripe TO authenticated;

-- Add helpful comment
COMMENT ON VIEW user_profiles_with_stripe IS 'User profiles combined with their stripe subscription data. Access control is handled by underlying table RLS policies.'; 