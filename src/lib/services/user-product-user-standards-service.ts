import { supabase } from "@/lib/supabase/client";

export interface UserProductUserStandard {
  id: string;
  ref_no: string;
  edition_date: string | null;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_product_id: string;
  user_id: string | null;
  reference_standard_id: string | null;
}

export interface CreateUserProductUserStandardRequest {
  ref_no: string;
  edition_date?: string;
  title: string;
  user_product_id: string;
  reference_standard_id?: string | null;
  user_id: string;
}

export interface UpdateUserProductUserStandardRequest {
  ref_no?: string;
  edition_date?: string;
  title?: string;
  reference_standard_id?: string | null;
  user_id: string;
}

class UserProductUserStandardsService {
  private table = "user_product_user_standards";

  async getAllByProductId(
    productId: string
  ): Promise<UserProductUserStandard[]> {
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
    input: CreateUserProductUserStandardRequest
  ): Promise<UserProductUserStandard> {
    const { data, error } = await supabase
      .from(this.table)
      .insert([
        {
          ...input,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    id: string,
    input: UpdateUserProductUserStandardRequest
  ): Promise<UserProductUserStandard> {
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

const userProductUserStandardsService = new UserProductUserStandardsService();
export default userProductUserStandardsService;
