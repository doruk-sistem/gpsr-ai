-- 1. Add product_limit column to stripe_subscriptions table
ALTER TABLE stripe_subscriptions 
ADD COLUMN IF NOT EXISTS product_limit integer DEFAULT 0;

-- 2. Create function to update product_limit from Stripe metadata
CREATE OR REPLACE FUNCTION update_subscription_product_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product_limit from Stripe metadata when price_id changes
    IF NEW.price_id IS NOT NULL AND (OLD.price_id IS NULL OR OLD.price_id != NEW.price_id) THEN
        -- Get product_limit from Stripe metadata
        NEW.product_limit := (
            SELECT (metadata->>'product_limit')::integer
            FROM stripe_prices
            WHERE id = NEW.price_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to update product_limit
DROP TRIGGER IF EXISTS update_subscription_product_limit_trigger ON stripe_subscriptions;
CREATE TRIGGER update_subscription_product_limit_trigger
    BEFORE INSERT OR UPDATE ON stripe_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscription_product_limit();

-- 4. Drop existing view
DROP VIEW IF EXISTS stripe_user_subscriptions;

-- 5. Create new view with updated fields
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