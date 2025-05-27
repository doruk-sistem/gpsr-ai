import { supabase } from "@/lib/supabase/client";

export interface UserProductUserDirective {
  id: string;
  directive_number: string;
  directive_name: string;
  directive_description: string;
  directive_edition_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_product_id: string;
  user_id: string | null;
  reference_directive_id: number | null;
}

export interface CreateUserProductUserDirectiveRequest {
  directive_number: string;
  directive_name: string;
  directive_description: string;
  directive_edition_date: string;
  user_product_id: string;
  reference_directive_id?: number | null;
}

export interface UpdateUserProductUserDirectiveRequest {
  directive_number?: string;
  directive_name?: string;
  directive_description?: string;
  directive_edition_date?: string;
  reference_directive_id?: number | null;
}

class UserProductUserDirectivesService {
  private table = "user_product_user_directives";

  async getAllByProductId(
    productId: string
  ): Promise<UserProductUserDirective[]> {
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
    input: CreateUserProductUserDirectiveRequest
  ): Promise<UserProductUserDirective> {
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
    input: UpdateUserProductUserDirectiveRequest
  ): Promise<UserProductUserDirective> {
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

const userProductUserDirectivesService = new UserProductUserDirectivesService();
export default userProductUserDirectivesService;
