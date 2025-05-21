import { supabase } from "@/lib/supabase/client";

export interface ProductQuestionAnswer {
  id: string;
  product_id: string;
  question_id: string;
  answer: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class ProductQuestionAnswersService {
  public async getProductQuestionAnswers(productId: string) {
    const { data, error } = await supabase
      .from("product_question_answers")
      .select("*, product_questions(*)")
      .eq("product_id", productId)
      .is("deleted_at", null);

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async createProductQuestionAnswers(
    productId: string,
    questionAnswers: Array<{ question_id: string; answer: boolean }>
  ) {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const answers = questionAnswers.map((qa) => ({
      product_id: productId,
      question_id: qa.question_id,
      answer: qa.answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("product_question_answers")
      .insert(answers)
      .select();

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async deleteProductQuestionAnswers(productId: string) {
    const { error } = await supabase
      .from("product_question_answers")
      .delete()
      .eq("product_id", productId);

    if (error) throw error;
  }

  public async deleteProductQuestionAnswersByIds(
    productId: string,
    questionIds: string[]
  ) {
    const { error } = await supabase
      .from("product_question_answers")
      .delete()
      .eq("product_id", productId)
      .in("question_id", questionIds);

    if (error) throw error;
  }
}

const productQuestionAnswersService = new ProductQuestionAnswersService();

export default productQuestionAnswersService;
