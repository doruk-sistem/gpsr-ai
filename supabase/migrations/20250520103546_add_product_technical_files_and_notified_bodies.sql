-- Product Technical Files Table
CREATE TABLE IF NOT EXISTS public.product_technical_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL, -- ör: 'ec_eu_doc', 'ukca_doc', 'risk_assessment', 'design_documents', ...
    file_url TEXT, -- if file is uploaded, file url
    not_required BOOLEAN DEFAULT FALSE, -- if checked, true
    not_required_reason TEXT, -- if checked, reason
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,
    UNIQUE(product_id, file_type)
);

-- Product Notified Bodies Table
CREATE TABLE IF NOT EXISTS public.product_notified_bodies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    notified_body_name TEXT NOT NULL,
    notified_body_address TEXT,
    notified_body_number TEXT, -- can be 4 digits
    notified_body_ref_number TEXT,
    additional_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL
);

-- RLS for product_technical_files
ALTER TABLE public.product_technical_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own product technical files"
    ON public.product_technical_files
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert their own product technical files"
    ON public.product_technical_files
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own product technical files"
    ON public.product_technical_files
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete their own product technical files"
    ON public.product_technical_files
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS for product_notified_bodies
ALTER TABLE public.product_notified_bodies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own product notified bodies"
    ON public.product_notified_bodies
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert their own product notified bodies"
    ON public.product_notified_bodies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update their own product notified bodies"
    ON public.product_notified_bodies
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete their own product notified bodies"
    ON public.product_notified_bodies
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_technical_files_product_id ON public.product_technical_files(product_id);
CREATE INDEX IF NOT EXISTS idx_product_notified_bodies_product_id ON public.product_notified_bodies(product_id); 