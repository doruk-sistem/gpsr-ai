-- This view provides a filtered list of user orders from Stripe, excluding any NULL order records.
-- It joins stripe_customers with stripe_orders and only returns:
-- - Orders belonging to the authenticated user (via auth.uid())
-- - Non-deleted customer and order records
-- - Orders with valid IDs (o.id IS NOT NULL)
-- This helps prevent invalid/incomplete order data from appearing in invoice listings and reports.
CREATE OR REPLACE VIEW stripe_user_orders WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL
AND o.id IS NOT NULL; 