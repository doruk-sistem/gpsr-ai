-- Add reference columns to user_product_user_directives table
ALTER TABLE user_product_user_directives
ADD COLUMN reference_directive_id BIGINT REFERENCES directives(id);

-- Add reference columns to user_product_user_regulations table
ALTER TABLE user_product_user_regulations
ADD COLUMN reference_regulation_id BIGINT REFERENCES regulations(id);

-- Add reference columns to user_product_user_standards table
ALTER TABLE user_product_user_standards
ADD COLUMN reference_standard_id UUID REFERENCES standards(id);

-- Add comments to explain the purpose of these columns
COMMENT ON COLUMN user_product_user_directives.reference_directive_id IS 'Optional reference to the original directive in the directives table';
COMMENT ON COLUMN user_product_user_regulations.reference_regulation_id IS 'Optional reference to the original regulation in the regulations table';
COMMENT ON COLUMN user_product_user_standards.reference_standard_id IS 'Optional reference to the original standard in the standards table';
