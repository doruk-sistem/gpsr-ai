-- Rename products table to user_products
ALTER TABLE public.products RENAME TO user_products;

-- Rename and update product_technical_files
ALTER TABLE public.product_technical_files RENAME TO user_product_technical_files;
ALTER TABLE public.user_product_technical_files DROP CONSTRAINT product_technical_files_product_id_fkey;
ALTER TABLE public.user_product_technical_files RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_technical_files
    ADD CONSTRAINT user_product_technical_files_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Rename and update product_notified_bodies
ALTER TABLE public.product_notified_bodies RENAME TO user_product_notified_bodies;
ALTER TABLE public.user_product_notified_bodies DROP CONSTRAINT product_notified_bodies_product_id_fkey;
ALTER TABLE public.user_product_notified_bodies RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_notified_bodies
    ADD CONSTRAINT user_product_notified_bodies_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Rename and update product_directives
ALTER TABLE public.product_directives RENAME TO user_product_directives;
ALTER TABLE public.user_product_directives DROP CONSTRAINT product_directives_product_id_fkey;
ALTER TABLE public.user_product_directives RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_directives
    ADD CONSTRAINT user_product_directives_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Rename and update product_regulations
ALTER TABLE public.product_regulations RENAME TO user_product_regulations;
ALTER TABLE public.user_product_regulations DROP CONSTRAINT product_regulations_product_id_fkey;
ALTER TABLE public.user_product_regulations RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_regulations
    ADD CONSTRAINT user_product_regulations_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Rename and update product_standards
ALTER TABLE public.product_standards RENAME TO user_product_standards;
ALTER TABLE public.user_product_standards DROP CONSTRAINT product_standards_product_id_fkey;
ALTER TABLE public.user_product_standards RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_standards
    ADD CONSTRAINT user_product_standards_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Drop existing policies for user_products
DROP POLICY IF EXISTS "Users can view their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.user_products;

-- Create new policies for user_products
CREATE POLICY "Users can view their own products" ON public.user_products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON public.user_products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.user_products
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.user_products
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for user_product_technical_files
DROP POLICY IF EXISTS "Users can view their own technical files" ON public.user_product_technical_files;
DROP POLICY IF EXISTS "Users can insert their own technical files" ON public.user_product_technical_files;
DROP POLICY IF EXISTS "Users can update their own technical files" ON public.user_product_technical_files;
DROP POLICY IF EXISTS "Users can delete their own technical files" ON public.user_product_technical_files;

-- Create new policies for user_product_technical_files
CREATE POLICY "Users can view their own technical files" ON public.user_product_technical_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technical files" ON public.user_product_technical_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own technical files" ON public.user_product_technical_files
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own technical files" ON public.user_product_technical_files
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for user_product_notified_bodies
DROP POLICY IF EXISTS "Users can view their own notified bodies" ON public.user_product_notified_bodies;
DROP POLICY IF EXISTS "Users can insert their own notified bodies" ON public.user_product_notified_bodies;
DROP POLICY IF EXISTS "Users can update their own notified bodies" ON public.user_product_notified_bodies;
DROP POLICY IF EXISTS "Users can delete their own notified bodies" ON public.user_product_notified_bodies;

-- Create new policies for user_product_notified_bodies
CREATE POLICY "Users can view their own notified bodies" ON public.user_product_notified_bodies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notified bodies" ON public.user_product_notified_bodies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notified bodies" ON public.user_product_notified_bodies
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notified bodies" ON public.user_product_notified_bodies
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for user_product_directives
DROP POLICY IF EXISTS "Users can view their own directives" ON public.user_product_directives;
DROP POLICY IF EXISTS "Users can insert their own directives" ON public.user_product_directives;
DROP POLICY IF EXISTS "Users can update their own directives" ON public.user_product_directives;
DROP POLICY IF EXISTS "Users can delete their own directives" ON public.user_product_directives;

-- Create new policies for user_product_directives
CREATE POLICY "Users can view their own directives" ON public.user_product_directives
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own directives" ON public.user_product_directives
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own directives" ON public.user_product_directives
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own directives" ON public.user_product_directives
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for user_product_regulations
DROP POLICY IF EXISTS "Users can view their own regulations" ON public.user_product_regulations;
DROP POLICY IF EXISTS "Users can insert their own regulations" ON public.user_product_regulations;
DROP POLICY IF EXISTS "Users can update their own regulations" ON public.user_product_regulations;
DROP POLICY IF EXISTS "Users can delete their own regulations" ON public.user_product_regulations;

-- Create new policies for user_product_regulations
CREATE POLICY "Users can view their own regulations" ON public.user_product_regulations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own regulations" ON public.user_product_regulations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own regulations" ON public.user_product_regulations
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own regulations" ON public.user_product_regulations
    FOR DELETE USING (auth.uid() = user_id);

-- Drop existing policies for user_product_standards
DROP POLICY IF EXISTS "Users can view their own standards" ON public.user_product_standards;
DROP POLICY IF EXISTS "Users can insert their own standards" ON public.user_product_standards;
DROP POLICY IF EXISTS "Users can update their own standards" ON public.user_product_standards;
DROP POLICY IF EXISTS "Users can delete their own standards" ON public.user_product_standards;

-- Create new policies for user_product_standards
CREATE POLICY "Users can view their own standards" ON public.user_product_standards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own standards" ON public.user_product_standards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own standards" ON public.user_product_standards
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own standards" ON public.user_product_standards
    FOR DELETE USING (auth.uid() = user_id);

-- Update indexes
ALTER INDEX IF EXISTS products_pkey RENAME TO user_products_pkey;
ALTER INDEX IF EXISTS products_user_id_idx RENAME TO user_products_user_id_idx;

-- Rename other indexes
ALTER INDEX IF EXISTS product_technical_files_pkey RENAME TO user_product_technical_files_pkey;
ALTER INDEX IF EXISTS product_notified_bodies_pkey RENAME TO user_product_notified_bodies_pkey;
ALTER INDEX IF EXISTS product_directives_pkey RENAME TO user_product_directives_pkey;
ALTER INDEX IF EXISTS product_regulations_pkey RENAME TO user_product_regulations_pkey;
ALTER INDEX IF EXISTS product_standards_pkey RENAME TO user_product_standards_pkey;

-- Rename other indexes
ALTER INDEX IF EXISTS idx_product_technical_files_product_id RENAME TO idx_user_product_technical_files_user_product_id;
ALTER INDEX IF EXISTS idx_product_notified_bodies_product_id RENAME TO idx_user_product_notified_bodies_user_product_id;
ALTER INDEX IF EXISTS idx_product_directives_product_id RENAME TO idx_user_product_directives_user_product_id;
ALTER INDEX IF EXISTS idx_product_regulations_product_id RENAME TO idx_user_product_regulations_user_product_id;
ALTER INDEX IF EXISTS idx_product_standards_product_id RENAME TO idx_user_product_standards_user_product_id; 