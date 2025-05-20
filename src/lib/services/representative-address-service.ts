import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";

export type RepresentativeRegion = "eu" | "uk";

export interface RepresentativeAddress {
  id: string;
  user_id: string;
  region: RepresentativeRegion;
  company_name: string;
  company_address: string;
  company_logo_url: string | null;
  country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class RepresentativeAddressService {
  public async getAddressesByUser(region?: RepresentativeRegion) {
    let query = supabase
      .from("authorised_representative_addresses")
      .select("*")
      .order("created_at", { ascending: false });

    if (region) {
      query = query.eq("region", region);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as RepresentativeAddress[];
  }

  public async getAddressByRegion(region: RepresentativeRegion) {
    const { data, error } = await supabase
      .from("authorised_representative_addresses")
      .select("*")
      .eq("region", region)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned - this is fine for this method
        return null;
      }
      throw error;
    }
    return data as RepresentativeAddress;
  }

  public async getAddressById(id: string) {
    const { data, error } = await supabase
      .from("authorised_representative_addresses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as RepresentativeAddress;
  }

  public async updateAddress(
    id: string,
    address: Partial<RepresentativeAddress>
  ) {
    const { data, error } = await supabase
      .from("authorised_representative_addresses")
      .update({
        ...address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as RepresentativeAddress;
  }

  public async createAddress(
    address: Omit<
      RepresentativeAddress,
      "id" | "user_id" | "created_at" | "updated_at" | "is_active"
    >
  ) {
    // Eğer aynı bölge için adres varsa, onu deaktif et
    const existingAddress = await this.getAddressByRegion(address.region);
    if (existingAddress) {
      await this.updateAddress(existingAddress.id, { is_active: false });
    }

    const { data, error } = await supabase
      .from("authorised_representative_addresses")
      .insert({
        ...address,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as RepresentativeAddress;
  }

  public async deleteAddress(id: string) {
    const address = await this.getAddressById(id);

    // delete address
    const { error } = await supabase
      .from("authorised_representative_addresses")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // delete logo if exists
    if (address?.company_logo_url) {
      await storageService.deleteRepresentativeAddressFile(
        address.company_logo_url
      );
    }
  }
}

const representativeAddressService = new RepresentativeAddressService();

export default representativeAddressService;
