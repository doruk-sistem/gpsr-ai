-- 1. Update stripe_user_subscriptions view without product_limit
DROP VIEW IF EXISTS stripe_user_subscriptions;

CREATE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4,
    s.trial_start,
    s.trial_end,
    s.is_trial_used,
    CASE
        WHEN s.status = 'trialing' THEN true
        ELSE false
    END as is_in_trial,
    CASE
        WHEN s.status IN ('active', 'trialing', 'past_due') THEN true
        ELSE false
    END as has_active_subscription
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

-- 2. Remove old trigger and function (if they still exist)
DROP TRIGGER IF EXISTS update_subscription_product_limit_trigger ON stripe_subscriptions;
DROP FUNCTION IF EXISTS update_subscription_product_limit();

-- 3. Remove product_limit column from stripe_subscriptions table
ALTER TABLE stripe_subscriptions 
DROP COLUMN IF EXISTS product_limit;
