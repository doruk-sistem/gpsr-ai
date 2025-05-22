import { supabase } from "@/lib/supabase/client";

export interface Directive {
  id: number;
  directive_number: string;
  directive_name: string;
  directive_description?: string;
  directive_edition_date?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user_id?: string | null;
}

class DirectivesService {
  async getDirectives() {
    const { data, error } = await supabase
      .from("directives")
      .select("*")
      .is("deleted_at", null);
    if (error) throw error;
    return data as Directive[];
  }

  async getDirectiveById(id: number) {
    const { data, error } = await supabase
      .from("directives")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Directive;
  }

  async createDirective(
    directive: Omit<Directive, "id" | "created_at" | "updated_at">
  ) {
    const { data, error } = await supabase
      .from("directives")
      .insert([directive])
      .select()
      .single();
    if (error) throw error;
    return data as Directive;
  }

  async updateDirective(id: number, directive: Partial<Directive>) {
    const { data, error } = await supabase
      .from("directives")
      .update(directive)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Directive;
  }

  async deleteDirective(id: number) {
    const { error } = await supabase
      .from("directives")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

const directivesService = new DirectivesService();
export default directivesService;
