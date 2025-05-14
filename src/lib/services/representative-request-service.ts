import { supabase } from "@/lib/supabase/client";
import storageService from "./storage-service";
import { RepresentativeRegion } from "./representative-address-service";
import {
  formatSelectQuery,
  FormatSelectQuerySelectObject,
} from "../utils/from-select-query";

export type BusinessRole = "manufacturer" | "importer" | "distributor";
export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Representative {
  id: string;
  user_id: string;
  region: RepresentativeRegion;
  // Company details
  company_name: string;
  company_number: string;
  vat_number?: string;
  street_address: string;
  city: string;
  postal_code: string;
  country: string;
  // Contact info
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  contact_position: string;
  // Additional info
  website_url?: string;
  business_role: BusinessRole;
  // Product details
  product_category: string;
  product_information: string;
  // Compliance details
  ce_ukca_marking: string;
  technical_file_ready: string;
  required_tests_conducted: string;
  test_reports_available: string;
  test_reports_file_url?: string;
  // Confirmations
  confirm_accuracy: boolean;
  confirm_responsibility: boolean;
  confirm_terms: boolean;
  // Status
  status: RequestStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RepresentativeRequest {
  select?: FormatSelectQuerySelectObject<keyof Representative>;
}

export type CreateRepresentativeRequestInput = Omit<
  Representative,
  "id" | "user_id" | "status" | "admin_notes" | "created_at" | "updated_at"
>;

class RepresentativeRequestService {
  public async getRequestsByUser({ select }: RepresentativeRequest = {}) {
    const selectQuery = formatSelectQuery<keyof Representative>(select);

    const { data, error } = await supabase
      .from("authorised_representative_requests")
      .select(selectQuery)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as unknown as Representative[];
  }

  public async getRequestById(id: string) {
    const { data, error } = await supabase
      .from("authorised_representative_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Representative;
  }

  public async createRequest(request: CreateRepresentativeRequestInput) {
    const { data, error } = await supabase
      .from("authorised_representative_requests")
      .insert({
        ...request,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Representative;
  }

  public async updateRequest(id: string, request: Partial<Representative>) {
    const { data, error } = await supabase
      .from("authorised_representative_requests")
      .update({
        ...request,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Representative;
  }

  public async cancelRequest(id: string) {
    const { data, error } = await supabase
      .from("authorised_representative_requests")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Representative;
  }

  public async uploadTestReportFile(file: File, userId: string) {
    return await storageService.uploadRepresentativeAddressFile(
      file,
      userId,
      `test-report-${Date.now()}`
    );
  }
}

const representativeRequestService = new RepresentativeRequestService();

export default representativeRequestService;
