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
  public async getProductQuestionAnswers(userProductId?: string) {
    if (!userProductId) return [];

    const { data, error } = await supabase
      .from("user_product_question_answers")
      .select("*, product_questions(*)")
      .eq("user_product_id", userProductId)
      .is("deleted_at", null);

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async createProductQuestionAnswers(
    userProductId: string,
    questionAnswers: Array<{ question_id: string; answer: boolean }>
  ) {
    const userId = (await supabase.auth.getUser()).data.user?.id;

    const answers = questionAnswers.map((qa) => ({
      user_product_id: userProductId,
      question_id: qa.question_id,
      answer: qa.answer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: userId,
    }));

    const { data, error } = await supabase
      .from("user_product_question_answers")
      .insert(answers)
      .select();

    if (error) throw error;
    return data as ProductQuestionAnswer[];
  }

  public async deleteProductQuestionAnswers(userProductId: string) {
    const { error } = await supabase
      .from("user_product_question_answers")
      .delete()
      .eq("user_product_id", userProductId);

    if (error) throw error;
  }

  public async deleteProductQuestionAnswersByIds(
    userProductId: string,
    questionIds: string[]
  ) {
    const { error } = await supabase
      .from("user_product_question_answers")
      .delete()
      .eq("user_product_id", userProductId)
      .in("question_id", questionIds);

    if (error) throw error;
  }
}

const productQuestionAnswersService = new ProductQuestionAnswersService();

export default productQuestionAnswersService;
