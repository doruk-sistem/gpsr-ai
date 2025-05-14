/*
  # Authorised Representative Tables Migration
  
  This migration adds tables for managing authorised representatives:
  
  1. authorised_representative_addresses: 
     Stores user's self-managed EU or UK addresses for authorised representation
  
  2. authorised_representative_requests:
     Stores service requests for Dorukwell's representation services
*/

-- ===============================
-- AUTHORISED REPRESENTATIVE ADDRESSES TABLE
-- ===============================

-- Create a type for authorised representative region
CREATE TYPE representative_region AS ENUM ('eu', 'uk');

-- Create table for storing authorised representative addresses
CREATE TABLE IF NOT EXISTS authorised_representative_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    region representative_region NOT NULL,
    company_name text NOT NULL,
    company_address text NOT NULL,
    company_logo_url text,
    country text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for authorised_representative_addresses table
ALTER TABLE authorised_representative_addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for authorised_representative_addresses table
CREATE POLICY "Users can view their own representative addresses"
    ON authorised_representative_addresses
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own representative addresses"
    ON authorised_representative_addresses
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own representative addresses"
    ON authorised_representative_addresses
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own representative addresses"
    ON authorised_representative_addresses
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON authorised_representative_addresses TO authenticated;

-- ===============================
-- AUTHORISED REPRESENTATIVE REQUESTS TABLE
-- ===============================

-- Create a type for request status
CREATE TYPE representative_request_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

-- Create a type for business role
CREATE TYPE business_role AS ENUM (
    'manufacturer',
    'importer',
    'distributor'
);

-- Create table for storing authorised representative service requests
CREATE TABLE IF NOT EXISTS authorised_representative_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    region representative_region NOT NULL,
    -- Company details
    company_name text NOT NULL,
    company_number text NOT NULL,
    vat_number text,
    street_address text NOT NULL,
    city text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    -- Contact info
    contact_name text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text NOT NULL,
    contact_position text NOT NULL,
    -- Additional info
    website_url text,
    business_role business_role NOT NULL,
    -- Product details
    product_category text NOT NULL,
    product_information text NOT NULL,
    -- Compliance details
    ce_ukca_marking text NOT NULL,
    technical_file_ready text NOT NULL,
    required_tests_conducted text NOT NULL,
    test_reports_available text NOT NULL,
    test_reports_file_url text,
    -- Confirmations
    confirm_accuracy boolean NOT NULL,
    confirm_responsibility boolean NOT NULL,
    confirm_terms boolean NOT NULL,
    -- Status
    status representative_request_status NOT NULL DEFAULT 'pending',
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for authorised_representative_requests table
ALTER TABLE authorised_representative_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for authorised_representative_requests table
CREATE POLICY "Users can view their own representative requests"
    ON authorised_representative_requests
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own representative requests"
    ON authorised_representative_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending representative requests"
    ON authorised_representative_requests
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND status = 'pending');

-- Simplified cancel policy that doesn't rely on NEW reference
CREATE POLICY "Users can cancel their own pending representative requests"
    ON authorised_representative_requests
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (status = 'cancelled');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON authorised_representative_requests TO authenticated;
