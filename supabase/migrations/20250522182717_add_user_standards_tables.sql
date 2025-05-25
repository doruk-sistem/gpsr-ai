-- Create set_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user standards table
CREATE TABLE IF NOT EXISTS public.user_product_user_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_no TEXT NOT NULL,
    edition_date TEXT,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_product_id UUID REFERENCES public.user_products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_product_user_standards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own standards"
    ON public.user_product_user_standards
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own standards"
    ON public.user_product_user_standards
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own standards"
    ON public.user_product_user_standards
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own standards"
    ON public.user_product_user_standards
    FOR DELETE
    USING (auth.uid() = user_id);
