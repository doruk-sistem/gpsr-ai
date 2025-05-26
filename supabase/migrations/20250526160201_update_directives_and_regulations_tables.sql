-- Drop old columns from user_product_user_directives
ALTER TABLE user_product_user_directives
DROP COLUMN ref_no,
DROP COLUMN edition_date,
DROP COLUMN title;

-- Add new columns to user_product_user_directives
ALTER TABLE user_product_user_directives
ADD COLUMN directive_number TEXT NOT NULL,
ADD COLUMN directive_name TEXT NOT NULL,
ADD COLUMN directive_description TEXT,
ADD COLUMN directive_edition_date TEXT NOT NULL;
