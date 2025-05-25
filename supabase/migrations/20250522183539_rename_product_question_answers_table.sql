-- Rename product_question_answers table to user_product_question_answers
ALTER TABLE public.product_question_answers RENAME TO user_product_question_answers;

-- Update foreign key references
ALTER TABLE public.user_product_question_answers 
    DROP CONSTRAINT product_question_answers_product_id_fkey;
ALTER TABLE public.user_product_question_answers 
    RENAME COLUMN product_id TO user_product_id;

ALTER TABLE public.user_product_question_answers
    ADD CONSTRAINT user_product_question_answers_user_product_id_fkey 
    FOREIGN KEY (user_product_id) 
    REFERENCES public.user_products(id) ON DELETE CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own question answers" ON public.user_product_question_answers;
DROP POLICY IF EXISTS "Users can insert their own question answers" ON public.user_product_question_answers;
DROP POLICY IF EXISTS "Users can update their own question answers" ON public.user_product_question_answers;
DROP POLICY IF EXISTS "Users can delete their own question answers" ON public.user_product_question_answers;

-- Create new policies
CREATE POLICY "Users can view their own question answers" ON public.user_product_question_answers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question answers" ON public.user_product_question_answers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question answers" ON public.user_product_question_answers
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own question answers" ON public.user_product_question_answers
    FOR DELETE USING (auth.uid() = user_id);

-- Update indexes
ALTER INDEX IF EXISTS product_question_answers_pkey RENAME TO user_product_question_answers_pkey;
ALTER INDEX IF EXISTS idx_product_question_answers_product_id RENAME TO idx_user_product_question_answers_user_product_id;
