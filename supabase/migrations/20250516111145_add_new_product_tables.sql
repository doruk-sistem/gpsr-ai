/*
  # Product Tables Migration
  
  This migration file contains the following structures:
  
  1. Product Categories Table
     - Defines product categories
  
  2. Product Types Table
     - Defines product types and relates them to categories
  
  3. Product Questions Table
     - Defines questions related to products and categories
  
  4. Related RLS (Row Level Security) policies
*/

-- ===============================
-- PRODUCT CATEGORIES TABLE
-- ===============================

CREATE TABLE IF NOT EXISTS product_categories (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone DEFAULT null
);

-- Enable RLS for product_categories table
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Select policy for product_categories table
CREATE POLICY "Users can view product categories"
  ON product_categories
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- ===============================
-- PRODUCT TYPES TABLE
-- ===============================

CREATE TABLE IF NOT EXISTS product_types (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product text NOT NULL,
    description text,
    category_id bigint REFERENCES product_categories(id) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone DEFAULT null,
    user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS for product_types table
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;

-- Select policy for product_types table
CREATE POLICY "Users can view product types"
  ON product_types
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Insert policy for product_types table
CREATE POLICY "Users can create their own product types"
  ON product_types
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update policy for product_types table
CREATE POLICY "Users can update their own product types"
  ON product_types
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Delete policy for product_types table
CREATE POLICY "Users can delete their own product types"
  ON product_types
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- PRODUCT QUESTIONS TABLE
-- ===============================

CREATE TABLE IF NOT EXISTS product_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question text NOT NULL,
    question_description text,
    question_id text,
    category_id bigint REFERENCES product_categories(id) NOT NULL,
    product_id bigint REFERENCES product_types(id) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone DEFAULT null,
    user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS for product_questions table
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

-- Select policy for product_questions table
CREATE POLICY "Users can view product questions"
  ON product_questions
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

-- Insert policy for product_questions table
CREATE POLICY "Users can create their own product questions"
  ON product_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Update policy for product_questions table
CREATE POLICY "Users can update their own product questions"
  ON product_questions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Delete policy for product_questions table
CREATE POLICY "Users can delete their own product questions"
  ON product_questions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================
-- PERMISSIONS
-- ===============================

-- Grant access permissions to product tables for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON product_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_types TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_questions TO authenticated;
