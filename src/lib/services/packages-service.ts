import { supabase } from "@/lib/supabase/client";

export interface Package {
  id: string;
  name: string;
  product_limit: number;
  monthly_price: number;
  annually_price: number;
}

class PackagesService {
  public async getPackages() {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("monthly_price", { ascending: true });

    if (error) throw error;
    return data as Package[];
  }

  public async getPackageById(id: string) {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Package;
  }

  public async updatePackage(id: string, pkg: Partial<Package>) {
    const { data, error } = await supabase
      .from("packages")
      .update(pkg)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Package;
  }

  public async deletePackage(id: string) {
    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) throw error;
  }
}

const packagesService = new PackagesService();

export default packagesService;
