
-- Packages Table
create table if not exists packages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    product_limit integer not null,
    monthly_price numeric not null,
    annually_price numeric not null
);

-- Manufacturer Table
create table if not exists manufacturers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    logo_image_url text not null,
    phone text not null,
    address text not null,
    authorised_signatory_name text not null,
    country text not null,
    position text not null,
    signature_image_url text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Insert default packages
insert into packages (name, product_limit, monthly_price, annually_price) values
('Starter', 5, 39, 390),
('Growth', 20, 49, 490),
('Scale', 50, 59, 590),
('Professional', 100, 69, 690),
('Business', 200, 79, 790),
('Enterprise', 500, 89, 890);

/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`: Links Supabase users to Stripe customers
      - Includes `user_id` (references `auth.users`)
      - Stores Stripe `customer_id`
      - Implements soft delete

    - `stripe_subscriptions`: Manages subscription data
      - Tracks subscription status, periods, and payment details
      - Links to `stripe_customers` via `customer_id`
      - Custom enum type for subscription status
      - Implements soft delete

    - `stripe_orders`: Stores order/purchase information
      - Records checkout sessions and payment intents
      - Tracks payment amounts and status
      - Custom enum type for order status
      - Implements soft delete

  2. Views
    - `stripe_user_subscriptions`: Secure view for user subscription data
      - Joins customers and subscriptions
      - Filtered by authenticated user

    - `stripe_user_orders`: Secure view for user order history
      - Joins customers and orders
      - Filtered by authenticated user

  3. Security
    - Enables Row Level Security (RLS) on all tables
    - Implements policies for authenticated users to view their own data
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) not null unique,
  customer_id text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
    ON stripe_customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

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

CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint primary key generated always as identity,
  customer_id text unique not null,
  subscription_id text default null,
  price_id text default null,
  current_period_start bigint default null,
  current_period_end bigint default null,
  cancel_at_period_end boolean default false,
  payment_method_brand text default null,
  payment_method_last4 text default null,
  status stripe_subscription_status not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone default null
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

CREATE TYPE stripe_order_status AS ENUM (
    'pending',
    'completed',
    'canceled'
);

CREATE TABLE IF NOT EXISTS stripe_orders (
    id bigint primary key generated always as identity,
    checkout_session_id text not null,
    payment_intent_id text not null,
    customer_id text not null,
    amount_subtotal bigint not null,
    amount_total bigint not null,
    currency text not null,
    payment_status text not null,
    status stripe_order_status not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    deleted_at timestamp with time zone default null
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

-- View for user subscriptions
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
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

GRANT SELECT ON stripe_user_subscriptions TO authenticated;

-- View for user orders
CREATE VIEW stripe_user_orders WITH (security_invoker) AS
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

/*
# Trial Emails Tracking

1. New Tables
  - `trial_emails` - Tracks all trial-related emails sent to users
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `email_type` (enum)
    - `sent_at` (timestamp)
    - `metadata` (JSONB)

2. Security
  - Enable RLS on `trial_emails` table
  - Add policy for administrators to manage trial emails
  - Add policy for users to view their own trial emails
*/

-- Create enum type for email types
CREATE TYPE trial_email_type AS ENUM (
  'trial_started',
  'trial_reminder_7days',
  'trial_reminder_48hours',
  'trial_ended',
  'trial_converted',
  'trial_canceled'
);

-- Create table for tracking trial emails
CREATE TABLE IF NOT EXISTS trial_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email_type trial_email_type NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE trial_emails ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own trial emails
CREATE POLICY "Users can view their own trial emails"
  ON trial_emails
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create policy for administrators to manage all trial emails
CREATE POLICY "Administrators can manage all trial emails"
  ON trial_emails
  FOR ALL
  TO service_role
  USING (true);

-- Create function to check if a specific trial email has been sent
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

-- Create view for users to check their trial email status
CREATE OR REPLACE VIEW user_trial_emails WITH (security_invoker = true) AS
SELECT 
  te.email_type,
  te.sent_at,
  te.metadata
FROM trial_emails te
WHERE te.user_id = auth.uid()
ORDER BY te.sent_at DESC;

-- Grant select on the view to authenticated users
GRANT SELECT ON user_trial_emails TO authenticated;

/**
# Product Table

1. Changes:
  - Add `category` and `sub_category` columns to the `products` table
  - Add `require_ce_ukca_marking` column to the `products` table
  - Add `batch_number` column to the `products` table

*/
create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    category text not null,
    sub_category text not null,
    name text not null,
    require_ce_ukca_marking boolean not null,
    batch_number text not null,
    model_name text not null,
    image_urls text[] not null,
    specification text[] not null,
    directives text[] not null,
    regulations text[] not null,
    standards text[] not null,
    manufacturer_id uuid references manufacturers(id),
    authorised_representative_in_eu text not null,
    authorised_representative_in_uk text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
)