import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";

export interface Manufacturer {
  id: string;
  name: string;
  email: string;
  logo_image_url: string;
  phone: string;
  address: string;
  authorised_signatory_name: string;
  country: string;
  position: string;
  signature_image_url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

class ManufacturersService {
  public async getManufacturers() {
    const { data, error } = await supabase
      .from("manufacturers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Manufacturer[];
  }

  public async getManufacturerById(id: string) {
    const { data, error } = await supabase
      .from("manufacturers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Manufacturer;
  }

  public async updateManufacturer(
    id: string,
    manufacturer: Partial<Manufacturer>
  ) {
    const { data, error } = await supabase
      .from("manufacturers")
      .update({
        ...manufacturer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Manufacturer;
  }

  public async createManufacturer(
    manufacturer: Omit<
      Manufacturer,
      "id" | "created_at" | "updated_at" | "user_id"
    >
  ) {
    const { data, error } = await supabase
      .from("manufacturers")
      .insert({
        ...manufacturer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Manufacturer;
  }

  public async deleteManufacturer(id: string) {
    const manufacturer = await this.getManufacturerById(id);

    // delete manufacturer
    const { error } = await supabase
      .from("manufacturers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // delete manufacturer bucket files
    await storageService.deleteManufacturerFile(manufacturer?.logo_image_url);
    await storageService.deleteManufacturerFile(
      manufacturer?.signature_image_url
    );
  }
}

const manufacturersService = new ManufacturersService();

export default manufacturersService;
