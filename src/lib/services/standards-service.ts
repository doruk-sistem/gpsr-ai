import { supabase } from "@/lib/supabase/client";

export interface Standard {
  id: string;
  ref_no: string;
  edition?: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class StandardsService {
  async getStandards() {
    const { data, error } = await supabase
      .from("standards")
      .select("*")
      .is("deleted_at", null);
    if (error) throw error;
    return data as Standard[];
  }

  async getStandardById(id: string) {
    const { data, error } = await supabase
      .from("standards")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Standard;
  }

  async createStandard(
    standard: Omit<Standard, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("standards")
      .insert([standard])
      .select()
      .single();
    if (error) throw error;
    return data as Standard;
  }

  async updateStandard(id: string, standard: Partial<Standard>) {
    const { data, error } = await supabase
      .from("standards")
      .update(standard)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Standard;
  }

  async deleteStandard(id: string) {
    const { error } = await supabase
      .from("standards")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

const standardsService = new StandardsService();
export default standardsService;
