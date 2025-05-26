import { supabase } from "@/lib/supabase/client";

export interface UserProductUserRegulation {
  id: string;
  regulation_number: string;
  regulation_name: string;
  regulation_description: string | null;
  regulation_edition_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_product_id: string;
  user_id: string | null;
  reference_regulation_id: number | null;
}

export interface CreateUserProductUserRegulationRequest {
  regulation_number: string;
  regulation_name: string;
  regulation_description?: string;
  regulation_edition_date: string;
  user_product_id: string;
  reference_regulation_id?: number | null;
}

export interface UpdateUserProductUserRegulationRequest {
  regulation_number?: string;
  regulation_name?: string;
  regulation_description?: string;
  regulation_edition_date?: string;
  reference_regulation_id?: number | null;
}

class UserProductUserRegulationsService {
  private table = "user_product_user_regulations";

  async getAllByProductId(
    productId: string
  ): Promise<UserProductUserRegulation[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("user_product_id", productId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async create(
    input: CreateUserProductUserRegulationRequest
  ): Promise<UserProductUserRegulation> {
    const { data, error } = await supabase
      .from(this.table)
      .insert([
        {
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    input: UpdateUserProductUserRegulationRequest
  ): Promise<UserProductUserRegulation> {
    const { data, error } = await supabase
      .from(this.table)
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.table).delete().eq("id", id);

    if (error) throw error;
  }
}

const userProductUserRegulationsService =
  new UserProductUserRegulationsService();
export default userProductUserRegulationsService;
