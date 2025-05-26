-- Create user_product_user_directives table
CREATE TABLE user_product_user_directives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_no TEXT NOT NULL,
    edition_date TEXT NOT NULL,
    title TEXT NOT NULL,
    user_product_id UUID NOT NULL REFERENCES user_products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create user_product_user_regulations table
CREATE TABLE user_product_user_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulation_number TEXT NOT NULL,
    regulation_name TEXT NOT NULL,
    regulation_description TEXT,
    regulation_edition_date TEXT NOT NULL,
    user_product_id UUID NOT NULL REFERENCES user_products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better query performance
CREATE INDEX idx_user_product_user_directives_user_product_id ON user_product_user_directives(user_product_id);
CREATE INDEX idx_user_product_user_directives_user_id ON user_product_user_directives(user_id);
CREATE INDEX idx_user_product_user_regulations_user_product_id ON user_product_user_regulations(user_product_id);
CREATE INDEX idx_user_product_user_regulations_user_id ON user_product_user_regulations(user_id);

-- Add RLS policies
ALTER TABLE user_product_user_directives ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_product_user_regulations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_product_user_directives
CREATE POLICY "Users can view their own directives"
    ON user_product_user_directives
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own directives"
    ON user_product_user_directives
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own directives"
    ON user_product_user_directives
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own directives"
    ON user_product_user_directives
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for user_product_user_regulations
CREATE POLICY "Users can view their own regulations"
    ON user_product_user_regulations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own regulations"
    ON user_product_user_regulations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own regulations"
    ON user_product_user_regulations
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own regulations"
    ON user_product_user_regulations
    FOR DELETE
    USING (auth.uid() = user_id);
