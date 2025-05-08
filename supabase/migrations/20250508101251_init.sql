/*
  # GPSR-AI Database Schema Migration
  
  This migration file contains the following structures:
  
  1. Core Business Logic Tables
     - manufacturers: Manufacturer information
     - products: Product information
  
  2. Stripe Integration
     - stripe_customers: User-Stripe customer relationship
     - stripe_subscriptions: Subscription information and trial period tracking
     - stripe_orders: Order information for one-time payments
     - trial_emails: Trial period notification tracking
  
  3. Helper Functions
     - is_trial_eligible: Checks if the user is eligible for a trial period
     - has_received_trial_email: Checks if a specific email has been sent
  
  4. Views
     - stripe_user_subscriptions: For users to view their subscription information
     - stripe_user_orders: Users' order history
     - user_trial_emails: Users' trial period notifications
*/

-- ===============================
-- CORE BUSINESS LOGIC TABLES
-- ===============================

-- Manufacturer Table
CREATE TABLE IF NOT EXISTS manufacturers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    logo_image_url text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    authorised_signatory_name text NOT NULL,
    country text NOT NULL,
    position text NOT NULL,
    signature_image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Product Table
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category text NOT NULL,
    sub_category text NOT NULL,
    name text NOT NULL,
    require_ce_ukca_marking boolean NOT NULL,
    batch_number text NOT NULL,
    model_name text NOT NULL,
    image_urls text[] NOT NULL,
    specification text[] NOT NULL,
    directives text[] NOT NULL,
    regulations text[] NOT NULL,
    standards text[] NOT NULL,
    manufacturer_id uuid REFERENCES manufacturers(id),
    authorised_representative_in_eu text NOT NULL,
    authorised_representative_in_uk text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- ===============================
-- STRIPE INTEGRATION
-- ===============================

-- Stripe Customer Table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  customer_id text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone DEFAULT null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Subscription Status Enum Type
CREATE TYPE stripe_subscription_status AS ENUM (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
);

-- Stripe Subscription Table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text UNIQUE NOT NULL,
  subscription_id text DEFAULT null,
  price_id text DEFAULT null,
  current_period_start bigint DEFAULT null,
  current_period_end bigint DEFAULT null,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text DEFAULT null,
  payment_method_last4 text DEFAULT null,
  status stripe_subscription_status NOT NULL DEFAULT 'not_started',
  trial_start bigint DEFAULT null,
  trial_end bigint DEFAULT null,
  is_trial_used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone DEFAULT null
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
    ON stripe_subscriptions
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Order Status Enum Type
CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

-- Stripe Order Table
CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    checkout_session_id text NOT NULL,
    payment_intent_id text NOT NULL,
    customer_id text NOT NULL,
    amount_subtotal bigint NOT NULL,
    amount_total bigint NOT NULL,
    currency text NOT NULL,
    payment_status text NOT NULL,
    status stripe_order_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone DEFAULT null
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
    ON stripe_orders
    FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT customer_id
            FROM stripe_customers
            WHERE user_id = auth.uid() AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Notification Types Enum
CREATE TYPE trial_email_type AS ENUM (
  'trial_started',
  'trial_reminder_7days',
  'trial_reminder_48hours',
  'trial_ended',
  'trial_converted',
  'trial_canceled'
);

-- Trial Period Notifications Table
CREATE TABLE IF NOT EXISTS trial_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email_type trial_email_type NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE trial_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trial emails"
  ON trial_emails
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Administrators can manage all trial emails"
  ON trial_emails
  FOR ALL
  TO service_role
  USING (true);

-- ===============================
-- HELPER FUNCTIONS
-- ===============================

-- Function to check if user is eligible for trial period
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

-- Function to check if a specific email has been sent
CREATE OR REPLACE FUNCTION has_received_trial_email(
  _user_id UUID,
  _email_type trial_email_type
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM trial_emails 
    WHERE user_id = _user_id 
    AND email_type = _email_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- VIEWS
-- ===============================

-- User Subscription View
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

-- User Order View
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
AND o.deleted_at IS NULL;

-- User Trial Period Notifications View
CREATE OR REPLACE VIEW user_trial_emails WITH (security_invoker = true) AS
SELECT 
    te.email_type,
    te.sent_at,
    te.metadata
FROM trial_emails te
WHERE te.user_id = auth.uid()
ORDER BY te.sent_at DESC;

-- ===============================
-- PERMISSIONS
-- ===============================

GRANT SELECT ON stripe_user_subscriptions TO authenticated;
GRANT SELECT ON stripe_user_orders TO authenticated;
GRANT SELECT ON user_trial_emails TO authenticated;
GRANT EXECUTE ON FUNCTION is_trial_eligible TO authenticated;
GRANT EXECUTE ON FUNCTION has_received_trial_email TO authenticated;