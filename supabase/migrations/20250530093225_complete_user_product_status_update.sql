-- Migration to complete user_product_status enum update from 'reject' to 'rejected'
-- Part 2: Update data and clean up old enum value

-- Step 1: Update all existing records that have 'reject' status to 'rejected'
UPDATE user_products 
SET status = 'rejected'::user_product_status 
WHERE status = 'reject'::user_product_status;

-- Step 2: Remove the default value temporarily
ALTER TABLE user_products 
ALTER COLUMN status DROP DEFAULT;

-- Step 3: Create a new enum without 'reject'
CREATE TYPE user_product_status_new AS ENUM ('pending', 'rejected', 'completed', 'incomplete');

-- Step 4: Update the column to use the new enum type
ALTER TABLE user_products 
ALTER COLUMN status TYPE user_product_status_new 
USING status::text::user_product_status_new;

-- Step 5: Drop the old enum type
DROP TYPE user_product_status;

-- Step 6: Rename the new enum type to the original name
ALTER TYPE user_product_status_new RENAME TO user_product_status;

-- Step 7: Restore the default value
ALTER TABLE user_products 
ALTER COLUMN status SET DEFAULT 'incomplete'::user_product_status;

-- Add final comment to document this change
COMMENT ON TYPE user_product_status IS 'Status for user products: pending, rejected (formerly reject), completed, incomplete'; 