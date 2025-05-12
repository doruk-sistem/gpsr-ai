-- 1. Remove old trigger and function
DROP TRIGGER IF EXISTS update_subscription_product_limit_trigger ON stripe_subscriptions;
DROP FUNCTION IF EXISTS update_subscription_product_limit();

-- 2. Keep product_limit column, but value will now be updated directly by webhook
-- We can use ALTER TABLE stripe_subscriptions if we want to change the type
-- ALTER TABLE stripe_subscriptions ALTER COLUMN product_limit SET DEFAULT 0;

-- 3. Update stripe_user_subscriptions view
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
    END as has_active_subscription,
    s.product_limit
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL; 