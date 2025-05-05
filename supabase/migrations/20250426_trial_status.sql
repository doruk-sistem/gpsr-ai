-- supabase/migrations/20250426_trial_status.sql
/*
# Trial Status Tracking

1. Changes:
  - Add trial-specific fields to `stripe_subscriptions` table
    - `trial_start` (bigint)
    - `trial_end` (bigint) 
    - `is_trial_used` (boolean)

2. Views:
  - Enhance `stripe_user_subscriptions` view to include trial information
*/

-- Add trial-specific fields to subscriptions table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'trial_start'
  ) THEN
    ALTER TABLE stripe_subscriptions 
    ADD COLUMN trial_start BIGINT DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'trial_end'
  ) THEN
    ALTER TABLE stripe_subscriptions 
    ADD COLUMN trial_end BIGINT DEFAULT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stripe_subscriptions' AND column_name = 'is_trial_used'
  ) THEN
    ALTER TABLE stripe_subscriptions 
    ADD COLUMN is_trial_used BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update the view to include trial information
CREATE OR REPLACE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
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
    END as is_in_trial
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

-- Create function to check trial eligibility for a user
CREATE OR REPLACE FUNCTION is_trial_eligible(
  _user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  _is_eligible BOOLEAN;
BEGIN
  SELECT 
    NOT EXISTS (
      SELECT 1 FROM stripe_customers c
      JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
      WHERE c.user_id = _user_id
      AND s.is_trial_used = TRUE
    ) INTO _is_eligible;
  
  RETURN _is_eligible;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_trial_eligible TO authenticated;
