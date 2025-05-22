import { supabase } from "@/lib/supabase/client";

export interface Regulation {
  id: number;
  regulation_number: string;
  regulation_name: string;
  regulation_description?: string;
  regulation_edition_date?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class RegulationsService {
  async getRegulations() {
    const { data, error } = await supabase
      .from("regulations")
      .select("*")
      .is("deleted_at", null);
    if (error) throw error;
    return data as Regulation[];
  }

  async getRegulationById(id: number) {
    const { data, error } = await supabase
      .from("regulations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Regulation;
  }

  async createRegulation(
    regulation: Omit<Regulation, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("regulations")
      .insert([regulation])
      .select()
      .single();
    if (error) throw error;
    return data as Regulation;
  }

  async updateRegulation(id: number, regulation: Partial<Regulation>) {
    const { data, error } = await supabase
      .from("regulations")
      .update(regulation)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Regulation;
  }

  async deleteRegulation(id: number) {
    const { error } = await supabase
      .from("regulations")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

const regulationsService = new RegulationsService();
export default regulationsService;
