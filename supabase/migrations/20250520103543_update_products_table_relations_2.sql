/*
  # Update Products Table Relations Migration
  
  This migration updates the products table to establish relationships with authorised representatives:
  
  1. Removes old authorised_representative_in_eu and authorised_representative_in_uk columns
  2. Adds new authorised_representative_eu_id and authorised_representative_uk_id columns that reference authorised_representative_addresses
*/

-- First, drop the old columns
ALTER TABLE products
DROP COLUMN IF EXISTS authorised_representative_in_eu,
DROP COLUMN IF EXISTS authorised_representative_in_uk;

-- Add new columns for authorised representative relationships
ALTER TABLE products
ADD COLUMN authorised_representative_eu_id uuid REFERENCES authorised_representative_addresses(id),
ADD COLUMN authorised_representative_uk_id uuid REFERENCES authorised_representative_addresses(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_authorised_representative_eu_id 
ON products(authorised_representative_eu_id);

CREATE INDEX IF NOT EXISTS idx_products_authorised_representative_uk_id 
ON products(authorised_representative_uk_id);

-- Update RLS policies to include the new relationships
CREATE POLICY "Users can view products with their authorised representatives"
    ON products
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        authorised_representative_eu_id IN (
            SELECT id FROM authorised_representative_addresses 
            WHERE user_id = auth.uid()
        ) OR
        authorised_representative_uk_id IN (
            SELECT id FROM authorised_representative_addresses 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update products with their authorised representatives"
    ON products
    FOR UPDATE
    TO authenticated
    USING (
        user_id = auth.uid() OR
        authorised_representative_eu_id IN (
            SELECT id FROM authorised_representative_addresses 
            WHERE user_id = auth.uid()
        ) OR
        authorised_representative_uk_id IN (
            SELECT id FROM authorised_representative_addresses 
            WHERE user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT SELECT, UPDATE ON products TO authenticated; 