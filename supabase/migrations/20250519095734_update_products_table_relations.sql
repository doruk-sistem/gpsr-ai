/*
  # Update Products Table Relations
  
  This migration modifies the products table to relate it with the new product_categories,
  product_types, and product_questions tables.
  
  Changes:
  1. Add category_id and product_type_id columns to products table
  2. Remove the old category and sub_category text columns
  3. Create a new product_question_answers junction table
  4. Add appropriate foreign key constraints
  5. Create RLS policies
*/

-- Create a temp backup of products table
CREATE TABLE products_backup AS SELECT * FROM products;

-- Step 1: Add new columns to products table
ALTER TABLE products 
ADD COLUMN category_id bigint REFERENCES product_categories(id),
ADD COLUMN product_type_id bigint REFERENCES product_types(id);

-- Step 2: Create a junction table for product questions and answers
CREATE TABLE IF NOT EXISTS product_question_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    question_id uuid REFERENCES product_questions(id) ON DELETE CASCADE,
    answer boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone DEFAULT null,
    user_id uuid REFERENCES auth.users(id) NULL
);

-- Enable RLS for product_question_answers table
ALTER TABLE product_question_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_question_answers
CREATE POLICY "Users can view product question answers"
  ON product_question_answers
  FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Users can create product question answers"
  ON product_question_answers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their product question answers"
  ON product_question_answers
  FOR UPDATE
  TO authenticated
  USING ((user_id = auth.uid()) OR (user_id IS NULL));

CREATE POLICY "Users can delete their product question answers"
  ON product_question_answers
  FOR DELETE
  TO authenticated
  USING ((user_id = auth.uid()) OR (user_id IS NULL));

-- Grant permissions for product_question_answers
GRANT SELECT, INSERT, UPDATE, DELETE ON product_question_answers TO authenticated;

-- Step 3: Create a function to help migrate existing products to use the new category and product type IDs
CREATE OR REPLACE FUNCTION migrate_products_to_new_schema() RETURNS void AS $$
DECLARE
    product_record RECORD;
    category_id_val bigint;
    product_type_id_val bigint;
BEGIN
    -- For each product in the database
    FOR product_record IN SELECT * FROM products_backup LOOP
        -- Try to find matching category
        SELECT id INTO category_id_val 
        FROM product_categories
        WHERE name = product_record.category
        LIMIT 1;
        
        -- Try to find matching product type
        SELECT id INTO product_type_id_val
        FROM product_types
        WHERE product = product_record.sub_category AND 
              (category_id = category_id_val OR category_id IS NULL)
        LIMIT 1;
        
        -- Update the product with the new IDs
        UPDATE products
        SET category_id = category_id_val,
            product_type_id = product_type_id_val
        WHERE id = product_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT migrate_products_to_new_schema();

-- Step 4: Remove the old category and sub_category columns
ALTER TABLE products DROP COLUMN category, DROP COLUMN sub_category;

-- Drop the migration function and temporary table
DROP FUNCTION migrate_products_to_new_schema();
DROP TABLE products_backup;