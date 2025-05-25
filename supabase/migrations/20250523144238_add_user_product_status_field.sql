-- Create enum type for user product status
CREATE TYPE user_product_status AS ENUM ('pending', 'reject', 'completed', 'incomplete');

-- Add status column to user_products table with default value 'incomplete'
ALTER TABLE user_products 
ADD COLUMN status user_product_status DEFAULT 'incomplete' NOT NULL;

-- Add index for better query performance on status column
CREATE INDEX idx_user_products_status ON user_products(status);

-- Add index for better query performance on status and user_id combination
CREATE INDEX idx_user_products_user_status ON user_products(user_id, status);
