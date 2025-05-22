-- First, create junction tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS public.product_directives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    directive_id BIGINT REFERENCES public.directives(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    UNIQUE(product_id, directive_id)
);

CREATE TABLE IF NOT EXISTS public.product_regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    regulation_id BIGINT REFERENCES public.regulations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    UNIQUE(product_id, regulation_id)
);

CREATE TABLE IF NOT EXISTS public.product_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    standard_id UUID REFERENCES public.standards(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    UNIQUE(product_id, standard_id)
);

-- Add RLS policies for junction tables
ALTER TABLE public.product_directives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_standards ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_directives
CREATE POLICY "Users can view their own product directives"
    ON public.product_directives
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own product directives"
    ON public.product_directives
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own product directives"
    ON public.product_directives
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own product directives"
    ON public.product_directives
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for product_regulations
CREATE POLICY "Users can view their own product regulations"
    ON public.product_regulations
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own product regulations"
    ON public.product_regulations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own product regulations"
    ON public.product_regulations
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own product regulations"
    ON public.product_regulations
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS policies for product_standards
CREATE POLICY "Users can view their own product standards"
    ON public.product_standards
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own product standards"
    ON public.product_standards
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own product standards"
    ON public.product_standards
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own product standards"
    ON public.product_standards
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Modify products table
ALTER TABLE public.products
    -- Change specification from array to text
    ALTER COLUMN specification TYPE TEXT USING array_to_string(specification, E'\n'),
    -- Drop old array columns
    DROP COLUMN IF EXISTS directives,
    DROP COLUMN IF EXISTS regulations,
    DROP COLUMN IF EXISTS standards;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_directives_product_id ON public.product_directives(product_id);
CREATE INDEX IF NOT EXISTS idx_product_directives_directive_id ON public.product_directives(directive_id);
CREATE INDEX IF NOT EXISTS idx_product_regulations_product_id ON public.product_regulations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_regulations_regulation_id ON public.product_regulations(regulation_id);
CREATE INDEX IF NOT EXISTS idx_product_standards_product_id ON public.product_standards(product_id);
CREATE INDEX IF NOT EXISTS idx_product_standards_standard_id ON public.product_standards(standard_id);