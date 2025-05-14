/*
  # User Relationship Migration
  
  This migration adds user relationship to manufacturers and products tables,
  linking them to the auth.users table and creating appropriate RLS (Row Level Security) policies.
  
  1. Adding user_id column to manufacturers table
  2. Adding user_id column to products table
  3. Creating RLS policies
*/

-- ===============================
-- MANUFACTURERS TABLE UPDATE
-- ===============================

-- Add user_id column to manufacturers table
ALTER TABLE manufacturers
ADD COLUMN user_id uuid REFERENCES auth.users(id) NOT NULL;

-- Enable RLS for manufacturers table
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;

-- Select policy for manufacturers table
CREATE POLICY "Users can view their own manufacturers"
  ON manufacturers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert policy for manufacturers table
CREATE POLICY "Users can create their own manufacturers"
  ON manufacturers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update policy for manufacturers table
CREATE POLICY "Users can update their own manufacturers"
  ON manufacturers
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Delete policy for manufacturers table
CREATE POLICY "Users can delete their own manufacturers"
  ON manufacturers
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- PRODUCTS TABLE UPDATE
-- ===============================

-- Add user_id column to products table
ALTER TABLE products
ADD COLUMN user_id uuid REFERENCES auth.users(id) NOT NULL;

-- Enable RLS for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Select policy for products table
CREATE POLICY "Users can view their own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert policy for products table
CREATE POLICY "Users can create their own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update policy for products table
CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Delete policy for products table
CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- PERMISSIONS
-- ===============================

-- Grant access permissions to manufacturers and products tables for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON manufacturers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
