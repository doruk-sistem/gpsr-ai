-- Migration to add 'rejected' value to user_product_status enum
-- Part 1: Add new enum value

-- Step 1: Add 'rejected' as a new value to the existing enum
ALTER TYPE user_product_status ADD VALUE 'rejected';

-- Add comment to document this change
COMMENT ON TYPE user_product_status IS 'Added rejected status value to replace reject'; 